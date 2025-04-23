// To distinguish from React error.digest, we use a different symbol here to determine if the error is from console.error or unhandled promise rejection.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createUnhandledError: null,
    getUnhandledErrorType: null,
    isUnhandledConsoleOrRejection: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createUnhandledError: function() {
        return createUnhandledError;
    },
    getUnhandledErrorType: function() {
        return getUnhandledErrorType;
    },
    isUnhandledConsoleOrRejection: function() {
        return isUnhandledConsoleOrRejection;
    }
});
const digestSym = Symbol.for('next.console.error.digest');
const consoleTypeSym = Symbol.for('next.console.error.type');
function createUnhandledError(message, environmentName) {
    const error = typeof message === 'string' ? Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    }) : message;
    error[digestSym] = 'NEXT_UNHANDLED_ERROR';
    error[consoleTypeSym] = typeof message === 'string' ? 'string' : 'error';
    if (environmentName && !error.environmentName) {
        error.environmentName = environmentName;
    }
    return error;
}
const isUnhandledConsoleOrRejection = (error)=>{
    return error && error[digestSym] === 'NEXT_UNHANDLED_ERROR';
};
const getUnhandledErrorType = (error)=>{
    return error[consoleTypeSym];
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=console-error.js.map