const Discord = require("discord.js")
const BotError = require("./BotError")
const HelpEmbed = require("./HelpEmbed")

function CreateArgumentObject(error, argument, data) {
    return ArgumentObject = {
        error: error,
        position: argument.position,
        type: argument.type,
        data: data
    }
}

function CreateTimeObject(units, time, milliseconds) {
    return TimeObject = {
        units: units,
        time: time,
        milliseconds: milliseconds
    }
}

/**
 * Parses arguments for commands.
 * @param {CommandInformation} info 
 * @param {Discord.Message} message 
 * @param {CommandArguments} args 
 * @returns {ArgumentObject}
 */
module.exports = async (info, message, args) => {

    let arguments = info.arguments
    let ArgumentArray = []

    for await ([index, argument] of args.entries()) {

        let commandArgument = arguments[index]
        if (!commandArgument) {
            // out of bounds, return
            break;
        }

        let type = commandArgument.type

        if (type === "SubCommand") {
            // convert to string to prevent errors
            try {
                let subCommandString = String(argument)
                ArgumentArray.push(CreateArgumentObject(false, commandArgument, subCommandString))
            } catch {
                ArgumentArray.push(CreateArgumentObject(true, commandArgument, null))
            }
        } if (type === "SubArgument") {
            // convert to string to prevent errors
            try {
                let subArgumentString = String(argument)
                ArgumentArray.push(CreateArgumentObject(false, commandArgument, subArgumentString))
            } catch {
                ArgumentArray.push(CreateArgumentObject(true, commandArgument, null))
            }
        } else if (type === "User") {
            // fetch user to check if valid
            try {
                let userString = argument.replace(/[<>@!]/gm, "")
                let user = await message.member.client.users.fetch(userString)
                ArgumentArray.push(CreateArgumentObject(false, commandArgument, user))
            } catch {
                ArgumentArray.push(CreateArgumentObject(true, commandArgument, null))
            }
        } if (type === "GuildMember") {
            //fetch and add guildmember
            try {
                let memberString = argument.replace(/[<>@!]/gm, "")
                let member = await message.guild.members.fetch(memberString)
                ArgumentArray.push(CreateArgumentObject(false, commandArgument, member))
            } catch {
                ArgumentArray.push(CreateArgumentObject(true, commandArgument, null))
            }

        } else if (type === "Time") {
            let isNumbers = argument.match(/[\d]/gm)
            if (isNumbers) {
                //we have numbers that could be time.
                let isUnits = argument.match(/[\D]/gm)
                isNumbers = parseInt(isNumbers.join(""))
                if (isUnits) {
                    //we have numbers and letters, now we check if actually time and parse accordingly
                    isUnits = isUnits.join("")
                    switch (isUnits) {
                        case "s":
                        case "second":
                        case "seconds":
                            let secondMilliseconds = isNumbers * 1000
                            let secondUnits = isNumbers != 0 && isNumbers <= 1 ? "second" : "seconds"
                            ArgumentArray.push(CreateArgumentObject(false, commandArgument, CreateTimeObject(secondUnits, isNumbers, secondMilliseconds)))
                            break;
                        case "m":
                        case "minute":
                        case "minutes":
                            let minuteMilliseconds = isNumbers * 60000
                            let minuteUnits = isNumbers != 0 && isNumbers <= 1 ? "minute" : "minutes"
                            ArgumentArray.push(CreateArgumentObject(false, commandArgument, CreateTimeObject(minuteUnits, isNumbers, minuteMilliseconds)))
                            break;
                        case "h":
                        case "hour":
                        case "hours":
                            let hourMilliseconds = isNumbers * 3600000
                            let hourUnits = isNumbers != 0 && isNumbers <= 1 ? "hour" : "hours"
                            ArgumentArray.push(CreateArgumentObject(false, commandArgument, CreateTimeObject(hourUnits, isNumbers, hourMilliseconds)))
                            break;
                        case "d":
                        case "day":
                        case "days":
                            let dayMilliseconds = isNumbers * 86400000
                            let dayUnits = isNumbers != 0 && isNumbers <= 1 ? "day" : "days"
                            ArgumentArray.push(CreateArgumentObject(false, commandArgument, CreateTimeObject(dayUnits, isNumbers, dayMilliseconds)))
                            break;
                    }
                } else {
                    //we have supplied time but no units, so we give an error
                    ArgumentArray.push(CreateArgumentObject(true, commandArgument, null))
                }
            }
        } else if (type === "Reason") {
            let reason = null
            if (ArgumentArray.some(arg => arg.type === "Time")) {
                reason = args.splice(commandArgument.position + 1, args.length).join(" ")
                commandArgument.position++
                ArgumentArray.push(CreateArgumentObject(false, commandArgument, reason))
            } else {
                reason = args.splice(commandArgument.position, args.length).join(" ")
                ArgumentArray.push(CreateArgumentObject(false, commandArgument, reason))
            }
        }

    }

    let erroredArgument = false

    ArgumentArray.forEach(argument => {
        if (argument.error) {
            erroredArgument = argument
        }
    })

    if (erroredArgument.error) {
        return erroredArgument
    } else {
        return ArgumentArray
    }

}