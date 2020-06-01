/* This module allows the author to clear the music queue 
const { musicEmbed } = require("../../utilities/embed_constructor");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ClearQueueCommand extends BaseCommand {
  constructor () {super("clearqueue", ["cq", "clrq", "clear"], "Clear the audio player's queue", "CONNECT", "music", false, true, "");}

  async run (para) {
    // shortcut variables
    const { message, player, voteReached } = para;
    if(!voteReached) { return; }
    const author = message.author.username;

    // checks if the current queue is empty, if so return a message to inform the author
    if(player.queue.empty) { return message.channel.send(`**${author}**-sama, the audio queue is currently empty~`, para.ridingAqua); }
    const currentTrack = player.queue[0];
    await player.queue.clear();
    await player.queue.add(currentTrack);
    message.channel.send(`**${author}**-sama, Aqukin has cleared the queue`);

    // Update the currently playing embed
    const embed = await musicEmbed(para.bot.music, player, player.queue[0])
    try{
      await player.sentMessage.edit(embed); // send the embed to inform about the now playing track
    } catch(err) {
      console.log("Recreating the deleted music embed", err);
      player.sentMessage = await player.textChannel.send(embed);
    }
  } // end of run
} // end of module.exports */