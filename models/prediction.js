/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('prediction', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		product: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		price: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		prediction: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
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
		tableName: 'prediction',
		timestamps: true
	});
};
