import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    // The CLI runs in Node, not a browser, so its tests do too. Under jsdom,
    // import.meta.url isn't a file: URL, and a test that finds a file next to
    // itself fails.
    environmentMatchGlobs: [["src/cli/**", "node"]],
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/test/"],
    },
  },
})
