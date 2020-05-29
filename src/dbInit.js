/* This module initialize the database */
const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "database.sqlite",
});

const StockMarket = sequelize.import("./models/stock_market");
sequelize.import("./models/users");
sequelize.import("./models/user_stocks");

const force = process.argv.includes("--force") || process.argv.includes("-f"); // force sync

sequelize.sync({ force }).then(async () => {
	const shop = [
		StockMarket.upsert({ name: "Bank", cost: 250, market_share: 100 }),
		StockMarket.upsert({ name: "Casino", cost: 120, market_share: 100 }),
		StockMarket.upsert({ name: "Law Firm", cost: 400, market_share: 100 }),
		StockMarket.upsert({ name: "Court", cost: 500, market_share: 100 }),
	];
	await Promise.all(shop);
	console.log("Database synced");
	sequelize.close();
}).catch(console.error);