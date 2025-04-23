import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { FastifyHandlerOptions } from '.';
import { AnyRouter } from '../../core';
import { NodeHTTPCreateContextFnOptions } from '../node-http';
export interface FastifyTRPCPluginOptions<TRouter extends AnyRouter> {
    prefix?: string;
    useWSS?: boolean;
    trpcOptions: FastifyHandlerOptions<TRouter, FastifyRequest, FastifyReply>;
}
export type CreateFastifyContextOptions = NodeHTTPCreateContextFnOptions<FastifyRequest, FastifyReply>;
export declare function fastifyTRPCPlugin<TRouter extends AnyRouter>(fastify: FastifyInstance, opts: FastifyTRPCPluginOptions<TRouter>, done: (err?: Error) => void): void;
//# sourceMappingURL=fastifyTRPCPlugin.d.ts.map