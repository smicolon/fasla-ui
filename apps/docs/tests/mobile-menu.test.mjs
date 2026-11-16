import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import path from "node:path"

// A phone visitor reaches every page from either header: the home page's
// LandingNav and the docs' SiteHeader share one menu, which behaves the same
// in both. These hold the source to that; the behaviour itself was checked in
// a browser at 390px, English and Arabic, light and dark.
const docsRoot = path.resolve(import.meta.dir, "..")
const read = (file) => readFileSync(path.join(docsRoot, file), "utf8")
const menu = read("components/mobile-menu.tsx")
const landing = read("app/[locale]/(home)/_components/landing-nav.tsx")
const docsHeader = read("components/site-header.tsx")

/** The labels in a <MobileMenuPanel links={[...]}>, without the call to action. */
const panelLabels = (source) => {
  const from = source.indexOf("links={[", source.indexOf("<MobileMenuPanel"))
  const block = source.slice(from, source.indexOf("]}", from))
  return [...block.matchAll(/label: t\("(\w+)"\)/g)].map((m) => m[1])
}

describe("the phone menu", () => {
  test("both headers use the shared menu, button and panel", () => {
    for (const source of [landing, docsHeader]) {
      expect(source).toContain("useMobileMenu(")
      expect(source).toContain("<MobileMenuButton")
      expect(source).toContain("<MobileMenuPanel")
    }
  })

  test("the landing header shows the button exactly where its links hide", () => {
    expect(landing).toContain('aria-label={t("label")} className="ms-2 flex gap-1 [view-transition-name:nav-links] max-[760px]:hidden"')
    expect(landing.match(/min-\[761px\]:hidden/g)).toHaveLength(2)
  })

  test("it lists the same links as each header's desktop nav", () => {
    // The link texts between the opening tag (not its aria-label) and the end.
    const desktop = (source, start, end) => {
      const from = source.indexOf(">", source.indexOf(start)) + 1
      return [...source.slice(from, source.indexOf(end, from)).matchAll(/\{t\("(\w+)"\)\}/g)].map((m) => m[1])
    }
    expect(panelLabels(landing)).toEqual(desktop(landing, "<nav", "</nav>"))
    expect(panelLabels(docsHeader)).toEqual(desktop(docsHeader, "{/* Desktop Nav Links */}", "{/* Right:"))
    expect(panelLabels(landing)).toEqual(["docs", "components", "blocks", "templates", "github"])
  })

  test("the button says whether it is open and which panel it opens", () => {
    expect(menu).toContain("aria-expanded={menu.open}")
    expect(menu).toContain("aria-controls={menu.id}")
    expect(menu).toContain("aria-label={label}")
    expect(menu).toContain('type="button"')
  })

  test("it closes on Escape, outside, a link, a new page and the other language", () => {
    expect(menu).toMatch(/event\.key !== "Escape"[\s\S]*buttonRef\.current\?\.focus\(\)/)
    expect(menu).toContain('addEventListener("pointerdown"')
    expect(menu).toMatch(/useEffect\(\(\) => setOpen\(false\), \[pathname, locale\]\)/)
    expect(menu).toContain("onClick={close}")
  })

  test("its panel is solid, in both headers", () => {
    for (const source of [landing, docsHeader]) {
      const panel = source.slice(source.indexOf("<MobileMenuPanel"))
      const className = panel.match(/className="([^"]+)"/)[1]
      expect(className.split(" ")).toContain("bg-background")
      expect(className).not.toMatch(/bg-background\/|backdrop-blur/)
    }
  })

  test("it is written for both directions: logical sides only", () => {
    for (const source of [menu, landing]) {
      expect(source).not.toMatch(/\b(ml|mr|pl|pr|left|right)-[\w[]/)
      expect(source).not.toMatch(/text-(left|right)\b/)
    }
  })
})
