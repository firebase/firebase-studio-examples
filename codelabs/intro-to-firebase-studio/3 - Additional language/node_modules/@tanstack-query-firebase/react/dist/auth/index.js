import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "../chunk-BBZEL7EG.js";

// src/auth/useCheckActionCodeMutation.ts
import { useMutation } from "@tanstack/react-query";
import {
  checkActionCode
} from "firebase/auth";
function useCheckActionCodeMutation(auth, options) {
  return useMutation(__spreadProps(__spreadValues({}, options), {
    mutationFn: (oobCode) => checkActionCode(auth, oobCode)
  }));
}

// src/auth/useApplyActionCodeMutation.ts
import { useMutation as useMutation2 } from "@tanstack/react-query";
import { applyActionCode } from "firebase/auth";
function useApplyActionCodeMutation(auth, options) {
  return useMutation2(__spreadProps(__spreadValues({}, options), {
    mutationFn: (oobCode) => {
      return applyActionCode(auth, oobCode);
    }
  }));
}

// src/auth/useCreateUserWithEmailAndPasswordMutation.ts
import { useMutation as useMutation3 } from "@tanstack/react-query";
import {
  createUserWithEmailAndPassword
} from "firebase/auth";
function useCreateUserWithEmailAndPasswordMutation(auth, options) {
  return useMutation3(__spreadProps(__spreadValues({}, options), {
    mutationFn: ({ email, password }) => createUserWithEmailAndPassword(auth, email, password)
  }));
}

// src/auth/useConfirmPasswordResetMutation.ts
import { useMutation as useMutation4 } from "@tanstack/react-query";
import { confirmPasswordReset } from "firebase/auth";
function useConfirmPasswordResetMutation(auth, options) {
  return useMutation4(
    __spreadProps(__spreadValues({}, options), {
      mutationFn: ({ oobCode, newPassword }) => {
        return confirmPasswordReset(auth, oobCode, newPassword);
      }
    })
  );
}

// src/auth/useRevokeAccessTokenMutation.ts
import { useMutation as useMutation5 } from "@tanstack/react-query";
import { revokeAccessToken } from "firebase/auth";
function useRevokeAccessTokenMutation(auth, options) {
  return useMutation5(__spreadProps(__spreadValues({}, options), {
    mutationFn: (token) => revokeAccessToken(auth, token)
  }));
}

// src/auth/useGetRedirectResultQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
  getRedirectResult
} from "firebase/auth";
function useGetRedirectResultQuery(auth, options) {
  const _a = options, { auth: authOptions } = _a, queryOptions = __objRest(_a, ["auth"]);
  const resolver = authOptions == null ? void 0 : authOptions.resolver;
  return useQuery(__spreadProps(__spreadValues({}, queryOptions), {
    queryFn: () => getRedirectResult(auth, resolver)
  }));
}

// src/auth/useSendSignInLinkToEmailMutation.ts
import { useMutation as useMutation6 } from "@tanstack/react-query";
import {
  sendSignInLinkToEmail
} from "firebase/auth";
function useSendSignInLinkToEmailMutation(auth, options) {
  return useMutation6(__spreadProps(__spreadValues({}, options), {
    mutationFn: ({ email, actionCodeSettings }) => sendSignInLinkToEmail(auth, email, actionCodeSettings)
  }));
}

// src/auth/useSignInAnonymouslyMutation.ts
import { useMutation as useMutation7 } from "@tanstack/react-query";
import {
  signInAnonymously
} from "firebase/auth";
function useSignInAnonymouslyMutation(auth, options) {
  return useMutation7(__spreadProps(__spreadValues({}, options), {
    mutationFn: () => signInAnonymously(auth)
  }));
}

// src/auth/useSignInWithCredentialMutation.ts
import { useMutation as useMutation8 } from "@tanstack/react-query";
import {
  signInWithCredential
} from "firebase/auth";
function useSignInWithCredentialMutation(auth, credential, options) {
  return useMutation8(__spreadProps(__spreadValues({}, options), {
    mutationFn: () => signInWithCredential(auth, credential)
  }));
}

// src/auth/useSignInWithEmailAndPasswordMutation.ts
import { useMutation as useMutation9 } from "@tanstack/react-query";
import {
  signInWithEmailAndPassword
} from "firebase/auth";
function useSignInWithEmailAndPasswordMutation(auth, options) {
  return useMutation9(__spreadProps(__spreadValues({}, options), {
    mutationFn: ({ email, password }) => signInWithEmailAndPassword(auth, email, password)
  }));
}

// src/auth/useSignOutMutation.ts
import { useMutation as useMutation10 } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
function useSignOutMutation(auth, options) {
  return useMutation10(__spreadProps(__spreadValues({}, options), {
    mutationFn: () => signOut(auth)
  }));
}

// src/auth/useUpdateCurrentUserMutation.ts
import { useMutation as useMutation11 } from "@tanstack/react-query";
import {
  updateCurrentUser
} from "firebase/auth";
function useUpdateCurrentUserMutation(auth, options) {
  return useMutation11(__spreadProps(__spreadValues({}, options), {
    mutationFn: (user) => updateCurrentUser(auth, user)
  }));
}

// src/auth/useVerifyPasswordResetCodeMutation.ts
import { useMutation as useMutation12 } from "@tanstack/react-query";
import {
  verifyPasswordResetCode
} from "firebase/auth";
function useVerifyPasswordResetCodeMutation(auth, options) {
  return useMutation12(__spreadProps(__spreadValues({}, options), {
    mutationFn: (code) => verifyPasswordResetCode(auth, code)
  }));
}

// src/auth/useDeleteUserMutation.ts
import { useMutation as useMutation13 } from "@tanstack/react-query";
import {
  deleteUser
} from "firebase/auth";
function useDeleteUserMutation(auth, options) {
  return useMutation13(__spreadProps(__spreadValues({}, options), {
    mutationFn: (user) => deleteUser(user)
  }));
}

// src/auth/useReloadMutation.ts
import { useMutation as useMutation14 } from "@tanstack/react-query";
import { reload } from "firebase/auth";
function useReloadMutation(options) {
  return useMutation14(__spreadProps(__spreadValues({}, options), {
    mutationFn: (user) => reload(user)
  }));
}
export {
  useApplyActionCodeMutation,
  useCheckActionCodeMutation,
  useConfirmPasswordResetMutation,
  useCreateUserWithEmailAndPasswordMutation,
  useDeleteUserMutation,
  useGetRedirectResultQuery,
  useReloadMutation,
  useRevokeAccessTokenMutation,
  useSendSignInLinkToEmailMutation,
  useSignInAnonymouslyMutation,
  useSignInWithCredentialMutation,
  useSignInWithEmailAndPasswordMutation,
  useSignOutMutation,
  useUpdateCurrentUserMutation,
  useVerifyPasswordResetCodeMutation
};
