const Discord = require('discord.js');
const EvaluateOptions = require('./EvaluateOptions');

/**
 * Formats an "ongoing" embed. 
 * @param {string} description 
 * @param {boolean} timestamp
 * @returns {Discord.MessageEmbed}
 */
module.exports = (message, options) => {

    let OngoingEmbed = new Discord.MessageEmbed()
    if(message) {
        OngoingEmbed.setDescription(message)
    }

    return(EvaluateOptions(OngoingEmbed, options))

}