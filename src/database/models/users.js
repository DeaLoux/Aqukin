/* This module defines the users model for the database */

module.exports = (sequelize, DataTypes) => {
	return sequelize.define("users", {
		// Default variables
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		
		econrole: {
			type: DataTypes.STRING,
			defaultValue: "Investor",
		},
	}, {
		timestamps: false,
	});
};