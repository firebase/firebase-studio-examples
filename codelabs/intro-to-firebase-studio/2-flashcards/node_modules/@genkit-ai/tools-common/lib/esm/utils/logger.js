import * as clc from 'colorette';
import * as winston from 'winston';
export const logger = winston.createLogger({
    level: process.env.DEBUG ? 'debug' : 'info',
    format: winston.format.printf((log) => {
        if (log.level === 'info')
            return log.message;
        let levelColor;
        switch (log.level) {
            case 'error':
                levelColor = clc.red;
                break;
            case 'warn':
                levelColor = clc.yellow;
                break;
            default:
                levelColor = (text) => text.toString();
                break;
        }
        const level = log.level.charAt(0).toUpperCase() + log.level.slice(1);
        return `${clc.bold(levelColor(level))}: ${log.message}`;
    }),
    transports: [new winston.transports.Console()],
});
//# sourceMappingURL=logger.js.map