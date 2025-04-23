// Share the instance module in the next-shared layer
import { workUnitAsyncStorageInstance } from './work-unit-async-storage-instance' with {
    'turbopack-transition': 'next-shared'
};
export { workUnitAsyncStorageInstance as workUnitAsyncStorage };
export function getExpectedRequestStore(callingExpression) {
    const workUnitStore = workUnitAsyncStorageInstance.getStore();
    if (workUnitStore) {
        if (workUnitStore.type === 'request') {
            return workUnitStore;
        }
        if (workUnitStore.type === 'prerender' || workUnitStore.type === 'prerender-ppr' || workUnitStore.type === 'prerender-legacy') {
            // This should not happen because we should have checked it already.
            throw Object.defineProperty(new Error(`\`${callingExpression}\` cannot be called inside a prerender. This is a bug in Next.js.`), "__NEXT_ERROR_CODE", {
                value: "E401",
                enumerable: false,
                configurable: true
            });
        }
        if (workUnitStore.type === 'cache') {
            throw Object.defineProperty(new Error(`\`${callingExpression}\` cannot be called inside "use cache". Call it outside and pass an argument instead. Read more: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", {
                value: "E37",
                enumerable: false,
                configurable: true
            });
        } else if (workUnitStore.type === 'unstable-cache') {
            throw Object.defineProperty(new Error(`\`${callingExpression}\` cannot be called inside unstable_cache. Call it outside and pass an argument instead. Read more: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", {
                value: "E69",
                enumerable: false,
                configurable: true
            });
        }
    }
    throw Object.defineProperty(new Error(`\`${callingExpression}\` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`), "__NEXT_ERROR_CODE", {
        value: "E251",
        enumerable: false,
        configurable: true
    });
}
export function getPrerenderResumeDataCache(workUnitStore) {
    if (workUnitStore.type === 'prerender' || workUnitStore.type === 'prerender-ppr') {
        return workUnitStore.prerenderResumeDataCache;
    }
    return null;
}
export function getRenderResumeDataCache(workUnitStore) {
    if (workUnitStore.type !== 'prerender-legacy' && workUnitStore.type !== 'cache' && workUnitStore.type !== 'unstable-cache') {
        if (workUnitStore.type === 'request') {
            return workUnitStore.renderResumeDataCache;
        }
        // We return the mutable resume data cache here as an immutable version of
        // the cache as it can also be used for reading.
        return workUnitStore.prerenderResumeDataCache;
    }
    return null;
}
export function getHmrRefreshHash(workUnitStore) {
    var _workUnitStore_cookies_get;
    return workUnitStore.type === 'cache' ? workUnitStore.hmrRefreshHash : workUnitStore.type === 'request' ? (_workUnitStore_cookies_get = workUnitStore.cookies.get('__next_hmr_refresh_hash__')) == null ? void 0 : _workUnitStore_cookies_get.value : undefined;
}

//# sourceMappingURL=work-unit-async-storage.external.js.map