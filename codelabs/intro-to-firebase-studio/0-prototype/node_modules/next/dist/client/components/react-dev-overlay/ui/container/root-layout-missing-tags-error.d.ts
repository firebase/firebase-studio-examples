import type { ErrorBaseProps } from '../components/errors/error-overlay/error-overlay';
interface RootLayoutMissingTagsErrorProps extends ErrorBaseProps {
    missingTags: string[];
}
export declare function RootLayoutMissingTagsError({ missingTags, ...props }: RootLayoutMissingTagsErrorProps): import("react/jsx-runtime").JSX.Element;
export {};
