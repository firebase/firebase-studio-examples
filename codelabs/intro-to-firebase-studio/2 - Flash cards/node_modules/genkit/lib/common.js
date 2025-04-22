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
var common_exports = {};
__export(common_exports, {
  BaseDataPointSchema: () => import_ai.BaseDataPointSchema,
  Chat: () => import_chat.Chat,
  Document: () => import_ai.Document,
  DocumentDataSchema: () => import_ai.DocumentDataSchema,
  GENKIT_CLIENT_HEADER: () => import_core.GENKIT_CLIENT_HEADER,
  GENKIT_VERSION: () => import_core.GENKIT_VERSION,
  GenerationBlockedError: () => import_ai.GenerationBlockedError,
  GenerationCommonConfigSchema: () => import_ai.GenerationCommonConfigSchema,
  GenerationResponseError: () => import_ai.GenerationResponseError,
  GenkitError: () => import_core.GenkitError,
  LlmResponseSchema: () => import_ai.LlmResponseSchema,
  LlmStatsSchema: () => import_ai.LlmStatsSchema,
  Message: () => import_ai.Message,
  MessageSchema: () => import_ai.MessageSchema,
  ModelRequestSchema: () => import_ai.ModelRequestSchema,
  ModelResponseSchema: () => import_ai.ModelResponseSchema,
  PartSchema: () => import_ai.PartSchema,
  ReflectionServer: () => import_core.ReflectionServer,
  RoleSchema: () => import_ai.RoleSchema,
  Session: () => import_session.Session,
  StatusCodes: () => import_core.StatusCodes,
  StatusSchema: () => import_core.StatusSchema,
  ToolCallSchema: () => import_ai.ToolCallSchema,
  ToolSchema: () => import_ai.ToolSchema,
  UserFacingError: () => import_core.UserFacingError,
  defineJsonSchema: () => import_core.defineJsonSchema,
  defineSchema: () => import_core.defineSchema,
  embedderRef: () => import_ai.embedderRef,
  evaluatorRef: () => import_ai.evaluatorRef,
  getCurrentEnv: () => import_core.getCurrentEnv,
  getStreamingCallback: () => import_core.getStreamingCallback,
  indexerRef: () => import_ai.indexerRef,
  isDevEnv: () => import_core.isDevEnv,
  rerankerRef: () => import_ai.rerankerRef,
  retrieverRef: () => import_ai.retrieverRef,
  runWithStreamingCallback: () => import_core.runWithStreamingCallback,
  z: () => import_core.z
});
module.exports = __toCommonJS(common_exports);
var import_ai = require("@genkit-ai/ai");
var import_chat = require("@genkit-ai/ai/chat");
var import_session = require("@genkit-ai/ai/session");
var import_core = require("@genkit-ai/core");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseDataPointSchema,
  Chat,
  Document,
  DocumentDataSchema,
  GENKIT_CLIENT_HEADER,
  GENKIT_VERSION,
  GenerationBlockedError,
  GenerationCommonConfigSchema,
  GenerationResponseError,
  GenkitError,
  LlmResponseSchema,
  LlmStatsSchema,
  Message,
  MessageSchema,
  ModelRequestSchema,
  ModelResponseSchema,
  PartSchema,
  ReflectionServer,
  RoleSchema,
  Session,
  StatusCodes,
  StatusSchema,
  ToolCallSchema,
  ToolSchema,
  UserFacingError,
  defineJsonSchema,
  defineSchema,
  embedderRef,
  evaluatorRef,
  getCurrentEnv,
  getStreamingCallback,
  indexerRef,
  isDevEnv,
  rerankerRef,
  retrieverRef,
  runWithStreamingCallback,
  z
});
//# sourceMappingURL=common.js.map