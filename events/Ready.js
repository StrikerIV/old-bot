const UpdateGuildMutes = require("./UpdateGuildMutes");
const UpdateGuildBans = require("./UpdateGuildBans");

exports.ready = async (client) => {

    // add custom method "get" to array
    Object.defineProperty(Array.prototype, 'get', {
        value: function (value) {
            let valueToReturn = this.find(argument => argument.type === value)
            let indexOfValue = this.findIndex(argument => argument.type === value)

            //splice from args
            this.splice(indexOfValue, 1)
            return valueToReturn
        }
    });

    setInterval(function () { UpdateGuildBans(client); }, 5000)
    setInterval(function () { UpdateGuildMutes(client); }, 5000)

    client.guilds.fetch('671577661952360459').then(function (guild) {
        let emojis = guild.emojis.cache
        client.krytcheck = emojis.find(emoji => emoji.name == 'krytcheck')
        client.krytx = emojis.find(emoji => emoji.name == 'krytx')
    })

    console.log('Ready.')

}
