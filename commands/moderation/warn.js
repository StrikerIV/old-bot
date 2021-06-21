const moment = require("moment")
const Discord = require("discord.js")
const BotError = require("../../structures/BotError")
const BotOngoing = require("../../structures/BotOngoing")
const BotSuccess = require("../../structures/BotSuccess")
const DatabaseError = require("../../structures/DatabaseError")
let { GetMessageInput, CustomReactionChoice, DatabaseQuery } = require("../../structures/StructuresManager")

exports.run = async (client, message, args) => {

    let warnModifier = args.get("SubArgument").data
    let warnReasonOrUser = args.get("SubArgument")
    let warnReason = args.get("SubArgument")

    let checkforUser = await message.guild.members.fetch(warnModifier.replace(/[<@!>]/g, "")).catch(any => { return false })
    if (checkforUser) {
        // compact warn format, ex:
        // k!warn @StrikerIV coding is easy!
        if (checkforUser.deleted) {
            return message.reply({ embed: BotError(client, "The supplied `GuildMember` is `deleted`.") });
        }

        let reasonForWarn = message.content.split(" ").splice(warnReasonOrUser.position + 1).join(" ")
        let insertQuery = await DatabaseQuery("INSERT INTO guilds_cases(guild_id, user_id, moderator_id, type, reason, time_of_case) VALUES(?, ?, ?, ?, ?, ?);", [message.guild.id, checkforUser.id, message.author.id, "warn", reasonForWarn, Date.now()])
        if (insertQuery.error) {
            return message.reply({ embed: DatabaseError(client) })
        }

        return message.reply({ embed: BotSuccess(client, `${checkforUser} has been warned.\n\nReason: ${reasonForWarn}`, { footer: `Case #${insertQuery.data.insertId}` }) })
    } else if (warnModifier === "add") {

        // add warn to user
        let userToWarn = await message.guild.members.fetch(warnReasonOrUser.data.replace(/[<@!>]/g, "")).catch(() => { return false })
        if (!userToWarn) {
            return message.reply({ embed: BotError(client, "The supplied `GuildMember` is `invalid`.") })
        }

        let insertQuery = await DatabaseQuery("INSERT INTO guilds_cases(guild_id, user_id, moderator_id, type, reason, time_of_case) VALUES(?, ?, ?, ?, ?, ?);", [message.guild.id, userToWarn.id, message.author.id, "warn", warnReason.data, Date.now()])
        if (insertQuery.error) {
            return message.reply({ embed: DatabaseError(client) })
        }

        return message.reply({ embed: BotSuccess(client, `${userToWarn} has been warned.\n\nReason: ${warnReason.data}`, { footer: `Case #${insertQuery.data.insertId}` }) })
    }

    let fetchForWarnQuery = await DatabaseQuery("SELECT * FROM guilds_cases WHERE case_number = ?", [warnReasonOrUser.data])
    if (fetchForWarnQuery.error) {
        return message.reply({ embed: DatabaseError(client) })
    }

    let fetchedWarnData = fetchForWarnQuery.data[0]
    if (!fetchedWarnData) {
        return message.reply({ embed: BotError(client, "This warn does not exist.") })
    }
    if (fetchedWarnData.guild_id != message.guild.id) {
        return message.reply({ embed: BotError(client, "This warn does not pertain to your guild.") })
    }

    if (warnModifier === "edit") {
        // edit warn
        // give a little choice UI to see what they want to edit
        // whether it may be reason or if it is resolved

        if (fetchedWarnData.moderator_id != message.author.id) {
            if (!message.member.hasPermission("ADMINISTRATOR")) {
                return message.reply({ embed: BotError(client, `You cannot edit this warn.`) })
            }
        }

        let choiceToDo = await CustomReactionChoice(message, "What would you like to edit about this warn?", ["Reason", fetchedWarnData.resolved === 0 ? "Close Warn" : "Reopen Warn"])
        if (choiceToDo === null) {
            // reaction collector timed out; author didn't react to message 
            return message.reply({ embed: BotError(client, `This command has timed out.`) })
        } else if (choiceToDo === "Reason") {
            // edit the reason to user supplied message
            await message.channel.send({ embed: BotOngoing("What would you like to set the reason to?", { color: "BLUE", footer: "You have 30 seconds." }) })

            let newReason = await GetMessageInput(message, 30000)
            if (!newReason) {
                // no message was sent for warn, timed out
                return message.reply({ embed: BotError(client, `This command has timed out.`) })
            }

            let updateQuery = await DatabaseQuery("UPDATE guilds_cases SET reason = ? WHERE case_number = ?", [newReason.content, warnReasonOrUser.data])
            if (updateQuery.error) {
                return message.reply({ embed: DatabaseError(client) })
            }

            return message.reply({ embed: BotSuccess(client, `Warn \`#${warnReasonOrUser.data}\` has been set to -\n\n${newReason.content}`) })
        } else if (choiceToDo === "Close Warn") {
            // open warn, close
            let updateQuery = await DatabaseQuery("UPDATE guilds_cases SET resolved = 1 WHERE case_number = ?", [warnReasonOrUser.data])
            if (updateQuery.error) {
                return message.reply({ embed: DatabaseError(client) })
            }

            return message.reply({ embed: BotSuccess(client, `Warn \`#${warnReasonOrUser.data}\` has been closed.`) })
        } else if (choiceToDo === "Reopen Warn") {
            // closed warn, reopen
            let updateQuery = await DatabaseQuery("UPDATE guilds_cases SET resolved = 1 WHERE case_number = ?", [warnReasonOrUser.data])
            if (updateQuery.error) {
                return message.reply({ embed: DatabaseError(client) })
            }

            return message.reply({ embed: BotSuccess(client, `Warn \`#${warnReasonOrUser.data}\` has been reopened.`) })
        }
    } else if (warnModifier === "remove") {
        // remove warn from user

        let deleteMuteQuery = await DatabaseQuery("UPDATE guilds_cases SET resolved = 1 WHERE case_number = ?", [warnReasonOrUser.data])
        if (deleteMuteQuery.error) {
            return message.reply({ embed: DatabaseError(client) })
        }

        return message.reply({
            embed: BotSuccess(client, `Warn \`#${warnReasonOrUser.data}\` has been removed from <@${fetchedWarnData.user_id}>.`, { footer: `\nTip: You can edit a warn using "!warn edit <case#>"` })
        })
    } else if (warnModifier === "view") {
        // view specified warn

        let warnedUser = await message.guild.members.fetch(fetchedWarnData.user_id)

        let viewWarnEmbed = new Discord.MessageEmbed()
            .setDescription(`Warn \`#${fetchedWarnData.case_number}\` :`)
            .addField("User", `${warnedUser}`, true)
            .addField("Reason", `${fetchedWarnData.reason}`, true)
            .addField("\u200B", "\u200B")
            .addField("Moderator", `${message.member}`, true)
            .addField("Time of Warn", `${moment(fetchedWarnData.time_of_case).format("dddd, MMMM Do YYYY,[\n] h:mm:ss a [CST]")}`, true)

            .setColor(`${fetchedWarnData.resolved === 0 ? "RED" : "GREEN"}`)

        return message.reply({ embed: viewWarnEmbed })
    }
}

exports.info = {
    usage: null,
    command: "warn",
    category: "moderation",
    description: "Manipulate warns in a guild for users.",
    arguments: [
        {
            position: 0,
            argument: "<user/modifier>",
            type: "SubArgument",
            required: true
        },
        {
            position: 1,
            argument: "<reason/user/case#>",
            type: "SubArgument",
            required: true
        },
        {
            position: 2,
            argument: "<reason>",
            type: "SubArgument",
            required: false
        },
    ],
    permissions: [
        ["MANAGE_MESSAGES"],
        ["SEND_MESSAGES", "MANAGE_MESSAGES", "MANAGE_CHANNELS"]
    ],
    aliases: null,
    usageAreas: ["text"],
    developer: false,
    cooldown: 5,
}