exports.run = (client, message, args) => {

    message.channel.send("ban baby")

}

exports.info = {
    usage: null,
    command: "ban",
    description: "Bans a member from a guild.",
    arguments: [
        {
            position: 0,
            argument: "<user>",
            type: ["GuildMember"],
            required: true
        },
        {
            position: 1,
            argument: "<time>",
            type: ["Time"],
            required: false
        },
        {
            position: 1,
            argument: "<reason>",
            type: ["String"],
            required: false
        }
    ],
    permissions: [
        [],
        []
    ],
    aliases: null,
    usageAreas: null,
    developer: false,
    cooldown: 4,
}