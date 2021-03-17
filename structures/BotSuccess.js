const Discord = require('discord.js');

module.exports = (client, success) => {

    return new Discord.MessageEmbed()
        .setDescription(`${client.krytcheck} ${success}`)
        .setColor("GREEN")

}