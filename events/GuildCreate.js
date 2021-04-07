const mysql = require("mysql")
const { DatabaseQuery } = require("../structures/StructuresManager")

exports.GuildCreate = async (guild) => {

    //bot was added to guild, create table for them
    let updateQuery = await DatabaseQuery("INSERT IGNORE guilds(guild_id) VALUES (?)", [guild.id])
    if (updateQuery.error) {
        return;
    }

}