/* This module searches google for image(s) and sends them base on the given keyword 
require("dotenv").config();
const { google } = require("googleapis");
const customSearch = google.customsearch("v1");
const { MessageAttachment } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class SendCommand extends BaseCommand{
    constructor() {super("google", ["gg", "find", "send", "search"], "Search google for a random image based on the given keywords", "SEND_MESSAGES", "utility", true, "<keywords>", "minato aqua -- will search for a random picture of Minato Aqua")}

    async run(para) {
        const { message } = para;
        const query = para.args.join(" ");

        // search for the image
        customSearch.cse.list({
            auth: process.env.SEARCH_TOKEN,
            cx: process.env.SEARCH_ENGINE_ID,
            safe: "active",
            q: query,
            searchType: "image",
             num: 5
        }).then((results) => {
            if(!results) { message.channel.send(`Nihao **${message.author.username}**-sama, stop searching for porn pls`); }

            const imageUrl = results.data.items[Math.floor(Math.random() * (results.data.items.length))].link;
            message.channel.send(`**${message.author.username}**-sama, here's your search result`, new MessageAttachment(imageUrl));     
        }).catch(err => console.log(err));
    } // end of run
}; // end of module.exports */