const LTC = require('./helper/ltc');
const ETH = require('./helper/eth');
const BTC = require('./helper/btc');
const DB = require('../models/db');


exports.runCronJob = function() {
    LTC.getLtcUsdValue(function (err, response) {
        response = JSON.parse(response);
        var LtcObject = new DB.Ltc();

        LtcObject.bid = response.bids[0][0];
        LtcObject.ask = response.asks[0][0];
        LtcObject.currency = 'LTC-USD';

        LtcObject.save();
    });

    ETH.getEthUsdValue(function (err, response) {
        response = JSON.parse(response);
        var EthObject = new DB.Eth();

        EthObject.bid = response.bids[0][0];
        EthObject.ask = response.asks[0][0];
        EthObject.currency = 'ETH-USD';

        EthObject.save();
    });

    BTC.getBtcUsdValue(function (err, response) {
        response = JSON.parse(response);
        var BtcObject = new DB.Btc();

        BtcObject.bid = response.bids[0][0];
        BtcObject.ask = response.asks[0][0];
        BtcObject.currency = 'BTC-USD';

        BtcObject.save();
    });
};