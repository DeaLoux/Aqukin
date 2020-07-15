/* This module allows the author to move into a specified timestamp in current track of the bot audio stream  */
const BaseCommand = require("../../utilities/structures/BaseCommand");
const { convertInput, formatLength } = require("../../utilities/functions");

module.exports = class MoveCommand extends BaseCommand{
    constructor() {
        super("move", ["m", "to", "time"], "Move the audio player to a specified timestamp in the current track by its requester/admin", "CONNECT", "music", true, "<hh:mm:ss>", "02:32 (or 2:32 or 0:2:32 or 1:92 or 152) -- will all move the current track to the position of **2 minutes and 32 seconds**");
    }
    
    async run(para){
        // shortcut variables
        const { message, player } = para;
        const author = message.author;

        // checks if the author has administrative permission or have requested the track, if so continue, if not return a message to inform them
        if(message.author.id !== player.queue[0].requester.id && !message.member.hasPermission("ADMINISTRATOR")) { 
            return message.channel.send(`**${author.username}**-sama, this track is requested by **${player.queue[0].requester.username}**-sama, you can only move your own requested tracks (-ω- 、)`); 
        }

        const timestamp = await convertInput(para.args[0]);

        // checks if the author has requested to move to a valid timestamp, if so continue, if not return a message to inform them
        if(timestamp >= player.queue[0].duration) { return message.channel.send(`**${author.username}**-sama, the timestamp should be less than the track length \`${formatLength(player.queue[0].duration)}\` ლ (¯ ロ ¯ "ლ)`); }
        console.log(timestamp, player.queue[0].duration);
        
        // try to move to the given timestamp, inform the author if fail
        try{
            player.seeking = true;
            await player.queue.splice(1, 0, player.queue[0]);
            player.queue[1].seek = timestamp;
            await player.connection.dispatcher.end();
            // inform the author if success
            await message.channel.send(`**${author.username}**-sama, ${para.bot.user.username} will now move the current track to position \`${await formatLength(timestamp, player.seeking)}\``);
        } catch(err) {
            console.log(err);
            player.connection.moving = false;
            message.channel.send(`**${author.username}**-sama, an error has occured while trying to move the track ☆ ｏ (＞ ＜ ；) ○, ${bot.user.username} has informed **${bot.author.username}**-sama`);
        } 
    } // end of run
}; // end of module.exports 



    
