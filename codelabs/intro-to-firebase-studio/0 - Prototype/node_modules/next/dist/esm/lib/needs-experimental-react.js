export function needsExperimentalReact(config) {
    const { ppr, taint, viewTransition } = config.experimental || {};
    return Boolean(ppr || taint || viewTransition);
}

//# sourceMappingURL=needs-experimental-react.js.map