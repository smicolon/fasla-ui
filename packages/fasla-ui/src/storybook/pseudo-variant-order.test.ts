import { readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

/**
 * Storybook forces hover, focus and the other interaction states with
 * `storybook-addon-pseudo-states`. It rewrites every CSS rule that uses one of
 * those pseudo-classes, and it rewrites them inside class names too. A class
 * whose name carries `:focus-visible` after another variant
 * (`forced-colors:focus-visible:…`) or inside brackets (`has-[:focus-visible]:…`,
 * `[&:hover]:…`) comes out as an invalid rule. The addon deletes the original
 * before inserting the rewrite, so the style is lost in Storybook even for real
 * focus, and every story logs the error.
 *
 * The fix is free: write the state variant first. `focus-visible:forced-colors:…`
 * compiles to the same CSS as `forced-colors:focus-visible:…`, and the addon
 * reads it correctly. This test scans everything Storybook's Tailwind config
 * compiles, test files included, since Tailwind turns their class strings into
 * rules as well.
 */

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..")
// apps/storybook/tailwind.config.ts `content`, test files included.
const SCANNED = [
  "packages/fasla-ui/registry",
  "apps/storybook/stories",
  "apps/storybook/src",
  "apps/storybook/.storybook",
]

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) return files(full)
    return /\.(tsx?|jsx?|mdx)$/.test(name) ? [full] : []
  })

// The pseudo-classes the addon rewrites (its `PSEUDO_STATES`).
const STATE = "(?:hover|active|focus-visible|focus-within|focus|visited|link|target)"
const SEGMENT = String.raw`(?:[\w-]+|\[[^\]\s]*\])(?:\/[\w-]+)?`
const UTILITY = String.raw`[!\w\-\[\]/.%#()]+`

/** A state variant after another variant: `forced-colors:focus-visible:outline`. */
const STATE_AFTER = new RegExp(
  String.raw`(?<![\w\-\[\]/:&.])(${SEGMENT}(?::${SEGMENT})*:${STATE}:${UTILITY})`,
  "g"
)
/** A state pseudo-class inside an arbitrary variant: `has-[:focus-visible]:ring`, `[&:hover]:bg-muted`. */
const STATE_IN_BRACKETS = new RegExp(
  String.raw`(?<![\w-])((?:[\w-]+-)?\[[^\]\s]*:${STATE}\b[^\]\s]*\](?:\/[\w-]+)?:${UTILITY})`,
  "g"
)

const offenders = (text: string) =>
  [...text.matchAll(STATE_AFTER), ...text.matchAll(STATE_IN_BRACKETS)].map((m) => m[1]!)

describe("interaction-state variants", () => {
  it("recognises the class shapes the addon breaks, and leaves the safe ones alone", () => {
    expect(offenders('"forced-colors:focus-visible:[outline:2px_solid_Highlight]"')).toHaveLength(1)
    expect(offenders('"forced-colors:focus-within:outline"')).toHaveLength(1)
    expect(offenders('"dark:hover:bg-muted"')).toHaveLength(1)
    expect(offenders('"has-[:focus-visible]:ring-4"')).toHaveLength(1)
    expect(offenders('"[&:hover]:bg-muted"')).toHaveLength(1)

    expect(offenders('"focus-visible:forced-colors:[outline:2px_solid_Highlight]"')).toEqual([])
    expect(offenders('"focus-visible:after:opacity-100 peer-focus-visible:opacity-100"')).toEqual([])
    expect(offenders('"hover:bg-accent group-hover:opacity-100 data-[focus-visible]:ring-4"')).toEqual([])
    // Prose and patterns that only name the selector compile to nothing.
    expect(offenders("// a `has-[:focus-visible]` here would break")).toEqual([])
  })

  it("are always the first variant in a class, everywhere Storybook compiles", () => {
    const found = SCANNED.flatMap((dir) =>
      files(join(ROOT, dir)).flatMap((file) =>
        readFileSync(file, "utf8")
          .split("\n")
          .flatMap((line, i) => offenders(line).map((cls) => `${relative(ROOT, file)}:${i + 1} ${cls}`))
      )
    )
    expect(found).toEqual([])
  })
})
