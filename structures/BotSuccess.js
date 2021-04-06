const Discord = require('discord.js');

/**
 * Formats a bot success to return to a user. 
 * @param {Discord.Client} client 
 * @param {string} success 
 * @returns {Discord.MessageEmbed}
 */
module.exports = (client, success) => {

    return new Discord.MessageEmbed()
        .setDescription(`${client.krytcheck} ${success}`)
        .setColor("GREEN")

}