var express = require('express');
var router = express.Router();
require('dotenv').config();

const Gdax = require('gdax');
var authedClient = new Gdax.AuthenticatedClient(process.env.API_KEY, process.env.API_SECRET, process.env.PASSPHRASE, process.env.APIURI);
var authedSandboxClient = new Gdax.AuthenticatedClient(process.env.SANDBOX_API_KEY, process.env.SANDBOX_API_SECRET, process.env.SANDBOX_PASSPHRASE, process.env.SANDBOXURI);

router.get('/info', function(req, res, next){
    authedClient.getAccount(process.env.ACCOUNT_ID, function(err, data){
        if(err){
            res.json(JSON.parse("error"));
        }else{
            res.json(JSON.parse(data.body));
        }
    });
});

router.get('/accounts', function(req, res, next){
    authedClient.getAccounts(function(err, data){
        if(err){
            res.json(JSON.parse("error"));
        }else{
            res.json(JSON.parse(data.body));
        }
    });
});

// Get hold items
router.get('/holds', function(req, res, next){
    authedClient.getAccountHolds(process.env.ACCOUNT_ID, function(err, data){
        if(err){
            res.json(JSON.parse("error"));
        }else{
            res.json(JSON.parse(data.body));
        }
    })
});

// Get account history
router.get('/history', function(req, res, next){
    authedClient.getAccountHistory(process.env.ACCOUNT_ID, function(err, data){
        if(err){
            res.json(JSON.parse("error"));
        }else{
            res.json(JSON.parse(data.body));
        }
    })
});

router.post('/orders', function (req, res, next) {
    authedClient.getOrders(function(err, data){
        if(err){
            res.json(JSON.parse("error"));
        }else{
            res.json(JSON.parse(data.body));
        }
    })
    // if(req.body.username == 'shah'){
    //     authedClient.getOrders(function(err, data){
    //         if(err){
    //             res.json(JSON.parse("error"));
    //         }else{
    //             res.json(JSON.parse(data.body));
    //         }
    //     })
    // }else{
    //     authedSandboxClient.getOrders(function(err, data){
    //         if(err){
    //             res.json(JSON.parse("error"));
    //         }else{
    //             res.json(JSON.parse(data.body));
    //         }
    //     })
    // }
});

router.post('/order', function (req, res, next) {
    if(req.body.order_id) {
        authedClient.getOrder(req.body.order_id, function (err, data) {
            if (err) {
                res.json(JSON.parse("error"));
            } else {
                res.json(JSON.parse(data.body));
            }
        })
        // if (req.body.username == 'shah') {
        //     authedClient.getOrder(req.body.order_id, function (err, data) {
        //         if (err) {
        //             res.json(JSON.parse("error"));
        //         } else {
        //             res.json(JSON.parse(data.body));
        //         }
        //     })
        // } else {
        //     console.log("Single order");
        //     authedSandboxClient.getOrder(req.body.order_id, function (err, data) {
        //         console.log("Single order");
        //         if (err) {
        //             res.json(JSON.parse("error"));
        //         } else {
        //             res.json(JSON.parse(data.body));
        //         }
        //     })
        // }
    }
});

router.post('/cancelorders', function (req, res, next) {
    authedClient.cancelAllOrders(function(err, data){
        if(err){
            res.json(JSON.parse("error"));
        }else{
            res.json(JSON.parse(data.body));
        }
    })
    // if(req.body.username == 'shah'){
    //     authedClient.cancelAllOrders(function(err, data){
    //         if(err){
    //             res.json(JSON.parse("error"));
    //         }else{
    //             res.json(JSON.parse(data.body));
    //         }
    //     })
    // }else{
    //     authedSandboxClient.cancelAllOrders(function(err, data){
    //         if(err){
    //             res.json(JSON.parse("error"));
    //         }else{
    //             res.json(JSON.parse(data.body));
    //         }
    //     })
    // }
});

router.post('/cancelorder', function (req, res, next) {
    if(req.body.order_id) {
        authedClient.cancelOrder(req.body.order_id, function (err, data) {
            if (err) {
                res.json(JSON.parse("error"));
            } else {
                res.json(JSON.parse(data.body));
            }
        })
        // if (req.body.username == 'shah') {
        //     authedClient.cancelOrder(req.body.order_id, function (err, data) {
        //         if (err) {
        //             res.json(JSON.parse("error"));
        //         } else {
        //             res.json(JSON.parse(data.body));
        //         }
        //     })
        // } else {
        //     authedSandboxClient.cancelOrder(req.body.order_id, function (err, data) {
        //         if (err) {
        //             res.json(JSON.parse("error"));
        //         } else {
        //             res.json(JSON.parse(data.body));
        //         }
        //     })
        // }
    }
});


module.exports = router;