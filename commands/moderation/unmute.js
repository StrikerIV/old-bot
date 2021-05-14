let { BotError, BotSuccess, CheckHeirachy, DatabaseQuery } = require("../../structures/StructuresManager")
const moment = require("moment")

exports.run = async (client, message, args) => {

    let userToUnmute = args.find(argument => argument.type === "GuildMember").data
    let reason = args.find(argument => argument.type === "Reason")

    let guildData = message.guild.data
    let mutedRole = guildData.muted_role_id ? await message.guild.roles.fetch(guildData.muted_role_id) : null;

    if (!mutedRole || mutedRole.deleted) {
        return message.reply({ embed: BotError(client, `There is no \`MUTED\` role, therefor no one is muted.`) })
    }

    if (!userToUnmute.roles.cache.has(mutedRole.id)) {
        return message.reply({ embed: BotError(client, `This user is not muted.`) })
    }

    // if role is different than the one in database, we update
    if(guildData.muted_role_id != mutedRole.id) {
        let updateQuery = await DatabaseQuery("UPDATE guilds SET muted_role_id = ? WHERE guild_id = ?", [mutedRole.id, message.guild.id])
        if (updateQuery.error) {
            return;
        }
    }

    // user is muted, remove role from them
    userToUnmute.roles.remove(mutedRole, "Unmuted.")
        .then((member) => {
            return message.reply({ embed: BotSuccess(client, `${member} has been unmuted. ${reason ? `\n\nReason: \`${reason.data}\`` : ``}`) })
        })
        .catch(any => {
            return message.reply({ embed: BotError(client, `Something went wrong with unmuting this user.`) })
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
    usageAreas: null,
    developer: false,
    cooldown: 5,
}