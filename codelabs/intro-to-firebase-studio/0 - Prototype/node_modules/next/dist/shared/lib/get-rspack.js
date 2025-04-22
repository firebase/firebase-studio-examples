"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getRspackCore: null,
    getRspackReactRefresh: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getRspackCore: function() {
        return getRspackCore;
    },
    getRspackReactRefresh: function() {
        return getRspackReactRefresh;
    }
});
const _canaryonly = require("./canary-only");
function getRspackCore() {
    gateCanary();
    try {
        // eslint-disable-next-line import/no-extraneous-dependencies
        return require('@rspack/core');
    } catch (e) {
        if (e instanceof Error && 'code' in e && e.code === 'MODULE_NOT_FOUND') {
            throw Object.defineProperty(new Error('@rspack/core is not available. Please make sure `@next/plugin-rspack` is correctly installed.'), "__NEXT_ERROR_CODE", {
                value: "E647",
                enumerable: false,
                configurable: true
            });
        }
        throw e;
    }
}
function getRspackReactRefresh() {
    gateCanary();
    try {
        // eslint-disable-next-line import/no-extraneous-dependencies
        return require('@rspack/plugin-react-refresh');
    } catch (e) {
        if (e instanceof Error && 'code' in e && e.code === 'MODULE_NOT_FOUND') {
            throw Object.defineProperty(new Error('@rspack/plugin-react-refresh is not available. Please make sure `@next/plugin-rspack` is correctly installed.'), "__NEXT_ERROR_CODE", {
                value: "E648",
                enumerable: false,
                configurable: true
            });
        }
        throw e;
    }
}
function gateCanary() {
    if ((0, _canaryonly.isStableBuild)()) {
        throw Object.defineProperty(new _canaryonly.CanaryOnlyError('Rspack support is only available in Next.js canary.'), "__NEXT_ERROR_CODE", {
            value: "E660",
            enumerable: false,
            configurable: true
        });
    }
}

//# sourceMappingURL=get-rspack.js.map