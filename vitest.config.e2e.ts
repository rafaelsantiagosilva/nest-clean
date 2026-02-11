import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    include: ["**/*.e2e-spec.ts"],
    globals: true,
    root: "./",
    hookTimeout: 60_000,
    testTimeout: 60_000,
    sequence: {
      concurrent: false
    },
  },
  plugins: [
    swc.vite({
      module: { type: "es6" }
    }),
    tsConfigPaths()
  ]
});