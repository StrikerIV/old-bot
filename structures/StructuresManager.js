const BotError = require("./BotError")
const HelpEmbed = require("./HelpEmbed")
const BotSuccess = require("./BotSuccess")
const EnabledCheck = require("./EnabledCheck")
const ArgumentCheck = require("./ArgumentCheck")
const DatabaseQuery = require("./DatabaseQuery")
const CheckHeirachy = require("./CheckHeirachy")
const ParseArguments = require("./ParseArguments")
const PermissionCheck = require("./PermissionCheck")
const PermissionError = require("./PermissionError")

module.exports = {
    BotError: BotError,
    HelpEmbed: HelpEmbed,
    BotSuccess: BotSuccess,
    EnabledCheck: EnabledCheck,
    CheckHeirachy: CheckHeirachy,
    ArgumentCheck: ArgumentCheck,
    DatabaseQuery: DatabaseQuery,
    ParseArguments: ParseArguments,
    PermissionCheck: PermissionCheck,
    PermissionError: PermissionError,
}