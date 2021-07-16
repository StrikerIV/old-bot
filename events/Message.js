const Discord = require("discord.js")
const config = require("../utils/config.json")
const { GetRequest, BotOngoing, EvaluateGuildCache } = require("../structures/StructuresManager")

function createNSFWObject(explict, className, data) {
    return {
        explict: explict,
        className: className,
        data: data
    }
}

exports.Message = async (message) => {

    if (config.developerMode) {
        //developer mode is enabled, all traffic is disabled except on dev server
        if (!config.developerServers.includes(message.guild.id)) return;
    }

    let guildData = message.guild.data

    if (!guildData) {
        let data = await EvaluateGuildCache(message.guild)
        message.guild.data = data
        return exports.Message(message)
    }

    if (message.author.bot) {
        return;
    }

    //check to see if bot was pinged to return basic information on the bot
    if (message.mentions.has(message.guild.me) && !message.mentions.everyone) {

        let informationEmbed = new Discord.MessageEmbed()
            .setTimestamp()
            .setColor('BLUE')
            .setTitle("Information")
            .setFooter("Information")
            .setDescription(`Hey! Here's some basic information about me.\n\nYou can change any value here using the \`settings\` command.\n\n**Prefix**\nThe current prefix for your server is : \`${guildData.prefix}\`\n`)

        return message.reply({ embeds: [informationEmbed] })
    }

    // //test to see if valid discord attachment
    // let urlRegex = new RegExp(/\.(jpg|png|jpeg)$/gm)

    // //check to see if content contains image, if so we check for nudity in it.
    // if (message.content.match(urlRegex) || message.embeds[0]) {
    //     //valid url for image
    //     let url = message.content.match(urlRegex) ? message.content : message.embeds[0] ? message.embeds[0].thumbnail : null;
    //     if (!url) {
    //         return;
    //     }

    //     const params = new URLSearchParams({
    //         'image': url,
    //     })

    //     let nsfwData = await GetRequest(`${config.baseURL}/api/v1/nsfw`, params)
    //     nsfwData = nsfwData[Object.keys(nsfwData)[0]];

    //     if ((nsfwData.unsafe * 100) >= 55) {
    //         //deemed unsafe, delete
    //         return message.delete()
    //             .then(msg => msg.channel.send({ embeds: [BotOngoing(`Woah there ${msg.author}! We think this has NSFW content; we've removed it to be safe.`, { color: "RED" })] }))
    //     }
    // }

}