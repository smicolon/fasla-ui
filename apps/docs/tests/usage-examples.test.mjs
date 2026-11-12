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

// What a reader copies first works in a new project, which has no images of
// its own: no file it would have to supply, unless the example says so.
describe("Usage examples in a new project", () => {
  const page = (name) => pages.find((p) => p.name === name).source
  const messages = (lang) => JSON.parse(readFileSync(path.join(docsRoot, `messages/${lang}.json`), "utf8")).docs

  test("Sidebar draws its logo with the free Fasla Logo, installed with it, and asks for no image file", () => {
    const source = page("sidebar")
    for (const code of examplesOf(source)) {
      expect(code).not.toMatch(/src=["{]["']?\//)
      if (code.includes("<FaslaLogo")) expect(code).toContain('import { FaslaLogo } from "@/components/ui/fasla-logo"')
    }
    expect(examplesOf(source)[0]).toContain("<FaslaLogo")
    expect(source).toContain('<InstallCommand name="sidebar fasla-logo" />')
    expect(messages("en").sidebar.installNote).toContain("<code>fasla-logo</code>")
    expect(messages("ar").sidebar.installNote).toContain("<code>fasla-logo</code>")
  })

  test("Avatar's first example needs no image; the photo examples say the path is the reader's own", () => {
    const examples = examplesOf(page("avatar"))
    expect(examples[0]).not.toMatch(/src=|photo:/)
    const withPhoto = examples.filter((code) => code.includes("/avatars/"))
    expect(withPhoto.length).toBeGreaterThan(0)
    for (const code of withPhoto) expect(code).toContain('// ${a("usage.photoPath")}')
    expect(messages("en").avatar.usage.photoPath).toBeTruthy()
    expect(messages("ar").avatar.usage.photoPath).toBeTruthy()
  })

  test("Progress's example renders as copied, without a value passed in", () => {
    const [code] = examplesOf(page("progress"))
    expect(code).toMatch(/\{ value = \d+ \}: \{ value\?: number \}/)
  })
})

