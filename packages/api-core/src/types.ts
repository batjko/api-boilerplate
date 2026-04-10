import type { BaseConfig } from "@repo/config";

export type LogContext = Record<string, unknown>;

export interface AppLogger {
  child(bindings: LogContext): AppLogger;
  debug(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
}

export interface AppServices {
  config: BaseConfig;
  logger: AppLogger;
}

export interface AppBindings {
  Variables: {
    logger: AppLogger;
    requestId: string;
  };
}
