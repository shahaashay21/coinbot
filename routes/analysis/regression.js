var _ = require('lodash');
var DB = require('../../models/db');
var logger = require('../../routes/helper/winston');
var ss = require('simple-statistics');
var regression = require('regression');
var ltc = require('../helper/ltc');

function ltcPrediction(){
    ltc.getLtcUsdValue(function(err, ltcValue) {
        if (err) {
            logger.info("Error in getting LTC value: " + err);
        } else {
            if (ltcValue.asks && ltcValue.asks[0] && ltcValue.asks[0][0]) {
                ltcSSPrediction(1, 5, true, ltcValue.asks[0][0], function(){});
                ltcSSPrediction(1, 10, true, ltcValue.asks[0][0], function(){});
                ltcSSPrediction(1, 20, true, ltcValue.asks[0][0], function(){});
                ltcSSPrediction(1, 30, true, ltcValue.asks[0][0], function(){});
                ltcSSPrediction(1, 60, true, ltcValue.asks[0][0], function(){});

                ltcSSPrediction(5, 5, true, ltcValue.asks[0][0], function(){});
                ltcSSPrediction(5, 10, true, ltcValue.asks[0][0], function(){});
                ltcSSPrediction(5, 20, true, ltcValue.asks[0][0], function(){});
                ltcSSPrediction(5, 30, true, ltcValue.asks[0][0], function(){});
                ltcSSPrediction(5, 60, true, ltcValue.asks[0][0], function(){});

                ltcLinearRegressionPrediction(1, 5, true, ltcValue.asks[0][0], function(){});
                ltcLinearRegressionPrediction(1, 10, true, ltcValue.asks[0][0], function(){});
                ltcLinearRegressionPrediction(1, 20, true, ltcValue.asks[0][0], function(){});
                ltcLinearRegressionPrediction(1, 30, true, ltcValue.asks[0][0], function(){});
                ltcLinearRegressionPrediction(1, 60, true, ltcValue.asks[0][0], function(){});

                ltcLinearRegressionPrediction(5, 5, true, ltcValue.asks[0][0], function(){});
                ltcLinearRegressionPrediction(5, 10, true, ltcValue.asks[0][0], function(){});
                ltcLinearRegressionPrediction(5, 20, true, ltcValue.asks[0][0], function(){});
                ltcLinearRegressionPrediction(5, 30, true, ltcValue.asks[0][0], function(){});
                ltcLinearRegressionPrediction(5, 60, true, ltcValue.asks[0][0], function(){});

                //WITH ORDER 1
                // ltcPolynomialRegressionPrediction(1, 5, 1);
                // ltcPolynomialRegressionPrediction(1, 10, 1);
                // ltcPolynomialRegressionPrediction(1, 20, 1);
                // ltcPolynomialRegressionPrediction(1, 30, 1);
                // ltcPolynomialRegressionPrediction(1, 60, 1);
                //
                // ltcPolynomialRegressionPrediction(5, 5, 1);
                // ltcPolynomialRegressionPrediction(5, 10, 1);
                // ltcPolynomialRegressionPrediction(5, 20, 1);
                // ltcPolynomialRegressionPrediction(5, 30, 1);
                // ltcPolynomialRegressionPrediction(5, 60, 1);
                //
                // //WITH ORDER 2
                // ltcPolynomialRegressionPrediction(1, 5, 2);
                // ltcPolynomialRegressionPrediction(1, 10, 2);
                // ltcPolynomialRegressionPrediction(1, 20, 2);
                // ltcPolynomialRegressionPrediction(1, 30, 2);
                // ltcPolynomialRegressionPrediction(1, 60, 2);
                //
                // ltcPolynomialRegressionPrediction(5, 5, 2);
                // ltcPolynomialRegressionPrediction(5, 10, 2);
                // ltcPolynomialRegressionPrediction(5, 20, 2);
                // ltcPolynomialRegressionPrediction(5, 30, 2);
                // ltcPolynomialRegressionPrediction(5, 60, 2);
            }
        }
    });

}

