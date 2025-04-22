"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeEvent = exports.GenkitToolsError = void 0;
class GenkitToolsError extends Error {
    data;
    constructor(msg, options) {
        super(msg, options);
    }
}
exports.GenkitToolsError = GenkitToolsError;
var RuntimeEvent;
(function (RuntimeEvent) {
    RuntimeEvent["ADD"] = "add";
    RuntimeEvent["REMOVE"] = "remove";
})(RuntimeEvent || (exports.RuntimeEvent = RuntimeEvent = {}));
//# sourceMappingURL=types.js.map