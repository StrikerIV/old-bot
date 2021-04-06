const Discord = require("discord.js");
const DatabaseQuery = require("./DatabaseQuery")

/**
 * Checks to see if the command category is enabled.
 * @param {Discord.Message}
 * @param {Commmand}
 * @returns {boolean}
 */
module.exports = async (message, command) => {

    let categoryToCheck = null;
    let category = command.info.category;

    switch (category) {
        case "moderation":
            categoryToCheck = "moderation_enabled";
            break;
        default:
            return true;
    }

    let response = await DatabaseQuery(`SELECT ${categoryToCheck} FROM guilds WHERE guild_id = ? LIMIT 1`, [message.guild.id])
    let data = response.data[0]

    if (data[Object.keys(data)[0]] === 1) {
        // category is enabled
        return true;
    } else {
        //category is disabled
        return false;
    }

}

