import { describe, it, expect, vi } from "vitest"
import { registryItemName, resolveWithDependencies, rewriteComponentImports } from "./resolve"
import { NAMESPACE, namespaceUrl, type RegistryItem } from "./registry"

const BASE = "https://ui.smicolon.com/r"

const item = (name: string, registryDependencies: string[] = []): RegistryItem => ({
  name,
  type: "registry:ui",
  registryDependencies,
})

function registry(items: RegistryItem[]) {
  const byName = new Map(items.map((i) => [i.name, i]))
  const fetchItem = vi.fn(async (name: string) => byName.get(name)!)
  const known = new Set(byName.keys())
  return { nameOf: (dep: string) => registryItemName(dep, known, [BASE]), fetchItem }
}

describe("resolveWithDependencies", () => {
  it("installs a component's registry dependencies before it", async () => {
    const { nameOf, fetchItem } = registry([item("avatar", ["status-indicator"]), item("status-indicator")])
    const r = await resolveWithDependencies(["avatar"], nameOf, fetchItem)
    expect(r.items.map((i) => i.name)).toEqual(["status-indicator", "avatar"])
    expect(r.added).toEqual(["status-indicator"])
    expect(r.skipped).toEqual([])
  })

  it("fetches a shared dependency once", async () => {
    const { nameOf, fetchItem } = registry([
      item("avatar", ["status-indicator"]),
      item("badge", ["status-indicator"]),
      item("status-indicator"),
    ])
    const r = await resolveWithDependencies(["avatar", "badge"], nameOf, fetchItem)
    expect(r.items.map((i) => i.name)).toEqual(["status-indicator", "avatar", "badge"])
    expect(fetchItem).toHaveBeenCalledTimes(3)
  })

  it("does not report a dependency as added when it was also asked for", async () => {
    const { nameOf, fetchItem } = registry([item("avatar", ["status-indicator"]), item("status-indicator")])
    const r = await resolveWithDependencies(["status-indicator", "avatar"], nameOf, fetchItem)
    expect(r.added).toEqual([])
  })

  it("follows dependencies of dependencies", async () => {
    const { nameOf, fetchItem } = registry([item("a", ["b"]), item("b", ["c"]), item("c")])
    const r = await resolveWithDependencies(["a"], nameOf, fetchItem)
    expect(r.items.map((i) => i.name)).toEqual(["c", "b", "a"])
  })

  it("survives a cycle", async () => {
    const { nameOf, fetchItem } = registry([item("a", ["b"]), item("b", ["a"])])
    const r = await resolveWithDependencies(["a"], nameOf, fetchItem)
    expect(r.items.map((i) => i.name)).toEqual(["b", "a"])
  })

  it("skips what this registry can't resolve, and says so", async () => {
    const { nameOf, fetchItem } = registry([item("a", ["https://example.com/r/x.json", "ghost"])])
    const r = await resolveWithDependencies(["a"], nameOf, fetchItem)
    expect(r.items.map((i) => i.name)).toEqual(["a"])
    expect(r.skipped).toEqual(["https://example.com/r/x.json", "ghost"])
  })
})

describe("full-URL dependencies", () => {
  it("installs a dependency the registry writes as a URL", async () => {
    const { nameOf, fetchItem } = registry([
      item("avatar", [`${BASE}/status-indicator.json`]),
      item("status-indicator"),
    ])
    const r = await resolveWithDependencies(["avatar"], nameOf, fetchItem)
    expect(r.items.map((i) => i.name)).toEqual(["status-indicator", "avatar"])
    expect(r.added).toEqual(["status-indicator"])
    expect(r.skipped).toEqual([])
    expect(fetchItem).toHaveBeenCalledWith("status-indicator")
  })

  it("maps a URL under any of the registry bases back to its name", () => {
    const known = new Set(["status-indicator"])
    const bases = ["http://localhost:4000/r/", BASE]
    expect(registryItemName(`${BASE}/status-indicator.json`, known, bases)).toBe("status-indicator")
    expect(registryItemName("http://localhost:4000/r/status-indicator.json", known, bases)).toBe("status-indicator")
    expect(registryItemName("status-indicator", known, bases)).toBe("status-indicator")
  })

  it("does not claim another registry's URL, or a name it doesn't have", () => {
    const known = new Set(["status-indicator"])
    expect(registryItemName("https://example.com/r/status-indicator.json", known, [BASE])).toBeUndefined()
    expect(registryItemName(`${BASE}/ghost.json`, known, [BASE])).toBeUndefined()
    expect(registryItemName(`${BASE}/status-indicator`, known, [BASE])).toBeUndefined()
  })
})

describe("components.json namespace", () => {
  // The shadcn CLI refuses the whole components.json otherwise.
  it("is a key starting with @ and a URL with {name} in it", () => {
    expect(NAMESPACE).toBe("@fasla")
    expect(namespaceUrl(BASE)).toBe(`${BASE}/{name}.json`)
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
