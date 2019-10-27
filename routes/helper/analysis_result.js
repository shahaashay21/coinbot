var _ = require("lodash");
var logger = require('./winston');
var DB = require('../../models/db');

const ALGO = ['gauss','regression','linear regression'];
const DATA_SIZE = [5, 10, 20, 30, 60];
const PREDICTED_TIME = [1, 5];
const PRODUCT = ['LTC-USD'];

function updateResult() {
    _.map(ALGO, getAlgo);

    function getAlgo(algo_name) {
        // logger.info(algo_name);
        _.map(DATA_SIZE, getDataSize);

        function getDataSize(data_size) {
            // logger.info(data_size);
            _.map(PREDICTED_TIME, getPredictedTime);

            function getPredictedTime(predicted_time) {
                _.map(PRODUCT, getProductName);

                function getProductName(product_name) {

                    var countTotalPredictionQuery = "SELECT count(*) as count FROM prediction where algo = '" + algo_name + "' and createdAt < date_sub(now(), interval 30 minute) and data_size=" + data_size + " and predicted_time=" + predicted_time + " and product='" + product_name + "'";
                    DB.sequelize.query(countTotalPredictionQuery, {type: DB.sequelize.QueryTypes.SELECT}).then(noOfPrediction => {

                        var totalPrectionValue = noOfPrediction[0].count;
                        // logger.info(JSON.stringify(totalPrectionValue + " for " + algo_name + " with data_size: " + data_size + " and time: " + predicted_time));
                        if(totalPrectionValue){

                            var countSuccessPredictionQuery = "SELECT count(*) as count FROM prediction where algo = '" + algo_name + "' and createdAt < date_sub(now(), interval 30 minute) and data_size=" + data_size + " and predicted_time=" + predicted_time + " and product='" + product_name + "' and prediction=1";
                            DB.sequelize.query(countSuccessPredictionQuery, {type: DB.sequelize.QueryTypes.SELECT}).then(noOfSuccessPrediction => {

                                var successPrectionValue = noOfSuccessPrediction[0].count;
                                if(successPrectionValue){
                                    var percentage = parseFloat((successPrectionValue / totalPrectionValue) * 100).toFixed(2);
                                    // logger.info(percentage);
                                    var whereClause = {
                                        algo: algo_name,
                                        data_size: data_size,
                                        predicted_time: predicted_time,
                                        product: product_name
                                    }
                                    DB.Analysis.findOne({where: whereClause}).then(found => {
                                        if(found){
                                            found.update({
                                                success_rate: percentage,
                                                total_prediction: totalPrectionValue,
                                                success_prediction: successPrectionValue
                                            });
                                        }else{
                                            whereClause.success_rate = percentage;
                                            whereClause.total_prediction = totalPrectionValue;
                                            whereClause.success_prediction = successPrectionValue;
                                            DB.Analysis.build(whereClause).save().catch(error => {
                                               logger.error("Error in saving pecentage analysis for " + algo_name + " "+ product_name + " "+ data_size + " "+ predicted_time + " " + error);
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        }
    }
}

exports.updateResult = updateResult;