const config = require('../utils/config.json');
const axios = require('axios');
const Discord = require('discord.js');
const { guilds } = require("../index");
const DatabaseQuery = require('./DatabaseQuery');
const { monthsShort } = require('moment');

/**
 * Updates guild cache.
 * @param {Discord.Guild} guild 
 * @returns {void}
 */
module.exports = async (guild) => {

    return new Promise(async (result) => {
        let guildDataFetch = await DatabaseQuery("SELECT * FROM guilds WHERE guild_id = ?", [guild.id]);

        if (guildDataFetch.error) {
            return module.exports(guild);
        } else {
            await guilds.set(guild.id, guildDataFetch.data[0])
            return result(guildDataFetch.data[0])
        }
    })

}