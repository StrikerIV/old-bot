const { DatabaseQuery } = require("../structures/StructuresManager")
const moment = require("moment")
//"SELECT * FROM guilds_bans WHERE time BETWEEN ? and ?", [now, range]
module.exports = async (client) => {

    console.log(moment().valueOf())
    let FetchBansQuery = await DatabaseQuery("SELECT * FROM guilds_bans WHERE time_unbanned <= ?", [moment().valueOf()])
    if (FetchBansQuery.error) {
        return;
    }

    let fetchBansData = FetchBansQuery.data
    if (!fetchBansData) {
        return;
    }

    for await ([index, ban] of fetchBansData.entries()) {

        let guild_id = ban.guild_id
        let user_id = ban.user_id
        let time = ban.time

        let guild = await client.guilds.fetch(guild_id)
        if (!guild || !guild.available) {
            return;
        }

        let banned = moment(ban.time_banned)
        let unbanned = moment(ban.time_unbanned)

        let seconds = banned.diff(unbanned, 'seconds')
        let minutes = banned.diff(unbanned, 'minutes')
        let hours = banned.diff(unbanned, 'hours')
        let days = banned.diff(unbanned, 'days')

        console.log(days, hours, minutes, seconds)

        let secondsFormatted = seconds != 0 && seconds <= 1 ? "second" : "seconds"
        let minutesFormatted = minutes != 0 && minutes <= 1 ? "minute" : "minutes"
        let hoursFormatted = hours != 0 && hours <= 1 ? "hour" : "hours"
        let daysFormatted = days != 0 && days <= 1 ? "day" : "days"

        let timeMuted = `${days ? ` ${days} ${daysFormatted},` : ""} ${hours ? ` ${hours} ${hoursFormatted},` : ""} ${minutes ? ` ${minutes} ${minutesFormatted},` : ""} ${seconds ? ` ${seconds} ${secondsFormatted},` : ""}`
        console.log(`Automatically unbanned. They were muted for ${timeMuted}.`)
        //guild.members.unban(user_id, `Automatically unbanned. They were muted for ${timeMuted}.`)

    }

}