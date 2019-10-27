require('dotenv').config();

const Gdax = require('gdax');
var authedClient = new Gdax.AuthenticatedClient(process.env.API_KEY, process.env.API_SECRET, process.env.PASSPHRASE, process.env.APIURI);
var authedSandboxClient = new Gdax.AuthenticatedClient(process.env.SANDBOX_API_KEY, process.env.SANDBOX_API_SECRET, process.env.SANDBOX_PASSPHRASE, process.env.SANDBOXURI);
var logger = require('../helper/winston');

exports.buyCall = function (price, size, product_id, treasure, callback){
    logger.info(price);
    logger.info(size);
    var buyParams = {};

    if(price && size && size > 0 && product_id){
        buyParams = {
            'price': price, // USD
            'size': size,
            'product_id': product_id,
        };


        if(treasure == 'aashay'){
            authedClient.buy(buyParams, function (err, data) {
                if(err){
                    logger.info("Error in buying stock: " + err);
                    callback(err, null);
                }else{
                    if(data && data.body) {
                        logger.info("BUY MESSAGE: " + data.body.toString());
                        callback(null, JSON.parse(data.body));
                    }else {
                        logger.info("Error in buying: " + data);
                        callback(data, null);
                    }
                }
            });
        }else {
            authedSandboxClient.buy(buyParams, function (err, data) {
                if(err){
                    console.log("Error in selling stock: " + err);
                    callback(err, null);
                }else{
                    if(data && data.body) {
                        callback(null, JSON.parse(data.body));
                    }else {
                        console.log("Error in selling: " + data);
                        callback(data, null);
                    }
                }
            });
        }
    } else {
        callback("true", null);
    }
}

exports.sellCall = function (price, size, product_id, treasure, callback){
    console.log("SELL VALUE: " + price);
    console.log("SELL SIZE: " + size);
    var sellParams = {};
    if(price && size && product_id){
        sellParams = {
            'price': price, // USD
            'size': size,
            'product_id': product_id,
        };

        if(treasure == 'aashay'){
            authedClient.sell(sellParams, function (err, data) {
                if(err){
                    logger.info("Error in selling stock: " + err);
                    callback(err, null);
                }else{
                    if(data && data.body) {
                        logger.info("SELL MESSAGE: " + data.body.toString());
                        callback(null, JSON.parse(data.body));
                    }else {
                        logger.info("Error in selling: " + data);
                        callback(data, null);
                    }
                }
            });

        }else {
            authedSandboxClient.sell(sellParams, function (err, data) {
                if(err){
                    callback("true", null);
                }else{
                    callback(null, JSON.parse(data.body));
                }
            });
        }
    } else {
        callback("true", null);
    }
}