let { BotError, BotSuccess, CheckHeirachy, DatabaseQuery } = require("../../structures/StructuresManager")

exports.run = async (client, message, args) => {

    let memberToBan = args.find(argument => argument.type === "GuildMember").data
    let time = args.find(argument => argument.type === "Time")
    let reason = args.find(argument => argument.type === "Reason")

    let canBan = await CheckHeirachy(message, memberToBan)

    if (!canBan.above) {
        if (canBan.type === "bot") {
            return message.reply({ embed: BotError(client, `The bot cannot ban this user. Check the heirachy positions.`) })
        } else {
            return message.reply({ embed: BotError(client, `You cannot ban this user, as they are above you in the heirachy.`) })
        }
    } 

    //return message.reply({ embed: BotSuccess(client, `${memberToBan} has been banned${time ? ` for ${time.data.time} ${time.data.units}.`:`.`} ${reason ? `\n\nReason: \`${reason.data}\``: ``}`)})

    // if(time) {
    //     let updateQuery = await DatabaseQuery(client, "SELECT * FROM guilds", [])
    //     console.log(updateQuery)
    // }

    // memberToBan.ban()
    //     .then((member) => {
    //         return message.reply({ embed: BotError(client, `${memberToBan} has been banned ${time ? `for ${time.data}`: `.` }`)})
    //     })
    //     .catch(any => {
    //         return message.reply({ embed: BotError(client, `Something went wrong with banning this user.`) })
    //     })

}

exports.info = {
    usage: null,
    command: "ban",
    category: "moderation",
    description: "Bans a member from a guild.",
    arguments: [
        {
            position: 0,
            argument: "<user>",
            type: "GuildMember",
            required: true
        },
        {
            position: 1,
            argument: "<time>",
            type: "Time",
            required: false
        },
        {
            position: 1,
            argument: "<reason>",
            type: "Reason",
            required: false
        }
    ],
    permissions: [
        ["BAN_MEMBERS"],
        ["BAN_MEMBERS"]
    ],
    aliases: null,
    usageAreas: null,
    developer: false,
    cooldown: 4,
}