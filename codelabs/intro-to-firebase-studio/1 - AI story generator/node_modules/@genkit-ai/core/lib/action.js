"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var action_exports = {};
__export(action_exports, {
  StatusCodes: () => import_statusTypes.StatusCodes,
  StatusSchema: () => import_statusTypes.StatusSchema,
  action: () => action,
  actionWithMiddleware: () => actionWithMiddleware,
  defineAction: () => defineAction,
  defineActionAsync: () => defineActionAsync,
  getStreamingCallback: () => getStreamingCallback,
  isInRuntimeContext: () => isInRuntimeContext,
  runInActionRuntimeContext: () => runInActionRuntimeContext,
  runOutsideActionRuntimeContext: () => runOutsideActionRuntimeContext,
  runWithStreamingCallback: () => runWithStreamingCallback,
  sentinelNoopStreamingCallback: () => sentinelNoopStreamingCallback
});
module.exports = __toCommonJS(action_exports);
var import_async = require("./async.js");
var import_context = require("./context.js");
var import_schema = require("./schema.js");
var import_tracing = require("./tracing.js");
var import_statusTypes = require("./statusTypes.js");
function actionWithMiddleware(action2, middleware) {
  const wrapped = async (req) => {
    return (await wrapped.run(req)).result;
  };
  wrapped.__action = action2.__action;
  wrapped.__registry = action2.__registry;
  wrapped.run = async (req, options) => {
    let telemetry;
    const dispatch = async (index, req2, opts) => {
      if (index === middleware.length) {
        const result = await action2.run(req2, opts);
        telemetry = result.telemetry;
        return result.result;
      }
      const currentMiddleware = middleware[index];
      if (currentMiddleware.length === 3) {
        return currentMiddleware(
          req2,
          opts,
          async (modifiedReq, modifiedOptions) => dispatch(index + 1, modifiedReq || req2, modifiedOptions || opts)
        );
      } else if (currentMiddleware.length === 2) {
        return currentMiddleware(
          req2,
          async (modifiedReq) => dispatch(index + 1, modifiedReq || req2, opts)
        );
      } else {
        throw new Error("unspported middleware function shape");
      }
    };
    wrapped.stream = action2.stream;
    return { result: await dispatch(0, req, options), telemetry };
  };
  return wrapped;
}
function action(registry, config, fn) {
  const actionName = typeof config.name === "string" ? config.name : `${config.name.pluginId}/${config.name.actionId}`;
  const actionFn = async (input, options) => {
    return (await actionFn.run(input, options)).result;
  };
  actionFn.__registry = registry;
  actionFn.__action = {
    name: actionName,
    description: config.description,
    inputSchema: config.inputSchema,
    inputJsonSchema: config.inputJsonSchema,
    outputSchema: config.outputSchema,
    outputJsonSchema: config.outputJsonSchema,
    streamSchema: config.streamSchema,
    metadata: config.metadata
  };
  actionFn.run = async (input, options) => {
    input = (0, import_schema.parseSchema)(input, {
      schema: config.inputSchema,
      jsonSchema: config.inputJsonSchema
    });
    let traceId;
    let spanId;
    let output = await (0, import_tracing.newTrace)(
      registry,
      {
        name: actionName,
        labels: {
          [import_tracing.SPAN_TYPE_ATTR]: "action",
          "genkit:metadata:subtype": config.actionType,
          ...options?.telemetryLabels
        }
      },
      async (metadata, span) => {
        (0, import_tracing.setCustomMetadataAttributes)(registry, { subtype: config.actionType });
        if (options?.context) {
          (0, import_tracing.setCustomMetadataAttributes)(registry, {
            context: JSON.stringify(options.context)
          });
        }
        traceId = span.spanContext().traceId;
        spanId = span.spanContext().spanId;
        metadata.name = actionName;
        metadata.input = input;
        try {
          const actionFn2 = () => fn(input, {
            ...options,
            // Context can either be explicitly set, or inherited from the parent action.
            context: options?.context ?? (0, import_context.getContext)(registry),
            sendChunk: options?.onChunk ?? sentinelNoopStreamingCallback
          });
          const output2 = await (0, import_context.runWithContext)(
            registry,
            options?.context,
            actionFn2
          );
          metadata.output = JSON.stringify(output2);
          return output2;
        } catch (err) {
          if (typeof err === "object") {
            err.traceId = traceId;
          }
          throw err;
        }
      }
    );
    output = (0, import_schema.parseSchema)(output, {
      schema: config.outputSchema,
      jsonSchema: config.outputJsonSchema
    });
    return {
      result: output,
      telemetry: {
        traceId,
        spanId
      }
    };
  };
  actionFn.stream = (input, opts) => {
    let chunkStreamController;
    const chunkStream = new ReadableStream({
      start(controller) {
        chunkStreamController = controller;
      },
      pull() {
      },
      cancel() {
      }
    });
    const invocationPromise = actionFn.run(config.inputSchema ? config.inputSchema.parse(input) : input, {
      onChunk: (chunk) => {
        chunkStreamController.enqueue(chunk);
      },
      context: opts?.context
    }).then((s) => s.result).finally(() => {
      chunkStreamController.close();
    });
    return {
      output: invocationPromise,
      stream: async function* () {
        const reader = chunkStream.getReader();
        while (true) {
          const chunk = await reader.read();
          if (chunk.value) {
            yield chunk.value;
          }
          if (chunk.done) {
            break;
          }
        }
        return await invocationPromise;
      }()
    };
  };
  if (config.use) {
    return actionWithMiddleware(actionFn, config.use);
  }
  return actionFn;
}
function defineAction(registry, config, fn) {
  if (isInRuntimeContext(registry)) {
    throw new Error(
      "Cannot define new actions at runtime.\nSee: https://github.com/firebase/genkit/blob/main/docs/errors/no_new_actions_at_runtime.md"
    );
  }
  const act = action(
    registry,
    config,
    async (i, options) => {
      await registry.initializeAllPlugins();
      return await runInActionRuntimeContext(registry, () => fn(i, options));
    }
  );
  act.__action.actionType = config.actionType;
  registry.registerAction(config.actionType, act);
  return act;
}
function defineActionAsync(registry, actionType, name, config, onInit) {
  const actionName = typeof name === "string" ? name : `${name.pluginId}/${name.actionId}`;
  const actionPromise = (0, import_async.lazy)(
    () => config.then((resolvedConfig) => {
      const act = action(
        registry,
        resolvedConfig,
        async (i, options) => {
          await registry.initializeAllPlugins();
          return await runInActionRuntimeContext(
            registry,
            () => resolvedConfig.fn(i, options)
          );
        }
      );
      act.__action.actionType = actionType;
      onInit?.(act);
      return act;
    })
  );
  registry.registerActionAsync(actionType, actionName, actionPromise);
  return actionPromise;
}
const streamingAlsKey = "core.action.streamingCallback";
const sentinelNoopStreamingCallback = () => null;
function runWithStreamingCallback(registry, streamingCallback, fn) {
  return registry.asyncStore.run(
    streamingAlsKey,
    streamingCallback || sentinelNoopStreamingCallback,
    fn
  );
}
function getStreamingCallback(registry) {
  const cb = registry.asyncStore.getStore(streamingAlsKey);
  if (cb === sentinelNoopStreamingCallback) {
    return void 0;
  }
  return cb;
}
const runtimeContextAslKey = "core.action.runtimeContext";
function isInRuntimeContext(registry) {
  return registry.asyncStore.getStore(runtimeContextAslKey) === "runtime";
}
function runInActionRuntimeContext(registry, fn) {
  return registry.asyncStore.run(runtimeContextAslKey, "runtime", fn);
}
function runOutsideActionRuntimeContext(registry, fn) {
  return registry.asyncStore.run(runtimeContextAslKey, "outside", fn);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StatusCodes,
  StatusSchema,
  action,
  actionWithMiddleware,
  defineAction,
  defineActionAsync,
  getStreamingCallback,
  isInRuntimeContext,
  runInActionRuntimeContext,
  runOutsideActionRuntimeContext,
  runWithStreamingCallback,
  sentinelNoopStreamingCallback
});
//# sourceMappingURL=action.js.map