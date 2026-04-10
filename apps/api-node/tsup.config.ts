import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  entry: [
    "src/app.ts",
    "src/logger.ts",
    "src/observability.ts",
    "src/server.ts",
  ],
  format: ["esm"],
  noExternal: ["@repo/api-core", "@repo/config", "@repo/contracts"],
});
