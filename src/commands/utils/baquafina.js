/* This module displays randomly one of Aqua baquafina pictures */
const { MessageAttachment } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");
const attachments = [new MessageAttachment("src/utilities/pictures/aquafina_1.png"), new MessageAttachment("src/utilities/pictures/aquafina_2.png"), new MessageAttachment("src/utilities/pictures/aquafina_3.png"),
                    new MessageAttachment("src/utilities/pictures/aquafina_4.png"), new MessageAttachment("src/utilities/pictures/aquafina_5.png"), new MessageAttachment("src/utilities/pictures/aquafina_6.png")];

module.exports = class BaquafinaCommand extends BaseCommand{
    constructor() {super("baquafina", ["pure", "aquafina", "bakafina", "aqukinfina"], "Display randomly one of the Baquafina(?) pictures", "SEND_MESSAGES", "utility", false, "", "-- will display a Baquafina(?) picture")}

    async run(para) {
        para.message.channel.send(`Atashi~ PURE (* ¯︶¯ *)`, attachments[Math.floor(Math.random() * Math.floor(attachments.length))]);
    } // end of run
}; // end of module.exports