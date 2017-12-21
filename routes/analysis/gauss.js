var _ = require('lodash');
var DB = require('../../models/db');
var logger = require('../../routes/helper/winston');

var gauss = require('gauss');
const LTC = require('../helper/ltc');

function ltcPrediction () {
    DB.sequelize.query("SELECT createdAt, ask from ltc order by createdAt desc limit 300", {type: DB.sequelize.QueryTypes.SELECT}).then(res => {

        var priceData = _.map(res, 'ask');
        priceData = priceData.reverse();

        var numbers = new gauss.Vector(priceData);
        logger.info("Current prediction value: " + numbers[0]);

        var prediction = new DB.Prediction();
        prediction.price = numbers[0];
        prediction.product = "LTC-USD";
        prediction.prediction = 0;

        prediction.save(function (saved) {
            logger.info("Prediction saved in DB");
        }).catch(function (err){
            logger.info("Error saving prediction price " + err);
        })

    }).catch(function (err) {
        logger.info("Error getting ltc prediction price " + err);
    });
};

function checkPrediction (){
    DB.sequelize.query("SELECT id, price, prediction from prediction order by createdAt desc limit 4", {type: DB.sequelize.QueryTypes.SELECT}).then(res => {

        LTC.getLtcUsdValue(function (err, response) {
            if(err){
                logger.info("Error in getting LTC value: " + err);
            }else {
                response = JSON.parse(response);
                if(response.bids && response.bids[0] && response.bids[0][0]) {
                    // if(Math.abs(res[0].price - response.asks[0][0]) < 0.3){
                    //     DB.sequelize.query("UPDATE prediction set prediction = 1 where id = " + res[0].id).spread((results, metadata) => {
                    //         logger.info("PREDICTION SUCCESSFUL");
                    //     }).catch(function (err) {
                    //         logger.info("Error in updating predicted price: " + err);
                    //     })
                    // }

                    var allPredictedPrices = _.map(res, 'price');
                    logger.info("Current price: " + response.asks[0][0] + " and predicted prices: " + JSON.stringify(allPredictedPrices));


                    _.map(res, checkAndUpdate);
                    function checkAndUpdate(predictedPrice) {
                        if (predictedPrice.prediction == 0){
                            if (Math.abs(predictedPrice.price - response.asks[0][0]) < 0.4) {
                                DB.sequelize.query("UPDATE prediction set prediction = 1 where id = " + predictedPrice.id).spread((results, metadata) => {
                                    logger.info("PREDICTION " + predictedPrice.price + " SUCCESSFUL");
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

exports.ltcPrediction = ltcPrediction;
exports.checkPrediction = checkPrediction;