const { MessageEmbed, Message } = require('discord.js');

module.exports = (message, info) => {

    let helpEmbed = new MessageEmbed()
        .setTitle(`Command | ${info.command}`)
        .setDescription("This will show proper command usage in the future.")

    return helpEmbed
    console.log(info)

}