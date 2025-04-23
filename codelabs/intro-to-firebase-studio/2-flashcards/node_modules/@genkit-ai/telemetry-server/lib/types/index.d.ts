import { TraceStore } from './types';
export { FirestoreTraceStore } from './firestoreTraceStore.js';
export { LocalFileTraceStore } from './localFileTraceStore.js';
export { TraceStore } from './types';
export declare function startTelemetryServer(params: {
    port: number;
    traceStore: TraceStore;
    maxRequestBodySize?: string | number;
}): void;
