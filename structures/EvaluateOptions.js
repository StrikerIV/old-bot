const Discord = require("discord.js")
const HelpEmbed = require("./HelpEmbed")

/**
 * @typedef {Object[?timestamp|?author|?footer|?title|?color]} EmbedOptions
 * @param {EmbedOptions} options 
 * @returns 
 */
module.exports = (embed, options) => {

    if (!options) {
        return embed
    }

    let timestamp = options.timestamp ?? false;
    let author = options.author ?? false;
    let footer = options.footer ?? false;
    let title = options.title ?? false;
    let color = options.color ?? false;

    if (timestamp) {
        if(typeof timestamp === "boolean") {
            embed.setTimestamp()
        } else {
            embed.setTimestamp(timestamp)
        }
    }

    if (author) {
        embed.setAuthor(author)
    }

    if (footer) {
        embed.setFooter(footer)
    }

    if (title) {
        embed.setTitle(title)
    }

    if(color) {
        embed.setColor(color)
    }

    return embed

}