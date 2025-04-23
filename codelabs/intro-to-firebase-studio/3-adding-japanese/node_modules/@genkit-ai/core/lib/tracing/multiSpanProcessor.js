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
var multiSpanProcessor_exports = {};
__export(multiSpanProcessor_exports, {
  MultiSpanProcessor: () => MultiSpanProcessor
});
module.exports = __toCommonJS(multiSpanProcessor_exports);
class MultiSpanProcessor {
  constructor(processors) {
    this.processors = processors;
  }
  forceFlush() {
    return Promise.all(this.processors.map((p) => p.forceFlush())).then();
  }
  onStart(span, parentContext) {
    this.processors.map((p) => p.onStart(span, parentContext));
  }
  onEnd(span) {
    this.processors.map((p) => p.onEnd(span));
  }
  async shutdown() {
    return Promise.all(this.processors.map((p) => p.shutdown())).then();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MultiSpanProcessor
});
//# sourceMappingURL=multiSpanProcessor.js.map