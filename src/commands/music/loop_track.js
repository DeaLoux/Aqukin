/* This module allows the author to toggle looping/unlooping the current track */
const { voteConstruct } = require("../../utilities/voting_system");
const { musicEmbed } = require("../../utilities/embed_constructor");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class LoopTrackCommand extends BaseCommand{
    constructor() { 
        super("looptrack", ["lt", "ls", "loopsong"], "Toggle looping/unlooping the current track", "CONNECT", "music", false, "", "-- will toggle looping/unlooping the track");
    }

    async run(para){
        // shortcut variables
        const { message, player } = para;
        const author = message.author.username;
        
        if(player.queueRepeat) { return message.channel.send(`**${author}**-sama, please cancel the queue loop first before looping the track (￣ω￣;)`); }

        // voting system
        const voteReached = await voteConstruct(para.bot, message, player, para.command);
        if(!voteReached) { return; }

        try {
            player.trackRepeat = !player.trackRepeat; // toggle track loop
            if (!player.trackRepeat) { message.channel.send(`**${author}**-sama, ${para.bot.user.username} will now \`stop looping the current track\` (* ￣ ▽ ￣) b`); }
            else { message.channel.send(`**${author}**-sama, ${para.bot.user.username} will now \`loop the current track\` (ﾉ ≧ ∀ ≦) ﾉ`); }    
        } catch(err) { console.log(err); }
                    
        // Update the currently playing embed
        const embed = await musicEmbed(para.bot, player, player.queue[0])
        await player.sentMessage.edit(embed) // send the embed to inform about the now playing track
            .catch(async err => {
            //console.log("Recreating the deleted music embed", err);
            player.sentMessage = await player.textChannel.send(embed);
        });
    } // end of run
}; // end of module.exports 



    
