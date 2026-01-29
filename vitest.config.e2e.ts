import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    include: ["**/*.e2e-spec"],
    globals: true,
    root: "./",
    setupFiles: ["./test/setup-e2e"],
    hookTimeout: 60_000,
    testTimeout: 60_000
  },
  plugins: [
    swc.vite({
      module: { type: "es6" }
    }),
    tsConfigPaths()
  ]
});