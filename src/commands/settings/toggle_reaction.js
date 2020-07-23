/* This module toggles the bot's ability to react */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ToggleReactionCommand extends BaseCommand{
    constructor() {super("togglereact", ["tr", "react"], "Toggle enabling/disabling the reaction module", "ADMINISTRATOR", "settings", false, "", "-- will enable/disable Aqukin's ability to react to messages")}
    
    async run(para){
        // shortcut variables
        const { message, bot } = para;

        const emojiList = Array.from(message.guild.emojis.cache.map(e => e.id.toString()));

        if(emojiList.length === 0){
            return message.channel.send(`**${message.author.username}**-sama, you need to have custom emojis so ${bot.user.username} can react (； ￣Д￣)`);
        }

        bot.settings.toggleReact(message.guild.id)
            .then(async (settings) => {
                let reply = "";
                if(!settings.react){ 
                    const { emojis } = await bot.settings.getSettings(message.guild.id);
                    await emojis.splice(0); 
                    bot.settings.storeEmojis(message.guild.id, emojis);
                    reply += `${bot.user.username} has disabled the reaction module (* ￣ ▽ ￣) b`;
                }
                else{ 
                    
                    bot.settings.storeEmojis(message.guild.id, emojiList);
                    reply += `${bot.user.username} will now enable the reaction module (ﾉ ◕ ヮ ◕) ﾉ *: ･ ﾟ ✧`; 
                }
                message.channel.send(`**${message.author.username}**-sama, ${reply}`);
            })
            .catch((err) => { console.log(err); });
    } // end of run
}; // end of module.exports

