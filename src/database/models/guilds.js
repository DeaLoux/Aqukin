/* This module defines the guilds model for the database */
require("dotenv").config();

module.exports = (sequelize, DataTypes) => {
	return sequelize.define("guilds", {
		// Default variables
		guild_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		
		prefix: {
			type: DataTypes.STRING,
			defaultValue: process.env.PREFIX,
		},

		reply: {
			type: DataTypes.BOOLEAN,
			defaultValue: FALSE,
		},

		react: {
			type: DataTypes.BOOLEAN,
			defaultValue: FALSE,
		},
	}, {
		timestamps: false,
	});
};