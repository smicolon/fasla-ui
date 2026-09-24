import type { StorybookConfig } from "@storybook/react-vite"
import path from "node:path"
import { createRequire } from "node:module"

// The docs app gets Geist from the `geist` package via next/font/local, which
// Vite cannot use. Point at the same binaries instead, so the explorer renders
// the identical face rather than a lookalike from another registry.
// `geist/font/sans` is an exported entry resolving to dist/sans.js; the woff2
// files sit alongside it. Resolving through the package keeps this correct
// wherever the workspace hoists node_modules to.
const geistFontsDirectory = path.join(
  path.dirname(createRequire(import.meta.url).resolve("geist/font/sans")),
  "fonts"
)

const explorerTitle = "Fasla Component Explorer | Smicolon"
const explorerDescription =
  "Explore the Fasla component explorer for accessible React primitives, application blocks, and animated effects by Smicolon."
const explorerCanonical = "https://ui.smicolon.com/components/"

function appendManagerMetadata(head: string) {
  return `${head}
    <link rel="icon" type="image/svg+xml" href="/brand/fasla-favicon.svg">
    <meta name="description" content="${explorerDescription}">
    <link rel="canonical" href="${explorerCanonical}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${explorerTitle}">
    <meta property="og:description" content="${explorerDescription}">
    <meta property="og:url" content="${explorerCanonical}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${explorerTitle}">
    <meta name="twitter:description" content="${explorerDescription}">
  `
}

const config: StorybookConfig = {
  staticDirs: ["../../docs/public"],
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    // Renders :hover / :focus-visible statically, so a states grid shows the
    // real pseudo-states rather than a hand-written imitation that can drift
    // from the component.
    "storybook-addon-pseudo-states",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  managerHead: appendManagerMetadata,
  previewHead: (head) => `${head}
    <meta name="robots" content="noindex,follow">
  `,
  viteFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          "@smicolon/fasla-ui": path.resolve(__dirname, "../../packages/fasla-ui/src"),
          // Consumed by the @font-face rules in src/styles/fonts.css.
          "@geist-fonts": geistFontsDirectory,
        },
      },
    }
  },
}

export default config
