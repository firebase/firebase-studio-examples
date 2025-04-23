"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RootLayoutMissingTagsError", {
    enumerable: true,
    get: function() {
        return RootLayoutMissingTagsError;
    }
});
const _jsxruntime = require("react/jsx-runtime");
const _react = require("react");
const _hotlinkedtext = require("../components/hot-linked-text");
const _erroroverlaylayout = require("../components/errors/error-overlay-layout/error-overlay-layout");
function RootLayoutMissingTagsError(param) {
    let { missingTags, ...props } = param;
    const noop = (0, _react.useCallback)(()=>{}, []);
    const error = Object.defineProperty(new Error("The following tags are missing in the Root Layout: " + missingTags.map((tagName)=>"<" + tagName + ">").join(', ') + ".\nRead more at https://nextjs.org/docs/messages/missing-root-layout-tags"), "__NEXT_ERROR_CODE", {
        value: "E638",
        enumerable: false,
        configurable: true
    });
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_erroroverlaylayout.ErrorOverlayLayout, {
        errorType: "Missing Required HTML Tag",
        error: error,
        errorMessage: /*#__PURE__*/ (0, _jsxruntime.jsx)(_hotlinkedtext.HotlinkedText, {
            text: error.message
        }),
        onClose: noop,
        ...props
    });
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=root-layout-missing-tags-error.js.map