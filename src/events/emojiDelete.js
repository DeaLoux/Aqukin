/* this module represents the "emojiDelete" event */
const BaseEvent = require("../utilities/structures/BaseEvent");

module.exports = class EmojiDeleteEvent extends BaseEvent {
    constructor() { super("emojiDelete"); }
    
    async run(bot, emoji){
        const {id, guild} = emoji;

        const { react, emojis }  = await bot.settings.getSettings(guild.id);

        if(react){
            await emojis.splice(await emojis.indexOf(id), 1);
            bot.settings.storeEmojis(guild.id, emojis);
        }
    } // end of run
} // end of module.exports
