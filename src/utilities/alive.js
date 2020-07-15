/* This module help Aqukin staying alive on Heroku hosting service by pinging its domaince once every 5 minutes */
const http = require("http");
const express = require("express");
const app = express();

async function alive(bot){
	app.get("/", (request, response) => {
		// console.log(Date.now() + " Ping Received");
		response.sendStatus(200);
	});
		  
	bot.port = process.env.PORT || 8080;
	app.listen(bot.port, () => {
    	console.log(`${bot.user.username} is running on port ${ bot.port }`);
	});

	setInterval(() => { http.get(`http://${process.env.PROJECT_DOMAIN}.herokuapp.com/`); }, 280000);
}

module.exports = { alive };