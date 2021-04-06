const Discord = require('discord.js');

/**
 * Formats a bot error to return to a user.
 * @param {Discord.Client} client 
 * @param {string} error 
 * @returns {Discord.MessageEmbed}
 */
module.exports = (client, error) => {

    return new Discord.MessageEmbed()
        .setDescription(`${client.krytx} ${error}`)
        .setColor("RED")

}