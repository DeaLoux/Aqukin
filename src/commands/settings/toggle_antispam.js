/* This module toggles the bot's ability to detect spam messages 
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ToggleAntiSpamCommand extends BaseCommand{
    constructor() {super("toggleantispam", ["ta","antispam"], "Toggle enabling/disabling the antispam module", "ADMINISTRATOR", "settings", false, "", "-- will enable/disable Aqukin's ability to detect spam messages")}
    
    async run(para){
        // shortcut variables
        const { message, bot } = para;
        
        bot.settings.enableantispam = !bot.settings.enableantispam;

        let reply = "";
        if(!bot.settings.enableantispam){ reply += `${bot.user.username} has disabled the antispam module (* ￣ ▽ ￣) b`; }
        else{ reply += `${bot.user.username} will now enable the antispam module (*´꒳\`\\*)`; }
        message.channel.send(`**${message.author.username}**-sama, ${reply}`);
    } // end of run
}; // end of module.exports */

