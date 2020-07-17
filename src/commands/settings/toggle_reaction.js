/* This module toggles the bot's ability to react */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ToggleReactionCommand extends BaseCommand{
    constructor() {super("togglereact", ["tr", "react"], "Toggle enabling/disabling the reaction module", "ADMINISTRATOR", "settings", false, "", "-- will enable/disable Aqukin's ability to react to messages")}
    
    async run(para){
        // shortcut variables
        const { message, bot } = para;

        try{
            const emojiList = Array.from(message.guild.emojis.cache.map(e => e.id.toString()));
            if(emojiList.length === 0){
                return message.channel.send(`**${message.author.username}**-sama, you need to have custom emojis so ${bot.user.username} can react (； ￣Д￣)`);
            }

            const settings = await bot.settings.toggleReact(message.guild.id);

            let reply = "";
            if(!settings.react){ reply += `${bot.user.username} has disabled the reaction module (* ￣ ▽ ￣) b`; }
            else{ reply += `${bot.user.username} will now enable the reaction module (ﾉ ◕ ヮ ◕) ﾉ *: ･ ﾟ ✧`; }
            message.channel.send(`**${message.author.username}**-sama, ${reply}`);
        } 
        catch(err){
            console.log(err);
        }
    } // end of run
}; // end of module.exports

