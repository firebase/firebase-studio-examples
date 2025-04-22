'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var http = require('node:http');
var nodeHTTPRequestHandler = require('../nodeHTTPRequestHandler-60853005.js');
require('../index-784ff647.js');
require('../codes-87f6824b.js');
require('../resolveHTTPResponse-b2ba9325.js');
require('../config-930036df.js');
require('../TRPCError-0b220715.js');
require('../getCauseFromUnknown-d535264a.js');
require('../transformTRPCResponse-e65f34e9.js');
require('../contentType-a229790b.js');
require('../batchStreamFormatter-93cdcdd4.js');
require('./node-http/content-type/json/index.js');
require('../contentType-8c16408e.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var http__default = /*#__PURE__*/_interopDefaultLegacy(http);

function createHTTPHandler(opts) {
    return async (req, res)=>{
        // if no hostname, set a dummy one
        const href = req.url.startsWith('/') ? `http://127.0.0.1${req.url}` : req.url;
        // get procedure path and remove the leading slash
        // /procedure -> procedure
        const path = new URL(href).pathname.slice(1);
        await nodeHTTPRequestHandler.nodeHTTPRequestHandler({
            // FIXME: no typecasting should be needed here
            ...opts,
            req,
            res,
            path
        });
    };
}
function createHTTPServer(opts) {
    const handler = createHTTPHandler(opts);
    const server = http__default["default"].createServer((req, res)=>handler(req, res));
    return {
        server,
        listen: (port, hostname)=>{
            server.listen(port, hostname);
            const actualPort = port === 0 ? server.address().port : port;
            return {
                port: actualPort
            };
        }
    };
}

exports.createHTTPHandler = createHTTPHandler;
exports.createHTTPServer = createHTTPServer;
