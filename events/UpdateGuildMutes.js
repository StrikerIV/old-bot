const { EvaluateGuildCache, DatabaseQuery } = require("../structures/StructuresManager")
const { guilds } = require("../index")
const moment = require("moment")

module.exports = async (client) => {

    let FetchMutesQuery = await DatabaseQuery("SELECT * FROM guilds_tempmutes WHERE time_to_unmute <= ?", [moment().valueOf()])
    if (FetchMutesQuery.error) {
        return;
    }

    let fetchMutesData = FetchMutesQuery.data
    if (!fetchMutesData) {
        return;
    }

    for await ([index, mute] of fetchMutesData.entries()) {

        let guild_id = mute.guild_id
        let user_id = mute.user_id

        let guild = await client.guilds.fetch(guild_id)
        if (!guild || !guild.available || guild.deleted) {
            return;
        }

        let mutedUser = await guild.members.fetch(user_id)
        if (!mutedUser || mutedUser.deleted) {
            return;
        }

        if (!guilds.has(guild.id)) {
            //guild is not currently cached
            await EvaluateGuildCache(guild, true)
        }

        let guildData = guilds.get(guild.id)

        if (guildData.error) {
            return;
        }
        if (guildData.refresh) {
            //cache needs to be refreshed
            await EvaluateGuildCache(guild, true)
        }

        let muted = moment(mute.time_to_unmute)
        let unmuted = moment()

        let durationOfMute = moment.duration(unmuted.diff(muted))

        let seconds = durationOfMute.get('seconds')
        let minutes = durationOfMute.get('minutes')
        let hours = durationOfMute.get('hours')
        let days = durationOfMute.get('days')

        let secondsFormatted = seconds != 0 && seconds <= 1 ? "second" : "seconds"
        let minutesFormatted = minutes != 0 && minutes <= 1 ? "minute" : "minutes"
        let hoursFormatted = hours != 0 && hours <= 1 ? "hour" : "hours"
        let daysFormatted = days != 0 && days <= 1 ? "day" : "days"

        let timeMuted = `${days ? `${days} ${daysFormatted},` : ""}${hours ? ` ${hours} ${hoursFormatted},` : ""}${minutes ? `${hours ? ` ${minutes} ${minutesFormatted},` : ` ${minutes} ${minutesFormatted}`}` : ""}${seconds ? ` ${minutes ? `and ${seconds} ${secondsFormatted}` : ` ${seconds} ${secondsFormatted}`}` : ""}`

        await mutedUser.roles.remove(guildData.muted_role_id, `Automatically unmuted after being muted for ${timeMuted}.`)
            .then(async () => {
                let updateQuery = await DatabaseQuery("DELETE FROM guilds_mutes WHERE guild_id = ? AND user_id = ?", [guild.id, mutedUser.id])
                if (updateQuery.error) {
                    return;
                }
            })
            .catch(any => { })


    }

}