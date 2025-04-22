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
var src_exports = {};
__export(src_exports, {
  NextRequest: () => import_server.NextRequest,
  NextResponse: () => import_server.NextResponse,
  appRoute: () => appRoute,
  default: () => src_default,
  z: () => import_genkit.z
});
module.exports = __toCommonJS(src_exports);
var import_genkit = require("genkit");
var import_context = require("genkit/context");
var import_server = require("next/server.js");
const delimiter = "\n\n";
async function getContext(request, input, provider) {
  let context = {};
  if (!provider) {
    return context;
  }
  const r = {
    method: request.method,
    headers: {},
    input
  };
  request.headers.forEach((val, key) => {
    r.headers[key.toLowerCase()] = val;
  });
  return await provider(r);
}
function appRoute(action, opts) {
  return async (req) => {
    let context = {};
    const { data: input } = await req.json();
    if (req.headers.get("accept") !== "text/event-stream") {
      try {
        context = await getContext(req, input, opts?.contextProvider);
      } catch (e) {
        console.error("Error gathering context for running action:", e);
        return import_server.NextResponse.json(
          { error: (0, import_context.getCallableJSON)(e) },
          { status: (0, import_context.getHttpStatus)(e) }
        );
      }
      try {
        const resp = await action.run(input, { context });
        return import_server.NextResponse.json({ result: resp.result });
      } catch (e) {
        console.error("Error calling action:", e);
        return import_server.NextResponse.json(
          { error: (0, import_context.getCallableJSON)(e) },
          { status: (0, import_context.getHttpStatus)(e) }
        );
      }
    }
    try {
      context = await getContext(req, input, opts?.contextProvider);
    } catch (e) {
      console.error("Error gathering context for streaming action:", e);
      return new import_server.NextResponse(
        `error: ${JSON.stringify((0, import_context.getCallableJSON)(e))}${delimiter}END`,
        { status: (0, import_context.getHttpStatus)(e) }
      );
    }
    const { output, stream } = action.stream(input, { context });
    const encoder = new TextEncoder();
    const { readable, writable } = new TransformStream();
    (async () => {
      const writer = writable.getWriter();
      try {
        for await (const chunk of stream) {
          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ message: chunk })}${delimiter}`
            )
          );
        }
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({ result: await output })}${delimiter}`
          )
        );
        await writer.write(encoder.encode("END"));
      } catch (err) {
        console.error("Error streaming action:", err);
        await writer.write(
          encoder.encode(
            `error: ${JSON.stringify((0, import_context.getCallableJSON)(err))}

`
          )
        );
        await writer.write(encoder.encode("END"));
      } finally {
        await writer.close();
      }
    })();
    return new import_server.NextResponse(readable, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Transfer-Encoding": "chunked"
      }
    });
  };
}
var src_default = appRoute;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NextRequest,
  NextResponse,
  appRoute,
  z
});
//# sourceMappingURL=index.js.map