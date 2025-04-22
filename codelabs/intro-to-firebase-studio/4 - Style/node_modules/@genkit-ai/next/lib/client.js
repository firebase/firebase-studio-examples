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
var client_exports = {};
__export(client_exports, {
  runFlow: () => runFlow,
  streamFlow: () => streamFlow
});
module.exports = __toCommonJS(client_exports);
var import_client = require("genkit/beta/client");
function runFlow(req) {
  return (0, import_client.runFlow)(req);
}
function streamFlow(req) {
  const res = (0, import_client.streamFlow)(req);
  return {
    output: res.output,
    stream: res.stream
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  runFlow,
  streamFlow
});
//# sourceMappingURL=client.js.map