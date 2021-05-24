const config = require("../utils/config.json");
const { DatabaseQuery } = require("../structures/StructuresManager")

exports.GuildBanRemove = async (guild, user) => {
    // emitted on a ban being removed from a user
    // remove user from our database

    if (config.developerMode) {
        //developer mode is enabled, all traffic is disabled except on dev server
        if (!config.developerServers.includes(guild.id)) return;
    }

    let updateQuery = await DatabaseQuery("DELETE FROM guilds_bans WHERE guild_id = ? AND user_id = ?", [guild.id, user.id]);
    if (updateQuery.error) {
        return;
    }

}