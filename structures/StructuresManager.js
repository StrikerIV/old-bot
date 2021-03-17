const BotError = require("./BotError")
const HelpEmbed = require("./HelpEmbed")
const BotSuccess = require("./BotSuccess")
const ArgumentCheck = require("./ArgumentCheck")
const CheckHeirachy = require("./CheckHeirachy")
const ParseArguments = require("./ParseArguments")
const PermissionCheck = require("./PermissionCheck")
const PermissionError = require("./PermissionError")

module.exports = {
    BotError: BotError,
    HelpEmbed: HelpEmbed,
    BotSuccess: BotSuccess,
    CheckHeirachy: CheckHeirachy,
    ArgumentCheck: ArgumentCheck,
    ParseArguments: ParseArguments,
    PermissionCheck: PermissionCheck,
    PermissionError: PermissionError,
}