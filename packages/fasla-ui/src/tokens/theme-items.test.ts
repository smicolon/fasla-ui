import { describe, expect, it } from "vitest"

import {
  baseTokenNames,
  BORDER_RULE,
  buildThemeItems,
  LATIN_FONT,
  loadSources,
  semanticColor,
  SHADCN_TOKENS,
  SHADCN_V3_MAPPED,
  tailwindV3Colors,
  tokenNames,
} from "../../theme/theme-items.mjs"
import { LEADING, SIZE_PX } from "../../tailwind-preset"
import { semanticColor as tsSemanticColor, tailwindSemanticColors } from "./tailwind"

/**
 * Guards the theme items against the same Figma snapshots globals.css,
 * tokens/tailwind.ts and tailwind-preset.ts are held to, so the theme a
 * developer installs can't drift from the one the docs and Storybook show.
 */

const sources = loadSources()
const { mode, typography } = sources
const URL = "https://registry.example/r"
const items = buildThemeItems({ registryUrl: URL })
const item = (name: string) => items.find((i) => i.name === name)!
const base = item("theme-base")
const theme = item("theme")
const extras = baseTokenNames(mode)

describe("theme (Fasla's colours)", () => {
  it("carries every Figma token, light and dark, at the snapshot's values", () => {
    for (const name of tokenNames(mode)) {
      expect(theme.cssVars!.light![name], name).toBe(mode.tokens[name]!.light)
      expect(theme.cssVars!.dark![name], name).toBe(mode.tokens[name]!.dark)
    }
    expect(Object.keys(theme.cssVars!.light!)).toHaveLength(Object.keys(mode.tokens).length)
  })

  it("sets Figma's radius, and leaves lg and xl alone", () => {
    expect(theme.cssVars!.theme).toEqual({ "radius-xs": "2px", "radius-sm": "6px", "radius-md": "8px" })
    expect(theme.tailwind!.config.theme.extend.borderRadius).toEqual({ xs: "2px", sm: "6px", md: "8px" })
  })

  it("maps every colour on Tailwind 3 exactly as tokens/tailwind.ts does", () => {
    expect(theme.tailwind!.config.theme.extend.colors).toEqual(tailwindSemanticColors)
    expect(semanticColor("primary")).toBe(tsSemanticColor("primary"))
  })

  it("sets the page in Geist, outweighing a template's own body font, with fallbacks for Next.js and fontsource", () => {
    expect(theme.css!.body).toEqual({
      "font-family": LATIN_FONT,
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale",
    })
    expect(LATIN_FONT).toMatch(/^var\(--font-sans, var\(--font-geist-sans, "Geist Variable", "Geist"\)\)/)
    expect(theme.tailwind!.config.theme.extend.fontFamily).toEqual({
      sans: ['var(--font-sans, var(--font-geist-sans, "Geist Variable", "Geist"))', "ui-sans-serif", "system-ui", "sans-serif"],
    })
    // The base layer leaves a brand's Latin font alone.
    expect(JSON.stringify(base.css)).not.toContain("font-sans")
  })

  it("keeps the page light under a dark OS until .dark, against the Next.js template's media rule", () => {
    const light = { "--background": mode.tokens.background!.light, "--foreground": mode.tokens.foreground!.light }
    const dark = { "--background": mode.tokens.background!.dark, "--foreground": mode.tokens.foreground!.dark }
    expect(theme.css!["@media (prefers-color-scheme: dark)"]).toEqual({ ":root:not(.dark)": light })
    // Unlayered, so they outweigh the template's unlayered :root on Tailwind 3,
    // where the CLI writes the palette into @layer base.
    expect(theme.css![":root"]).toEqual(light)
    expect(theme.css![".dark"]).toEqual(dark)
    // The same values the palette has: these only restate it outside a layer.
    expect(light["--background"]).toBe(theme.cssVars!.light!.background)
    expect(dark["--foreground"]).toBe(theme.cssVars!.dark!.foreground)
  })

  it("brings the base theme with it, and leaves Geist to be added beside it", () => {
    // A dependency would import Geist from next/font/google on Next.js 14 too,
    // which has none there, and the build would fail.
    expect(theme.registryDependencies).toEqual([`${URL}/theme-base.json`])
  })
})

