const { Message } = require("discord.js")
const HelpEmbed = require("./HelpEmbed")

function CreateHeirachyObject(above, type) {
    return HeiarchyObject = {
        above: above,
        type: type
    }
}

module.exports = (message, punished) => {

    let initiator = message.member.roles.highest.position
    let bot = message.guild.me.roles.highest.position
    punished = punished.roles.highest.position

    if (bot <= punished) {
        //bot cannot ban because too low or same in heirachy
        return CreateHeirachyObject(false, "bot")
    } else if (initiator <= punished) {
        //command initiator is lower or the same than the user they're trying to ban, cannot do that.
        return CreateHeirachyObject(false, "initiator")
    } else {
        return CreateHeirachyObject(true, null)
    }

}