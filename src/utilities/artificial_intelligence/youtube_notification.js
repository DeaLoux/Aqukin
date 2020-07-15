/* This module notify each time the given channel has uploaded a new video or live */
require("dotenv").config();
const { google } = require("googleapis");
const { MessageEmbed } = require("discord.js");

async function ytNotify(para){
    // shortcut variables
    const { message } = para;
    const author = message.author.username;
    let title;    

    const chSearchR = await channelSearch(para); // search for the channel
    console.log(chSearchR);

    // checks if the given channel is live or schedule to live soon, if so change the tittle and call the livestatus(...) function, if not return a message to inform the author
    switch(chSearchR.snippet.liveBroadcastContent){
        // a case for live
        case "live":
            title = "is now live ☆ *: .｡. o (≧ ▽ ≦) o .｡.: * ☆";
            break;

        // a case for upcoming live
        case "upcoming":
            title = "is scheduled to live soon 	(๑˃ᴗ˂) ﻭ";
            break;

        // default case for neither
        default:
            return message.channel.send(`**${author}**-sama, **${chSearchR.snippet.title}** is not live nor having any upcoming stream right now (｡ • ́︿ • ̀｡)`);
    } // end of switch case
    livestatus(chSearchR); // display the embed

    // This function searches for a youtube channel base on the given function
    async function channelSearch(para){
        // argument query
        const query = para.args.join(" ");
        console.log(query);
    
        const response = await google.youtube("v3").search.list({
            key: process.env.YOUTUBE_TOKEN,
            part: "snippet",
            type: "channel",
            q: query,
            maxResults: 1
        }); // end of google.youtube("v3").search.list(..) function
        result = response.data.items[0];
        return result;
    }// end of channelSearch(...) function
    
    // This function searches for the currently live or upcoming live video, embeds it info and send it
    async function livestatus(chSearchR){
        //const date = new Date(Date.now() - 604800000).toISOString();
        var videoEmbed;
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
            
            if(data.items.length === 0){
                return message.channel.send(`**${author}**-sama, \`${chSearchR.snippet.title}\` is not live nor having any upcoming stream right now (｡ • ́︿ • ̀｡)`);
            }
            
            data.items.forEach((video) => {
                console.log(video);
                // construct the embed
                videoEmbed = new MessageEmbed()
                    .setColor(0x1DE2FE)
                    .setThumbnail(`${chSearchR.snippet.thumbnails.default.url}`)
                    .setTitle(`${chSearchR.snippet.title} ${title}`)
                    .setDescription(`[${video.snippet.title}](https://www.youtube.com/watch?v=${video.id.videoId})`)
                    .setImage(`${video.snippet.thumbnails.high.url}`)
                    .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
                // send the embed
                message.channel.send(videoEmbed);
            }); // end of forEach loop
        }); // end of then
    } // end of livestatus(...) function
} // end of ytNotify(...) function

module.exports = { ytNotify };