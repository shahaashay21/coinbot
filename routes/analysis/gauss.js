var _ = require('lodash');
var DB = require('../../models/db');
var logger = require('../../routes/helper/winston');

var gauss = require('gauss');
var ltc = require('../helper/ltc');

function ltcPrediction(){

    ltc.getLtcUsdValue(function(err, ltcValue) {
        if (err) {
            logger.info("Error in getting LTC value: " + err);
        } else {
            if (ltcValue.asks && ltcValue.asks[0] && ltcValue.asks[0][0]) {
                ltcGaussPrediction(1, 5, true, ltcValue.asks[0][0], function(){});
                ltcGaussPrediction(1, 10, true, ltcValue.asks[0][0], function(){});
                ltcGaussPrediction(1, 20, true, ltcValue.asks[0][0], function(){});
                ltcGaussPrediction(1, 30, true, ltcValue.asks[0][0], function(){});
                ltcGaussPrediction(1, 60, true, ltcValue.asks[0][0], function(){});

                ltcGaussPrediction(5, 5, true, ltcValue.asks[0][0], function(){});
                ltcGaussPrediction(5, 10, true, ltcValue.asks[0][0], function(){});
                ltcGaussPrediction(5, 20, true, ltcValue.asks[0][0], function(){});
                ltcGaussPrediction(5, 30, true, ltcValue.asks[0][0], function(){});
                ltcGaussPrediction(5, 60, true, ltcValue.asks[0][0], function(){});
            }
        }
    });
}

function ltcGaussPrediction (predicted_time, data_size, shouldSave, currentPrice, callback) {
    DB.sequelize.query("SELECT createdAt, ask from ltc order by createdAt desc limit " + data_size, {type: DB.sequelize.QueryTypes.SELECT}).then(res => {

        var priceData = _.map(res, 'ask');
        priceData = priceData.reverse();

        var numbers = new gauss.Vector(priceData);
        // logger.info("Current GAUSS "+ data_size +" prediction value for " + predicted_time +" time: " + numbers[0]);

        if(shouldSave) {
            savePredictionDB(numbers[0], "LTC-USD", "gauss", data_size, predicted_time, currentPrice);
        }
        callback(null, numbers[0]);

    }).catch(function (err) {
        logger.info("Error getting ltc prediction price " + err);
    });
};

function savePredictionDB(predictedValue, product, algo, data_size, predicted_time, currentPrice){
    var difference = Math.abs(currentPrice - predictedValue);

    var prediction = new DB.Prediction();
    prediction.price = predictedValue;
    prediction.product = product;
    prediction.current_price = currentPrice;
    prediction.difference = difference;
    prediction.algo = algo;
    prediction.data_size = data_size;
    prediction.predicted_time = predicted_time;
    prediction.prediction = 0;

    prediction.save(function (saved) {
        // logger.info("GAUSS Prediction saved in DB");
    }).catch(function (err) {
        logger.info("Error saving prediction price " + err);
    });
}


// function ltcTempPrediction () {
//     DB.sequelize.query("SELECT createdAt, ask from ltc order by createdAt desc limit 10", {type: DB.sequelize.QueryTypes.SELECT}).then(res => {
//
//         var priceData = _.map(res, 'ask');
//         priceData = priceData.reverse();
//         logger.info(JSON.stringify(priceData));
//
//         var numbers = new gauss.Vector(priceData);
//         logger.info("Temporary prediction value: " + numbers[0]);
//
//     }).catch(function (err) {
//         logger.info("Error getting ltc prediction price " + err);
//     });
// };

exports.ltcPrediction = ltcPrediction;
// exports.ltcTempPrediction = ltcTempPrediction;