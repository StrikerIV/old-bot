const Discord = require("discord.js")
const { PermissionError, FetchUserByName } = require("../structures/StructuresManager.js")

exports.run = async (client, message, args) => {



}

exports.info = {
    usage: null,
    command: "test",
    category: "moderation",
    description: "a",
    arguments: [
        {
            position: 0,
            argument: "<subcmd>",
            type: "SubCommand",
            required: true
        },
    ],
    permissions: [
        ["BAN_MEMBERS"],
        ["BAN_MEMBERS"]
    ],
    aliases: null,
    usageAreas: null,
    developer: false,
    cooldown: 5,
}