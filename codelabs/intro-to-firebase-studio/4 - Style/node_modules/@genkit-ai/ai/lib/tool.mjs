import {
  assertUnstable,
  defineAction,
  stripUndefinedProps,
  z
} from "@genkit-ai/core";
import { parseSchema, toJsonSchema } from "@genkit-ai/core/schema";
import { setCustomMetadataAttributes } from "@genkit-ai/core/tracing";
function asTool(registry, action) {
  if (action.__action?.metadata?.type === "tool") {
    return action;
  }
  const fn = (input) => {
    setCustomMetadataAttributes(registry, { subtype: "tool" });
    return action(input);
  };
  fn.__action = {
    ...action.__action,
    metadata: { ...action.__action.metadata, type: "tool" }
  };
  return fn;
}
async function resolveTools(registry, tools) {
  if (!tools || tools.length === 0) {
    return [];
  }
  return await Promise.all(
    tools.map(async (ref) => {
      if (typeof ref === "string") {
        return await lookupToolByName(registry, ref);
      } else if (ref.__action) {
        return asTool(registry, ref);
      } else if (typeof ref.asTool === "function") {
        return await ref.asTool();
      } else if (ref.name) {
        return await lookupToolByName(
          registry,
          ref.metadata?.originalName || ref.name
        );
      }
      throw new Error("Tools must be strings, tool definitions, or actions.");
    })
  );
}
async function lookupToolByName(registry, name) {
  let tool = await registry.lookupAction(name) || await registry.lookupAction(`/tool/${name}`) || await registry.lookupAction(`/prompt/${name}`);
  if (!tool) {
    throw new Error(`Tool ${name} not found`);
  }
  return tool;
}
function toToolDefinition(tool) {
  const originalName = tool.__action.name;
  let name = originalName;
  if (originalName.includes("/")) {
    name = originalName.substring(originalName.lastIndexOf("/") + 1);
  }
  const out = {
    name,
    description: tool.__action.description || "",
    outputSchema: toJsonSchema({
      schema: tool.__action.outputSchema ?? z.void(),
      jsonSchema: tool.__action.outputJsonSchema
    }),
    inputSchema: toJsonSchema({
      schema: tool.__action.inputSchema ?? z.void(),
      jsonSchema: tool.__action.inputJsonSchema
    })
  };
  if (originalName !== name) {
    out.metadata = { originalName };
  }
  return out;
}
function defineTool(registry, config, fn) {
  const a = defineAction(
    registry,
    {
      ...config,
      actionType: "tool",
      metadata: { ...config.metadata || {}, type: "tool" }
    },
    (i, runOptions) => {
      return fn(i, {
        ...runOptions,
        context: { ...runOptions.context },
        interrupt: interruptTool(registry)
      });
    }
  );
  a.respond = (interrupt, responseData, options) => {
    assertUnstable(
      registry,
      "beta",
      "The 'tool.reply' method is part of the 'interrupts' beta feature."
    );
    parseSchema(responseData, {
      jsonSchema: config.outputJsonSchema,
      schema: config.outputSchema
    });
    return {
      toolResponse: stripUndefinedProps({
        name: interrupt.toolRequest.name,
        ref: interrupt.toolRequest.ref,
        output: responseData
      }),
      metadata: {
        interruptResponse: options?.metadata || true
      }
    };
  };
  a.restart = (interrupt, resumedMetadata, options) => {
    assertUnstable(
      registry,
      "beta",
      "The 'tool.restart' method is part of the 'interrupts' beta feature."
    );
    let replaceInput = options?.replaceInput;
    if (replaceInput) {
      replaceInput = parseSchema(replaceInput, {
        schema: config.inputSchema,
        jsonSchema: config.inputJsonSchema
      });
    }
    return {
      toolRequest: stripUndefinedProps({
        name: interrupt.toolRequest.name,
        ref: interrupt.toolRequest.ref,
        input: replaceInput || interrupt.toolRequest.input
      }),
      metadata: stripUndefinedProps({
        ...interrupt.metadata,
        resumed: resumedMetadata || true,
        // annotate the original input if replacing it
        replacedInput: replaceInput ? interrupt.toolRequest.input : void 0
      })
    };
  };
  return a;
}
function isToolRequest(part) {
  return !!part.toolRequest;
}
function isToolResponse(part) {
  return !!part.toolResponse;
}
function defineInterrupt(registry, config) {
  const { requestMetadata, ...toolConfig } = config;
  return defineTool(
    registry,
    toolConfig,
    async (input, { interrupt }) => {
      if (!config.requestMetadata) interrupt();
      else if (typeof config.requestMetadata === "object")
        interrupt(config.requestMetadata);
      else interrupt(await Promise.resolve(config.requestMetadata(input)));
    }
  );
}
class ToolInterruptError extends Error {
  constructor(metadata) {
    super();
    this.metadata = metadata;
    this.name = "ToolInterruptError";
  }
}
function interruptTool(registry) {
  return (metadata) => {
    assertUnstable(registry, "beta", "Tool interrupts are a beta feature.");
    throw new ToolInterruptError(metadata);
  };
}
export {
  ToolInterruptError,
  asTool,
  defineInterrupt,
  defineTool,
  isToolRequest,
  isToolResponse,
  lookupToolByName,
  resolveTools,
  toToolDefinition
};
//# sourceMappingURL=tool.mjs.map