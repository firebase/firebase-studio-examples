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
var processor_exports = {};
__export(processor_exports, {
  GenkitSpanProcessorWrapper: () => GenkitSpanProcessorWrapper
});
module.exports = __toCommonJS(processor_exports);
var import_instrumentation = require("./instrumentation.js");
class GenkitSpanProcessorWrapper {
  constructor(processor) {
    this.processor = processor;
  }
  forceFlush() {
    return this.processor.forceFlush();
  }
  onStart(span, parentContext) {
    return this.processor.onStart(span, parentContext);
  }
  onEnd(span) {
    if (Object.keys(span.attributes).find((k) => k.startsWith(import_instrumentation.ATTR_PREFIX + ":"))) {
      return this.processor.onEnd(new FilteringReadableSpanProxy(span));
    } else {
      return this.processor.onEnd(span);
    }
  }
  async shutdown() {
    return this.processor.shutdown();
  }
}
class FilteringReadableSpanProxy {
  constructor(span) {
    this.span = span;
  }
  get name() {
    return this.span.name;
  }
  get kind() {
    return this.span.kind;
  }
  get parentSpanId() {
    return this.span.parentSpanId;
  }
  get startTime() {
    return this.span.startTime;
  }
  get endTime() {
    return this.span.endTime;
  }
  get status() {
    return this.span.status;
  }
  get attributes() {
    const out = {};
    for (const [key, value] of Object.entries(this.span.attributes)) {
      if (!key.startsWith(import_instrumentation.ATTR_PREFIX + ":")) {
        out[key] = value;
      }
    }
    return out;
  }
  get links() {
    return this.span.links;
  }
  get events() {
    return this.span.events;
  }
  get duration() {
    return this.span.duration;
  }
  get ended() {
    return this.span.ended;
  }
  get resource() {
    return this.span.resource;
  }
  get instrumentationLibrary() {
    return this.span.instrumentationLibrary;
  }
  get droppedAttributesCount() {
    return this.span.droppedAttributesCount;
  }
  get droppedEventsCount() {
    return this.span.droppedEventsCount;
  }
  get droppedLinksCount() {
    return this.span.droppedLinksCount;
  }
  spanContext() {
    return this.span.spanContext();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GenkitSpanProcessorWrapper
});
//# sourceMappingURL=processor.js.map