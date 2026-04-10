import type { AppLogger, LogContext } from "@repo/api-core";
import type { NodeConfig } from "@repo/config";
import pino, { type LoggerOptions } from "pino";

const redactPaths = [
  "req.headers.authorization",
  "headers.authorization",
  "*.password",
  "*.secret",
];

export class PinoAppLogger implements AppLogger {
  constructor(private readonly logger: pino.Logger) {}

  child(bindings: LogContext): AppLogger {
    return new PinoAppLogger(this.logger.child(bindings));
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(context ?? {}, message);
  }

  error(message: string, context?: LogContext): void {
    this.logger.error(context ?? {}, message);
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(context ?? {}, message);
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(context ?? {}, message);
  }
}

export const createLogger = (config: NodeConfig): AppLogger => {
  const options: LoggerOptions = {
    level: config.LOG_LEVEL,
    redact: redactPaths,
  };

  if (config.NODE_ENV !== "production") {
    options.transport = {
      options: {
        colorize: true,
        ignore: "pid,hostname",
        translateTime: "HH:MM:ss",
      },
      target: "pino-pretty",
    };
  }

  const logger = pino({
    ...options,
    base: {
      service: config.SERVICE_NAME,
    },
  });

  return new PinoAppLogger(logger);
};
