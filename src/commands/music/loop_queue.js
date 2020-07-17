/* This module allows the author to toggle looping/unlooping the current queue */
const { voteConstruct } = require("../../utilities/voting_system");
const { musicEmbed } = require("../../utilities/embed_constructor");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class LoopQueueCommand extends BaseCommand{
    constructor() { super("loopqueue", ["lq"], "Toggle looping/unlooping the current queue", "CONNECT", "music", false, "", "-- will toggle looping/unlooping the queue"); }

    async run(para){
        // shortcut variables
        const { message, player } = para;
        const author = message.author.username;

        // voting system
        const voteReached = await voteConstruct(para.bot, message, player, para.command);
        if(!voteReached) { return; }

        try{
            player.trackRepeat = false; // reset track loop
            player.queueRepeat = !player.queueRepeat; // toggle queue loop
            if (!player.queueRepeat) { 
                await player.loopqueue.splice(0); // clear the loop queue
                message.channel.send(`**${author}**-sama, ${para.bot.user.username} will now \`stop looping the current queue\` (* ￣ ▽ ￣) b`); 
            }
            else { message.channel.send(`**${author}**-sama, ${para.bot.user.username} will now \`loop the current queue\` (/ = ω =) /`); }    
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



    
