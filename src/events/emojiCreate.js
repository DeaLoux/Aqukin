/* this module represents the "emojiCreate" event */
const BaseEvent = require("../utilities/structures/BaseEvent");

module.exports = class EmojiCreateEvent extends BaseEvent {
    constructor() { super("emojiCreate"); }
    
    async run(bot, emoji){
        const {id, guild} = emoji;

        const { react, emojis }  = await bot.settings.getSettings(guild.id);
        
        if(react){
            await emojis.push(id);
            bot.settings.storeEmojis(guild.id, emojis);
        }
    } // end of run
} // end of module.exports
