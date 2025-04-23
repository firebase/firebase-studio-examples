"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFileTraceStore = void 0;
const tools_common_1 = require("@genkit-ai/tools-common");
const async_mutex_1 = require("async-mutex");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class LocalFileTraceStore {
    storeRoot;
    mutexes = {};
    filters;
    static defaultFilters = {
        'genkit:metadata:subtype': 'prompt',
    };
    constructor(filters = LocalFileTraceStore.defaultFilters) {
        this.storeRoot = path_1.default.resolve(process.cwd(), `.genkit/traces`);
        fs_1.default.mkdirSync(this.storeRoot, { recursive: true });
        console.info(`[Telemetry Server] initialized local file trace store at root: ${this.storeRoot}`);
        this.filters = filters;
    }
    async load(id) {
        const filePath = path_1.default.resolve(this.storeRoot, `${id}`);
        if (!fs_1.default.existsSync(filePath)) {
            return undefined;
        }
        const data = fs_1.default.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(data);
        if (!parsed.traceId) {
            parsed.traceId = id;
        }
        return tools_common_1.TraceDataSchema.parse(parsed);
    }
    getMutex(id) {
        if (!this.mutexes[id]) {
            this.mutexes[id] = new async_mutex_1.Mutex();
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
            fs_1.default.writeFileSync(path_1.default.resolve(this.storeRoot, `${id}`), JSON.stringify(trace));
        }
        finally {
            release();
        }
    }
    async list(query) {
        const files = fs_1.default.readdirSync(this.storeRoot);
        files.sort((a, b) => {
            return (fs_1.default.statSync(path_1.default.resolve(this.storeRoot, `${b}`)).mtime.getTime() -
                fs_1.default.statSync(path_1.default.resolve(this.storeRoot, `${a}`)).mtime.getTime());
        });
        const startFrom = query?.continuationToken
            ? parseInt(query?.continuationToken)
            : 0;
        const stopAt = startFrom + (query?.limit || 10);
        const traces = files.slice(startFrom, stopAt).map((id) => {
            const filePath = path_1.default.resolve(this.storeRoot, `${id}`);
            const data = fs_1.default.readFileSync(filePath, 'utf8');
            const parsed = JSON.parse(data);
            if (!parsed.traceId) {
                parsed.traceId = id;
            }
            return tools_common_1.TraceDataSchema.parse(parsed);
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
exports.LocalFileTraceStore = LocalFileTraceStore;
//# sourceMappingURL=localFileTraceStore.js.map