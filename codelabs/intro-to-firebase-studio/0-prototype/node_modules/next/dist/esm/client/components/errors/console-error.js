// To distinguish from React error.digest, we use a different symbol here to determine if the error is from console.error or unhandled promise rejection.
const digestSym = Symbol.for('next.console.error.digest');
const consoleTypeSym = Symbol.for('next.console.error.type');
export function createUnhandledError(message, environmentName) {
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
export const isUnhandledConsoleOrRejection = (error)=>{
    return error && error[digestSym] === 'NEXT_UNHANDLED_ERROR';
};
export const getUnhandledErrorType = (error)=>{
    return error[consoleTypeSym];
};

//# sourceMappingURL=console-error.js.map