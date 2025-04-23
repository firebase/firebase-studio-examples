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
var flow_exports = {};
__export(flow_exports, {
  defineFlow: () => defineFlow,
  run: () => run
});
module.exports = __toCommonJS(flow_exports);
var import_node_async_hooks = require("node:async_hooks");
var import_action = require("./action.js");
var import_registry = require("./registry.js");
var import_tracing = require("./tracing.js");
function defineFlow(registry, config, fn) {
  const resolvedConfig = typeof config === "string" ? { name: config } : config;
  return defineFlowAction(registry, resolvedConfig, fn);
}
function defineFlowAction(registry, config, fn) {
  return (0, import_action.defineAction)(
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
const legacyRegistryAls = new import_node_async_hooks.AsyncLocalStorage();
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
  } else if (fnOrRegistry instanceof import_registry.Registry || fnOrRegistry?.registry) {
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
  return (0, import_tracing.runInNewSpan)(
    registry,
    {
      metadata: { name },
      labels: {
        [import_tracing.SPAN_TYPE_ATTR]: "flowStep"
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defineFlow,
  run
});
//# sourceMappingURL=flow.js.map