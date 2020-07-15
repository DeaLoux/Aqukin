/* This module allows the author to enqueue Youtube URL/Playlist/Tracks from search results to the bot audio streaming */
const ytpl = require("ytpl");
const ytsr = require("ytsr");
const ytdl = require("ytdl-core");
const { convertInput } = require("../../utilities/functions");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { musicEmbed } = require("../../utilities/embed_constructor");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class PlayCommand extends BaseCommand{
    constructor() {
        super("play", ["p"], "Enqueue Youtube URL/Playlist/Tracks from search results", "CONNECT", "music", true, "<Youtube URL> or <Keywords>", "https://www.youtube.com/watch?v=-aB6MQU8l1s -- will enqueue the song");
    }

    async run (para){
        // shortcut variables
        const { bot, message, voiceChannel } = para;
        const { author, channel } = message;

        // create a player if the player for this guild does not exist
        let player = await para.player;
        if(!player) {
            player = {
                id: message.guild.id,
                textChannel: channel,
                connection: await voiceChannel.join(),
                trackRepeat: false,
                queueRepeat: false,
                seeking: false,
                queue: [],
                loopqueue: []
            };
            await bot.music.set(message.guild.id, player);
        }
        
        // search for track(s) with the given arguments
        let noResult = false;
        const query = para.args.join(" ");
        console.log(query);
        
        // if the queury is a youtube video link
        if(ytdl.validateURL(query)) {  
            // Get the song info
            await ytdl.getBasicInfo(query).then(async trackInfo => {
                const track = {
                    id: trackInfo.player_response.videoDetails.videoId,
                    url: trackInfo.video_url,
                    title: trackInfo.player_response.videoDetails.title,
                    duration: trackInfo.player_response.videoDetails.lengthSeconds,
                    requester: message.author,
                    //live: trackInfo.player_response.videoDetails.isLiveContent,
                };
                //console.log(track);
                await player.queue.push(track);
                channel.send(`**${author.username}**-sama, ${bot.user.username} has enqueued track **${track.title}** ٩(ˊᗜˋ*)و`);
            }).catch((err) => {
                noResult = true;
                message.channel.send(`**${author.username}**-sama, the video is either unvailable or does not exist 〣 (ºΔº) 〣`)});   
        }
        // if the queury is a youtube playlist link
        else if (ytpl.validateURL(query)){
            await ytpl(query, { limit:0 }).then(async playlist =>{
                playlist.items.forEach(async trackInfo => {
                    const track = {
                        id: trackInfo.id,
                        url: trackInfo.url_simple,
                        title: trackInfo.title,
                        duration: await convertInput(trackInfo.duration),
                        requester: message.author,
                    }
                    //console.log(trackInfo);
                    await player.queue.push(track);
                });
                await channel.send(`**${author.username}**-sama, ${bot.user.username} has enqueued \`${playlist.total_items}\` track(s) from the playlist **${playlist.title}** ٩(ˊᗜˋ*)و`);
            })
            .catch((err) => {
                noResult = true;
                message.channel.send(`**${author.username}**-sama, the playlist is either private or does not exist 〣 (ºΔº) 〣`)});
        }
        // else try searching youtube with the given argument
        else{
            await ytsr(query, { limit:5 }).then(async results => {
                const tracks = results.items.filter(i => i.type === "video");
                if(tracks.length === 0) {
                    noResult = true;
                    channel.send(`**${author.username}**-sama, ${bot.user.username} can't find any tracks with the given keywords (｡T ω T｡)`, para.ridingAqua);
                    return; 
                }                
                
                // embed the result(s)
                let i = 0;
                const tracksInfo = await tracks.map(r => `${++i}) [${r.title}](${r.link}) | length \`${r.duration}\``).join("\n\n"); // get the tracks info
                const embed = new MessageEmbed()
                    .setColor(0x1DE2FE)
                    .setTitle("Automatically times out in 24 seconds")
                    .setDescription(tracksInfo)
                    .setImage("https://media1.tenor.com/images/85e6b8577e925a9037d03a796588e7ed/tenor.gif?itemid=15925240")
                    .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
                const sentMessage = await message.channel.send(`**${author.username}**-sama, please enter the track number that you would like ${bot.user.username} to queue ヽ (o´∀\`) ﾉ ♪ ♬`, embed); // display the embed

                // allow the author to select a track fron the search results within the allowed time of 24s
                const filter = m => (message.author.id === m.author.id) && (m.content >= 1 && m.content <= tracks.length);
                try{
                    const response = await message.channel.awaitMessages(filter, { max: 1, maxProcessed: 1, time: 24000, errors: ["time"]}); // await the user respond within 24s
                    const entry = await response.first().content;
                    const trackInfo = tracks[entry-1];
                    const track = {
                        id: await ytdl.getURLVideoID(trackInfo.link),
                        url: trackInfo.link,
                        title: trackInfo.title,
                        duration: await convertInput(trackInfo.duration),
                        requester: message.author,
                        //live: trackInfo.live,
                    }
                    //console.log(trackInfo, track);
                    await player.queue.push(track);
                    response.first().delete(); // delete the user respond
                    message.channel.send(`**${author.username}**-sama, ${bot.user.username} has enqueued track **${tracks[entry-1].title}** ٩(ˊᗜˋ*)و`); // inform the author
                }
                catch(err) {
                    console.log(err);
                    noResult = true;
                }
                sentMessage.delete(); // delete the search results embed 
            })
            .catch((err) => {
                noResult = true;
                channel.send(`**${author.username}**-sama, An error has occured while enqueuing (ಥ﹏ಥ)`, para.ridingAqua); 
                console.log("An error has occured while enqueuing", err)});
        } // end of else the given is keyword

        // terminate the code if no results are found
        if(noResult){
            if(player.queue.length ===0){
                await player.connection.disconnect();
                await bot.music.delete(player.id);
            }
            return;
        }

        try {
            if(!player.connection.dispatcher) { await playing(bot, player); }
        } catch (err) {
            message.channel.send(`**${author.username}**-sama, the video is either unvailable or does not exist 〣 (ºΔº) 〣`);   
            console.log(err);
            bot.music.delete(message.guild.id);
        }

        // connection events
        await player.connection
            .on("error", console.error)

            .once("ready", async () => {
                console.log("ready to stream");
            })

            .once("disconnect", async () =>{
                try{ await player.sentMessage.delete(); }
                catch(err) { console.log("The message has already been manually deleted"); } // try catch in case the message got deleted manually
                await player.queue.splice(0);
                await bot.votingSystem.delete(player.id);
                await bot.music.delete(player.id);
                console.log("disconnected");
            });

        // update the currently playing embed if it exists
        if(player.sentMessage){
            const embed = await musicEmbed(para.bot, player, player.queue[0]);
            try{
                await player.sentMessage.edit(embed); // send the embed to inform about the now playing track
            } catch(err) {
                console.log("Recreating the deleted music embed", err);
                player.sentMessage = await player.textChannel.send(embed);
            }
        }
    } // end of run
}; // end of module.exports

