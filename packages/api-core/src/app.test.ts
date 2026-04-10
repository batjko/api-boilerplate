import type { BaseConfig } from "@repo/config";
import { type AppLogger, createApp } from "./index.js";

const config: BaseConfig = {
  CORS_ORIGIN: ["*"],
  LOG_LEVEL: "info",
  NODE_ENV: "test",
  OTEL_EXPORTER_OTLP_ENDPOINT: undefined,
  SENTRY_DSN: undefined,
  SENTRY_ENVIRONMENT: "test",
  SENTRY_TRACES_SAMPLE_RATE: 0,
  SERVICE_NAME: "test-service",
};

const createTestLogger = (): AppLogger => {
  return {
    child() {
      return this;
    },
    debug() {},
    error() {},
    info() {},
    warn() {},
  };
};

describe("createApp", () => {
  it("serves health and readiness routes", async () => {
    const app = createApp({ config, logger: createTestLogger() });

    const healthResponse = await app.request("/healthz");
    expect(healthResponse.status).toBe(200);
    await expect(healthResponse.json()).resolves.toEqual({
      message: "ok",
      service: "test-service",
      status: "ok",
    });

    const readinessResponse = await app.request("/readyz");
    expect(readinessResponse.status).toBe(200);
  });

  it("returns the standard error envelope for validation failures", async () => {
    const app = createApp({ config, logger: createTestLogger() });

    const response = await app.request("/examples/echo", {
      body: JSON.stringify({}),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: {
        code: "invalid_request",
        message: "Request validation failed",
      },
    });
  });

  it("forwards request ids into the error envelope", async () => {
    const app = createApp({ config, logger: createTestLogger() });

    const response = await app.request("/missing", {
      headers: {
        "x-request-id": "req-123",
      },
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "not_found",
        message: "Route not found",
        requestId: "req-123",
      },
    });
  });
});
