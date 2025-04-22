import { TraceDataSchema } from '@genkit-ai/tools-common';
import { Mutex } from 'async-mutex';
import fs from 'fs';
import path from 'path';
export class LocalFileTraceStore {
    storeRoot;
    mutexes = {};
    filters;
    static defaultFilters = {
        'genkit:metadata:subtype': 'prompt',
    };
    constructor(filters = LocalFileTraceStore.defaultFilters) {
        this.storeRoot = path.resolve(process.cwd(), `.genkit/traces`);
        fs.mkdirSync(this.storeRoot, { recursive: true });
        console.info(`[Telemetry Server] initialized local file trace store at root: ${this.storeRoot}`);
        this.filters = filters;
    }
    async load(id) {
        const filePath = path.resolve(this.storeRoot, `${id}`);
        if (!fs.existsSync(filePath)) {
            return undefined;
        }
        const data = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(data);
        if (!parsed.traceId) {
            parsed.traceId = id;
        }
        return TraceDataSchema.parse(parsed);
    }
    getMutex(id) {
        if (!this.mutexes[id]) {
            this.mutexes[id] = new Mutex();
        }
        return this.mutexes[id];
    }
    async save(id, rawTrace) {
        let trace = this.filter(rawTrace);
        if (Object.keys(trace.spans).length === 0) {
            return;
        }
        const mutex = this.getMutex(id);
        await mutex.waitForUnlock();
        const release = await mutex.acquire();
        try {
            const existing = await this.load(id);
            if (existing) {
                Object.keys(trace.spans).forEach((spanId) => (existing.spans[spanId] = trace.spans[spanId]));
                existing.displayName = trace.displayName;
                existing.startTime = trace.startTime;
                existing.endTime = trace.endTime;
                trace = existing;
            }
            fs.writeFileSync(path.resolve(this.storeRoot, `${id}`), JSON.stringify(trace));
        }
        finally {
            release();
        }
    }
    async list(query) {
        const files = fs.readdirSync(this.storeRoot);
        files.sort((a, b) => {
            return (fs.statSync(path.resolve(this.storeRoot, `${b}`)).mtime.getTime() -
                fs.statSync(path.resolve(this.storeRoot, `${a}`)).mtime.getTime());
        });
        const startFrom = query?.continuationToken
            ? parseInt(query?.continuationToken)
            : 0;
        const stopAt = startFrom + (query?.limit || 10);
        const traces = files.slice(startFrom, stopAt).map((id) => {
            const filePath = path.resolve(this.storeRoot, `${id}`);
            const data = fs.readFileSync(filePath, 'utf8');
            const parsed = JSON.parse(data);
            if (!parsed.traceId) {
                parsed.traceId = id;
            }
            return TraceDataSchema.parse(parsed);
        });
        return {
            traces,
            continuationToken: files.length > stopAt ? stopAt.toString() : undefined,
        };
    }
    filter(trace) {
        Object.keys(trace.spans).forEach((spanId) => {
            const span = trace.spans[spanId];
            Object.keys(this.filters).forEach((f) => {
                if (span.attributes[f] === this.filters[f]) {
                    delete trace.spans[spanId];
                }
            });
        });
        if (Object.keys(trace.spans).length === 1) {
            Object.keys(trace.spans).forEach((spanId) => {
                const span = trace.spans[spanId];
                if (span.attributes['genkit:name'] === 'dev-run-action-wrapper') {
                    delete trace.spans[spanId];
                }
            });
        }
        return trace;
    }
}
//# sourceMappingURL=localFileTraceStore.js.map