const ETH = require('./helper/eth');
var excercise = require('./helper/excercise');
const Gdax = require('gdax');
var authedClient = new Gdax.AuthenticatedClient(process.env.API_KEY, process.env.API_SECRET, process.env.PASSPHRASE, process.env.APIURI);
var authedSandboxClient = new Gdax.AuthenticatedClient(process.env.SANDBOX_API_KEY, process.env.SANDBOX_API_SECRET, process.env.SANDBOX_PASSPHRASE, process.env.SANDBOXURI);
var logger = require('./helper/winston');
const DB = require('../models/db');

const investPrice = 50;
const marginPercent = 0.8;
const buyMargin = 3;
const maxBuyingPriceLimit = 925.0;
var i = 0;
function smartLoop (i = 0) {
    if(i < 30) {
        logger.info("HERE IS THE " + i+1 + " TIME");
        var checkBuyingPrice = setTimeout(function(){
            ETH.getEthUsdValue(function (err, response) {
                if (err) {
                    setTimeout(smartLoop, 10000);
                } else {
                    response = JSON.parse(response);
                    var price = parseFloat(response.bids[0][0]);
                    // Check max buying limit
                    logger.info("Current price: " + price);
                    price = price - buyMargin;
                    price = price.toFixed(2);
                    if(price < maxBuyingPriceLimit) {
                        logger.info("LESS THEN: " + maxBuyingPriceLimit);
                        clearInterval(checkBuyingPrice);

                        // var price = 101;
                        var size = 1;
                        var product_id = "ETH-USD";

                        var investmentSize = (investPrice / (price)).toFixed(5);
                        logger.info("Investment Size: " + investmentSize);

                        var buyOrder = new DB.Order();
                        // 1. Buy
                        excercise.buyCall(price, investmentSize, product_id, "aashay", function (err, buyResponse) {
                            if (err) {
                                logger.error("Buy error: " + err);
                            } else {
                                logger.info("Order placed: " + buyResponse.price + " status: " + buyResponse.status);
                                var currentOrderId = buyResponse.id;

                                buyOrder.order_id = currentOrderId;
                                buyOrder.price = price;
                                buyOrder.size = investmentSize;
                                buyOrder.status = 'pending';
                                buyOrder.type = 'buy';
                                buyOrder.product = 'ETH';

                                buyOrder.save(function () {
                                });

                                // 2. Check if the order is filled
                                var currentStatus = "";
                                var buyTimer = setInterval(function () {
                                    authedClient.getOrder(currentOrderId, function (err, data) {
                                        // console.log(data);
                                        if (err) {
                                            logger.error("Order detail error: " + err);
                                        } else {
                                            if (data.statusCode == 200) {
                                                var orderDetail = JSON.parse(data.body);
                                                // if (currentStatus != orderDetail.status) {
                                                logger.info("Current Status: " + orderDetail.status + " for order id: " + orderDetail.id);
                                                currentStatus = orderDetail.status;
                                                // }
                                                if (orderDetail.status == "done") {
                                                    logger.info("Buy order has been executed");
                                                    clearInterval(buyTimer);
                                                    buyOrder.update({
                                                        status: 'done'
                                                    });

                                                    // 3. Sell
                                                    var sellOrder = new DB.Order();
                                                    var sellPrice = parseFloat(orderDetail.price * (1 + (marginPercent / 100)));
                                                    sellPrice = sellPrice.toFixed(2);

                                                    logger.info("Selling price: " + sellPrice);
                                                    excercise.sellCall(sellPrice, investmentSize, product_id, "aashay", function (err, sellResponse) {
                                                        logger.info("Placed sell limit: " + sellResponse.toString());
                                                        if (err) {
                                                            logger.error("Status error: " + err);
                                                        } else {
                                                            logger.info("Limit placed at: " + sellResponse.price);
                                                            currentStatus = "";

                                                            sellOrder.order_id = sellResponse.id;
                                                            sellOrder.price = sellPrice;
                                                            sellOrder.size = investmentSize;
                                                            sellOrder.status = 'pending';
                                                            sellOrder.type = 'sell';
                                                            sellOrder.product = 'ETH';

                                                            sellOrder.save(function () {
                                                            });


                                                            var sellTimer = setInterval(function () {
                                                                authedClient.getOrder(sellResponse.id, function (err, data) {
                                                                    if (err) {
                                                                        logger.error("Status error: " + err);
                                                                    } else {
                                                                        if (data.statusCode == 200) {
                                                                            var orderDetail = JSON.parse(data.body);
                                                                            // if (currentStatus != orderDetail.status) {
                                                                            logger.info("Current Status: " + orderDetail.status + " for order id: " + orderDetail.id);
                                                                            currentStatus = orderDetail.status;
                                                                            // }
                                                                            if (orderDetail.status == "done") {
                                                                                logger.info("Sell order has been executed");
                                                                                clearInterval(sellTimer);
                                                                                sellOrder.update({
                                                                                    status: 'done'
                                                                                });
                                                                                setTimeout(function(){
                                                                                    logger.info("Waiting for seven minutes");
                                                                                    smartLoop(i+1);
                                                                                }, 15000);
                                                                            }
                                                                        } else {
                                                                            logger.error("Price error, statusCode: " + data.statusCode);
                                                                        }
                                                                    }
                                                                });
                                                            }, 5000);
                                                        }
                                                    })
                                                }
                                            } else {
                                                logger.error("Price error, statusCode: " + data.statusCode);
                                            }
                                        }
                                    });
                                }, 1000);
                            }
                        });
                    }
                }

            });
        }, 5000);
    }
}


exports.smartBot = smartLoop;