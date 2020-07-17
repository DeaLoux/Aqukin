/* This module allows the author to resume the bot current audio streaming */
const { voteConstruct } = require("../../utilities/voting_system");
const { musicEmbed } = require("../../utilities/embed_constructor");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ResumeCommand extends BaseCommand{
    constructor() { super("resume", ["continue"], "Resume the audio player", "CONNECT", "music", false, "", "-- will resume the audio player if paused"); }

    async run(para){
        // shortcut variables
        const { message, player } = para;
        const author = message.author.username;
        
        // checks if the player is already paused, if so return a message to inform the author
        if (!player.connection.dispatcher.paused) { return message.channel.send(`**${author}**-sama, the player is not paused (つ ω\`｡)`); }

        // voting system
        const voteReached = await voteConstruct(para.bot, message, player, para.command);
        if(!voteReached) { return; }


        try{
            player.connection.dispatcher.resume();
            message.channel.send(`**${author}**-sama, ${para.bot.user.username} has resumed audio streaming \\ (★ ω ★) /`);    
        } catch(err) { console.log(err); }

        /* Update the currently playing embed */
        const embed = await musicEmbed(para.bot, player, player.queue[0])
        await player.sentMessage.edit(embed) // send the embed to inform about the now playing track
            .catch(async err => {
            //console.log("Recreating the deleted music embed", err);
            player.sentMessage = await player.textChannel.send(embed);
        });
    } // end of run
}; // end of module.exports



    
