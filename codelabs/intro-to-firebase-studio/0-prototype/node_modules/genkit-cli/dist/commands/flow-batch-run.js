"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flowBatchRun = void 0;
const utils_1 = require("@genkit-ai/tools-common/utils");
const commander_1 = require("commander");
const promises_1 = require("fs/promises");
const manager_utils_1 = require("../utils/manager-utils");
exports.flowBatchRun = new commander_1.Command('flow:batchRun')
    .description('batch run a flow using provided set of data from a file as input')
    .argument('<flowName>', 'name of the flow to run')
    .argument('<inputFileName>', 'JSON batch data to use to run the flow')
    .option('-w, --wait', 'Wait for the flow to complete', false)
    .option('-c, --context <JSON>', 'JSON object passed to context', '')
    .option('--output <filename>', 'name of the output file to store the output')
    .option('--label [label]', 'label flow run in this batch')
    .action(async (flowName, fileName, options) => {
    await (0, manager_utils_1.runWithManager)(async (manager) => {
        const inputData = JSON.parse(await (0, promises_1.readFile)(fileName, 'utf8'));
        let input = inputData;
        if (inputData.length === 0) {
            throw new Error('batch input data must be a non-empty array');
        }
        if (Object.hasOwn(inputData[0], 'input')) {
            input = inputData.map((d) => d.input);
        }
        const outputValues = [];
        for (const data of input) {
            utils_1.logger.info(`Running '/flow/${flowName}'...`);
            let response = await manager.runAction({
                key: `/flow/${flowName}`,
                input: data,
                context: options.context ? JSON.parse(options.context) : undefined,
                telemetryLabels: options.label
                    ? { batchRun: options.label }
                    : undefined,
            });
            utils_1.logger.info('Result:\n' + JSON.stringify(response.result, undefined, '  '));
            outputValues.push({
                input: data,
                output: response.result,
            });
        }
        if (options.output) {
            await (0, promises_1.writeFile)(options.output, JSON.stringify(outputValues, undefined, ' '));
        }
    });
});
//# sourceMappingURL=flow-batch-run.js.map