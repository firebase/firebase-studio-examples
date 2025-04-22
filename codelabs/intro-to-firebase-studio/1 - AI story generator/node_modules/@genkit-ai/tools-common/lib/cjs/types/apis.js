"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateDataResponseSchema = exports.ErrorDetailSchema = exports.ValidateDataRequestSchema = exports.RunNewEvaluationRequestSchema = exports.UpdateDatasetRequestSchema = exports.CreateDatasetRequestSchema = exports.GetEvalRunRequestSchema = exports.ListEvalKeysResponseSchema = exports.ListEvalKeysRequestSchema = exports.PageViewSchema = exports.CreatePromptRequestSchema = exports.RunActionRequestSchema = exports.GetTraceRequestSchema = exports.ListTracesResponseSchema = exports.ListTracesRequestSchema = void 0;
const zod_1 = require("zod");
const eval_1 = require("./eval");
const model_1 = require("./model");
const trace_1 = require("./trace");
exports.ListTracesRequestSchema = zod_1.z.object({
    limit: zod_1.z.number().optional(),
    continuationToken: zod_1.z.string().optional(),
});
exports.ListTracesResponseSchema = zod_1.z.object({
    traces: zod_1.z.array(trace_1.TraceDataSchema),
    continuationToken: zod_1.z.string().optional(),
});
exports.GetTraceRequestSchema = zod_1.z.object({
    traceId: zod_1.z.string().describe('ID of the trace.'),
});
exports.RunActionRequestSchema = zod_1.z.object({
    key: zod_1.z
        .string()
        .describe('Action key that consists of the action type and ID.'),
    input: zod_1.z
        .any()
        .optional()
        .describe('An input with the type that this action expects.'),
    context: zod_1.z
        .any()
        .optional()
        .describe('Additional runtime context data (ex. auth context data).'),
    telemetryLabels: zod_1.z
        .record(zod_1.z.string(), zod_1.z.string())
        .optional()
        .describe('Labels to be applied to telemetry data.'),
});
exports.CreatePromptRequestSchema = zod_1.z.object({
    model: zod_1.z.string(),
    messages: zod_1.z.array(model_1.MessageSchema),
    config: model_1.GenerationCommonConfigSchema.passthrough().optional(),
    tools: zod_1.z.array(model_1.ToolDefinitionSchema).optional(),
});
exports.PageViewSchema = zod_1.z.object({
    pageTitle: zod_1.z.string().describe('Page that was viewed by the user.'),
});
exports.ListEvalKeysRequestSchema = zod_1.z.object({
    filter: zod_1.z
        .object({
        actionRef: zod_1.z.string().optional(),
    })
        .optional(),
});
exports.ListEvalKeysResponseSchema = zod_1.z.object({
    evalRunKeys: zod_1.z.array(eval_1.EvalRunKeySchema),
});
exports.GetEvalRunRequestSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
exports.CreateDatasetRequestSchema = zod_1.z.object({
    data: eval_1.InferenceDatasetSchema,
    datasetId: zod_1.z.string().optional(),
    datasetType: eval_1.DatasetTypeSchema,
    schema: eval_1.DatasetSchemaSchema.optional(),
    targetAction: zod_1.z.string().optional(),
});
exports.UpdateDatasetRequestSchema = zod_1.z.object({
    datasetId: zod_1.z.string(),
    data: eval_1.InferenceDatasetSchema.optional(),
    schema: eval_1.DatasetSchemaSchema.optional(),
    targetAction: zod_1.z.string().optional(),
});
exports.RunNewEvaluationRequestSchema = zod_1.z.object({
    dataSource: zod_1.z.object({
        datasetId: zod_1.z.string().optional(),
        data: eval_1.InferenceDatasetSchema.optional(),
    }),
    actionRef: zod_1.z.string(),
    evaluators: zod_1.z.array(zod_1.z.string()).optional(),
    options: zod_1.z
        .object({
        context: zod_1.z.string().optional(),
        actionConfig: zod_1.z
            .any()
            .describe('addition parameters required for inference')
            .optional(),
    })
        .optional(),
});
exports.ValidateDataRequestSchema = zod_1.z.object({
    dataSource: zod_1.z.object({
        datasetId: zod_1.z.string().optional(),
        data: eval_1.InferenceDatasetSchema.optional(),
    }),
    actionRef: zod_1.z.string(),
});
exports.ErrorDetailSchema = zod_1.z.object({
    path: zod_1.z.string(),
    message: zod_1.z.string(),
});
exports.ValidateDataResponseSchema = zod_1.z.object({
    valid: zod_1.z.boolean(),
    errors: zod_1.z
        .record(zod_1.z.string(), zod_1.z.array(exports.ErrorDetailSchema))
        .describe('Errors mapping, if any. The key is testCaseId if source is a dataset, otherewise it is the index number (stringified)')
        .optional(),
});
//# sourceMappingURL=apis.js.map