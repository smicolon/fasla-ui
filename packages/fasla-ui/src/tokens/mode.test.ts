import { execSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import { semanticColor, tailwindSemanticColors } from "./tailwind"

/**
 * Guards the token contract: Figma "☾ Mode" → design/tokens/mode.json → both
 * apps' `globals.css` → the shared Tailwind mapping.
 *
 * Figma is the source of truth. `design/tokens/mode.json` is the committed
 * record of what it said at the last sync, and these tests fail if either app
 * stops agreeing with it. When Figma genuinely moves, re-read the collection,
 * update the snapshot, and regenerate the two sentinel blocks — do not "fix"
 * the test by editing one app.
 *
 * Re-read with the collection id pinned: 41 of these names also exist in the
 * single-mode "🌈 Themes" collection, and a name-only lookup silently returns
 * that copy.
 */

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..")

type Snapshot = {
  $meta: { count: number }
  tokens: Record<string, { light: string; dark: string }>
}

const snap: Snapshot = JSON.parse(
  readFileSync(resolve(REPO, "design/tokens/mode.json"), "utf8")
)
const NAMES = Object.keys(snap.tokens)

/** Snapshot lookup that fails loudly rather than yielding `undefined`. */
function tok(name: string) {
  const t = snap.tokens[name]
  if (!t) throw new Error(`token missing from snapshot: ${name}`)
  return t
}

/** Tokens each app owns itself. They must never be inside a generated block. */
const NON_FIGMA: Record<string, string[]> = {
  docs: [
    "radius",
    "fasla-red",
    "fasla-ink",
    "fasla-white",
    "fasla-cyan",
    "terminal",
    "terminal-foreground",
    "terminal-muted",
    "terminal-subtle",
    "terminal-border",
    "terminal-accent",
    "terminal-caret",
  ],
  storybook: ["radius"],
}

const APPS = {
  docs: "apps/docs/app/globals.css",
  storybook: "apps/storybook/src/styles/globals.css",
} as const

/** The two `figma:theme:start … figma:theme:end` regions, in source order. */
function blocks(css: string) {
  return [...css.matchAll(/figma:theme:start([\s\S]*?)figma:theme:end/g)].map(
    (m) => m[1] ?? ""
  )
}

function declarations(block: string) {
  const out: Record<string, string> = {}
  for (const m of block.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) {
    const [, name, value] = m
    if (name && value) out[name] = value.trim()
  }
  return out
}

describe("Figma ☾ Mode snapshot", () => {
  it("holds every token exactly once, with both modes", () => {
    expect(NAMES).toHaveLength(snap.$meta.count)
    expect(new Set(NAMES).size).toBe(NAMES.length)
    for (const n of NAMES) {
      expect(tok(n).light, `${n} light`).toBeTruthy()
      expect(tok(n).dark, `${n} dark`).toBeTruthy()
    }
  })

  it("keeps primary as the strong neutral, not the brand red", () => {
    // The single most consequential value here, and the one that was wrong for
    // the whole life of the docs app. `--primary` is Figma's strong neutral;
    // the brand red travels on `--fasla-red` and is docs-only.
    expect(tok("primary").light).toBe("#0a0a0a")
    expect(tok("primary").dark).toBe("#fafafa")
    for (const n of NAMES) {
      expect(tok(n).light.toLowerCase(), n).not.toBe("#e40017")
      expect(tok(n).dark.toLowerCase(), n).not.toBe("#e40017")
    }
  })

  it("keeps destructive distinct from primary", () => {
    // Both were #e40017 in docs, so a delete button matched a confirm button.
    expect(tok("destructive").light).toBe("#dc2626")
    expect(tok("destructive").light).not.toBe(tok("primary").light)
  })
})

describe.each(Object.entries(APPS))("%s globals.css", (app, rel) => {
  const css = readFileSync(resolve(REPO, rel), "utf8")
  const found = blocks(css)
  const light = found[0] ?? ""
  const dark = found[1] ?? ""

  it("has exactly one light and one dark generated block", () => {
    expect(found).toHaveLength(2)
    expect(light).toContain("⚪️ Light")
    expect(dark).toContain("🌑 Dark")
  })

  it.each(["light", "dark"] as const)("declares all 41 tokens in %s", (mode) => {
    const decls = declarations(mode === "light" ? light : dark)
    expect(Object.keys(decls).sort()).toEqual([...NAMES].sort())
  })

  it.each(["light", "dark"] as const)("matches Figma exactly in %s", (mode) => {
    const decls = declarations(mode === "light" ? light : dark)
    const actual: Record<string, string | undefined> = {}
    const expected: Record<string, string> = {}
    for (const n of NAMES) {
      actual[n] = decls[n]
      expected[n] = tok(n)[mode]
    }
    // Compared as one object so a failure names every drifted token at once.
    expect(actual).toEqual(expected)
  })

  it("keeps its own non-Figma tokens outside the generated blocks", () => {
    const inside = new Set([
      ...Object.keys(declarations(light)),
      ...Object.keys(declarations(dark)),
    ])
    for (const own of NON_FIGMA[app] ?? []) {
      expect(
        inside.has(own),
        `${own} must not be inside a generated block`
      ).toBe(false)
      expect(css, `${own} must still be declared`).toContain(`--${own}:`)
    }
  })
})

describe("Tailwind mapping", () => {
  it("covers exactly the Figma token set", () => {
    const mapped = new Set<string>()
    const walk = (v: unknown) => {
      if (typeof v === "string") {
        const m = v.match(/var\(--([a-z0-9-]+)\)/)
        if (m?.[1]) mapped.add(m[1])
      } else if (v && typeof v === "object") {
        Object.values(v).forEach(walk)
      }
    }
    walk(tailwindSemanticColors)
    expect([...mapped].sort()).toEqual([...NAMES].sort())
  })

  it("keeps the opacity modifier working", () => {
    // A bare `var(--x)` makes Tailwind silently drop `/opacity`, so
    // `bg-primary/10` compiles to no rule at all. The `<alpha-value>`
    // placeholder is what prevents that — see semanticColor's comment.
    expect(semanticColor("primary")).toContain("<alpha-value>")
    expect(semanticColor("primary")).toContain("var(--primary)")
  })
})

describe("colour dialect", () => {
  const SOURCES = [
    "packages/fasla-ui/registry",
    "packages/fasla-ui/src",
    "apps/docs/app",
    "apps/docs/components",
    "apps/storybook/stories",
    "apps/storybook/src",
  ]

  it("has no hsl(var(--x)) literals left", () => {
    // The CSS variables are full colours now, so `hsl(var(--primary))` resolves
    // to `hsl(#0a0a0a)` — invalid, and silently dropped. That is the defect
    // which left five effects components with no default colour on the docs site.
    const hits = execSync(
      `grep -rln 'hsl(var(--' ${SOURCES.map((s) => `'${s}'`).join(" ")} || true`,
      { cwd: REPO, encoding: "utf8" }
    )
      .split("\n")
      .map((l) => l.trim())
      // This file names the broken form in order to forbid it.
      .filter((l) => l && !l.endsWith("src/tokens/mode.test.ts"))
    expect(hits).toEqual([])
  })
})
