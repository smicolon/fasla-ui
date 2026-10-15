/**
 * The inverse tokens' mapping, as a developer adds it by hand. The
 * theme-inverse registry item installs the same lines; a test holds the two
 * together (tests/inverse-tokens.test.mjs).
 */

/** Tailwind 4: inside the stylesheet's `@theme inline` block. */
export const INVERSE_CSS = [
  "--color-background-inverse: var(--background-inverse, var(--foreground));",
  "--color-foreground-inverse: var(--foreground-inverse, var(--background));",
  "--color-muted-foreground-inverse: var(--muted-foreground-inverse, color-mix(in oklab, var(--background) 75%, var(--foreground)));",
].join("\n")

/** Tailwind 3: under `theme.extend.colors` in tailwind.config. */
export const INVERSE_CONFIG = [
  `"background-inverse": "color-mix(in oklch, var(--background-inverse, theme(colors.foreground)) calc(<alpha-value> * 100%), transparent)",`,
  `"foreground-inverse": "color-mix(in oklch, var(--foreground-inverse, theme(colors.background)) calc(<alpha-value> * 100%), transparent)",`,
  `"muted-foreground-inverse": "color-mix(in oklch, var(--muted-foreground-inverse, color-mix(in oklab, theme(colors.background) 75%, theme(colors.foreground))) calc(<alpha-value> * 100%), transparent)",`,
].join("\n")
