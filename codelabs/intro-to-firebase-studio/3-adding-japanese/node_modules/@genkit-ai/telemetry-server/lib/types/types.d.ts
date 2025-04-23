import { TraceData } from '@genkit-ai/tools-common';
export interface TraceQuery {
    limit?: number;
    continuationToken?: string;
}
export interface TraceQueryResponse {
    traces: TraceData[];
    continuationToken?: string;
}
export interface TraceStore {
    save(traceId: string, trace: TraceData): Promise<void>;
    load(traceId: string): Promise<TraceData | undefined>;
    list(query?: TraceQuery): Promise<TraceQueryResponse>;
}
