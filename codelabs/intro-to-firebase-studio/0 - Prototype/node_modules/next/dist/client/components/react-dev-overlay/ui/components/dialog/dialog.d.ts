import * as React from 'react';
export type DialogProps = {
    children?: React.ReactNode;
    type: 'error' | 'warning';
    'aria-labelledby': string;
    'aria-describedby': string;
    className?: string;
    onClose?: () => void;
    dialogResizerRef?: React.RefObject<HTMLDivElement | null>;
};
declare const Dialog: React.FC<DialogProps>;
export { Dialog };
