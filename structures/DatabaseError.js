const Discord = require("discord.js")

module.exports = (client) => {

    return new Discord.MessageEmbed()
        .setDescription(`${client.krytx} Woops! Looks like we're having database issues. Nothing was changed.`)
        .setColor("RED")

}