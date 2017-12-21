var express = require('express');
var router = express.Router();
require('dotenv').config();

const Gdax = require('gdax');
var authedClient = new Gdax.AuthenticatedClient(process.env.API_KEY, process.env.API_SECRET, process.env.PASSPHRASE, process.env.APIURI);
var authedSandboxClient = new Gdax.AuthenticatedClient(process.env.SANDBOX_API_KEY, process.env.SANDBOX_API_SECRET, process.env.SANDBOX_PASSPHRASE, process.env.SANDBOXURI);

var logger = require('./helper/winston');

router.get('/info', function(req, res, next){
    authedClient.getAccount(process.env.ACCOUNT_ID, function(err, data){
        if(err){
            logger.info("Error in getting accounts info: " + err);
            res.json("error");
        }else{
            if(data.statusCode == 200){
                res.json(JSON.parse(data.body));
            } else {
                logger.info("Error in getting accounts info with statusCode: " + data.statusCode);
                res.json("error");
            }
        }
    });
});

router.get('/accounts', function(req, res, next){
    authedClient.getAccounts(function(err, data){
        if(err){
            logger.info("Error in getting accounts: " + err);
            res.json("error");
        }else{
            if(data.statusCode == 200){
                res.json(JSON.parse(data.body));
            } else {
                logger.info("Error in getting accounts with statusCode: " + data.statusCode);
                res.json("error");
            }
        }
    });
});

// Get hold items
router.get('/holds', function(req, res, next){
    authedClient.getAccountHolds(process.env.ACCOUNT_ID, function(err, data){
        if(err){
            logger.info("Error in getting account holds: " + err);
            res.json("error");
        }else{
            if(data.statusCode == 200){
                res.json(JSON.parse(data.body));
            } else {
                logger.info("Error in getting account holds with statusCode: " + data.statusCode);
                res.json("error");
            }
        }
    })
});

// Get account history
router.get('/history', function(req, res, next){
    authedClient.getAccountHistory(process.env.ACCOUNT_ID, function(err, data){
        if(err){
            logger.info("Error in getting account history: " + err);
            res.json("error");
        }else{
            if(data.statusCode == 200){
                res.json(JSON.parse(data.body));
            } else {
                logger.info("Error in getting history with statusCode: " + data.statusCode);
                res.json("error");
            }
        }
    })
});

router.post('/orders', function (req, res, next) {
    authedClient.getOrders(function(err, data){
        if(err){
            logger.info("Error in getting orders: " + err);
            res.json("error");
        }else{
            if(data.statusCode == 200){
                res.json(JSON.parse(data.body));
            } else {
                logger.info("Error in getting order with statusCode: " + data.statusCode);
                res.json("error");
            }
        }
    });
});

router.post('/order', function (req, res, next) {
    if(req.body.order_id) {
        authedClient.getOrder(req.body.order_id, function (err, data) {
            console.log(data.statusCode);
            if(err){
                logger.info("Error in getting order: " + req.body.order_id +" with error: " + err);
                res.json("error");
            }else{
                if(data.statusCode == 200){
                    res.json(JSON.parse(data.body));
                } else {
                    logger.info("Error in getting order: " + req.body.order_id +" with statusCode: " + data.statusCode);
                    res.json("error");
                }
            }
        });
    }
});

router.post('/cancelorders', function (req, res, next) {
    authedClient.cancelAllOrders(function(err, data){
        if(err){
            logger.info("Error in canceling orders: " + err);
            res.json("error");
        }else{
            if(data.statusCode == 200){
                res.json(JSON.parse(data.body));
            } else {
                logger.info("Error in canceling orders with statusCode: " + data.statusCode);
                res.json("error");
            }
        }
    });
});

router.post('/cancelorder', function (req, res, next) {
    if(req.body.order_id) {
        authedClient.cancelOrder(req.body.order_id, function (err, data) {
            if(err){
                logger.info("Error in cenceling order: " + req.body.order_id +" with error: " + err);
                res.json("error");
            }else{
                if(data.statusCode == 200){
                    res.json(JSON.parse(data.body));
                } else {
                    logger.info("Error in cenceling order: " + req.body.order_id +" with statusCode: " + data.statusCode);
                    res.json("error");
                }
            }
        });
    }
});


module.exports = router;