import React, { use, useCallback } from 'react';
import { isThenable } from '../../shared/lib/is-thenable';
import { useSyncDevRenderIndicator } from './react-dev-overlay/utils/dev-indicator/use-sync-dev-render-indicator';
export function useUnwrapState(state) {
    // reducer actions can be async, so sometimes we need to suspend until the state is resolved
    if (isThenable(state)) {
        const result = use(state);
        return result;
    }
    return state;
}
export function useReducer(actionQueue) {
    const [state, setState] = React.useState(actionQueue.state);
    const syncDevRenderIndicator = useSyncDevRenderIndicator();
    const dispatch = useCallback((action)=>{
        syncDevRenderIndicator(()=>{
            actionQueue.dispatch(action, setState);
        });
    }, [
        actionQueue,
        syncDevRenderIndicator
    ]);
    return [
        state,
        dispatch
    ];
}

//# sourceMappingURL=use-reducer.js.map