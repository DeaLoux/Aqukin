/* This module allows the author to remove duplicates from the music queue */
const { musicEmbed } = require("../../utilities/embed_constructor");
const BaseCommand = require('../../utilities/structures/BaseCommand');

module.exports = class RemoveDuplicateCommand extends BaseCommand {
    constructor () { super("removeduplicate", ["rd", "duplicate"], "Remove duplicated tracks from the audio player's queue", "ADMINISTRATOR", "music", false, "", "-- will remove duplicated tracks from the queue"); }

    async run (para) {
        // shortcut variables
        const { message, player } = para;

        try { 
            player.queue = removeDuplicate(player.queue)
            message.channel.send(`**${message.author.username}**-sama, ${para.bot.user.username} has removed duplicated tracks from the queue 乁 (• ω • 乁)`); // informs the author
        } catch(err) { console.log(err); }

        /* update the currently playing embed */
        const embed = await musicEmbed(para.bot, player, player.queue[0]);
        await player.sentMessage.edit(embed) // send the embed to inform about the now playing track
            .catch(async err => {
            //console.log("Recreating the deleted music embed", err);
            player.sentMessage = await player.textChannel.send(embed);
        });
    } // end of run
} // end of module.exports

function removeDuplicate(array){
    return [...new Map(array.map(item => [item.id, item])).values()];
} // end of removeDuplicate(...) function