let { BotError, BotSuccess, DatabaseError, DatabaseQuery, ReactionChoice, EnableDisableCategory, EvaluateGuildCache } = require("../../structures/StructuresManager")

exports.run = async (client, message, args) => {

    let subCommand = args.find(argument => argument.type === "SubCommand").data
    let subArgument = args.find(argument => argument.type === "SubArgument")
    // let secondSubArgument = args.find(argument => argument.type === "SubArgument")

    if (subCommand === "moderation") {
        await EnableDisableCategory(client, message, args)
    }

    if (subCommand === "prefix") {
        //setting prefix for bot
        if (!subArgument) {
            return message.reply({ embed: BotError(client, "A \`prefix\` needs to be supplied to set to.") })
        }
        if (subArgument.data.length > 5) {
            return message.reply({ embed: BotError(client, "Prefixes have a max of 5 characters long.") })
        }

        let updateQuery = await DatabaseQuery("UPDATE guilds SET prefix = ? WHERE guild_id = ?", [subArgument.data, message.guild.id])
        if (updateQuery.error) {
            return message.reply({ embed: DatabaseError(client) })
        }

        //update guild cache
        await EvaluateGuildCache(message.guild, true)
        return message.reply({ embed: BotSuccess(client, `The prefix was successfully set to \`${subArgument.data}\`.\n\nAllow a minute or two for your changes to propogate.`) })
    }

}

exports.info = {
    usage: null,
    command: "settings",
    category: "administration",
    description: "Command to edit the settings for your guild.",
    arguments: [
        {
            position: 0,
            argument: "<subcmd>",
            type: "SubCommand",
            required: true
        },
        {
            position: 1,
            argument: "<subarg>",
            type: "SubArgument",
            required: false
        },
        {
            position: 1,
            argument: "<subarg>",
            type: "SubArgument",
            required: false
        }
    ],
    permissions: [
        ["ADMINISTRATOR"],
        []
    ],
    aliases: ["config", "configuration"],
    usageAreas: ["text"],
    developer: false,
    cooldown: 5,
}