/* This module allows the author to skip a track in the bot current audio streaming */
const { voteConstruct } = require("../../utilities/voting_system");
const BaseCommand = require("../../utilities/structures/BaseCommand");

let USED = false; // default the command recently used check to false

module.exports = class SkipCommand extends BaseCommand{
    constructor() { super("skip", ["s", "n", "nxt", "next"], "Skip the current track", "CONNECT", "music", false, "", "-- will skip the current track"); }
    
    async run (para) {
        // shortcut variables
        const { message, player } = para;
        
        // voting system
        const voteReached = await voteConstruct(para.bot, message, player, para.command);
        if(!voteReached) { return; }

        try {
            await player.connection.dispatcher.end();
            message.channel.send(`**${message.author.username}**-sama, ${para.bot.user.username} has skipped track ヾ (⌐ ■ _ ■) ノ ♪ \`${player.queue[0].title}\``);    
        } catch(err) { console.log(err); }
    } // end of run
}; // end of module.exports




    
