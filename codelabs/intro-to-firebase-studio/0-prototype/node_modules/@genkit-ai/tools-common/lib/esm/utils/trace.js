export function stackTraceSpans(trace) {
    if (!trace.spans || Object.keys(trace.spans).length === 0)
        return undefined;
    let rootSpan = undefined;
    const treeSpans = new Map();
    Object.values(trace.spans).forEach((span) => {
        treeSpans.set(span.spanId, { spans: [], ...span });
        if (!span.parentSpanId) {
            rootSpan = treeSpans.get(span.spanId);
        }
    });
    treeSpans.forEach((span) => {
        if (span.parentSpanId && span.spanId !== rootSpan?.spanId) {
            const parent = treeSpans.get(span.parentSpanId);
            if (parent) {
                parent.spans?.push(span);
            }
            else if (!rootSpan) {
                rootSpan = span;
            }
        }
    });
    treeSpans.forEach((span) => {
        span.spans?.sort((a, b) => a.startTime - b.startTime);
    });
    let bestRoot = rootSpan;
    while (bestRoot.attributes['genkit:metadata:genkit-dev-internal'] ||
        bestRoot.attributes['genkit:metadata:flow:wrapperAction']) {
        if (!bestRoot.spans?.length) {
            break;
        }
        bestRoot = bestRoot.spans[0];
    }
    return bestRoot;
}
//# sourceMappingURL=trace.js.map