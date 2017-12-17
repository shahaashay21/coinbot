var express = require('express');
var router = express.Router();
require('dotenv').config();

const Gdax = require('gdax');
var authedClient = new Gdax.AuthenticatedClient(process.env.API_KEY, process.env.API_SECRET, process.env.PASSPHRASE, process.env.APIURI);
var authedSandboxClient = new Gdax.AuthenticatedClient(process.env.SANDBOX_API_KEY, process.env.SANDBOX_API_SECRET, process.env.SANDBOX_PASSPHRASE, process.env.SANDBOXURI);

const BTC = require('./helper/btc');
var excercise = require('./helper/excercise');

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

    if(price && size && product_id){
        excercise.buyCall(price, size, 'BTC-USD', req.body.treasure, function (err, buyResponse) {
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
    console.log(req.body);

    if(price && size && product_id) {
        excercise.sellCall(price, size, 'BTC-USD', req.body.treasure, function (err, sellResponse) {
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