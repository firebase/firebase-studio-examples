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
var instrumentation_exports = {};
__export(instrumentation_exports, {
  ATTR_PREFIX: () => ATTR_PREFIX,
  SPAN_TYPE_ATTR: () => SPAN_TYPE_ATTR,
  appendSpan: () => appendSpan,
  newTrace: () => newTrace,
  runInNewSpan: () => runInNewSpan,
  setCustomMetadataAttribute: () => setCustomMetadataAttribute,
  setCustomMetadataAttributes: () => setCustomMetadataAttributes,
  spanMetadataAlsKey: () => spanMetadataAlsKey,
  toDisplayPath: () => toDisplayPath,
  traceMetadataAlsKey: () => traceMetadataAlsKey
});
module.exports = __toCommonJS(instrumentation_exports);
var import_api = require("@opentelemetry/api");
var import_node_perf_hooks = require("node:perf_hooks");
var import_tracing = require("../tracing.js");
const spanMetadataAlsKey = "core.tracing.instrumentation.span";
const traceMetadataAlsKey = "core.tracing.instrumentation.trace";
const ATTR_PREFIX = "genkit";
const SPAN_TYPE_ATTR = ATTR_PREFIX + ":type";
const TRACER_NAME = "genkit-tracer";
const TRACER_VERSION = "v1";
async function newTrace(registry, opts, fn) {
  registry = registry.registry ? registry.registry : registry;
  await (0, import_tracing.ensureBasicTelemetryInstrumentation)();
  const traceMetadata = registry.asyncStore.getStore(
    traceMetadataAlsKey
  ) || {
    paths: /* @__PURE__ */ new Set(),
    timestamp: import_node_perf_hooks.performance.now(),
    featureName: opts.name
  };
  return await registry.asyncStore.run(
    traceMetadataAlsKey,
    traceMetadata,
    () => runInNewSpan(
      registry,
      {
        metadata: {
          name: opts.name
        },
        labels: opts.labels,
        links: opts.links
      },
      async (metadata, otSpan) => {
        return await fn(metadata, otSpan);
      }
    )
  );
}
async function runInNewSpan(registry, opts, fn) {
  await (0, import_tracing.ensureBasicTelemetryInstrumentation)();
  const resolvedRegistry = registry.registry ? registry.registry : registry;
  const tracer = import_api.trace.getTracer(TRACER_NAME, TRACER_VERSION);
  const parentStep = resolvedRegistry.asyncStore.getStore(spanMetadataAlsKey);
  const isInRoot = parentStep?.isRoot === true;
  if (!parentStep) opts.metadata.isRoot ||= true;
  return await tracer.startActiveSpan(
    opts.metadata.name,
    { links: opts.links, root: opts.metadata.isRoot },
    async (otSpan) => {
      if (opts.labels) otSpan.setAttributes(opts.labels);
      try {
        opts.metadata.path = buildPath(
          opts.metadata.name,
          parentStep?.path || "",
          opts.labels
        );
        const output = await resolvedRegistry.asyncStore.run(
          spanMetadataAlsKey,
          opts.metadata,
          () => fn(opts.metadata, otSpan, isInRoot)
        );
        if (opts.metadata.state !== "error") {
          opts.metadata.state = "success";
        }
        recordPath(resolvedRegistry, opts.metadata);
        return output;
      } catch (e) {
        recordPath(resolvedRegistry, opts.metadata, e);
        opts.metadata.state = "error";
        otSpan.setStatus({
          code: import_api.SpanStatusCode.ERROR,
          message: getErrorMessage(e)
        });
        if (e instanceof Error) {
          otSpan.recordException(e);
        }
        throw e;
      } finally {
        otSpan.setAttributes(metadataToAttributes(opts.metadata));
        otSpan.end();
      }
    }
  );
}
async function appendSpan(traceId, parentSpanId, metadata, labels) {
  await (0, import_tracing.ensureBasicTelemetryInstrumentation)();
  const tracer = import_api.trace.getTracer(TRACER_NAME, TRACER_VERSION);
  const spanContext = import_api.trace.setSpanContext(import_api.ROOT_CONTEXT, {
    traceId,
    traceFlags: 1,
    // sampled
    spanId: parentSpanId
  });
  const span = tracer.startSpan(metadata.name, {}, spanContext);
  span.setAttributes(metadataToAttributes(metadata));
  if (labels) {
    span.setAttributes(labels);
  }
  span.end();
}
function getErrorMessage(e) {
  if (e instanceof Error) {
    return e.message;
  }
  return `${e}`;
}
function metadataToAttributes(metadata) {
  const out = {};
  Object.keys(metadata).forEach((key) => {
    if (key === "metadata" && typeof metadata[key] === "object" && metadata.metadata) {
      Object.entries(metadata.metadata).forEach(([metaKey, value]) => {
        out[ATTR_PREFIX + ":metadata:" + metaKey] = value;
      });
    } else if (key === "input" || typeof metadata[key] === "object") {
      out[ATTR_PREFIX + ":" + key] = JSON.stringify(metadata[key]);
    } else {
      out[ATTR_PREFIX + ":" + key] = metadata[key];
    }
  });
  return out;
}
function setCustomMetadataAttribute(registry, key, value) {
  const currentStep = getCurrentSpan(registry);
  if (!currentStep) {
    return;
  }
  if (!currentStep.metadata) {
    currentStep.metadata = {};
  }
  currentStep.metadata[key] = value;
}
function setCustomMetadataAttributes(registry, values) {
  const currentStep = getCurrentSpan(registry);
  if (!currentStep) {
    return;
  }
  if (!currentStep.metadata) {
    currentStep.metadata = {};
  }
  for (const [key, value] of Object.entries(values)) {
    currentStep.metadata[key] = value;
  }
}
function toDisplayPath(path) {
  const pathPartRegex = /\{([^\,}]+),[^\}]+\}/g;
  return Array.from(path.matchAll(pathPartRegex), (m) => m[1]).join(" > ");
}
function getCurrentSpan(registry) {
  const step = registry.asyncStore.getStore(spanMetadataAlsKey);
  if (!step) {
    throw new Error("running outside step context");
  }
  return step;
}
function buildPath(name, parentPath, labels) {
  const stepType = labels && labels["genkit:type"] ? `,t:${labels["genkit:metadata:subtype"] === "flow" ? "flow" : labels["genkit:type"]}` : "";
  return parentPath + `/{${name}${stepType}}`;
}
function recordPath(registry, spanMeta, err) {
  const path = spanMeta.path || "";
  const decoratedPath = decoratePathWithSubtype(spanMeta);
  const paths = Array.from(
    registry.asyncStore.getStore(traceMetadataAlsKey)?.paths || /* @__PURE__ */ new Set()
  );
  const status = err ? "failure" : "success";
  if (!paths.some((p) => p.path.startsWith(path) && p.status === status)) {
    const now = import_node_perf_hooks.performance.now();
    const start = registry.asyncStore.getStore(traceMetadataAlsKey)?.timestamp || now;
    registry.asyncStore.getStore(traceMetadataAlsKey)?.paths?.add({
      path: decoratedPath,
      error: err?.name,
      latency: now - start,
      status
    });
  }
  spanMeta.path = decoratedPath;
}
function decoratePathWithSubtype(metadata) {
  if (!metadata.path) {
    return "";
  }
  const pathComponents = metadata.path.split("}/{");
  if (pathComponents.length == 1) {
    return metadata.path;
  }
  const stepSubtype = metadata.metadata && metadata.metadata["subtype"] ? `,s:${metadata.metadata["subtype"]}` : "";
  const root = `${pathComponents.slice(0, -1).join("}/{")}}/`;
  const decoratedStep = `{${pathComponents.at(-1)?.slice(0, -1)}${stepSubtype}}`;
  return root + decoratedStep;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ATTR_PREFIX,
  SPAN_TYPE_ATTR,
  appendSpan,
  newTrace,
  runInNewSpan,
  setCustomMetadataAttribute,
  setCustomMetadataAttributes,
  spanMetadataAlsKey,
  toDisplayPath,
  traceMetadataAlsKey
});
//# sourceMappingURL=instrumentation.js.map