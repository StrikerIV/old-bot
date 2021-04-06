const Discord = require("discord.js")
const mysql = require("mysql")
const { DatabaseQuery, DatabaseError } = require("../structures/StructuresManager")

exports.Message = async (message) => {

    //check to see if bot was pinged to return basic information on the bot
    if(message.mentions.has(message.guild.me)) {

        let fetchGuildData = await DatabaseQuery("SELECT * FROM guilds WHERE guild_id = ? LIMIT 1", [message.guild.id])
        if(fetchGuildData.error) {
            return message.reply({ embed: DatabaseError(client) })
        }

        let guildData = fetchGuildData.data[0]

        let informationEmbed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setTimestamp()
            .setTitle("Information")
            .setFooter("Information")
            .setDescription(`Hey! Here's some basic information about me.\n\nYou can change any value here using the \`settings\` command.\n\n**Prefix**\nThe current prefix for your server is : \`${guildData.prefix}\`\n`)
            
        return message.reply({ embed: informationEmbed })
    }

}