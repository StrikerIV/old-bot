let { BotError, BotSuccess, CheckHeirachy, DatabaseQuery, DatabaseError, BotOngoing } = require("../structures/StructuresManager")
const moment = require("moment")

function countdown(timeStart, timeEnd) {
    let diffTime = timeEnd - timeStart
    let duration = moment.duration(diffTime*1000, 'milliseconds');

    setInterval(function(){
        duration = moment.duration(duration.asMilliseconds() - 1250, 'milliseconds');
        let countdownText = moment(duration.asMilliseconds()).format('H:mm:ss');
        countdownEmbed.edit({ embed: BotOngoing(countdownText, { color: "BLUE" }) })
      }, 1250);
}

exports.run = async (client, message, args) => {
    
    let operator = args.find(argument => argument.type === "SubArgument").data
    if(operator === "start") {
        //start countdown sequence for launch
        let timeStart = moment().unix()
        let timeEnd = moment().add(8400000, 'milliseconds').unix()

        countdownEmbed = await message.channel.send({ embed: BotOngoing("Starting", { color: "BLUE" }) })

        countdown(timeStart, timeEnd)
    }
}

exports.info = {
    usage: null,
    command: "countdown",
    category: null,
    description: "Starts a countdown. :eyes:",
    arguments: [
        {
            position: 0,
            argument: "<string>",
            type: "SubArgument",
            required: true
        }
    ],
    permissions: [],
    aliases: null,
    usageAreas: null,
    developer: true,
    cooldown: 5,
}