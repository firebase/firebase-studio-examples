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
exports.config = void 0;
const utils_1 = require("@genkit-ai/tools-common/utils");
const clc = __importStar(require("colorette"));
const commander_1 = require("commander");
const CONFIG_TAGS = {
    [utils_1.ANALYTICS_OPT_OUT_CONFIG_TAG]: (value) => {
        let o;
        try {
            o = JSON.parse(value);
        }
        finally {
            if (typeof o !== 'boolean')
                throw new Error('Expected boolean');
            return o;
        }
    },
};
exports.config = new commander_1.Command('config');
exports.config
    .description('set development environment configuration')
    .command('get')
    .argument('<tag>', `The config tag to get. One of [${readableTagsHint()}]`)
    .action((tag) => {
    if (!CONFIG_TAGS[tag]) {
        utils_1.logger.error(`Unknown config tag "${clc.bold(tag)}.\nValid options: ${readableTagsHint()}`);
        return;
    }
    const userSettings = (0, utils_1.getUserSettings)();
    if (userSettings[tag] !== undefined) {
        utils_1.logger.info(userSettings[tag]);
    }
    else {
        utils_1.logger.info(clc.italic('(unset)'));
    }
});
exports.config
    .command('set')
    .argument('<tag>', `The config tag to get. One of [${readableTagsHint()}]`)
    .argument('<value>', 'The value to set tag to')
    .action(async (tag, value) => {
    if (!CONFIG_TAGS[tag]) {
        utils_1.logger.error(`Unknown config tag "${clc.bold(tag)}.\nValid options: ${readableTagsHint()}`);
        return;
    }
    let parsedValue;
    try {
        parsedValue = CONFIG_TAGS[tag](value);
    }
    catch (e) {
        utils_1.logger.error(`Invalid type for "${clc.bold(tag)}.\n${e.message}`);
        return;
    }
    await (0, utils_1.record)(new utils_1.ConfigEvent(tag));
    const userSettings = (0, utils_1.getUserSettings)();
    (0, utils_1.setUserSettings)({
        ...userSettings,
        [tag]: parsedValue,
    });
    utils_1.logger.info(`Set "${clc.bold(tag)}" to "${clc.bold(value)}".`);
});
function readableTagsHint() {
    return Object.keys(CONFIG_TAGS).map(clc.bold).join(', ');
}
//# sourceMappingURL=config.js.map