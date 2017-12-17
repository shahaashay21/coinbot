/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('users', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		first_name: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		last_name: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		password: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		passphrase: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		secret_key: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		api_key: {
			type: DataTypes.TEXT,
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
		tableName: 'users',
		timestamps: true
	});
};
