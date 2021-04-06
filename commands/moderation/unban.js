let { BotError, BotSuccess, CheckHeirachy, DatabaseQuery } = require("../../structures/StructuresManager")
const moment = require("moment")

exports.run = async (client, message, args) => {

    let userToUnban = args.find(argument => argument.type === "User").data

    //unban user
    message.guild.members.unban(userToUnban.id)
        .then((user) => {
            return message.reply({
                embed: BotSuccess(client, `${user} has been unbanned.`)
            })
        })
        .catch(any => {
            return message.reply({ embed: BotError(client, `This user is not banned.`) })
        })

}

exports.info = {
    usage: null,
    command: "unban",
    category: "moderation",
    description: "Unbans a user from a guild.",
    arguments: [
        {
            position: 0,
            argument: "<user>",
            type: "User",
            required: true
        }
    ],
    permissions: [
        ["BAN_MEMBERS"],
        ["BAN_MEMBERS"]
    ],
    aliases: null,
    usageAreas: null,
    developer: false,
    cooldown: 5,
}