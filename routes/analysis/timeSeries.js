var timeseries = require("timeseries-analysis");
var _ = require('lodash');
var DB = require('../../models/db');
var logger = require('../../routes/helper/winston');

var gauss = require('gauss');

function ethDataTimeSeries () {
    DB.sequelize.query("SELECT createdAt, ask from ltc order by createdAt desc limit 300", { type: DB.sequelize.QueryTypes.SELECT}).then(res =>{
        // logger.info(err);

        // logger.info(JSON.stringify(res[0].ask));

        function makeArray(jsonObject){
            return [jsonObject.createdAt, jsonObject.ask];
        }

        var finalData = _.map(res, makeArray);
        var priceData = _.map(res, 'ask');

        finalData = finalData.reverse();
        priceData = priceData.reverse();

        // logger.info(JSON.stringify(finalData));

        var t = new timeseries.main(finalData);

        // logger.info(JSON.stringify(finalData));

        // logger.info("Moving average: " + JSON.stringify(t.ma({period: 1000}).lwma().output()));
        var chart_url = t.ma({period: 1000}).chart();

        // logger.info(chart_url);


        // GAUSS

        var numbers = new gauss.Vector(priceData);
        // logger.info(numbers[0]);


    }).catch (function (err){
        logger.info("Some error" + err);
    });
};

exports.ethDataTimeSeries = ethDataTimeSeries;