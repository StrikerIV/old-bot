const { DatabaseQuery } = require("../structures/StructuresManager")
const moment = require("moment")
//"SELECT * FROM guilds_bans WHERE time BETWEEN ? and ?", [now, range]
module.exports = async (client) => {

    let now = moment().valueOf();
    let range = now + 5000

    let FetchBansQuery = await DatabaseQuery("SELECT * FROM guilds_bans", [])
    if(FetchBansQuery.error) {
        return;
    }
    console.log(FetchBansQuery)
    let fetchBansData = FetchBansQuery.data
    if(!fetchBansData) {
        return;
    }

    let test2 = await client.guilds.fetch('741044429204488403')
    // console.log(test2)
    // for await ([index, ban] of fetchBansData.entries()) {

    //     let guild_id = ban.guild_id
    //     let user_id = ban.user_id
    //     let time = ban.time

    //     let test = await client.guilds.fetch(guild_id.toString())
    //     console.log(test)

    //     // let guild = await client.guilds.cache.find(guild => guild.id === guild_id) ? this : client.guilds.fetch(guild_id)
    //     // console.log(guild)

    // }

}