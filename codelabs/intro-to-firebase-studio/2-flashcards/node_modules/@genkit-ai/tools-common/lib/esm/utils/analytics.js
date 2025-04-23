import { createInterface } from 'readline/promises';
import { v4 as uuidV4 } from 'uuid';
import { configstore, getUserSettings } from './configstore';
import { logger } from './logger';
import { toolsPackage } from './package';
export const ANALYTICS_OPT_OUT_CONFIG_TAG = 'analyticsOptOut';
class GAEvent {
    parameters;
    stickyParameters;
}
export class PageViewEvent extends GAEvent {
    name = 'page_view';
    duration = 1;
    constructor(page_title) {
        super();
        this.parameters = { page_title };
    }
}
export class FirstUsageEvent extends GAEvent {
    name = 'first_visit';
    duration = 1;
    constructor() {
        super();
    }
}
export class ToolsRequestEvent extends GAEvent {
    name = 'tools_request';
    duration = 1;
    constructor(route) {
        super();
        this.parameters = { route };
    }
}
export class RunCommandEvent extends GAEvent {
    name = 'run_command';
    duration = 1;
    constructor(command) {
        super();
        this.stickyParameters = { command };
    }
}
export class InitEvent extends GAEvent {
    name = 'init';
    duration = 1;
    constructor(platform) {
        super();
        this.parameters = { platform };
    }
}
export class ConfigEvent extends GAEvent {
    name = 'config_set';
    duration = 1;
    constructor(key) {
        super();
        this.parameters = { key };
    }
}
export async function record(event) {
    if (!isAnalyticsEnabled())
        return;
    await recordInternal(event, getSession());
}
export async function notifyAnalyticsIfFirstRun() {
    if (!isAnalyticsEnabled())
        return;
    if (configstore.get(NOTIFICATION_ACKED)) {
        return;
    }
    console.log(ANALYTICS_NOTIFICATION);
    await readline.question('Press "Enter" to continue');
    configstore.set(NOTIFICATION_ACKED, true);
    await record(new FirstUsageEvent());
}
export function getAnalyticsSettings() {
    if (!isAnalyticsEnabled()) {
        return { enabled: false };
    }
    const session = getSession();
    return {
        enabled: true,
        property: GA_INFO.property,
        measurementId: GA_INFO.measurementId,
        apiSecret: GA_INFO.apiSecret,
        clientId: session.clientId,
        sessionId: session.sessionId,
        debug: {
            debugMode: isDebugMode(),
            validateOnly: isValidateOnly(),
        },
    };
}
const ANALYTICS_NOTIFICATION = 'Genkit CLI and Developer UI use cookies and ' +
    'similar technologies from Google\nto deliver and enhance the quality of its ' +
    'services and to analyze usage.\n' +
    'Learn more at https://policies.google.com/technologies/cookies';
const NOTIFICATION_ACKED = 'analytics_notification';
const CONFIGSTORE_CLIENT_KEY = 'genkit-tools-ga-id';
const GA_INFO = {
    property: 'genkit-tools',
    measurementId: 'G-2K1MPK763J',
    apiSecret: 'UccV7rIoTF6II6E9zYX5Ow',
};
const GA_USER_PROPS = {
    node_platform: {
        value: process.platform,
    },
    node_version: {
        value: process.version,
    },
    tools_version: {
        value: toolsPackage.version,
    },
};
const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
});
function isDebugMode() {
    return !!process.env['GENKIT_GA_DEBUG'];
}
function isValidateOnly() {
    return !!process.env['GENKIT_GA_VALIDATE'];
}
function isAnalyticsEnabled() {
    return (!process.argv.includes('--non-interactive') &&
        !getUserSettings()[ANALYTICS_OPT_OUT_CONFIG_TAG]);
}
async function recordInternal(event, session) {
    Object.assign(session.stickyParameters, event.stickyParameters);
    const joinedParams = { ...session.stickyParameters, ...event.parameters };
    const validate = isValidateOnly();
    const search = `?api_secret=${GA_INFO.apiSecret}&measurement_id=${GA_INFO.measurementId}`;
    const validatePath = isValidateOnly() ? 'debug/' : '';
    const url = `https://www.google-analytics.com/${validatePath}mp/collect${search}`;
    const body = {
        timestamp_micros: `${Date.now()}000`,
        client_id: session.clientId,
        user_properties: {
            ...GA_USER_PROPS,
        },
        validationBehavior: validate ? 'ENFORCE_RECOMMENDATIONS' : undefined,
        events: [
            {
                name: event.name,
                params: {
                    session_id: session.sessionId,
                    engagement_time_msec: event.duration
                        .toFixed(3)
                        .replace('.', '')
                        .replace(/^0+/, ''),
                    debug_mode: isDebugMode() ? true : undefined,
                    ...joinedParams,
                },
            },
        ],
    };
    if (validate) {
        logger.info(`Sending Analytics for event ${event.name}`, joinedParams, body);
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify(body),
        });
        if (validate) {
            if (!response.ok) {
                logger.warn(`Analytics validation HTTP error: ${response.status}`);
            }
            const respBody = await response.text;
            logger.info(`Analytics validation result: ${respBody}`);
        }
    }
    catch (e) {
        if (validate) {
            throw e;
        }
        return;
    }
}
let currentSession = undefined;
function getSession() {
    if (currentSession) {
        return currentSession;
    }
    let clientId = configstore.get(CONFIGSTORE_CLIENT_KEY);
    if (!clientId) {
        clientId = uuidV4();
        configstore.set(CONFIGSTORE_CLIENT_KEY, clientId);
    }
    currentSession = {
        clientId,
        sessionId: (Math.random() * Number.MAX_SAFE_INTEGER).toFixed(0),
        totalEngagementSeconds: 0,
        stickyParameters: {},
    };
    return currentSession;
}
//# sourceMappingURL=analytics.js.map