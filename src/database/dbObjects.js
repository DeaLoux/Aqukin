/* This module creates the associations between the models of the database */
require("dotenv").config();
const Sequelize = require("sequelize");

/* local 
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	host: "localhost",
	dialect: "postgres",
	logging: false,
}); */

/* server */
const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect:  "postgres",
	protocol: "postgres",
	port:     process.env.PORT,
	host:     process.env.PROJECT_DOMAIN,
	logging:   false
}); 

const Users = require("../database/models/users")(sequelize, Sequelize.DataTypes);
const Guilds = require("../database/models/guilds")(sequelize, Sequelize.DataTypes);
const StockMarket = require("../database/models/stock_market")(sequelize, Sequelize.DataTypes);
const UserStocks = require("../database/models/user_stocks")(sequelize, Sequelize.DataTypes);

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