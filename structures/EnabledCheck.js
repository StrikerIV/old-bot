const DatabaseQuery = require("./DatabaseQuery")

module.exports = async (message, command) => {

    let categoryToCheck = null;
    let category = command.category;

    switch (category) {
        case "moderation":
            categoryToCheck = "moderation_enabled";
            break;
    }

    let response = await DatabaseQuery(`SELECT moderation_enabled FROM guilds WHERE guild_id = ?`, [message.guild.id])

    let data = response.data[0]
    
    if(data[Object.keys(data)[0]] === 1) {
        // category is enabled
        return true;
    } else {
        //category is disabled
        return false;
    }

}

