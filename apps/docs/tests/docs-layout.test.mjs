import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import path from "node:path"

const docsRoot = path.resolve(import.meta.dir, "..")
const read = (file) => readFileSync(path.join(docsRoot, file), "utf8")

describe("Docs layout and table of contents", () => {
  test("centres the docs on the homepage container and mounts the contents", () => {
    const layout = read("app/[locale]/docs/layout.tsx")
    expect(layout).toContain("site-container")
    expect(layout).toContain("data-docs-content")
    expect(layout).toContain("<DocsToc />")
    expect(layout).not.toMatch(/className="container\b/)
  })

  test("keeps live demo headings out of the contents", () => {
    expect(read("components/component-preview.tsx")).toContain("data-toc-ignore")
  })

  test("labels the contents in both locales", () => {
    const en = JSON.parse(read("messages/en.json"))
    const ar = JSON.parse(read("messages/ar.json"))
    expect(en.docs.onThisPage).toBe("On this page")
    expect(ar.docs.onThisPage).toBe("في هذه الصفحة")
  })
})
