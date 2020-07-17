/* This module embeds the mentioned user into an embed then display it */
require("dotenv").config();
const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class UsernfoCommand extends BaseCommand{
    constructor() {super("userinfo", ["ui", "user", "info"], "Provide info about the mentioned user/Aqukin/yourself", "SEND_MESSAGES", "utility", false, "[mentioned user]", "@Aqukin -- will show info about Aqukin")}
    
    async run(para) {
        // get the mentioned user
        const { message, bot } = para;
        let user;
        if(bot.mentioned && message.mentions.users.size>1) { // if the bot is mentioned and a user is also mentioned
            const users = message.mentions.users.first([2]);
            user = users[1]; // get the mentioned user
        }
        else{ user = message.mentions.users.first() || message.author; } 

        // checks if the user has tagged the bot
        let embed;
        if(user.id === bot.user.id){
            const aquaCh = "https://www.youtube.com/channel/UC1opHUrw8rvnsadT-iGp7Cg";
            const aquaTw = "https://twitter.com/minatoaqua";
            const aThumbnails = ["https://media1.tenor.com/images/6ea2ecbe506ba7a51bc4a83bd5f16ae7/tenor.gif?itemid=17126194", 
                                 "https://media1.tenor.com/images/61eb394cd2c8f2effd2c0347b58545b9/tenor.gif?itemid=16289275"];
            embed = new MessageEmbed()
                .setColor(0x1DE2FE)
                .setThumbnail(aThumbnails[Math.floor(Math.random() * Math.floor(aThumbnails.length))])
                .setTitle(`⚓ ${user.username} information (⁄ ⁄> ⁄ ▽ ⁄ <⁄ ⁄) ⚓`)
                .addFields({ name: "Nickname", value: "Baqua\nOnion\nIQ-3", inline: true },
                           { name: "Minato Aqua Channel", value: `[Aqua Ch. 湊あくあ](${aquaCh})`, inline: true },
                           { name: "Minato Aqua Twitter", value: `[@minatoaqua](${aquaTw})`, inline: true },
                           { name: "Aliases (`･ω･´)", value: "Go-Sai\nDai Tenshi\nSeigi no Mikata\nDiamond Ninja Combat Maid\nLeader of the Hololive Resistance" },
                           { name: "Description", value: `${process.env.DESC}` },
                           { name: "Version", value: `${process.env.VER}`, inline: true },
                           { name: "Date Created", value: user.createdAt.toLocaleDateString(), inline: true }, )
                           //{ name: "Author", value: `${bot.creator.tag}`, inline: true })
                .setImage("https://media1.tenor.com/images/8bb13d9fa4311f314a2d419c9d2d6c37/tenor.gif?itemid=16917426")
                .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
        } // end of if the author has tagged Aqukin
        
        else{
            const member = message.guild.member(user); // get the mention user via the guild member list
            // checks if the member is in the guild, if not return a message to inform the author
            if (!member) { return message.channel.send(`**${message.author.username}**-sama, it looks like the person you mentioned isn't in this guild (； ￣Д￣)`, para.ridingAqua); }
        
            // get the mention user role(s) in the guild
            const memberRoles = member.roles.cache
                .filter(role => role.name !== "@everyone")
                .map(role => `\`${role.name}\``).join(" ") || `**${member.displayName}**-sama does not have a role yet (ｏ ・ _ ・) ノ ”(ノ _ <、)`; 
            let title;
            // checks if the author has tagged themselve
            if(member.id === message.author.id) { title = "Your"; }
            else { title = `**${member.displayName}**-sama`; }
            // get the user nickname
            const nickname = member.nickname || "None";
        
            // construct the embed
            const { gifs } = bot.media;
            embed = new MessageEmbed()
                .setColor(0x1DE2FE)
                //.setThumbnail(thumbnails[Math.floor(Math.random() * Math.floor(thumbnails.length))])
                .setThumbnail(member.user.displayAvatarURL({format: "png", dynamic: true, size: 2048}))
                .setTitle(`${title} information ｡ ﾟ (ﾟ ^ ∀ ^ ﾟ) ﾟ｡`)
                .addFields({ name: "Tag", value: member.user.tag, inline: true },
                           { name: "Nickname", value: nickname, inline: true },
                           { name: "Date Joined", value: member.joinedAt.toLocaleDateString() },
                           { name: "Role(s)", value: memberRoles })
                //.setImage(member.user.displayAvatarURL({format: "png", dynamic: true, size: 2048}))
                .setImage(gifs[Math.floor(Math.random() * Math.floor(gifs.length))])
                .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
        }
        message.channel.send(`**${message.author.username}**-sama, this is`, embed);
    } // end of run
}; // end of module.exports