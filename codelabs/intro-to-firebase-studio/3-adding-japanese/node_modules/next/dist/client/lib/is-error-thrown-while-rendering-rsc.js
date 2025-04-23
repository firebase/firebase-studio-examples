"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "shouldRenderRootLevelErrorOverlay", {
    enumerable: true,
    get: function() {
        return shouldRenderRootLevelErrorOverlay;
    }
});
const shouldRenderRootLevelErrorOverlay = ()=>{
    var _window___next_root_layout_missing_tags;
    return !!((_window___next_root_layout_missing_tags = window.__next_root_layout_missing_tags) == null ? void 0 : _window___next_root_layout_missing_tags.length);
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=is-error-thrown-while-rendering-rsc.js.map