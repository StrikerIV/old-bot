let { BotError, BotSuccess, CheckHeirachy, DatabaseQuery, DatabaseError } = require("../../structures/StructuresManager")
const moment = require("moment")

exports.run = async (client, message, args) => {

    let memberToKick = args.find(argument => argument.type === "GuildMember").data
    let reason = args.find(argument => argument.type === "Reason")

    let canKick = await CheckHeirachy(message, memberToKick)

    if (!canKick.above) {
        if (canKick.type === "bot") {
            return message.reply({ embed: BotError(client, `The bot cannot kick this user. Check the heirachy positions.`) })
        } else {
            return message.reply({ embed: BotError(client, `You cannot kick this user, as they are above you in the heirachy.`) })
        }
    }

    memberToKick.kick({ reason: reason ? `${reason.data}` : null })
        .then((member) => {
            return message.reply({ embed: BotSuccess(client, `${member} has been kicked. ${reason ? `\n\nReason: \`${reason.data}\`` : ``}`) })
        })
        .catch(any => {
            return message.reply({ embed: BotError(client, `Something went wrong with kicking this user.`) })
        })

}

exports.info = {
    usage: null,
    command: "kick",
    category: "moderation",
    description: "Kicks a member from a guild.",
    arguments: [
        {
            position: 0,
            argument: "<user>",
            type: "GuildMember",
            required: true
        },
        {
            position: 1,
            argument: "<reason>",
            type: "Reason",
            required: false
        }
    ],
    permissions: [
        ["KICK_MEMBERS"],
        ["SEND_MESSAGES", "KICK_MEMBERS"]
    ],
    aliases: null,
    usageAreas: ["text"],
    developer: false,
    cooldown: 5,
}