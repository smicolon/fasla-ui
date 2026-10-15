import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import path from "node:path"

const docsRoot = path.resolve(import.meta.dir, "..")
const read = (file) => readFileSync(path.join(docsRoot, file), "utf8")
const count = (source, pattern) => (source.match(pattern) ?? []).length

// The site's top-level sections: wherever a header, menu or footer links
// Components, it links Blocks too, as many times and right after it.
describe("Top-level section links", () => {
  test("the docs header and its mobile menu list Blocks after Components", () => {
    const source = read("components/site-header.tsx")
    expect(count(source, /p\("\/docs\/blocks\/"\)/g)).toBe(count(source, /p\("\/docs\/components\/button"\)/g))
    expect(source.indexOf('{t("blocks")}')).toBeGreaterThan(source.indexOf('{t("components")}'))
  })

  test("the landing header and footer list Blocks after Components", () => {
    for (const file of ["app/[locale]/(home)/_components/landing-nav.tsx", "app/[locale]/(home)/_components/landing-footer.tsx"]) {
      const source = read(file)
      expect(count(source, /landingLinks\.blocks\(locale\)/g), file).toBe(count(source, /landingLinks\.components\(locale\)/g))
      expect(source.indexOf("landingLinks.blocks("), file).toBeGreaterThan(source.indexOf("landingLinks.components"))
    }
  })

  test("the block catalogue's cards and its button lead to the Blocks introduction, not Coming soon", () => {
    const source = read("app/[locale]/(home)/_components/blocks-grid.tsx")
    expect(count(source, /href=\{landingLinks\.blocks\(locale\)\}/g)).toBe(2)
    expect(source).not.toContain("comingSoon")
  })

  test("Blocks leads to the Blocks introduction, in both languages", async () => {
    const { landingLinks } = await import("../app/[locale]/(home)/_components/links")
    expect(landingLinks.blocks("en")).toBe("/en/docs/blocks/")
    expect(landingLinks.blocks("ar")).toBe("/ar/docs/blocks/")
    for (const [file, label] of [["messages/en.json", "Blocks"], ["messages/ar.json", "الكتل"]]) {
      const messages = JSON.parse(read(file))
      expect(messages.nav.blocks).toBe(label)
      expect(messages.landing.nav.blocks).toBe(label)
    }
  })
})
