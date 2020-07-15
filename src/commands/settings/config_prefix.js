/* This module changes the bot's current prefix */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ConfigurePrefixCommand extends BaseCommand{
    constructor() {super("configureprefix", ["cp", "changeprefix", "prefix"], "Configure the prefix", "ADMINISTRATOR", "settings", true, "<new prefix>", `?! -- will change the bot's current prefix to ?!`)}
    
    async run(para){
        // shortcut variables
        const { message, bot } = para;

        const settings = await bot.settings.setPrefix(message.guild.id, para.args[0]);
        
        message.channel.send(`**${message.author.username}**-sama, ${bot.user.username} has changed the current prefix to \`${settings.prefix}\` ヽ (o ＾ ▽ ＾ o) ノ`);
    } // end of run
}; // end of module.exports

