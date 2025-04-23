import path from 'path';
import { validateTurboNextConfig } from '../../lib/turbopack-warning';
import { formatIssue, getTurbopackJsConfig, isPersistentCachingEnabled, isRelevantWarning } from '../../shared/lib/turbopack/utils';
import { NextBuildContext } from '../build-context';
import { createDefineEnv, loadBindings } from '../swc';
import { Sema } from 'next/dist/compiled/async-sema';
import { handleEntrypoints, handlePagesErrorRoute, handleRouteType } from '../handle-entrypoints';
import { TurbopackManifestLoader } from '../../shared/lib/turbopack/manifest-loader';
import { createProgress } from '../progress';
import * as Log from '../output/log';
import { promises as fs } from 'fs';
import { PHASE_PRODUCTION_BUILD } from '../../shared/lib/constants';
import loadConfig from '../../server/config';
import { hasCustomExportOutput } from '../../export/utils';
import { Telemetry } from '../../telemetry/storage';
import { setGlobal } from '../../trace';
const IS_TURBOPACK_BUILD = process.env.TURBOPACK && process.env.TURBOPACK_BUILD;
export async function turbopackBuild() {
    var _config_experimental, _config_experimental_turbo, _config_experimental1, _config_experimental_turbo1;
    if (!IS_TURBOPACK_BUILD) {
        throw Object.defineProperty(new Error("next build doesn't support turbopack yet"), "__NEXT_ERROR_CODE", {
            value: "E122",
            enumerable: false,
            configurable: true
        });
    }
    await validateTurboNextConfig({
        dir: NextBuildContext.dir,
        isDev: false
    });
    const config = NextBuildContext.config;
    const dir = NextBuildContext.dir;
    const distDir = NextBuildContext.distDir;
    const buildId = NextBuildContext.buildId;
    const encryptionKey = NextBuildContext.encryptionKey;
    const previewProps = NextBuildContext.previewProps;
    const hasRewrites = NextBuildContext.hasRewrites;
    const rewrites = NextBuildContext.rewrites;
    const appDirOnly = NextBuildContext.appDirOnly;
    const noMangling = NextBuildContext.noMangling;
    const startTime = process.hrtime();
    const bindings = await loadBindings(config == null ? void 0 : (_config_experimental = config.experimental) == null ? void 0 : _config_experimental.useWasmBinary);
    const dev = false;
    // const supportedBrowsers = await getSupportedBrowsers(dir, dev)
    const supportedBrowsers = [
        'last 1 Chrome versions, last 1 Firefox versions, last 1 Safari versions, last 1 Edge versions'
    ];
    const persistentCaching = isPersistentCachingEnabled(config);
    const project = await bindings.turbo.createProject({
        projectPath: dir,
        rootPath: ((_config_experimental1 = config.experimental) == null ? void 0 : (_config_experimental_turbo = _config_experimental1.turbo) == null ? void 0 : _config_experimental_turbo.root) || config.outputFileTracingRoot || dir,
        distDir,
        nextConfig: config,
        jsConfig: await getTurbopackJsConfig(dir, config),
        watch: {
            enable: false
        },
        dev,
        env: process.env,
        defineEnv: createDefineEnv({
            isTurbopack: true,
            clientRouterFilters: NextBuildContext.clientRouterFilters,
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
    await fs.mkdir(path.join(distDir, 'server'), {
        recursive: true
    });
    await fs.mkdir(path.join(distDir, 'static', buildId), {
        recursive: true
    });
    await fs.writeFile(path.join(distDir, 'package.json'), JSON.stringify({
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
    const manifestLoader = new TurbopackManifestLoader({
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
            message: formatIssue(issue)
        });
    }
    if (topLevelErrors.length > 0) {
        throw Object.defineProperty(new Error(`Turbopack build failed with ${topLevelErrors.length} issues:\n${topLevelErrors.map((e)=>e.message).join('\n')}`), "__NEXT_ERROR_CODE", {
            value: "E33",
            enumerable: false,
            configurable: true
        });
    }
    await handleEntrypoints({
        entrypoints,
        currentEntrypoints,
        currentEntryIssues,
        manifestLoader,
        productionRewrites: rewrites,
        logErrors: false
    });
    const progress = createProgress(currentEntrypoints.page.size + currentEntrypoints.app.size + 1, 'Building');
    const promises = [];
    // Concurrency will start at INITIAL_CONCURRENCY and
    // slowly ramp up to CONCURRENCY by increasing the
    // concurrency by 1 every time a task is completed.
    const INITIAL_CONCURRENCY = 5;
    const CONCURRENCY = 10;
    const sema = new Sema(INITIAL_CONCURRENCY);
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
            enqueue(()=>handleRouteType({
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
        enqueue(()=>handleRouteType({
                page,
                route,
                currentEntryIssues,
                entrypoints: currentEntrypoints,
                manifestLoader,
                productionRewrites: rewrites,
                logErrors: false
            }));
    }
    enqueue(()=>handlePagesErrorRoute({
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
                    message: formatIssue(issue)
                });
            } else {
                if (isRelevantWarning(issue)) {
                    warnings.push({
                        page,
                        message: formatIssue(issue)
                    });
                }
            }
        }
    }
    const shutdownPromise = project.shutdown();
    if (warnings.length > 0) {
        Log.warn(`Turbopack build collected ${warnings.length} warnings:\n${warnings.map((e)=>{
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
export async function workerMain(workerData) {
    // setup new build context from the serialized data passed from the parent
    Object.assign(NextBuildContext, workerData.buildContext);
    /// load the config because it's not serializable
    NextBuildContext.config = await loadConfig(PHASE_PRODUCTION_BUILD, NextBuildContext.dir);
    // Matches handling in build/index.ts
    // https://github.com/vercel/next.js/blob/84f347fc86f4efc4ec9f13615c215e4b9fb6f8f0/packages/next/src/build/index.ts#L815-L818
    // Ensures the `config.distDir` option is matched.
    if (hasCustomExportOutput(NextBuildContext.config)) {
        NextBuildContext.config.distDir = '.next';
    }
    // Clone the telemetry for worker
    const telemetry = new Telemetry({
        distDir: NextBuildContext.config.distDir
    });
    setGlobal('telemetry', telemetry);
    const result = await turbopackBuild();
    shutdownPromise = result.shutdownPromise;
    return result;
}
export async function waitForShutdown() {
    if (shutdownPromise) {
        await shutdownPromise;
    }
}

//# sourceMappingURL=impl.js.map