import "dotenv/config";
import { serve } from "@hono/node-server";
import { loadNodeConfig } from "@repo/config";
import { createNodeApp } from "./app.js";
import { createLogger } from "./logger.js";
import { setupObservability } from "./observability.js";

const main = async (): Promise<void> => {
  const config = loadNodeConfig();
  const logger = createLogger(config);
  const observability = await setupObservability(config, logger);
  const app = createNodeApp(config, logger);

  const server = serve(
    {
      fetch: app.fetch,
      port: config.PORT,
    },
    (info) => {
      logger.info("server started", {
        host: info.address,
        port: info.port,
      });
    },
  );

  const shutdown = async (signal: string) => {
    logger.info("shutdown requested", { signal });
    server.close();
    await observability.shutdown();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
};

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
