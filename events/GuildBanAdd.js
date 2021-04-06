const mysql = require("mysql")
const { DatabaseQuery } = require("../structures/StructuresManager")

exports.GuildBanAdd = async (guild, user) => {
    // emitted on a ban being issued to a user
    // add them to database to track banned users

    let fetchedBan = await guild.fetchBan(user.id);
    if (!fetchedBan) {
        return;
    }

    //firstly, check to see if they were banned by the bot
    let isBanned = await DatabaseQuery("SELECT * FROM guilds_bans WHERE guild_id = ? AND user_id = ?", [guild.id, user.id]);
    if (!isBanned.error) {
        if (isBanned.data[0]) return; //already in database, therefor banned
        let updateQuery = await DatabaseQuery("INSERT INTO guilds_bans(guild_id, user_id, reason) VALUES(?, ?, ?)", [guild.id, user.id, fetchedBan.reason]);
        if (updateQuery.error) {
            return;
        }
    }

}