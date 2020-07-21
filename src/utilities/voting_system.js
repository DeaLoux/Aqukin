/* This module contruct the voting system for an command */
const { MessageEmbed, Collection } = require("discord.js");

async function voteConstruct (bot, message, player, command){
    // checks if the command require voting
    if(!bot.votingSystem.has(message.guild.id)){
        await bot.votingSystem.set(message.guild.id, new Collection())
    }

    voteCmds = await bot.votingSystem.get(message.guild.id);
    
    if(!voteCmds.has(command.name)){
        await voteCmds.set(command.name, {
            voteCount: 0,
            votesRequired: 0,
            voteReached: false,
            voters: new Collection(),
        });
    }

    votingSysVar = await voteCmds.get(command.name); 

    // check if the author has already voted
    if(votingSysVar.voters.has(message.author.id)) {
        message.channel.send(`**${message.author.username}**-sama, ${bot.user.username} has already acknowledged your vote to \`${command.description}\`, please wait for other(s) to vote (ᗒᗣᗕ)՞`);
        return votingSysVar.voteReached;
    }

    const members = player.connection.channel.members.filter(m => !m.user.bot);
    if(members.size === 1 || message.member.hasPermission("ADMINISTRATOR")){
        if(votingSysVar) { voteCmds.delete(command.name); }
        votingSysVar.voteReached = true;
    }
    // else there's at least two or more members in the voice channel
    else {
        ++votingSysVar.voteCount; // increase the vote count
        votingSysVar.voters.set(message.author.id, message.author) // the author has now voted via command
        votingSysVar.votesRequired = Math.ceil(members.size * 0.6);
        
        // Checks if more vote(s) is required
        if(votingSysVar.votesRequired > votingSysVar.voteCount){  
            // contruct and send an embed asking the members to vote
            const embed = new MessageEmbed()
                .setTitle(`Please react if you would also like to \`${command.description}\``)
                .setDescription(`${bot.user.username} require \`${votingSysVar.votesRequired}\` vote(s) to \`${command.description}\` (ｏ ・ _ ・) ノ ”(ノ _ <、)`)
                .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
            await message.channel.send(`**${message.author.username}**-sama, you have voted to \`${command.description}\`, please wait for other(s) to vote (= ω =) .. nyaa`, embed)
            
            .then(async (msg) => {
                await msg.react("⚓");
                
                // members reactions filter
                const filter = (reaction, user) => {                    
                    // checks if the user has already voted
                    if(votingSysVar.voters.has(user.id)){
                        message.channel.send(`**${user.username}**-sama, you have already voted to \`${command.description}\`, please wait for other(s) to vote (￣ ￣ |||)`);
                        return false; 
                    }; 

                    // checks if the voters are in the same voice channel with the bot
                    const { channel } = message.guild.members.cache.get(user.id).voice;
                    if (!channel) { return false; }
                    if (channel.id === player.connection.channel.id) {  
                        // checks if the voters has administrative permission
                        message.guild.members.fetch(user.id).then(async (userPerm) => {
                            if(userPerm.hasPermission("ADMINISTRATOR")){
                                votingSysVar.voteReached = true;
                                return ["⚓"].includes(reaction.emoji.name); 
                            }
                            else{
                                message.channel.send(`**${user.username}**-sama, ${bot.user.username} has acknowledge your vote to \`${command.description}\` (* ￣ ▽ ￣) b`);
                                await votingSysVar.voters.set(user.id, user); // the user has now voted via emote reation
                                return ["⚓"].includes(reaction.emoji.name); 
                            }
                        });
                    }
                    return false;
                } // end of reaction filter
                
                await msg.awaitReactions(filter, { max: votingSysVar.votesRequired, time: 24000, errors: ["time"] })
                .then(async (reactions) => {
                    votingSysVar.voteCount += await reactions.get("⚓").users.cache.filter(u => { !u.bot && !votingSysVar.voters.has(u.id) }).size; // register the reactions count into the vote count

                    // checks if the vote is reached after the reaction vote
                    if(votingSysVar.voteCount >= votingSysVar.votesRequired){ 
                        if(votingSysVar) { await voteCmds.delete(command.name); }
                        votingSysVar.voteReached = true; 
                    }
                })
                .catch(err => console.log(err));

                await msg.delete();
            })
            .catch(err => console.log(err));
        } // end of if vote has not been reached
        
        // else the vote has been reached
        else { 
            if(votingSysVar) { await voteCmds.delete(command.name); }
            votingSysVar.voteReached = true;
        }
    } // end of else there's at least two or more members in the voice channel
    return votingSysVar.voteReached;
}

module.exports = { voteConstruct }