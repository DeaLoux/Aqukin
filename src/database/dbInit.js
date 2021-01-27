/* This module initialize the database */
require("dotenv").config();
const Sequelize = require("sequelize");
const { registerMediaFiles } = require("../utilities/handlers");

const sequelize = process.env.PROJECT_DOMAIN ? 
 	new Sequelize(process.env.DATABASE_URL, {
		dialect: "postgres",
		protocol: "postgres",
		port: process.env.PORT,
		host: process.env.PROJECT_DOMAIN,
		logging: false
	}) :
	new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
		host: "localhost",
		dialect: "postgres",
		logging: false,
	});

require("../database/models/users")(sequelize, Sequelize.DataTypes);
require("../database/models/guilds")(sequelize, Sequelize.DataTypes);
require("../database/models/user_stocks")(sequelize, Sequelize.DataTypes);
const Media = require("../database/models/media")(sequelize, Sequelize.DataTypes);
const StockMarket = require("../database/models/stock_market")(sequelize, Sequelize.DataTypes);

const force = process.argv.includes("--force") || process.argv.includes("-f"); // force sync

sequelize.sync({ force }).then(async () => {
	/*
	const shop = [
		await StockMarket.upsert({ name: "Casino", cost: 120, market_share: 100 }),
		await StockMarket.upsert({ name: "Bank", cost: 250, market_share: 100 }),
		await StockMarket.upsert({ name: "Eastern Law", cost: 400, market_share: 100 }),
		await StockMarket.upsert({ name: "Western Law", cost: 400, market_share: 100 }),
		await StockMarket.upsert({ name: "Court", cost: 500, market_share: 100 }),
		await StockMarket.upsert({ name: "Government", cost: 700, market_share: 100 }),
	]; 
	await Promise.all(shop); */

	const [media] = await Media.findOrCreate({ where: { id: 1 } });
	
	await registerMediaFiles(media, "../utilities/media");
	await media.save();

	console.log("Database synced");
	sequelize.close();
}).catch(console.error);