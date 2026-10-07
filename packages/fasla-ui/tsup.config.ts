import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "tokens/index": "src/tokens/index.ts",
    "motion/index": "src/motion/index.ts",
    "registry/index": "src/registry/index.ts",
    "lib/utils": "src/lib/utils.ts",
  },
  // CommonJS too, so `require("@smicolon/fasla-ui/tokens")` works: Tailwind 3
  // loads tailwind.config.* through require, and an import-only export fails
  // there with ERR_PACKAGE_PATH_NOT_EXPORTED. One config, not two: tsup runs an
  // array of configs at once, and each one's `clean` empties the shared dist/.
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "framer-motion", "tailwindcss"],
  treeshake: true,
  splitting: false,
})
