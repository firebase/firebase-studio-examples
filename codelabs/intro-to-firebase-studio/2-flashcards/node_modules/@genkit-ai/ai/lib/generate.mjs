import {
  GenkitError,
  runWithContext,
  runWithStreamingCallback,
  sentinelNoopStreamingCallback
} from "@genkit-ai/core";
import { Channel } from "@genkit-ai/core/async";
import { toJsonSchema } from "@genkit-ai/core/schema";
import {
  injectInstructions,
  resolveFormat,
  resolveInstructions
} from "./formats/index.js";
import {
  generateHelper,
  shouldInjectFormatInstructions
} from "./generate/action.js";
import { GenerateResponseChunk } from "./generate/chunk.js";
import { GenerateResponse } from "./generate/response.js";
import { Message } from "./message.js";
import {
  resolveModel
} from "./model.js";
import { resolveTools, toToolDefinition } from "./tool.js";
async function toGenerateRequest(registry, options) {
  let messages = [];
  if (options.system) {
    messages.push({
      role: "system",
      content: Message.parseContent(options.system)
    });
  }
  if (options.messages) {
    messages.push(...options.messages.map((m) => Message.parseData(m)));
  }
  if (options.prompt) {
    messages.push({
      role: "user",
      content: Message.parseContent(options.prompt)
    });
  }
  if (messages.length === 0) {
    throw new GenkitError({
      status: "INVALID_ARGUMENT",
      message: "at least one message is required in generate request"
    });
  }
  if (options.resume && !(messages.at(-1)?.role === "model" && messages.at(-1)?.content.find((p) => !!p.toolRequest))) {
    throw new GenkitError({
      status: "FAILED_PRECONDITION",
      message: `Last message must be a 'model' role with at least one tool request to 'resume' generation.`,
      detail: messages.at(-1)
    });
  }
  let tools;
  if (options.tools) {
    tools = await resolveTools(registry, options.tools);
  }
  const resolvedSchema = toJsonSchema({
    schema: options.output?.schema,
    jsonSchema: options.output?.jsonSchema
  });
  const resolvedFormat = await resolveFormat(registry, options.output);
  const instructions = resolveInstructions(
    resolvedFormat,
    resolvedSchema,
    options?.output?.instructions
  );
  const out = {
    messages: shouldInjectFormatInstructions(
      resolvedFormat?.config,
      options.output
    ) ? injectInstructions(messages, instructions) : messages,
    config: options.config,
    docs: options.docs,
    tools: tools?.map(toToolDefinition) || [],
    output: {
      ...resolvedFormat?.config || {},
      ...options.output,
      schema: resolvedSchema
    }
  };
  if (!out?.output?.schema) delete out?.output?.schema;
  return out;
}
class GenerationResponseError extends GenkitError {
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
      content: Message.parseContent(options.system)
    });
  }
  if (options.messages) {
    messages.push(...options.messages);
  }
  if (options.prompt) {
    messages.push({
      role: "user",
      content: Message.parseContent(options.prompt)
    });
  }
  if (messages.length === 0) {
    throw new GenkitError({
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
  const resolvedModel = await resolveModel(registry, resolvedOptions.model);
  const tools = await toolsToActionRefs(registry, resolvedOptions.tools);
  const messages = messagesFromOptions(resolvedOptions);
  const resolvedSchema = toJsonSchema({
    schema: resolvedOptions.output?.schema,
    jsonSchema: resolvedOptions.output?.jsonSchema
  });
  if ((resolvedOptions.output?.schema || resolvedOptions.output?.jsonSchema) && !resolvedOptions.output?.format) {
    resolvedOptions.output.format = "json";
  }
  const resolvedFormat = await resolveFormat(registry, resolvedOptions.output);
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
  return await runWithStreamingCallback(
    registry,
    stripNoop(resolvedOptions.onChunk ?? resolvedOptions.streamingCallback),
    async () => {
      const response = await runWithContext(
        registry,
        resolvedOptions.context,
        () => generateHelper(registry, {
          rawRequest: params,
          middleware: resolvedOptions.use
        })
      );
      const request = await toGenerateRequest(registry, {
        ...resolvedOptions,
        tools
      });
      return new GenerateResponse(response, {
        request: response.request ?? request,
        parser: resolvedFormat?.handler(request.output?.schema).parseMessage
      });
    }
  );
}
function stripNoop(callback) {
  if (callback === sentinelNoopStreamingCallback) {
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
  let channel = new Channel();
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
export {
  GenerateResponse,
  GenerateResponseChunk,
  GenerationBlockedError,
  GenerationResponseError,
  generate,
  generateStream,
  tagAsPreamble,
  toGenerateRequest
};
//# sourceMappingURL=generate.mjs.map