const { DatabaseQuery } = require("../structures/StructuresManager")
const config = require("../utils/config.json");

module.exports = async (client) => {

    console.log("Updating banned individuals.")

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

        let guild = await client.guilds.fetch(guild_id)
        if (!guild || !guild.available) {
            return;
        }

        let banned = moment(ban.time_banned)
        let unbanned = moment()

        let durationOfMute = moment.duration(unbanned.diff(banned))

        let seconds = durationOfMute.get('seconds')
        let minutes = durationOfMute.get('minutes')
        let hours = durationOfMute.get('hours')
        let days = durationOfMute.get('days')

        let secondsFormatted = seconds != 0 && seconds <= 1 ? "second" : "seconds"
        let minutesFormatted = minutes != 0 && minutes <= 1 ? "minute" : "minutes"
        let hoursFormatted = hours != 0 && hours <= 1 ? "hour" : "hours"
        let daysFormatted = days != 0 && days <= 1 ? "day" : "days"

        let timeMuted = `${days ? `${days} ${daysFormatted},` : ""}${hours ? ` ${hours} ${hoursFormatted},` : ""}${minutes ? `${hours ? ` ${minutes} ${minutesFormatted},` : ` ${minutes} ${minutesFormatted}`}` : ""}${seconds ? ` ${minutes ? `and ${seconds} ${secondsFormatted}` : ` ${seconds} ${secondsFormatted}`}` : ""}`

        guild.members.unban(user_id, `Automatically unbanned after being banned for ${timeMuted}.`)
            .then(async () => {
                let updateQuery = await DatabaseQuery("DELETE FROM guilds_bans WHERE guild_id = ? AND user_id = ?", [guild.id, mutedUser.id])
                if (updateQuery.error) {
                    return;
                }
            })
            .catch(any => { })

    }

}