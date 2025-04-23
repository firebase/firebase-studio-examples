"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useSyncDevRenderIndicatorInternal", {
    enumerable: true,
    get: function() {
        return useSyncDevRenderIndicatorInternal;
    }
});
const _react = require("react");
const _devrenderindicator = require("./dev-render-indicator");
const useSyncDevRenderIndicatorInternal = ()=>{
    const [isPending, startTransition] = (0, _react.useTransition)();
    (0, _react.useEffect)(()=>{
        if (isPending) {
            _devrenderindicator.devRenderIndicator.show();
        } else {
            _devrenderindicator.devRenderIndicator.hide();
        }
    }, [
        isPending
    ]);
    return startTransition;
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=use-sync-dev-render-indicator-internal.js.map