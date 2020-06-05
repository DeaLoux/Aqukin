/* this module represents the "guildMemberAdd" event */
const BaseEvent = require("../utilities/structures/BaseEvent");

module.exports = class GuildMemberAddEvent extends BaseEvent {
    constructor() {super("guildMemberAdd");}
    
    async run(bot, member){
        const channel = await member.guild.channels.cache.find(channel => channel.id === "623712955845836842");
        const admin = await bot.users.fetch("422435290054000640");
        // check if the channel exist
        if (!channel) { return; }
        // check if the user is a bot
        if(member.user.bot) { return; }
        channel.send(`Konaqua~ **${member.displayName}**-sama, a pleasure to meet you, I am serving as a seigi no mikata, dai tenshi, tensai maid in this server.\nPlease wait for ${admin}-sama to specify your role(s) and of course please also take good care of me ٩(ˊᗜˋ*)و`,
            {files: ["https://media1.tenor.com/images/367692b626d8cc547ac0de3d3b795c5d/tenor.gif?itemid=16729158"]});
    } // end of run
} // end of module.exports
