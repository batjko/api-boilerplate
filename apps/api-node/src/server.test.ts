import type { AppLogger } from "@repo/api-core";
import type { NodeConfig } from "@repo/config";
import { createNodeApp } from "./app.js";

const logger: AppLogger = {
  child() {
    return this;
  },
  debug() {},
  error() {},
  info() {},
  warn() {},
};

const config: NodeConfig = {
  CORS_ORIGIN: ["*"],
  LOG_LEVEL: "info",
  NODE_ENV: "test",
  OTEL_EXPORTER_OTLP_ENDPOINT: undefined,
  PORT: 3001,
  SENTRY_DSN: undefined,
  SENTRY_ENVIRONMENT: "test",
  SENTRY_TRACES_SAMPLE_RATE: 0,
  SERVICE_NAME: "node-test-service",
};

describe("api-node adapter", () => {
  it("serves docs and openapi through the shared app", async () => {
    const app = createNodeApp(config, logger);

    const docsResponse = await app.request("/docs");
    expect(docsResponse.status).toBe(200);
    expect(docsResponse.headers.get("content-type")).toContain("text/html");

    const openapiResponse = await app.request("/openapi.json");
    expect(openapiResponse.status).toBe(200);
    await expect(openapiResponse.json()).resolves.toMatchObject({
      info: {
        title: "node-test-service",
      },
    });
  });
});
