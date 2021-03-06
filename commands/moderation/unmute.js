let { BotError, BotSuccess, CheckHeirachy, DatabaseQuery } = require("../../structures/StructuresManager")
const moment = require("moment")

exports.run = async (client, message, args) => {

    let userToUnmute = args.find(argument => argument.type === "GuildMember").data
    let reason = args.find(argument => argument.type === "Reason")

    let guildData = message.guild.data
    let mutedRoleId = guildData.muted_role_id;
    let mutedRole = await message.guild.roles.resolve(mutedRoleId)

    if (!mutedRole) {
        mutedRole = message.guild.roles.cache.find(role => role.name === "Muted")
        if (!mutedRole) {
            return message.reply({ embeds: [BotError(client, "There is no \`Muted\` role, therefor no one is muted.")] })
        }
    }

    if (!userToUnmute.roles.cache.has(mutedRole.id)) {
        return message.reply({ embeds: [BotError(client, `This user is not muted.`)] })
    }

    // if role is different than the one in database, we update
    if (guildData.muted_role_id != mutedRole.id) {
        let updateQuery = await DatabaseQuery("UPDATE guilds SET muted_role_id = ? WHERE guild_id = ?", [mutedRole.id, message.guild.id])
        if (updateQuery.error) {
            return;
        }
    }

    // user is muted, remove role from them
    userToUnmute.roles.remove(mutedRole, "Unmuted.")
        .then((member) => {
            return message.reply({ embeds: [BotSuccess(client, `${member} has been unmuted. ${reason ? `\n\nReason: \`${reason.data}\`` : ``}`)] })
        })
        .catch(any => {
            return message.reply({ embeds: [BotError(client, `Something went wrong with unmuting this user.`)] })
        })

}

exports.info = {
    usage: null,
    command: "unmute",
    category: "moderation",
    description: "Unmutes a user in a guild.",
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
        },
    ],
    permissions: [
        ["BAN_MEMBERS"],
        ["BAN_MEMBERS"]
    ],
    aliases: null,
    usageAreas: ["text"],
    developer: false,
    beta: false,
    cooldown: 5,
}