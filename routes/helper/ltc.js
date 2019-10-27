var request = require('request');
const header = {
    'User-Agent': 'request',
    'Content-Type': 'application/x-www-form-urlencoded'
}

const USDbook = '/products/LTC-USD/book';
const BTCbook = '/products/LTC-BTC/book';

var logger = require('../helper/winston');

exports.getLtcUsdValue = function (callback) {
    request({headers: header, url: process.env.APIURI+USDbook}, function (error, response, body) {
        if(error){
            logger.info("Error in getting LTC price" + error);
            callback(error, null);
        }else {
            if(body = JSON.parse(body)) {
                if(body.bids) {
                    callback(null, body);
                } else {
                    logger.info("Error in getting LTC price" + JSON.stringify(body));
                    callback(JSON.stringify(body), null);
                }
            }else{
                callback("Not able to parse", null);
            }
        }
    });
};

exports.getLtcBtcValue = function (callback) {
    request({headers: header, url: process.env.APIURI+BTCbook}, function (error, response, body) {
        if(error){
            logger.info("Error in getting LTC price" + error);
            callback(error, null);
        }else {
            if(body = JSON.parse(body)) {
                if(body.bids) {
                    callback(null, body);
                } else {
                    logger.info("Error in getting LTC price" + JSON.stringify(body));
                    callback(JSON.stringify(body), null);
                }
            }else{
                callback("Not able to parse", null);
            }
        }
    });
}