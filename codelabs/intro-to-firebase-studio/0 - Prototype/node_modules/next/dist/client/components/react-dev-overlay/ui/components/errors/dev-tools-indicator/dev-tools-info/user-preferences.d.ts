import { type HTMLProps } from 'react';
import type { DevToolsInfoPropsCore } from './dev-tools-info';
import type { DevToolsIndicatorPosition } from '../dev-tools-indicator';
export declare function UserPreferences({ setPosition, position, hide, ...props }: {
    setPosition: (position: DevToolsIndicatorPosition) => void;
    position: DevToolsIndicatorPosition;
    hide: () => void;
} & DevToolsInfoPropsCore & HTMLProps<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
export declare const DEV_TOOLS_INFO_USER_PREFERENCES_STYLES: string;
