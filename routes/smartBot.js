const BTC = require('./helper/btc');
const LTC = require('./helper/ltc');
const investPrice = 50;
const marginPercent = 0.05;
var excercise = require('./helper/excercise');

const Gdax = require('gdax');
var authedClient = new Gdax.AuthenticatedClient(process.env.API_KEY, process.env.API_SECRET, process.env.PASSPHRASE, process.env.APIURI);
var authedSandboxClient = new Gdax.AuthenticatedClient(process.env.SANDBOX_API_KEY, process.env.SANDBOX_API_SECRET, process.env.SANDBOX_PASSPHRASE, process.env.SANDBOXURI);

function smartLoop () {
    LTC.getLtcUsdValue(function (err, response) {
        response = JSON.parse(response);
        var price = parseFloat(response.bids[0][0]);
        price = price.toFixed(2);
        price = price - 0.05;
        // var price = 101;
        var size = 1;
        var product_id = "LTC-USD"

        var investmentSize = (investPrice / (price)).toFixed(5);

        // 1. Buy
        excercise.buyCall(price, investmentSize, product_id, "aashay", function (err, buyResponse) {
            if (err) {
                console.log("Buy error: " + err);
            } else {
                console.log("Order placed: " + buyResponse.price + " status: " + buyResponse.status);
                var currentOrderId = buyResponse.id;

                // 2. Check if the order is filled
                var buyTimer = setInterval(function () {
                    authedClient.getOrder(currentOrderId, function (err, data) {
                        // console.log(data);
                        if (err) {
                            console.log("Status error: " + err);
                        } else {
                            var orderDetail = JSON.parse(data.body);
                            console.log("Current Status: " + orderDetail.status + " for order id: " + orderDetail.id);
                            if (orderDetail.status == "done") {
                                clearInterval(buyTimer);

                                // 3. Sell
                                var sellPrice = parseFloat(orderDetail.price * (1 + (marginPercent / 100)));
                                sellPrice = sellPrice.toFixed(2);

                                console.log("Selling price" + sellPrice);
                                excercise.sellCall(sellPrice, investmentSize, product_id, "aashay", function (err, sellResponse) {
                                    console.log(sellResponse);
                                    if (err) {
                                        console.log("Status error: " + err);
                                    } else {
                                        console.log("Limit placed at: " + sellResponse.price);
                                        var sellTimer = setInterval(function () {
                                            authedClient.getOrder(sellResponse.id, function (err, data) {
                                                if (err) {
                                                    console.log("Status error: " + err);
                                                } else {
                                                    var orderDetail = JSON.parse(data.body);
                                                    console.log("Current Status: " + orderDetail.status + " for order id: " + orderDetail.id);
                                                    if (orderDetail.status == "done") {
                                                        clearInterval(sellTimer);
                                                        setTimeout(smartLoop, 3000);
                                                    }
                                                }
                                            });
                                        }, 5000);
                                    }
                                })
                            }
                        }
                    });
                }, 1000);
            }
        });

    });
}


exports.smartBot = smartLoop;