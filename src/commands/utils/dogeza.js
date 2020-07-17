/* This module displays randomly one of the Aqua dogeza pictures */
const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class DogezaCommand extends BaseCommand{
    constructor() {super("dogeza", ["d"], "Display randomly Aqua dogeza pictures", "SEND_MESSAGES", "utility", false, "", "-- will display a dogeza picture")}

    async run(para) {
        const { author, channel } = para.message;
        const embed = new MessageEmbed()
            .setColor(0x1DE2FE)
            .setTitle(`Oose no mama ni, **${author.username}**-sama`)
            .setImage(para.bot.media.dogeza[Math.floor(Math.random() * Math.floor(para.bot.media.dogeza.length))])
            .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
        channel.send(embed);
    } // end of run
}; // end of module.exports