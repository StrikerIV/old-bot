const config = require('../utils/config.json');
const axios = require('axios');
const Discord = require('discord.js');
const { guilds } = require("../index");
const DatabaseQuery = require('./DatabaseQuery');

function CreateGuildCacheObject(refresh, guildData) {
    return GuildCacheObject = {
        refresh: refresh,
        data: guildData
    }
}

/**
 * Updates guild cache.
 * @param {Discord.Guild} guild 
 * @returns {void}
 */
module.exports = async (guild, refresh) => {

    let guildCacheData = guilds.get(guild.id)

    if (!guilds.has(guild.id) || guildCacheData.refresh || refresh) {
        //guild database is not cached or needs to be refetched
        let guildDataFetch = await DatabaseQuery("SELECT * FROM guilds WHERE guild_id = ?", [guild.id])
        if (guildDataFetch.error) {
            return;
        }

        let guildData = guildDataFetch.data[0]
        if (!guildData) {
            //there is no table for the guild, add one
            let updateQuery = await DatabaseQuery("INSERT INTO guilds(guild_id) VALUES(?)", [guild.id]) 
            if(updateQuery.error) {
                return;
            }
            return module.exports(guild, true);
        }

        //now we have updated database guild data, add it to the guild cache
        guilds.set(guild.id, CreateGuildCacheObject(false, guildData))
    }

}