import * as _tanstack_react_query from '@tanstack/react-query';
import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { Firestore, FirestoreError, Transaction, TransactionOptions, WriteBatch, DocumentData, DocumentReference, DocumentSnapshot, Query, QuerySnapshot, AggregateSpec, AggregateQuerySnapshot, AggregateField } from 'firebase/firestore';

type UseFirestoreMutationOptions<TData = unknown, TError = Error> = Omit<UseMutationOptions<TData, TError, void>, "mutationFn">;
declare function useClearIndexedDbPersistenceMutation(firestore: Firestore, options?: UseFirestoreMutationOptions<void, FirestoreError>): _tanstack_react_query.UseMutationResult<void, FirestoreError, void, unknown>;

type FirestoreUseMutationOptions$4<TData = unknown, TError = Error> = Omit<UseMutationOptions<TData, TError, void>, "mutationFn">;
declare function useDisableNetworkMutation(firestore: Firestore, options?: FirestoreUseMutationOptions$4<void, FirestoreError>): _tanstack_react_query.UseMutationResult<void, FirestoreError, void, unknown>;

type FirestoreUseMutationOptions$3<TData = unknown, TError = Error> = Omit<UseMutationOptions<TData, TError, void>, "mutationFn">;
declare function useEnableNetworkMutation(firestore: Firestore, options?: FirestoreUseMutationOptions$3<void, FirestoreError>): _tanstack_react_query.UseMutationResult<void, FirestoreError, void, unknown>;

type FirestoreUseQueryOptions$5<TData = unknown, TError = Error> = Omit<UseQueryOptions<TData, TError, void>, "queryFn">;
declare function useWaitForPendingWritesQuery(firestore: Firestore, options: FirestoreUseQueryOptions$5<void, FirestoreError>): _tanstack_react_query.UseQueryResult<void, FirestoreError>;

type RunTransactionFunction<T> = (transaction: Transaction) => Promise<T>;
type FirestoreUseMutationOptions$2<TData = unknown, TError = Error> = Omit<UseMutationOptions<TData, TError, void>, "mutationFn"> & {
    firestore?: TransactionOptions;
};
declare function useRunTransactionMutation<T>(firestore: Firestore, updateFunction: RunTransactionFunction<T>, options?: FirestoreUseMutationOptions$2<T>): _tanstack_react_query.UseMutationResult<T, FirestoreError, void, unknown>;

type FirestoreUseMutationOptions$1<TError = Error> = Omit<UseMutationOptions<void, TError, WriteBatch>, "mutationFn">;
declare function useWriteBatchCommitMutation(options?: FirestoreUseMutationOptions$1<FirestoreError>): _tanstack_react_query.UseMutationResult<void, FirestoreError, WriteBatch, unknown>;

type FirestoreUseQueryOptions$4<TData = unknown, TError = Error> = Omit<UseQueryOptions<TData, TError>, "queryFn"> & {
    firestore?: {
        source?: "server" | "cache";
    };
};
declare function useDocumentQuery<FromFirestore extends DocumentData = DocumentData, ToFirestore extends DocumentData = DocumentData>(documentRef: DocumentReference<FromFirestore, ToFirestore>, options: FirestoreUseQueryOptions$4<DocumentSnapshot<FromFirestore, ToFirestore>, FirestoreError>): _tanstack_react_query.UseQueryResult<DocumentSnapshot<FromFirestore, ToFirestore>, FirestoreError>;

type FirestoreUseQueryOptions$3<TData = unknown, TError = Error> = Omit<UseQueryOptions<TData, TError>, "queryFn"> & {
    firestore?: {
        source?: "server" | "cache";
    };
};
declare function useCollectionQuery<FromFirestore extends DocumentData = DocumentData, ToFirestore extends DocumentData = DocumentData>(query: Query<FromFirestore, ToFirestore>, options: FirestoreUseQueryOptions$3<QuerySnapshot<FromFirestore, ToFirestore>, FirestoreError>): _tanstack_react_query.UseQueryResult<QuerySnapshot<FromFirestore, ToFirestore>, FirestoreError>;

type FirestoreUseQueryOptions$2<TData = unknown, TError = Error> = Omit<UseQueryOptions<TData, TError>, "queryFn">;
declare function useGetAggregateFromServerQuery<T extends AggregateSpec, AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData>(query: Query<AppModelType, DbModelType>, aggregateSpec: T, options: FirestoreUseQueryOptions$2<AggregateQuerySnapshot<T, AppModelType, DbModelType>, FirestoreError>): _tanstack_react_query.UseQueryResult<AggregateQuerySnapshot<T, AppModelType, DbModelType>, FirestoreError>;

type FirestoreUseQueryOptions$1<TData = unknown, TError = Error> = Omit<UseQueryOptions<TData, TError>, "queryFn">;
declare function useGetCountFromServerQuery<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData>(query: Query<AppModelType, DbModelType>, options: FirestoreUseQueryOptions$1<AggregateQuerySnapshot<{
    count: AggregateField<number>;
}, AppModelType, DbModelType>, FirestoreError>): _tanstack_react_query.UseQueryResult<AggregateQuerySnapshot<{
    count: AggregateField<number>;
}, AppModelType, DbModelType>, FirestoreError>;

type FirestoreUseQueryOptions<TData = unknown, TError = Error> = Omit<UseQueryOptions<TData, TError>, "queryFn">;
declare function useNamedQuery<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData>(firestore: Firestore, name: string, options: FirestoreUseQueryOptions<Query | null, FirestoreError>): _tanstack_react_query.UseQueryResult<Query<DocumentData, DocumentData> | null, FirestoreError>;

type FirestoreUseMutationOptions<TData = unknown, TError = Error> = Omit<UseMutationOptions<TData, TError, void>, "mutationFn">;
declare function useDeleteDocumentMutation<AppModelType extends DocumentData = DocumentData, DbModelType extends DocumentData = DocumentData>(documentRef: DocumentReference<AppModelType, DbModelType>, options?: FirestoreUseMutationOptions<void, FirestoreError>): _tanstack_react_query.UseMutationResult<void, FirestoreError, void, unknown>;

export { useClearIndexedDbPersistenceMutation, useCollectionQuery, useDeleteDocumentMutation, useDisableNetworkMutation, useDocumentQuery, useEnableNetworkMutation, useGetAggregateFromServerQuery, useGetCountFromServerQuery, useNamedQuery, useRunTransactionMutation, useWaitForPendingWritesQuery, useWriteBatchCommitMutation };
