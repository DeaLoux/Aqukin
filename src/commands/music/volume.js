/* This module allows the author to configure the volume of the bot's audio stream  */
const { checkNum } = require("../../utilities/functions");
const { musicEmbed } = require("../../utilities/embed_constructor");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class VolumeCommand extends BaseCommand{
    constructor() {
        super("setvolume", ["v", "sv", "volume"], "Set the audio player's volume by percentage (maximum 400)", "ADMINISTRATOR", "music", true, "[percentage]", "150 -- will set the volume to 150% of the default volume");
    }
    
    async run(para){
        // shortcut variables
        const { message, player } = para;
        const { author, channel } = message;

        let num = await checkNum(para.args[0], 100, 0, true);
        // checks if the author is trying to raise the volume above 4
        if (num > 400) { return channel.send(`**${author.username}**-sama, please keep the volume at \`400\` or below as ${para.bot.user.username} is concerning about your health _(´ㅅ\`)⌒)\\_`); }
        
        // set the volume
        player.volume = num/100;
        //console.log(player.volume);
        await player.connection.dispatcher.setVolume(player.volume);
        channel.send(`**${author.username}**-sama, ${para.bot.user.username} has set the volume to \`${Math.floor(player.connection.dispatcher.volume*100)}\``); // inform the author
        
        // Update the currently playing embed 
        const embed = await musicEmbed(para.bot, player, player.queue[0])
        await player.sentMessage.edit(embed) // send the embed to inform about the now playing track
            .catch(async err => {
            //console.log("Recreating the deleted music embed", err);
            player.sentMessage = await player.textChannel.send(embed);
        });
    } // end of run
}; // end of module.exports



    
