/* This module toggles the bot's ability to reply to messages */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ToggleMessageReplyCommand extends BaseCommand{
    constructor() {super("togglemessagereply", ["tmr", "reply", "messagereply"], "Toggle enabling/disabling the message reply module", "ADMINISTRATOR", "settings", false, "", "-- will enable/disable Aqukin's ability to reply to messages")}
    
    async run(para){
        // shortcut variables
        const { message, bot, settings } = para;

        settings.reply = !settings.reply;
        await settings.save();

        let reply = settings.reply ? `${bot.user.username} will now \`enable\` the \`message reply module\` (*´꒳\`\\*)` : `${bot.user.username} has \`disabled\` the \`message reply module\` (* ￣ ▽ ￣) b`;
        message.channel.send(`**${message.author.username}**-sama, ${reply}`);
    } // end of run
}; // end of module.exports

