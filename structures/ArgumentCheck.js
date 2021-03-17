const { Message } = require("discord.js")
const HelpEmbed = require("./HelpEmbed")

function resultObject(error, type, argument) {
    return ArgumentCheckResult = {
        error: error,
        type: type,
        argument: argument
    }
}

module.exports = (info, args) => {

    return new Promise((result) => {

        if (!args[0]) result("HelpEmbed")

        const arguments = info.arguments
        arguments.sort((a, b) => a.position < b.position)

        let requiredArguments = arguments.filter(argument => { return argument.required === true })

        if (requiredArguments.length > args.length) {
            //not enough arguments were supplied to fufil required arguments
            let missingRequiredArgument = arguments.filter(argument => { return argument.position === args.length })
            return result(resultObject(true, "missingArgument", missingRequiredArgument[0]))
        }

        return result(resultObject(false, null, null))
    })

}