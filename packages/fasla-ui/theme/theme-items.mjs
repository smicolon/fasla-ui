/**
 * The Fasla theme as shadcn registry items, generated from the Figma
 * snapshots in design/tokens — the same files the docs and Storybook
 * globals.css, tokens/tailwind.ts and tailwind-preset.ts are tested against,
 * so the items can't drift from them.
 *
 *   theme-base  every project: the tokens shadcn doesn't have, the type ramp
 *               with Arabic line heights, and the Arabic setting. Never
 *               overwrites a token the project already has.
 *   theme       Fasla's colours: the full light and dark palette, radius and
 *               the page set in Geist, on top of theme-base. Overwrites, by
 *               choice.
 *   font-cairo  the Arabic font, on --font-arabic. theme-base depends on it.
 *   font-geist  the Latin font, on --font-sans. Installed beside theme, not as
 *               its dependency: next/font/google has no Geist before Next.js
 *               15, where the template loads it locally instead.
 *
 * Plain JavaScript, so build-registry.mjs runs it with Node and the tests
 * import it as is.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..")

/**
 * The colour tokens a shadcn project already has on Tailwind 4 (`shadcn init`,
 * every base colour). theme-base adds every Fasla token outside this list, and
 * none inside it.
 */
export const SHADCN_TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
]

/**
 * Names a shadcn project on Tailwind 3 maps in tailwind.config as
 * `hsl(var(--x))`, with the token stored as bare HSL channels. theme-base must
 * not remap them: a hex-reading mapping over HSL channels is no colour at all.
 */
export const SHADCN_V3_MAPPED = [...SHADCN_TOKENS, "destructive-foreground"]

/** The Fasla look, the way tokens/tailwind.ts resolves every token. */
export const semanticColor = (name) => `color-mix(in oklch, var(--${name}) calc(<alpha-value> * 100%), transparent)`

/** The Figma snapshots. `root` is the repository, for tests that use a copy. */
export function loadSources(root = REPO) {
  const read = (file) => JSON.parse(readFileSync(path.join(root, "design/tokens", file), "utf8"))
  return { mode: read("mode.json"), typography: read("typography.json") }
}

/** Every Fasla colour token, in the snapshot's order. */
export function tokenNames(mode) {
  return Object.keys(mode.tokens)
}

/** The tokens theme-base adds: Fasla's, less the ones shadcn already has. */
export function baseTokenNames(mode) {
  return tokenNames(mode).filter((name) => !SHADCN_TOKENS.includes(name))
}

/**
 * Tailwind 3 colours for these token names, nested the way tokens/tailwind.ts
 * nests them: `soft.primary`, `sidebar.accent`, `card.foreground`, and flat
 * names for the rest.
 */
export function tailwindV3Colors(names, all = names) {
  const colors = {}
  const group = (key) => (colors[key] = typeof colors[key] === "object" ? colors[key] : {})
  for (const name of names) {
    if (name.startsWith("soft-")) group("soft")[name.slice(5)] = semanticColor(name)
    else if (name === "sidebar") group("sidebar").DEFAULT = semanticColor(name)
    else if (name.startsWith("sidebar-")) group("sidebar")[name.slice(8)] = semanticColor(name)
    else if (name.endsWith("-foreground") && all.includes(name.slice(0, -11)) && name !== "muted-foreground-inverse") {
      group(name.slice(0, -11)).foreground = semanticColor(name)
    } else if (all.includes(`${name}-foreground`) && name !== "background") group(name).DEFAULT = semanticColor(name)
    else colors[name] = semanticColor(name)
  }
  return colors
}

const rem = (px) => `${px / 16}rem`
/** Exact and unitless, as tailwind-preset.ts writes it: CSS divides at full precision. */
const ratio = (lineHeight, size) => `calc(${lineHeight} / ${size})`

/** `--leading-<rung>` for one script, `en` or `ar`. */
function leadingVars(typography, script) {
  return Object.fromEntries(
    Object.entries(typography.ramp).map(([rung, r]) => [`--leading-${rung}`, ratio(r[script].lineHeight, r.size)])
  )
}

/**
 * The Arabic font stack: one variable to swap it, Cairo when nothing sets it —
 * "Cairo Variable" as fontsource names it outside Next.js, "Cairo" otherwise.
 */
const ARABIC_FONT = ['var(--font-arabic, "Cairo Variable", "Cairo")', "system-ui", "sans-serif"]

/**
 * Greyscale antialiasing, as the Next.js templates set it on the root. Without
 * it macOS draws text with subpixel smoothing, about a tenth more ink: Geist
 * and Cairo at the same weight look a step heavier in a Vite app than in a
 * Next.js one. Measured identical once it is set.
 */
const SMOOTHING = { "-webkit-font-smoothing": "antialiased", "-moz-osx-font-smoothing": "grayscale" }

