import type * as express from 'express';
import { AnyRouter } from '../core';
import { NodeHTTPCreateContextFnOptions, NodeHTTPHandlerOptions } from './node-http';
export type CreateExpressContextOptions = NodeHTTPCreateContextFnOptions<express.Request, express.Response>;
export declare function createExpressMiddleware<TRouter extends AnyRouter>(opts: NodeHTTPHandlerOptions<TRouter, express.Request, express.Response>): express.Handler;
//# sourceMappingURL=express.d.ts.map