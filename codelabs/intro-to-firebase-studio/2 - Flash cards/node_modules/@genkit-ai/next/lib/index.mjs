import { z } from "genkit";
import {
  getCallableJSON,
  getHttpStatus
} from "genkit/context";
import { NextRequest, NextResponse } from "next/server.js";
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
        return NextResponse.json(
          { error: getCallableJSON(e) },
          { status: getHttpStatus(e) }
        );
      }
      try {
        const resp = await action.run(input, { context });
        return NextResponse.json({ result: resp.result });
      } catch (e) {
        console.error("Error calling action:", e);
        return NextResponse.json(
          { error: getCallableJSON(e) },
          { status: getHttpStatus(e) }
        );
      }
    }
    try {
      context = await getContext(req, input, opts?.contextProvider);
    } catch (e) {
      console.error("Error gathering context for streaming action:", e);
      return new NextResponse(
        `error: ${JSON.stringify(getCallableJSON(e))}${delimiter}END`,
        { status: getHttpStatus(e) }
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
            `error: ${JSON.stringify(getCallableJSON(err))}

`
          )
        );
        await writer.write(encoder.encode("END"));
      } finally {
        await writer.close();
      }
    })();
    return new NextResponse(readable, {
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
export {
  NextRequest,
  NextResponse,
  appRoute,
  src_default as default,
  z
};
//# sourceMappingURL=index.mjs.map