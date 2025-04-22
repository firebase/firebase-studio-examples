"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    mountLinkInstance: null,
    onLinkVisibilityChanged: null,
    onNavigationIntent: null,
    pingVisibleLinks: null,
    unmountLinkInstance: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    mountLinkInstance: function() {
        return mountLinkInstance;
    },
    onLinkVisibilityChanged: function() {
        return onLinkVisibilityChanged;
    },
    onNavigationIntent: function() {
        return onNavigationIntent;
    },
    pingVisibleLinks: function() {
        return pingVisibleLinks;
    },
    unmountLinkInstance: function() {
        return unmountLinkInstance;
    }
});
const _actionqueue = require("../../shared/lib/router/action-queue");
const _approuter = require("./app-router");
const _routerreducertypes = require("./router-reducer/router-reducer-types");
const _segmentcache = require("./segment-cache");
// Use a WeakMap to associate a Link instance with its DOM element. This is
// used by the IntersectionObserver to track the link's visibility.
const links = typeof WeakMap === 'function' ? new WeakMap() : new Map();
// A Set of the currently visible links. We re-prefetch visible links after a
// cache invalidation, or when the current URL changes. It's a separate data
// structure from the WeakMap above because only the visible links need to
// be enumerated.
const visibleLinks = new Set();
// A single IntersectionObserver instance shared by all <Link> components.
const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(handleIntersect, {
    rootMargin: '200px'
}) : null;
function mountLinkInstance(element, href, router, kind) {
    let prefetchUrl = null;
    try {
        prefetchUrl = (0, _approuter.createPrefetchURL)(href);
        if (prefetchUrl === null) {
            // We only track the link if it's prefetchable. For example, this excludes
            // links to external URLs.
            return;
        }
    } catch (e) {
        // createPrefetchURL sometimes throws an error if an invalid URL is
        // provided, though I'm not sure if it's actually necessary.
        // TODO: Consider removing the throw from the inner function, or change it
        // to reportError. Or maybe the error isn't even necessary for automatic
        // prefetches, just navigations.
        const reportErrorFn = typeof reportError === 'function' ? reportError : console.error;
        reportErrorFn("Cannot prefetch '" + href + "' because it cannot be converted to a URL.");
        return;
    }
    const instance = {
        prefetchHref: prefetchUrl.href,
        router,
        kind,
        isVisible: false,
        wasHoveredOrTouched: false,
        prefetchTask: null,
        cacheVersion: -1
    };
    const existingInstance = links.get(element);
    if (existingInstance !== undefined) {
        // This shouldn't happen because each <Link> component should have its own
        // anchor tag instance, but it's defensive coding to avoid a memory leak in
        // case there's a logical error somewhere else.
        unmountLinkInstance(element);
    }
    links.set(element, instance);
    if (observer !== null) {
        observer.observe(element);
    }
}
function unmountLinkInstance(element) {
    const instance = links.get(element);
    if (instance !== undefined) {
        links.delete(element);
        visibleLinks.delete(instance);
        const prefetchTask = instance.prefetchTask;
        if (prefetchTask !== null) {
            (0, _segmentcache.cancelPrefetchTask)(prefetchTask);
        }
    }
    if (observer !== null) {
        observer.unobserve(element);
    }
}
function handleIntersect(entries) {
    for (const entry of entries){
        // Some extremely old browsers or polyfills don't reliably support
        // isIntersecting so we check intersectionRatio instead. (Do we care? Not
        // really. But whatever this is fine.)
        const isVisible = entry.intersectionRatio > 0;
        onLinkVisibilityChanged(entry.target, isVisible);
    }
}
function onLinkVisibilityChanged(element, isVisible) {
    if (process.env.NODE_ENV !== 'production') {
        // Prefetching on viewport is disabled in development for performance
        // reasons, because it requires compiling the target page.
        // TODO: Investigate re-enabling this.
        return;
    }
    const instance = links.get(element);
    if (instance === undefined) {
        return;
    }
    instance.isVisible = isVisible;
    if (isVisible) {
        visibleLinks.add(instance);
    } else {
        visibleLinks.delete(instance);
    }
    rescheduleLinkPrefetch(instance);
}
function onNavigationIntent(element) {
    const instance = links.get(element);
    if (instance === undefined) {
        return;
    }
    // Prefetch the link on hover/touchstart.
    if (instance !== undefined) {
        instance.wasHoveredOrTouched = true;
        rescheduleLinkPrefetch(instance);
    }
}
function rescheduleLinkPrefetch(instance) {
    const existingPrefetchTask = instance.prefetchTask;
    if (!instance.isVisible) {
        // Cancel any in-progress prefetch task. (If it already finished then this
        // is a no-op.)
        if (existingPrefetchTask !== null) {
            (0, _segmentcache.cancelPrefetchTask)(existingPrefetchTask);
        }
        // We don't need to reset the prefetchTask to null upon cancellation; an
        // old task object can be rescheduled with bumpPrefetchTask. This is a
        // micro-optimization but also makes the code simpler (don't need to
        // worry about whether an old task object is stale).
        return;
    }
    if (!process.env.__NEXT_CLIENT_SEGMENT_CACHE) {
        // The old prefetch implementation does not have different priority levels.
        // Just schedule a new prefetch task.
        prefetchWithOldCacheImplementation(instance);
        return;
    }
    // In the Segment Cache implementation, we assign a higher priority level to
    // links that were at one point hovered or touched. Since the queue is last-
    // in-first-out, the highest priority Link is whichever one was hovered last.
    //
    // We also increase the relative priority of links whenever they re-enter the
    // viewport, as if they were being scheduled for the first time.
    const priority = instance.wasHoveredOrTouched ? _segmentcache.PrefetchPriority.Intent : _segmentcache.PrefetchPriority.Default;
    if (existingPrefetchTask === null) {
        // Initiate a prefetch task.
        const appRouterState = (0, _actionqueue.getCurrentAppRouterState)();
        if (appRouterState !== null) {
            const nextUrl = appRouterState.nextUrl;
            const treeAtTimeOfPrefetch = appRouterState.tree;
            const cacheKey = (0, _segmentcache.createCacheKey)(instance.prefetchHref, nextUrl);
            instance.prefetchTask = (0, _segmentcache.schedulePrefetchTask)(cacheKey, treeAtTimeOfPrefetch, instance.kind === _routerreducertypes.PrefetchKind.FULL, priority);
            instance.cacheVersion = (0, _segmentcache.getCurrentCacheVersion)();
        }
    } else {
        // We already have an old task object that we can reschedule. This is
        // effectively the same as canceling the old task and creating a new one.
        (0, _segmentcache.bumpPrefetchTask)(existingPrefetchTask, priority);
    }
}
function pingVisibleLinks(nextUrl, tree) {
    // For each currently visible link, cancel the existing prefetch task (if it
    // exists) and schedule a new one. This is effectively the same as if all the
    // visible links left and then re-entered the viewport.
    //
    // This is called when the Next-Url or the base tree changes, since those
    // may affect the result of a prefetch task. It's also called after a
    // cache invalidation.
    const currentCacheVersion = (0, _segmentcache.getCurrentCacheVersion)();
    for (const instance of visibleLinks){
        const task = instance.prefetchTask;
        if (task !== null && instance.cacheVersion === currentCacheVersion && task.key.nextUrl === nextUrl && task.treeAtTimeOfPrefetch === tree) {
            continue;
        }
        // Something changed. Cancel the existing prefetch task and schedule a
        // new one.
        if (task !== null) {
            (0, _segmentcache.cancelPrefetchTask)(task);
        }
        const cacheKey = (0, _segmentcache.createCacheKey)(instance.prefetchHref, nextUrl);
        const priority = instance.wasHoveredOrTouched ? _segmentcache.PrefetchPriority.Intent : _segmentcache.PrefetchPriority.Default;
        instance.prefetchTask = (0, _segmentcache.schedulePrefetchTask)(cacheKey, tree, instance.kind === _routerreducertypes.PrefetchKind.FULL, priority);
        instance.cacheVersion = (0, _segmentcache.getCurrentCacheVersion)();
    }
}
function prefetchWithOldCacheImplementation(instance) {
    // This is the path used when the Segment Cache is not enabled.
    if (typeof window === 'undefined') {
        return;
    }
    const doPrefetch = async ()=>{
        // note that `appRouter.prefetch()` is currently sync,
        // so we have to wrap this call in an async function to be able to catch() errors below.
        return instance.router.prefetch(instance.prefetchHref, {
            kind: instance.kind
        });
    };
    // Prefetch the page if asked (only in the client)
    // We need to handle a prefetch error here since we may be
    // loading with priority which can reject but we don't
    // want to force navigation since this is only a prefetch
    doPrefetch().catch((err)=>{
        if (process.env.NODE_ENV !== 'production') {
            // rethrow to show invalid URL errors
            throw err;
        }
    });
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=links.js.map