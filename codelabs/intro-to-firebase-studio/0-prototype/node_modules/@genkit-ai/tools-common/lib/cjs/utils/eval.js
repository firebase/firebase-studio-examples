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
exports.getModelInput = exports.hasAction = exports.loadEvaluationDatasetFile = exports.loadInferenceDatasetFile = exports.generateTestCaseId = exports.getEvalExtractors = exports.confirmLlmUse = exports.isEvaluator = exports.evaluatorName = exports.EVALUATOR_METADATA_KEY_IS_BILLED = exports.EVALUATOR_METADATA_KEY_DEFINITION = exports.EVALUATOR_METADATA_KEY_DISPLAY_NAME = exports.EVALUATOR_ACTION_PREFIX = void 0;
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const inquirer = __importStar(require("inquirer"));
const readline_1 = require("readline");
const plugin_1 = require("../plugin");
const types_1 = require("../types");
const logger_1 = require("./logger");
const trace_1 = require("./trace");
exports.EVALUATOR_ACTION_PREFIX = '/evaluator';
exports.EVALUATOR_METADATA_KEY_DISPLAY_NAME = 'evaluatorDisplayName';
exports.EVALUATOR_METADATA_KEY_DEFINITION = 'evaluatorDefinition';
exports.EVALUATOR_METADATA_KEY_IS_BILLED = 'evaluatorIsBilled';
function evaluatorName(action) {
    return `${exports.EVALUATOR_ACTION_PREFIX}/${action.name}`;
}
exports.evaluatorName = evaluatorName;
function isEvaluator(key) {
    return key.startsWith(exports.EVALUATOR_ACTION_PREFIX);
}
exports.isEvaluator = isEvaluator;
async function confirmLlmUse(evaluatorActions) {
    const isBilled = evaluatorActions.some((action) => action.metadata && action.metadata[exports.EVALUATOR_METADATA_KEY_IS_BILLED]);
    if (!isBilled) {
        return true;
    }
    const answers = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: 'For each example, the evaluation makes calls to APIs that may result in being charged. Do you wish to proceed?',
            default: false,
        },
    ]);
    return answers.confirm;
}
exports.confirmLlmUse = confirmLlmUse;
function getRootSpan(trace) {
    return (0, trace_1.stackTraceSpans)(trace);
}
function safeParse(value) {
    if (value) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return '';
        }
    }
    return '';
}
const DEFAULT_INPUT_EXTRACTOR = (trace) => {
    const rootSpan = getRootSpan(trace);
    return safeParse(rootSpan?.attributes['genkit:input']);
};
const DEFAULT_OUTPUT_EXTRACTOR = (trace) => {
    const rootSpan = getRootSpan(trace);
    return safeParse(rootSpan?.attributes['genkit:output']);
};
const DEFAULT_CONTEXT_EXTRACTOR = (trace) => {
    return Object.values(trace.spans)
        .filter((s) => s.attributes['genkit:metadata:subtype'] === 'retriever')
        .flatMap((s) => {
        const output = safeParse(s.attributes['genkit:output']);
        if (!output) {
            return [];
        }
        return output.documents.flatMap((d) => d.content.map((c) => c.text).filter((text) => !!text));
    });
};
const DEFAULT_FLOW_EXTRACTORS = {
    input: DEFAULT_INPUT_EXTRACTOR,
    output: DEFAULT_OUTPUT_EXTRACTOR,
    context: DEFAULT_CONTEXT_EXTRACTOR,
};
const DEFAULT_MODEL_EXTRACTORS = {
    input: DEFAULT_INPUT_EXTRACTOR,
    output: DEFAULT_OUTPUT_EXTRACTOR,
    context: () => [],
};
function getStepAttribute(trace, stepName, attributeName) {
    const attr = attributeName ?? 'genkit:output';
    const values = Object.values(trace.spans)
        .filter((step) => step.displayName === stepName)
        .flatMap((step) => {
        return safeParse(step.attributes[attr]);
    });
    if (values.length === 0) {
        return '';
    }
    if (values.length === 1) {
        return values[0];
    }
    return values;
}
function getExtractorFromStepName(stepName) {
    return (trace) => {
        return getStepAttribute(trace, stepName);
    };
}
function getExtractorFromStepSelector(stepSelector) {
    return (trace) => {
        let stepName = undefined;
        let selectedAttribute = 'genkit:output';
        if (Object.hasOwn(stepSelector, 'inputOf')) {
            stepName = stepSelector.inputOf;
            selectedAttribute = 'genkit:input';
        }
        else {
            stepName = stepSelector.outputOf;
            selectedAttribute = 'genkit:output';
        }
        if (!stepName) {
            return '';
        }
        else {
            return getStepAttribute(trace, stepName, selectedAttribute);
        }
    };
}
function getExtractorMap(extractor) {
    let extractorMap = {};
    for (const [key, value] of Object.entries(extractor)) {
        if ((0, plugin_1.isEvalField)(key)) {
            if (typeof value === 'string') {
                extractorMap[key] = getExtractorFromStepName(value);
            }
            else if (typeof value === 'object') {
                extractorMap[key] = getExtractorFromStepSelector(value);
            }
            else if (typeof value === 'function') {
                extractorMap[key] = value;
            }
        }
    }
    return extractorMap;
}
async function getEvalExtractors(actionRef) {
    if (actionRef.startsWith('/model')) {
        logger_1.logger.debug('getEvalExtractors - modelRef provided, using default extractors');
        return Promise.resolve(DEFAULT_MODEL_EXTRACTORS);
    }
    const config = await (0, plugin_1.findToolsConfig)();
    const extractors = config?.evaluators
        ?.filter((e) => e.actionRef === actionRef)
        .map((e) => e.extractors);
    if (!extractors) {
        return Promise.resolve(DEFAULT_FLOW_EXTRACTORS);
    }
    let composedExtractors = DEFAULT_FLOW_EXTRACTORS;
    for (const extractor of extractors) {
        const extractorFunction = getExtractorMap(extractor);
        composedExtractors = { ...composedExtractors, ...extractorFunction };
    }
    return Promise.resolve(composedExtractors);
}
exports.getEvalExtractors = getEvalExtractors;
function generateTestCaseId() {
    return (0, crypto_1.randomUUID)();
}
exports.generateTestCaseId = generateTestCaseId;
async function loadInferenceDatasetFile(fileName) {
    const isJsonl = fileName.endsWith('.jsonl');
    if (isJsonl) {
        return await readJsonlForInference(fileName);
    }
    else {
        const parsedData = JSON.parse(await (0, promises_1.readFile)(fileName, 'utf8'));
        let dataset = types_1.InferenceDatasetSchema.parse(parsedData);
        dataset = dataset.map((sample) => ({
            ...sample,
            testCaseId: sample.testCaseId ?? generateTestCaseId(),
        }));
        return types_1.DatasetSchema.parse(dataset);
    }
}
exports.loadInferenceDatasetFile = loadInferenceDatasetFile;
async function loadEvaluationDatasetFile(fileName) {
    const isJsonl = fileName.endsWith('.jsonl');
    if (isJsonl) {
        return await readJsonlForEvaluation(fileName);
    }
    else {
        const parsedData = JSON.parse(await (0, promises_1.readFile)(fileName, 'utf8'));
        let evaluationInput = types_1.EvaluationDatasetSchema.parse(parsedData);
        evaluationInput = evaluationInput.map((evalSample) => ({
            ...evalSample,
            testCaseId: evalSample.testCaseId ?? generateTestCaseId(),
            traceIds: evalSample.traceIds ?? [],
        }));
        return types_1.EvalInputDatasetSchema.parse(evaluationInput);
    }
}
exports.loadEvaluationDatasetFile = loadEvaluationDatasetFile;
async function readJsonlForInference(fileName) {
    const lines = await readLines(fileName);
    const samples = [];
    for (const line of lines) {
        const parsedSample = types_1.InferenceSampleSchema.parse(JSON.parse(line));
        samples.push({
            ...parsedSample,
            testCaseId: parsedSample.testCaseId ?? generateTestCaseId(),
        });
    }
    return samples;
}
async function readJsonlForEvaluation(fileName) {
    const lines = await readLines(fileName);
    const inputs = [];
    for (const line of lines) {
        const parsedSample = types_1.EvaluationSampleSchema.parse(JSON.parse(line));
        inputs.push({
            ...parsedSample,
            testCaseId: parsedSample.testCaseId ?? generateTestCaseId(),
            traceIds: parsedSample.traceIds ?? [],
        });
    }
    return inputs;
}
async function readLines(fileName) {
    const lines = [];
    const fileStream = (0, fs_1.createReadStream)(fileName);
    const rl = (0, readline_1.createInterface)({
        input: fileStream,
        crlfDelay: Infinity,
    });
    for await (const line of rl) {
        lines.push(line);
    }
    return lines;
}
async function hasAction(params) {
    const { manager, actionRef } = { ...params };
    const actionsRecord = await manager.listActions();
    return actionsRecord.hasOwnProperty(actionRef);
}
exports.hasAction = hasAction;
function getModelInput(data, modelConfig) {
    let message;
    if (typeof data === 'string') {
        message = {
            role: 'user',
            content: [
                {
                    text: data,
                },
            ],
        };
        return {
            messages: message ? [message] : [],
            config: modelConfig,
        };
    }
    else {
        const maybeRequest = types_1.GenerateRequestSchema.safeParse(data);
        if (maybeRequest.success) {
            return maybeRequest.data;
        }
        else {
            throw new Error(`Unable to parse model input as MessageSchema. Details: ${maybeRequest.error}`);
        }
    }
}
exports.getModelInput = getModelInput;
//# sourceMappingURL=eval.js.map