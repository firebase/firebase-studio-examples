import { jsx as _jsx } from "react/jsx-runtime";
import { Dialog } from '../../dialog/dialog';
export function ErrorOverlayDialog(param) {
    let { children, onClose, ...props } = param;
    return /*#__PURE__*/ _jsx(Dialog, {
        type: "error",
        "aria-labelledby": "nextjs__container_errors_label",
        "aria-describedby": "nextjs__container_errors_desc",
        onClose: onClose,
        className: "error-overlay-dialog",
        ...props,
        children: children
    });
}
export const DIALOG_STYLES = "\n  .error-overlay-dialog {\n    overflow-y: auto;\n    -webkit-font-smoothing: antialiased;\n    background: var(--color-background-100);\n    background-clip: padding-box;\n    border: 1px solid var(--color-gray-400);\n    border-radius: var(--rounded-xl);\n    box-shadow: var(--shadow-menu);\n    position: relative;\n\n    &:has(\n        ~ [data-nextjs-error-overlay-nav] .error-overlay-notch[data-side='left']\n      ) {\n      border-top-left-radius: 0;\n    }\n\n    &:has(\n        ~ [data-nextjs-error-overlay-nav]\n          .error-overlay-notch[data-side='right']\n      ) {\n      border-top-right-radius: 0;\n    }\n  }\n";

//# sourceMappingURL=dialog.js.map