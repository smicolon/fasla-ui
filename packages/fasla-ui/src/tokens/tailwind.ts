/**
 * Tailwind mapping for the Fasla semantic colour tokens.
 *
 * These are the 41 `theme/*` variables of the Figma "☾ Mode" collection. Figma
 * is the source of truth; `design/tokens/mode.json` holds the committed
 * snapshot, and both apps declare the same values in their own `globals.css`.
 *
 * Spread this into `theme.extend.colors` and define the matching CSS variables
 * as full colours (hex or oklch) on `:root` and `.dark`.
 */

/**
 * Resolve a semantic token to a colour Tailwind can apply an opacity modifier to.
 *
 * A bare `var(--x)` does NOT work: in Tailwind 3 the `/opacity` modifier is
 * silently dropped when the colour is an unparseable string, so `bg-primary/10`
 * compiles to no rule at all. Wrapping in `color-mix` with the `<alpha-value>`
 * placeholder keeps both `bg-primary` and `bg-primary/10` working, while letting
 * the CSS variables stay full colours rather than bare channel triplets.
 *
 * Needs Chrome 111+, Safari 16.2+, Firefox 113+.
 */
export const semanticColor = (name: string) =>
  `color-mix(in oklch, var(--${name}) calc(<alpha-value> * 100%), transparent)`

const c = semanticColor

export const tailwindSemanticColors = {
  // Surfaces
  background: c("background"),
  foreground: c("foreground"),
  card: { DEFAULT: c("card"), foreground: c("card-foreground") },
  popover: { DEFAULT: c("popover"), foreground: c("popover-foreground") },

  // Actions. `primary` is Figma's strong neutral (#0a0a0a light, #fafafa dark),
  // identical to `foreground` in both modes. It is NOT a brand accent — an app
  // that wants its brand colour should define its own token for it.
  primary: { DEFAULT: c("primary"), foreground: c("primary-foreground") },
  secondary: { DEFAULT: c("secondary"), foreground: c("secondary-foreground") },
  muted: { DEFAULT: c("muted"), foreground: c("muted-foreground") },
  accent: { DEFAULT: c("accent"), foreground: c("accent-foreground") },
  destructive: {
    DEFAULT: c("destructive"),
    foreground: c("destructive-foreground"),
  },

  // Lines and focus
  border: c("border"),
  input: c("input"),
  ring: c("ring"),

  // Status
  success: { DEFAULT: c("success"), foreground: c("success-foreground") },
  warning: { DEFAULT: c("warning"), foreground: c("warning-foreground") },
  info: { DEFAULT: c("info"), foreground: c("info-foreground") },

  // Inverse — a fixed contrast band, not a mode-reactive surface.
  "background-inverse": c("background-inverse"),
  "foreground-inverse": c("foreground-inverse"),
  "muted-foreground-inverse": c("muted-foreground-inverse"),

  // Charts
  "chart-1": c("chart-1"),
  "chart-2": c("chart-2"),
  "chart-3": c("chart-3"),
  "chart-4": c("chart-4"),
  "chart-5": c("chart-5"),

  sidebar: {
    DEFAULT: c("sidebar"),
    foreground: c("sidebar-foreground"),
    primary: c("sidebar-primary"),
    "primary-foreground": c("sidebar-primary-foreground"),
    accent: c("sidebar-accent"),
    "accent-foreground": c("sidebar-accent-foreground"),
    border: c("sidebar-border"),
    ring: c("sidebar-ring"),
  },
}
