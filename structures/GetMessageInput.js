const Discord = require("discord.js")

/**
 * Returns a sent message for input from a channel.
 * 
 * @param {Discord.Message} message 
 * @param {Milliseconds} timeout 
 * @returns {Discord.Message}
 */
module.exports = (message, timeout) => {

    return new Promise(async (result) => {

        const filter = m => message.author.id === m.author.id
        let messageCollector = message.channel.createMessageCollector(filter, { time: timeout ?? 15000 })

        messageCollector.on('collect', message => {
            messageCollector.stop()
            result(message)
        })
        messageCollector.on('end', collected => {
            result(collected.first())
        })
    })
}