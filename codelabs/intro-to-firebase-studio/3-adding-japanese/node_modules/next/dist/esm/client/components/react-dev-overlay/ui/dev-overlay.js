import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ShadowPortal } from './components/shadow-portal';
import { Base } from './styles/base';
import { ComponentStyles } from './styles/component-styles';
import { CssReset } from './styles/css-reset';
import { Colors } from './styles/colors';
import { ErrorOverlay } from './components/errors/error-overlay/error-overlay';
import { DevToolsIndicator } from './components/errors/dev-tools-indicator/dev-tools-indicator';
import { RenderError } from './container/runtime-error/render-error';
import { DarkTheme } from './styles/dark-theme';
export function DevOverlay(param) {
    let { state, isErrorOverlayOpen, setIsErrorOverlayOpen } = param;
    return /*#__PURE__*/ _jsxs(ShadowPortal, {
        children: [
            /*#__PURE__*/ _jsx(CssReset, {}),
            /*#__PURE__*/ _jsx(Base, {}),
            /*#__PURE__*/ _jsx(Colors, {}),
            /*#__PURE__*/ _jsx(ComponentStyles, {}),
            /*#__PURE__*/ _jsx(DarkTheme, {}),
            /*#__PURE__*/ _jsx(RenderError, {
                state: state,
                isAppDir: true,
                children: (param)=>{
                    let { runtimeErrors, totalErrorCount } = param;
                    const isBuildError = runtimeErrors.length === 0;
                    return /*#__PURE__*/ _jsxs(_Fragment, {
                        children: [
                            /*#__PURE__*/ _jsx(DevToolsIndicator, {
                                state: state,
                                errorCount: totalErrorCount,
                                isBuildError: isBuildError,
                                setIsErrorOverlayOpen: setIsErrorOverlayOpen
                            }),
                            /*#__PURE__*/ _jsx(ErrorOverlay, {
                                state: state,
                                runtimeErrors: runtimeErrors,
                                isErrorOverlayOpen: isErrorOverlayOpen,
                                setIsErrorOverlayOpen: setIsErrorOverlayOpen
                            })
                        ]
                    });
                }
            })
        ]
    });
}

//# sourceMappingURL=dev-overlay.js.map