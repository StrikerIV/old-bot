let { BotError, BotSuccess, CheckHeirachy, DatabaseQuery, DatabaseError } = require("../../structures/StructuresManager")
const Discord = require("discord.js")
const moment = require("moment")

async function createMutedRole(message) {
    let mutedRole = await message.guild.roles.create({
        name: 'MUTED',
        color: 'DEFAULT',
        reason: 'Role for muted individuals.',
    })

    let updateQuery = await DatabaseQuery("UPDATE guilds SET muted_role_id = ? WHERE guild_id = ?", [mutedRole.id, message.guild.id])
    if (updateQuery.error) {
        return false;
    }
    return mutedRole;
}

exports.run = async (client, message, args) => {

    let memberToMute = args.find(argument => argument.type === "GuildMember").data
    let time = args.find(argument => argument.type === "Time")
    let reason = args.find(argument => argument.type === "Reason")

    let mutedRole = message.guild.data.muted_role_id;
    mutedRole = await message.guild.roles.fetch(mutedRole)

    if (!mutedRole) {
        mutedRole = message.guild.roles.cache.find(role => role.name === "MUTED")
        if (!mutedRole) {
            mutedRole = await createMutedRole(message)
            if (!mutedRole) {
                return message.reply({ embed: DatabaseError(client) })
            }
        }
    }

    let isMuted = memberToMute.roles.cache.find(role => role === mutedRole)
    if (isMuted) {
        return message.reply({ embed: BotError(client, `This user is already muted.`) })
    }

    let canMute = CheckHeirachy(message, memberToMute)
    if (!canMute.above) {
        if (canMute.type === "bot") {
            return message.reply({ embed: BotError(client, `The bot cannot mute this user. Check the heirachy positions.`) })
        } else {
            return message.reply({ embed: BotError(client, `You cannot mute this user, as they are above you in the heirachy.`) })
        }
    }

    //now we need to update all channels for the role
    let channels = message.guild.channels.cache

    let textChannels = channels.filter(channel => channel.type === "text")
    let voiceChannels = channels.filter(channel => channel.type === "voice")

    // check to see if any channel does not have the muted permissions
    textChannels.forEach(async (channel) => {
        if (channel.permissionsFor(mutedRole).has("SEND_MESSAGES")) {
            // does not have permission
            try {
                channel.updateOverwrite(mutedRole, { "SEND_MESSAGES": false }, "Updating permissions for muted role.")
            } catch {
                return;
            }
        }
    })

    voiceChannels.forEach(async (channel) => {
        if (channel.permissionsFor(mutedRole).has("SPEAK")) {
            // does not have permission
            try {
                channel.updateOverwrite(mutedRole, { "SPEAK": false }, "Updating permissions for muted role.")
            } catch {
                return;
            }
        }
    })

    let updateQuery = await DatabaseQuery("INSERT INTO guilds_mutes(guild_id, user_id, reason, time_muted, time_unmuted) VALUES(?, ?, ?, ?, ?)", [message.guild.id, memberToMute.id, reason ? `${reason.data}` : null, time ? moment().valueOf() : null, time ? moment().valueOf() + time.data.milliseconds : null])
    if (updateQuery.error) {
        return message.reply({ embed: DatabaseError(client) })
    }

    memberToMute.roles.add(mutedRole, reason ? `${reason.data}` : null)
        .then((member) => {
            return message.reply({ embed: BotSuccess(client, `${member} has been muted${time ? ` for ${time.data.time} ${time.data.units}.` : `.`} ${reason ? `\n\nReason: \`${reason.data}\`` : ``}`) })
        })
        .catch(any => {
            return message.reply({ embed: BotError(client, `Something went wrong with muting this user.`) })
        })
}

exports.info = {
    usage: null,
    command: "mute",
    category: "moderation",
    description: "Mutes a member in a guild.",
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
        ["MUTE_MEMBERS"],
        ["SEND_MESSAGES", "MANAGE_CHANNELS", "MANAGE_ROLES", "BAN_MEMBERS"]
    ],
    aliases: null,
    usageAreas: null,
    developer: false,
    cooldown: 5,
}