/* This module notify each time the given channel has uploaded a new video or live */
require("dotenv").config();
const { google } = require("googleapis");
const { MessageEmbed } = require("discord.js");

async function ytNotify(para){
    // shortcut variables
    const { message } = para;
    let title;    

    const chSearchR = await channelSearch(para); // search for the channel
    //console.log(chSearchR);

    // checks if the given channel is live or schedule to live soon, if so change the tittle and call the livestatus(...) function, if not return a message to inform the author
    switch(chSearchR.snippet.liveBroadcastContent){
        // a case for live
        case "live":
            title = "Now live ☆ *: .｡. o (≧ ▽ ≦) o .｡.: * ☆";
            break;

        // a case for upcoming live
        case "upcoming":
            title = "Scheduled to live soon (๑˃ᴗ˂) ﻭ";
            break;

        // default case for neither
        default:
            title = "No upcomming live is scheduled yet (｡ • ́︿ • ̀｡)";
            const { gifs } = para.bot.media;
            const videoEmbed = new MessageEmbed()
                .setColor(0x1DE2FE)
                .setThumbnail(`${chSearchR.snippet.thumbnails.default.url}`)
                .setTitle(title)
                .addFields({name: "Channel", value: `[${chSearchR.snippet.title}](https://www.youtube.com/channel/${chSearchR.snippet.channelId})`})
                .setImage(gifs[Math.floor(Math.random() * Math.floor(gifs.length))])
                .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
            return message.channel.send(`**${message.author.username}**-sama`, videoEmbed);
    } // end of switch case
    livestatus(chSearchR); // display the embed

    // This function searches for a youtube channel base on the given function
    async function channelSearch(para){
        // argument query
        const query = para.args.join(" ");
    
        const response = await google.youtube("v3").search.list({
            key: process.env.YOUTUBE_TOKEN,
            part: "snippet",
            type: "channel",
            q: query,
            maxResults: 1
        })
        return response.data.items[0];  
    }// end of channelSearch(...) function
    
    // This function searches for the currently live or upcoming live video, embeds it info and send it
    async function livestatus(chSearchR){
        //const date = new Date(Date.now() - 604800000).toISOString();
        google.youtube("v3").search.list({
            key: process.env.YOUTUBE_TOKEN,
            part: "snippet",
            type: "video",
            order: "date",
            maxResults: 1,
            channelId: chSearchR.snippet.channelId,
            eventType: chSearchR.snippet.liveBroadcastContent,
            //publishedAfter: date,
        }).then((response) => {
            const { data } = response;
            
            data.items.forEach((video) => {
                //console.log(video);
                // construct the embed
                const videoEmbed = new MessageEmbed()
                    .setColor(0x1DE2FE)
                    .setThumbnail(`${chSearchR.snippet.thumbnails.default.url}`)
                    .setTitle(title)
                    .addFields({name: "Channel", value: `[${chSearchR.snippet.title}](https://www.youtube.com/channel/${chSearchR.snippet.channelId})`},
                               {name: "Stream Title", value: `[${video.snippet.title}](https://www.youtube.com/watch?v=${video.id.videoId})`})
                    .setImage(`${video.snippet.thumbnails.high.url}`)
                    .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
                // send the embed
                message.channel.send(`**${message.author.username}**-sama`, videoEmbed);
            }); // end of forEach loop
        }).catch(err => console.log(err));
    } // end of livestatus(...) function

} // end of ytNotify(...) function

module.exports = { ytNotify };