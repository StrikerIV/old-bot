const Discord = require("discord.js")
const mysql = require("mysql")
const { GetRequest, DatabaseQuery, DatabaseError, BotOngoing } = require("../structures/StructuresManager")

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
        console.log(nsfwData)

        const drawingPrediction = nsfwData.find(item => item.className === 'Drawing');
        const neutralPrediction = nsfwData.find(item => item.className === 'Neutral');
        const hentaiPrediction = nsfwData.find(item => item.className === 'Hentai');
        const pornPrediction = nsfwData.find(item => item.className === 'Porn');
        const sexyPrediction = nsfwData.find(item => item.className === 'Sexy');

        if (hentaiPrediction.probability > .65 || pornPrediction.probability > .65 || sexyPrediction.probability > .65) {
            //tensorflow model predicts with 65%+ certainty that there is some sort of nsfw content
            return result(createNSFWObject(true, "NSFW", nsfwData))
        } else {
            //else model predicts with 65%+ certainty that it is safe
            return result(createNSFWObject(false, null, nsfwData))
        }

    })

}

exports.Message = async (message) => {

    if (message.author.bot) {
        return;
    }

    //check to see if bot was pinged to return basic information on the bot
    if (message.mentions.has(message.guild.me)) {

        let guildData = message.guild.data

        let informationEmbed = new Discord.MessageEmbed()
            .setTimestamp()
            .setColor('BLUE')
            .setTitle("Information")
            .setFooter("Information")
            .setDescription(`Hey! Here's some basic information about me.\n\nYou can change any value here using the \`settings\` command.\n\n**Prefix**\nThe current prefix for your server is : \`${guildData.prefix}\`\n`)

        return message.reply({ embed: informationEmbed })
    }

    //test to see if valid discord attachment
    let urlRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gm)

    //check to see if content contains url, if so we check for nudity in it.
    if (message.content.match(urlRegex) || message.embeds[0]) {
        //do later i can't get it to work properly
    }

}