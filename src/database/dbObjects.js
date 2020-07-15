/* This module creates the associations between the models of the database */
require("dotenv").config();
const Sequelize = require("sequelize");

/* local
const sequelize = new Sequelize("database", "username", "password", {
	host: "localhost",
	dialect: "sqlite",
	storage: "database.sqlite",
	logging: false,
}); */

/* server */
const sequelize = new Sequelize(process.env.HEROKU_POSTGRESQL_BRONZE_URL, {
	dialect:  "postgres",
	protocol: "postgres",
	port:     process.env.PORT,
	host:     process.env.HOST,
	logging:   false
}); 

const Users = sequelize.import("../database/models/users");
const Guilds = sequelize.import("../database/models/guilds");
const StockMarket = sequelize.import("../database/models/stock_market");
const UserStocks = sequelize.import("../database/models/user_stocks");

UserStocks.belongsTo(StockMarket, { foreignKey: "stock_id", as: "stock" });

/** Users functions */
Users.prototype.addStock = async function(stock, amount) {
	const userStock = await UserStocks.findOne({where: { user_id: this.user_id, stock_id: stock.id },});

	// increase the user_share if the stock is found in the user portfolio, else add the stock to the portfolio
	if (userStock) { return userStock.increment("user_share", { by: amount }); }
	await UserStocks.create({ user_id: this.user_id, stock_id: stock.id, user_share: amount });
};

Users.prototype.getStocks = function() {
	return UserStocks.findAndCountAll({
		where: { user_id: this.user_id },
		include: ["stock"],
	});
};

module.exports = { Users, Guilds, StockMarket, UserStocks };