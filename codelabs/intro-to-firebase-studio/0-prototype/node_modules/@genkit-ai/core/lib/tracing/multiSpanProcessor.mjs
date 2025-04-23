class MultiSpanProcessor {
  constructor(processors) {
    this.processors = processors;
  }
  forceFlush() {
    return Promise.all(this.processors.map((p) => p.forceFlush())).then();
  }
  onStart(span, parentContext) {
    this.processors.map((p) => p.onStart(span, parentContext));
  }
  onEnd(span) {
    this.processors.map((p) => p.onEnd(span));
  }
  async shutdown() {
    return Promise.all(this.processors.map((p) => p.shutdown())).then();
  }
}
export {
  MultiSpanProcessor
};
//# sourceMappingURL=multiSpanProcessor.mjs.map