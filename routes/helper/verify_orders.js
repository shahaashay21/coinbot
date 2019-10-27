var _ = require("lodash");
var logger = require('./winston');
var DB = require('../../models/db');
require('dotenv').config();

const Gdax = require('gdax');
var authedClient = new Gdax.AuthenticatedClient(process.env.API_KEY, process.env.API_SECRET, process.env.PASSPHRASE, process.env.APIURI);

function verifyOrders(){
    DB.sequelize.query("SELECT id, order_id from orders where status='pending'", { type: DB.sequelize.QueryTypes.SELECT}).then(res => {
       // logger.info(JSON.stringify(res));
       function verify(order){
           logger.info(order.id);
           getOrder(order.order_id, function (err, orderDetails) {
               var status = 'canceled';
               // logger.info("RESPONSE OF ORDER: " + orderDetails);
               if(!err && orderDetails.status) {
                   if (orderDetails.status == "done") {
                       status = "done";
                   } else if (orderDetails.status == "open") {
                       status = "pending";
                   } else if (orderDetails.status == "rejected") {
                       status = "rejected";
                   } else {
                       status = "canceled";
                   }
               }

               DB.sequelize.query("UPDATE orders set status = '"+ status +"' where id=" + order.id, { type: DB.sequelize.QueryTypes.UPDATE}).then(ans => {
                   logger.info("Updated order id: " + order.id + " status to " + status);
               }).catch(function (err) {
                   logger.error("Error in updating order id: " + order.id + " status to " + status + " " + err);
               });
           })
       }
       _.map(res, verify);
    }).catch(function (err) {
        logger.error("Error in fetching order ids to verify. " + err);
    });
}

function getOrder(order_id, callback){
    authedClient.getOrder(order_id, function (err, data) {
        if(err){
            logger.error("Error in getting order: " + order_id +" with error: " + err);
            callback(err, null);
        }else{
            if(data.statusCode == 200){
                if(data && data.body){
                    callback(null, JSON.parse(data.body));
                }else {
                    callback("Error in response message", null);
                }
            } else {
                logger.error("Error in getting order: " + order_id +" with statusCode: " + data.statusCode);
                callback("error", null);
            }
        }
    });
}

exports.verifyOrders = verifyOrders;