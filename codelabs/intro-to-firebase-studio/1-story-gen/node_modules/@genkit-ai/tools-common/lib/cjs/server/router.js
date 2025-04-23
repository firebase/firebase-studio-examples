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
exports.TOOLS_SERVER_ROUTER = void 0;
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const eval_1 = require("../eval");
const types_1 = require("../manager/types");
const apis = __importStar(require("../types/apis"));
const evals = __importStar(require("../types/eval"));
const analytics_1 = require("../utils/analytics");
const package_1 = require("../utils/package");
const prompt_1 = require("../utils/prompt");
const t = server_1.initTRPC.create({
    errorFormatter(opts) {
        const { shape, error } = opts;
        if (error.cause instanceof types_1.GenkitToolsError && error.cause.data) {
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
    const event = new analytics_1.ToolsRequestEvent(path);
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
    (0, analytics_1.record)(analyticsEvent).catch((err) => {
        console.log(`Failed to send analytics ${err}`);
    });
    return result;
});
const TOOLS_SERVER_ROUTER = (manager) => t.router({
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
        return (0, prompt_1.fromMessages)(frontmatter, input.messages);
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
        const response = await (0, eval_1.getEvalStore)().list(input);
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
        const evalRun = await (0, eval_1.getEvalStore)().load(evalRunId);
        if (!evalRun) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: `Eval run with ${input.name} not found`,
            });
        }
        return evalRun;
    }),
    listDatasets: loggedProcedure
        .output(zod_1.z.array(evals.DatasetMetadataSchema))
        .query(async () => {
        const response = await (0, eval_1.getDatasetStore)().listDatasets();
        return response;
    }),
    getDataset: loggedProcedure
        .input(zod_1.z.string())
        .output(evals.DatasetSchema)
        .query(async ({ input }) => {
        const response = await (0, eval_1.getDatasetStore)().getDataset(input);
        return response;
    }),
    createDataset: loggedProcedure
        .input(apis.CreateDatasetRequestSchema)
        .output(evals.DatasetMetadataSchema)
        .mutation(async ({ input }) => {
        const response = await (0, eval_1.getDatasetStore)().createDataset(input);
        return response;
    }),
    updateDataset: loggedProcedure
        .input(apis.UpdateDatasetRequestSchema)
        .output(evals.DatasetMetadataSchema)
        .mutation(async ({ input }) => {
        const response = await (0, eval_1.getDatasetStore)().updateDataset(input);
        return response;
    }),
    deleteDataset: loggedProcedure
        .input(zod_1.z.string())
        .output(zod_1.z.void())
        .mutation(async ({ input }) => {
        const response = await (0, eval_1.getDatasetStore)().deleteDataset(input);
        return response;
    }),
    runNewEvaluation: loggedProcedure
        .input(apis.RunNewEvaluationRequestSchema)
        .output(evals.EvalRunKeySchema)
        .mutation(async ({ input }) => {
        const response = await (0, eval_1.runNewEvaluation)(manager, input);
        return response;
    }),
    validateDatasetSchema: loggedProcedure
        .input(apis.ValidateDataRequestSchema)
        .output(apis.ValidateDataResponseSchema)
        .mutation(async ({ input }) => {
        const response = await (0, eval_1.validateSchema)(manager, input);
        return response;
    }),
    sendPageView: t.procedure
        .input(apis.PageViewSchema)
        .query(async ({ input }) => {
        await (0, analytics_1.record)(new analytics_1.PageViewEvent(input.pageTitle));
    }),
    getGenkitEnvironment: t.procedure.query(() => {
        return {
            cliPackageVersion: package_1.toolsPackage.version,
            environmentVars: parseEnv(process.env),
        };
    }),
    getCurrentRuntime: t.procedure.query(() => {
        return manager.getMostRecentRuntime() ?? {};
    }),
});
exports.TOOLS_SERVER_ROUTER = TOOLS_SERVER_ROUTER;
//# sourceMappingURL=router.js.map