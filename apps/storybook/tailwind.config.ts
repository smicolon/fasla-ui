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
    // The Logo Cloud stories' example marks bind some parts to theme tokens (fill-foreground).
    "../docs/components/blocks/brand-logos.tsx",
    // The Authentications examples (logo, photos) the stories share with the docs site.
    "../docs/components/blocks/authentications-examples.tsx",
    // The Navbar examples (logo, avatar, the page under the bar) the stories share with the docs site.
    "../docs/components/blocks/navbar-examples.tsx",
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
        // Figma `border radius/xl`, 14px: what rounded-xl draws on the docs
        // site. Not the docs' `var(--radius) + 4px`: Storybook's --radius is
        // 8px, not the docs' 10px, so that would draw 12px here.
        xl: "0.875rem",
      },
    },
  },
  plugins: [],
}

export default config
