/* this module represents the "guildCreate" event */
require("dotenv").config();
const { MessageEmbed } = require("discord.js");
const BaseEvent = require("../utilities/structures/BaseEvent");

module.exports = class GuildCreateEvent extends BaseEvent {
    constructor() { super("guildCreate"); }
    
    async run(bot, guild){
        const newGuild = await bot.settings.setPrefix(guild.id, process.env.PREFIX, 0, 0);
        await bot.settings.set(guild.id, newGuild);

        // construct the embed
        const name = bot.user.username;
        const description = `\`${name}\` will try her best to provide services at your deposal.\n
                            For the list of **commands**, try \`${newGuild.prefix}help\`.\n
                            You can always change the **current prefix** with the command \`configureprefix\` or \`cp\` for short.\n
                            You can also **mention ${name}** for **commands** instead of using the prefix, for example \`@${name} h\` should give you the list of commands.\n
                            For a more detailed guide, please prefer to [README](https://github.com/DeaLoux/Aqukin#readme).\n
                            If you need more help or considering support, join us at the [Onion Squad](https://www.youtube.com/watch?v=-aB6MQU8l1s).`;
        const embed = new MessageEmbed()
            .setColor(0x1DE2FE)
            .setThumbnail("https://media1.tenor.com/images/6833382be660b108e6947fe3f6f7ad4b/tenor.gif?itemid=16161314")
            .setTitle(`Thank you for taking \`${name}\` in`)
            .addFields({ name: "Current Prefix", value: `\`${newGuild.prefix}\`` },
                       { name: "Description", value: description })
            .setImage("https://media1.tenor.com/images/c0e9bb7fbe7ae685ca2c7aa214e82cdc/tenor.gif?itemid=17166292")
            .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");

        guild.channels.create(`YAGOO's Dream`, { 
                reason: `User guide channel`,
        }).then((channel) => {
            channel.send(`Konaqua~ masters of **${guild.name}**`, embed);
            console.log(`Added to -> ${guild.name}`);
        })
    } // end of run
} // end of module.exports
