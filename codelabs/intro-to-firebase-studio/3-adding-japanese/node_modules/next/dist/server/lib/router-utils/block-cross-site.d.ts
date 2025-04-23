import type { Duplex } from 'stream';
import type { IncomingMessage, ServerResponse } from 'webpack-dev-server';
export declare const blockCrossSite: (req: IncomingMessage, res: ServerResponse | Duplex, allowedOrigins: string[], activePort: string) => boolean;
