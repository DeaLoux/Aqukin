/* This module toggles the bot's ability to reply to messages */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ToggleMessageReplyCommand extends BaseCommand{
    constructor() {super("togglemessagereply", ["tmr", "mr", "messagereply", "reply"], "Toggle enabling/disabling the message reply module", "ADMINISTRATOR", "settings", false, "", "-- will enable/disable Aqukin's ability to reply to messages")}
    
    async run(para){
        // shortcut variables
        const { message, bot } = para;

        try{
            const settings = await bot.settings.toggleReply(message.guild.id);

            let reply = "";
            if(!settings.reply){ reply += `${bot.user.username} has disabled the message reply module (* ￣ ▽ ￣) b`; }
            else{ reply += `${bot.user.username} will now enable the message reply module (*´꒳\`\\*)`; }
            message.channel.send(`**${message.author.username}**-sama, ${reply}`);
        } 
        catch(err){
            console.log(err);
        }
    } // end of run
}; // end of module.exports

