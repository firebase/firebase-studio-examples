"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    turbopackBuild: null,
    waitForShutdown: null,
    workerMain: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    turbopackBuild: function() {
        return turbopackBuild;
    },
    waitForShutdown: function() {
        return waitForShutdown;
    },
    workerMain: function() {
        return workerMain;
    }
});
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _turbopackwarning = require("../../lib/turbopack-warning");
const _utils = require("../../shared/lib/turbopack/utils");
const _buildcontext = require("../build-context");
const _swc = require("../swc");
const _asyncsema = require("next/dist/compiled/async-sema");
const _handleentrypoints = require("../handle-entrypoints");
const _manifestloader = require("../../shared/lib/turbopack/manifest-loader");
const _progress = require("../progress");
const _log = /*#__PURE__*/ _interop_require_wildcard(require("../output/log"));
const _fs = require("fs");
const _constants = require("../../shared/lib/constants");
const _config = /*#__PURE__*/ _interop_require_default(require("../../server/config"));
const _utils1 = require("../../export/utils");
const _storage = require("../../telemetry/storage");
const _trace = require("../../trace");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
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
const IS_TURBOPACK_BUILD = process.env.TURBOPACK && process.env.TURBOPACK_BUILD;
async function turbopackBuild() {
    var _config_experimental, _config_experimental_turbo, _config_experimental1, _config_experimental_turbo1;
    if (!IS_TURBOPACK_BUILD) {
        throw Object.defineProperty(new Error("next build doesn't support turbopack yet"), "__NEXT_ERROR_CODE", {
            value: "E122",
            enumerable: false,
            configurable: true
        });
    }
    await (0, _turbopackwarning.validateTurboNextConfig)({
        dir: _buildcontext.NextBuildContext.dir,
        isDev: false
    });
    const config = _buildcontext.NextBuildContext.config;
    const dir = _buildcontext.NextBuildContext.dir;
    const distDir = _buildcontext.NextBuildContext.distDir;
    const buildId = _buildcontext.NextBuildContext.buildId;
    const encryptionKey = _buildcontext.NextBuildContext.encryptionKey;
    const previewProps = _buildcontext.NextBuildContext.previewProps;
    const hasRewrites = _buildcontext.NextBuildContext.hasRewrites;
    const rewrites = _buildcontext.NextBuildContext.rewrites;
    const appDirOnly = _buildcontext.NextBuildContext.appDirOnly;
    const noMangling = _buildcontext.NextBuildContext.noMangling;
    const startTime = process.hrtime();
    const bindings = await (0, _swc.loadBindings)(config == null ? void 0 : (_config_experimental = config.experimental) == null ? void 0 : _config_experimental.useWasmBinary);
    const dev = false;
    // const supportedBrowsers = await getSupportedBrowsers(dir, dev)
    const supportedBrowsers = [
        'last 1 Chrome versions, last 1 Firefox versions, last 1 Safari versions, last 1 Edge versions'
    ];
    const persistentCaching = (0, _utils.isPersistentCachingEnabled)(config);
    const project = await bindings.turbo.createProject({
        projectPath: dir,
        rootPath: ((_config_experimental1 = config.experimental) == null ? void 0 : (_config_experimental_turbo = _config_experimental1.turbo) == null ? void 0 : _config_experimental_turbo.root) || config.outputFileTracingRoot || dir,
        distDir,
        nextConfig: config,
        jsConfig: await (0, _utils.getTurbopackJsConfig)(dir, config),
        watch: {
            enable: false
        },
        dev,
        env: process.env,
        defineEnv: (0, _swc.createDefineEnv)({
            isTurbopack: true,
            clientRouterFilters: _buildcontext.NextBuildContext.clientRouterFilters,
            config,
            dev,
            distDir,
            fetchCacheKeyPrefix: config.experimental.fetchCacheKeyPrefix,
            hasRewrites,
            // Implemented separately in Turbopack, doesn't have to be passed here.
            middlewareMatchers: undefined
        }),
        buildId,
        encryptionKey,
        previewProps,
        browserslistQuery: supportedBrowsers.join(', '),
        noMangling
    }, {
        persistentCaching,
        memoryLimit: (_config_experimental_turbo1 = config.experimental.turbo) == null ? void 0 : _config_experimental_turbo1.memoryLimit,
        dependencyTracking: persistentCaching
    });
    await _fs.promises.mkdir(_path.default.join(distDir, 'server'), {
        recursive: true
    });
    await _fs.promises.mkdir(_path.default.join(distDir, 'static', buildId), {
        recursive: true
    });
    await _fs.promises.writeFile(_path.default.join(distDir, 'package.json'), JSON.stringify({
        type: 'commonjs'
    }, null, 2));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const entrypointsSubscription = project.entrypointsSubscribe();
    const currentEntrypoints = {
        global: {
            app: undefined,
            document: undefined,
            error: undefined,
            middleware: undefined,
            instrumentation: undefined
        },
        app: new Map(),
        page: new Map()
    };
    const currentEntryIssues = new Map();
    const manifestLoader = new _manifestloader.TurbopackManifestLoader({
        buildId,
        distDir,
        encryptionKey
    });
    const entrypointsResult = await entrypointsSubscription.next();
    if (entrypointsResult.done) {
        throw Object.defineProperty(new Error('Turbopack did not return any entrypoints'), "__NEXT_ERROR_CODE", {
            value: "E275",
            enumerable: false,
            configurable: true
        });
    }
    entrypointsSubscription.return == null ? void 0 : entrypointsSubscription.return.call(entrypointsSubscription).catch(()=>{});
    const entrypoints = entrypointsResult.value;
    const topLevelErrors = [];
    for (const issue of entrypoints.issues){
        topLevelErrors.push({
            message: (0, _utils.formatIssue)(issue)
        });
    }
    if (topLevelErrors.length > 0) {
        throw Object.defineProperty(new Error(`Turbopack build failed with ${topLevelErrors.length} issues:\n${topLevelErrors.map((e)=>e.message).join('\n')}`), "__NEXT_ERROR_CODE", {
            value: "E33",
            enumerable: false,
            configurable: true
        });
    }
    await (0, _handleentrypoints.handleEntrypoints)({
        entrypoints,
        currentEntrypoints,
        currentEntryIssues,
        manifestLoader,
        productionRewrites: rewrites,
        logErrors: false
    });
    const progress = (0, _progress.createProgress)(currentEntrypoints.page.size + currentEntrypoints.app.size + 1, 'Building');
    const promises = [];
    // Concurrency will start at INITIAL_CONCURRENCY and
    // slowly ramp up to CONCURRENCY by increasing the
    // concurrency by 1 every time a task is completed.
    const INITIAL_CONCURRENCY = 5;
    const CONCURRENCY = 10;
    const sema = new _asyncsema.Sema(INITIAL_CONCURRENCY);
    let remainingRampup = CONCURRENCY - INITIAL_CONCURRENCY;
    const enqueue = (fn)=>{
        promises.push((async ()=>{
            await sema.acquire();
            try {
                await fn();
            } finally{
                sema.release();
                if (remainingRampup > 0) {
                    remainingRampup--;
                    sema.release();
                }
                progress.run();
            }
        })());
    };
    if (!appDirOnly) {
        for (const [page, route] of currentEntrypoints.page){
            enqueue(()=>(0, _handleentrypoints.handleRouteType)({
                    page,
                    route,
                    currentEntryIssues,
                    entrypoints: currentEntrypoints,
                    manifestLoader,
                    productionRewrites: rewrites,
                    logErrors: false
                }));
        }
    }
    for (const [page, route] of currentEntrypoints.app){
        enqueue(()=>(0, _handleentrypoints.handleRouteType)({
                page,
                route,
                currentEntryIssues,
                entrypoints: currentEntrypoints,
                manifestLoader,
                productionRewrites: rewrites,
                logErrors: false
            }));
    }
    enqueue(()=>(0, _handleentrypoints.handlePagesErrorRoute)({
            currentEntryIssues,
            entrypoints: currentEntrypoints,
            manifestLoader,
            productionRewrites: rewrites,
            logErrors: false
        }));
    await Promise.all(promises);
    await manifestLoader.writeManifests({
        devRewrites: undefined,
        productionRewrites: rewrites,
        entrypoints: currentEntrypoints
    });
    const errors = [];
    const warnings = [];
    for (const [page, entryIssues] of currentEntryIssues){
        for (const issue of entryIssues.values()){
            if (issue.severity !== 'warning') {
                errors.push({
                    page,
                    message: (0, _utils.formatIssue)(issue)
                });
            } else {
                if ((0, _utils.isRelevantWarning)(issue)) {
                    warnings.push({
                        page,
                        message: (0, _utils.formatIssue)(issue)
                    });
                }
            }
        }
    }
    const shutdownPromise = project.shutdown();
    if (warnings.length > 0) {
        _log.warn(`Turbopack build collected ${warnings.length} warnings:\n${warnings.map((e)=>{
            return 'Page: ' + e.page + '\n' + e.message;
        }).join('\n')}`);
    }
    if (errors.length > 0) {
        throw Object.defineProperty(new Error(`Turbopack build failed with ${errors.length} errors:\n${errors.map((e)=>{
            return 'Page: ' + e.page + '\n' + e.message;
        }).join('\n')}`), "__NEXT_ERROR_CODE", {
            value: "E425",
            enumerable: false,
            configurable: true
        });
    }
    const time = process.hrtime(startTime);
    return {
        duration: time[0] + time[1] / 1e9,
        buildTraceContext: undefined,
        shutdownPromise
    };
}
let shutdownPromise;
async function workerMain(workerData) {
    // setup new build context from the serialized data passed from the parent
    Object.assign(_buildcontext.NextBuildContext, workerData.buildContext);
    /// load the config because it's not serializable
    _buildcontext.NextBuildContext.config = await (0, _config.default)(_constants.PHASE_PRODUCTION_BUILD, _buildcontext.NextBuildContext.dir);
    // Matches handling in build/index.ts
    // https://github.com/vercel/next.js/blob/84f347fc86f4efc4ec9f13615c215e4b9fb6f8f0/packages/next/src/build/index.ts#L815-L818
    // Ensures the `config.distDir` option is matched.
    if ((0, _utils1.hasCustomExportOutput)(_buildcontext.NextBuildContext.config)) {
        _buildcontext.NextBuildContext.config.distDir = '.next';
    }
    // Clone the telemetry for worker
    const telemetry = new _storage.Telemetry({
        distDir: _buildcontext.NextBuildContext.config.distDir
    });
    (0, _trace.setGlobal)('telemetry', telemetry);
    const result = await turbopackBuild();
    shutdownPromise = result.shutdownPromise;
    return result;
}
async function waitForShutdown() {
    if (shutdownPromise) {
        await shutdownPromise;
    }
}

//# sourceMappingURL=impl.js.map