/* This module help Aqukin staying alive on Heroku hosting service by pinging its domaince once every 5 minutes */
const http = require("http");
const express = require("express");
require("dotenv").config();
const app = express();

async function alive(bot){
	app.get("/", (request, response) => {
		// console.log(Date.now() + " Ping Received");
		response.sendStatus(200);
	});
		  
	let PORT = process.env.PORT || 8080;
	app.listen(PORT, () => {
    	console.log(`${bot.user.username} is running on port ${ PORT }`);
	});

	setInterval(() => { http.get(`http://${process.env.PROJECT_DOMAIN}.herokuapp.com/`); }, 280000);
}

module.exports = { alive };