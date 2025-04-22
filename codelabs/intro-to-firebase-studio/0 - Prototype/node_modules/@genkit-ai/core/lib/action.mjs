import { lazy } from "./async.js";
import { getContext, runWithContext } from "./context.js";
import { parseSchema } from "./schema.js";
import {
  SPAN_TYPE_ATTR,
  newTrace,
  setCustomMetadataAttributes
} from "./tracing.js";
import { StatusCodes, StatusSchema } from "./statusTypes.js";
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
    input = parseSchema(input, {
      schema: config.inputSchema,
      jsonSchema: config.inputJsonSchema
    });
    let traceId;
    let spanId;
    let output = await newTrace(
      registry,
      {
        name: actionName,
        labels: {
          [SPAN_TYPE_ATTR]: "action",
          "genkit:metadata:subtype": config.actionType,
          ...options?.telemetryLabels
        }
      },
      async (metadata, span) => {
        setCustomMetadataAttributes(registry, { subtype: config.actionType });
        if (options?.context) {
          setCustomMetadataAttributes(registry, {
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
            context: options?.context ?? getContext(registry),
            sendChunk: options?.onChunk ?? sentinelNoopStreamingCallback
          });
          const output2 = await runWithContext(
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
    output = parseSchema(output, {
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
  const actionPromise = lazy(
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
export {
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
};
//# sourceMappingURL=action.mjs.map