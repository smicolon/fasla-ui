import { describe, it, expect, vi } from "vitest"
import { resolveWithDependencies, rewriteComponentImports } from "./resolve"
import type { RegistryItem } from "./registry"

const item = (name: string, registryDependencies: string[] = []): RegistryItem => ({
  name,
  type: "registry:ui",
  registryDependencies,
})

function registry(items: RegistryItem[]) {
  const byName = new Map(items.map((i) => [i.name, i]))
  const fetchItem = vi.fn(async (name: string) => byName.get(name)!)
  return { known: new Set(byName.keys()), fetchItem }
}

describe("resolveWithDependencies", () => {
  it("installs a component's registry dependencies before it", async () => {
    const { known, fetchItem } = registry([item("avatar", ["status-indicator"]), item("status-indicator")])
    const r = await resolveWithDependencies(["avatar"], known, fetchItem)
    expect(r.items.map((i) => i.name)).toEqual(["status-indicator", "avatar"])
    expect(r.added).toEqual(["status-indicator"])
    expect(r.skipped).toEqual([])
  })

  it("fetches a shared dependency once", async () => {
    const { known, fetchItem } = registry([
      item("avatar", ["status-indicator"]),
      item("badge", ["status-indicator"]),
      item("status-indicator"),
    ])
    const r = await resolveWithDependencies(["avatar", "badge"], known, fetchItem)
    expect(r.items.map((i) => i.name)).toEqual(["status-indicator", "avatar", "badge"])
    expect(fetchItem).toHaveBeenCalledTimes(3)
  })

  it("does not report a dependency as added when it was also asked for", async () => {
    const { known, fetchItem } = registry([item("avatar", ["status-indicator"]), item("status-indicator")])
    const r = await resolveWithDependencies(["status-indicator", "avatar"], known, fetchItem)
    expect(r.added).toEqual([])
  })

  it("follows dependencies of dependencies", async () => {
    const { known, fetchItem } = registry([item("a", ["b"]), item("b", ["c"]), item("c")])
    const r = await resolveWithDependencies(["a"], known, fetchItem)
    expect(r.items.map((i) => i.name)).toEqual(["c", "b", "a"])
  })

  it("survives a cycle", async () => {
    const { known, fetchItem } = registry([item("a", ["b"]), item("b", ["a"])])
    const r = await resolveWithDependencies(["a"], known, fetchItem)
    expect(r.items.map((i) => i.name)).toEqual(["b", "a"])
  })

  it("skips what this registry can't resolve, and says so", async () => {
    const { known, fetchItem } = registry([item("a", ["https://example.com/r/x.json", "ghost"])])
    const r = await resolveWithDependencies(["a"], known, fetchItem)
    expect(r.items.map((i) => i.name)).toEqual(["a"])
    expect(r.skipped).toEqual(["https://example.com/r/x.json", "ghost"])
  })
})

describe("rewriteComponentImports", () => {
  const dirs: Record<string, string> = {
    "status-indicator": "src/components/ui",
    button: "src/components/ui",
    "page-header": "src/components/blocks",
  }
  const targetDirOf = (name: string) => dirs[name]

  it("points a sibling import at the flat file beside it", () => {
    const src = `import { StatusIndicator } from "../status-indicator/status-indicator"`
    expect(rewriteComponentImports(src, "src/components/ui", targetDirOf)).toBe(
      `import { StatusIndicator } from "./status-indicator"`
    )
  })

  it("crosses type directories when the dependency lands elsewhere", () => {
    const src = `import { Button } from '../button/button'`
    expect(rewriteComponentImports(src, "src/components/blocks", targetDirOf)).toBe(
      `import { Button } from '../ui/button'`
    )
  })

  it("leaves anything that isn't a registry component alone", () => {
    const src = [
      `import { cn } from "../../../src/lib/utils"`,
      `import { x } from "../unknown/unknown"`,
      `import { y } from "../status-indicator/other-file"`,
    ].join("\n")
    expect(rewriteComponentImports(src, "src/components/ui", targetDirOf)).toBe(src)
  })
})
