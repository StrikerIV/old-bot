const { UpdateGuildCache, DatabaseQuery } = require("../structures/StructuresManager")
const { guilds } = require("../index")
const { updateLocale } = require("moment")

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
        let updateQuery = await DatabaseQuery("DELETE FROM guilds_mutes WHERE guild_id = ? AND user_id = ?", [guild.id, newMember.id])
        if (updateQuery.error) {
            return;
        }
    } else if (newMember.roles.cache.has(mutedRole.id) && !oldMember.roles.cache.has(mutedRole.id)) {
        //muted role was added, therefor "muted"
        //firstly, check to see if they were already muted by the bot
        let isMuted = await DatabaseQuery("SELECT * FROM guilds_mutes WHERE guild_id = ? AND user_id = ?", [guild.id, newMember.id]);
        if (!isMuted.error) {
            if (isMuted.data[0]) return; //already in database, therefor muted
            let updateQuery = await DatabaseQuery("INSERT INTO guilds_mutes(guild_id, user_id) VALUES(?, ?", [guild.id, newMember.id]);
            if (updateQuery.error) {
                return;
            }
        }
    }
}