function ltcSSPrediction (predicted_time, data_size, shouldSave, currentPrice, callback){
    DB.sequelize.query("SELECT createdAt, ask, id from ltc order by createdAt desc limit " + data_size, {type: DB.sequelize.QueryTypes.SELECT}).then(res => {
        function getData(number) {
            return [parseFloat(number.id), parseFloat(number.ask)];
        }

        var priceData = _.map(res, getData);
        priceData = priceData.reverse();
        // logger.info(JSON.stringify(priceData));

        var l = ss.linearRegression(priceData);
        var predictedValue = (l.m*(res[0].id+predicted_time))+l.b;
        predictedValue = predictedValue.toFixed(2);

        // logger.info("Current SS "+ data_size +" REGRESSION prediction value for " + predicted_time +" time: " + predictedValue);

        if(shouldSave) {
            savePredictionDB(predictedValue, "LTC-USD", "regression", data_size, predicted_time, currentPrice);
        }
        callback(null, predictedValue);
    });
}

function ltcLinearRegressionPrediction (predicted_time, data_size, shouldSave, currentPrice, callback){
    DB.sequelize.query("SELECT createdAt, ask, id from ltc order by createdAt desc limit " + data_size, {type: DB.sequelize.QueryTypes.SELECT}).then(res => {
        function getData(number) {
            return [number.id, parseFloat(number.ask)];
        }

        var priceData = _.map(res, getData);
        priceData = priceData.reverse();

        const result = regression.linear(priceData);
        var predictedValue = (result.equation[0]*((parseInt(res[0].id) + predicted_time)))+result.equation[1];
        predictedValue = parseFloat(predictedValue).toFixed(2);

        // logger.info("Current LINEAR REGRESSION "+ data_size +" prediction value for " + predicted_time +" time: " + predictedValue);

        if(shouldSave) {
            savePredictionDB(predictedValue, "LTC-USD", "linear regression", data_size, predicted_time, currentPrice);
        }
        callback(null, predictedValue);

    });
}

function ltcPolynomialRegressionPrediction (predicted_time, data_size, order, shouldSave, currentPrice, callback){
    DB.sequelize.query("SELECT createdAt, ask, id from ltc order by createdAt desc limit " + data_size, {type: DB.sequelize.QueryTypes.SELECT}).then(res => {
        function getData(number) {
            return [number.id, parseFloat(number.ask)];
        }

        var priceData = _.map(res, getData);
        priceData = priceData.reverse();

        const result = regression.polynomial(priceData, {order: order});
        var predictedValue = (result.equation[0]*((parseInt(res[0].id) + predicted_time)))+result.equation[1];
        predictedValue = parseFloat(predictedValue).toFixed(2);

        // logger.info("Current POLYNOMIAL REGRESSION "+ data_size +" prediction value for " + predicted_time +" time: " + predictedValue);

        var algoName = "polynomial " + order + " regression";

        if(shouldSave) {
            savePredictionDB(predictedValue, "LTC-USD", algoName, data_size, predicted_time, currentPrice);
        }
        callback(null, predictedValue);

    });
}

function savePredictionDB(predictedValue, product, algo, data_size, predicted_time, currentPrice){
    var difference = Math.abs(currentPrice - predictedValue);

    var prediction = new DB.Prediction();
    prediction.price = predictedValue;
    prediction.current_price = currentPrice;
    prediction.difference = difference;
    prediction.product = product;
    prediction.algo = algo;
    prediction.data_size = data_size;
    prediction.predicted_time = predicted_time;
    prediction.prediction = 0;

    prediction.save(function (saved) {
        // logger.info("Prediction saved in DB");
    }).catch(function (err){
        logger.info("Error saving prediction price " + err);
    });
}

exports.ltcPrediction = ltcPrediction;
exports.ltcPolynomialRegressionPrediction = ltcPolynomialRegressionPrediction;
exports.ltcLinearRegressionPrediction = ltcLinearRegressionPrediction;