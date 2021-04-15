const { UpdateGuildCache, DatabaseQuery } = require("../structures/StructuresManager")
const { guilds } = require("../index")

exports.GuildMemberUpdate = async (oldMember, newMember) => {

    console.log("here")
    if (!guilds.has(oldMember.guild.id)) {
        //guild is not fetched currently
        await UpdateGuildCache(oldMember.guild, true)
    }

    console.log("here2")
    let guildData = guilds.get(oldMember.guild.id)
    if (guildData.refresh) {
        //data needs to be refreshed
        await UpdateGuildCache(oldMember.guild, true)
        exports.GuildMemberUpdate(oldMember, newMember)
    }

    guildData = guildData.data
    let mutedRole = guildData.muted_role_id
    let guild = oldMember.guild

    mutedRole = await guild.roles.fetch(mutedRole)
    if (!mutedRole) {
        mutedRole = guild.roles.cache.find(role => role.name === "MUTED")
        if (!mutedRole) {
            return;
        }
    }

    if (oldMember.roles.cache.has(mutedRole.id) && !newMember.roles.cache.has(mutedRole.id)) {
        //muted role was removed, therefor "unmuted"
        console.log("here")
    } else if (newMember.roles.cache.has(mutedRole.id) && !oldMember.roles.cache.has(mutedRole.id)) {
        //muted role was added, therefor "muted"
        console.log("here1")
    }
}