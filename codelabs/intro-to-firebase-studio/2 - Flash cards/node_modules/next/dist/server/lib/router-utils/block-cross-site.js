"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "blockCrossSite", {
    enumerable: true,
    get: function() {
        return blockCrossSite;
    }
});
const _url = require("../../../lib/url");
const _net = /*#__PURE__*/ _interop_require_default(require("net"));
const _log = require("../../../build/output/log");
const _csrfprotection = require("../../app-render/csrf-protection");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const blockCrossSite = (req, res, allowedOrigins, activePort)=>{
    var _req_url;
    // only process _next URLs
    if (!((_req_url = req.url) == null ? void 0 : _req_url.includes('/_next'))) {
        return false;
    }
    // block non-cors request from cross-site e.g. script tag on
    // different host
    if (req.headers['sec-fetch-mode'] === 'no-cors' && req.headers['sec-fetch-site'] === 'cross-site') {
        if ('statusCode' in res) {
            res.statusCode = 403;
        }
        res.end('Unauthorized');
        (0, _log.warnOnce)(`Blocked cross-origin request to /_next/*. Cross-site requests are blocked in "no-cors" mode.`);
        return true;
    }
    // ensure websocket requests from allowed origin
    const rawOrigin = req.headers['origin'];
    if (rawOrigin) {
        const parsedOrigin = (0, _url.parseUrl)(rawOrigin);
        if (parsedOrigin) {
            const originLowerCase = parsedOrigin.hostname.toLowerCase();
            const isMatchingPort = parsedOrigin.port === activePort;
            const isIpRequest = _net.default.isIPv4(originLowerCase) || _net.default.isIPv6(originLowerCase);
            if (// allow requests if direct IP and matching port and
            // allow if any of the allowed origins match
            !(isIpRequest && isMatchingPort) && !(0, _csrfprotection.isCsrfOriginAllowed)(originLowerCase, allowedOrigins)) {
                if ('statusCode' in res) {
                    res.statusCode = 403;
                }
                res.end('Unauthorized');
                (0, _log.warnOnce)(`Blocked cross-origin request from ${originLowerCase}. To allow this, configure "allowedDevOrigins" in next.config\nRead more: https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins`);
                return true;
            }
        }
    }
    return false;
};

//# sourceMappingURL=block-cross-site.js.map