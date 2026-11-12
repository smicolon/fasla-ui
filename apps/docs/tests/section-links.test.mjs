import { describe, expect, test } from "bun:test"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

const docsRoot = path.resolve(import.meta.dir, "..")
const read = (file) => readFileSync(path.join(docsRoot, file), "utf8")
const count = (source, pattern) => (source.match(pattern) ?? []).length

// The site's top-level sections: Docs, Components, Blocks, Templates and
// GitHub. Blocks and templates are part of Fasla Pro, so every link to them
// opens the Coming soon page; the site has no /docs/blocks or /docs/templates
// section.
describe("Top-level section links", () => {
  test("the docs header and its mobile menu list Blocks then Templates after Components, leading to Coming soon", () => {
    const source = read("components/site-header.tsx")
    const components = count(source, /p\("\/docs\/components\/button"\)/g)
    expect(count(source, /p\("\/coming-soon\/"\)/g)).toBe(2 * components)
    expect(count(source, /\{t\("blocks"\)\}/g)).toBe(components)
    expect(count(source, /\{t\("templates"\)\}/g)).toBe(components)
    expect(source.indexOf('{t("blocks")}')).toBeGreaterThan(source.indexOf('{t("components")}'))
    expect(source.indexOf('{t("templates")}')).toBeGreaterThan(source.indexOf('{t("blocks")}'))
    expect(source.lastIndexOf('{t("templates")}')).toBeGreaterThan(source.lastIndexOf('{t("blocks")}'))
    expect(source).not.toContain("/docs/blocks")
    expect(source).not.toContain("/docs/templates")
  })

  test("the landing header and footer list Blocks then Templates after Components", () => {
    for (const file of ["app/[locale]/(home)/_components/landing-nav.tsx", "app/[locale]/(home)/_components/landing-footer.tsx"]) {
      const source = read(file)
      const components = count(source, /landingLinks\.components\(locale\)/g)
      expect(count(source, /landingLinks\.blocks\(locale\)/g), file).toBe(components)
      expect(count(source, /landingLinks\.templates\(locale\)/g), file).toBe(components)
      expect(source.indexOf("landingLinks.blocks("), file).toBeGreaterThan(source.indexOf("landingLinks.components"))
      expect(source.indexOf("landingLinks.templates("), file).toBeGreaterThan(source.indexOf("landingLinks.blocks("))
    }
  })

  test("Blocks and templates lead to the Coming soon page, in both languages", async () => {
    const { landingLinks } = await import("../app/[locale]/(home)/_components/links")
    for (const locale of ["en", "ar"]) {
      expect(landingLinks.blocks(locale)).toBe(`/${locale}/coming-soon/`)
      expect(landingLinks.templates(locale)).toBe(`/${locale}/coming-soon/`)
    }
  })

  test("the nav messages name Blocks and Templates", () => {
    for (const [file, blocks, templates] of [["messages/en.json", "Blocks", "Templates"], ["messages/ar.json", "الكتل", "القوالب"]]) {
      const messages = JSON.parse(read(file))
      expect(messages.nav.blocks).toBe(blocks)
      expect(messages.landing.nav.blocks).toBe(blocks)
      expect(messages.nav.templates).toBe(templates)
      expect(messages.landing.nav.templates).toBe(templates)
    }
  })

  test("adds no blocks or templates route", () => {
    expect(existsSync(path.join(docsRoot, "app/[locale]/docs/blocks"))).toBe(false)
    expect(existsSync(path.join(docsRoot, "app/[locale]/docs/templates"))).toBe(false)
  })
})
