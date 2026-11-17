import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import path from "node:path"

const docsRoot = path.resolve(import.meta.dir, "..")
const registryPath = path.resolve(docsRoot, "../../packages/fasla-ui/registry.json")

describe("Registry-derived component counts", () => {
  test("match the source registry and cover every item once", async () => {
    const { registryCounts } = await import("../lib/registry")
    const registry = JSON.parse(readFileSync(registryPath, "utf8"))

    expect(registryCounts.total).toBe(registry.items.length)
    expect(registryCounts.primitives + registryCounts.effects).toBe(registryCounts.total)
    // The free product: the 35 UI items and the 7 effects. Everything else is premium.
    expect(registryCounts.total).toBe(42)
    expect(registryCounts.effects).toBe(7)
    expect(registry.items.some((item) => item.type === "registry:block")).toBe(false)
  })

  test("are never hard-coded on the pages that state them", () => {
    for (const file of ["app/[locale]/(home)/page.tsx", "app/[locale]/docs/page.tsx"]) {
      const source = readFileSync(path.join(docsRoot, file), "utf8")
      expect(source).toContain("registryCounts")
      expect(source).not.toMatch(/count(?:=\{|: )\d+/)
    }
  })

  test("the docs introduction states the exact count and the free categories, with no blocks", () => {
    const page = readFileSync(path.join(docsRoot, "app/[locale]/docs/page.tsx"), "utf8")
    expect(page).toContain("primitives: registryCounts.primitives")
    expect(page).toContain("effects: registryCounts.effects")
    for (const lang of ["en", "ar"]) {
      const line = JSON.parse(readFileSync(path.join(docsRoot, `messages/${lang}.json`), "utf8")).docs.landing.features.components
      expect(line, lang).toContain("{count}")
      expect(line, lang).not.toContain("{count}+")
      expect(line, lang).toContain("{primitives}")
      expect(line, lang).toContain("{effects}")
      expect(line, lang).not.toMatch(/blocks|كتل/)
    }
  })
})
