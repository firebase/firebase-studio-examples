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
var generate_exports = {};
__export(generate_exports, {
  GenerateResponse: () => import_response.GenerateResponse,
  GenerateResponseChunk: () => import_chunk.GenerateResponseChunk,
  GenerationBlockedError: () => GenerationBlockedError,
  GenerationResponseError: () => GenerationResponseError,
  generate: () => generate,
  generateStream: () => generateStream,
  tagAsPreamble: () => tagAsPreamble,
  toGenerateRequest: () => toGenerateRequest
});
module.exports = __toCommonJS(generate_exports);
var import_core = require("@genkit-ai/core");
var import_async = require("@genkit-ai/core/async");
var import_schema = require("@genkit-ai/core/schema");
var import_formats = require("./formats/index.js");
var import_action = require("./generate/action.js");
var import_chunk = require("./generate/chunk.js");
var import_response = require("./generate/response.js");
var import_message = require("./message.js");
var import_model = require("./model.js");
var import_tool = require("./tool.js");
async function toGenerateRequest(registry, options) {
  let messages = [];
  if (options.system) {
    messages.push({
      role: "system",
      content: import_message.Message.parseContent(options.system)
    });
  }
  if (options.messages) {
    messages.push(...options.messages.map((m) => import_message.Message.parseData(m)));
  }
  if (options.prompt) {
    messages.push({
      role: "user",
      content: import_message.Message.parseContent(options.prompt)
    });
  }
  if (messages.length === 0) {
    throw new import_core.GenkitError({
      status: "INVALID_ARGUMENT",
      message: "at least one message is required in generate request"
    });
  }
  if (options.resume && !(messages.at(-1)?.role === "model" && messages.at(-1)?.content.find((p) => !!p.toolRequest))) {
    throw new import_core.GenkitError({
      status: "FAILED_PRECONDITION",
      message: `Last message must be a 'model' role with at least one tool request to 'resume' generation.`,
      detail: messages.at(-1)
    });
  }
  let tools;
  if (options.tools) {
    tools = await (0, import_tool.resolveTools)(registry, options.tools);
  }
  const resolvedSchema = (0, import_schema.toJsonSchema)({
    schema: options.output?.schema,
    jsonSchema: options.output?.jsonSchema
  });
  const resolvedFormat = await (0, import_formats.resolveFormat)(registry, options.output);
  const instructions = (0, import_formats.resolveInstructions)(
    resolvedFormat,
    resolvedSchema,
    options?.output?.instructions
  );
  const out = {
    messages: (0, import_action.shouldInjectFormatInstructions)(
      resolvedFormat?.config,
      options.output
    ) ? (0, import_formats.injectInstructions)(messages, instructions) : messages,
    config: options.config,
    docs: options.docs,
    tools: tools?.map(import_tool.toToolDefinition) || [],
    output: {
      ...resolvedFormat?.config || {},
      ...options.output,
      schema: resolvedSchema
    }
  };
  if (!out?.output?.schema) delete out?.output?.schema;
  return out;
}
class GenerationResponseError extends import_core.GenkitError {
  detail;
  constructor(response, message, status, detail) {
    super({
      status: status || "FAILED_PRECONDITION",
      message
    });
    this.detail = { response, ...detail };
  }
}
async function toolsToActionRefs(registry, toolOpt) {
  if (!toolOpt) return;
  let tools = [];
  for (const t of toolOpt) {
    if (typeof t === "string") {
      tools.push(await resolveFullToolName(registry, t));
    } else if (t.__action) {
      tools.push(
        `/${t.__action.metadata?.type}/${t.__action.name}`
      );
    } else if (typeof t.asTool === "function") {
      const promptToolAction = await t.asTool();
      tools.push(`/prompt/${promptToolAction.__action.name}`);
    } else if (t.name) {
      tools.push(await resolveFullToolName(registry, t.name));
    } else {
      throw new Error(`Unable to determine type of tool: ${JSON.stringify(t)}`);
    }
  }
  return tools;
}
function messagesFromOptions(options) {
  const messages = [];
  if (options.system) {
    messages.push({
      role: "system",
      content: import_message.Message.parseContent(options.system)
    });
  }
  if (options.messages) {
    messages.push(...options.messages);
  }
  if (options.prompt) {
    messages.push({
      role: "user",
      content: import_message.Message.parseContent(options.prompt)
    });
  }
  if (messages.length === 0) {
    throw new import_core.GenkitError({
      status: "INVALID_ARGUMENT",
      message: "at least one message is required in generate request"
    });
  }
  return messages;
}
class GenerationBlockedError extends GenerationResponseError {
}
async function generate(registry, options) {
  const resolvedOptions = {
    ...await Promise.resolve(options)
  };
  const resolvedModel = await (0, import_model.resolveModel)(registry, resolvedOptions.model);
  const tools = await toolsToActionRefs(registry, resolvedOptions.tools);
  const messages = messagesFromOptions(resolvedOptions);
  const resolvedSchema = (0, import_schema.toJsonSchema)({
    schema: resolvedOptions.output?.schema,
    jsonSchema: resolvedOptions.output?.jsonSchema
  });
  if ((resolvedOptions.output?.schema || resolvedOptions.output?.jsonSchema) && !resolvedOptions.output?.format) {
    resolvedOptions.output.format = "json";
  }
  const resolvedFormat = await (0, import_formats.resolveFormat)(registry, resolvedOptions.output);
  const params = {
    model: resolvedModel.modelAction.__action.name,
    docs: resolvedOptions.docs,
    messages,
    tools,
    toolChoice: resolvedOptions.toolChoice,
    config: {
      version: resolvedModel.version,
      ...stripUndefinedOptions(resolvedModel.config),
      ...stripUndefinedOptions(resolvedOptions.config)
    },
    output: resolvedOptions.output && {
      ...resolvedOptions.output,
      format: resolvedOptions.output.format,
      jsonSchema: resolvedSchema
    },
    // coerce reply and restart into arrays for the action schema
    resume: resolvedOptions.resume && {
      respond: [resolvedOptions.resume.respond || []].flat(),
      restart: [resolvedOptions.resume.restart || []].flat(),
      metadata: resolvedOptions.resume.metadata
    },
    returnToolRequests: resolvedOptions.returnToolRequests,
    maxTurns: resolvedOptions.maxTurns
  };
  if (Object.keys(params.config).length === 0 && !resolvedOptions.config) {
    delete params.config;
  }
  return await (0, import_core.runWithStreamingCallback)(
    registry,
    stripNoop(resolvedOptions.onChunk ?? resolvedOptions.streamingCallback),
    async () => {
      const response = await (0, import_core.runWithContext)(
        registry,
        resolvedOptions.context,
        () => (0, import_action.generateHelper)(registry, {
          rawRequest: params,
          middleware: resolvedOptions.use
        })
      );
      const request = await toGenerateRequest(registry, {
        ...resolvedOptions,
        tools
      });
      return new import_response.GenerateResponse(response, {
        request: response.request ?? request,
        parser: resolvedFormat?.handler(request.output?.schema).parseMessage
      });
    }
  );
}
function stripNoop(callback) {
  if (callback === import_core.sentinelNoopStreamingCallback) {
    return void 0;
  }
  return callback;
}
function stripUndefinedOptions(input) {
  if (!input) return input;
  const copy = { ...input };
  Object.keys(input).forEach((key) => {
    if (copy[key] === void 0) {
      delete copy[key];
    }
  });
  return copy;
}
async function resolveFullToolName(registry, name) {
  if (await registry.lookupAction(`/tool/${name}`)) {
    return `/tool/${name}`;
  } else if (await registry.lookupAction(`/prompt/${name}`)) {
    return `/prompt/${name}`;
  } else {
    throw new Error(`Unable to determine type of of tool: ${name}`);
  }
}
function generateStream(registry, options) {
  let channel = new import_async.Channel();
  const generated = Promise.resolve(options).then(
    (resolvedOptions) => generate(registry, {
      ...resolvedOptions,
      onChunk: (chunk) => channel.send(chunk)
    })
  );
  generated.then(
    () => channel.close(),
    (err) => channel.error(err)
  );
  return {
    response: generated,
    stream: channel
  };
}
function tagAsPreamble(msgs) {
  if (!msgs) {
    return void 0;
  }
  return msgs.map((m) => ({
    ...m,
    metadata: {
      ...m.metadata,
      preamble: true
    }
  }));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GenerateResponse,
  GenerateResponseChunk,
  GenerationBlockedError,
  GenerationResponseError,
  generate,
  generateStream,
  tagAsPreamble,
  toGenerateRequest
});
//# sourceMappingURL=generate.js.map