/* This module help Aqukin staying alive on Heroku hosting service by pinging its domaince once every 5 minutes */
const http = require('http');
const express = require('express');
const app = express();

async function alive(bot){
	bot.thumbnails = ["https://media1.tenor.com/images/5144c642df05176d7f20be7d291274b7/tenor.gif?itemid=15931764",
		"https://media1.tenor.com/images/e33ef399a8d06046ad28c0641c3fa222/tenor.gif?itemid=17189888",
		"https://media1.tenor.com/images/4b9213ff002bad456cfb61bac5c97825/tenor.gif?itemid=16773860",
		"https://media1.tenor.com/images/efd1251414b83970aa19742eb4943591/tenor.gif?itemid=16419502",
		"https://media1.tenor.com/images/1623b4c78eb882aa14aff748e8304d04/tenor.gif?itemid=16782699",
		"https://media1.tenor.com/images/97a1434f73da24d3eeb1d7a0ea7cb177/tenor.gif?itemid=16216257",
		"https://media1.tenor.com/images/f67c5255f1abd4f6a30aa4fd80b0561d/tenor.gif?itemid=16216275",
		"https://media1.tenor.com/images/78de4f7e1aaf155aff81a77712af0719/tenor.gif?itemid=16796930",
		"https://media1.tenor.com/images/7f39df2061e5eafd91f4fc40064636f0/tenor.gif?itemid=17086138",
		"https://media1.tenor.com/images/60c8206871729178793f62ae9e533632/tenor.gif?itemid=17189885",
		"https://media1.tenor.com/images/5b329ffb87073b6a48fc75685380a25c/tenor.gif?itemid=17169473",
		"https://media1.tenor.com/images/cf96cd968b6d71dc5d9c32ed7a20fab4/tenor.gif?itemid=17097490",
		"https://media1.tenor.com/images/793c6b50391d60623ba3d8316195eb2d/tenor.gif?itemid=17068399",
		"https://media1.tenor.com/images/bd16983aeafcd0446662a267791ee55f/tenor.gif?itemid=16598932",
		"https://media1.tenor.com/images/6a731a5f4651141c4eff13c467e45f38/tenor.gif?itemid=16460094",
		"https://media1.tenor.com/images/25d8ea73a241cce87c7aad65acd78ed7/tenor.gif?itemid=17267164",
		"https://media1.tenor.com/images/cc14493a42cd23e7db5a45675089b87e/tenor.gif?itemid=17042819",
		"https://media1.tenor.com/images/406ceaf8b409a4f3e1bacef2cd084592/tenor.gif?itemid=17045844",
		"https://media1.tenor.com/images/b4765f9afdbbce895c60f504810ebe90/tenor.gif?itemid=16695128",
		"https://media1.tenor.com/images/6e07fa61e38ce01b7b5cad1c923ea7f9/tenor.gif?itemid=17068401",
		"https://media1.tenor.com/images/671328a90cbd2640ce0d2785289dcc5a/tenor.gif?itemid=16643620",
		"https://media1.tenor.com/images/9066bf6cdc3f301a2baaa2dc3fc3da2b/tenor.gif?itemid=16215896",
		"https://media1.tenor.com/images/4c502ae0da035f7f80724d26e60d6a4b/tenor.gif?itemid=16215867",
		"https://media1.tenor.com/images/4407b1c7cb2c9e6fc4ec66f52c59bb33/tenor.gif?itemid=17054662",
		"https://media1.tenor.com/images/5c0aaa147cc768b7f0967616cf675bb2/tenor.gif?itemid=16652649",
		"https://media1.tenor.com/images/16eadf034787f65e5bde3b469aa45f63/tenor.gif?itemid=16958536",
		"https://vignette.wikia.nocookie.net/virtualyoutuber/images/f/fc/Framerate_detector_Ookami_Mio_V.2.gif"];

	app.get("/", (request, response) => {
		// console.log(Date.now() + " Ping Received");
		response.sendStatus(200);
	});
		  
	let PORT = process.env.PORT || 8080;
	app.listen(PORT, () => {
    	console.log(`Aqukin is running on port ${ PORT }`);
	});

	setInterval(() => { http.get(`http://${process.env.PROJECT_DOMAIN}.herokuapp.com/`); }, 280000);
}

module.exports = { alive };