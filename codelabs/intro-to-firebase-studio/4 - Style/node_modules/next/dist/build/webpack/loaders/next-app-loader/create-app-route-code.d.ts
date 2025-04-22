import type { NextConfig } from '../../../../server/config-shared';
import type { PageExtensions } from '../../../page-extensions-type';
export declare function createAppRouteCode({ name, page, pagePath, resolveAppRoute, pageExtensions, nextConfigOutput, }: {
    name: string;
    page: string;
    pagePath: string;
    resolveAppRoute: (pathname: string) => Promise<string | undefined> | string | undefined;
    pageExtensions: PageExtensions;
    nextConfigOutput: NextConfig['output'];
}): Promise<string>;
