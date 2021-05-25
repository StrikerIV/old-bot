const { enclosingPowerOfTwo } = require("@tensorflow/tfjs")
const { guilds } = require("../..")
const BotSuccess = require("../../structures/BotSuccess")
let { BotError } = require("../../structures/StructuresManager")

exports.run = async (client, message, args) => {

    let amountToDelete = args.find(argument => argument.type === "SubArgument").data

    //if number to delete is over 100 (the limit for the discord api),
    //we recursevly call until no messages are left
    //if number to delete is "all", we just outright delete the channel and remake it

    if (amountToDelete === "all") {
        //delete channel and remake 
        await message.channel.delete("Deleting channel to clean messages.")
            .then(async (channel) => {
                await channel.clone("Remaking channel to clean messages.")
                    .then(channel => {
                        return channel.send({ embed: BotSuccess(client, `${message.author},\nI successfully deleted \`all\` messages from this channel.`) })
                    })
                    .catch(any => {
                        if (!guild.systemChannel) {
                            return;
                        }

                        return guild.systemChannel.reply({ embed: BotError(client, `Failed to delete messages from this channel.`) })
                    })
            })
            .catch(any => {
                return message.reply({ embed: BotError(client, `Failed to delete messages from this channel.`) })
            })
    } else if (!Number.isInteger(amountToDelete)) {
        //recursevly call until all are deleted
        amountToDelete = parseInt(amountToDelete) + 1

        let numberOfTimesToRepeat = Math.round(amountToDelete / 100)
        if (numberOfTimesToRepeat === 0) {
            await message.channel.bulkDelete(amountToDelete)
                .then(messages => {
                    return message.channel.send({ embed: BotSuccess(client, `${message.author},\nI successfully deleted \`${messages.size}\` ${messages.size === 1 ? "message" : "messages"} from this channel.`) })
                })
        } else {
            let amountDeleted = 0

            for (x = 0; x != (Math.round(amountToDelete / 100) + 1); x++) {
                await message.channel.bulkDelete(100)
                    .then(messages => {
                        amountDeleted+= messages.size
                    })
                    .catch(any => {
                        return message.reply({ embed: BotError(client, `Some messages are over 14 days old, and I cannot delete them.`) })
                    })
            }
        }
    } else {
        return message.reply({ embed: BotError(client, `Supply a number of messages to delete.`) })
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
    cooldown: 5,
}