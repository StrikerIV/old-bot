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

    if (Math.round((message.guild.members.cache.array().length / message.guild.memberCount) * 1000) / 1000 <= .50) {
        //fetch all guild members and cache if there are less than 50% of members cached
        await message.guild.members.fetch()
    }

    let membersArray = []
    let membersList = ""

    message.guild.members.cache.each(member => {
        //loop through members and find that contain search 
        if (member.displayName.toLowerCase().includes(search.toLowerCase())) {
            membersArray.push(member)
        }
    })

    membersArray.forEach((member, index) => {
        //add all found members to parsed list of members & array
        membersList = membersList + `\`${index + 1}\`: \`${member.displayName}#${member.user.discriminator}\`\n`
        membersArray.push(member)
    })

    return membersList

}