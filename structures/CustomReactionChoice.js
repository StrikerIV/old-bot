const Discord = require("discord.js")
const GetReactionChoice = require('./GetReactionChoice');

let unicodeEmojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]
/**
 * Structure to ask a multiple choice question to a user.
 * @param {Discord.Message} message 
 * @param {String} question 
 * @param {Array} choices 
 * @returns {boolean}
 */
module.exports = async (message, question, choices) => {

    let choicesFieldText = ""

    choices.forEach((choice, index) => {
        choicesFieldText = choicesFieldText.concat(`\`${index += 1}.\`  ${choice}\n`)
    });

    let questionEmbed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setDescription(question)
        .addField('\u200B', choicesFieldText, true)

    let questionMessage = await message.reply({ embed: questionEmbed })

    // apply reactions
    for await (let choice of choices) {
        questionMessage.react(unicodeEmojis[choices.indexOf(choice)])
    }

    const filter = (reaction, user) => user.id === message.author.id && reaction.emoji.constructor === Discord.ReactionEmoji
    const reactionCollector = questionMessage.createReactionCollector(filter, { time: 30000 })

    let reactionChoice = await GetReactionChoice(reactionCollector)
    if (!reactionChoice) {
        // ended without valid reaction applied
        return null;
    }

    return choices[unicodeEmojis.indexOf(reactionChoice.emoji.name)]

}