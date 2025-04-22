type ErrorOverlayDialogProps = {
    children?: React.ReactNode;
    onClose?: () => void;
    dialogResizerRef?: React.RefObject<HTMLDivElement | null>;
};
export declare function ErrorOverlayDialog({ children, onClose, ...props }: ErrorOverlayDialogProps): import("react/jsx-runtime").JSX.Element;
export declare const DIALOG_STYLES = "\n  .error-overlay-dialog {\n    overflow-y: auto;\n    -webkit-font-smoothing: antialiased;\n    background: var(--color-background-100);\n    background-clip: padding-box;\n    border: 1px solid var(--color-gray-400);\n    border-radius: var(--rounded-xl);\n    box-shadow: var(--shadow-menu);\n    position: relative;\n\n    &:has(\n        ~ [data-nextjs-error-overlay-nav] .error-overlay-notch[data-side='left']\n      ) {\n      border-top-left-radius: 0;\n    }\n\n    &:has(\n        ~ [data-nextjs-error-overlay-nav]\n          .error-overlay-notch[data-side='right']\n      ) {\n      border-top-right-radius: 0;\n    }\n  }\n";
export {};
