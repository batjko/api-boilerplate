import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NodeSDK } from "@opentelemetry/sdk-node";
import type { AppLogger } from "@repo/api-core";
import type { NodeConfig } from "@repo/config";
import * as Sentry from "@sentry/node";

export interface ObservabilityHandle {
  shutdown(): Promise<void>;
}

const noopHandle: ObservabilityHandle = {
  async shutdown() {},
};

export const setupObservability = async (
  config: NodeConfig,
  logger: AppLogger,
): Promise<ObservabilityHandle> => {
  let sdk: NodeSDK | undefined;

  if (config.OTEL_EXPORTER_OTLP_ENDPOINT) {
    sdk = new NodeSDK({
      instrumentations: [getNodeAutoInstrumentations()],
      serviceName: config.SERVICE_NAME,
      traceExporter: new OTLPTraceExporter({
        url: config.OTEL_EXPORTER_OTLP_ENDPOINT,
      }),
    });

    await sdk.start();
    logger.info("OpenTelemetry initialized", {
      endpoint: config.OTEL_EXPORTER_OTLP_ENDPOINT,
    });
  }

  if (config.SENTRY_DSN) {
    Sentry.init({
      dsn: config.SENTRY_DSN,
      environment: config.SENTRY_ENVIRONMENT ?? config.NODE_ENV,
      release: "local",
      tracesSampleRate: config.SENTRY_TRACES_SAMPLE_RATE,
    });

    logger.info("Sentry initialized");
  }

  if (!sdk) {
    return noopHandle;
  }

  return {
    async shutdown() {
      await sdk?.shutdown();
    },
  };
};
