const { Client, Collection, Intents } = require('discord.js');
const { parse } = require("path")
const config = require("./utils/config.json");
const glob = require("glob");
const { loadEvents } = require("./events/EventsManager.js")

const cooldowns = new Map()

async function initalizeBot() {

    const client = new Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] });

    const loadedEvents = await loadEvents()

    client.commands = new Collection();
    client.on("message", loadedEvents.CommandEvent.bind(null, client));

    console.log("\nInitialized! Loading commands...\n")

    glob(__dirname + "/commands/**/*{.js,.ts}", (_, files) => {
        files.forEach(file => {
            const { name } = parse(file)
            const props = require(file)
            client.commands.set(name, props);
        })
    });

    process.on('unhandledRejection', error => {
        console.log(error)
    });

    client.once('ready', () => { loadedEvents.ready(client) })

    client.on('guildCreate', (guild) => { loadedEvents.GuildCreate(guild) })

    client.on('guildBanAdd', (guild, user) => { loadedEvents.GuildBanAdd(guild, user) })
    client.on('guildBanRemove', (guild, user) => { loadedEvents.GuildBanRemove(guild, user) })

    client.login(config.token)

}

initalizeBot()

module.exports.cooldowns = cooldowns;