const mysql = require("mysql")

exports.ready = async (client) => {

    client.guilds.fetch('671577661952360459').then(function (guild) {
        let emojis = guild.emojis.cache
        client.krytcheck = emojis.find(emoji => emoji.name == 'krytcheck')
        client.krytx = emojis.find(emoji => emoji.name == 'krytx')
    })

    console.log('Ready.')

}