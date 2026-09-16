import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "tokens/index": "src/tokens/index.ts",
    "motion/index": "src/motion/index.ts",
    "registry/index": "src/registry/index.ts",
    "lib/utils": "src/lib/utils.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "framer-motion", "tailwindcss"],
  treeshake: true,
  splitting: false,
})
