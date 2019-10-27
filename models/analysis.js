/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('analysis', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		algo: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		product: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		data_size: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		predicted_time: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		success_rate: {
			type: DataTypes.FLOAT,
			allowNull: true
		},
		total_prediction: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		success_prediction: {
			type: DataTypes.INTEGER(11),
			allowNull: true
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
		tableName: 'analysis',
		timestamps: true
	});
};
