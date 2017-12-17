/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('ltc', {
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
		bid: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		ask: {
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
		tableName: 'ltc',
		timestamps: true
	});
};
