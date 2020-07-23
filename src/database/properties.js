/* This module exports buffer memories property functions */
const { Users, Guilds } = require("../database/dbObjects");

// This function defines all the property functions of bot.settings
async function settings(bot){
    // set the prefix and other values
    Reflect.defineProperty(bot.settings, "setPrefix", {
        value: async function setPrefix(id, prefix, reply, react) {
            const guild = bot.settings.get(id);
            if (guild) {
                guild.prefix = prefix;
                guild.reply = reply;
                guild.react = react;
                return guild.save();
            }
            const newGuild = await Guilds.create({ guild_id: id, prefix: this.prefix, reply: this.reply, react: this.reply });
            bot.settings.set(id, newGuild);
            return newGuild;
        },
    });
    
    // toggle reply
    Reflect.defineProperty(bot.settings, "toggleReply", {
        value: async function toggleReply(id) {
            const guild = bot.settings.get(id);
            guild.reply = !guild.reply;
            return guild.save();
        },
    });
    
    // toggle react
    Reflect.defineProperty(bot.settings, "toggleReact", {
        value: async function toggleReact(id) {
            const guild = bot.settings.get(id);
            guild.react = !guild.react;
            return guild.save();
        },
    });

    // toggle react
    Reflect.defineProperty(bot.settings, "storeEmojis", {
        value: async function storeEmojis(id, emojis) {
            const guild = bot.settings.get(id);
            guild.emojis = emojis;
            return guild.save();
        },
    });
    
    // get the settings
    Reflect.defineProperty(bot.settings, "getSettings", {
        value: function getSettings(id) {
            const guild = bot.settings.get(id);
            return guild;
        },
    }); 
}


// This function defines all the property functions of bot.currency
function currency(bot){
    // add balance
    Reflect.defineProperty(bot.currency, "add", {
        value: async function add(id, amount) {
            const user = bot.currency.get(id);
            if (user) {
                user.balance += Number(amount);
                return user.save();
            }
            const newUser = await Users.create({ user_id: id, balance: amount });
            bot.currency.set(id, newUser);
            return newUser;
        },
    });
    
    // get balance
    Reflect.defineProperty(bot.currency, "getBalance", {
        value: function getBalance(id) {
            const user = bot.currency.get(id);
            return user ? user.balance : 0;
        },
    });
}

module.exports = { settings, currency };