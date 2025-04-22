import type { WorkStore } from '../app-render/work-async-storage.external';
/** Run a callback, and execute any *new* revalidations added during its runtime. */
export declare function withExecuteRevalidates<T>(store: WorkStore | undefined, callback: () => Promise<T>): Promise<T>;
