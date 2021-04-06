const Discord = require("discord.js")

async function getChoice(reactionCollector) {

    return new Promise(async (result) => {
        await reactionCollector.on('collect', reaction => {
            result(reaction)
        })
    })

}

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

    let questionMessage = await message.reply({ embed: questionEmbed })

    await questionMessage.react(message.client.krytcheck)
    await questionMessage.react(message.client.krytx)

    const filter = (reaction, user) => user.id === message.author.id && reaction.emoji.id === message.client.krytcheck.id || reaction.emoji.id === message.client.krytx.id
    const reactionCollector = questionMessage.createReactionCollector(filter, { time: 15000 })

    let reactionChoice = await getChoice(reactionCollector)

    if (reactionChoice.emoji.name === "krytcheck") {
        //return true because reacted with "yes"
        return true;
    } else {
        //return false because reacted with "no"
        return false;
    }

}