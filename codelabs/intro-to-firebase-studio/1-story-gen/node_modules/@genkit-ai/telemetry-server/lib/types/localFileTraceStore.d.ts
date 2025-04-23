import { TraceData } from '@genkit-ai/tools-common';
import { Mutex } from 'async-mutex';
import { TraceQuery, TraceQueryResponse, TraceStore } from './types';
export declare class LocalFileTraceStore implements TraceStore {
    private readonly storeRoot;
    private mutexes;
    private filters;
    static defaultFilters: Record<string, string>;
    constructor(filters?: Record<string, string>);
    load(id: string): Promise<TraceData | undefined>;
    getMutex(id: string): Mutex;
    save(id: string, rawTrace: TraceData): Promise<void>;
    list(query?: TraceQuery): Promise<TraceQueryResponse>;
    private filter;
}
