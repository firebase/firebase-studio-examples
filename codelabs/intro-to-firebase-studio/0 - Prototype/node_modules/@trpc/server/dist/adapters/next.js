'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var TRPCError = require('../TRPCError-0b220715.js');
var transformTRPCResponse = require('../transformTRPCResponse-e65f34e9.js');
var nodeHTTPRequestHandler = require('../nodeHTTPRequestHandler-60853005.js');
require('../getCauseFromUnknown-d535264a.js');
require('../index-784ff647.js');
require('../codes-87f6824b.js');
require('../resolveHTTPResponse-b2ba9325.js');
require('../config-930036df.js');
require('../contentType-a229790b.js');
require('../batchStreamFormatter-93cdcdd4.js');
require('./node-http/content-type/json/index.js');
require('../contentType-8c16408e.js');

function createNextApiHandler(opts) {
    return async (req, res)=>{
        function getPath() {
            if (typeof req.query.trpc === 'string') {
                return req.query.trpc;
            }
            if (Array.isArray(req.query.trpc)) {
                return req.query.trpc.join('/');
            }
            return null;
        }
        const path = getPath();
        if (path === null) {
            const error = transformTRPCResponse.getErrorShape({
                config: opts.router._def._config,
                error: new TRPCError.TRPCError({
                    message: 'Query "trpc" not found - is the file named `[trpc]`.ts or `[...trpc].ts`?',
                    code: 'INTERNAL_SERVER_ERROR'
                }),
                type: 'unknown',
                ctx: undefined,
                path: undefined,
                input: undefined
            });
            res.statusCode = 500;
            res.json({
                id: -1,
                error
            });
            return;
        }
        await nodeHTTPRequestHandler.nodeHTTPRequestHandler({
            // FIXME: no typecasting should be needed here
            ...opts,
            req,
            res,
            path
        });
    };
}

exports.createNextApiHandler = createNextApiHandler;
