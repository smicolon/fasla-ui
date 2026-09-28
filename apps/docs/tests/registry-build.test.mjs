import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import path from "node:path"
import { rewriteComponentImports } from "../scripts/build-registry.mjs"

const docsRoot = path.resolve(import.meta.dir, "..")
const pkg = path.resolve(docsRoot, "../../packages/fasla-ui")
const registry = JSON.parse(readFileSync(path.join(pkg, "registry.json"), "utf8"))
const targets = new Map(registry.items.map((item) => [item.name, item.files[0]?.target]))
const targetOf = (name) => targets.get(name)

describe("Registry build — imports between components", () => {
  test("points Avatar's Status Indicator import at the file beside it", () => {
    const avatar = registry.items.find((item) => item.name === "avatar")
    const source = readFileSync(path.join(pkg, avatar.files[0].path), "utf8")
    const published = rewriteComponentImports(source, avatar.files[0].target, targetOf)
    // Any CLI writes both files to components/ui/, so the import must be flat —
    // even one that rewrites nothing, like @smicolon/cli 0.3.3 or shadcn.
    expect(published).toContain(`from "./status-indicator"`)
    expect(published).not.toContain("../status-indicator/status-indicator")
  })

  test("crosses directories when the component lands elsewhere", () => {
    const src = `import { Button } from "../button/button"`
    expect(rewriteComponentImports(src, "components/blocks/page-header.tsx", targetOf)).toBe(
      `import { Button } from "../ui/button"`
    )
  })

  test("leaves anything that isn't a registry component alone", () => {
    const src = [
      `import { cn } from "../../../src/lib/utils"`,
      `import { x } from "../unknown/unknown"`,
      `import { y } from "../status-indicator/other-file"`,
    ].join("\n")
    expect(rewriteComponentImports(src, "components/ui/avatar.tsx", targetOf)).toBe(src)
  })

  test("every published import between components resolves to a published target", () => {
    const published = new Set([...targets.values()].map((t) => t.replace(/\.tsx?$/, "")))
    for (const item of registry.items) {
      for (const file of item.files) {
        const out = rewriteComponentImports(
          readFileSync(path.join(pkg, file.path), "utf8"),
          file.target,
          targetOf
        )
        for (const [, spec] of out.matchAll(/from ["'](\.{1,2}\/[^"']+)["']/g)) {
          if (spec.includes("lib/utils")) continue // the CLI rewrites this to the consumer's alias
          const resolved = path.posix.join(path.posix.dirname(file.target), spec)
          expect(published.has(resolved), `${item.name}: ${spec}`).toBe(true)
        }
      }
    }
  })
})
