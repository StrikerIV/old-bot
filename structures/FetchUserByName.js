const config = require('../utils/config.json');
const axios = require('axios');
const { DiscordAPIError } = require('discord.js');

/**
 * Finds a list of users by username search.
 * @param {Discord.Message} message 
 * @param {string} search 
 * @returns {}
 */
module.exports = async (message, search) => {

    let membersToSearch = await message.guild.members.cache.find(member => member.displayName.includes(search))
    console.log(membersToSearch)

}