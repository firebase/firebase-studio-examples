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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var tracing_exports = {};
__export(tracing_exports, {
  cleanUpTracing: () => cleanUpTracing,
  enableTelemetry: () => enableTelemetry,
  ensureBasicTelemetryInstrumentation: () => ensureBasicTelemetryInstrumentation,
  flushTracing: () => flushTracing
});
module.exports = __toCommonJS(tracing_exports);
var import_sdk_node = require("@opentelemetry/sdk-node");
var import_sdk_trace_base = require("@opentelemetry/sdk-trace-base");
var import_logging = require("./logging.js");
var import_exporter = require("./tracing/exporter.js");
var import_utils = require("./utils.js");
__reExport(tracing_exports, require("./tracing/exporter.js"), module.exports);
__reExport(tracing_exports, require("./tracing/instrumentation.js"), module.exports);
__reExport(tracing_exports, require("./tracing/processor.js"), module.exports);
__reExport(tracing_exports, require("./tracing/types.js"), module.exports);
let telemetrySDK = null;
let nodeOtelConfig = null;
const instrumentationKey = "__GENKIT_TELEMETRY_INSTRUMENTED";
async function ensureBasicTelemetryInstrumentation() {
  if (global[instrumentationKey]) {
    return await global[instrumentationKey];
  }
  await enableTelemetry({});
}
async function enableTelemetry(telemetryConfig) {
  if (process.env.GENKIT_TELEMETRY_SERVER) {
    (0, import_exporter.setTelemetryServerUrl)(process.env.GENKIT_TELEMETRY_SERVER);
  }
  global[instrumentationKey] = telemetryConfig instanceof Promise ? telemetryConfig : Promise.resolve();
  telemetryConfig = telemetryConfig instanceof Promise ? await telemetryConfig : telemetryConfig;
  nodeOtelConfig = telemetryConfig || {};
  const processors = [createTelemetryServerProcessor()];
  if (nodeOtelConfig.traceExporter) {
    throw new Error("Please specify spanProcessors instead.");
  }
  if (nodeOtelConfig.spanProcessors) {
    processors.push(...nodeOtelConfig.spanProcessors);
  }
  if (nodeOtelConfig.spanProcessor) {
    processors.push(nodeOtelConfig.spanProcessor);
    delete nodeOtelConfig.spanProcessor;
  }
  nodeOtelConfig.spanProcessors = processors;
  telemetrySDK = new import_sdk_node.NodeSDK(nodeOtelConfig);
  telemetrySDK.start();
  process.on("SIGTERM", async () => await cleanUpTracing());
}
async function cleanUpTracing() {
  if (!telemetrySDK) {
    return;
  }
  await maybeFlushMetrics();
  await telemetrySDK.shutdown();
  import_logging.logger.debug("OpenTelemetry SDK shut down.");
  telemetrySDK = null;
}
function createTelemetryServerProcessor() {
  const exporter = new import_exporter.TraceServerExporter();
  return (0, import_utils.isDevEnv)() ? new import_sdk_trace_base.SimpleSpanProcessor(exporter) : new import_sdk_trace_base.BatchSpanProcessor(exporter);
}
function maybeFlushMetrics() {
  if (nodeOtelConfig?.metricReader) {
    return nodeOtelConfig.metricReader.forceFlush();
  }
  return Promise.resolve();
}
async function flushTracing() {
  if (nodeOtelConfig?.spanProcessors) {
    await Promise.all(nodeOtelConfig.spanProcessors.map((p) => p.forceFlush()));
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cleanUpTracing,
  enableTelemetry,
  ensureBasicTelemetryInstrumentation,
  flushTracing,
  ...require("./tracing/exporter.js"),
  ...require("./tracing/instrumentation.js"),
  ...require("./tracing/processor.js"),
  ...require("./tracing/types.js")
});
//# sourceMappingURL=tracing.js.map