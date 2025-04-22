import * as _tanstack_react_query from '@tanstack/react-query';
import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { Auth, ActionCodeInfo, AuthError, UserCredential, PopupRedirectResolver, ActionCodeSettings, AuthCredential, User } from 'firebase/auth';

type AuthUseMutationOptions$9<TData = unknown, TError = Error, TVariables = void> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;
declare function useCheckActionCodeMutation(auth: Auth, options?: AuthUseMutationOptions$9<ActionCodeInfo, AuthError, string>): _tanstack_react_query.UseMutationResult<ActionCodeInfo, AuthError, string, unknown>;

type AuthUseMutationOptions$8<TData = unknown, TError = Error, TVariables = void> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;
declare function useApplyActionCodeMutation(auth: Auth, options?: AuthUseMutationOptions$8<void, AuthError, string>): _tanstack_react_query.UseMutationResult<void, AuthError, string, unknown>;

type AuthUseMutationOptions$7<TData = unknown, TError = Error, TVariables = void> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;
declare function useCreateUserWithEmailAndPasswordMutation(auth: Auth, options?: AuthUseMutationOptions$7<UserCredential, AuthError, {
    email: string;
    password: string;
}>): _tanstack_react_query.UseMutationResult<UserCredential, AuthError, {
    email: string;
    password: string;
}, unknown>;

type AuthUseMutationOptions$6<TData = unknown, TError = Error, TVariables = void> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;
declare function useConfirmPasswordResetMutation(auth: Auth, options?: AuthUseMutationOptions$6<void, AuthError, {
    oobCode: string;
    newPassword: string;
}>): _tanstack_react_query.UseMutationResult<void, AuthError, {
    oobCode: string;
    newPassword: string;
}, unknown>;

type AuthMutationOptions$1<TData = unknown, TError = Error, TVariables = void> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;

declare function useRevokeAccessTokenMutation(auth: Auth, options?: AuthMutationOptions$1<void, AuthError, string>): _tanstack_react_query.UseMutationResult<void, AuthError, string, unknown>;

type AuthUseQueryOptions<TData = unknown, TError = Error> = Omit<UseQueryOptions<TData, TError, void>, "queryFn"> & {
    auth?: {
        resolver?: PopupRedirectResolver;
    };
};
declare function useGetRedirectResultQuery(auth: Auth, options: AuthUseQueryOptions<UserCredential | null, AuthError>): _tanstack_react_query.UseQueryResult<void, AuthError>;

type SendSignInLinkParams = {
    email: string;
    actionCodeSettings: ActionCodeSettings;
};
type AuthUseMutationOptions$5<TData = unknown, TError = Error, TVariables = void> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;
declare function useSendSignInLinkToEmailMutation(auth: Auth, options?: AuthUseMutationOptions$5<void, AuthError, SendSignInLinkParams>): _tanstack_react_query.UseMutationResult<void, AuthError, SendSignInLinkParams, unknown>;

type SignInAnonymouslyOptions = Omit<UseMutationOptions<UserCredential, AuthError, void>, "mutationFn">;
declare function useSignInAnonymouslyMutation(auth: Auth, options?: SignInAnonymouslyOptions): _tanstack_react_query.UseMutationResult<UserCredential, AuthError, void, unknown>;

type AuthUseMutationOptions$4<TData = unknown, TError = Error> = Omit<UseMutationOptions<TData, TError, void>, "mutationFn">;
declare function useSignInWithCredentialMutation(auth: Auth, credential: AuthCredential, options?: AuthUseMutationOptions$4<UserCredential, AuthError>): _tanstack_react_query.UseMutationResult<UserCredential, AuthError, void, unknown>;

type AuthUseMutationOptions$3<TData = unknown, TError = Error, TVariables = void> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;
declare function useSignInWithEmailAndPasswordMutation(auth: Auth, options?: AuthUseMutationOptions$3<UserCredential, AuthError, {
    email: string;
    password: string;
}>): _tanstack_react_query.UseMutationResult<UserCredential, AuthError, {
    email: string;
    password: string;
}, unknown>;

type AuthUseMutationOptions$2<TData = unknown, TError = Error, TVariables = void> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;
declare function useSignOutMutation(auth: Auth, options?: AuthUseMutationOptions$2): _tanstack_react_query.UseMutationResult<void, Error, void, unknown>;

type AuthUseMutationOptions$1<TData = unknown, TError = Error, TVariables = void> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;
declare function useUpdateCurrentUserMutation(auth: Auth, options?: AuthUseMutationOptions$1<void, AuthError, User | null>): _tanstack_react_query.UseMutationResult<void, AuthError, User | null, unknown>;

type AuthUseMutationOptions<TData = unknown, TError = Error, TVariables = void> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;
declare function useVerifyPasswordResetCodeMutation(auth: Auth, options?: AuthUseMutationOptions<string, AuthError, string>): _tanstack_react_query.UseMutationResult<string, AuthError, string, unknown>;

type AuthUMutationOptions<TData = unknown, TError = Error, TVariables = void> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;
declare function useDeleteUserMutation(auth: Auth, options?: AuthUMutationOptions<void, AuthError, User>): _tanstack_react_query.UseMutationResult<void, AuthError, User, unknown>;

type AuthMutationOptions<TData = unknown, TError = Error, TVariables = void> = Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">;
declare function useReloadMutation(options?: AuthMutationOptions<void, AuthError, User>): _tanstack_react_query.UseMutationResult<void, AuthError, User, unknown>;

export { useApplyActionCodeMutation, useCheckActionCodeMutation, useConfirmPasswordResetMutation, useCreateUserWithEmailAndPasswordMutation, useDeleteUserMutation, useGetRedirectResultQuery, useReloadMutation, useRevokeAccessTokenMutation, useSendSignInLinkToEmailMutation, useSignInAnonymouslyMutation, useSignInWithCredentialMutation, useSignInWithEmailAndPasswordMutation, useSignOutMutation, useUpdateCurrentUserMutation, useVerifyPasswordResetCodeMutation };
