/* This module is the user interface for the bot help command */
const { MessageEmbed } = require('discord.js');
const BaseCommand = require("../../utilities/structures/BaseCommand");
const { convertBoolean } = require("../../utilities/functions");


module.exports = class HelpCommand extends BaseCommand{
    constructor() {super("help", ["h"], "Provide info about commands", "SEND_MESSAGES", "utility", false, "[command name/alias]", "move -- will show info about the move command")}
    
    async run(para) {
        // shortcut variables
        const { message, bot } = para;
        const { author, channel } = message;
        const { thumbnails, gifs } = bot.media;
        
        if(para.args.length){ // if the author has asked for help with a specific command
            const commandName = para.args[0].toLowerCase();
            const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            // checks if there's a command with the given argurment, if not return a message to inform the author
            if(!command) { 
                return channel.send(`**${author.username}**-sama, ${bot.user.username} can't find any command with that name ლ (ಠ_ಠ ლ), try \`${para.prefix}help\` if you need the commands list`); 
            }

            // construct the embed
            const cmdInfoEmbed = new MessageEmbed()
                .setColor(0x1DE2FE)
                .setThumbnail(thumbnails[Math.floor(Math.random() * Math.floor(thumbnails.length))])
                .setTitle(`[] is optional, <> is mandatory`)
                .addFields({name: "Command name", value: command.name, inline: true},
                           {name: "Aliases", value: command.aliases.join('\n'), inline: true},
                           {name: "Usage", value: `${para.prefix}${command.name} ${command.usage}`},
                           {name: "Usage Example", value: `${para.prefix}${command.name} ${command.usageEx}`},
                           {name: "Description", value: command.description},)
                .setImage(gifs[Math.floor(Math.random() * Math.floor(gifs.length))])
                .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
            channel.send(`**${author.username}**-sama, here's the info of the \`${command.name}\` command`, cmdInfoEmbed); // send out the embed
        } // end of if
        
        else { // else the author just need general help
            // get the command names
            const musicCmds = await bot.commands
                .filter(cmd => cmd.tag === "music")
                .map(cmd => `\`${cmd.name}\``).join(" ");
            const utilsCmds = await bot.commands
                .filter(cmd => cmd.tag === "utility")
                .map(cmd => `\`${cmd.name}\``).join(" ");
            /*
                const econCmds = await bot.commands
                .filter(cmd => cmd.tag === "economy")
                .map(cmd => `\`${cmd.name}\``).join(" "); */
            
            // construct the embed
            const helpEmbed = new MessageEmbed()
                .setColor(0x1DE2FE)
                .setThumbnail(thumbnails[Math.floor(Math.random() * Math.floor(thumbnails.length))])
                .setTitle(`You can try \`${para.prefix}help [command name]\` to get info on a specific command ☆ ⌒ (≧ ▽ °)`)
                .addFields({ name: "Current Prefix", value: `\`${para.prefix}\`` }, 
                           { name: "Music commands", value: musicCmds }, 
                           { name: "Ultility commands", value: utilsCmds },)
                           //{ name: "Economy commands", value: econCmds },
                .setImage(gifs[Math.floor(Math.random() * Math.floor(gifs.length))])
                .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");

            if(message.member.hasPermission("ADMINISTRATOR")){
                const settings = await bot.settings.getSettings(message.guild.id);
                const settingsCmds = await bot.commands
                    .filter(cmd => cmd.tag === "settings")
                    .map(cmd => `\`${cmd.name}\``).join(" ");
                helpEmbed.addFields(
                    { name: "Settings commands (Adminstrative rights are required)", value: settingsCmds },
                    { name: "Message Reply", value: `\`${convertBoolean(settings.reply)}\``, inline: true },
                    { name: "Message React", value: `\`${convertBoolean(settings.react)}\``, inline: true },
                    //{ name: "Current cleantext number", value: settingsCmds, inline: true }
                );
            }
            channel.send(`**${author.username}**-sama, here's the list of ${bot.user.username}'s commands (つ ≧ ▽ ≦) つ`, helpEmbed); // send out the embed
        } // end of else
    } // end of run
}; // end of module.exports