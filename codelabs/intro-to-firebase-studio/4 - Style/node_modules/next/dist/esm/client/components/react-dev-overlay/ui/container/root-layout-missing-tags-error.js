import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import { HotlinkedText } from '../components/hot-linked-text';
import { ErrorOverlayLayout } from '../components/errors/error-overlay-layout/error-overlay-layout';
export function RootLayoutMissingTagsError(param) {
    let { missingTags, ...props } = param;
    const noop = useCallback(()=>{}, []);
    const error = Object.defineProperty(new Error("The following tags are missing in the Root Layout: " + missingTags.map((tagName)=>"<" + tagName + ">").join(', ') + ".\nRead more at https://nextjs.org/docs/messages/missing-root-layout-tags"), "__NEXT_ERROR_CODE", {
        value: "E638",
        enumerable: false,
        configurable: true
    });
    return /*#__PURE__*/ _jsx(ErrorOverlayLayout, {
        errorType: "Missing Required HTML Tag",
        error: error,
        errorMessage: /*#__PURE__*/ _jsx(HotlinkedText, {
            text: error.message
        }),
        onClose: noop,
        ...props
    });
}

//# sourceMappingURL=root-layout-missing-tags-error.js.map