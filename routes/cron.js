const LTC = require('./helper/ltc');
const ETH = require('./helper/eth');
const BTC = require('./helper/btc');
const DB = require('../models/db');
var logger = require('../routes/helper/winston');

exports.runCronJob = function() {
    LTC.getLtcUsdValue(function (err, response) {
        if(err){
            logger.info("Error in getting LTC value: " + err);
        }else {
            var LtcObject = new DB.Ltc();
            if(response.bids && response.bids[0] && response.bids[0][0]) {
                LtcObject.bid = response.bids[0][0];
                LtcObject.ask = response.asks[0][0];
                LtcObject.currency = 'LTC-USD';

                LtcObject.save();
            }
        }
    });

    ETH.getEthUsdValue(function (err, response) {
        if(err){
            logger.info("Error in getting ETH value: " + err);
        }else {
            var EthObject = new DB.Eth();
            if(response.bids && response.bids[0] && response.bids[0][0]) {
                EthObject.bid = response.bids[0][0];
                EthObject.ask = response.asks[0][0];
                EthObject.currency = 'ETH-USD';

                EthObject.save();
            }
        }
    });

    BTC.getBtcUsdValue(function (err, response) {
        if(err){
            logger.info("Error in getting BTC value: " + err);
        }else {
            var BtcObject = new DB.Btc();
            if(response.bids && response.bids[0] && response.bids[0][0]) {
                BtcObject.bid = response.bids[0][0];
                BtcObject.ask = response.asks[0][0];
                BtcObject.currency = 'BTC-USD';

                BtcObject.save();
            }
        }
    });
};