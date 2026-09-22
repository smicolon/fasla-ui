import type { Config } from "tailwindcss"
import faslaTypography from "../../packages/fasla-ui/tailwind-preset"
import { tailwindSemanticColors } from "../../packages/fasla-ui/src/tokens/tailwind"

const config: Config = {
  // Fonts and the direction-aware type ramp live in the shared preset, so the
  // explorer renders components exactly as the docs site does.
  presets: [faslaTypography],
  darkMode: "class",
  content: [
    // The direction decorator lives here and is the only user of `font-arabic`.
    "./.storybook/**/*.{js,ts,jsx,tsx}",
    "./stories/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/fasla-ui/registry/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // The 41 Figma `theme/*` tokens, from the same shared definition the docs
      // site uses, so the two apps cannot drift apart at the config level.
      // Storybook adds none of its own: everything here comes from Figma.
      colors: tailwindSemanticColors,
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}

export default config
