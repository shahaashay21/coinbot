var request = require('request');
const header = {
    'User-Agent': 'request',
    'Content-Type': 'application/x-www-form-urlencoded'
}

const USDbook = '/products/ETH-USD/book';
const BTCbook = '/products/ETH-BTC/book';

exports.getEthUsdValue = function (callback) {
    request({headers: header, url: process.env.APIURI+USDbook}, function (error, response, body) {
        if(error){
            callback(1, null);
        }else {
            callback(null, body);
        }
    });
};

exports.getEthBtcValue = function (callback) {
    request({headers: header, url: process.env.APIURI+BTCbook}, function (error, response, body) {
        if(error){
            callback(1, null);
        }else {
            callback(null, body);
        }
    });
}