import {
  defineAction,
  GenkitError,
  getStreamingCallback,
  runWithStreamingCallback,
  stripUndefinedProps
} from "@genkit-ai/core";
import { logger } from "@genkit-ai/core/logging";
import { runInNewSpan, SPAN_TYPE_ATTR } from "@genkit-ai/core/tracing";
import {
  injectInstructions,
  resolveFormat,
  resolveInstructions
} from "../formats/index.js";
import {
  GenerateResponse,
  GenerateResponseChunk,
  GenerationResponseError,
  tagAsPreamble
} from "../generate.js";
import {
  GenerateActionOptionsSchema,
  GenerateResponseChunkSchema,
  GenerateResponseSchema,
  resolveModel
} from "../model.js";
import { resolveTools, toToolDefinition } from "../tool.js";
import {
  assertValidToolNames,
  resolveResumeOption,
  resolveToolRequests
} from "./resolve-tool-requests.js";
function defineGenerateAction(registry) {
  return defineAction(
    registry,
    {
      actionType: "util",
      name: "generate",
      inputSchema: GenerateActionOptionsSchema,
      outputSchema: GenerateResponseSchema,
      streamSchema: GenerateResponseChunkSchema
    },
    async (request, { sendChunk }) => {
      const generateFn = () => generate(registry, {
        rawRequest: request,
        currentTurn: 0,
        messageIndex: 0,
        // Generate util action does not support middleware. Maybe when we add named/registered middleware....
        middleware: []
      });
      return sendChunk ? runWithStreamingCallback(
        registry,
        (c) => sendChunk(c.toJSON ? c.toJSON() : c),
        generateFn
      ) : generateFn();
    }
  );
}
async function generateHelper(registry, options) {
  let currentTurn = options.currentTurn ?? 0;
  let messageIndex = options.messageIndex ?? 0;
  return await runInNewSpan(
    registry,
    {
      metadata: {
        name: "generate"
      },
      labels: {
        [SPAN_TYPE_ATTR]: "util"
      }
    },
    async (metadata) => {
      metadata.name = "generate";
      metadata.input = options.rawRequest;
      const output = await generate(registry, {
        rawRequest: options.rawRequest,
        middleware: options.middleware,
        currentTurn,
        messageIndex
      });
      metadata.output = JSON.stringify(output);
      return output;
    }
  );
}
async function resolveParameters(registry, request) {
  const [model, tools, format] = await Promise.all([
    resolveModel(registry, request.model, { warnDeprecated: true }).then(
      (r) => r.modelAction
    ),
    resolveTools(registry, request.tools),
    resolveFormat(registry, request.output)
  ]);
  return { model, tools, format };
}
function applyFormat(rawRequest, resolvedFormat) {
  const outRequest = { ...rawRequest };
  if (rawRequest.output?.jsonSchema && !rawRequest.output?.format) {
    outRequest.output = { ...rawRequest.output, format: "json" };
  }
  const instructions = resolveInstructions(
    resolvedFormat,
    outRequest.output?.jsonSchema,
    outRequest?.output?.instructions
  );
  if (resolvedFormat) {
    if (shouldInjectFormatInstructions(resolvedFormat.config, rawRequest?.output)) {
      outRequest.messages = injectInstructions(
        outRequest.messages,
        instructions
      );
    }
    outRequest.output = {
      // use output config from the format
      ...resolvedFormat.config,
      // if anything is set explicitly, use that
      ...outRequest.output
    };
  }
  return outRequest;
}
function shouldInjectFormatInstructions(formatConfig, rawRequestConfig) {
  return formatConfig?.defaultInstructions !== false || rawRequestConfig?.instructions;
}
function applyTransferPreamble(rawRequest, transferPreamble) {
  if (!transferPreamble) {
    return rawRequest;
  }
  return stripUndefinedProps({
    ...rawRequest,
    messages: [
      ...tagAsPreamble(transferPreamble.messages),
      ...rawRequest.messages.filter((m) => !m.metadata?.preamble)
    ],
    toolChoice: transferPreamble.toolChoice || rawRequest.toolChoice,
    tools: transferPreamble.tools || rawRequest.tools,
    config: transferPreamble.config || rawRequest.config
  });
}
async function generate(registry, {
  rawRequest,
  middleware,
  currentTurn,
  messageIndex
}) {
  const { model, tools, format } = await resolveParameters(
    registry,
    rawRequest
  );
  rawRequest = applyFormat(rawRequest, format);
  await assertValidToolNames(tools);
  const {
    revisedRequest,
    interruptedResponse,
    toolMessage: resumedToolMessage
  } = await resolveResumeOption(registry, rawRequest);
  if (interruptedResponse) {
    throw new GenkitError({
      status: "FAILED_PRECONDITION",
      message: "One or more tools triggered an interrupt during a restarted execution.",
      detail: { message: interruptedResponse.message }
    });
  }
  rawRequest = revisedRequest;
  const request = await actionToGenerateRequest(
    rawRequest,
    tools,
    format,
    model
  );
  const previousChunks = [];
  let chunkRole = "model";
  const makeChunk = (role, chunk) => {
    if (role !== chunkRole && previousChunks.length) messageIndex++;
    chunkRole = role;
    const prevToSend = [...previousChunks];
    previousChunks.push(chunk);
    return new GenerateResponseChunk(chunk, {
      index: messageIndex,
      role,
      previousChunks: prevToSend,
      parser: format?.handler(request.output?.schema).parseChunk
    });
  };
  const streamingCallback = getStreamingCallback(registry);
  if (resumedToolMessage && streamingCallback) {
    streamingCallback(makeChunk("tool", resumedToolMessage));
  }
  const response = await runWithStreamingCallback(
    registry,
    streamingCallback && ((chunk) => streamingCallback(makeChunk("model", chunk))),
    async () => {
      const dispatch = async (index, req) => {
        if (!middleware || index === middleware.length) {
          return await model(req);
        }
        const currentMiddleware = middleware[index];
        return currentMiddleware(
          req,
          async (modifiedReq) => dispatch(index + 1, modifiedReq || req)
        );
      };
      return new GenerateResponse(await dispatch(0, request), {
        request,
        parser: format?.handler(request.output?.schema).parseMessage
      });
    }
  );
  response.assertValid();
  const generatedMessage = response.message;
  const toolRequests = generatedMessage.content.filter(
    (part) => !!part.toolRequest
  );
  if (rawRequest.returnToolRequests || toolRequests.length === 0) {
    if (toolRequests.length === 0) response.assertValidSchema(request);
    return response.toJSON();
  }
  const maxIterations = rawRequest.maxTurns ?? 5;
  if (currentTurn + 1 > maxIterations) {
    throw new GenerationResponseError(
      response,
      `Exceeded maximum tool call iterations (${maxIterations})`,
      "ABORTED",
      { request }
    );
  }
  const { revisedModelMessage, toolMessage, transferPreamble } = await resolveToolRequests(registry, rawRequest, generatedMessage);
  if (revisedModelMessage) {
    return {
      ...response.toJSON(),
      finishReason: "interrupted",
      finishMessage: "One or more tool calls resulted in interrupts.",
      message: revisedModelMessage
    };
  }
  streamingCallback?.(
    makeChunk("tool", {
      content: toolMessage.content
    })
  );
  let nextRequest = {
    ...rawRequest,
    messages: [...rawRequest.messages, generatedMessage.toJSON(), toolMessage]
  };
  nextRequest = applyTransferPreamble(nextRequest, transferPreamble);
  return await generateHelper(registry, {
    rawRequest: nextRequest,
    middleware,
    currentTurn: currentTurn + 1,
    messageIndex: messageIndex + 1
  });
}
async function actionToGenerateRequest(options, resolvedTools, resolvedFormat, model) {
  const modelInfo = model.__action.metadata?.model;
  if ((options.tools?.length ?? 0) > 0 && modelInfo?.supports && !modelInfo?.supports?.tools) {
    logger.warn(
      `The model '${model.__action.name}' does not support tools (you set: ${options.tools?.length} tools). The model may not behave the way you expect.`
    );
  }
  if (options.toolChoice && modelInfo?.supports && !modelInfo?.supports?.toolChoice) {
    logger.warn(
      `The model '${model.__action.name}' does not support the 'toolChoice' option (you set: ${options.toolChoice}). The model may not behave the way you expect.`
    );
  }
  const out = {
    messages: options.messages,
    config: options.config,
    docs: options.docs,
    tools: resolvedTools?.map(toToolDefinition) || [],
    output: stripUndefinedProps({
      constrained: options.output?.constrained,
      contentType: options.output?.contentType,
      format: options.output?.format,
      schema: options.output?.jsonSchema
    })
  };
  if (options.toolChoice) {
    out.toolChoice = options.toolChoice;
  }
  if (out.output && !out.output.schema) delete out.output.schema;
  return out;
}
function inferRoleFromParts(parts) {
  const uniqueRoles = /* @__PURE__ */ new Set();
  for (const part of parts) {
    const role = getRoleFromPart(part);
    uniqueRoles.add(role);
    if (uniqueRoles.size > 1) {
      throw new Error("Contents contain mixed roles");
    }
  }
  return Array.from(uniqueRoles)[0];
}
function getRoleFromPart(part) {
  if (part.toolRequest !== void 0) return "model";
  if (part.toolResponse !== void 0) return "tool";
  if (part.text !== void 0) return "user";
  if (part.media !== void 0) return "user";
  if (part.data !== void 0) return "user";
  throw new Error("No recognized fields in content");
}
export {
  defineGenerateAction,
  generateHelper,
  inferRoleFromParts,
  shouldInjectFormatInstructions
};
//# sourceMappingURL=action.mjs.map