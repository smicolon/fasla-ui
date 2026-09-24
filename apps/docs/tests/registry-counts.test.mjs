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
    expect(registryCounts.primitives + registryCounts.blocks + registryCounts.effects).toBe(
      registryCounts.total
    )
    expect(registryCounts.blocks).toBe(
      registry.items.filter((item) => item.type === "registry:block").length
    )
  })

  test("are never hard-coded on the pages that state them", () => {
    for (const file of ["app/[locale]/(home)/page.tsx", "app/[locale]/docs/page.tsx"]) {
      const source = readFileSync(path.join(docsRoot, file), "utf8")
      expect(source).toContain("registryCounts")
      expect(source).not.toMatch(/count(?:=\{|: )\d+/)
    }
  })
})
