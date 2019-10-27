// const Gdax = require('gdax');
// const websocket = new Gdax.WebsocketClient(['LTC-USD']);
// var logger = require("../helper/winston");
//
// function socketStart(){
//     websocket.on('message', data => {
//         // logger.info("ON MESSAGE: " + JSON.stringify(data))
//         // if(data.type == "match"){
//         //     logger.info("ON MESSAGE: " + JSON.stringify(data));
//         // }
//     });
//     websocket.on('error', err => { logger.info("ON ERROR:: " + err) });
//     websocket.on('close', () => { logger.info("ON CLOSE") });
// }
//
// exports.socketStart = socketStart;