async function playing(bot, player){
    let track = player.queue[0];
    // checks if the queue is empty
    if (!track) {
        // repeat the queue if queueRepeat is set to true
        if(player.queueRepeat){
            player.queue = await player.queue.concat(player.loopqueue);
            await player.loopqueue.splice(0);
            track = player.queue[0];
        }
        // else terminate the player
        else{
            try{
                await player.connection.disconnect();
                const sentMessage = await player.textChannel.send("The queue has ended, arigatou gozaimatshita ☆ ⌒ ヽ (* '､ ^ *) chu~", new MessageAttachment("src/utilities/pictures/bye.gif"));
                await sentMessage.delete({ timeout: 5200 });
            } catch (err) { console.log(err); }
            return;
        }
    } // end of if the queue is empty
            
    // else the queue is not empty, setup the neccessary events for the dispatcher
    let ytdlOptions = { filter: "audio" };
    let dispatcherOptions = { volume: (player.volume === null) ? 1 : player.volume };
    if(track.duration > 600){
        ytdlOptions.begin = (track.seek === null) ? 0 : track.seek*1000;
    }
    else{
        dispatcherOptions.seek = (track.seek === null) ? 0 : track.seek;
    }

    const dispatcher = player.connection
        .play(ytdl(track.url, ytdlOptions), dispatcherOptions)
        
        .on("error", async () =>{
            console.error;
            await player.textChannel.send(`**${player.queue[0].requester.username}**-sama, an error has occured when ${bot.user.username} was trying to play track **${track.title}** 	。 ゜ ゜ (´Ｏ\`) ゜ ゜。`);
            await player.queue.shift();
            await playing(bot, player);
        })

        .on("start", async () =>{
            // now playing embed constructing and sending
            player.seeking = false;
            const embed = await musicEmbed(bot, player, track);
            try{ player.sentMessage = await player.textChannel.send(embed); } // send the embed to inform about the now playing track
            catch(err) { console.log("an error has occurered trying to send the embed", err); }
        })    
            
        .on("finish", async () => {
            try{ await player.sentMessage.delete(); }
            catch(err) { console.log("The message has already been manually deleted"); }; // try catch in case the message got deleted manually

            const members = await player.connection.channel.members.filter(m => !m.user.bot);
            if(members.size === 0){
                try{
                    await player.connection.disconnect(); 
                    return player.textChannel.send(`Dear masters, please don't leave ${bot.user.username} alone in a voice chat room like that (｡╯︵╰｡)`);
                } catch(err) { console.log("Error occured while disconnecting from voice chat while being left alone", err); }
            }
            
            // loop status checks
            if(!player.seeking) {
                await bot.votingSystem.delete(player.id);
                player.queue[0].seek = 0;
                if(player.trackRepeat) { await player.queue.splice(1, 0, player.queue[0]); }
                else if(player.queueRepeat) { await player.loopqueue.push(player.queue[0]); }
            }
            
            await player.queue.shift();
            await playing(bot, player);
        });
} // end of playing(...) function

    
