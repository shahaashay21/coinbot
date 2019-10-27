var _ = require('lodash');
var DB = require('../../models/db');
var logger = require('../../routes/helper/winston');

const LTC = require('../helper/ltc');

function checkPrediction (){
    DB.sequelize.query("SELECT id, price, prediction, algo  FROM prediction where createdAt between date_sub(now(), interval 150 minute) and now() order by createdAt", {type: DB.sequelize.QueryTypes.SELECT}).then(res => {

        LTC.getLtcUsdValue(function (err, response) {
            if(err){
                logger.info("Error in getting LTC value: " + err);
            }else {
                if(response.bids && response.bids[0] && response.bids[0][0]) {

                    var allPredictedPrices = _.map(res, 'price');
                    // logger.info("Current price: " + response.asks[0][0] + " and predicted prices: " + JSON.stringify(allPredictedPrices));
                    // logger.info("Current price: " + response.asks[0][0]);


                    _.map(res, checkAndUpdate);
                    function checkAndUpdate(predictedPrice) {
                        if (predictedPrice.prediction == 0){
                            if (Math.abs(predictedPrice.price - response.asks[0][0]) < 0.15) {
                                DB.sequelize.query("UPDATE prediction set prediction = 1 where id = " + predictedPrice.id).spread((results, metadata) => {
                                    // logger.info(predictedPrice.algo + " PREDICTION " + predictedPrice.price + " SUCCESSFUL");
                                }).catch(function (err) {
                                    logger.info("Error in updating predicted price: " + err);
                                })
                            }
                        }
                    }
                }
            }
        });
    }).catch(function (err){
        logger.info("Error in prediction checking " + err);
    })
}

exports.checkPrediction = checkPrediction;