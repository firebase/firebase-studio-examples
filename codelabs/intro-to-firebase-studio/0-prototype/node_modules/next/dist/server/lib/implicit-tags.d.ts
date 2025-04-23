import type { FallbackRouteParams } from '../request/fallback-params';
export declare function getImplicitTags(page: string, url: {
    pathname: string;
    search?: string;
}, fallbackRouteParams: null | FallbackRouteParams): string[];
