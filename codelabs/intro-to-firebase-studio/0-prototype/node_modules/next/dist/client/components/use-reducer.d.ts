import type { Dispatch } from 'react';
import type { AppRouterActionQueue } from '../../shared/lib/router/action-queue';
import type { AppRouterState, ReducerActions, ReducerState } from './router-reducer/router-reducer-types';
export declare function useUnwrapState(state: ReducerState): AppRouterState;
export declare function useReducer(actionQueue: AppRouterActionQueue): [ReducerState, Dispatch<ReducerActions>];
