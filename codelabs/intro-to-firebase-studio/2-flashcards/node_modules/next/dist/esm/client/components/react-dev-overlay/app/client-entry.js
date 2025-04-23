import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { AppDevOverlay } from './app-dev-overlay';
import { getSocketUrl } from '../utils/get-socket-url';
import { INITIAL_OVERLAY_STATE } from '../shared';
import { HMR_ACTIONS_SENT_TO_BROWSER } from '../../../../server/dev/hot-reloader-types';
import GlobalError from '../../error-boundary';
// if an error is thrown while rendering an RSC stream, this will catch it in dev
// and show the error overlay
export function createRootLevelDevOverlayElement(reactEl) {
    const rootLayoutMissingTags = window.__next_root_layout_missing_tags;
    const hasMissingTags = !!(rootLayoutMissingTags == null ? void 0 : rootLayoutMissingTags.length);
    const socketUrl = getSocketUrl(process.env.__NEXT_ASSET_PREFIX || '');
    const socket = new window.WebSocket("" + socketUrl + "/_next/webpack-hmr");
    // add minimal "hot reload" support for RSC errors
    const handler = (event)=>{
        let obj;
        try {
            obj = JSON.parse(event.data);
        } catch (e) {}
        if (!obj || !('action' in obj)) {
            return;
        }
        if (obj.action === HMR_ACTIONS_SENT_TO_BROWSER.SERVER_COMPONENT_CHANGES) {
            window.location.reload();
        }
    };
    socket.addEventListener('message', handler);
    const FallbackLayout = hasMissingTags ? (param)=>{
        let { children } = param;
        return /*#__PURE__*/ _jsx("html", {
            id: "__next_error__",
            children: /*#__PURE__*/ _jsx("body", {
                children: children
            })
        });
    } : React.Fragment;
    return /*#__PURE__*/ _jsx(FallbackLayout, {
        children: /*#__PURE__*/ _jsx(AppDevOverlay, {
            state: {
                ...INITIAL_OVERLAY_STATE,
                rootLayoutMissingTags,
                routerType: 'app'
            },
            globalError: [
                GlobalError,
                null
            ],
            children: reactEl
        })
    });
}

//# sourceMappingURL=client-entry.js.map