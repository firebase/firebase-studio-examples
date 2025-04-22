"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DIALOG_STYLES: null,
    ErrorOverlayDialog: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DIALOG_STYLES: function() {
        return DIALOG_STYLES;
    },
    ErrorOverlayDialog: function() {
        return ErrorOverlayDialog;
    }
});
const _jsxruntime = require("react/jsx-runtime");
const _dialog = require("../../dialog/dialog");
function ErrorOverlayDialog(param) {
    let { children, onClose, ...props } = param;
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_dialog.Dialog, {
        type: "error",
        "aria-labelledby": "nextjs__container_errors_label",
        "aria-describedby": "nextjs__container_errors_desc",
        onClose: onClose,
        className: "error-overlay-dialog",
        ...props,
        children: children
    });
}
const DIALOG_STYLES = "\n  .error-overlay-dialog {\n    overflow-y: auto;\n    -webkit-font-smoothing: antialiased;\n    background: var(--color-background-100);\n    background-clip: padding-box;\n    border: 1px solid var(--color-gray-400);\n    border-radius: var(--rounded-xl);\n    box-shadow: var(--shadow-menu);\n    position: relative;\n\n    &:has(\n        ~ [data-nextjs-error-overlay-nav] .error-overlay-notch[data-side='left']\n      ) {\n      border-top-left-radius: 0;\n    }\n\n    &:has(\n        ~ [data-nextjs-error-overlay-nav]\n          .error-overlay-notch[data-side='right']\n      ) {\n      border-top-right-radius: 0;\n    }\n  }\n";

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=dialog.js.map