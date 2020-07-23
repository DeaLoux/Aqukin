/* this module represents the "message" event */
require("dotenv").config();
const BaseEvent = require("../utilities/structures/BaseEvent");
const { typeCheck, commandCheck } = require("../utilities/message_checks");
//const { antiSpam } = require("../utilities/artificial_intelligence/antiSpam");
const { react, reply } = require("../utilities/artificial_intelligence/communication");

module.exports = class MessageEvent extends BaseEvent {
    constructor() { super("message"); }

    async run (bot, message){
        // exclude messages sent by bots and direct messages
        if (message.author.bot || message.channel.type === "dm") { return; }

        /* anti spam
        if(bot.settings.enableantispam){
            if(bot.antispam.muted.has(message.author.id)) { return; }
            await antiSpam(bot, message);
            if(bot.antispam.warned.has(message.author.id)) { return; }
        } */
        
        // get the prefix
        let prefix
        try{
            prefix = await bot.settings.getSettings(message.guild.id).prefix;
        } 
        catch(err) {
            prefix = await bot.settings.setPrefix(message.guild.id, process.env.PREFIX, 0, 0).prefix;
        }

        // checks for command
        typeCheck(bot, message, prefix, bot.mentionCmd.tag)
            .then(async (iscmd) => {
                if(!iscmd){ // checks if the message is not a command
                    const args = message.content.trim().split(/ +/g);
                    const settings = await bot.settings.get(message.guild.id);
                    if(settings.react) { await react(message, bot); }
                    if(settings.reply) { await reply(message, args, prefix, bot.mentionCmd.tag); }
                    return;
                } // end of if the message is not a command

                // else continue with the code
                let args;
                if(await bot.mentionCmd.mentioned.get(message.guild.id)) { args = message.content.slice(bot.mentionCmd.tag.length).trim().split(/ +/g); }
                else { args = message.content.slice(prefix.length).trim().split(/ +/g); }
                if(!args) { return; }
                const commandName = args.shift().toLowerCase();
                const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
                let para = await commandCheck(bot, message, command, args, prefix);

                // checks if the parameters is returned, if not do nothing
                if(!para) { 
                    await bot.mentionCmd.mentioned.delete(message.guild.id);
                    return; 
                } 

                // try executing the command and catch any errors
                command.run(para).catch((err) => {
                    console.log(err); 
                    message.channel.send(`**${message.author.username}**-sama, \`${err}\``);
                });
                await bot.mentionCmd.mentioned.delete(message.guild.id);
            })
            .catch((err) => console.log(err));
    } // end of run
}// end of module.exports