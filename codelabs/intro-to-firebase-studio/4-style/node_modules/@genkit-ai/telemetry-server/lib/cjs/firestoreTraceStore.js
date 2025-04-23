"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rebatchSpans = exports.FirestoreTraceStore = void 0;
const tools_common_1 = require("@genkit-ai/tools-common");
const firestore_1 = require("@google-cloud/firestore");
const crypto_1 = require("crypto");
const DOC_MAX_SIZE = 1000000;
class FirestoreTraceStore {
    db;
    collection;
    databaseId;
    expireAfterDays;
    constructor(params = {}) {
        this.collection = params.collection || 'genkit-traces';
        this.databaseId = params.databaseId || '(default)';
        this.expireAfterDays = params.expireAfterDays || 14;
        this.db = new firestore_1.Firestore({
            databaseId: this.databaseId,
            ignoreUndefinedProperties: true,
            credentials: params.credentials,
        });
    }
    async save(traceId, traceData) {
        const expireAt = Date.now() + this.expireAfterDays * 24 * 60 * 60 * 1000;
        const traceInfo = {
            ...traceData,
            expireAt,
            spans: {},
        };
        const start = Date.now();
        const batches = rebatchSpans(traceData);
        let batchWrite = this.db.batch();
        batchWrite.set(this.db.collection(this.collection).doc(traceId), traceInfo, { merge: true });
        batches.forEach((batch) => {
            batchWrite.create(this.db
                .collection(this.collection)
                .doc(traceId)
                .collection('spans')
                .doc((0, crypto_1.randomUUID)()), {
                expireAt,
                spans: batch,
            });
        });
        await batchWrite.commit();
        console.debug(`saved trace ${traceId}, ${Object.keys(traceData.spans).length} span(s) (${Date.now() - start}ms)`);
    }
    async load(traceId) {
        const [traceInfo, spanBatches] = await Promise.all([
            this.db.collection(this.collection).doc(traceId).get(),
            this.db
                .collection(this.collection)
                .doc(traceId)
                .collection('spans')
                .get(),
        ]);
        const spans = {};
        spanBatches.forEach((batch) => {
            const spansBatch = batch.data().spans;
            Object.keys(spansBatch).forEach((key) => {
                spans[key] = tools_common_1.SpanDataSchema.parse(spansBatch[key]);
            });
        });
        return tools_common_1.TraceDataSchema.parse({
            ...traceInfo.data(),
            spans,
        });
    }
    async list(query) {
        const limit = query?.limit || 10;
        let fsQuery = this.db
            .collection(this.collection)
            .orderBy('startTime', 'desc');
        if (query?.continuationToken) {
            fsQuery = fsQuery.startAfter(parseInt(query.continuationToken));
        }
        fsQuery = fsQuery.limit(limit);
        const data = await fsQuery.get();
        const lastVisible = data.docs[data.docs.length - 1];
        return {
            traces: data.docs.map((d) => d.data()),
            continuationToken: data.docs.length === limit
                ? `${lastVisible.data().startTime}`
                : undefined,
        };
    }
}
exports.FirestoreTraceStore = FirestoreTraceStore;
function rebatchSpans(traceData) {
    const batches = [];
    let lastBatchRunningSize = 0;
    for (const span of Object.values(traceData.spans)) {
        let estimatedSpanSize = estimateSpanSize(span);
        if (estimatedSpanSize >= DOC_MAX_SIZE) {
            console.warn(`Truncating data for trace ${traceData.traceId} span ${span.spanId}`);
            truncateSpanData(span);
            estimatedSpanSize = estimateSpanSize(span);
        }
        if (lastBatchRunningSize + estimatedSpanSize < DOC_MAX_SIZE) {
            if (batches.length === 0) {
                batches.push({});
            }
        }
        else {
            batches.push({});
            lastBatchRunningSize = 0;
        }
        lastBatchRunningSize += estimatedSpanSize;
        batches[batches.length - 1][span.spanId] = span;
    }
    return batches;
}
exports.rebatchSpans = rebatchSpans;
function estimateSpanSize(span) {
    if (Object.values(span.attributes).length === 0) {
        return 0;
    }
    return Object.values(span.attributes)
        .map((attr) => attr.toString().length)
        .reduce((a, b) => a + b);
}
function truncateSpanData(span) {
    span.truncated = true;
    delete span.attributes['genkit:output'];
    if (estimateSpanSize(span) < DOC_MAX_SIZE) {
        return;
    }
    delete span.attributes['genkit:input'];
    if (estimateSpanSize(span) < DOC_MAX_SIZE) {
        return;
    }
    span.attributes = {};
    return;
}
//# sourceMappingURL=firestoreTraceStore.js.map