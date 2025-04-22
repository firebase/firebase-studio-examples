// we share tags manifest between "use cache" handlers and
// previous file-system-cache
export const tagsManifest = {
    items: {}
};
export const isTagStale = (tags, timestamp)=>{
    for (const tag of tags){
        const tagEntry = tagsManifest.items[tag];
        if (typeof (tagEntry == null ? void 0 : tagEntry.revalidatedAt) === 'number' && // TODO: use performance.now and update file-system-cache?
        tagEntry.revalidatedAt >= timestamp) {
            return true;
        }
    }
    return false;
};

//# sourceMappingURL=tags-manifest.external.js.map