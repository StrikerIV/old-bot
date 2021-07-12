let { BotError, BotSuccess, CheckHeirachy, DatabaseQuery, DatabaseError } = require("../../structures/StructuresManager")

exports.run = async (client, message, args) => {

    let memberToBan = args.find(argument => argument.type === "GuildMember").data
    let time = args.find(argument => argument.type === "Time")
    let reason = args.find(argument => argument.type === "Reason")

    let isBanned = await message.guild.bans.fetch(memberToBan.id).then(ban => { return true }).catch(any => { return false })
    if (isBanned) return message.reply({ embeds: [BotError(client, "This user is banned.")] })

    let canBan = await CheckHeirachy(message, memberToBan)

    if (!canBan.above) {
        if (canBan.type === "bot") {
            return message.reply({ embeds: [BotError(client, `The bot cannot ban this user. Check the heirachy positions.`)] })
        } else {
            return message.reply({ embeds: [BotError(client, `You cannot ban this user, as they are above you in the heirachy.`)] })
        }
    }

    let timeOfBan = Date.now()
    let query = "INSERT INTO guilds_cases(guild_id, user_id, moderator_id, type, reason, time_of_case) VALUES(?, ?, ?, ?, ?, ?);"
    let params = [message.guild.id, memberToBan.id, message.author.id, "ban", reason ? `${reason.data}` : null, timeOfBan]

    if (time) {
        query = query.concat("INSERT INTO guilds_tempbans(guild_id, user_id, time_to_unban) VALUES(?, ?, ?);")
        params = params.concat([message.guild.id, memberToBan.id, timeOfBan + time.data.milliseconds])
    }

    let updateQuery = await DatabaseQuery(query, params)
    if (updateQuery.error) {
        return message.reply({ embeds: [DatabaseError(client)] })
    }

    memberToBan.ban({ reason: reason ? `${reason.data}` : null })
        .then((member) => {
            return message.reply({ embeds: [BotSuccess(client, `${member} has been banned${time ? ` for ${time.data.time} ${time.data.units}.` : `.`} ${reason ? `\n\nReason: \`${reason.data}\`` : ``}`, { footer: `Case #: ${updateQuery.data.insertId}` })] })
        })
        .catch(any => {
            return message.reply({ embeds: [BotError(client, `Something went wrong with banning this user.`)] })
        })

}

exports.info = {
    usage: null,
    command: "ban",
    category: "moderation",
    description: "Bans a member from a guild.",
    arguments: [
        {
            position: 0,
            argument: "<user>",
            type: "GuildMember",
            required: true
        },
        {
            position: 1,
            argument: "<reason/time>",
            type: "Time",
            required: false
        },
        {
            position: 1,
            argument: "<reason/time>",
            type: "Reason",
            required: false
        }
    ],
    permissions: [
        ["BAN_MEMBERS"],
        ["SEND_MESSAGES", "BAN_MEMBERS"]
    ],
    aliases: null,
    usageAreas: ["text"],
    developer: false,
    beta: false,
    cooldown: 5,
}