"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachPluginActionToCommand = exports.getPluginSubCommand = exports.getPluginCommands = void 0;
const plugin_1 = require("@genkit-ai/tools-common/plugin");
const utils_1 = require("@genkit-ai/tools-common/utils");
const clc = __importStar(require("colorette"));
const commander_1 = require("commander");
async function getPluginCommands() {
    const config = await (0, plugin_1.findToolsConfig)();
    return (config?.cliPlugins || []).map(pluginToCommander);
}
exports.getPluginCommands = getPluginCommands;
async function getPluginSubCommand(commandString) {
    const config = await (0, plugin_1.findToolsConfig)();
    const actions = (config?.cliPlugins || [])
        .filter((p) => !!p.subCommands?.[commandString])
        .map((p) => ({
        keyword: p.keyword,
        name: p.name,
        ...p.subCommands[commandString],
    }));
    const command = new commander_1.Command(commandString).description(`${humanReadableCommand(commandString)} using tools plugins`);
    if (!actions.length) {
        return undefined;
    }
    for (const a of actions) {
        const subcmd = command
            .command(a.keyword)
            .description(a.name + ' ' + clc.italic('(plugin)'));
        attachPluginActionToCommand(subcmd, a);
    }
    return command;
}
exports.getPluginSubCommand = getPluginSubCommand;
function attachPluginActionToCommand(cmd, action) {
    for (const o of action.args || []) {
        cmd.option(o.flag, o.description, o.defaultValue);
    }
    cmd.action(async (options) => {
        await action.hook(options);
    });
}
exports.attachPluginActionToCommand = attachPluginActionToCommand;
function pluginToCommander(p) {
    const cmd = new commander_1.Command(p.keyword).description(p.name + ' ' + clc.italic('(plugin)'));
    for (const a of p.actions) {
        const subcmd = cmd.command(a.action).description(a.helpText);
        attachPluginActionToCommand(subcmd, a);
    }
    cmd.action((_, { args }) => {
        utils_1.logger.error(`"${clc.bold(args[0])}" is not a known ${p.name} command.`);
    });
    return cmd;
}
function humanReadableCommand(c) {
    return c[0].toUpperCase() + c.slice(1);
}
//# sourceMappingURL=plugins.js.map