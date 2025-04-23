import {
  runFlow as baseRunFlow,
  streamFlow as baseStreamFlow
} from "genkit/beta/client";
function runFlow(req) {
  return baseRunFlow(req);
}
function streamFlow(req) {
  const res = baseStreamFlow(req);
  return {
    output: res.output,
    stream: res.stream
  };
}
export {
  runFlow,
  streamFlow
};
//# sourceMappingURL=client.mjs.map