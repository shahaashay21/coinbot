var request = require('request');
const header = {
    'User-Agent': 'request',
    'Content-Type': 'application/x-www-form-urlencoded'
}

const USDbook = '/products/LTC-USD/book';
const BTCbook = '/products/LTC-BTC/book';

exports.getLtcUsdValue = function (callback) {
    request({headers: header, url: process.env.APIURI+USDbook}, function (error, response, body) {
        if(error){
            callback(1, null);
        }else {
            callback(null, body);
        }
    });
};

exports.getLtcBtcValue = function (callback) {
    request({headers: header, url: process.env.APIURI+BTCbook}, function (error, response, body) {
        if(error){
            callback(1, null);
        }else {
            callback(null, body);
        }
    });
}