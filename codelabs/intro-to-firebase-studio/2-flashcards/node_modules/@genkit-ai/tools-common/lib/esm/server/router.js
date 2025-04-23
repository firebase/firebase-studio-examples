import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { getDatasetStore, getEvalStore, runNewEvaluation, validateSchema, } from '../eval';
import { GenkitToolsError } from '../manager/types';
import * as apis from '../types/apis';
import * as evals from '../types/eval';
import { PageViewEvent, record, ToolsRequestEvent } from '../utils/analytics';
import { toolsPackage } from '../utils/package';
import { fromMessages } from '../utils/prompt';
const t = initTRPC.create({
    errorFormatter(opts) {
        const { shape, error } = opts;
        if (error.cause instanceof GenkitToolsError && error.cause.data) {
            return {
                ...shape,
                data: {
                    ...shape.data,
                    genkitErrorMessage: error.cause.data.message,
                    genkitErrorDetails: error.cause.data.details,
                },
            };
        }
        return shape;
    },
});
const analyticsEventForRoute = (path, input, durationMs, status) => {
    const event = new ToolsRequestEvent(path);
    event.duration = durationMs;
    event.parameters = {
        ...event.parameters,
        status,
    };
    switch (path) {
        case 'runAction':
            const splits = input.key?.split('/');
            event.parameters = {
                ...event.parameters,
                action: splits.length > 1 ? splits[1] : 'unknown',
            };
            break;
        default:
    }
    return event;
};
const parseEnv = (environ) => {
    const environmentVars = [];
    Object.entries(environ)
        .sort((a, b) => {
        if (a[0] < b[0]) {
            return -1;
        }
        if (a[0] > b[0]) {
            return 1;
        }
        return 0;
    })
        .forEach(([name, value]) => {
        environmentVars.push({ name, value: value || '' });
    });
    return environmentVars;
};
const loggedProcedure = t.procedure.use(async (opts) => {
    const start = Date.now();
    const result = await opts.next();
    const durationMs = Date.now() - start;
    const analyticsEvent = analyticsEventForRoute(opts.path, opts.rawInput, durationMs, result.ok ? 'success' : 'failure');
    record(analyticsEvent).catch((err) => {
        console.log(`Failed to send analytics ${err}`);
    });
    return result;
});
export const TOOLS_SERVER_ROUTER = (manager) => t.router({
    listActions: loggedProcedure.query(async () => {
        return manager.listActions();
    }),
    runAction: loggedProcedure
        .input(apis.RunActionRequestSchema)
        .mutation(async ({ input }) => {
        return manager.runAction(input);
    }),
    createPrompt: loggedProcedure
        .input(apis.CreatePromptRequestSchema)
        .mutation(async ({ input }) => {
        const frontmatter = {
            model: input.model.replace('/model/', ''),
            config: input.config,
            tools: input.tools?.map((toolDefinition) => toolDefinition.name),
        };
        return fromMessages(frontmatter, input.messages);
    }),
    listTraces: loggedProcedure
        .input(apis.ListTracesRequestSchema)
        .query(async ({ input }) => {
        return manager.listTraces(input);
    }),
    getTrace: loggedProcedure
        .input(apis.GetTraceRequestSchema)
        .query(async ({ input }) => {
        return manager.getTrace(input);
    }),
    listEvalRunKeys: loggedProcedure
        .input(apis.ListEvalKeysRequestSchema)
        .output(apis.ListEvalKeysResponseSchema)
        .query(async ({ input }) => {
        const response = await getEvalStore().list(input);
        return {
            evalRunKeys: response.evalRunKeys,
        };
    }),
    getEvalRun: loggedProcedure
        .input(apis.GetEvalRunRequestSchema)
        .output(evals.EvalRunSchema)
        .query(async ({ input }) => {
        const parts = input.name.split('/');
        const evalRunId = parts[1];
        const evalRun = await getEvalStore().load(evalRunId);
        if (!evalRun) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: `Eval run with ${input.name} not found`,
            });
        }
        return evalRun;
    }),
    listDatasets: loggedProcedure
        .output(z.array(evals.DatasetMetadataSchema))
        .query(async () => {
        const response = await getDatasetStore().listDatasets();
        return response;
    }),
    getDataset: loggedProcedure
        .input(z.string())
        .output(evals.DatasetSchema)
        .query(async ({ input }) => {
        const response = await getDatasetStore().getDataset(input);
        return response;
    }),
    createDataset: loggedProcedure
        .input(apis.CreateDatasetRequestSchema)
        .output(evals.DatasetMetadataSchema)
        .mutation(async ({ input }) => {
        const response = await getDatasetStore().createDataset(input);
        return response;
    }),
    updateDataset: loggedProcedure
        .input(apis.UpdateDatasetRequestSchema)
        .output(evals.DatasetMetadataSchema)
        .mutation(async ({ input }) => {
        const response = await getDatasetStore().updateDataset(input);
        return response;
    }),
    deleteDataset: loggedProcedure
        .input(z.string())
        .output(z.void())
        .mutation(async ({ input }) => {
        const response = await getDatasetStore().deleteDataset(input);
        return response;
    }),
    runNewEvaluation: loggedProcedure
        .input(apis.RunNewEvaluationRequestSchema)
        .output(evals.EvalRunKeySchema)
        .mutation(async ({ input }) => {
        const response = await runNewEvaluation(manager, input);
        return response;
    }),
    validateDatasetSchema: loggedProcedure
        .input(apis.ValidateDataRequestSchema)
        .output(apis.ValidateDataResponseSchema)
        .mutation(async ({ input }) => {
        const response = await validateSchema(manager, input);
        return response;
    }),
    sendPageView: t.procedure
        .input(apis.PageViewSchema)
        .query(async ({ input }) => {
        await record(new PageViewEvent(input.pageTitle));
    }),
    getGenkitEnvironment: t.procedure.query(() => {
        return {
            cliPackageVersion: toolsPackage.version,
            environmentVars: parseEnv(process.env),
        };
    }),
    getCurrentRuntime: t.procedure.query(() => {
        return manager.getMostRecentRuntime() ?? {};
    }),
});
//# sourceMappingURL=router.js.map