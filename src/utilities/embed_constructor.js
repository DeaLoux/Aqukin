/* This module construct an embed neccessary for displaying the current playing track */
const { convertBoolean, formatLength } = require("../utilities/functions");
const { MessageEmbed } = require("discord.js");

async function musicEmbed(bot, player, track){
    const { thumbnails } = bot.media;
    
    // construct the embeds
    const embed = new MessageEmbed()
        .setColor(0x1DE2FE)
        .setThumbnail(thumbnails[Math.floor(Math.random() * Math.floor(thumbnails.length))])
        .setTitle("⚓ Now Playing ~ (˘ ▽ ˘ ~) ⚓")
        .addFields({ name: "Title", value: `[${track.title}](${track.uri})` },
                   { name: "🔞Volume", value: `${Math.floor(player.volume)}`, inline: true },
                   { name: "Track Length", value: formatLength(track.duration), inline: true },
                   { name: "Queue Size", value: player.queue.size, inline: true },
                   { name: "⏸️Paused", value: convertBoolean(player.paused), inline: true },
                   { name: "Track Looped", value: convertBoolean(player.trackRepeat), inline: true },
                   { name: "Queue Looped", value: convertBoolean(player.queueRepeat), inline: true },
                   { name: "Requested by", value: `**${track.requester.username}**-sama, nanodesu~`, inline: true })
        .setImage(`https://img.youtube.com/vi/${track.identifier}/0.jpg`)
        .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
    return embed;
} // end of musicEmbed(...)

async function marketEmbed(bot, message, stocks){
    const user = bot.currency.get(message.author.id);
    let description = "";
    stocks.forEach(stock => description += `\nThe **${stock.name}**\n\`Current stock price\` -- $${stock.cost}\n\`Available share(s)\` -- ${stock.market_share}\n`);

    // construct the embed
    const { thumbnails, gifs } = bot.media;
    const embed = new MessageEmbed()
        .setColor(0x1DE2FE)
        .setThumbnail(thumbnails[Math.floor(Math.random() * Math.floor(thumbnails.length))])
        .setTitle(`${message.guild.name} Stock Market Σ (° ロ °)`)
        .addFields({ name: "Your Balance", value: `$${bot.currency.getBalance(message.author.id)}`, inline: true },
                   { name: "Economy Role", value: `${user.econrole}`, inline: true },
                   { name: "Market", value: `${description}` },)
        .setImage(gifs[Math.floor(Math.random() * Math.floor(gifs.length))])
        .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
    return embed;
} // end of marketEmbed(...)

module.exports = { marketEmbed, musicEmbed };