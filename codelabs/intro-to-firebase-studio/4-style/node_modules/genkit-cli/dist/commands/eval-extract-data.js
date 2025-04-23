"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalExtractData = void 0;
const utils_1 = require("@genkit-ai/tools-common/utils");
const commander_1 = require("commander");
const promises_1 = require("fs/promises");
const manager_utils_1 = require("../utils/manager-utils");
exports.evalExtractData = new commander_1.Command('eval:extractData')
    .description('extract evaludation data for a given flow from the trace store')
    .argument('<flowName>', 'name of the flow to run')
    .option('--output <filename>', 'name of the output file to store the extracted data')
    .option('--maxRows <maxRows>', 'maximum number of rows', '100')
    .option('--label [label]', 'label flow run in this batch')
    .action(async (flowName, options) => {
    await (0, manager_utils_1.runWithManager)(async (manager) => {
        const extractors = await (0, utils_1.getEvalExtractors)(`/flow/${flowName}`);
        utils_1.logger.info(`Extracting trace data '/flow/${flowName}'...`);
        let dataset = [];
        let continuationToken = undefined;
        while (dataset.length < parseInt(options.maxRows)) {
            const response = await manager.listTraces({
                limit: parseInt(options.maxRows),
                continuationToken,
            });
            continuationToken = response.continuationToken;
            const traces = response.traces;
            let batch = traces
                .map((t) => {
                const rootSpan = Object.values(t.spans).find((s) => s.attributes['genkit:metadata:subtype'] === 'flow' &&
                    (!options.label ||
                        s.attributes['batchRun'] === options.label) &&
                    s.attributes['genkit:name'] === flowName);
                if (!rootSpan) {
                    return undefined;
                }
                return t;
            })
                .filter((t) => !!t)
                .map((trace) => {
                return {
                    testCaseId: (0, utils_1.generateTestCaseId)(),
                    input: extractors.input(trace),
                    output: extractors.output(trace),
                    context: toArray(extractors.context(trace)),
                    traceIds: Array.from(new Set(Object.values(trace.spans).map((span) => span.traceId))),
                };
            })
                .filter((result) => !!result);
            batch.forEach((d) => dataset.push(d));
            if (dataset.length > parseInt(options.maxRows)) {
                dataset = dataset.splice(0, parseInt(options.maxRows));
                break;
            }
            if (!continuationToken) {
                break;
            }
        }
        if (options.output) {
            utils_1.logger.info(`Writing data to '${options.output}'...`);
            await (0, promises_1.writeFile)(options.output, JSON.stringify(dataset, undefined, '  '));
        }
        else {
            utils_1.logger.info(`Results will not be written to file.`);
            console.log(`Results: ${JSON.stringify(dataset, undefined, '  ')}`);
        }
    });
});
function toArray(input) {
    return Array.isArray(input) ? input : [input];
}
//# sourceMappingURL=eval-extract-data.js.map