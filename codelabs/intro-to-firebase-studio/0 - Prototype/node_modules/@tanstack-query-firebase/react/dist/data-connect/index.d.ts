import * as _tanstack_react_query from '@tanstack/react-query';
import { FetchQueryOptions, QueryKey, QueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { FirebaseError } from 'firebase/app';
import { QueryResult, MutationResult, QueryRef, CallerSdkType, MutationRef, DataConnect } from 'firebase/data-connect';

type FlattenedQueryResult<Data, Variables> = Omit<QueryResult<Data, Variables>, "data" | "toJSON"> & Data;
type FlattenedMutationResult<Data, Variables> = Omit<MutationResult<Data, Variables>, "data" | "toJSON"> & Data;

type DataConnectQueryOptions<Data, Variables> = Omit<FetchQueryOptions<FlattenedQueryResult<Data, Variables>, FirebaseError, FlattenedQueryResult<Data, Variables>, QueryKey>, "queryFn" | "queryKey"> & {
    queryRef: QueryRef<Data, Variables>;
    queryKey?: QueryKey;
};
declare class DataConnectQueryClient extends QueryClient {
    prefetchDataConnectQuery<Data extends Record<string, any>, Variables>(refOrResult: QueryRef<Data, Variables> | QueryResult<Data, Variables>, options?: DataConnectQueryOptions<Data, Variables>): Promise<void>;
}

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type useDataConnectQueryOptions<TData = unknown, TError = FirebaseError> = PartialBy<Omit<UseQueryOptions<TData, TError>, "queryFn">, "queryKey">;
declare function useDataConnectQuery<Data = unknown, Variables = unknown>(refOrResult: QueryRef<Data, Variables> | QueryResult<Data, Variables>, options?: useDataConnectQueryOptions<FlattenedQueryResult<Data, Variables>, FirebaseError>, _callerSdkType?: CallerSdkType): _tanstack_react_query.UseQueryResult<FlattenedQueryResult<Data, Variables>, FirebaseError>;

type useDataConnectMutationOptions<TData = unknown, TError = FirebaseError, Variables = unknown> = Omit<UseMutationOptions<TData, TError, Variables>, "mutationFn"> & {
    invalidate?: ReadonlyArray<QueryRef<unknown, unknown> | (() => QueryRef<unknown, unknown>)>;
};
declare function useDataConnectMutation<Fn extends (() => MutationRef<any, any>) | ((vars: any) => MutationRef<any, any>), Data = ReturnType<Fn extends (() => MutationRef<infer D, any>) ? () => MutationRef<D, any> : Fn extends (vars: any) => MutationRef<infer D, any> ? (vars: any) => MutationRef<D, any> : Fn> extends MutationRef<infer D, any> ? D : never, Variables = Fn extends () => MutationRef<any, any> ? void : Fn extends (vars: infer V) => MutationRef<any, any> ? V : Fn extends (dc: DataConnect, vars: infer V) => MutationRef<any, any> ? V : never>(ref: Fn, options?: useDataConnectMutationOptions<FlattenedMutationResult<Data, Variables>, FirebaseError, Variables>, _callerSdkType?: CallerSdkType): _tanstack_react_query.UseMutationResult<FlattenedMutationResult<Data, Variables>, FirebaseError, Variables, unknown>;

export { DataConnectQueryClient, type DataConnectQueryOptions, type FlattenedMutationResult, type FlattenedQueryResult, useDataConnectMutation, type useDataConnectMutationOptions, useDataConnectQuery, type useDataConnectQueryOptions };
