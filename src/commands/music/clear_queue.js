/* This module allows the author to clear the music queue */
const { voteConstruct } = require("../../utilities/voting_system");
const { musicEmbed } = require("../../utilities/embed_constructor");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ClearQueueCommand extends BaseCommand {
    constructor () { super("clearqueue", ["cq", "clrq", "clear"], "Clear the audio player's queue", "CONNECT", "music", false, "", "-- will clear the queue"); }

    async run (para) {
        // shortcut variables
        const { message, player } = para;
        const author = message.author.username;

        // checks if the current queue is empty, if so return a message to inform the author
        if(player.queue.length <= 1) { return message.channel.send(`**${author}**-sama, no need to clear the queue as there is no track upcoming ╮ (︶︿︶) ╭`); }

        // voting system
        const voteReached = await voteConstruct(para.bot, message, player, para.command);
        if(!voteReached) { return; }

        try {
            await player.queue.splice(1);
            message.channel.send(`**${author}**-sama, ${para.bot.user.username} has cleared the queue (っ ˘ω˘ς)`);  
        }       catch(err) { console.log(err); }

        // Update the currently playing embed
        const embed = await musicEmbed(para.bot, player, player.queue[0])
        await player.sentMessage.edit(embed) // send the embed to inform about the now playing track
            .catch(async err => {
            //console.log("Recreating the deleted music embed", err);
            player.sentMessage = await player.textChannel.send(embed);
        });
    } // end of run
} // end of module.exports