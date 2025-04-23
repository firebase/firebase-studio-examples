import { ATTR_PREFIX } from "./instrumentation.js";
class GenkitSpanProcessorWrapper {
  constructor(processor) {
    this.processor = processor;
  }
  forceFlush() {
    return this.processor.forceFlush();
  }
  onStart(span, parentContext) {
    return this.processor.onStart(span, parentContext);
  }
  onEnd(span) {
    if (Object.keys(span.attributes).find((k) => k.startsWith(ATTR_PREFIX + ":"))) {
      return this.processor.onEnd(new FilteringReadableSpanProxy(span));
    } else {
      return this.processor.onEnd(span);
    }
  }
  async shutdown() {
    return this.processor.shutdown();
  }
}
class FilteringReadableSpanProxy {
  constructor(span) {
    this.span = span;
  }
  get name() {
    return this.span.name;
  }
  get kind() {
    return this.span.kind;
  }
  get parentSpanId() {
    return this.span.parentSpanId;
  }
  get startTime() {
    return this.span.startTime;
  }
  get endTime() {
    return this.span.endTime;
  }
  get status() {
    return this.span.status;
  }
  get attributes() {
    const out = {};
    for (const [key, value] of Object.entries(this.span.attributes)) {
      if (!key.startsWith(ATTR_PREFIX + ":")) {
        out[key] = value;
      }
    }
    return out;
  }
  get links() {
    return this.span.links;
  }
  get events() {
    return this.span.events;
  }
  get duration() {
    return this.span.duration;
  }
  get ended() {
    return this.span.ended;
  }
  get resource() {
    return this.span.resource;
  }
  get instrumentationLibrary() {
    return this.span.instrumentationLibrary;
  }
  get droppedAttributesCount() {
    return this.span.droppedAttributesCount;
  }
  get droppedEventsCount() {
    return this.span.droppedEventsCount;
  }
  get droppedLinksCount() {
    return this.span.droppedLinksCount;
  }
  spanContext() {
    return this.span.spanContext();
  }
}
export {
  GenkitSpanProcessorWrapper
};
//# sourceMappingURL=processor.mjs.map