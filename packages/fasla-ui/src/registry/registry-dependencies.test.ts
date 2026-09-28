import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, it, expect } from "vitest"

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), "../..")

type Item = { name: string; registryDependencies?: string[]; files: { path: string }[] }
const registry: { items: Item[] } = JSON.parse(readFileSync(resolve(PKG, "registry.json"), "utf8"))
const names = new Set(registry.items.map((i) => i.name))

/** Registry components a file imports the way the source tree lays them out. */
function importedComponents(source: string) {
  return [...source.matchAll(/from ["']\.\.\/([a-z0-9-]+)\/([a-z0-9-]+)["']/g)]
    .filter(([, folder, file]) => folder === file && names.has(file!))
    .map(([, , file]) => file!)
}

describe("registry dependencies", () => {
  it.each(registry.items.map((i) => [i.name, i] as const))(
    "%s declares every registry component it imports",
    (_, item) => {
      // `add` installs registryDependencies and nothing else, so an import
      // missing from them is a broken file in the consumer's project.
      const imported = new Set(
        item.files.flatMap((f) => importedComponents(readFileSync(resolve(PKG, f.path), "utf8")))
      )
      expect([...imported].sort()).toEqual(
        [...(item.registryDependencies ?? [])].filter((d) => names.has(d)).sort()
      )
    }
  )

  it("points every registry dependency at a component that exists", () => {
    for (const item of registry.items) {
      for (const dep of item.registryDependencies ?? []) {
        expect(names.has(dep), `${item.name} → ${dep}`).toBe(true)
      }
    }
  })

  it("installs Avatar's dot with it", () => {
    expect(registry.items.find((i) => i.name === "avatar")?.registryDependencies).toEqual([
      "status-indicator",
    ])
  })
})
