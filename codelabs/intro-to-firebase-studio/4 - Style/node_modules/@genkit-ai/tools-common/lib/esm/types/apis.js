import { z } from 'zod';
import { DatasetSchemaSchema, DatasetTypeSchema, EvalRunKeySchema, InferenceDatasetSchema, } from './eval';
import { GenerationCommonConfigSchema, MessageSchema, ToolDefinitionSchema, } from './model';
import { TraceDataSchema } from './trace';
export const ListTracesRequestSchema = z.object({
    limit: z.number().optional(),
    continuationToken: z.string().optional(),
});
export const ListTracesResponseSchema = z.object({
    traces: z.array(TraceDataSchema),
    continuationToken: z.string().optional(),
});
export const GetTraceRequestSchema = z.object({
    traceId: z.string().describe('ID of the trace.'),
});
export const RunActionRequestSchema = z.object({
    key: z
        .string()
        .describe('Action key that consists of the action type and ID.'),
    input: z
        .any()
        .optional()
        .describe('An input with the type that this action expects.'),
    context: z
        .any()
        .optional()
        .describe('Additional runtime context data (ex. auth context data).'),
    telemetryLabels: z
        .record(z.string(), z.string())
        .optional()
        .describe('Labels to be applied to telemetry data.'),
});
export const CreatePromptRequestSchema = z.object({
    model: z.string(),
    messages: z.array(MessageSchema),
    config: GenerationCommonConfigSchema.passthrough().optional(),
    tools: z.array(ToolDefinitionSchema).optional(),
});
export const PageViewSchema = z.object({
    pageTitle: z.string().describe('Page that was viewed by the user.'),
});
export const ListEvalKeysRequestSchema = z.object({
    filter: z
        .object({
        actionRef: z.string().optional(),
    })
        .optional(),
});
export const ListEvalKeysResponseSchema = z.object({
    evalRunKeys: z.array(EvalRunKeySchema),
});
export const GetEvalRunRequestSchema = z.object({
    name: z.string(),
});
export const CreateDatasetRequestSchema = z.object({
    data: InferenceDatasetSchema,
    datasetId: z.string().optional(),
    datasetType: DatasetTypeSchema,
    schema: DatasetSchemaSchema.optional(),
    targetAction: z.string().optional(),
});
export const UpdateDatasetRequestSchema = z.object({
    datasetId: z.string(),
    data: InferenceDatasetSchema.optional(),
    schema: DatasetSchemaSchema.optional(),
    targetAction: z.string().optional(),
});
export const RunNewEvaluationRequestSchema = z.object({
    dataSource: z.object({
        datasetId: z.string().optional(),
        data: InferenceDatasetSchema.optional(),
    }),
    actionRef: z.string(),
    evaluators: z.array(z.string()).optional(),
    options: z
        .object({
        context: z.string().optional(),
        actionConfig: z
            .any()
            .describe('addition parameters required for inference')
            .optional(),
    })
        .optional(),
});
export const ValidateDataRequestSchema = z.object({
    dataSource: z.object({
        datasetId: z.string().optional(),
        data: InferenceDatasetSchema.optional(),
    }),
    actionRef: z.string(),
});
export const ErrorDetailSchema = z.object({
    path: z.string(),
    message: z.string(),
});
export const ValidateDataResponseSchema = z.object({
    valid: z.boolean(),
    errors: z
        .record(z.string(), z.array(ErrorDetailSchema))
        .describe('Errors mapping, if any. The key is testCaseId if source is a dataset, otherewise it is the index number (stringified)')
        .optional(),
});
//# sourceMappingURL=apis.js.map