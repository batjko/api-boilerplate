import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { type AppLogger, createApp } from "../packages/api-core/src/index.ts";
import type { NodeConfig } from "../packages/config/src/index.ts";

const config: NodeConfig = {
  CORS_ORIGIN: ["*"],
  LOG_LEVEL: "info",
  NODE_ENV: "development",
  OTEL_EXPORTER_OTLP_ENDPOINT: undefined,
  PORT: 3000,
  SENTRY_DSN: undefined,
  SENTRY_ENVIRONMENT: "development",
  SENTRY_TRACES_SAMPLE_RATE: 0,
  SERVICE_NAME: "api-boilerplate",
};

const logger: AppLogger = {
  child() {
    return this;
  },
  debug() {},
  error() {},
  info() {},
  warn() {},
};

const openapiPath = path.resolve("apps/api-node/openapi/openapi.json");

const document = createApp({ config, logger }).getOpenAPI31Document({
  info: {
    title: config.SERVICE_NAME,
    version: "1.0.0",
  },
  openapi: "3.1.0",
});

await mkdir(path.dirname(openapiPath), { recursive: true });
await writeFile(openapiPath, `${JSON.stringify(document, null, 2)}\n`, "utf8");
