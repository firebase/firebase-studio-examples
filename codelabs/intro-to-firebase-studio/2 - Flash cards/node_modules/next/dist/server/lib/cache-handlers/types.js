// In-memory caches are fragile and should not use stale-while-revalidate
// semantics on the caches because it's not worth warming up an entry that's
// likely going to get evicted before we get to use it anyway. However,
// we also don't want to reuse a stale entry for too long so stale entries
// should be considered expired/missing in such CacheHandlers.
// This is the entry we store
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});

//# sourceMappingURL=types.js.map