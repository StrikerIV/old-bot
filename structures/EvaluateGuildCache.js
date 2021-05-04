const config = require('../utils/config.json');
const axios = require('axios');
const Discord = require('discord.js');
const { guilds } = require("../index");
const DatabaseQuery = require('./DatabaseQuery');

function CacheObject(error, refresh, data) {
    return {
        error: error,
        refresh: refresh,
        data: data
    }
}

/**
 * Updates guild cache.
 * @param {Discord.Guild} guild 
 * @returns {void}
 */
module.exports = async (guild, refresh) => {

    return new Promise(async (result) => {
        let guildDataFetch = await DatabaseQuery("SELECT * FROM guilds WHERE guild_id = ?", [guild.id])
        console.log(guildDataFetch)
        if (guildDataFetch.error) {
            return result(CacheObject(true, null, null))
        } else {
            await guilds.set(guild.id, guildDataFetch.data)
            return result(CacheObject(false, false, guildDataFetch.data))
        }
    })

}