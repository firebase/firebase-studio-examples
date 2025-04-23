"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    handleEntrypoints: null,
    handlePagesErrorRoute: null,
    handleRouteType: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    handleEntrypoints: function() {
        return handleEntrypoints;
    },
    handlePagesErrorRoute: function() {
        return handlePagesErrorRoute;
    },
    handleRouteType: function() {
        return handleRouteType;
    }
});
const _log = /*#__PURE__*/ _interop_require_wildcard(require("./output/log"));
const _entrykey = require("../shared/lib/turbopack/entry-key");
const _utils = require("../shared/lib/turbopack/utils");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function handleEntrypoints({ entrypoints, currentEntrypoints, currentEntryIssues, manifestLoader, productionRewrites, logErrors }) {
    currentEntrypoints.global.app = entrypoints.pagesAppEndpoint;
    currentEntrypoints.global.document = entrypoints.pagesDocumentEndpoint;
    currentEntrypoints.global.error = entrypoints.pagesErrorEndpoint;
    currentEntrypoints.global.instrumentation = entrypoints.instrumentation;
    currentEntrypoints.page.clear();
    currentEntrypoints.app.clear();
    for (const [pathname, route] of entrypoints.routes){
        switch(route.type){
            case 'page':
            case 'page-api':
                currentEntrypoints.page.set(pathname, route);
                break;
            case 'app-page':
                {
                    route.pages.forEach((page)=>{
                        currentEntrypoints.app.set(page.originalName, {
                            type: 'app-page',
                            ...page
                        });
                    });
                    break;
                }
            case 'app-route':
                {
                    currentEntrypoints.app.set(route.originalName, route);
                    break;
                }
            default:
                _log.info(`skipping ${pathname} (${route.type})`);
                break;
        }
    }
    const { middleware, instrumentation } = entrypoints;
    // We check for explicit true/false, since it's initialized to
    // undefined during the first loop (middlewareChanges event is
    // unnecessary during the first serve)
    if (currentEntrypoints.global.middleware && !middleware) {
        const key = (0, _entrykey.getEntryKey)('root', 'server', 'middleware');
        // Went from middleware to no middleware
        currentEntryIssues.delete(key);
    }
    currentEntrypoints.global.middleware = middleware;
    if (instrumentation) {
        const processInstrumentation = async (name, prop)=>{
            const key = (0, _entrykey.getEntryKey)('root', 'server', name);
            const writtenEndpoint = await instrumentation[prop].writeToDisk();
            (0, _utils.processIssues)(currentEntryIssues, key, writtenEndpoint, false, logErrors);
        };
        await processInstrumentation('instrumentation.nodeJs', 'nodeJs');
        await processInstrumentation('instrumentation.edge', 'edge');
        await manifestLoader.loadMiddlewareManifest('instrumentation', 'instrumentation');
        await manifestLoader.writeManifests({
            devRewrites: undefined,
            productionRewrites,
            entrypoints: currentEntrypoints
        });
    }
    if (middleware) {
        const key = (0, _entrykey.getEntryKey)('root', 'server', 'middleware');
        const endpoint = middleware.endpoint;
        async function processMiddleware() {
            const writtenEndpoint = await endpoint.writeToDisk();
            (0, _utils.processIssues)(currentEntryIssues, key, writtenEndpoint, false, logErrors);
            await manifestLoader.loadMiddlewareManifest('middleware', 'middleware');
        }
        await processMiddleware();
    } else {
        manifestLoader.deleteMiddlewareManifest((0, _entrykey.getEntryKey)('root', 'server', 'middleware'));
    }
}
async function handlePagesErrorRoute({ currentEntryIssues, entrypoints, manifestLoader, productionRewrites, logErrors }) {
    if (entrypoints.global.app) {
        const key = (0, _entrykey.getEntryKey)('pages', 'server', '_app');
        const writtenEndpoint = await entrypoints.global.app.writeToDisk();
        (0, _utils.processIssues)(currentEntryIssues, key, writtenEndpoint, false, logErrors);
    }
    await manifestLoader.loadBuildManifest('_app');
    await manifestLoader.loadPagesManifest('_app');
    await manifestLoader.loadFontManifest('_app');
    if (entrypoints.global.document) {
        const key = (0, _entrykey.getEntryKey)('pages', 'server', '_document');
        const writtenEndpoint = await entrypoints.global.document.writeToDisk();
        (0, _utils.processIssues)(currentEntryIssues, key, writtenEndpoint, false, logErrors);
    }
    await manifestLoader.loadPagesManifest('_document');
    if (entrypoints.global.error) {
        const key = (0, _entrykey.getEntryKey)('pages', 'server', '_error');
        const writtenEndpoint = await entrypoints.global.error.writeToDisk();
        (0, _utils.processIssues)(currentEntryIssues, key, writtenEndpoint, false, logErrors);
    }
    await manifestLoader.loadBuildManifest('_error');
    await manifestLoader.loadPagesManifest('_error');
    await manifestLoader.loadFontManifest('_error');
    await manifestLoader.writeManifests({
        devRewrites: undefined,
        productionRewrites,
        entrypoints
    });
}
async function handleRouteType({ page, route, currentEntryIssues, entrypoints, manifestLoader, productionRewrites, logErrors }) {
    const shouldCreateWebpackStats = process.env.TURBOPACK_STATS != null;
    switch(route.type){
        case 'page':
            {
                const serverKey = (0, _entrykey.getEntryKey)('pages', 'server', page);
                if (entrypoints.global.app) {
                    const key = (0, _entrykey.getEntryKey)('pages', 'server', '_app');
                    const writtenEndpoint = await entrypoints.global.app.writeToDisk();
                    (0, _utils.processIssues)(currentEntryIssues, key, writtenEndpoint, false, logErrors);
                }
                await manifestLoader.loadBuildManifest('_app');
                await manifestLoader.loadPagesManifest('_app');
                if (entrypoints.global.document) {
                    const key = (0, _entrykey.getEntryKey)('pages', 'server', '_document');
                    const writtenEndpoint = await entrypoints.global.document.writeToDisk();
                    (0, _utils.processIssues)(currentEntryIssues, key, writtenEndpoint, false, logErrors);
                }
                await manifestLoader.loadPagesManifest('_document');
                const writtenEndpoint = await route.htmlEndpoint.writeToDisk();
                const type = writtenEndpoint == null ? void 0 : writtenEndpoint.type;
                await manifestLoader.loadBuildManifest(page);
                await manifestLoader.loadPagesManifest(page);
                if (type === 'edge') {
                    await manifestLoader.loadMiddlewareManifest(page, 'pages');
                } else {
                    manifestLoader.deleteMiddlewareManifest(serverKey);
                }
                await manifestLoader.loadFontManifest('/_app', 'pages');
                await manifestLoader.loadFontManifest(page, 'pages');
                if (shouldCreateWebpackStats) {
                    await manifestLoader.loadWebpackStats(page, 'pages');
                }
                await manifestLoader.writeManifests({
                    devRewrites: undefined,
                    productionRewrites,
                    entrypoints
                });
                (0, _utils.processIssues)(currentEntryIssues, serverKey, writtenEndpoint, false, logErrors);
                break;
            }
        case 'page-api':
            {
                const key = (0, _entrykey.getEntryKey)('pages', 'server', page);
                const writtenEndpoint = await route.endpoint.writeToDisk();
                const type = writtenEndpoint.type;
                await manifestLoader.loadPagesManifest(page);
                if (type === 'edge') {
                    await manifestLoader.loadMiddlewareManifest(page, 'pages');
                } else {
                    manifestLoader.deleteMiddlewareManifest(key);
                }
                await manifestLoader.writeManifests({
                    devRewrites: undefined,
                    productionRewrites,
                    entrypoints
                });
                (0, _utils.processIssues)(currentEntryIssues, key, writtenEndpoint, true, logErrors);
                break;
            }
        case 'app-page':
            {
                const key = (0, _entrykey.getEntryKey)('app', 'server', page);
                const writtenEndpoint = await route.htmlEndpoint.writeToDisk();
                const type = writtenEndpoint.type;
                if (type === 'edge') {
                    await manifestLoader.loadMiddlewareManifest(page, 'app');
                } else {
                    manifestLoader.deleteMiddlewareManifest(key);
                }
                await manifestLoader.loadAppBuildManifest(page);
                await manifestLoader.loadBuildManifest(page, 'app');
                await manifestLoader.loadAppPathsManifest(page);
                await manifestLoader.loadActionManifest(page);
                await manifestLoader.loadFontManifest(page, 'app');
                if (shouldCreateWebpackStats) {
                    await manifestLoader.loadWebpackStats(page, 'app');
                }
                await manifestLoader.writeManifests({
                    devRewrites: undefined,
                    productionRewrites,
                    entrypoints
                });
                (0, _utils.processIssues)(currentEntryIssues, key, writtenEndpoint, false, logErrors);
                break;
            }
        case 'app-route':
            {
                const key = (0, _entrykey.getEntryKey)('app', 'server', page);
                const writtenEndpoint = await route.endpoint.writeToDisk();
                const type = writtenEndpoint.type;
                await manifestLoader.loadAppPathsManifest(page);
                if (type === 'edge') {
                    await manifestLoader.loadMiddlewareManifest(page, 'app');
                } else {
                    manifestLoader.deleteMiddlewareManifest(key);
                }
                await manifestLoader.writeManifests({
                    devRewrites: undefined,
                    productionRewrites,
                    entrypoints
                });
                (0, _utils.processIssues)(currentEntryIssues, key, writtenEndpoint, true, logErrors);
                break;
            }
        default:
            {
                throw Object.defineProperty(new Error(`unknown route type ${route.type} for ${page}`), "__NEXT_ERROR_CODE", {
                    value: "E316",
                    enumerable: false,
                    configurable: true
                });
            }
    }
}

//# sourceMappingURL=handle-entrypoints.js.map