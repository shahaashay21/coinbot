/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('btc', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		currency: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		ask: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		bid: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
	}, {
		tableName: 'btc',
		timestamps: true
	});
};
