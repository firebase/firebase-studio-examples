'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

function createExpressMiddleware(opts) {
    return async (req, res)=>{
        const endpoint = req.path.slice(1);
        await nodeHTTPRequestHandler.nodeHTTPRequestHandler({
            // FIXME: no typecasting should be needed here
            ...opts,
            req,
            res,
            path: endpoint
        });
    };
}

exports.createExpressMiddleware = createExpressMiddleware;
