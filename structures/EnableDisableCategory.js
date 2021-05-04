const BotError = require("./BotError")
const BotSuccess = require("./BotSuccess")
const DatabaseError = require("./DatabaseError")
const DatabaseQuery = require("./DatabaseQuery")
const ReactionChoice = require("./ReactionChoice")
const EvaluteGuildCache = require("./EvaluateGuildCache")

const validCategories = ["moderation"]

/**
 * Toggles a category on and off.
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {CommandArguments} args 
 * @returns {UserReply}
 */
module.exports = async (client, message, args) => {

    let category = args.find(argument => argument.type === "SubCommand").data
    let subArgument = args.find(argument => argument.type === "SubArgument")
    let secondSubArgument = args.find(argument => argument.type === "SubArgument")

    let statusData = message.guild.data
    let categoryData = statusData[`${category}_enabled`]

    if (subArgument && subArgument.data === "enable") {
        //enable category
        if (categoryData === 1) {
            //currently enabled, no need to update
            return message.reply({ embed: BotError(client, `${category[0].toUpperCase() + category.substring(1)} commands are already enabled.`) })
        }
        let updateQuery = await DatabaseQuery(`UPDATE guilds set ${category}_enabled = ? WHERE guild_id = ?`, [1, message.guild.id])
        if (updateQuery.error) {
            return message.reply({ embed: DatabaseError(client) })
        }

        await EvaluteGuildCache(message.guild, true)
        return message.reply({ embed: BotSuccess(client, `${category[0].toUpperCase() + category.substring(1)} commands have been enabled.`) })
    } else if (subArgument && subArgument.data === "disable") {
        //disable category
        if (categoryData === 0) {
            //currently disabled, no need to update
            return message.reply({ embed: BotError(client, `${category[0].toUpperCase() + category.substring(1)} commands are already disabled.`) })
        }
        let updateQuery = await DatabaseQuery(`UPDATE guilds set ${category}_enabled = ? WHERE guild_id = ?`, [0, message.guild.id])
        if (updateQuery.error) {
            return message.reply({ embed: DatabaseError(client) })
        }

        await EvaluteGuildCache(message.guild, true)
        return message.reply({ embed: BotSuccess(client, `${category[0].toUpperCase() + category.substring(1)} commands have been disabled.`) })
    } else {
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

            await EvaluteGuildCache(message.guild, true)
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

            await EvaluteGuildCache(message.guild, true)
            return message.reply({ embed: BotSuccess(client, `${category[0].toUpperCase() + category.substring(1)} commands have been enabled.`) })
        }
    }

}