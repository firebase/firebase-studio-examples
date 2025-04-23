"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@genkit-ai/tools-common/server");
const fs_1 = __importDefault(require("fs"));
const manager_utils_1 = require("./manager-utils");
const args = process.argv.slice(2);
const port = parseInt(args[0]) || 4100;
redirectStdoutToFile(args[1]);
async function start() {
    const manager = await (0, manager_utils_1.startManager)(true);
    await (0, server_1.startServer)(manager, port);
}
function redirectStdoutToFile(logFile) {
    var myLogFileStream = fs_1.default.createWriteStream(logFile);
    var originalStdout = process.stdout.write;
    function writeStdout() {
        originalStdout.apply(process.stdout, arguments);
        myLogFileStream.write.apply(myLogFileStream, arguments);
    }
    process.stdout.write = writeStdout;
    process.stderr.write = process.stdout.write;
}
process.on('error', (error) => {
    console.log(`Error in tools process: ${error}`);
});
process.on('uncaughtException', (err, somethingelse) => {
    console.log(`Uncaught error in tools process: ${err} ${somethingelse}`);
});
process.on('unhandledRejection', function (reason, p) {
    console.log(`Unhandled rejection in tools process: ${reason}`);
});
start();
//# sourceMappingURL=server-harness.js.map