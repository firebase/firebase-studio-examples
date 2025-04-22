/**
 * Returns a transition function that can be used to wrap router actions.
 * This allows us to tap into the transition state of the router as an
 * approximation of React render time.
 */
export declare const useSyncDevRenderIndicator: () => (fn: () => void) => void;
