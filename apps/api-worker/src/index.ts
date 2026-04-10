import { type AppLogger, createApp, type LogContext } from "@repo/api-core";
import {
  loadWorkerConfig,
  type WorkerConfig,
  type WorkerEnvInput,
} from "@repo/config";

class WorkerLogger implements AppLogger {
  constructor(private readonly bindings: LogContext = {}) {}

  child(bindings: LogContext): AppLogger {
    return new WorkerLogger({
      ...this.bindings,
      ...bindings,
    });
  }

  debug(message: string, context?: LogContext): void {
    console.debug(message, { ...this.bindings, ...context });
  }

  error(message: string, context?: LogContext): void {
    console.error(message, { ...this.bindings, ...context });
  }

  info(message: string, context?: LogContext): void {
    console.info(message, { ...this.bindings, ...context });
  }

  warn(message: string, context?: LogContext): void {
    console.warn(message, { ...this.bindings, ...context });
  }
}

export interface WorkerEnv extends WorkerEnvInput {}

export const createWorkerApp = (config: WorkerConfig) => {
  return createApp({
    config,
    logger: new WorkerLogger({
      service: config.SERVICE_NAME,
    }),
  });
};

const handler = {
  fetch(request: Request, env: WorkerEnv) {
    const config = loadWorkerConfig(env);
    const app = createWorkerApp(config);
    return app.fetch(request, env);
  },
};

export default handler;
