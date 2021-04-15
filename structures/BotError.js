const Discord = require('discord.js');
const EvaluateOptions = require("./EvaluateOptions")

/**
 * Formats a bot error to return to a user.
 * @param {Discord.Client} client 
 * @param {string} error 
 * @returns {Discord.MessageEmbed}
 */
module.exports = (client, error, options) => {

    let ErrorEmbed = new Discord.MessageEmbed()
        .setDescription(`${client.krytx} ${error}`)
        .setColor("RED")

    return EvaluateOptions(ErrorEmbed, options)

}