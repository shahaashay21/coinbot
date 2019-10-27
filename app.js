var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var SequelizeAuto = require('sequelize-auto');
var CronJob = require('cron').CronJob;

var ltc = require('./routes/ltcValue');
var eth = require('./routes/ethValue');
var btc = require('./routes/btcValue');
var cron = require('./routes/cron');
var smartBotLTC = require('./routes/smartBotLTC');
var smartBotBTC = require('./routes/smartBotBTC');
var smartBotETH = require('./routes/smartBotETH');
var account = require('./routes/account');
var timeSeries = require('./routes/analysis/timeSeries');
var gauss = require('./routes/analysis/gauss');
var regression = require('./routes/analysis/regression');
var verifyAlgo = require('./routes/analysis/verifyAlgo');
var verify_orders = require('./routes/helper/verify_orders');
var analysis_result = require('./routes/helper/analysis_result');
var predictionBotLtc = require("./routes/predictionBot/predictionBotLTC");
// var socket = require("./routes/WebSocket/socket");

require('dotenv').config();

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/account', account);
app.use('/ltc', ltc);
app.use('/btc', btc);
app.use('/eth', eth);


var auto = new SequelizeAuto(process.env.database_name, process.env.database_user, process.env.database_password, {
    host: 'localhost',
    dialect: 'mysql',
    directory: path.join(__dirname, 'models'), // prevents the program from writing to disk
    port: 3306,
    additional: {
        timestamps: true
    }
});

// Run every time when change in DB
// auto.run(function (err) {
// });


//VERIFY ORDERS
verify_orders.verifyOrders();

//Cron jobs

// Get all coins price
new CronJob('00 */1 * * * *', function() {
    cron.runCronJob();
}, null, true, 'America/Los_Angeles');


//Predict LTC coin price (GAUSS)
new CronJob('07 */5 * * * *', function() {
    gauss.ltcPrediction();
}, null, true, 'America/Los_Angeles');

//Predict LTC coin price (REGRESSION)
new CronJob('07 */5 * * * *', function() {
    regression.ltcPrediction();
}, null, true, 'America/Los_Angeles');


//Verify coin price
new CronJob('*/8 * * * * *', function() {
    verifyAlgo.checkPrediction();
}, null, true, 'America/Los_Angeles');

//Update Analysis Result (Every hour)
new CronJob('00 */30 * * * *', function() {
    analysis_result.updateResult();
}, null, true, 'America/Los_Angeles');

// MAKE SOME TRANSACTION OF LTC
// predictionBotLtc.smartBotLTC();

//SOCKET MESSAGE
// socket.socketStart();


//Temp price prediction
// new CronJob('00 */1 * * * *', function() {
//     gauss.ltcTempPrediction();
// }, null, true, 'America/Los_Angeles');

// timeSeries.ethDataTimeSeries();

//LTC BOT
// smartBotLTC.smartBot();
//ETH BOT
// smartBotETH.smartBot();
//BTC BOT
// smartBotBTC.smartBot();


// timeSeries.getEthData();
// regression.ltcRegressionPrediction();
// regression.ltcSS10Prediction();
// regression.ltcPolynomialRegressionPrediction(1, 10);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.set('port', process.env.PORT || 3000);

/**
 * Create HTTP server.
 */

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
