import { useEffect, useTransition } from 'react';
import { devRenderIndicator } from './dev-render-indicator';
export const useSyncDevRenderIndicatorInternal = ()=>{
    const [isPending, startTransition] = useTransition();
    useEffect(()=>{
        if (isPending) {
            devRenderIndicator.show();
        } else {
            devRenderIndicator.hide();
        }
    }, [
        isPending
    ]);
    return startTransition;
};

//# sourceMappingURL=use-sync-dev-render-indicator-internal.js.map