"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getImplicitTags", {
    enumerable: true,
    get: function() {
        return getImplicitTags;
    }
});
const _constants = require("../../lib/constants");
const getDerivedTags = (pathname)=>{
    const derivedTags = [
        `/layout`
    ];
    // we automatically add the current path segments as tags
    // for revalidatePath handling
    if (pathname.startsWith('/')) {
        const pathnameParts = pathname.split('/');
        for(let i = 1; i < pathnameParts.length + 1; i++){
            let curPathname = pathnameParts.slice(0, i).join('/');
            if (curPathname) {
                // all derived tags other than the page are layout tags
                if (!curPathname.endsWith('/page') && !curPathname.endsWith('/route')) {
                    curPathname = `${curPathname}${!curPathname.endsWith('/') ? '/' : ''}layout`;
                }
                derivedTags.push(curPathname);
            }
        }
    }
    return derivedTags;
};
function getImplicitTags(page, url, fallbackRouteParams) {
    // TODO: Cache the result
    const newTags = [];
    const hasFallbackRouteParams = fallbackRouteParams && fallbackRouteParams.size > 0;
    // Add the derived tags from the page.
    const derivedTags = getDerivedTags(page);
    for (let tag of derivedTags){
        tag = `${_constants.NEXT_CACHE_IMPLICIT_TAG_ID}${tag}`;
        newTags.push(tag);
    }
    // Add the tags from the pathname. If the route has unknown params, we don't
    // want to add the pathname as a tag, as it will be invalid.
    if (url.pathname && !hasFallbackRouteParams) {
        const tag = `${_constants.NEXT_CACHE_IMPLICIT_TAG_ID}${url.pathname}`;
        newTags.push(tag);
    }
    return newTags;
}

//# sourceMappingURL=implicit-tags.js.map