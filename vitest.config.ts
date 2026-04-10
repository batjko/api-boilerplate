import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const fromRoot = (relativePath: string): string => {
  return fileURLToPath(new URL(relativePath, import.meta.url));
};

export default defineConfig({
  resolve: {
    alias: {
      "@repo/api-core": fromRoot("./packages/api-core/src/index.ts"),
      "@repo/config": fromRoot("./packages/config/src/index.ts"),
      "@repo/contracts": fromRoot("./packages/contracts/src/index.ts"),
    },
  },
  test: {
    coverage: {
      include: ["packages/**/*.ts", "apps/**/*.ts", "scripts/**/*.ts"],
      reporter: ["text", "html"],
    },
    environment: "node",
    globals: true,
    include: ["packages/**/*.test.ts", "apps/**/*.test.ts"],
  },
});
