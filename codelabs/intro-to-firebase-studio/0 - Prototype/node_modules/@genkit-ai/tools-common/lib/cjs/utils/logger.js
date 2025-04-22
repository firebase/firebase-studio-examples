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
exports.logger = void 0;
const clc = __importStar(require("colorette"));
const winston = __importStar(require("winston"));
exports.logger = winston.createLogger({
    level: process.env.DEBUG ? 'debug' : 'info',
    format: winston.format.printf((log) => {
        if (log.level === 'info')
            return log.message;
        let levelColor;
        switch (log.level) {
            case 'error':
                levelColor = clc.red;
                break;
            case 'warn':
                levelColor = clc.yellow;
                break;
            default:
                levelColor = (text) => text.toString();
                break;
        }
        const level = log.level.charAt(0).toUpperCase() + log.level.slice(1);
        return `${clc.bold(levelColor(level))}: ${log.message}`;
    }),
    transports: [new winston.transports.Console()],
});
//# sourceMappingURL=logger.js.map