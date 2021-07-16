let { BotSuccess, BotError } = require("../../structures/StructuresManager")

exports.run = async (client, message, args) => {

    let amountToDelete = args.find(argument => argument.type === "SubArgument").data

    //if number to delete is over 100 (the limit for the discord api),
    //we recursevly call until no messages are left
    //if number to delete is "all", we just outright delete the channel and remake it

    if (amountToDelete === "all") {
        //delete channel and remake 
        await message.channel.delete("Deleting channel to purge messages.")
            .then(async (channel) => {
                await channel.clone("Remaking channel to purge messages.")
                    .then(channel => {
                        return channel.send({ embeds: [BotSuccess(client, `${message.author},\nI successfully purged \`all\` messages from this channel.`)] })
                    })
                    .catch(any => {
                        if (!guild.systemChannel) {
                            return;
                        }

                        return guild.systemChannel.reply({ embeds: [BotError(client, `Failed to purge messages from this channel.`)] })
                    })
            })
            .catch(any => {
                return message.reply({ embeds: [BotError(client, `Failed to purge messages from this channel.`)] })
            })
    } else if (!Number.isInteger(amountToDelete)) {
        //recursevly call until all are deleted
        amountToDelete = parseInt(amountToDelete)

        let amountDeleted = 0

        while (amountToDelete != 0) {
            if (amountToDelete / 100 >> 0) {
                // there is atleast one full bulk delete possible (100 messages)
                await message.channel.bulkDelete(100, true)
                    .then(messages => amountDeleted += messages.size)
                    .catch(any => {
                        return message.reply({ embeds: [BotError(client, `Failed to purge messages from this channel.`)] })
                    })
                amountToDelete -= 100
            } else {
                // delete the amount that are left
                await message.channel.bulkDelete(amountToDelete, true)
                    .then(messages => amountDeleted += messages.size)
                    .catch(any => {
                        return message.reply({ embeds: [BotError(client, `Failed to purge messages from this channel.`)] })
                    })
                amountToDelete -= amountToDelete
            }

        }

        return message.channel.send({ embeds: [BotSuccess(client, `${message.author},\nI successfully purged \`${amountDeleted}\` ${amountDeleted <= 1 ? "message" : "messages"} from this channel.`)] })
    } else {
        return message.reply({ embeds: [BotError(client, `Supply a number of messages to purge.`)] })
    }

}

exports.info = {
    usage: null,
    command: "purge",
    category: "moderation",
    description: "Removes messages from a text channel in a guild.",
    arguments: [
        {
            position: 0,
            argument: "<amount>",
            type: "SubArgument",
            required: true
        }
    ],
    permissions: [
        ["MANAGE_MESSAGES"],
        ["SEND_MESSAGES", "MANAGE_MESSAGES", "MANAGE_CHANNELS"]
    ],
    aliases: null,
    usageAreas: ["text"],
    developer: false,
    beta: false,
    cooldown: 5,
}