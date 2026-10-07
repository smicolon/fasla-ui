import { readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import { loadSources, tokenNames } from "../../theme/theme-items.mjs"

/**
 * Every component takes its colours from the theme: shadcn's token names plus
 * Fasla's, nothing hard-coded. A component that names `green-500` or `#e11d48`
 * keeps that colour whatever theme a project installs, and in dark mode too.
 */

const REGISTRY = resolve(dirname(fileURLToPath(import.meta.url)), "../../registry")
const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) return files(full)
    return /\.tsx?$/.test(name) && !/\.(test|stories)\./.test(name) ? [full] : []
  })
const sources = files(REGISTRY).map((file) => ({ file: relative(REGISTRY, file), text: readFileSync(file, "utf8") }))

const PALETTE =
  /\b(?:bg|text|border|ring|from|to|via|fill|stroke|outline|shadow|divide|decoration|caret|accent|placeholder)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b|\b(?:bg|text|border|ring|fill|stroke)-(?:white|black)\b/g
// A colour written out. `linear-gradient(#fff 0 0)` in a CSS mask is alpha, not colour.
const LITERAL = /#[0-9a-fA-F]{3,8}\b(?! 0 0\))|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/g
const TOKEN = /var\(--([a-z0-9-]+)\)/g

const allowed = new Set(tokenNames(loadSources().mode))
// Variables components set for themselves, not colours from the theme.
const OWN = /^(tw-|radix-|beam-|glow-|shimmer-|spotlight-|text-reveal|leading-|font-|radius|border-radius|sw-)/

describe("component colours", () => {
  it("use no Tailwind palette colours", () => {
    const found = sources.flatMap(({ file, text }) => [...text.matchAll(PALETTE)].map((m) => `${file}: ${m[0]}`))
    expect(found).toEqual([])
  })

  it("write out no colour values", () => {
    const found = sources.flatMap(({ file, text }) =>
      text
        .split("\n")
        .filter((line) => !/^\s*(\/\/|\*|\/\*)/.test(line))
        .flatMap((line) => [...line.matchAll(LITERAL)].map((m) => `${file}: ${m[0]} in ${line.trim().slice(0, 60)}`))
    )
    expect(found).toEqual([])
  })

  it("read only the theme's own tokens through var()", () => {
    const found = sources.flatMap(({ file, text }) =>
      [...text.matchAll(TOKEN)].map((m) => m[1]!).filter((name) => !allowed.has(name) && !OWN.test(name)).map((name) => `${file}: --${name}`)
    )
    expect(found).toEqual([])
  })
})
