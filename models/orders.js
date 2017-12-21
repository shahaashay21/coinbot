/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('orders', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		order_id: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		product: {
			type: DataTypes.ENUM('LTC','ETH','BTC'),
			allowNull: false
		},
		price: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		size: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		status: {
			type: DataTypes.ENUM('pending','done','cancel'),
			allowNull: false
		},
		type: {
			type: DataTypes.ENUM('buy','sell'),
			allowNull: false
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
	}, {
		tableName: 'orders',
		timestamps: true
	});
};
