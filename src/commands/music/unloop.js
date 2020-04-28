/* This module allows the author to loop the current track Aqukin current audio streaming */
const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class UnLoopCommand extends BaseCommand{
    constructor() {super("unloop",[], "CONNECT", "music", false, true, "<song> or <track> or <queue>")}

    run(para){
        // shortcut variables
        const msg = para.message;
        const author = para.message.author.username;
        const { id } = msg.guild;
        const player = para.bot.music.players.get(id);
        
        

        switch(para.args[0].toLowerCase()){
            // cases for song and track
            case "song":
            case "track":
                // checks if the track is already set to loop, if so return a message to inform the author
                if (!player.trackRepeat) return msg.channel.send(`**${author}**-sama, this track is not currently set to loop.`);
                player.setTrackRepeat(false); // loop the current queue
                msg.channel.send(`**${author}**-sama, Aqukin will now unloop the current track`);
                break;
            
            // a case for queue
            case "queue":
                // checks if the queue is empty, if so return a message to inform the author
                if (player.queue.empty) return msg.channel.send(`**${author}**-sama, Aqukin the queue is currently empty.`);
                // checks if the track is already set to loop, if so return a message to inform the author
                if (!player.queueRepeat) return msg.channel.send(`**${author}**-sama, this queue is not currently set to loop.`);
                player.setTrackRepeat(false); // unloop the current audio track
                player.setQueueRepeat(false); // unloop the current queue
                msg.channel.send(`**${author}**-sama, Aqukin will now unloop the current queue`);
                break;
            
            // a default case for wrong input
            default:
                msg.channel.send(`**${author}**-sama, please use this format !unloop **<song>** or **<track>** or **<queue>**`);
                break;
        }
    }
};



    
