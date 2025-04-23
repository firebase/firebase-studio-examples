export interface CacheEntry {
    /**
     * The ReadableStream can error and only have partial
     * data so any cache handlers need to handle this case
     * and decide to keep the partial cache around or not
     */
    value: ReadableStream<Uint8Array>;
    /**
     * The tags configured for the entry excluding soft tags
     */
    tags: string[];
    /**
     * This is for the client not used to calculate cache entry expiration
     */
    stale: number;
    /**
     * When the cache entry was created
     */
    timestamp: number;
    /**
     * How long the entry can last (should be longer than revalidate)
     */
    expire: number;
    /**
     * How long until the entry should revalidate
     */
    revalidate: number;
}
export interface CacheHandler {
    get(cacheKey: string, softTags: string[]): Promise<undefined | CacheEntry>;
    set(cacheKey: string, entry: Promise<CacheEntry>): Promise<void>;
    expireTags(...tags: string[]): Promise<void>;
    receiveExpiredTags(...tags: string[]): Promise<void>;
}
