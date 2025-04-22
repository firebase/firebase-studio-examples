import { n as nodeHTTPRequestHandler } from '../nodeHTTPRequestHandler-f5efadf5.mjs';
import '../index-f91d720c.mjs';
import '../codes-c924c3db.mjs';
import '../resolveHTTPResponse-37afa02e.mjs';
import '../config-e3143f14.mjs';
import '../TRPCError-7e8e2a1b.mjs';
import '../getCauseFromUnknown-2d66414a.mjs';
import '../transformTRPCResponse-1153b421.mjs';
import '../contentType-31223e57.mjs';
import '../batchStreamFormatter-fc1ffb26.mjs';
import './node-http/content-type/json/index.mjs';
import '../contentType-3194ed5f.mjs';

function createExpressMiddleware(opts) {
    return async (req, res)=>{
        const endpoint = req.path.slice(1);
        await nodeHTTPRequestHandler({
            // FIXME: no typecasting should be needed here
            ...opts,
            req,
            res,
            path: endpoint
        });
    };
}

export { createExpressMiddleware };
