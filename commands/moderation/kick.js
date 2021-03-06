let { BotError, BotSuccess, CheckHeirachy, DatabaseQuery, DatabaseError } = require("../../structures/StructuresManager")
const moment = require("moment")

exports.run = async (client, message, args) => {

    let memberToKick = args.find(argument => argument.type === "GuildMember").data
    let reason = args.find(argument => argument.type === "Reason")

    let canKick = await CheckHeirachy(message, memberToKick)

    if (!canKick.above) {
        if (canKick.type === "bot") {
            return message.reply({ embeds: [BotError(client, `The bot cannot kick this user. Check the heirachy positions.`)] })
        } else {
            return message.reply({ embeds: [BotError(client, `You cannot kick this user, as they are above you in the heirachy.`)] })
        }
    }

    let updateQuery = await DatabaseQuery(`INSERT INTO guilds_cases(guild_id, user_id, moderator_id, type, reason, time_of_case) VALUES(?, ?, ?, ?, ?, ?)`, [message.guild.id, memberToKick.id, message.author.id, 'kick', reason ? `${reason.data}` : null, Date.now()])
    if (updateQuery.error) {
        return message.reply({ embeds: [DatabaseError(client)] })
    }

    memberToKick.kick({ reason: reason ? `${reason.data}` : null })
        .then((member) => {
            return message.reply({ embeds: [BotSuccess(client, `${member} has been kicked. ${reason ? `\n\nReason: \`${reason.data}\`` : ``}`, { footer: `Case #: ${updateQuery.data.insertId}` })] })
        })
        .catch(any => {
            return message.reply({ embeds: [BotError(client, `Something went wrong with kicking this user.`)] })
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
    beta: false,
    cooldown: 5,
}