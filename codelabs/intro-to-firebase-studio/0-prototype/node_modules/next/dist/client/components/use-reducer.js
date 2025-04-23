"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    useReducer: null,
    useUnwrapState: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    useReducer: function() {
        return useReducer;
    },
    useUnwrapState: function() {
        return useUnwrapState;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _react = /*#__PURE__*/ _interop_require_wildcard._(require("react"));
const _isthenable = require("../../shared/lib/is-thenable");
const _usesyncdevrenderindicator = require("./react-dev-overlay/utils/dev-indicator/use-sync-dev-render-indicator");
function useUnwrapState(state) {
    // reducer actions can be async, so sometimes we need to suspend until the state is resolved
    if ((0, _isthenable.isThenable)(state)) {
        const result = (0, _react.use)(state);
        return result;
    }
    return state;
}
function useReducer(actionQueue) {
    const [state, setState] = _react.default.useState(actionQueue.state);
    const syncDevRenderIndicator = (0, _usesyncdevrenderindicator.useSyncDevRenderIndicator)();
    const dispatch = (0, _react.useCallback)((action)=>{
        syncDevRenderIndicator(()=>{
            actionQueue.dispatch(action, setState);
        });
    }, [
        actionQueue,
        syncDevRenderIndicator
    ]);
    return [
        state,
        dispatch
    ];
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=use-reducer.js.map