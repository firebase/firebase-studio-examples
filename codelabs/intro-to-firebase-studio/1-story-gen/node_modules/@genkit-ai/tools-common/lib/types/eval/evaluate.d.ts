import { RuntimeManager } from '../manager/manager';
import { Action, Dataset, EvalInput, EvalKeyAugments, EvalRun, EvalRunKey, RunNewEvaluationRequest } from '../types';
export declare function runNewEvaluation(manager: RuntimeManager, request: RunNewEvaluationRequest): Promise<EvalRunKey>;
export declare function runInference(params: {
    manager: RuntimeManager;
    actionRef: string;
    inferenceDataset: Dataset;
    context?: string;
    actionConfig?: any;
}): Promise<EvalInput[]>;
export declare function runEvaluation(params: {
    manager: RuntimeManager;
    evaluatorActions: Action[];
    evalDataset: EvalInput[];
    augments?: EvalKeyAugments;
}): Promise<EvalRun>;
export declare function getAllEvaluatorActions(manager: RuntimeManager): Promise<Action[]>;
export declare function getMatchingEvaluatorActions(manager: RuntimeManager, evaluators?: string[]): Promise<Action[]>;
