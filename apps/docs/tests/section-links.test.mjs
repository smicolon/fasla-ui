import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import path from "node:path"

const docsRoot = path.resolve(import.meta.dir, "..")
const read = (file) => readFileSync(path.join(docsRoot, file), "utf8")

// The free site's top-level sections: Docs, Components and GitHub. The Blocks
// section is premium, so nothing here links to it.
describe("Top-level section links", () => {
  test("the docs header and its mobile menu list Components, and no Blocks", () => {
    const source = read("components/site-header.tsx")
    expect(source).toContain('p("/docs/components/button")')
    expect(source).not.toContain("/docs/blocks")
    expect(source).not.toContain('t("blocks")')
  })

  test("the landing header and footer list Components, and no Blocks", () => {
    for (const file of ["app/[locale]/(home)/_components/landing-nav.tsx", "app/[locale]/(home)/_components/landing-footer.tsx"]) {
      const source = read(file)
      expect(source, file).toContain("landingLinks.components(locale)")
      expect(source, file).not.toContain("landingLinks.blocks")
    }
  })

  test("the landing links have no Blocks or templates destination", async () => {
    const { landingLinks } = await import("../app/[locale]/(home)/_components/links")
    expect("blocks" in landingLinks).toBe(false)
    expect("templates" in landingLinks).toBe(false)
  })

  test("the nav messages carry no Blocks label", () => {
    for (const file of ["messages/en.json", "messages/ar.json"]) {
      const messages = JSON.parse(read(file))
      expect(messages.nav.blocks).toBeUndefined()
      expect(messages.landing.nav.blocks).toBeUndefined()
    }
  })
})
