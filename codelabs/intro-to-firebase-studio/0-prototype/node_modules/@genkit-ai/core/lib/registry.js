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
var registry_exports = {};
__export(registry_exports, {
  AsyncStore: () => AsyncStore,
  Registry: () => Registry
});
module.exports = __toCommonJS(registry_exports);
var import_dotprompt = require("dotprompt");
var import_node_async_hooks = require("node:async_hooks");
var import_action = require("./action.js");
var import_error = require("./error.js");
var import_logging = require("./logging.js");
var import_schema = require("./schema.js");
function parsePluginName(registryKey) {
  const tokens = registryKey.split("/");
  if (tokens.length >= 4) {
    return tokens[2];
  }
  return void 0;
}
class Registry {
  constructor(parent) {
    this.parent = parent;
  }
  actionsById = {};
  pluginsByName = {};
  schemasByName = {};
  valueByTypeAndName = {};
  allPluginsInitialized = false;
  apiStability = "stable";
  asyncStore = new AsyncStore();
  dotprompt = new import_dotprompt.Dotprompt({
    schemaResolver: async (name) => {
      const resolvedSchema = await this.lookupSchema(name);
      if (!resolvedSchema) {
        throw new import_error.GenkitError({
          message: `Schema '${name}' not found`,
          status: "NOT_FOUND"
        });
      }
      return (0, import_schema.toJsonSchema)(resolvedSchema);
    }
  });
  /**
   * Creates a new registry overlaid onto the provided registry.
   * @param parent The parent registry.
   * @returns The new overlaid registry.
   */
  static withParent(parent) {
    return new Registry(parent);
  }
  /**
   * Looks up an action in the registry.
   * @param key The key of the action to lookup.
   * @returns The action.
   */
  async lookupAction(key) {
    const pluginName = parsePluginName(key);
    if (!this.actionsById[key] && pluginName) {
      await this.initializePlugin(pluginName);
    }
    return await this.actionsById[key] || this.parent?.lookupAction(key);
  }
  /**
   * Registers an action in the registry.
   * @param type The type of the action to register.
   * @param action The action to register.
   */
  registerAction(type, action) {
    const key = `/${type}/${action.__action.name}`;
    import_logging.logger.debug(`registering ${key}`);
    if (this.actionsById.hasOwnProperty(key)) {
      import_logging.logger.warn(
        `WARNING: ${key} already has an entry in the registry. Overwriting.`
      );
    }
    this.actionsById[key] = action;
  }
  /**
   * Registers an action promise in the registry.
   */
  registerActionAsync(type, name, action) {
    const key = `/${type}/${name}`;
    import_logging.logger.debug(`registering ${key} (async)`);
    if (this.actionsById.hasOwnProperty(key)) {
      import_logging.logger.warn(
        `WARNING: ${key} already has an entry in the registry. Overwriting.`
      );
    }
    this.actionsById[key] = action;
  }
  /**
   * Returns all actions in the registry.
   * @returns All actions in the registry.
   */
  async listActions() {
    await this.initializeAllPlugins();
    const actions = {};
    await Promise.all(
      Object.entries(this.actionsById).map(async ([key, action]) => {
        actions[key] = await action;
      })
    );
    return {
      ...await this.parent?.listActions(),
      ...actions
    };
  }
  /**
   * Initializes all plugins in the registry.
   */
  async initializeAllPlugins() {
    if (this.allPluginsInitialized) {
      return;
    }
    for (const pluginName of Object.keys(this.pluginsByName)) {
      await this.initializePlugin(pluginName);
    }
    this.allPluginsInitialized = true;
  }
  /**
   * Registers a plugin provider. This plugin must be initialized before it can be used by calling {@link initializePlugin} or {@link initializeAllPlugins}.
   * @param name The name of the plugin to register.
   * @param provider The plugin provider.
   */
  registerPluginProvider(name, provider) {
    if (this.pluginsByName[name]) {
      throw new Error(`Plugin ${name} already registered`);
    }
    this.allPluginsInitialized = false;
    let cached;
    let isInitialized = false;
    this.pluginsByName[name] = {
      name: provider.name,
      initializer: () => {
        if (!isInitialized) {
          cached = provider.initializer();
          isInitialized = true;
        }
        return cached;
      }
    };
  }
  /**
   * Looks up a plugin.
   * @param name The name of the plugin to lookup.
   * @returns The plugin provider.
   */
  lookupPlugin(name) {
    return this.pluginsByName[name] || this.parent?.lookupPlugin(name);
  }
  /**
   * Initializes a plugin already registered with {@link registerPluginProvider}.
   * @param name The name of the plugin to initialize.
   * @returns The plugin.
   */
  async initializePlugin(name) {
    if (this.pluginsByName[name]) {
      return await (0, import_action.runOutsideActionRuntimeContext)(
        this,
        () => this.pluginsByName[name].initializer()
      );
    }
  }
  /**
   * Registers a schema.
   * @param name The name of the schema to register.
   * @param data The schema to register (either a Zod schema or a JSON schema).
   */
  registerSchema(name, data) {
    if (this.schemasByName[name]) {
      throw new Error(`Schema ${name} already registered`);
    }
    this.schemasByName[name] = data;
  }
  registerValue(type, name, value) {
    if (!this.valueByTypeAndName[type]) {
      this.valueByTypeAndName[type] = {};
    }
    this.valueByTypeAndName[type][name] = value;
  }
  async lookupValue(type, key) {
    const pluginName = parsePluginName(key);
    if (!this.valueByTypeAndName[type]?.[key] && pluginName) {
      await this.initializePlugin(pluginName);
    }
    return this.valueByTypeAndName[type]?.[key] || this.parent?.lookupValue(type, key);
  }
  async listValues(type) {
    await this.initializeAllPlugins();
    return {
      ...await this.parent?.listValues(type) || {},
      ...this.valueByTypeAndName[type] || {}
    };
  }
  /**
   * Looks up a schema.
   * @param name The name of the schema to lookup.
   * @returns The schema.
   */
  lookupSchema(name) {
    return this.schemasByName[name] || this.parent?.lookupSchema(name);
  }
}
class AsyncStore {
  asls = {};
  getStore(key) {
    return this.asls[key]?.getStore();
  }
  run(key, store, callback) {
    if (!this.asls[key]) {
      this.asls[key] = new import_node_async_hooks.AsyncLocalStorage();
    }
    return this.asls[key].run(store, callback);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AsyncStore,
  Registry
});
//# sourceMappingURL=registry.js.map