/** The Arabic setting (Brand V2.5 §15), as the docs app's globals.css states it. */
const ARABIC_RULES = {
  '[dir="rtl"]': {
    // One variable to swap the Arabic font: point --font-arabic at another.
    "font-family": ARABIC_FONT.join(", "),
    // Cairo renders the same in every app. Arabic only: a brand's Latin text
    // keeps whatever smoothing it has.
    ...SMOOTHING,
  },
  // Arabic is never letter-spaced, set in capitals or in italic.
  '[dir="rtl"], [dir="rtl"] *': { "letter-spacing": "0" },
  '[dir="rtl"] .uppercase': { "text-transform": "none" },
  '[dir="rtl"] .italic, [dir="rtl"] em, [dir="rtl"] i': { "font-style": "normal" },
  // Code, numbers set as figures, and anything monospace stay Latin and LTR.
  // `isolate`, not `embed`, so `<input>` is never drawn `>input<`.
  '[dir="rtl"] code, [dir="rtl"] pre, [dir="rtl"] kbd, [dir="rtl"] samp, [dir="rtl"] .font-mono, [dir="rtl"] .tabular-nums': {
    direction: "ltr",
    "unicode-bidi": "isolate",
    "text-align": "start",
  },
}

/**
 * The page's Latin font, for the colours layer. Not in a layer, so it
 * outweighs a stylesheet's own `body { font-family }` — the Next.js template
 * sets Arial there. The fallbacks matter: in a Next.js app --font-sans lives
 * only in Tailwind's inline theme, and next/font sets --font-geist-sans; with
 * fontsource the family is "Geist Variable".
 */
export const LATIN_FONT = 'var(--font-sans, var(--font-geist-sans, "Geist Variable", "Geist")), ui-sans-serif, system-ui, sans-serif'

/**
 * The page colours, for the colours layer, against the stylesheet the
 * Next.js templates ship. Both 14 and 16 declare
 *
 *   :root { --background: #ffffff; --foreground: #171717 }
 *   @media (prefers-color-scheme: dark) { :root { --background: #0a0a0a; --foreground: #ededed } }
 *
 * outside any layer, and the shadcn CLI keeps both. Fasla's dark mode is the
 * `.dark` class, so those rules break it two ways:
 *
 * - With the OS in dark mode and no `.dark`, the media rule turns the page
 *   black while every component stays light: a #0a0a0a primary button on a
 *   #0a0a0a page. `:root:not(.dark)` outweighs the template's `:root` and keeps
 *   the page light until the app sets `.dark`, as the components are.
 * - On Tailwind 3 the CLI writes Fasla's palette into `@layer base`, which
 *   loses to the template's unlayered `:root`: `.dark` turned the components
 *   dark on a white page. The same two tokens, unlayered here, win again.
 *
 * Only these two tokens: they are all the templates set. The rules go in the
 * stylesheet rather than `init` deleting the template's, so the shadcn-only
 * route gets them too, and a stylesheet the developer wrote is never edited.
 */
function pageColourRules(value) {
  const page = (scheme) => ({ "--background": value("background", scheme), "--foreground": value("foreground", scheme) })
  return {
    ":root": page("light"),
    ".dark": page("dark"),
    "@media (prefers-color-scheme: dark)": { ":root:not(.dark)": page("light") },
  }
}

/**
 * The default border colour, for a bare `border`. Tailwind 4's preflight sets
 * `border: 0 solid`, so without this every Card and DataTable border is drawn
 * in currentColor: near-black, near-white in dark mode. Tailwind 3's preflight
 * uses its grey, #e5e7eb, whatever the theme.
 *
 * `theme()` resolves to the project's own border colour on either version:
 * `var(--border)` from Tailwind 4's @theme, Fasla's colour-mix or shadcn's
 * `hsl(var(--border))` from a Tailwind 3 config. A plain `var(--border)` would
 * be no colour at all in a Tailwind 3 shadcn project, whose token is bare HSL
 * channels. With no border colour mapped, the fallback keeps each version's
 * own default, so the rule changes nothing there.
 *
 * Preflight's selector, not `*`: the shadcn CLI merges an item's rule into a
 * project's rule of the same selector, and replaced a `border-color` the
 * project's own `*` rule set.
 */
export const BORDER_RULE = {
  selector: "*, ::after, ::before, ::backdrop, ::file-selector-button",
  value: "theme(colors.border, theme(borderColor.DEFAULT, currentColor))",
}

/** Registry URL of another item, as the shadcn CLI follows it. */
const itemUrl = (registryUrl, name) => `${registryUrl.replace(/\/+$/, "")}/${name}.json`

/**
 * The four items. `registryUrl` is where they are published, for the
 * dependencies between them.
 */
