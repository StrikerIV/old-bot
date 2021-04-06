const Discord = require('discord.js');

/**
 * Returns a permission error embed.
 * @param {Discord.Client} client 
 * @param {string} permission 
 * @param {boolean} bot 
 * @returns {Discord.MessageEmbed}
 */
module.exports = (client, permission, bot) => {

    return new Discord.MessageEmbed()
        .setDescription(`${client.krytx} ${bot ? "The bot" : "You"} ${bot ? "requires" : "require" } the permission node \`${permission}\`.`)
        .setColor("RED")

}