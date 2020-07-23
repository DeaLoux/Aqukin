/* This module handles the bot's communicating ability */

// This function handles the bot's random reacting ability
async function react(message, bot){
    const { emojis } = await bot.settings.getSettings(message.guild.id);

    if(emojis.length === 0){
        await bot.settings.toggleReact(message.guild.id);
        return message.channel.send(`Dear masters of **${message.guild.name}**, ${bot.user.username} will now disable the reaction module as there is no custom emojis left`);
    }

    if(Math.random() <= 0.2) {
        message.react(emojis[Math.floor(Math.random() * Math.floor(emojis.length))])
    }
} // end of react(...) function

// This function handles the bot's replying ability
async function reply(message, args, prefix, tag){
    // shortcut variables
    const author = message.author.username; // message's author username
    const channel = message.channel; // para.message.channel for short

    for (var i = 0; i < args.length; i++) { // search for matching word
        switch (args[i].toLowerCase()) {   
            case "chao":
            case "nihao":
            case "hi":
            case "hello":
            case "hey":
            case "yahallo":
            case "yahallo~":
            case "konbanwa":
            case "konbanwa~":
            case "konichiwa":
            case "konichiwa~":
            case "konaqua":
            case "konaqua~":
                channel.send(`Konaqua~ **${author}**-sama (o´ω\`o) ﾉ`)
                break;
                
            case "yo":
            case "ye":
            case "yeah":
            case "yes":
                channel.send(args[i]);
                break;
    
            case "namae":
            case "name":
            case "who":
            case "jikoshoukai":
                channel.send(`**${author}**-sama, if you want to get my info try \`${prefix}ui <tag me>\` instead (* / ▽ ＼ *)`)
                break;
    
            case "teiki":
                channel.send("Ahh...")
                break;
            
            case "see":
                if (!args[i + 1]) return;
                switch (args[i + 1].toLowerCase()) {
                    case "u":
                    case "you":
                        channel.send(`Bye bye, **${author}**-sama ＼ (⌒ ▽ ⌒)`);
                        break;
                    case "shit":
                        channel.send(`**${author}**-sama, you can't see yours or mine? (*´꒳\`*)`);
                        break;
                }
                break;
    
            case "good":
            case "gud":
                if (!args[i + 1]) return;
                switch (args[i + 1].toLowerCase()) {
                    case "morning":
                        channel.send(`Ohayo~ **${author}**-sama, have you had breakfast yet? (≧ ▽ ≦) /`)
                        break;
                    case "afternoon":
                        channel.send(`Ohayo~ **${author}**-sama, have you had lunch yet? (o´ ▽ \`o) ﾉ`);
                        break;
                    case "evening":
                        channel.send(`Konbanwa~ **${author}**-sama, have you had dinner yet? (´ ▽ \`) /`);
                        break;
                    case "day":
                        channel.send(`Good day to you too **${author}**-sama ヽ (・ ∀ ・) ﾉ`);
                        break;
                    case "night":
                        channel.send(`Oyasuminasai~ **${author}**-sama (´ ,, • ω • ,,) ♡`);
                        break;
                    case "job":
                    case "bot":
                    case "maid":
                    case "aqua":
                    case "luck":
                    case "baqua":
                    case "aqukin":
                    case "akukin":
                    case tag:
                        channel.send(`Arigatou gozaimatsu~ **${author}**-sama (⁄ ⁄ • ⁄ω⁄ • ⁄ ⁄)`);
                        break;
                    case "girl":
                    case "lady":
                    case "madam":
                        channel.send(`She truly is **${author}**-sama (￢‿￢)`);
                        break;
                    case "boy":
                    case "sir":
                    case "gentleman":
                    case "knight":
                        channel.send(`He truly is **${author}**-sama ／ (^ × ^) ＼`);
                        break;
                    case "bye":
                        channel.send(`Bye bye, **${author}**-sama ＼ (⌒ ▽ ⌒)`);
                        break;
                    default:
                        channel.send(`It truly is **${author}**-sama (☆ ω ☆)`);
                        break;
                }
                break;

            case "help":
                channel.send(`**${author}**-sama, if you need help with commands, try \`${prefix}help\` instead ⊃｡ • ́‿ • ̀｡) ⊃`);
                break;
    
            case "fighto":
                channel.send("Oohh ٩(ˊᗜˋ*)و");
                break;
    
            case "nani":
            case "nani?":
                channel.send("Omae mou shindeiru (⌐ ■ _ ■)");
                break;
    
            case "vui":
            case "lol":
            case "kusa":
            case "www":
            case "草":
            case "くさ":
                channel.send("www (〃 ▽ 〃)");
                break;
    
            case "wibu":
            case "weaboo":
            case "weeb":
            case "weebs":
                channel.send("Wibu detected (° ロ °)!");
                break;
    
            case "baka":
                channel.send("Baka janai, Baqua desu~ (＃ ＞ ＜)");
                break;
    
            case "trash":
            case "gomi":
                channel.send("Gomi janai~ (ᗒᗣᗕ)՞");
                break;
    
            case "what":
            case "huh":
            case "wut":
                channel.send("Nani? _Σ (° ロ °)");
                break;
    
            case "ohayo":
            case "ohayo~":
                channel.send(`Ohayo~ **${author}**-sama, have you had breakfast yet? (≧ ▽ ≦) /`);
                break;
    
            case "g9":
            case "oyasumi":
            case "oyasumi~":
            case "oyasuminasai":
            case "oyasuminasai~":
                channel.send(`Oyasuminasai~ **${author}**-sama (´ ,, • ω • ,,) ♡`);
                break;
        } // end of switch
    } // end of for loop
} // end of communicate(...) function

module.exports = {react, reply};