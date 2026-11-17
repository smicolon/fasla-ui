import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import path from "node:path"

const docsRoot = path.resolve(import.meta.dir, "..")
const source = readFileSync(path.join(docsRoot, "app/[locale]/(home)/_components/atoms-table.tsx"), "utf8")
const registry = JSON.parse(readFileSync(path.join(docsRoot, "../../packages/fasla-ui/registry.json"), "utf8"))

/** The slugs in `hiddenAtoms`, read from the source. */
const hidden = JSON.parse(source.match(/hiddenAtoms = new Set\((\[[^\]]*\])\)/)[1])

// The home page's components table hides the two registry items that have no
// docs page, so it shows no name that leads nowhere. Display only.
describe("Home page components table", () => {
  test("hides exactly Fasla Logo and Social Icons", () => {
    expect([...hidden].sort()).toEqual(["fasla-logo", "social-icons"])
    expect(source).toContain("atoms.filter((atom) => !hiddenAtoms.has(atom.slug)).map(")
  })

  test("hides only items without a docs page, and shows every item that has one", async () => {
    const { atoms } = await import("../lib/atoms")
    for (const slug of hidden) {
      const atom = atoms.find((candidate) => candidate.slug === slug)
      expect(atom, slug).toBeDefined()
      expect(atom.path, `${slug} now has a docs page: show it again`).toBeNull()
    }
    const shown = atoms.filter((atom) => !hidden.includes(atom.slug))
    expect(shown.every((atom) => atom.path !== null)).toBe(true)
    expect(shown.length).toBe(atoms.length - 2)
  })

  test("keeps both items in the registry and the title's count at the registry total", async () => {
    const { atomCounts } = await import("../lib/atoms")
    for (const slug of hidden) expect(registry.items.some((item) => item.name === slug), slug).toBe(true)
    expect(atomCounts.total).toBe(registry.items.length)
    expect(source).toContain('t("title", { count: atomCounts.total, n: fmt.format(atomCounts.total) })')
  })
})
