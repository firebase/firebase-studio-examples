import { SpanData, TraceData } from '@genkit-ai/tools-common';
import { Firestore } from '@google-cloud/firestore';
import { TraceQuery, TraceQueryResponse, TraceStore } from './types';
interface Credentials {
    client_email?: string;
    private_key?: string;
}
export declare class FirestoreTraceStore implements TraceStore {
    readonly db: Firestore;
    readonly collection: string;
    readonly databaseId: string;
    readonly expireAfterDays: number;
    constructor(params?: {
        collection?: string;
        databaseId?: string;
        projectId?: string;
        expireAfterDays?: number;
        credentials?: Credentials;
    });
    save(traceId: string, traceData: TraceData): Promise<void>;
    load(traceId: string): Promise<TraceData | undefined>;
    list(query?: TraceQuery): Promise<TraceQueryResponse>;
}
export declare function rebatchSpans(traceData: TraceData): Record<string, SpanData>[];
export {};