export function buildThemeItems({ registryUrl, sources = loadSources() }) {
  const { mode, typography } = sources
  const all = tokenNames(mode)
  const extras = baseTokenNames(mode)
  const value = (name, scheme) => mode.tokens[name][scheme]

  // Tailwind 4: each extra token and type size as a theme variable. Line
  // heights go through --leading-*, which [dir="rtl"] re-points.
  const baseTheme = {
    ...Object.fromEntries(extras.map((name) => [`color-${name}`, `var(--${name})`])),
    ...Object.fromEntries(
      Object.entries(typography.ramp).flatMap(([rung, r]) => [
        [`text-${rung}`, rem(r.size)],
        [`text-${rung}--line-height`, `var(--leading-${rung})`],
      ])
    ),
  }

  // Tailwind 3: the same, in tailwind.config.
  const baseConfig = {
    theme: {
      extend: {
        colors: tailwindV3Colors(
          extras.filter((name) => !SHADCN_V3_MAPPED.includes(name)),
          all
        ),
        fontSize: Object.fromEntries(
          Object.entries(typography.ramp).map(([rung, r]) => [rung, [rem(r.size), `var(--leading-${rung})`]])
        ),
        // The font-cairo item applies `font-arabic` to [dir="rtl"]. Tailwind 4
        // gets the class from the item; Tailwind 3 only from here.
        fontFamily: { arabic: ARABIC_FONT },
      },
    },
  }

  const base = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "theme-base",
    type: "registry:theme",
    title: "Fasla theme: base",
    description:
      "The tokens shadcn doesn't have (success, warning, info, the soft tints), Fasla's type ramp with Arabic line heights, and the Arabic setting. Keeps every colour your project already has.",
    registryDependencies: [itemUrl(registryUrl, "font-cairo")],
    cssVars: { theme: baseTheme },
    tailwind: { config: baseConfig },
    css: {
      // :where() weighs nothing, so a value the project already set — before
      // this or after, in a layer or not — always wins over these.
      "@layer base": {
        ":where(:root)": {
          ...Object.fromEntries(extras.map((name) => [`--${name}`, value(name, "light")])),
          ...leadingVars(typography, "en"),
        },
        ":where(.dark)": Object.fromEntries(extras.map((name) => [`--${name}`, value(name, "dark")])),
        '[dir="rtl"]': leadingVars(typography, "ar"),
        // The page in the theme's colours. The Next.js templates do this
        // themselves; a Vite app's stylesheet doesn't, and its page stayed
        // white with black text in dark mode. :where() like the tokens, so any
        // body rule the project has wins wherever it sits: a Tailwind 3 shadcn
        // project stores --background as bare HSL channels, which
        // var(--background) would turn into no colour at all.
        ":where(body)": { "background-color": "var(--background)", color: "var(--foreground)" },
        // After Tailwind's preflight in the same layer, so it wins over it; any
        // border colour a utility or the project sets outside the layer wins
        // over this. theme brings it through theme-base.
        [BORDER_RULE.selector]: { "border-color": BORDER_RULE.value },
      },
      // Not in a layer, so it outweighs the tracking-, uppercase and italic
      // utilities it undoes.
      ...ARABIC_RULES,
    },
  }

  const radius = Object.fromEntries(Object.entries(mode.radius).map(([name, r]) => [name, r.value]))
  const theme = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "theme",
    type: "registry:theme",
    title: "Fasla theme: colours",
    description: "Fasla's full light and dark palette and radius, on top of the base theme. Replaces your project's colours.",
    registryDependencies: [itemUrl(registryUrl, "theme-base")],
    css: { body: { "font-family": LATIN_FONT, ...SMOOTHING }, ...pageColourRules(value) },
    cssVars: {
      theme: radius,
      light: Object.fromEntries(all.map((name) => [name, value(name, "light")])),
      dark: Object.fromEntries(all.map((name) => [name, value(name, "dark")])),
    },
    tailwind: {
      config: {
        theme: {
          extend: {
            // Every colour, read as a full colour: replaces shadcn's
            // hsl(var(--x)), which expects HSL channels this palette isn't in.
            colors: tailwindV3Colors(all),
            borderRadius: Object.fromEntries(Object.entries(radius).map(([name, v]) => [name.replace(/^radius-/, ""), v])),
            fontFamily: { sans: [LATIN_FONT.split(", ui-sans-serif")[0], "ui-sans-serif", "system-ui", "sans-serif"] },
          },
        },
      },
    },
  }

  // `family` is what the shadcn CLI writes into the theme outside Next.js,
  // where the font comes from fontsource: its variable packages name the
  // family "<Name> Variable", and plain "Cairo" matches no font loaded.
  // Next.js uses `import` and `variable` instead.
  const font = (name, family, importName, variable, extra) => ({
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: "registry:font",
    title: family,
    font: { family, provider: "google", import: importName, variable, ...extra },
  })

  return [
    base,
    theme,
    font("font-cairo", "Cairo Variable", "Cairo", "--font-arabic", {
      weight: ["400", "500", "600", "700"],
      subsets: ["arabic", "latin"],
      // Only Arabic text: the font goes on the RTL root, not on html.
      selector: '[dir="rtl"]',
      dependency: "@fontsource-variable/cairo",
    }),
    font("font-geist", "Geist Variable", "Geist", "--font-sans", {
      subsets: ["latin"],
      dependency: "@fontsource-variable/geist",
    }),
  ]
}
