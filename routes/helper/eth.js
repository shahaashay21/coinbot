var request = require('request');
const header = {
    'User-Agent': 'request',
    'Content-Type': 'application/x-www-form-urlencoded'
}

const USDbook = '/products/ETH-USD/book';
const BTCbook = '/products/ETH-BTC/book';

var logger = require('../helper/winston');

exports.getEthUsdValue = function (callback) {
    request({headers: header, url: process.env.APIURI+USDbook}, function (error, response, body) {
        if(error){
            logger.info("Error in getting ETH price");
            callback(error, null);
        }else {
            callback(null, body);
        }
    });
};

exports.getEthBtcValue = function (callback) {
    request({headers: header, url: process.env.APIURI+BTCbook}, function (error, response, body) {
        if(error){
            logger.info("Error in getting ETH price");
            callback(error, null);
        }else {
            callback(null, body);
        }
    });
}