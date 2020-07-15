/* This module exports a console chatter function and functions that handling commands and events by recursivesly look for ".js" files in commands/events folders and their sub-folders and  */
const path = require("path");
const fs = require("fs").promises;
const lineReader = require("line-reader");
const BaseEvent = require ("./structures/BaseEvent");
const BaseCommand = require ("./structures/BaseCommand");

// Commands handler
async function registerCommands(bot, dir = ""){
    const filePath = path.join(__dirname, dir);
    //console.log(filePath)
    const files = await fs.readdir(filePath);
    for(const file of files){
        const stat = await fs.lstat(path.join(filePath, file));
        if(stat.isDirectory()) registerCommands(bot, path.join(dir, file));

        if(file.endsWith(".js")){
            const Command = require(path.join(filePath, file));
            if(Command.prototype instanceof BaseCommand) {
                const cmd = new Command();
                bot.commands.set(cmd.name, cmd);
            } // end of if the file is an instance of BaseEvent
        } // end of if the file is a .js file
    } // end of for loop
} // end of registerCommands(...) function

// Events handler
async function registerEvents(bot, dir = ""){
    const filePath = path.join(__dirname, dir);
    //console.log(filePath)
    const files = await fs.readdir(filePath);
    for(const file of files){
        const stat = await fs.lstat(path.join(filePath, file));
        if(stat.isDirectory()) registerEvents(bot, path.join(dir, file));

        if(file.endsWith(".js")){
            const Event = require(path.join(filePath, file));
            if(Event.prototype instanceof BaseEvent) {
                const event = new Event();
                bot.on(event.name, event.run.bind(event, bot));
            } // end of if the file is an instance of BaseEvent
        } // end of if the file is a .js file
    } // end of for loop
} // end of registerEvents(...) function

// Text files handler
async function registerMediaFiles(bot, dir = ""){
    const filePath = path.join(__dirname, dir);
    //console.log(filePath)
    const files = await fs.readdir(filePath);
    for(const file of files){
        const stat = await fs.lstat(path.join(filePath, file));
        if(stat.isDirectory()) registerInputs(bot, path.join(dir, file));

        if(file.endsWith(".txt")){
            if(file.startsWith("thumbnails")){
                await lineReader.eachLine(`${filePath}/${file}`, async function(line) {
                    if(line.length === 0) { return; }
                    await bot.media.thumbnails.push(line);
                });
            }
            
            else if(file.startsWith("gifs")){
                await lineReader.eachLine(`${filePath}/${file}`, async function(line) {
                    if(line.length === 0) { return; }
                    await bot.media.gifs.push(line);
                });
            }

            else if(file.startsWith("baquafina")){
                await lineReader.eachLine(`${filePath}/${file}`, async function(line) {
                    if(line.length === 0) { return; }
                    await bot.media.baquafina.push(line);
                });
            }

            else if(file.startsWith("bakaqua")){
                await lineReader.eachLine(`${filePath}/${file}`, async function(line) {
                    if(line.length === 0) { return; }
                    await bot.media.bakaqua.push(line);
                });
            }

            else if(file.startsWith("dogeza")){
                await lineReader.eachLine(`${filePath}/${file}`, async function(line) {
                    if(line.length === 0) { return; }
                    await bot.media.dogeza.push(line);
                });
            }
        } // end of if the file is a .txt file 
    } // end of for loop
} // end of registerMediaFiles(...) function

// This function allows you to chat as Aqukin through the terminal  
async function consoleChatter(bot){
    let listener = process.openStdin();
    listener.addListener("data", res =>{
        let text = res.toString().trim().split(/ +/g);
        bot.channels.cache.get("623712309688401967").send(text.join(" "));
    }) // end of listener.addListener
} // end of consoleChatter(bot) function

module.exports = { registerCommands, registerEvents, registerMediaFiles, consoleChatter };