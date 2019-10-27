var Sequelize = require('sequelize');
require('dotenv').config();

module.exports = new Sequelize(process.env.database_name, process.env.database_user, process.env.database_password, {
    logging: false,
    host: 'localhost',
    dialect: 'mysql',
    port:3306,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});