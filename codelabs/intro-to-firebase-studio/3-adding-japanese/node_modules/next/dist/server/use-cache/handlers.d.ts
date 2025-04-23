import type { CacheHandler } from '../lib/cache-handlers/types';
/**
 * Initialize the cache handlers.
 * @returns `true` if the cache handlers were initialized, `false` if they were already initialized.
 */
export declare function initializeCacheHandlers(): boolean;
/**
 * Get a cache handler by kind.
 * @param kind - The kind of cache handler to get.
 * @returns The cache handler, or `undefined` if it is not initialized or does not exist.
 */
export declare function getCacheHandler(kind: string): CacheHandler | undefined;
/**
 * Get an iterator over the cache handlers.
 * @returns An iterator over the cache handlers, or `undefined` if they are not initialized.
 */
export declare function getCacheHandlers(): SetIterator<CacheHandler> | undefined;
/**
 * Set a cache handler by kind.
 * @param kind - The kind of cache handler to set.
 * @param cacheHandler - The cache handler to set.
 */
export declare function setCacheHandler(kind: string, cacheHandler: CacheHandler): void;
