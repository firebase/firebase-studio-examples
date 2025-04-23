import { DatasetStore, EvalStore } from '../types/eval';
export { InferenceDataset, InferenceDatasetSchema } from '../types/eval';
export * from './evaluate';
export * from './exporter';
export * from './parser';
export * from './validate';
export declare function getEvalStore(): EvalStore;
export declare function getDatasetStore(): DatasetStore;
