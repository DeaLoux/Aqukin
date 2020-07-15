/* This module defines the currency_shop model for the database */

module.exports = (sequelize, DataTypes) => {
	return sequelize.define("stock_market", {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		
		cost: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		
		market_share: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};