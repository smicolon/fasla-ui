import { describe, expect, test } from "bun:test"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

const docsRoot = path.resolve(import.meta.dir, "..")
const componentsDir = path.join(docsRoot, "app/[locale]/docs/components")
const pages = readdirSync(componentsDir).map((name) => ({
  name,
  source: readFileSync(path.join(componentsDir, name, "page.tsx"), "utf8"),
}))

/** The template of every usage example on a page, as written in the source. */
const examplesOf = (source) =>
  [...source.matchAll(/<UsageExample[^>]*>\{`([\s\S]*?)`\}<\/UsageExample>/g)].map((m) => m[1])

// Each example pastes into a project and compiles as it stands: it imports
// what it uses, wraps its JSX in a component, and names real values. CI can't
// compile the rendered text, so these hold the shape; the PR that brought them
// in pasted every block, English and Arabic, into a Next.js app and built it.
describe("Usage examples on component pages", () => {
  test("every component page has at least one", () => {
    expect(pages.filter((page) => examplesOf(page.source).length === 0).map((page) => page.name)).toEqual([])
  })

  test("show code only through UsageExample, never a bare CodeBlock of TSX", () => {
    const bare = pages.filter((page) => /<CodeBlock>\{`/.test(page.source)).map((page) => page.name)
    expect(bare).toEqual([])
  })

  test("are each a module: imports first, then an exported component", () => {
    const offenders = pages.flatMap((page) =>
      examplesOf(page.source)
        .filter((code) => !/^("use client"\n\n)?import /.test(code) || !/^export function \w+\(/m.test(code))
        .map((code) => `${page.name}: ${code.slice(0, 60)}`)
    )
    expect(offenders).toEqual([])
  })

  test("have no shortcuts: no `...` in place of code, no // comments between JSX elements", () => {
    const offenders = pages.flatMap((page) =>
      examplesOf(page.source)
        .filter((code) => /^\s*\.\.\.\s*$/m.test(code) || /^\/\/ /m.test(code))
        .map((code) => `${page.name}: ${code.slice(0, 60)}`)
    )
    expect(offenders).toEqual([])
  })

  test("say \"use client\" when they hold state", () => {
    const offenders = pages.flatMap((page) =>
      examplesOf(page.source)
        .filter((code) => /useState/.test(code) && !code.startsWith('"use client"'))
        .map((code) => `${page.name}: ${code.slice(0, 60)}`)
    )
    expect(offenders).toEqual([])
  })
})
