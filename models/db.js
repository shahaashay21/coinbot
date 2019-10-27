const Sequelize = require('sequelize');
const sequelize = require('./sequelize');


module.exports.Ltc = require('./ltc')(sequelize, Sequelize);
module.exports.Btc = require('./btc')(sequelize, Sequelize);
module.exports.Eth = require('./eth')(sequelize, Sequelize);
module.exports.Users = require('./users')(sequelize, Sequelize);
module.exports.Order = require('./orders')(sequelize, Sequelize);
module.exports.Prediction = require('./prediction')(sequelize, Sequelize);
module.exports.Analysis = require('./analysis')(sequelize, Sequelize);


module.exports.sequelize = sequelize;