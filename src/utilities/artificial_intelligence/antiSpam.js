/* This module handles Aqukin's ability to prevent message spamming (PROTOTYPE) */
const ms = require("ms");

// This function checks for spam, very basic and will be updated
async function antiSpam(bot, message){
    const { antispam } = bot;
    const msgThreshhold = 3;
    if(message.member.hasPermission("ADMINISTRATOR")) return; // exclude spam check for admins
    // checks if the user has just sent a message recently, if not keep track of their message
    if(!antispam.msgRecently.has(message.author.id)){ 
        antispam.msgRecently.add(message.author.id) // their message will now be recorded as recently sent
        setTimeout(() => {antispam.msgRecently.delete(message.author.id)}, 2000); // rapid messages within less than 2 seconds interval will be considered spam
    }
    else { // else the user did spam
        const mutedMember = message.member;
        // checks if the user has been warned, if not warn them
        if(!antispam.warned.has(message.author.id)){
            // checks if the user has reched the thresh hold, if not only increase the thresh hold
            if(antispam.msgCount < msgThreshhold){return antispam.msgCount++;}
            
            antispam.warned.add(message.author.id); // keep a record that they had been warned
            setTimeout(() => {
                antispam.warned.delete(message.author.id);
                msgCount = 0;
            }, 30000); // the warning is effective for half a minute
            return message.channel.send(`**${mutedMember.user.username}**-sama, please don't spam, it won't make you a better person (´-﹃-\`)`); // warn them
        } // end of if

        if(antispam.msgCount < msgThreshhold*2){return antispam.msgCount++;}
        // mute them if they has already been warned and keep spaming
        const muteTime = 20000;
        currentRoles = message.member.roles.cache;
        const mutedRole = message.guild.roles.cache.find(role => role.name === "Muted");
        // checks if there exists a mute role in this guild, if not inform the author
        if (!mutedRole) { return message.channel.send(`${message.author.username}-sama, please inform the guild admins prepare a role called \`Muted\` before using any of the commands`); }
            
        antispam.muted.add(message.author.id);
        mutedMember.roles.remove(currentRoles).then(console.log).catch(console.error); // remove all current roles
        mutedMember.roles.add(mutedRole.id);
        message.channel.send(`${mutedMember.user.tag} have been muted for \`${ms(muteTime)}\` (´-﹃-\`)`, {files: ["https://media1.tenor.com/images/9d81ec7c2abd005d8da208d2f56e89df/tenor.gif?itemid=17267165"]});

        setTimeout(function(){ // after the mute
            antispam.muted.delete(message.author.id);
            mutedMember.roles.add(currentRoles); // add all the roles back
            mutedMember.roles.remove(mutedRole.id); // remove the muted role
            message.channel.send(`**${mutedMember.user.username}**-sama, muting restrictions have been lifted ( ˊᵕˋ)ﾉˊᵕˋ)`);
        }, muteTime)
    } // end of else msgRecently
} // end of spamCheck(...) function

module.exports = { antiSpam };