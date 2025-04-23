import { EvalRun } from '../types/eval';
export interface EvalExporter {
    (evalRun: EvalRun, filePath: string): Promise<void>;
}
export declare function toCsv(evalRun: EvalRun, filePath: string): Promise<void>;
export declare function toJson(evalRun: EvalRun, filePath: string): Promise<void>;
export declare function getExporterForString(outputFormat: string): EvalExporter;
