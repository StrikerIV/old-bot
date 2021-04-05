const BotError = require("./BotError")
const BotSuccess = require("./BotSuccess")
const DatabaseError = require("./DatabaseError")
const DatabaseQuery = require("./DatabaseQuery")
const ReactionChoice = require("./ReactionChoice")

module.exports = async (client, message, args) => {

    let category = args.find(argument => argument.type === "SubCommand").data
    let subArgument = args.find(argument => argument.type === "SubArgument")
    let secondSubArgument = args.find(argument => argument.type === "SubArgument")

    let statusQuery = await DatabaseQuery("SELECT * FROM guilds WHERE guild_id = ? LIMIT 1", [message.guild.id])
    if (statusQuery.error) {
        return message.reply({ embed: DatabaseError(client) })
    }

    let statusData = statusQuery.data[0]
    let categoryData = statusData[`${category}_enabled`]
    if (categoryData === 1) {
        //currently enabled
        let choice = await ReactionChoice(message, `Would you like to disable ${category} commands?`)
        if (!choice) {
            return message.reply({ embed: BotError(client, `${category[0].toUpperCase() + category.substring(1)} commands were not disabled.`) })
        }

        //chose to disable      
        let updateQuery = await DatabaseQuery(`UPDATE guilds SET ${category}_enabled = ? WHERE guild_id = ?`, [0, message.guild.id])
        if (updateQuery.error) {
            return message.reply({ embed: DatabaseError(client) })
        }
        return message.reply({ embed: BotSuccess(client, `${category[0].toUpperCase() + category.substring(1)} commands have been disabled.`) })
    } else {
        //disabled
        let choice = await ReactionChoice(message, `Would you like to enable ${category}  commands?`)
        if (!choice) {
            return message.reply({ embed: BotError(client, `${category[0].toUpperCase() + category.substring(1)} commands were not enabled.`) })
        }

        //chose to enable
        let updateQuery = await DatabaseQuery(`UPDATE guilds SET ${category}_enabled = ? WHERE guild_id = ?`, [1, message.guild.id])
        if (updateQuery.error) {
            return message.reply({ embed: DatabaseError(client) })
        }
        return message.reply({ embed: BotSuccess(client, `${category[0].toUpperCase() + category.substring(1)} commands have been enabled.`) })
    }

}