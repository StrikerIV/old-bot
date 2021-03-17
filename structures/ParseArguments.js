const { Message } = require("discord.js")
const HelpEmbed = require("./HelpEmbed")

function CreateArgumentObject(error, argument, data) {
    return ArgumentObject = {
        error: error,
        position: argument.position,
        type: argument.type,
        data: data
    }
}

module.exports = async (info, message, args) => {

    let arguments = info.arguments
    let ArgumentArray = []

    for await ([index, arg] of args.entries()) {

        let commandArgument = arguments[index]
        let type = commandArgument.type

        let hasMember = false

        if (type === "GuildMember") {
            //fetch and add guildmember
            try {
                let memberString = argument.replace(/[<>@!]/gm, "")
                let member = await message.guild.members.fetch(memberString)
                hasMember = true
                console.log("in member")
                ArgumentArray.push(CreateArgumentObject(false, commandArgument, member))
            } catch {
                ArgumentArray.push(CreateArgumentObject(true, commandArgument, null))
            }

        } else if (type === "Time") {
            //make sure that argument was time
            //skip for now i have no clue on how to do this
        } else if (type === "Reason") {
            let reason = null
            if (ArgumentArray.some(arg => arg.type === "Time")) {
                reason = args.splice(commandArgument.position + 1, args.length).join(" ")
            } else {
                reason = args.splice(commandArgument.position, args.length).join(" ")
            }
        }

    }

    let error = false

    ArgumentArray.forEach(argument => {
        if (argument.error) {
            error = true
        }
    })

    return ArgumentArray

}