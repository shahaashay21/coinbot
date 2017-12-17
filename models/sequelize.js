var Sequelize = require('sequelize');

module.exports = new Sequelize('coinbot', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port:3306,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});