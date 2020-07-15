/* This module displays randomly one of the baqua pictures */
const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class BaquaCommand extends BaseCommand{
    constructor() {super("baqua", ["baka", "tensai", "bakaqua"], "Display randomly one of the Baqua(?) pictures", "SEND_MESSAGES", "utility", false, "", "-- will display a Baqua(?) picture")}

    async run(para) {
        const embed = new MessageEmbed()
            .setColor(0x1DE2FE)
            .setTitle("Atashi~ TENSAI (‾́ ◡ ‾́)")
            .setImage(para.bot.media.bakaqua[Math.floor(Math.random() * Math.floor(para.bot.media.bakaqua.length))])
            .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
        para.message.channel.send(embed);
    } // end of run
}; // end of module.exports