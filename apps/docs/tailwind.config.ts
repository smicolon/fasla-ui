import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/fasla-ui/registry/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Brand V2.5 §14 — product tier.
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        // Brand V2.5 §14 — the Arabic face. Geist has no Arabic coverage.
        arabic: ["var(--font-cairo)", "system-ui", "sans-serif"],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // A dark code surface in both themes. Tokenised, never hardcoded.
        terminal: {
          DEFAULT: "var(--terminal)",
          foreground: "var(--terminal-foreground)",
          muted: "var(--terminal-muted)",
          subtle: "var(--terminal-subtle)",
          border: "var(--terminal-border)",
          accent: "var(--terminal-accent)",
          caret: "var(--terminal-caret)",
        },
        // Brand V2.5 §13 — the canonical three, plus the docs code accent.
        fasla: {
          red: "var(--fasla-red)",
          ink: "var(--fasla-ink)",
          white: "var(--fasla-white)",
          cyan: "var(--fasla-cyan)",
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
