import { runInActionRuntimeContext } from "./action.js";
import { UserFacingError } from "./error.js";
const contextAlsKey = "core.auth.context";
function runWithContext(registry, context, fn) {
  if (context === void 0) {
    return fn();
  }
  return registry.asyncStore.run(
    contextAlsKey,
    context,
    () => runInActionRuntimeContext(registry, fn)
  );
}
function getContext(registry) {
  if (registry.registry) {
    registry = registry.registry;
  }
  registry = registry;
  return registry.asyncStore.getStore(contextAlsKey);
}
function apiKey(valueOrPolicy) {
  return async function(request) {
    const context = {
      auth: { apiKey: request.headers["authorization"] }
    };
    if (typeof valueOrPolicy === "string") {
      if (!context.auth?.apiKey) {
        console.error("THROWING UNAUTHENTICATED");
        throw new UserFacingError("UNAUTHENTICATED", "Unauthenticated");
      }
      if (context.auth?.apiKey != valueOrPolicy) {
        console.error("Throwing PERMISSION_DENIED");
        throw new UserFacingError("PERMISSION_DENIED", "Permission Denied");
      }
    } else if (typeof valueOrPolicy === "function") {
      await valueOrPolicy(context);
    } else if (typeof valueOrPolicy !== "undefined") {
      throw new Error(
        `Invalid type ${typeof valueOrPolicy} passed to apiKey()`
      );
    }
    return context;
  };
}
export {
  apiKey,
  getContext,
  runWithContext
};
//# sourceMappingURL=context.mjs.map