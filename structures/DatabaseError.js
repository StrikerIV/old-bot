const Discord = require("discord.js")

/**
 * Formats and returns a database error to return to the user.
 * @param {Discord.Client} client 
 * @returns {Discord.MessageEmbed}
 */
module.exports = (client) => {

    return new Discord.MessageEmbed()
        .setDescription(`:flushed: Woops! Looks like we're having database issues. Nothing was changed.`)
        .setColor("RED")

}