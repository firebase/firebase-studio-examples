import { T as TRPCError } from '../TRPCError-7e8e2a1b.mjs';
import { g as getErrorShape } from '../transformTRPCResponse-1153b421.mjs';
import { n as nodeHTTPRequestHandler } from '../nodeHTTPRequestHandler-f5efadf5.mjs';
import '../getCauseFromUnknown-2d66414a.mjs';
import '../index-f91d720c.mjs';
import '../codes-c924c3db.mjs';
import '../resolveHTTPResponse-37afa02e.mjs';
import '../config-e3143f14.mjs';
import '../contentType-31223e57.mjs';
import '../batchStreamFormatter-fc1ffb26.mjs';
import './node-http/content-type/json/index.mjs';
import '../contentType-3194ed5f.mjs';

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
            const error = getErrorShape({
                config: opts.router._def._config,
                error: new TRPCError({
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
        await nodeHTTPRequestHandler({
            // FIXME: no typecasting should be needed here
            ...opts,
            req,
            res,
            path
        });
    };
}

export { createNextApiHandler };
