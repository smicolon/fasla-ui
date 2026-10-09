import { defineConfig } from "tsup"

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
      "tokens/index": "src/tokens/index.ts",
      "motion/index": "src/motion/index.ts",
      "registry/index": "src/registry/index.ts",
      "lib/utils": "src/lib/utils.ts",
    },
    // CommonJS too, so `require("@smicolon/fasla-ui/tokens")` works: Tailwind 3
    // loads tailwind.config.* through require, and an import-only export fails
    // there with ERR_PACKAGE_PATH_NOT_EXPORTED. One config for both formats:
    // each config's `clean` empties its outDir, and they all run at once.
    format: ["esm", "cjs"],
    dts: true,
    // Everything in dist/ but the CLI, which the config below builds and cleans.
    clean: ["!cli/**"],
    external: ["react", "react-dom", "framer-motion", "tailwindcss"],
    treeshake: true,
    splitting: false,
  },
  {
    // The `fasla-ui` bin, run as `npx @smicolon/fasla-ui init`. Its packages
    // (commander, prompts, chalk, ora, fs-extra, jsonc-parser) are bundled in
    // and listed as devDependencies, so installing the library doesn't add
    // them to a project.
    entry: { index: "src/cli/index.ts" },
    outDir: "dist/cli",
    format: ["esm"],
    platform: "node",
    target: "node18",
    noExternal: [/.*/],
    clean: true,
    shims: true,
    splitting: false,
    // An ESM bundle has no `require`, and the CommonJS packages in it (prompts,
    // fs-extra) call it for Node's own modules.
    banner: {
      js: [
        "#!/usr/bin/env node",
        'import { createRequire as __faslaCreateRequire } from "node:module"',
        "const require = __faslaCreateRequire(import.meta.url)",
      ].join("\n"),
    },
  },
])
