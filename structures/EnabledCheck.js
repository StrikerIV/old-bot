const Discord = require("discord.js");
const DatabaseQuery = require("./DatabaseQuery")

/**
 * Checks to see if the command category is enabled.
 * @param {Discord.Message}
 * @param {Commmand}
 * @returns {boolean}
 */
module.exports = async (data, message, command) => {

    let categoryToCheck = null;
    let category = command.info.category;

    switch (category) {
        case "moderation":
            categoryToCheck = "moderation_enabled";
            break;
        default:
            return true;
    }

    if (data[categoryToCheck] === 1) {
        // category is enabled
        return true;
    } else {
        //category is disabled
        return false;
    }

}

