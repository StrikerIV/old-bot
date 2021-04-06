const Discord = require('discord.js');

/**
 * Displays the help embed when no parameters are supplied.
 * @param {Discord.Message} message 
 * @param {CommandInformation} info 
 * @returns {UserReply}
 */
module.exports = (message, info) => {

    let helpEmbed = new Discord.MessageEmbed()
        .setTitle(`Command | ${info.command}`)
        .setDescription("This will show proper command usage in the future.")

    return helpEmbed

}