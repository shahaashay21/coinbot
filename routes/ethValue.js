var express = require('express');
var router = express.Router();
require('dotenv').config();
var excercise = require('./helper/excercise');

const Gdax = require('gdax');
var authedClient = new Gdax.AuthenticatedClient(process.env.API_KEY, process.env.API_SECRET, process.env.PASSPHRASE, process.env.APIURI);
var authedSandboxClient = new Gdax.AuthenticatedClient(process.env.SANDBOX_API_KEY, process.env.SANDBOX_API_SECRET, process.env.SANDBOX_PASSPHRASE, process.env.SANDBOXURI);

const ETH = require('./helper/eth');

router.get('/usd', function(req, res, next) {
    ETH.getEthUsdValue(function (err, response) {
        // console.log((response));
        res.json(JSON.parse(response));
    });
});

router.get('/btc', function(req, res, next) {
    ETH.getEthBtcValue(function (err, response) {
        // console.log((response));
        res.json(JSON.parse(response));
    });
});

router.post('/buy', function(req, res, next){
    var price = req.body.price;
    var size = req.body.size;
    var product_id = req.body.product_id;

    if(price && size && product_id){
        excercise.buyCall(price, size, 'ETH-USD', req.body.treasure, function (err, buyResponse) {
            if(err){
                res.json(JSON.parse("error"));
            }else{
                res.json(buyResponse);
            }
        });
    } else {
        res.json(JSON.parse("error"));
    }
});

router.post('/sell', function(req, res, next){
    var price = req.body.price;
    var size = req.body.size;
    var product_id = req.body.product_id;

    if(price && size && product_id) {
        excercise.sellCall(price, size, 'ETH-USD', req.body.treasure, function (err, sellResponse) {
            if(err){
                res.json(JSON.parse("error"));
            }else{
                res.json(sellResponse);
            }
        })
    } else {
        res.json("error");
    }
});

module.exports = router;