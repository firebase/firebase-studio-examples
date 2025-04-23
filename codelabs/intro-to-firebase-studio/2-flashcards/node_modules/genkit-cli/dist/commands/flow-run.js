"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flowRun = void 0;
const utils_1 = require("@genkit-ai/tools-common/utils");
const commander_1 = require("commander");
const promises_1 = require("fs/promises");
const manager_utils_1 = require("../utils/manager-utils");
exports.flowRun = new commander_1.Command('flow:run')
    .description('run a flow using provided data as input')
    .argument('<flowName>', 'name of the flow to run')
    .argument('[data]', 'JSON data to use to start the flow')
    .option('-w, --wait', 'Wait for the flow to complete', false)
    .option('-s, --stream', 'Stream output', false)
    .option('-c, --context <JSON>', 'JSON object passed to context', '')
    .option('--output <filename>', 'name of the output file to store the extracted data')
    .action(async (flowName, data, options) => {
    await (0, manager_utils_1.runWithManager)(async (manager) => {
        utils_1.logger.info(`Running '/flow/${flowName}' (stream=${options.stream})...`);
        let result = (await manager.runAction({
            key: `/flow/${flowName}`,
            input: data ? JSON.parse(data) : undefined,
            context: options.context ? JSON.parse(options.context) : undefined,
        }, options.stream
            ? (chunk) => console.log(JSON.stringify(chunk, undefined, '  '))
            : undefined)).result;
        utils_1.logger.info('Result:\n' + JSON.stringify(result, undefined, '  '));
        if (options.output && result) {
            await (0, promises_1.writeFile)(options.output, JSON.stringify(result, undefined, ' '));
        }
    });
});
//# sourceMappingURL=flow-run.js.map