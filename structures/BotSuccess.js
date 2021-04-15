const Discord = require('discord.js');
const EvaluateOptions = require('./EvaluateOptions');

/**
 * Formats a bot success to return to a user. 
 * @param {Discord.Client} client 
 * @param {string} success 
 * @returns {Discord.MessageEmbed}
 */
module.exports = (client, success, options) => {

    let SuccessEmbed = new Discord.MessageEmbed()
        .setDescription(`${client.krytcheck} ${success}`)
        .setColor("GREEN")

    return EvaluateOptions(SuccessEmbed, options)

}