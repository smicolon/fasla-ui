import { describe, expect, test } from "bun:test"
import { spawnSync } from "node:child_process"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { dependencyUrls, rewriteComponentImports, rewriteUtilsImport } from "../scripts/build-registry.mjs"

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
          rewriteUtilsImport(readFileSync(path.join(pkg, file.path), "utf8")),
          file.target,
          targetOf
        )
        for (const [, spec] of out.matchAll(/from ["'](\.{1,2}\/[^"']+)["']/g)) {
          const resolved = path.posix.join(path.posix.dirname(file.target), spec)
          expect(published.has(resolved), `${item.name}: ${spec}`).toBe(true)
        }
      }
    }
  })
})

describe("Registry build — what the shadcn CLI needs", () => {
  test("imports cn from @/lib/utils, never from this repo's path", () => {
    expect(rewriteUtilsImport(`import { cn } from "../../../src/lib/utils"`)).toBe(`import { cn } from "@/lib/utils"`)
    expect(rewriteUtilsImport(`import { cn } from '../../lib/utils'`)).toBe(`import { cn } from '@/lib/utils'`)
    expect(rewriteUtilsImport(`import { cn } from "@/lib/utils"`)).toBe(`import { cn } from "@/lib/utils"`)
    expect(rewriteUtilsImport(`import { x } from "../../../src/lib/other"`)).toBe(`import { x } from "../../../src/lib/other"`)
  })

  test("no published item imports cn from a relative path", () => {
    for (const item of registry.items) {
      for (const file of item.files) {
        const out = rewriteUtilsImport(readFileSync(path.join(pkg, file.path), "utf8"))
        expect(out, `${item.name}: ${file.path}`).not.toMatch(/from ["']\.[^"']*lib\/utils["']/)
      }
    }
  })

  test("writes dependencies on Fasla items as full URLs and leaves shadcn's names bare", () => {
    const own = new Set(["status-indicator", "button"])
    expect(dependencyUrls(["status-indicator", "button", "dialog"], own, "https://ui.smicolon.com/r")).toEqual([
      "https://ui.smicolon.com/r/status-indicator.json",
      "https://ui.smicolon.com/r/button.json",
      "dialog",
    ])
  })

  test("every dependency on a Fasla item in registry.json becomes a URL", () => {
    const own = new Set(registry.items.map((item) => item.name))
    for (const item of registry.items) {
      for (const dep of dependencyUrls(item.registryDependencies ?? [], own)) {
        expect(own.has(dep), `${item.name}: ${dep} is still a bare Fasla name`).toBe(false)
      }
    }
  })
})

describe("Registry build — dependency links stay on ui.smicolon.com", () => {
  // Published CLIs (@smicolon/cli 0.4.0–0.5.2, @smicolon/fasla-ui 0.5.0–0.5.1)
  // only follow a dependency under ui.smicolon.com/r. One on fasla.smicolon.com
  // is skipped, so `add avatar` would write an avatar.tsx whose
  // status-indicator import doesn't resolve. See docs/DOMAINS.md.
  test("no built item has a registryDependencies link on fasla.smicolon.com", () => {
    const env = { ...process.env }
    delete env.FASLA_REGISTRY_URL
    const build = spawnSync("node", ["scripts/build-registry.mjs"], { cwd: docsRoot, env, encoding: "utf8" })
    expect(build.status, build.stderr).toBe(0)

    const out = path.join(docsRoot, "public/r")
    const links = readdirSync(out)
      .filter((file) => file.endsWith(".json") && file !== "index.json" && file !== "registry.json")
      .flatMap((file) => {
        const item = JSON.parse(readFileSync(path.join(out, file), "utf8"))
        return (item.registryDependencies ?? []).map((dep) => [item.name, dep])
      })
      .filter(([, dep]) => dep.includes("://"))

    // avatar → status-indicator and the theme chain, at least.
    expect(links.length).toBeGreaterThan(0)
    for (const [name, dep] of links) {
      expect(dep, `${name}: ${dep}`).not.toContain("fasla.smicolon.com")
      expect(dep.startsWith("https://ui.smicolon.com/r/"), `${name}: ${dep}`).toBe(true)
    }
  })
})
