import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

// @ts-expect-error — plain .mjs, no types
import { BLOCK_SHAPED, CODE_MAP, GREEN_TICK, renderMarkdown } from "../../../../design/scripts/build-index.mjs"

/**
 * Freshness gate for the Figma atom index.
 *
 * Figma is the source of truth. `design/index-atoms.json` is the committed record of what it
 * said at the last sync, and `design/index-atoms.md` is rendered from it. Neither is ever
 * hand-edited — regenerate with the `figma-index` skill instead.
 *
 * These tests cannot see Figma, so they cannot detect drift. They detect the two things that
 * are checkable from here: that the record has not been left to rot, and that it is internally
 * honest. Real drift detection needs a FIGMA_ACCESS_TOKEN, which is deliberately deferred.
 */

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..")
const JSON_PATH = resolve(REPO, "design/index-atoms.json")
const MD_PATH = resolve(REPO, "design/index-atoms.md")

/** How long the index may go unverified before CI starts complaining. Regeneration is ~3
 *  minutes of read-only calls, so this is deliberately tighter than it is painful. */
const MAX_AGE_DAYS = 45
const REFRESH = "run the `figma-index` skill (about 7 read-only Figma calls), then commit the result"

const ix = JSON.parse(readFileSync(JSON_PATH, "utf8"))
const md = readFileSync(MD_PATH, "utf8")

describe("atom index — freshness", () => {
  it("records when it was measured", () => {
    expect(ix.$meta.measured).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(Number.isNaN(Date.parse(ix.$meta.measured))).toBe(false)
  })

  it("was not measured in the future", () => {
    expect(Date.parse(ix.$meta.measured)).toBeLessThanOrEqual(Date.now() + 86_400_000)
  })

  it(`was measured within the last ${MAX_AGE_DAYS} days`, () => {
    const age = Math.floor((Date.now() - Date.parse(ix.$meta.measured)) / 86_400_000)
    expect(
      age,
      `design/index-atoms.json was measured ${age} days ago (limit ${MAX_AGE_DAYS}). ` +
        `A stale index is worse than none — agents trust it. To fix: ${REFRESH}.`
    ).toBeLessThanOrEqual(MAX_AGE_DAYS)
  })

  it("says what it was generated from", () => {
    expect(ix.$meta.source).toContain(ix.$meta.fileKey)
    expect(ix.$meta.generatedBy).toContain("figma-index")
  })
})

describe("atom index — the markdown is generated, not written", () => {
  it("matches a fresh render of the JSON", () => {
    expect(
      renderMarkdown(ix),
      "design/index-atoms.md is out of step with design/index-atoms.json. It is a generated " +
        "file: re-render with `node design/scripts/build-index.mjs atoms --render-only` rather " +
        "than editing it."
    ).toBe(md)
  })

  it("warns readers not to hand-edit it", () => {
    expect(md).toContain("GENERATED FILE")
  })
})

describe("atom index — internal consistency", () => {
  const ids = Object.keys(ix.entries)

  it("counts what it contains", () => {
    const c = ix.$meta.counts
    expect(c.entries).toBe(ids.length)
    expect(c.pagesInScope).toBe(ix.pages.length)
    expect(c.variants).toBe(ids.reduce((a, i) => a + ix.entries[i].variants, 0))
    expect(c.primary).toBe(ids.filter((i) => ix.entries[i].role === "primary").length)
    expect(c.primaryWithEnDoc).toBe(
      ids.filter((i) => ix.entries[i].role === "primary" && ix.entries[i].docs.en).length
    )
  })

  it("gives every entry a Figma link derived from its own node id", () => {
    for (const id of ids) {
      expect(ix.entries[id].url).toContain(id.replace(":", "-"))
      expect(ix.entries[id].url).toContain(ix.$meta.fileKey)
    }
  })

  it("lists every entry under exactly one page", () => {
    const listed = ix.pages.flatMap((p: { entryIds: string[] }) => p.entryIds)
    expect(listed.sort()).toEqual(ids.sort())
    expect(new Set(listed).size).toBe(listed.length)
  })
})

describe("atom index — the selection rule actually held", () => {
  it("only contains pages that are 🟢 and end with ✅", () => {
    for (const p of ix.pages) expect(GREEN_TICK(p.name), p.name).toBe(true)
  })

  it("contains no block page", () => {
    // The ✅ means "complete", not "atom". Without this cross-check a block page would join
    // the atom index the moment it is finished.
    for (const p of ix.pages) expect(BLOCK_SHAPED(p.name), p.name).toBe(false)
  })
})

describe("atom index — the code map keeps up with the registry", () => {
  const registry = JSON.parse(readFileSync(resolve(REPO, "packages/fasla-ui/registry.json"), "utf8"))
  const names: string[] = registry.items.map((i: { name: string }) => i.name)

  it("has an entry for every registry component", () => {
    const missing = names.filter((n) => !(n in CODE_MAP))
    expect(
      missing,
      `registry components with no CODE_MAP entry: ${missing.join(", ")}. Add them to ` +
        "design/scripts/build-index.mjs — map to a Figma {set, page}, or to null if there is " +
        "no Figma counterpart — then regenerate."
    ).toEqual([])
  })

  it("maps nothing that is not in the registry", () => {
    const extra = Object.keys(CODE_MAP).filter((k) => !names.includes(k))
    expect(extra, `CODE_MAP entries with no registry component: ${extra.join(", ")}`).toEqual([])
  })

  it("agrees with the index about which components are implemented", () => {
    const claimed = Object.values(ix.entries)
      .map((x) => (x as { code: string | null }).code)
      .filter(Boolean)
    expect(new Set(claimed).size).toBe(claimed.length) // no code key claimed twice
    expect([...claimed].sort()).toEqual(
      Object.entries(CODE_MAP)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .sort()
    )
  })
})
