/* this module represents the "message" event */
require("dotenv").config();
const BaseEvent = require("../utilities/structures/BaseEvent");
const { typeCheck, commandCheck } = require("../utilities/message_checks");
const { antiSpam } = require("../utilities/artificial_intelligence/antiSpam");
const { react, reply } = require("../utilities/artificial_intelligence/communication");
const prefix = process.env.PREFIX;
const tag = process.env.TAG;

module.exports = class MessageEvent extends BaseEvent {
    constructor() {super("message");}

    async run (bot, message){
        // exclude messages sent by bots and direct messages
        if (message.author.bot || message.channel.type === "dm") { return; }

        // anti spam
        if(bot.antispam.muted.has(message.author.id)) { return; }
        await antiSpam(bot, message);
        if(bot.antispam.warned.has(message.author.id)) { return; }
        
        // checks for command
        const iscmd = await typeCheck(bot, message, prefix, tag);
        if(!iscmd){ // checks if the message is not a command
            const args = message.content.trim().split(/ +/g);
            try{
                await react(message);
                await reply(message, args, prefix);
            } catch (err){console.log(err);} // try to react, communicate and catch any errors
            return;
        } // end of if the message is not a command
       
        // else continue with the code
        let args;
        if(bot.mentioned) { args = message.content.slice(tag.length).trim().split(/ +/g); }
        else { args = message.content.slice(prefix.length).trim().split(/ +/g); }
        if(!args) { return; }
        const commandName = args.shift().toLowerCase();
        const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        let para = await commandCheck(bot, message, command, args, prefix);

        if(!para) { return; } // checks if the parameters is returned, if not do nothing

        // try executing the command and catch any errors
        try{
            await command.run(para);
            bot.mentioned = false;
        } catch (err){console.log(err);}
    } // end of run
}// end of module.exports