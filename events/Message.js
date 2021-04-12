const Discord = require("discord.js")
const mysql = require("mysql")
const { GetRequest, DatabaseQuery, DatabaseError } = require("../structures/StructuresManager")

function createNSFWObject(explict, className, data) {
    return {
        explict: explict,
        className: className,
        data: data
    }
}

function evaluateNSFW(url) {

    return new Promise(async (result) => {
        const params = new URLSearchParams({
            'image': url,
        })

        let nsfwData = await GetRequest("https://kryt.xyz/api/v1/nsfw", params)
        let nsfwArray = []

        let drawingProbability = nsfwData.find(category => category.className = "Drawing")
        let neutralProbability = nsfwData.find(category => category.className = "Neutral")
        let hentaiProbability = nsfwData.find(category => category.className = "Hentai")
        let pornProbability = nsfwData.find(category => category.className = "Porn")
        let sexyProbability = nsfwData.find(category => category.className = "Sexy")

        if (pornProbability.probability >= 0.65) {
            //most likely porn photo, we don't want that
            return result(createNSFWObject(true, "Porn", nsfwData))
        }

        if (hentaiProbability.probability >= 0.65) {
            //most likely hentai photo, we don't want that
            return result(createNSFWObject(true, "Hentai", nsfwData))
        }

        if (sexyProbability.probability >= 0.65) {
            //most likely sexy photo, we don't want that
            return result(createNSFWObject(true, "Sexy", nsfwData))
        }

        //these are ok photos
        if (neutralProbability.probability > drawingProbability.probability) {
            return result(createNSFWObject(false, "Neutral", nsfwData))
        } else {
            return result(createNSFWObject(false, "Drawing", nsfwData))
        }

    })

}

exports.Message = async (message) => {

    if (message.author.bot) return;

    //check to see if bot was pinged to return basic information on the bot
    if (message.mentions.has(message.guild.me)) {

        let guildData = message.guild.data

        let informationEmbed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setTimestamp()
            .setTitle("Information")
            .setFooter("Information")
            .setDescription(`Hey! Here's some basic information about me.\n\nYou can change any value here using the \`settings\` command.\n\n**Prefix**\nThe current prefix for your server is : \`${guildData.prefix}\`\n`)

        return message.reply({ embed: informationEmbed })
    }

    //test to see if valid discord attachment
    if (message.content.match(/https\:\/\/media\.discordapp\.net\/attachments/ig) || message.content.match(/https\:\/\/cdn\.discordapp\.com\/attachments/ig)) {
        //valid discord attachemnt
        let hasExplict = await evaluateNSFW(message.content)

        console.log(hasExplict)
        return message.channel.send(`\`\`\`js\n${JSON.stringify(hasExplict, null, 2)}\`\`\``)
    }

    let hasExplict = await evaluateNSFW(message.content)
    return message.channel.send(`\`\`\`js\n${JSON.stringify(hasExplict, null, 2)}\`\`\``)

    //if not attachment it will be preview embed
    if (message.embeds[0]) {
        //there is an embed in this message
        let embed = message.embeds[0]

        if (!embed.thumbnail) return;

        let hasExplict = await evaluateNSFW(message.content)
        return message.channel.send(`\`\`\`js\n${JSON.stringify(hasExplict, null, 2)}\`\`\``)

    }

}