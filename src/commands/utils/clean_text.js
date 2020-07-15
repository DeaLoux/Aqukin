/* This module cleans up a specified number of messages (max 99) */
const { checkNum } = require("../../utilities/functions");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class CleanCommand extends BaseCommand{
    constructor() {super("cleantext", ["ct", "del", "clean", "delete"], "Bulk delete a specified number of messages, default to 10 if leave blank (maximum 99)", "ADMINISTRATOR", "utility", false, "[number]", "12 -- will bulk delete 12 messages **excluding the command call**")}
    
    async run(para){
        const { message } = para;
        const { author, channel } = message;
        const num = await checkNum(para.args[0], 10, 1, true);

        // checks if the input is more than 99
        if(num>99) { return channel.send(`**${author.username}**-sama, ${para.bot.user.username} can only delete a maximum of \`99\` messages only (｡ • ́︿ • ̀｡)`); }

        // interaction
        const sentMessage = await channel.send(`Cleaning \`${num}\` messages`, {files: ["https://media1.tenor.com/images/f7b00948fa084c6de0e461ebfb12a90d/tenor.gif?itemid=17086199"]});
        await sentMessage.delete({ timeout: 3000 });
        // actual deletion
        channel.bulkDelete(num+1)
    } // end of run
}; // end of module.exports

