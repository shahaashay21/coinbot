var express = require('express');
var router = express.Router();
const Gdax = require('gdax');
var request = require('request');
// const publicClient = new Gdax.PublicClient();
const publicClient = new Gdax.PublicClient("LTC-USD", process.env.APIURI);

const authedClient = new Gdax.AuthenticatedClient(process.env.API_KEY, process.env.API_SECRET, process.env.PASSPHRASE, process.env.APIURI);

var logger = require('./helper/winston');

/* GET home page. */
router.get('/', function(req, res, next) {
    logger.info("aashay");
    // publicClient.getProducts((error, response, data) => {
    //     if (error) {
    //         // handle the error
    //     } else {
    //         // console.log(JSON.parse(response.body));
    //         // console.log(_.map(JSON.parse(response.body), 'id'));
    //         // work with data
    //     }
    // });

    authedClient.getAccount(process.env.ACCOUNT_ID, function(err, data){
        // console.log(err);
        if(err){

        }else{
            console.log(data.body);
        }
    });

    // publicClient.getProductOrderBook({ level: 1 }, function(err, orderbook){
    //     // console.log(orderbook);
    // });




  res.render('index', { title: 'Express' });
});

function iterateId(value) {
    console.log(value.id);
}

module.exports = router;
