import type { StorybookConfig } from "@storybook/react-vite"
import path from "node:path"

const explorerTitle = "SMI-UI Component Explorer | Smicolon"
const explorerDescription =
  "Explore the SMI-UI component explorer for accessible React primitives, application blocks, and animated effects by Smicolon."
const explorerCanonical = "https://ui.smicolon.com/components/"

function appendManagerMetadata(head: string) {
  return `${head}
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
          "@smicolon/smi-ui": path.resolve(__dirname, "../../packages/smi-ui/src"),
        },
      },
    }
  },
}

export default config
