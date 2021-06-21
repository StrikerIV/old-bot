const config = require("../utils/config.json");
const { DatabaseQuery } = require("../structures/StructuresManager")

exports.GuildCreate = async (guild) => {
    //bot was added to guild, create table for them

    if (config.developerMode) {
        //developer mode is enabled, all traffic is disabled except on dev server
        if (!config.developerServers.includes(guild.id)) return;
    }

    let updateQuery = await DatabaseQuery("INSERT IGNORE guilds(guild_id) VALUES (?)", [guild.id])
    if (updateQuery.error) {
        return;
    }

}