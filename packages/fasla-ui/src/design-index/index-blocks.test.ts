import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

// @ts-expect-error — plain .mjs, no types
import { CODE_PREFIX, READY, SECTIONS, deriveScope, renderMarkdown } from "../../../../design/scripts/build-blocks-index.mjs"
// @ts-expect-error — plain .mjs, no types
import { EXCLUDED_BLOCK_PAGES } from "../../../../design/scripts/build-index.mjs"

/**
 * Freshness gate for the Figma blocks index — the sibling of index-atoms.test.ts.
 *
 * Figma is the source of truth. `design/index-blocks.json` is the committed record of what it
 * said at the last sync, and `design/index-blocks.md` is rendered from it. Neither is ever
 * hand-edited — regenerate with the `figma-index` skill (target: blocks) instead.
 *
 * These tests cannot see Figma, so they cannot detect drift. They check that the record has not
 * been left to rot, and that it is internally honest.
 */

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..")
const JSON_PATH = resolve(REPO, "design/index-blocks.json")
const MD_PATH = resolve(REPO, "design/index-blocks.md")

const MAX_AGE_DAYS = 45
const REFRESH = "run the `figma-index` skill with target blocks (about 8 read-only Figma calls), then commit the result"

type Block = { name: string; nodeId: string; url: string; variants: number; code: string | null }
type Family = {
  id: string
  section: string
  status: string | null
  ready: boolean
  set: { id: string; url: string; variants: number; axes: Record<string, string[]> }
  blocks: Block[]
}

const ix = JSON.parse(readFileSync(JSON_PATH, "utf8"))
const md = readFileSync(MD_PATH, "utf8")
const families: Family[] = ix.families

describe("blocks index — freshness", () => {
  it("records when it was measured", () => {
    expect(ix.$meta.measured).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(Date.parse(ix.$meta.measured)).toBeLessThanOrEqual(Date.now() + 86_400_000)
  })

  it(`was measured within the last ${MAX_AGE_DAYS} days`, () => {
    const age = Math.floor((Date.now() - Date.parse(ix.$meta.measured)) / 86_400_000)
    expect(
      age,
      `design/index-blocks.json was measured ${age} days ago (limit ${MAX_AGE_DAYS}). ` +
        `A stale index is worse than none — agents trust it. To fix: ${REFRESH}.`
    ).toBeLessThanOrEqual(MAX_AGE_DAYS)
  })

  it("says what it was generated from", () => {
    expect(ix.$meta.source).toContain(ix.$meta.fileKey)
    expect(ix.$meta.generatedBy).toContain("figma-index")
  })
})

describe("blocks index — the markdown is generated, not written", () => {
  it("matches a fresh render of the JSON", () => {
    expect(
      renderMarkdown(ix),
      "design/index-blocks.md is out of step with design/index-blocks.json. It is a generated " +
        "file: re-render with `node design/scripts/build-blocks-index.mjs --render-only` rather than editing it."
    ).toBe(md)
  })

  it("warns readers not to hand-edit it", () => {
    expect(md).toContain("GENERATED FILE")
  })

  it("lists every block, linked", () => {
    for (const f of families) for (const b of f.blocks) expect(md).toContain(`[${b.name}](${b.url})`)
  })
})

describe("blocks index — internal consistency", () => {
  const blocks = families.flatMap((f) => f.blocks)

  it("counts what it contains", () => {
    const c = ix.$meta.counts
    expect(c.families).toBe(families.length)
    expect(c.blocks).toBe(blocks.length)
    expect(c.variants).toBe(families.reduce((a, f) => a + f.set.variants, 0))
    expect(c.readyFamilies).toBe(families.filter((f) => f.ready).length)
    expect(c.blocksInCode).toBe(blocks.filter((b) => b.code).length)
  })

  it("gives every block and set a Figma link derived from its own node id", () => {
    for (const f of families) {
      expect(f.set.url).toContain(f.set.id.replace(":", "-"))
      for (const b of f.blocks) expect(b.url).toContain(b.nodeId.replace(":", "-"))
    }
  })

  it("has one Type value per block, and every Type is complete across breakpoints and directions", () => {
    for (const f of families) {
      expect(f.set.axes.Type).toEqual(f.blocks.map((b) => b.name))
      const full = f.set.axes.Breakpoint!.length * f.set.axes.Direction!.length
      for (const b of f.blocks) expect(b.variants, `${f.set.id} / ${b.name}`).toBe(full)
    }
  })

  it("places every family in exactly one of the sections, in order", () => {
    expect(ix.sections.map((s: { key: string }) => s.key)).toEqual(SECTIONS.map((s: { key: string }) => s.key))
    const listed = ix.sections.flatMap((s: { familyIds: string[] }) => s.familyIds)
    expect(listed).toEqual(families.map((f) => f.id))
  })
})

describe("blocks index — the rules actually held", () => {
  it("marks a family ready exactly when its status is 🟢", () => {
    for (const f of families) expect(f.ready, f.id).toBe(READY(f.status))
  })

  it("ends the E-commerce section on Gift Cards", () => {
    const ecommerce = ix.sections.find((s: { key: string }) => s.key === "ecommerce")
    expect(ecommerce.familyIds.at(-1)).toBe("43164:52345")
  })

  it("stops when a page appears after Gift Cards", () => {
    const list = [
      ["40935:41137", "🟡 Marketing UI Components ↴"], ["a:1", "✦  🟢 Y | One"], ["d:1", " "],
      ["43164:51148", "🟡 E-commerce UI Components ↴"], ["43164:52345", "✦ 🟡 Y | Gift Cards"], ["x:1", "✦  🟡 Y | Stray"], ["d:2", " "],
    ]
    expect(() => deriveScope(list)).toThrow(/must end on Gift Cards/)
    expect(deriveScope(list.filter(([id]) => id !== "x:1")).flatMap((s: { ids: string[] }) => s.ids)).toEqual(["a:1", "43164:52345"])
  })

  it("shares one status legend with the atom index", () => {
    const atoms = JSON.parse(readFileSync(resolve(REPO, "design/index-atoms.json"), "utf8"))
    expect(ix.$meta.legend).toEqual(atoms.$meta.legend)
  })

  it("contains every page the atom index hands over as a block page", () => {
    for (const x of EXCLUDED_BLOCK_PAGES as { id: string }[]) expect(families.map((f) => f.id)).toContain(x.id)
  })
})

describe("blocks index — the code map keeps up with the registry", () => {
  const registry = JSON.parse(readFileSync(resolve(REPO, "packages/fasla-ui/registry.json"), "utf8"))
  const names: string[] = registry.items.map((i: { name: string }) => i.name)
  const claimed = families.flatMap((f) => f.blocks.map((b) => b.code)).filter(Boolean) as string[]

  it("only claims registry items that exist", () => {
    expect(claimed.filter((n) => !names.includes(n))).toEqual([])
  })

  it("claims every registry item under a mapped prefix, once", () => {
    for (const prefix of Object.values(CODE_PREFIX) as string[]) {
      const wanted = names.filter((n) => n.startsWith(prefix)).sort()
      expect(claimed.filter((n) => n.startsWith(prefix)).sort()).toEqual(wanted)
    }
    expect(new Set(claimed).size).toBe(claimed.length)
  })
})
