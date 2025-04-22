import * as React from 'react';
import { createPortal } from 'react-dom';
import { STORAGE_KEY_THEME } from '../../shared';
export function ShadowPortal(param) {
    let { children } = param;
    let portalNode = React.useRef(null);
    let shadowNode = React.useRef(null);
    let [, forceUpdate] = React.useState();
    React.useLayoutEffect(()=>{
        const ownerDocument = document;
        portalNode.current = ownerDocument.createElement('nextjs-portal');
        // load default color preference from localstorage
        if (typeof localStorage !== 'undefined') {
            const theme = localStorage.getItem(STORAGE_KEY_THEME);
            if (theme === 'dark') {
                portalNode.current.classList.add('dark');
                portalNode.current.classList.remove('light');
            } else if (theme === 'light') {
                portalNode.current.classList.remove('dark');
                portalNode.current.classList.add('light');
            }
        }
        shadowNode.current = portalNode.current.attachShadow({
            mode: 'open'
        });
        ownerDocument.body.appendChild(portalNode.current);
        forceUpdate({});
        return ()=>{
            if (portalNode.current && portalNode.current.ownerDocument) {
                portalNode.current.ownerDocument.body.removeChild(portalNode.current);
            }
        };
    }, []);
    return shadowNode.current ? /*#__PURE__*/ createPortal(children, shadowNode.current) : null;
}

//# sourceMappingURL=shadow-portal.js.map