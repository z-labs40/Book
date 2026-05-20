"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const config_1 = require("../config");
const { combine, timestamp, printf, colorize } = winston_1.format;
const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});
exports.logger = (0, winston_1.createLogger)({
    level: config_1.config.nodeEnv === 'production' ? 'info' : 'debug',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), colorize(), customFormat),
    transports: [
        new winston_1.transports.Console()
    ],
});
