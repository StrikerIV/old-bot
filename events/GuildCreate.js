const mysql = require("mysql")
const { DatabaseQuery } = require("../structures/StructuresManager")

exports.GuildCreate = async (guild) => {

    //bot was added to guild, we need to create table for them
    let fetchGuildQuery = await DatabaseQuery("SELECT * FROM guilds WHERE guild_id = ?", [guild.id])
    let fetchGuildData = fetchGuildQuery.data

    if (!fetchGuildData || !fetchGuildData[0]) {
        // no table exists therefor new guild
        let updateQuery = await DatabaseQuery("INSERT INTO guilds(guild_id) VALUES (?)", [guild.id])
        if(updateQuery.error) return
        
    }
}