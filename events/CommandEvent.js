const config = require("../utils/config.json");
const { BotError, HelpEmbed, ArgumentCheck, EnabledCheck, PermissionError, ParseArguments, PermissionCheck, DatabaseError, EvaluateGuildCache } = require("../structures/StructuresManager");
const { guilds, cooldowns } = require("../index");
const { Collection } = require("discord.js");

exports.CommandEvent = async (client, message) => {

    if (config.developerMode) {
        //developer mode is enabled, all traffic is disabled except on dev server
        if (!config.developerServers.includes(message.guild.id)) return;
    }

    if (message.author.bot) {
        return;
    }

    let guildData = message.guild.data

    if (!guildData) {
        let data = await EvaluateGuildCache(message.guild)
        message.guild.data = data
        return exports.CommandEvent(client, message)
    }

    //apply database data to guild object in message
    message.guild.data = guildData

    if (!message.content.startsWith(guildData.prefix) || message.author.bot) {
        return;
    }

    const args = message.content.slice(guildData.prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.info.aliases && cmd.info.aliases.includes(commandName));
    if (!command) {
        return;
    }

    const info = command.info;

    if (info.cooldown) {
        //eval cooldowns
        if (!cooldowns.has(info.command)) {
            cooldowns.set(info.command, new Collection())
        }

        const now = Date.now()
        const commandCooldowns = cooldowns.get(info.command)
        const cooldownTime = info.cooldown * 1000

        if (commandCooldowns.has(message.author.id)) {
            const expirationTime = commandCooldowns.get(message.author.id) + cooldownTime;
            if (now < expirationTime) {
                const timeLeft = Math.floor((expirationTime - now) / 1000);
                return message.reply({ embed: BotError(client, `This command is on cooldown for \`${timeLeft}\` more ${timeLeft != 0 && timeLeft <= 1 ? "second" : "seconds"}.`) });
            }
        }

        commandCooldowns.set(message.author.id, now)
        setTimeout(() => commandCooldowns.delete(message.author.id), cooldownTime)

    }

    let commandEnabled = await EnabledCheck(guildData, message, command)
    if (!commandEnabled) {
        return message.reply({ embed: BotError(client, `The \`${command.info.category}\` category of commands are not enabled.`), allowedMentions: { repliedUser: false } })
    }

    if (info.usageAreas) {
        let channelType = message.channel.type
        if (!info.usageAreas.includes(channelType)) {
            return message.reply({ embed: BotError(client, `This command cannot be run in ${channelType} type channels.`), allowedMentions: { repliedUser: false } })
        }
    }

    if (!info.developer) {
        //eval permissions
        let permissionObject = await PermissionCheck(message, info.permissions[0], info.permissions[1]);

        if (permissionObject.error) {
            return message.reply({ embed: PermissionError(client, permissionObject.permission, permissionObject.bot), allowedMentions: { repliedUser: false } })
        }
    }

    let argumentCheck = await ArgumentCheck(info, args)
    if (argumentCheck === "HelpEmbed") {
        return message.reply(HelpEmbed(message, info))
    }

    if (argumentCheck.error) {
        if (argumentCheck.type === "missingArgument") {
            return message.reply(BotError(client, `Missing argument \`${argumentCheck.argument.type[0]}\` in position \`${argumentCheck.argument.position + 1}\`.`))
        }
    }


    let arguments = await ParseArguments(info, message, args)
    if (arguments.error) {
        if (arguments.type === "User") {
            return message.reply({ embed: BotError(message.client, `The supplied \`User\` is \`invalid\`.`) })
        } if (arguments.type === "GuildMember") {
            return message.reply({ embed: BotError(message.client, `The supplied \`GuildMember\` is \`invalid\`.`) })
        } else if (arguments.type === "Time") {
            return message.reply({ embed: BotError(message.client, `\`Time\` was supplied, but no units were.`) })
        }
    }

    command.run(client, message, arguments);

};