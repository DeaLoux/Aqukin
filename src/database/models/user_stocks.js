/* This module defines the user_items model for the database */

module.exports = (sequelize, DataTypes) => {
	return sequelize.define("user_stocks", {
		user_id: DataTypes.STRING,
		
		stock_id: DataTypes.STRING,
		
		user_share: {
			type: DataTypes.INTEGER,
			allowNull: false,
			"default": 0,
		},
	}, {
		timestamps: false,
	});
};