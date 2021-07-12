const Discord = require("discord.js")
const BotError = require("../../structures/BotError")
const BotOngoing = require("../../structures/BotOngoing")
const BotSuccess = require("../../structures/BotSuccess")
const DatabaseError = require("../../structures/DatabaseError")
let { GetMessageInput, CustomReactionChoice, DatabaseQuery } = require("../../structures/StructuresManager")

exports.run = async (client, message, args) => {

    let warnModifier = args.get("GuildMember").data

    let checkforUser = await message.guild.members.fetch(warnModifier.replace(/[<@!>]/g, "")).catch(any => { return false })
    if (checkforUser) {

        let fetchMemberWarns = await DatabaseQuery("SELECT * FROM guilds_cases WHERE guild_id = ? AND user_id = ? AND type = ?", [message.guild.id, memberForWarns.id, "warn"])
        if (fetchMemberWarns.error) {
            return message.reply({ embeds: [DatabaseError(client)] })
        }

        let warnsField = ""

        if (!fetchMemberWarns.data) {
            return message.reply({ embeds: [BotError(client, "This user has no warns.")] })
        }
        for await (let warn of fetchMemberWarns.data) {
            warnsField = warnsField.concat(`\`#${warn.case_number}\` | ${warn.reason} ${warn.resolved === 0 ? ":green_circle:" : ":red_circle:"}\n`)
        }

        let warnsEmbed = new Discord.MessageEmbed()
            .setDescription(`Warns for ${memberForWarns}`)
            .addField("\u200B", warnsField, true)
            .setFooter(`Tip: Add "true" as an argument to\nonly display open warns.`)

        return message.reply({ embeds: [warnsEmbed] })

    }

}

exports.info = {
    usage: null,
    command: "warn",
    category: "moderation",
    description: "Applies a warn to a member in a guild.",
    arguments: [
        {
            position: 0,
            argument: "<user>",
            type: "GuildMember",
            required: true
        },
    ],
    permissions: [
        ["MANAGE_MESSAGES"],
        ["SEND_MESSAGES", "MANAGE_MESSAGES", "MANAGE_CHANNELS"]
    ],
    aliases: null,
    usageAreas: ["text"],
    developer: false,
    beta: false,
    cooldown: 5,
}