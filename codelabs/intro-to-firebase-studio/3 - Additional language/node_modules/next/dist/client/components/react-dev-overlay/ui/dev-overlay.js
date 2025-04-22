"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DevOverlay", {
    enumerable: true,
    get: function() {
        return DevOverlay;
    }
});
const _jsxruntime = require("react/jsx-runtime");
const _shadowportal = require("./components/shadow-portal");
const _base = require("./styles/base");
const _componentstyles = require("./styles/component-styles");
const _cssreset = require("./styles/css-reset");
const _colors = require("./styles/colors");
const _erroroverlay = require("./components/errors/error-overlay/error-overlay");
const _devtoolsindicator = require("./components/errors/dev-tools-indicator/dev-tools-indicator");
const _rendererror = require("./container/runtime-error/render-error");
const _darktheme = require("./styles/dark-theme");
function DevOverlay(param) {
    let { state, isErrorOverlayOpen, setIsErrorOverlayOpen } = param;
    return /*#__PURE__*/ (0, _jsxruntime.jsxs)(_shadowportal.ShadowPortal, {
        children: [
            /*#__PURE__*/ (0, _jsxruntime.jsx)(_cssreset.CssReset, {}),
            /*#__PURE__*/ (0, _jsxruntime.jsx)(_base.Base, {}),
            /*#__PURE__*/ (0, _jsxruntime.jsx)(_colors.Colors, {}),
            /*#__PURE__*/ (0, _jsxruntime.jsx)(_componentstyles.ComponentStyles, {}),
            /*#__PURE__*/ (0, _jsxruntime.jsx)(_darktheme.DarkTheme, {}),
            /*#__PURE__*/ (0, _jsxruntime.jsx)(_rendererror.RenderError, {
                state: state,
                isAppDir: true,
                children: (param)=>{
                    let { runtimeErrors, totalErrorCount } = param;
                    const isBuildError = runtimeErrors.length === 0;
                    return /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
                        children: [
                            /*#__PURE__*/ (0, _jsxruntime.jsx)(_devtoolsindicator.DevToolsIndicator, {
                                state: state,
                                errorCount: totalErrorCount,
                                isBuildError: isBuildError,
                                setIsErrorOverlayOpen: setIsErrorOverlayOpen
                            }),
                            /*#__PURE__*/ (0, _jsxruntime.jsx)(_erroroverlay.ErrorOverlay, {
                                state: state,
                                runtimeErrors: runtimeErrors,
                                isErrorOverlayOpen: isErrorOverlayOpen,
                                setIsErrorOverlayOpen: setIsErrorOverlayOpen
                            })
                        ]
                    });
                }
            })
        ]
    });
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=dev-overlay.js.map