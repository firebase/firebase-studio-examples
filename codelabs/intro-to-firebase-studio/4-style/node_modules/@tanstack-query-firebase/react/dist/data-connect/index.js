import {
  __async,
  __spreadProps,
  __spreadValues
} from "../chunk-BBZEL7EG.js";

// src/data-connect/query-client.ts
import {
  QueryClient
} from "@tanstack/react-query";
import {
  executeQuery
} from "firebase/data-connect";
var DataConnectQueryClient = class extends QueryClient {
  prefetchDataConnectQuery(refOrResult, options) {
    var _a;
    let queryRef;
    let initialData;
    if ("ref" in refOrResult) {
      queryRef = refOrResult.ref;
      initialData = __spreadProps(__spreadValues({}, refOrResult.data), {
        ref: refOrResult.ref,
        source: refOrResult.source,
        fetchTime: refOrResult.fetchTime
      });
    } else {
      queryRef = refOrResult;
    }
    return this.prefetchQuery(__spreadProps(__spreadValues({}, options), {
      initialData,
      queryKey: (_a = options == null ? void 0 : options.queryKey) != null ? _a : [
        queryRef.name,
        queryRef.variables || null
      ],
      queryFn: () => __async(this, null, function* () {
        const response = yield executeQuery(queryRef);
        const data = __spreadProps(__spreadValues({}, response.data), {
          ref: response.ref,
          source: response.source,
          fetchTime: response.fetchTime
        });
        return JSON.parse(JSON.stringify(data));
      })
    }));
  }
};

// src/data-connect/useDataConnectQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
  executeQuery as executeQuery2,
  CallerSdkTypeEnum
} from "firebase/data-connect";
function useDataConnectQuery(refOrResult, options, _callerSdkType = CallerSdkTypeEnum.TanstackReactCore) {
  var _a;
  let queryRef;
  let initialData;
  if ("ref" in refOrResult) {
    queryRef = refOrResult.ref;
    initialData = __spreadProps(__spreadValues({}, refOrResult.data), {
      ref: refOrResult.ref,
      source: refOrResult.source,
      fetchTime: refOrResult.fetchTime
    });
  } else {
    queryRef = refOrResult;
  }
  queryRef.dataConnect._setCallerSdkType(_callerSdkType);
  return useQuery(__spreadProps(__spreadValues({}, options), {
    initialData,
    queryKey: (_a = options == null ? void 0 : options.queryKey) != null ? _a : [queryRef.name, queryRef.variables || null],
    queryFn: () => __async(this, null, function* () {
      const response = yield executeQuery2(queryRef);
      return __spreadProps(__spreadValues({}, response.data), {
        ref: response.ref,
        source: response.source,
        fetchTime: response.fetchTime
      });
    })
  }));
}

// src/data-connect/useDataConnectMutation.ts
import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import {
  CallerSdkTypeEnum as CallerSdkTypeEnum2,
  executeMutation
} from "firebase/data-connect";
function useDataConnectMutation(ref, options, _callerSdkType = CallerSdkTypeEnum2.TanstackReactCore) {
  const queryClient = useQueryClient();
  return useMutation(__spreadProps(__spreadValues({}, options), {
    onSuccess(...args) {
      var _a, _b;
      if ((_a = options == null ? void 0 : options.invalidate) == null ? void 0 : _a.length) {
        for (const ref2 of options.invalidate) {
          if ("variables" in ref2 && ref2.variables !== void 0) {
            queryClient.invalidateQueries({
              queryKey: [ref2.name, ref2.variables],
              exact: true
            });
          } else {
            queryClient.invalidateQueries({
              queryKey: [ref2.name]
            });
          }
        }
      }
      (_b = options == null ? void 0 : options.onSuccess) == null ? void 0 : _b.call(options, ...args);
    },
    mutationFn: (variables) => __async(this, null, function* () {
      const mutationRef = typeof ref === "function" ? ref(variables) : ref;
      mutationRef.dataConnect._setCallerSdkType(_callerSdkType);
      const response = yield executeMutation(mutationRef);
      return __spreadProps(__spreadValues({}, response.data), {
        ref: response.ref,
        source: response.source,
        fetchTime: response.fetchTime
      });
    })
  }));
}
export {
  DataConnectQueryClient,
  useDataConnectMutation,
  useDataConnectQuery
};
