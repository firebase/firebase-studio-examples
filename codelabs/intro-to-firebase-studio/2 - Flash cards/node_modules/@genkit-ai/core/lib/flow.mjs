import { AsyncLocalStorage } from "node:async_hooks";
import { defineAction } from "./action.js";
import { Registry } from "./registry.js";
import { runInNewSpan, SPAN_TYPE_ATTR } from "./tracing.js";
function defineFlow(registry, config, fn) {
  const resolvedConfig = typeof config === "string" ? { name: config } : config;
  return defineFlowAction(registry, resolvedConfig, fn);
}
function defineFlowAction(registry, config, fn) {
  return defineAction(
    registry,
    {
      actionType: "flow",
      name: config.name,
      inputSchema: config.inputSchema,
      outputSchema: config.outputSchema,
      streamSchema: config.streamSchema
    },
    async (input, { sendChunk, context }) => {
      return await legacyRegistryAls.run(registry, () => {
        const ctx = sendChunk;
        ctx.sendChunk = sendChunk;
        ctx.context = context;
        return fn(input, ctx);
      });
    }
  );
}
const legacyRegistryAls = new AsyncLocalStorage();
function run(name, funcOrInput, fnOrRegistry, maybeRegistry) {
  let func;
  let input;
  let registry;
  if (typeof funcOrInput === "function") {
    func = funcOrInput;
  } else {
    input = funcOrInput;
  }
  if (typeof fnOrRegistry === "function") {
    func = fnOrRegistry;
  } else if (fnOrRegistry instanceof Registry || fnOrRegistry?.registry) {
    registry = fnOrRegistry?.registry ? fnOrRegistry?.registry : fnOrRegistry;
  }
  if (maybeRegistry) {
    registry = maybeRegistry.registry ? maybeRegistry.registry : maybeRegistry;
  }
  if (!registry) {
    registry = legacyRegistryAls.getStore();
  }
  if (!registry) {
    throw new Error(
      "Unable to resolve registry. Consider explicitly passing Genkit instance."
    );
  }
  if (!func) {
    throw new Error("unable to resolve run function");
  }
  return runInNewSpan(
    registry,
    {
      metadata: { name },
      labels: {
        [SPAN_TYPE_ATTR]: "flowStep"
      }
    },
    async (meta) => {
      meta.input = input;
      const output = arguments.length === 3 ? await func(input) : await func();
      meta.output = JSON.stringify(output);
      return output;
    }
  );
}
export {
  defineFlow,
  run
};
//# sourceMappingURL=flow.mjs.map