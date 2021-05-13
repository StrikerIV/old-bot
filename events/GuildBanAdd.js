const mysql = require("mysql")
const { DatabaseQuery } = require("../structures/StructuresManager")

exports.GuildBanAdd = async (guild, user) => {
    // emitted on a ban being issued to a user
    // add them to database to track banned users

    let fetchedBan = await guild.fetchBan(user.id);
    if (!fetchedBan) {
        return;
    }

    // no need for double call
    // if the bot banned them, it will do nothing
    let updateBan = await DatabaseQuery("INSERT INTO guilds_bans(guild_id, user_id, reason) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE user_id = user_id", [guild.id, user.id, fetchedBan.reason]);
    if (!updateBan.error) {
        return;
    }

}