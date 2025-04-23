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
var genkit_beta_exports = {};
__export(genkit_beta_exports, {
  GenkitBeta: () => GenkitBeta,
  genkit: () => genkit
});
module.exports = __toCommonJS(genkit_beta_exports);
var import_ai = require("@genkit-ai/ai");
var import_formats = require("@genkit-ai/ai/formats");
var import_session = require("@genkit-ai/ai/session");
var import_uuid = require("uuid");
var import_genkit = require("./genkit");
function genkit(options) {
  return new GenkitBeta(options);
}
class GenkitBeta extends import_genkit.Genkit {
  constructor(options) {
    super(options);
    this.registry.apiStability = "beta";
  }
  /**
   * Create a chat session with the provided options.
   *
   * ```ts
   * const chat = ai.chat({
   *   system: 'talk like a pirate',
   * })
   * let response = await chat.send('tell me a joke')
   * response = await chat.send('another one')
   * ```
   *
   * @beta
   */
  chat(preambleOrOptions, maybeOptions) {
    let options;
    let preamble;
    if (maybeOptions) {
      options = maybeOptions;
    }
    if (preambleOrOptions) {
      if ((0, import_ai.isExecutablePrompt)(preambleOrOptions)) {
        preamble = preambleOrOptions;
      } else {
        options = preambleOrOptions;
      }
    }
    const session = this.createSession();
    if (preamble) {
      return session.chat(preamble, options);
    }
    return session.chat(options);
  }
  /**
   * Create a session for this environment.
   */
  createSession(options) {
    const sessionId = options?.sessionId?.trim() || (0, import_uuid.v4)();
    const sessionData = {
      id: sessionId,
      state: options?.initialState
    };
    return new import_session.Session(this.registry, {
      id: sessionId,
      sessionData,
      store: options?.store
    });
  }
  /**
   * Loads a session from the store.
   *
   * @beta
   */
  async loadSession(sessionId, options) {
    if (!options.store) {
      throw new Error("options.store is required");
    }
    const sessionData = await options.store.get(sessionId);
    return new import_session.Session(this.registry, {
      id: sessionId,
      sessionData,
      store: options.store
    });
  }
  /**
   * Gets the current session from async local storage.
   *
   * @beta
   */
  currentSession() {
    const currentSession = (0, import_session.getCurrentSession)(this.registry);
    if (!currentSession) {
      throw new import_session.SessionError("not running within a session");
    }
    return currentSession;
  }
  /**
   * Defines and registers a custom model output formatter.
   *
   * Here's an example of a custom JSON output formatter:
   *
   * ```ts
   * import { extractJson } from 'genkit/extract';
   *
   * ai.defineFormat(
   *   { name: 'customJson' },
   *   (schema) => {
   *     let instructions: string | undefined;
   *     if (schema) {
   *       instructions = `Output should be in JSON format and conform to the following schema:
   * \`\`\`
   * ${JSON.stringify(schema)}
   * \`\`\`
   * `;
   *     }
   *     return {
   *       parseChunk: (chunk) => extractJson(chunk.accumulatedText),
   *       parseMessage: (message) => extractJson(message.text),
   *       instructions,
   *     };
   *   }
   * );
   *
   * const { output } = await ai.generate({
   *   prompt: 'Invent a menu item for a pirate themed restaurant.',
   *   output: { format: 'customJson', schema: MenuItemSchema },
   * });
   * ```
   *
   * @beta
   */
  defineFormat(options, handler) {
    return (0, import_formats.defineFormat)(this.registry, options, handler);
  }
  /**
   * Defines and registers an interrupt.
   *
   * Interrupts are special tools that halt model processing and return control back to the caller. Interrupts make it simpler to implement
   * "human-in-the-loop" and out-of-band processing patterns that require waiting on external actions to complete.
   *
   * @beta
   */
  defineInterrupt(config) {
    return (0, import_ai.defineInterrupt)(this.registry, config);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GenkitBeta,
  genkit
});
//# sourceMappingURL=genkit-beta.js.map