describe("theme-base", () => {
  it("adds exactly the Figma tokens shadcn doesn't have", () => {
    expect(extras).toEqual(tokenNames(mode).filter((name) => !SHADCN_TOKENS.includes(name)))
    expect(extras).toContain("success")
    expect(extras).toContain("soft-primary")
    for (const name of SHADCN_TOKENS) expect(extras).not.toContain(name)
  })

  it("never overwrites a token: no cssVars light or dark, which the shadcn CLI writes over existing values", () => {
    expect(base.cssVars!.light).toBeUndefined()
    expect(base.cssVars!.dark).toBeUndefined()
  })

  it("declares the values under :where(), which a project's own value always outweighs", () => {
    const layer = base.css!["@layer base"] as Record<string, Record<string, string>>
    const light = layer[":where(:root)"]!
    const dark = layer[":where(.dark)"]!
    for (const name of extras) {
      expect(light[`--${name}`], name).toBe(mode.tokens[name]!.light)
      expect(dark[`--${name}`], name).toBe(mode.tokens[name]!.dark)
    }
    const declared = Object.keys(light).filter((key) => !key.startsWith("--leading-"))
    expect(declared).toEqual(extras.map((name) => `--${name}`))
  })

  it("paints the page in the theme's colours, under :where() so a project's own body rule wins", () => {
    const layer = base.css!["@layer base"] as Record<string, Record<string, string>>
    expect(layer[":where(body)"]).toEqual({ "background-color": "var(--background)", color: "var(--foreground)" })
    expect(layer).not.toHaveProperty("body")
  })

  it("draws a bare border in the project's border colour, never in a rule the shadcn CLI would merge into the project's own", () => {
    const layer = base.css!["@layer base"] as Record<string, Record<string, string>>
    expect(layer[BORDER_RULE.selector]).toEqual({ "border-color": BORDER_RULE.value })
    expect(BORDER_RULE.value).toBe("theme(colors.border, theme(borderColor.DEFAULT, currentColor))")
    // The shadcn CLI merges into a rule of the same selector: `*` would
    // replace the border colour a project's own `*` rule sets.
    expect(layer).not.toHaveProperty("*")
    // The colours layer gets it through theme-base, not a second copy.
    expect(theme.registryDependencies).toEqual([`${URL}/theme-base.json`])
    expect(JSON.stringify(theme.css)).not.toContain("border-color")
  })

  it("maps only the extras on Tailwind 4", () => {
    const colours = Object.keys(base.cssVars!.theme!).filter((key) => key.startsWith("color-"))
    expect(colours).toEqual(extras.map((name) => `color-${name}`))
  })

  it("on Tailwind 3, maps no name shadcn already maps there, whose token holds HSL channels", () => {
    const colours = base.tailwind!.config.theme.extend.colors!
    const flat = JSON.stringify(colours)
    for (const name of SHADCN_V3_MAPPED) expect(flat).not.toContain(`var(--${name})`)
    expect(colours).toHaveProperty("success")
    expect(colours).toHaveProperty("soft.primary")
  })

  it("sets the type ramp from the snapshot, with Arabic line heights under [dir=rtl]", () => {
    const layer = base.css!["@layer base"] as Record<string, Record<string, string>>
    for (const [rung, r] of Object.entries(typography.ramp)) {
      expect(base.cssVars!.theme![`text-${rung}`]).toBe(`${r.size / 16}rem`)
      expect(base.cssVars!.theme![`text-${rung}--line-height`]).toBe(`var(--leading-${rung})`)
      expect(layer[":where(:root)"]![`--leading-${rung}`]).toBe(`calc(${r.en.lineHeight} / ${r.size})`)
      expect(layer['[dir="rtl"]']![`--leading-${rung}`]).toBe(`calc(${r.ar.lineHeight} / ${r.size})`)
      // And the preset both apps load agrees.
      const key = rung as keyof typeof LEADING
      expect([LEADING[key][0], LEADING[key][1], SIZE_PX[key]]).toEqual([r.en.lineHeight, r.ar.lineHeight, r.size])
    }
    expect(base.cssVars!.theme!["text-xxs"]).toBe("0.625rem")
  })

  it("sets Arabic in Cairo through one variable, with no capitals, italic or tracking, and code left to right", () => {
    const css = base.css!
    expect(css['[dir="rtl"]']).toEqual({
      "font-family": 'var(--font-arabic, "Cairo Variable", "Cairo"), system-ui, sans-serif',
      // The same greyscale antialiasing the Next.js templates set, so Cairo
      // looks the same weight in a Vite app.
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale",
    })
    expect(css['[dir="rtl"], [dir="rtl"] *']).toEqual({ "letter-spacing": "0" })
    expect(css['[dir="rtl"] .uppercase']).toEqual({ "text-transform": "none" })
    expect(css['[dir="rtl"] .italic, [dir="rtl"] em, [dir="rtl"] i']).toEqual({ "font-style": "normal" })
    const ltr = Object.entries(css).find(([selector]) => selector.includes('[dir="rtl"] code'))!
    expect(ltr[0]).toContain(".font-mono")
    expect(ltr[0]).toContain(".tabular-nums")
    expect(ltr[1]).toEqual({ direction: "ltr", "unicode-bidi": "isolate", "text-align": "start" })
  })

  it("defines font-arabic on Tailwind 3, which the Cairo item's selector applies", () => {
    expect(base.tailwind!.config.theme.extend.fontFamily).toEqual({ arabic: ['var(--font-arabic, "Cairo Variable", "Cairo")', "system-ui", "sans-serif"] })
  })

  it("brings Cairo with it", () => {
    expect(base.registryDependencies).toEqual([`${URL}/font-cairo.json`])
  })
})

describe("fonts", () => {
  it("puts Cairo on --font-arabic, for Arabic only, and Geist on --font-sans", () => {
    // Family names as fontsource registers them, for projects without Next.js.
    expect(item("font-cairo").font).toMatchObject({ family: "Cairo Variable", import: "Cairo", variable: "--font-arabic", selector: '[dir="rtl"]', dependency: "@fontsource-variable/cairo" })
    expect(item("font-cairo").font!.subsets).toContain("arabic")
    expect(item("font-geist").font).toMatchObject({ family: "Geist Variable", import: "Geist", variable: "--font-sans", dependency: "@fontsource-variable/geist" })
  })
})

describe("tailwindV3Colors", () => {
  it("nests a token under its group the way tokens/tailwind.ts does", () => {
    const all = tokenNames(mode)
    expect(tailwindV3Colors(["success", "success-foreground", "soft-info", "chart-1", "muted-foreground-inverse"], all)).toEqual({
      success: { DEFAULT: semanticColor("success"), foreground: semanticColor("success-foreground") },
      soft: { info: semanticColor("soft-info") },
      "chart-1": semanticColor("chart-1"),
      "muted-foreground-inverse": semanticColor("muted-foreground-inverse"),
    })
  })
})
