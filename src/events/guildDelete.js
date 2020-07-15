/* this module represents the "guildDelete" event */
const BaseEvent = require("../utilities/structures/BaseEvent");

module.exports = class GuildDeleteEvent extends BaseEvent {
    constructor() { super("guildDelete"); }
    
    async run(bot, guild){
        const deletedGuild = await bot.settings.getSettings(guild.id);
        await deletedGuild.destroy();
        await bot.settings.delete(guild.id);
        console.log(`Removed from -> ${guild.name}`);
    } // end of run
} // end of module.exports
