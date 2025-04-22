export class GenkitToolsError extends Error {
    data;
    constructor(msg, options) {
        super(msg, options);
    }
}
export var RuntimeEvent;
(function (RuntimeEvent) {
    RuntimeEvent["ADD"] = "add";
    RuntimeEvent["REMOVE"] = "remove";
})(RuntimeEvent || (RuntimeEvent = {}));
//# sourceMappingURL=types.js.map