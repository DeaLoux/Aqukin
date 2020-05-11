/* This module allows the author to skip a track in Aqukin current audio streaming */
const { MessageEmbed } = require('discord.js');
const BaseCommand = require("../../utilities/structures/BaseCommand");

let USED = false; // default the command recently used check to false

module.exports = class SkipCommand extends BaseCommand{
    constructor() {super("skip", ["s", "n", "nxt", "next"], "skip a track in Aqukin current audio streaming", "CONNECT", "music", false, true, "")}
    
    async run (para) {
        // shortcut variables
        const {message, player, voteReached} = para;
        if(!voteReached) return;

        player.stop();
        message.channel.send(`**${message.author.username}**-sama, Aqukin has skipped -> **${player.queue[0].title}**`);
    } // end of run
}; // end of module.exports




    
