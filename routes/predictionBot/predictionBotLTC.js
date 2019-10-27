var logger = require("../helper/winston");
const Gdax = require('gdax');
var authedClient = new Gdax.AuthenticatedClient(process.env.API_KEY, process.env.API_SECRET, process.env.PASSPHRASE, process.env.APIURI);
var exercise = require('../helper/exercise');
var ltcPrediction = require("../analysis/regression");
var LTC = require("../helper/ltc");
var DB = require("../../models/db");

var canBuy = true;
var canSell = true;

var marginToExercise = 0.21;
var predictedValue;
const investPrice = 150;
const code = "aashay";
var currentTransactionId;
var transactionMargin = 0.04;
var order;

function smartBotLTC (){
    logger.info("TRANSACTION STARTED");
    var checkLtcPrice = setInterval(function () {
        try {
            LTC.getLtcUsdValue(function (err, response) {
                if (err) {
                    logger.error("Error in getting LTC price");
                } else {
                    var price = parseFloat(response.bids[0][0]);
                    ltcPrediction.ltcLinearRegressionPrediction(1, 5, false, price, function (err, returnValue) {
                        predictedValue = parseFloat(returnValue).toFixed(2);

                        logger.info("Predicted Price: " + predictedValue + " against current: " + price);
                        //Check if difference.... It should be more than 25 cents
                        if (parseFloat(Math.abs(predictedValue - price)).toFixed(2) > marginToExercise) {
                            logger.info("Enough margin: " + parseFloat(Math.abs(predictedValue - price)).toFixed(2) + " to process");
                            // Check predicted price should be more and canBuy true
                            if (predictedValue > price && canBuy) {
                                canBuy = false;

                                price = price - transactionMargin;
                                price = price.toFixed(2);
                                var investmentSize = (investPrice / (price)).toFixed(5);
                                logger.info("******* STARTING BUY CALL *******");
                                logger.info("BUY CALL @: " + predictedValue + " against current: " + price);
                                logger.info("Investment Size: " + investmentSize);
                                var product_id = "LTC-USD";

                                // BUY CALL FUNCTION AND SET TRANSACTION ID
                                buyCall(price, investmentSize, product_id, code, function (err, txID) {
                                    if (!err) {
                                        // Check transaction status
                                        checkTransaction("buy", true , txID, function (err, transactionStatus) {
                                            if (transactionStatus == true) {
                                                // CALL SELL FUNCTION
                                                sellCall(predictedValue, investmentSize, product_id, code, function (err, txID) {
                                                    // Check transaction status
                                                    checkTransaction("sell", false, txID, function (err, transactionStatus) {
                                                        if (transactionStatus == true) {
                                                            canBuy = true;
                                                            logger.info("******* BUY SELL TRANSACTION DONE ----- BUY @ "+ price +" and SELL @ " + predictedValue + " ----- *******");
                                                        } else {
                                                            logger.info("SHOULD'T COME HERE");
                                                        }
                                                    });
                                                })
                                            }
                                        });
                                    } else {
                                        canBuy = true;
                                    }
                                });
                            } else if (predictedValue < price && canSell) {
                                canSell = false;

                                price = price + transactionMargin;
                                price = price.toFixed(2);
                                var investmentSize = (investPrice / (price)).toFixed(5);
                                logger.info("******* STARTING SELL CALL *******");
                                logger.info("SELL CALL @: " + predictedValue + " against current: " + price);
                                logger.info("Sell Size: " + investmentSize);
                                var product_id = "LTC-USD";

                                // SELL CALL FUNCTION AND SET TRANSACTION ID
                                sellCall(price, investmentSize, product_id, code, function (err, txID) {
                                    if (!err) {
                                        // Check transaction status
                                        checkTransaction("sell", true, txID, function (err, transactionStatus) {
                                            if (transactionStatus == true) {
                                                // CALL BUY FUNCTION
                                                buyCall(predictedValue, investmentSize, product_id, code, function (err, txID) {
                                                    // Check transaction status
                                                    checkTransaction("buy", false, txID, function (err, transactionStatus) {
                                                        if (transactionStatus == true) {
                                                            canSell = true;
                                                            logger.info("******* SELL BUY TRANSACTION DONE ----- SELL @ "+ price +" and BUY @ " + predictedValue + " ----- *******");
                                                        } else {
                                                            logger.info("SHOULD'T COME HERE");
                                                        }
                                                    });
                                                })
                                            }
                                        });
                                    } else {
                                        canSell = true;
                                    }
                                });
                            } else {
                                logger.info("Flag to buy or sell is false. Not able to buy or sell");
                            }
                        } else {
                            logger.info("Can not buy or sell: difference " + parseFloat(Math.abs(predictedValue - price)).toFixed(2) + " < " + marginToExercise);
                        }
                    });
                }
            });
        }catch (error){
            logger.info("TRY CATCH ----- SHOULD'T COME HERE: " + error);
        }
    }, 36000) // 36 seconds
}


function buyCall (price, investmentSize, product_id, code, callback){
    exercise.buyCall(price, investmentSize, product_id, code, function (err, buyResponse) {
        if (err) {
            logger.error("Error in buying function: " + err);
        } else {
            if(buyResponse.message){
                logger.info("Insufficient fund (USD)");
                callback("Insufficient fund (USD)", null);
            } else {
                saveTransaction(buyResponse.id, price, investmentSize, "pending", "buy", "LTC");
                currentTransactionId = buyResponse.id;
                callback(null, buyResponse.id);
                logger.info("Limit placed to buy LTC @:" + price);
            }
        }
    });
}

function sellCall (price, investmentSize, product_id, code, callback){
    exercise.sellCall(price, investmentSize, product_id, code, function (err, sellResponse) {
        if (err) {
            logger.error("Error in selling function: " + err);
        } else {
            if(sellResponse.message){
                logger.info("Insufficient fund (LTC)");
                callback("Insufficient fund (LTC)", null);
            } else {
                saveTransaction(sellResponse.id, price, investmentSize, "pending", "sell", "LTC");
                currentTransactionId = sellResponse.id;
                callback(null, sellResponse.id);
                logger.info("Limit placed to sell LTC @:" + price);
            }
        }
    });
}

function saveTransaction (transactionId, price, investmentSize, status, type, product){
    order = new DB.Order();

    order.order_id = transactionId;
    order.price = price;
    order.size = investmentSize;
    order.status = status;
    order.type = type;
    order.product = product;

    order.save(function () {
    });
}

function checkTransaction(type, initialTransaction, txID, callback){
    var transactionTimer = setInterval(function () {
        try {
            authedClient.getOrder(txID, function (err, data) {
                if (err) {
                    logger.error("Order detail error: " + err);
                } else {
                    if (data.statusCode == 200 && data.body) {
                        var orderDetail = JSON.parse(data.body);
                        logger.info("Status: " + orderDetail.status + " for txID: " + txID)
                        if (orderDetail.status == "done") {
                            clearInterval(transactionTimer);
                            order.update({
                                status: 'done'
                            });
                            callback(null, true);
                        }
                    }
                }
            });
        }catch (error){
            logger.info("TRY CATCH in CHECK TRANSACTION----- SHOULD'T COME HERE: " + error);
        }
    }, 5000);
}

exports.smartBotLTC = smartBotLTC;