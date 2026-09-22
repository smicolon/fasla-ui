import type { Config } from "tailwindcss"
import faslaTypography from "../../packages/fasla-ui/tailwind-preset"
import {
  semanticColor as t,
  tailwindSemanticColors,
} from "../../packages/fasla-ui/src/tokens/tailwind"

const config: Config = {
  // Fonts and the direction-aware type ramp live in the shared preset, so the
  // docs site and Storybook cannot drift apart.
  presets: [faslaTypography],
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/fasla-ui/registry/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The 41 Figma `theme/*` tokens. One shared definition for both apps
        // and for library consumers — see packages/fasla-ui/src/tokens/tailwind.ts.
        // Imported from source, not from the built package, because a Tailwind
        // config has to resolve before `bun run build` has produced dist/.
        ...tailwindSemanticColors,

        // ── Not from Figma. Docs-only, and not part of the token contract. ──

        // A dark code surface in both themes. Tokenised, never hardcoded.
        terminal: {
          DEFAULT: t("terminal"),
          foreground: t("terminal-foreground"),
          muted: t("terminal-muted"),
          subtle: t("terminal-subtle"),
          border: t("terminal-border"),
          accent: t("terminal-accent"),
          caret: t("terminal-caret"),
        },
        // Brand V2.5 §13 — the canonical three, plus the docs code accent.
        // `fasla.red` is the brand red, deliberately separate from `primary`,
        // which Figma defines as the strong neutral.
        fasla: {
          red: t("fasla-red"),
          ink: t("fasla-ink"),
          white: t("fasla-white"),
          cyan: t("fasla-cyan"),
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
      },
      animation: {
        "fade-in": "fade-in 0.7s ease-out backwards",
        "fade-in-up": "fade-in-up 0.6s ease-out backwards",
        "slide-top": "slide-top 0.6s ease-out backwards",
        "slide-left": "slide-left 0.6s ease-out backwards",
        shimmer: "shimmer var(--shimmer-duration, 2s) infinite",
        "scale-in": "scale-in 0.5s ease-out backwards",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-top": {
          from: { transform: "translateY(30px)", opacity: "0" },
          to: { transform: "translateY(0px)", opacity: "1" },
        },
        "slide-left": {
          from: { transform: "translateX(20px)", opacity: "0" },
          to: { transform: "translateX(0px)", opacity: "1" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "scale-in": {
          from: { transform: "scale(0.9)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}

export default config
