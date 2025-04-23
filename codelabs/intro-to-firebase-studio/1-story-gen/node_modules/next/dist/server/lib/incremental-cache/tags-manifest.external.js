"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    isTagStale: null,
    tagsManifest: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    isTagStale: function() {
        return isTagStale;
    },
    tagsManifest: function() {
        return tagsManifest;
    }
});
const tagsManifest = {
    items: {}
};
const isTagStale = (tags, timestamp)=>{
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