import type { CustomRoutes } from '../lib/load-custom-routes';
import type { TurbopackManifestLoader } from '../shared/lib/turbopack/manifest-loader';
import type { TurbopackResult, RawEntrypoints, Entrypoints, PageRoute, AppRoute } from './swc/types';
import { type EntryIssuesMap } from '../shared/lib/turbopack/utils';
export declare function handleEntrypoints({ entrypoints, currentEntrypoints, currentEntryIssues, manifestLoader, productionRewrites, logErrors, }: {
    entrypoints: TurbopackResult<RawEntrypoints>;
    currentEntrypoints: Entrypoints;
    currentEntryIssues: EntryIssuesMap;
    manifestLoader: TurbopackManifestLoader;
    productionRewrites: CustomRoutes['rewrites'] | undefined;
    logErrors: boolean;
}): Promise<void>;
export declare function handlePagesErrorRoute({ currentEntryIssues, entrypoints, manifestLoader, productionRewrites, logErrors, }: {
    currentEntryIssues: EntryIssuesMap;
    entrypoints: Entrypoints;
    manifestLoader: TurbopackManifestLoader;
    productionRewrites: CustomRoutes['rewrites'] | undefined;
    logErrors: boolean;
}): Promise<void>;
export declare function handleRouteType({ page, route, currentEntryIssues, entrypoints, manifestLoader, productionRewrites, logErrors, }: {
    page: string;
    route: PageRoute | AppRoute;
    currentEntryIssues: EntryIssuesMap;
    entrypoints: Entrypoints;
    manifestLoader: TurbopackManifestLoader;
    productionRewrites: CustomRoutes['rewrites'] | undefined;
    logErrors: boolean;
}): Promise<void>;
