import {
  __async,
  __objRest,
  __spreadProps,
  __spreadValues
} from "../chunk-BBZEL7EG.js";

// src/firestore/useClearIndexedDbPersistenceMutation.ts
import { useMutation } from "@tanstack/react-query";
import {
  clearIndexedDbPersistence
} from "firebase/firestore";
function useClearIndexedDbPersistenceMutation(firestore, options) {
  return useMutation(__spreadProps(__spreadValues({}, options), {
    mutationFn: () => clearIndexedDbPersistence(firestore)
  }));
}

// src/firestore/useDisableNetworkMutation.ts
import { useMutation as useMutation2 } from "@tanstack/react-query";
import {
  disableNetwork
} from "firebase/firestore";
function useDisableNetworkMutation(firestore, options) {
  return useMutation2(__spreadProps(__spreadValues({}, options), {
    mutationFn: () => disableNetwork(firestore)
  }));
}

// src/firestore/useEnableNetworkMutation.ts
import { useMutation as useMutation3 } from "@tanstack/react-query";
import {
  enableNetwork
} from "firebase/firestore";
function useEnableNetworkMutation(firestore, options) {
  return useMutation3(__spreadProps(__spreadValues({}, options), {
    mutationFn: () => enableNetwork(firestore)
  }));
}

// src/firestore/useWaitForPendingWritesQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
  waitForPendingWrites
} from "firebase/firestore";
function useWaitForPendingWritesQuery(firestore, options) {
  return useQuery(__spreadProps(__spreadValues({}, options), {
    queryFn: () => waitForPendingWrites(firestore)
  }));
}

// src/firestore/useRunTransactionMutation.ts
import { useMutation as useMutation4 } from "@tanstack/react-query";
import {
  runTransaction
} from "firebase/firestore";
function useRunTransactionMutation(firestore, updateFunction, options) {
  const _a = options != null ? options : {}, { firestore: firestoreOptions } = _a, queryOptions = __objRest(_a, ["firestore"]);
  return useMutation4(__spreadProps(__spreadValues({}, queryOptions), {
    mutationFn: () => runTransaction(firestore, updateFunction, firestoreOptions)
  }));
}

// src/firestore/useWriteBatchCommitMutation.ts
import { useMutation as useMutation5 } from "@tanstack/react-query";
function useWriteBatchCommitMutation(options) {
  return useMutation5(__spreadProps(__spreadValues({}, options), {
    mutationFn: (batch) => batch.commit()
  }));
}

// src/firestore/useDocumentQuery.ts
import { useQuery as useQuery2 } from "@tanstack/react-query";
import {
  getDoc,
  getDocFromCache,
  getDocFromServer
} from "firebase/firestore";
function useDocumentQuery(documentRef, options) {
  const _a = options, { firestore } = _a, queryOptions = __objRest(_a, ["firestore"]);
  return useQuery2(
    __spreadProps(__spreadValues({}, queryOptions), {
      queryFn: () => __async(this, null, function* () {
        if ((firestore == null ? void 0 : firestore.source) === "server") {
          return yield getDocFromServer(documentRef);
        }
        if ((firestore == null ? void 0 : firestore.source) === "cache") {
          return yield getDocFromCache(documentRef);
        }
        return yield getDoc(documentRef);
      })
    })
  );
}

// src/firestore/useCollectionQuery.ts
import { useQuery as useQuery3 } from "@tanstack/react-query";
import {
  getDocs,
  getDocsFromCache,
  getDocsFromServer
} from "firebase/firestore";
function useCollectionQuery(query, options) {
  const _a = options, { firestore } = _a, queryOptions = __objRest(_a, ["firestore"]);
  return useQuery3(__spreadProps(__spreadValues({}, queryOptions), {
    queryFn: () => __async(this, null, function* () {
      if ((firestore == null ? void 0 : firestore.source) === "server") {
        return yield getDocsFromServer(query);
      }
      if ((firestore == null ? void 0 : firestore.source) === "cache") {
        return yield getDocsFromCache(query);
      }
      return yield getDocs(query);
    })
  }));
}

// src/firestore/useGetAggregateFromServerQuery.ts
import { useQuery as useQuery4 } from "@tanstack/react-query";
import {
  getAggregateFromServer
} from "firebase/firestore";
function useGetAggregateFromServerQuery(query, aggregateSpec, options) {
  return useQuery4(__spreadProps(__spreadValues({}, options), {
    queryFn: () => getAggregateFromServer(query, aggregateSpec)
  }));
}

// src/firestore/useGetCountFromServerQuery.ts
import { useQuery as useQuery5 } from "@tanstack/react-query";
import {
  getCountFromServer
} from "firebase/firestore";
function useGetCountFromServerQuery(query, options) {
  return useQuery5(__spreadProps(__spreadValues({}, options), {
    queryFn: () => getCountFromServer(query)
  }));
}

// src/firestore/useNamedQuery.ts
import { useQuery as useQuery6 } from "@tanstack/react-query";
import {
  namedQuery
} from "firebase/firestore";
function useNamedQuery(firestore, name, options) {
  return useQuery6(__spreadProps(__spreadValues({}, options), {
    queryFn: () => namedQuery(firestore, name)
  }));
}

// src/firestore/useDeleteDocumentMutation.ts
import { useMutation as useMutation6 } from "@tanstack/react-query";
import {
  deleteDoc
} from "firebase/firestore";
function useDeleteDocumentMutation(documentRef, options) {
  return useMutation6(__spreadProps(__spreadValues({}, options), {
    mutationFn: () => deleteDoc(documentRef)
  }));
}
export {
  useClearIndexedDbPersistenceMutation,
  useCollectionQuery,
  useDeleteDocumentMutation,
  useDisableNetworkMutation,
  useDocumentQuery,
  useEnableNetworkMutation,
  useGetAggregateFromServerQuery,
  useGetCountFromServerQuery,
  useNamedQuery,
  useRunTransactionMutation,
  useWaitForPendingWritesQuery,
  useWriteBatchCommitMutation
};
