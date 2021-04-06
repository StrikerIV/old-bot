let { BotError, BotSuccess, CheckHeirachy, DatabaseQuery, DatabaseError } = require("../../structures/StructuresManager")
const moment = require("moment")

exports.run = async (client, message, args) => {

    let memberToBan = args.find(argument => argument.type === "GuildMember").data
    let time = args.find(argument => argument.type === "Time")
    let reason = args.find(argument => argument.type === "Reason")

    let isBanned = await DatabaseQuery("SELECT * FROM guilds_bans WHERE user_id = ? AND guild_id = ? LIMIT 1", [memberToBan.id, memberToBan.guild.id])
    if (isBanned.error) {
        return message.reply({ embed: DatabaseError(client) })
    }

    let isBannedData = isBanned.data
    if (isBannedData[0]) {
        return message.reply({ embed: BotError(client, `This user is currently banned.`) })
    }

    let canBan = await CheckHeirachy(message, memberToBan)

    if (!canBan.above) {
        if (canBan.type === "bot") {
            return message.reply({ embed: BotError(client, `The bot cannot ban this user. Check the heirachy positions.`) })
        } else {
            return message.reply({ embed: BotError(client, `You cannot ban this user, as they are above you in the heirachy.`) })
        }
    }

    if (time) {
        let updateQuery = await DatabaseQuery("INSERT INTO guilds_bans(guild_id, user_id, reason, time) VALUES(?, ?, ?, ?)", [message.guild.id, memberToBan.id, reason ? `${reason.data}` : null, time ? moment().valueOf() + time.data.milliseconds : null])
        if (updateQuery.error) {
            return message.reply({ embed: DatabaseError(client) })
        }
    }

    memberToBan.ban({ reason: reason ? `${reason.data}` : null })
        .then((member) => {
            return message.reply({ embed: BotSuccess(client, `${member} has been banned${time ? ` for ${time.data.time} ${time.data.units}.` : `.`} ${reason ? `\n\nReason: \`${reason.data}\`` : ``}`) })
        })
        .catch(any => {
            return message.reply({ embed: BotError(client, `Something went wrong with banning this user.`) })
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
            argument: "<time>",
            type: "Time",
            required: false
        },
        {
            position: 1,
            argument: "<reason>",
            type: "Reason",
            required: false
        }
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