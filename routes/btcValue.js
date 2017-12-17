var express = require('express');
var router = express.Router();
require('dotenv').config();

const Gdax = require('gdax');
var authedClient = new Gdax.AuthenticatedClient(process.env.API_KEY, process.env.API_SECRET, process.env.PASSPHRASE, process.env.APIURI);
var authedSandboxClient = new Gdax.AuthenticatedClient(process.env.SANDBOX_API_KEY, process.env.SANDBOX_API_SECRET, process.env.SANDBOX_PASSPHRASE, process.env.SANDBOXURI);

const BTC = require('./helper/btc');

router.get('/usd', function(req, res, next) {
    BTC.getBtcUsdValue(function (err, response) {
        // console.log((response));
        res.json(JSON.parse(response));
    });
});


router.post('/buy', function(req, res, next){
    var price = req.body.price;
    var size = req.body.size;
    var product_id = req.body.product_id;

    var buyParams = {};

    if(price && size && product_id){
        buyParams = {
            'price': price, // USD
            'size': size,  // BTC
            'product_id': 'BTC-USD',
        };
    } else {
        res.json(JSON.parse("error"));
    }
    if(req.body.treasure == 'aashay'){

    }else {
        authedSandboxClient.buy(buyParams, function (err, data) {
            if(err){
                res.json(JSON.parse("error"));
            }else{
                res.json(JSON.parse(data.body));
            }
        });
    }
});

router.post('/sell', function(req, res, next){
    var price = req.body.price;
    var size = req.body.size;
    var product_id = req.body.product_id;
    console.log(req.body);

    var sellParams = {};

    if(price && size && product_id) {
        sellParams = {
            'price': price, // USD
            'size': size,  // BTC
            'product_id': 'BTC-USD',
        };

        if (req.body.treasure == 'aashay') {

        } else {
            authedSandboxClient.sell(sellParams, function (err, data) {
                if (err) {
                    res.json(JSON.parse("error"));
                } else {
                    res.json(JSON.parse(data.body));
                }
            });
        }
    } else {
        res.json("error");
    }
});

module.exports = router;