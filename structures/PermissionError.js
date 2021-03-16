const Discord = require('discord.js');

module.exports = (client, permission, bot) => {

    return new Discord.MessageEmbed()
        .setDescription(`${client.krytx} ${bot ? "The bot" : "You"} ${bot ? "requires" : "require" } the permission node \`${permission}\`.`)
        .setColor("RED")

}