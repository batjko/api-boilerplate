import type { WorkerConfig } from "@repo/config";
import worker, { createWorkerApp } from "./index.js";

const config: WorkerConfig = {
  CORS_ORIGIN: ["https://example.com"],
  LOG_LEVEL: "info",
  NODE_ENV: "test",
  OTEL_EXPORTER_OTLP_ENDPOINT: undefined,
  SENTRY_DSN: undefined,
  SENTRY_ENVIRONMENT: "test",
  SENTRY_TRACES_SAMPLE_RATE: 0,
  SERVICE_NAME: "worker-test-service",
};

describe("api-worker adapter", () => {
  it("serves the shared app directly", async () => {
    const app = createWorkerApp(config);

    const response = await app.request("/healthz");
    expect(response.status).toBe(200);
  });

  it("exposes the fetch handler shape expected by worker runtimes", async () => {
    const response = await worker.fetch(
      new Request("https://example.com/openapi.json"),
      {
        CORS_ORIGIN: "*",
        LOG_LEVEL: "info",
        NODE_ENV: "test",
        OTEL_EXPORTER_OTLP_ENDPOINT: "",
        SENTRY_DSN: "",
        SENTRY_ENVIRONMENT: "test",
        SENTRY_TRACES_SAMPLE_RATE: "0",
        SERVICE_NAME: "worker-handler",
      },
    );

    expect(response.status).toBe(200);
  });
});
