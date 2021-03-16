const Discord = require("discord.js")
const { PermissionError } = require("../structures/StructuresManager.js")

exports.run = (client, message, args) => {

    let embed = new Discord.MessageEmbed()
        .setDescription("Test!")
    message.channel.send(embed)

}

exports.info = {
    usage: null,
    command: "test",
    description: "Test command.",
    permissions: [
        [],
        []
    ],
    usageAreas: null,
    developer: true,
    cooldown: null,
    aliases: null
}