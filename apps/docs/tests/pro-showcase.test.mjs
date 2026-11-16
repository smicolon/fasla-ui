import { describe, expect, test } from "bun:test"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"

const docsRoot = path.resolve(import.meta.dir, "..")
const read = (file) => readFileSync(path.join(docsRoot, file), "utf8")
const showcase = read("app/[locale]/(home)/_components/pro-showcase.tsx")
const rail = read("app/[locale]/(home)/_components/pro-template-rail.tsx")
const pictures = path.join(docsRoot, "public/landing/pro")

// The Fasla Pro showcase on the home page: pictures of the blocks and
// templates, never their code, and every card opens Coming soon.
describe("Fasla Pro showcase", () => {
  test("sits after the components table, Blocks then Templates", () => {
    const page = read("app/[locale]/(home)/page.tsx")
    const order = ["<AtomsTable />", "<ProBlocksShowcase />", "<ProTemplatesShowcase />", "<ArabicWord />"].map((tag) => page.indexOf(tag))
    expect(order.every((at) => at > 0)).toBe(true)
    expect([...order].sort((a, b) => a - b)).toEqual(order)
  })

  test("links only to the Coming soon page", () => {
    for (const source of [showcase, rail]) {
      expect(source.match(/href=\{landingLinks\.(blocks|templates)\(locale\)\}/g)?.length ?? 0).toBeGreaterThan(0)
      expect(source).not.toMatch(/href=\{?["`'][^"`']*\/docs\//)
      expect(source).not.toContain("/docs/blocks")
      expect(source).not.toContain("/docs/templates")
    }
  })

  test("draws pictures, and imports no block or template code", () => {
    for (const source of [showcase, rail]) {
      expect(source).not.toMatch(/@fasla-ui\/blocks|registry\/(blocks|templates)|block-library|blocks-data|templates-carousel|scaled-preview/)
    }
  })

  test("has a picture for every card in both languages and both themes", () => {
    const families = [...showcase.matchAll(/\["[a-z]+", "([a-z]+)", \d+, \d+\]/g)].map((m) => m[1])
    const templates = [...rail.matchAll(/\["[a-z]+", \d+\]/g)].length
    expect(families).toHaveLength(16)
    expect(templates).toBe(6)
    const expected = []
    for (const locale of ["en", "ar"]) {
      for (const theme of ["light", "dark"]) {
        for (const family of families) expected.push(`blocks-${family}-${locale}-${theme}.webp`)
        for (let i = 1; i <= templates; i++) expected.push(`templates-${String(i).padStart(2, "0")}-${locale}-${theme}.webp`)
      }
    }
    expect(expected.filter((file) => !existsSync(path.join(pictures, file)))).toEqual([])
    expect(readdirSync(pictures).sort()).toEqual(expected.sort())
  })
})
