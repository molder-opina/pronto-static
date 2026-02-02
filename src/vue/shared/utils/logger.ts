type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMessage {
    level: LogLevel;
    module: string;
    message: string;
    timestamp: Date;
    data?: unknown;
}

const LOG_LEVEL = 'warn' as const;
const MODULE_LOG_LEVELS: Record<string, LogLevel> = {};

function shouldLog(module: string, level: LogLevel): boolean {
    const moduleLevel = MODULE_LOG_LEVELS[module] ?? LOG_LEVEL;
    const levels: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[moduleLevel];
}

function formatMessage(log: LogMessage): string {
    const timestamp = log.timestamp.toISOString().split('T')[1].slice(0, -1);
    return `[${timestamp}] [${log.level.toUpperCase()}] [${log.module}] ${log.message}`;
}

export function createLogger(module: string) {
    return {
        debug: (message: string, data?: unknown) => {
            if (!shouldLog(module, 'debug')) return;
            console.debug(formatMessage({ level: 'debug', module, message, timestamp: new Date(), data }));
        },
        info: (message: string, data?: unknown) => {
            if (!shouldLog(module, 'info')) return;
            console.info(formatMessage({ level: 'info', module, message, timestamp: new Date(), data }));
        },
        warn: (message: string, data?: unknown) => {
            if (!shouldLog(module, 'warn')) return;
            console.warn(formatMessage({ level: 'warn', module, message, timestamp: new Date(), data }));
        },
        error: (message: string, error?: unknown) => {
            if (!shouldLog(module, 'error')) return;
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(formatMessage({ level: 'error', module, message: `${message}: ${errorMessage}`, timestamp: new Date() }));
        },
        setLevel: (level: LogLevel) => {
            MODULE_LOG_LEVELS[module] = level;
        }
    };
}

export const logger = {
    create: createLogger,
    get: (module: string) => createLogger(module),
    setGlobalLevel: (level: LogLevel) => {
        console.warn(`[Logger] Global log level set to ${level}`);
    }
};
