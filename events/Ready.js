const UpdateGuildMutes = require("./UpdateGuildMutes");
const UpdateGuildBans = require("./UpdateGuildBans");

exports.ready = async (client) => {

    // setInterval(function () { UpdateGuildBans(client); }, 5000)
    // setInterval(function () { UpdateGuildMutes(client); }, 5000)

    client.guilds.fetch('671577661952360459').then(function (guild) {
        let emojis = guild.emojis.cache
        client.krytcheck = emojis.find(emoji => emoji.name == 'krytcheck')
        client.krytx = emojis.find(emoji => emoji.name == 'krytx')
    })

    console.log('Ready.')

}
