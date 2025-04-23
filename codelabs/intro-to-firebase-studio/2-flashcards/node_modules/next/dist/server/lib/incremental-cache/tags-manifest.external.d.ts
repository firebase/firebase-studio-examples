type TagsManifest = {
    items: {
        [tag: string]: {
            revalidatedAt?: number;
        };
    };
};
export declare const tagsManifest: TagsManifest;
export declare const isTagStale: (tags: string[], timestamp: number) => boolean;
export {};
