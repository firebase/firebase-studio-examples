"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createRootLevelDevOverlayElement", {
    enumerable: true,
    get: function() {
        return createRootLevelDevOverlayElement;
    }
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _jsxruntime = require("react/jsx-runtime");
const _react = /*#__PURE__*/ _interop_require_default._(require("react"));
const _appdevoverlay = require("./app-dev-overlay");
const _getsocketurl = require("../utils/get-socket-url");
const _shared = require("../shared");
const _hotreloadertypes = require("../../../../server/dev/hot-reloader-types");
const _errorboundary = /*#__PURE__*/ _interop_require_default._(require("../../error-boundary"));
function createRootLevelDevOverlayElement(reactEl) {
    const rootLayoutMissingTags = window.__next_root_layout_missing_tags;
    const hasMissingTags = !!(rootLayoutMissingTags == null ? void 0 : rootLayoutMissingTags.length);
    const socketUrl = (0, _getsocketurl.getSocketUrl)(process.env.__NEXT_ASSET_PREFIX || '');
    const socket = new window.WebSocket("" + socketUrl + "/_next/webpack-hmr");
    // add minimal "hot reload" support for RSC errors
    const handler = (event)=>{
        let obj;
        try {
            obj = JSON.parse(event.data);
        } catch (e) {}
        if (!obj || !('action' in obj)) {
            return;
        }
        if (obj.action === _hotreloadertypes.HMR_ACTIONS_SENT_TO_BROWSER.SERVER_COMPONENT_CHANGES) {
            window.location.reload();
        }
    };
    socket.addEventListener('message', handler);
    const FallbackLayout = hasMissingTags ? (param)=>{
        let { children } = param;
        return /*#__PURE__*/ (0, _jsxruntime.jsx)("html", {
            id: "__next_error__",
            children: /*#__PURE__*/ (0, _jsxruntime.jsx)("body", {
                children: children
            })
        });
    } : _react.default.Fragment;
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(FallbackLayout, {
        children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_appdevoverlay.AppDevOverlay, {
            state: {
                ..._shared.INITIAL_OVERLAY_STATE,
                rootLayoutMissingTags,
                routerType: 'app'
            },
            globalError: [
                _errorboundary.default,
                null
            ],
            children: reactEl
        })
    });
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=client-entry.js.map