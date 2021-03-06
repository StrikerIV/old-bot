const Discord = require("discord.js")

function checkPermission(member, channel, permission) {
    return member.permissionsIn(channel).has(permission, true)
}

function resultObject(bot, error, permission) {
    return PermissionCheckResult = {
        bot: bot,
        error: error,
        permission: permission
    }
}

/**
 * Checks permissions and returns whether they have privileges. 
 * @param {Discord.Message} message 
 * @param {CommandPermissions} memberPermissions 
 * @param {CommandPermissions} botPermissions 
 * @returns {PermissionObject}
 */
module.exports = (message, memberPermissions, botPermissions) => {

    return new Promise((result) => {

        memberPermissions.forEach(permission => {
            let hasPermission = checkPermission(message.member, message.channel, permission)
            if (!hasPermission) result(resultObject(false, true, permission))
        })

        botPermissions.forEach(permission => {
            let hasPermission = checkPermission(message.guild.me, message.channel, permission)
            if (!hasPermission) result(resultObject(true, true, permission))
        })

        result(resultObject(null, false, null))
    })

}