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
var src_exports = {};
__export(src_exports, {
  GENKIT_CLIENT_HEADER: () => GENKIT_CLIENT_HEADER,
  GENKIT_REFLECTION_API_SPEC_VERSION: () => GENKIT_REFLECTION_API_SPEC_VERSION,
  GENKIT_VERSION: () => GENKIT_VERSION,
  GenkitError: () => import_error.GenkitError,
  UnstableApiError: () => import_error.UnstableApiError,
  UserFacingError: () => import_error.UserFacingError,
  apiKey: () => import_context.apiKey,
  assertUnstable: () => import_error.assertUnstable,
  defineFlow: () => import_flow.defineFlow,
  defineJsonSchema: () => import_schema.defineJsonSchema,
  defineSchema: () => import_schema.defineSchema,
  getCallableJSON: () => import_error.getCallableJSON,
  getContext: () => import_context.getContext,
  getHttpStatus: () => import_error.getHttpStatus,
  run: () => import_flow.run,
  runWithContext: () => import_context.runWithContext,
  z: () => import_zod.z
});
module.exports = __toCommonJS(src_exports);
var import_version = require("./__codegen/version.js");
var import_zod = require("zod");
__reExport(src_exports, require("./action.js"), module.exports);
var import_context = require("./context.js");
var import_error = require("./error.js");
var import_flow = require("./flow.js");
__reExport(src_exports, require("./plugin.js"), module.exports);
__reExport(src_exports, require("./reflection.js"), module.exports);
var import_schema = require("./schema.js");
__reExport(src_exports, require("./telemetryTypes.js"), module.exports);
__reExport(src_exports, require("./utils.js"), module.exports);
const GENKIT_VERSION = import_version.version;
const GENKIT_CLIENT_HEADER = `genkit-node/${GENKIT_VERSION} gl-node/${process.versions.node}`;
const GENKIT_REFLECTION_API_SPEC_VERSION = 1;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GENKIT_CLIENT_HEADER,
  GENKIT_REFLECTION_API_SPEC_VERSION,
  GENKIT_VERSION,
  GenkitError,
  UnstableApiError,
  UserFacingError,
  apiKey,
  assertUnstable,
  defineFlow,
  defineJsonSchema,
  defineSchema,
  getCallableJSON,
  getContext,
  getHttpStatus,
  run,
  runWithContext,
  z,
  ...require("./action.js"),
  ...require("./plugin.js"),
  ...require("./reflection.js"),
  ...require("./telemetryTypes.js"),
  ...require("./utils.js")
});
//# sourceMappingURL=index.js.map