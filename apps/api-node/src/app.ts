import { type AppLogger, createApp } from "@repo/api-core";
import type { NodeConfig } from "@repo/config";

export const createNodeApp = (config: NodeConfig, logger: AppLogger) => {
  return createApp({
    config,
    logger,
  });
};
