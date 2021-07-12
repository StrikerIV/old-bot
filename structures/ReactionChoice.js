const Discord = require("discord.js")
const GetReactionChoice = require("./GetReactionChoice")

/**
 * Structure to ask for a choice from a user.
 * @param {Discord.Message} message 
 * @param {string} question 
 * @returns {boolean}
 */
module.exports = async (message, question) => {

    let questionEmbed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setDescription(question)

    let questionMessage = await message.reply({ embeds: [questionEmbed] })

    await questionMessage.react(message.client.krytcheck)
    await questionMessage.react(message.client.krytx)

    const filter = (reaction, user) => user.id === message.author.id && reaction.emoji.id === message.client.krytcheck.id || reaction.emoji.id === message.client.krytx.id
    const reactionCollector = questionMessage.createReactionCollector(filter, { time: 15000 })

    let reactionChoice = await GetReactionChoice(reactionCollector)
    if (!reactionChoice) {
        // ended without valid reaction applied
        return null;
    }

    return question[reactionChoice]

}