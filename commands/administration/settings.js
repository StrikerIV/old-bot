let { BotError, BotSuccess, DatabaseError, DatabaseQuery, ReactionChoice, EnableDisableCategory } = require("../../structures/StructuresManager")

// return message.reply({ embed: SubArgumentError(client, subArgument``) })
// function SubArgumentError(client, subArgument) {
//     switch (subArgument) {
//         case "moderation":
//             return 
//     }
// }

exports.run = async (client, message, args) => {

    console.log(args)

    let subCommand = args.find(argument => argument.type === "SubCommand").data
    // let subArgument = args.find(argument => argument.type === "SubArgument")
    // let secondSubArgument = args.find(argument => argument.type === "SubArgument")

    if (subCommand === "moderation") {
        await EnableDisableCategory(client, message, args)
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