import { _ as _tagged_template_literal_loose } from "@swc/helpers/_/_tagged_template_literal_loose";
function _templateObject() {
    const data = _tagged_template_literal_loose([
        "\n  .preferences-container {\n    padding: 8px 6px;\n    width: 100%;\n  }\n\n  @media (min-width: 576px) {\n    .preferences-container {\n      width: 480px;\n    }\n  }\n\n  .preference-section:first-child {\n    padding-top: 0;\n  }\n\n  .preference-section {\n    padding: 12px 0;\n    border-bottom: 1px solid var(--color-gray-400);\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 24px;\n  }\n\n  .preference-section:last-child {\n    border-bottom: none;\n  }\n\n  .preference-header {\n    margin-bottom: 0;\n    flex: 1;\n  }\n\n  .preference-header label {\n    font-size: var(--size-14);\n    font-weight: 500;\n    color: var(--color-gray-1000);\n    margin: 0;\n  }\n\n  .preference-description {\n    color: var(--color-gray-900);\n    font-size: var(--size-14);\n    margin: 0;\n  }\n\n  .preference-icon {\n    display: flex;\n    align-items: center;\n    width: 16px;\n    height: 16px;\n  }\n\n  .select-button,\n  .action-button {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    background: var(--color-background-100);\n    border: 1px solid var(--color-gray-400);\n    border-radius: var(--rounded-lg);\n    font-weight: 400;\n    font-size: var(--size-14);\n    color: var(--color-gray-1000);\n    padding: 6px 8px;\n\n    &:hover {\n      background: var(--color-gray-100);\n    }\n  }\n\n  .preference-control-select {\n    padding: 6px 8px;\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    border-radius: var(--rounded-lg);\n    border: 1px solid var(--color-gray-400);\n\n    &:hover {\n      background: var(--color-gray-100);\n    }\n\n    &:focus-within {\n      outline: var(--focus-ring);\n    }\n  }\n\n  .preference-control-select select {\n    font-size: var(--size-14);\n    font-weight: 400;\n    border: none;\n    padding: 0 6px 0 0;\n    border-radius: 0;\n    outline: none;\n    background: none;\n  }\n\n  :global(.icon) {\n    width: 18px;\n    height: 18px;\n    color: #666;\n  }\n"
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { css } from '../../../../../utils/css';
import EyeIcon from '../../../../icons/eye-icon';
import { STORAGE_KEY_POSITION, STORAGE_KEY_THEME } from '../../../../../shared';
import LightIcon from '../../../../icons/light-icon';
import DarkIcon from '../../../../icons/dark-icon';
import SystemIcon from '../../../../icons/system-icon';
import { DevToolsInfo } from './dev-tools-info';
function getInitialPreference() {
    if (typeof localStorage === 'undefined') {
        return 'system';
    }
    const theme = localStorage.getItem(STORAGE_KEY_THEME);
    return theme === 'dark' || theme === 'light' ? theme : 'system';
}
export function UserPreferences(param) {
    let { setPosition, position, hide, ...props } = param;
    // derive initial theme from system preference
    const [theme, setTheme] = useState(getInitialPreference());
    const handleThemeChange = (e)=>{
        const portal = document.querySelector('nextjs-portal');
        if (!portal) return;
        setTheme(e.target.value);
        if (e.target.value === 'system') {
            portal.classList.remove('dark');
            portal.classList.remove('light');
            localStorage.removeItem(STORAGE_KEY_THEME);
            return;
        }
        if (e.target.value === 'dark') {
            portal.classList.add('dark');
            portal.classList.remove('light');
            localStorage.setItem(STORAGE_KEY_THEME, 'dark');
        } else {
            portal.classList.remove('dark');
            portal.classList.add('light');
            localStorage.setItem(STORAGE_KEY_THEME, 'light');
        }
    };
    function handlePositionChange(e) {
        setPosition(e.target.value);
        localStorage.setItem(STORAGE_KEY_POSITION, e.target.value);
    }
    return /*#__PURE__*/ _jsx(DevToolsInfo, {
        title: "Preferences",
        ...props,
        children: /*#__PURE__*/ _jsxs("div", {
            className: "preferences-container",
            children: [
                /*#__PURE__*/ _jsxs("div", {
                    className: "preference-section",
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            className: "preference-header",
                            children: [
                                /*#__PURE__*/ _jsx("label", {
                                    htmlFor: "theme",
                                    children: "Theme"
                                }),
                                /*#__PURE__*/ _jsx("p", {
                                    className: "preference-description",
                                    children: "Select your theme preference."
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            className: "preference-control-select",
                            children: [
                                /*#__PURE__*/ _jsx("div", {
                                    className: "preference-icon",
                                    children: /*#__PURE__*/ _jsx(ThemeIcon, {
                                        theme: theme
                                    })
                                }),
                                /*#__PURE__*/ _jsxs("select", {
                                    id: "theme",
                                    name: "theme",
                                    className: "select-button",
                                    value: theme,
                                    onChange: handleThemeChange,
                                    children: [
                                        /*#__PURE__*/ _jsx("option", {
                                            value: "system",
                                            children: "System"
                                        }),
                                        /*#__PURE__*/ _jsx("option", {
                                            value: "light",
                                            children: "Light"
                                        }),
                                        /*#__PURE__*/ _jsx("option", {
                                            value: "dark",
                                            children: "Dark"
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ _jsxs("div", {
                    className: "preference-section",
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            className: "preference-header",
                            children: [
                                /*#__PURE__*/ _jsx("label", {
                                    htmlFor: "position",
                                    children: "Position"
                                }),
                                /*#__PURE__*/ _jsx("p", {
                                    className: "preference-description",
                                    children: "Adjust the placement of your dev tools."
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsx("div", {
                            className: "preference-control-select",
                            children: /*#__PURE__*/ _jsxs("select", {
                                id: "position",
                                name: "position",
                                className: "select-button",
                                value: position,
                                onChange: handlePositionChange,
                                children: [
                                    /*#__PURE__*/ _jsx("option", {
                                        value: "bottom-left",
                                        children: "Bottom Left"
                                    }),
                                    /*#__PURE__*/ _jsx("option", {
                                        value: "bottom-right",
                                        children: "Bottom Right"
                                    }),
                                    /*#__PURE__*/ _jsx("option", {
                                        value: "top-left",
                                        children: "Top Left"
                                    }),
                                    /*#__PURE__*/ _jsx("option", {
                                        value: "top-right",
                                        children: "Top Right"
                                    })
                                ]
                            })
                        })
                    ]
                }),
                /*#__PURE__*/ _jsxs("div", {
                    className: "preference-section",
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            className: "preference-header",
                            children: [
                                /*#__PURE__*/ _jsx("label", {
                                    htmlFor: "hide-dev-tools",
                                    children: "Hide Dev Tools for this session"
                                }),
                                /*#__PURE__*/ _jsx("p", {
                                    className: "preference-description",
                                    children: "Hide Dev Tools until you restart your dev server, or 1 day."
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsx("div", {
                            className: "preference-control",
                            children: /*#__PURE__*/ _jsxs("button", {
                                id: "hide-dev-tools",
                                name: "hide-dev-tools",
                                "data-hide-dev-tools": true,
                                className: "action-button",
                                onClick: hide,
                                children: [
                                    /*#__PURE__*/ _jsx("div", {
                                        className: "preference-icon",
                                        children: /*#__PURE__*/ _jsx(EyeIcon, {})
                                    }),
                                    /*#__PURE__*/ _jsx("span", {
                                        children: "Hide"
                                    })
                                ]
                            })
                        })
                    ]
                }),
                /*#__PURE__*/ _jsx("div", {
                    className: "preference-section",
                    children: /*#__PURE__*/ _jsxs("div", {
                        className: "preference-header",
                        children: [
                            /*#__PURE__*/ _jsx("label", {
                                children: "Disable Dev Tools for this project"
                            }),
                            /*#__PURE__*/ _jsxs("p", {
                                className: "preference-description",
                                children: [
                                    "To disable this UI completely, set",
                                    ' ',
                                    /*#__PURE__*/ _jsx("code", {
                                        className: "dev-tools-info-code",
                                        children: "devIndicators: false"
                                    }),
                                    ' ',
                                    "in your ",
                                    /*#__PURE__*/ _jsx("code", {
                                        className: "dev-tools-info-code",
                                        children: "next.config"
                                    }),
                                    ' ',
                                    "file."
                                ]
                            })
                        ]
                    })
                })
            ]
        })
    });
}
function ThemeIcon(param) {
    let { theme } = param;
    switch(theme){
        case 'system':
            return /*#__PURE__*/ _jsx(SystemIcon, {});
        case 'dark':
            return /*#__PURE__*/ _jsx(DarkIcon, {});
        case 'light':
            return /*#__PURE__*/ _jsx(LightIcon, {});
        default:
            return null;
    }
}
export const DEV_TOOLS_INFO_USER_PREFERENCES_STYLES = css(_templateObject());

//# sourceMappingURL=user-preferences.js.map