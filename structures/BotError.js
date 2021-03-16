const Discord = require('discord.js');

module.exports = (client, error) => {

    return new Discord.MessageEmbed()
        .setDescription(`${client.krytx} ${error}`)
        .setColor("RED")

}