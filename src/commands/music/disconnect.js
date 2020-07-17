/* This module allows the author to stop the bot current audio streaming and disconnect her from the voice channel */
const { voteConstruct } = require("../../utilities/voting_system");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class DisconnectCommand extends BaseCommand{
    constructor() {
        super("disconnect", ["dc", "leave"], "Disconnect the audio player from the voice channel", "CONNECT", "music", false, "", "-- will disconnect the audio player from the voice channel");
    }

    async run (para) {
        // shortcut variables
        const { player } = para;

        const voteReached = await voteConstruct(para.bot, para.message, player, para.command);
        if(!voteReached) { return; }

        await player.connection.disconnect();
    } // end of run
}; // end of module.exports


    
