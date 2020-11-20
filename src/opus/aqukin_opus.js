/* Main module for Aqukin */
require("dotenv").config();
const { alive } = require("../utilities/alive");
const { Client, Collection } = require("discord.js");
const { settings, currency } = require("../database/properties");
const { registerCommands, registerEvents, consoleChatter } = require("../utilities/handlers");

// variables
const bot = new Client();
bot.antispam = new Set();
bot.mentionCmd = {
	tag: process.env.TAG,
	mentioned: new Collection()
};
bot.commands = new Collection(); // bot commands

// database variables
bot.settings = new Collection();

// variable will need to be ported to database later on
// bot.currency = new Collection(); // currency
// bot.sentMarket = new Collection(); // market message
// currency(bot);

(async ()=>{
	// opus init
	bot.music = new Collection();

	/* handlers */
	await registerEvents(bot, "../events");
	await registerCommands(bot, "../commands");
	await registerCommands(bot, "../opus/commands");
	await settings(bot);
	//await consoleChatter(bot);

	await bot.login(process.env.BOT_TOKEN); // connect the bot to the Discord server
	if(process.env.PROJECT_DOMAIN) { await alive(bot); }
})();