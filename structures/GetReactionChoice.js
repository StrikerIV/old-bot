const Discord = require("discord.js")

/**
 * Returns the first reacted emoji in a reaction collector.
 * @param {Discord.ReactionCollector} reactionCollector 
 * @returns {Choice}
 */
module.exports = (reactionCollector) => {

    return new Promise(async (result) => {
        reactionCollector.on('collect', reaction => {
            reactionCollector.stop()
            result(reaction)
        })
        reactionCollector.on('end', collected => {
            result(collected.first())
        })
    })
}