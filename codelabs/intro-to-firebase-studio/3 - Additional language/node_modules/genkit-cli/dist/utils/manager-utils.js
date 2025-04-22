"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWithManager = exports.startManager = exports.resolveTelemetryServer = void 0;
const telemetry_server_1 = require("@genkit-ai/telemetry-server");
const manager_1 = require("@genkit-ai/tools-common/manager");
const utils_1 = require("@genkit-ai/tools-common/utils");
const get_port_1 = __importStar(require("get-port"));
async function resolveTelemetryServer() {
    let telemetryServerUrl = process.env.GENKIT_TELEMETRY_SERVER;
    if (!telemetryServerUrl) {
        const telemetryPort = await (0, get_port_1.default)({ port: (0, get_port_1.makeRange)(4033, 4999) });
        telemetryServerUrl = `http://localhost:${telemetryPort}`;
        (0, telemetry_server_1.startTelemetryServer)({
            port: telemetryPort,
            traceStore: new telemetry_server_1.LocalFileTraceStore(),
        });
    }
    return telemetryServerUrl;
}
exports.resolveTelemetryServer = resolveTelemetryServer;
async function startManager(manageHealth) {
    const telemetryServerUrl = await resolveTelemetryServer();
    const manager = manager_1.RuntimeManager.create({ telemetryServerUrl, manageHealth });
    return manager;
}
exports.startManager = startManager;
async function runWithManager(fn) {
    let manager;
    try {
        manager = await startManager(false);
    }
    catch (e) {
        process.exit(1);
    }
    try {
        await fn(manager);
    }
    catch (err) {
        utils_1.logger.info('Command exited with an Error:');
        const error = err;
        if (typeof error.data === 'object') {
            const errorStatus = error.data;
            const { code, details, message } = errorStatus;
            utils_1.logger.info(`\tCode: ${code}`);
            utils_1.logger.info(`\tMessage: ${message}`);
            utils_1.logger.info(`\tTrace: http://localhost:4200/traces/${details.traceId}\n`);
        }
        else {
            utils_1.logger.info(`\tMessage: ${error.data}\n`);
        }
        utils_1.logger.error('Stack trace:');
        utils_1.logger.error(`${error.stack}`);
    }
}
exports.runWithManager = runWithManager;
//# sourceMappingURL=manager-utils.js.map