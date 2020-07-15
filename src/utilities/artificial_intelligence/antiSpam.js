/* This module handles the bot's ability to prevent message spamming (PROTOTYPE) */
const ms = require("ms");

// This function checks for spam, very basic and will be updated
async function antiSpam(bot, message){
    const { msgThreshhold, warned, msgRecently, msgCount, muteTime, muted } = await bot.antispam.get(message.guild.id);

    if(message.member.hasPermission("ADMINISTRATOR")) { return; } // exclude spam check for admins
    
    // checks if the user has just sent a message recently, if not keep track of their message
    if(!msgRecently.has(message.author.id)){ 
        msgRecently.add(message.author.id) // their message will now be recorded as recently sent
        msgCount.set(message.author.id, 1);
        setTimeout(() => { msgRecently.delete(message.author.id); }, 2000); // rapid messages within less than 2 seconds interval will be considered spam
    }
    // else the user did spam
    else { 
        const mutedMember = message.member;
        
        // checks if the user has been warned, if not warn them
        if(!warned.has(message.author.id)){
            // checks if the user has reched the thresh hold, if not only increase the thresh hold
            if(await msgCount.get(message.author.id) < msgThreshhold){ return msgCount.set(message.author.id, msgCount.get(message.author.id)+1); }
            
            warned.add(message.author.id); // keep a record that they had been warned
            setTimeout(() => {
                warned.delete(message.author.id);
                msgCount.delete(message.author.id);
            }, 30000); // the warning is effective for half a minute
            return message.channel.send(`**${mutedMember.user.username}**-sama, please don't spam, it won't make you a better person (눈 _ 눈)`); // warn them
        } // end of if the user has not been warned

        // checks if the msgcount has passed the threshold, if not increase it, ifso process to take action
        if(await msgCount.get(message.author.id) < msgThreshhold*2){ return msgCount.set(message.author.id, msgCount.get(message.author.id)+1); }
        
        // mute them if they has already been warned and keep spaming
        currentRoles = message.member.roles.cache;
        const mutedRole = message.guild.roles.cache.find(role => role.name === "Muted");
        
        // checks if there exists a mute role in this guild, if not inform the author
        if (!mutedRole) { return message.channel.send(`${message.author.username}-sama, please inform the guild admins prepare a role called \`Muted\` before enable the antispam module (;;; * _ *)`); }
        
        try {
            await mutedMember.roles.remove(currentRoles).then(console.log) // remove all current roles
            mutedMember.roles.add(mutedRole.id);
            muted.add(message.author.id);
            message.channel.send(`${mutedMember.user.tag} have been muted for \`${ms(muteTime)}\` (* ¯︶¯ *)`, { files: ["https://media1.tenor.com/images/9d81ec7c2abd005d8da208d2f56e89df/tenor.gif?itemid=17267165"] });

            // after the mute
            setTimeout(function(){ 
                mutedMember.roles.add(currentRoles); // add all the roles back
                mutedMember.roles.remove(mutedRole.id); // remove the muted role
                muted.delete(message.author.id);
                message.channel.send(`**${mutedMember.user.username}**-sama, muting restrictions have been lifted Σ (￣。￣ ﾉ)`);
            }, muteTime)
        } catch(err) {
            console.log(err);
            //message.channel.send(`It looks like that **${message.author.username}**-sama is spamming and I can not do anything about it ＼ (º □ º l | l) /`);
        }
    } // end of else the user did spam
} // end of spamCheck(...) function

module.exports = { antiSpam };