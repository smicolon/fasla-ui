import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { FooterSingleLineBar, footerSingleLineBarCopy } from "./footer-single-line-bar"
import { FooterSplitHairlineMicro, footerSplitHairlineMicroCopy } from "./footer-split-hairline-micro"
import { FooterTwoRowCompact, footerTwoRowCompactCopy } from "./footer-two-row-compact"
import { FooterInlinePreferences, footerInlinePreferencesCopy } from "./footer-inline-preferences"

// What these tests can and cannot prove: jsdom has no layout, so the rows, the
// wrapping and the container-query breakpoints were checked in a browser. Here
// the contracts are asserted: one footer landmark, labelled link groups, the
// Figma copy, an Arabic copy without an em dash or a middle dot, empty
// collections that draw nothing, and the Inline + Preferences controls.

beforeEach(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
})
afterEach(() => {
  vi.restoreAllMocks()
  // @ts-expect-error the stub is removed again
  delete window.matchMedia
})

const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : []

const TYPES = [
  { name: "Single-Line Bar", Component: FooterSingleLineBar, copy: footerSingleLineBarCopy, text: { en: "Components", ar: "المكوّنات" }, navs: 2, collections: { links: [], socials: [] } },
  { name: "Split Hairline Micro", Component: FooterSplitHairlineMicro, copy: footerSplitHairlineMicroCopy, text: { en: "© 2026 Fasla. All rights reserved.", ar: "© 2026 فاصلة. جميع الحقوق محفوظة." }, navs: 2, collections: { legal: [], socials: [] } },
  { name: "Two-Row Compact", Component: FooterTwoRowCompact, copy: footerTwoRowCompactCopy, text: { en: "Documentation", ar: "التوثيق" }, navs: 3, collections: { links: [], legal: [], socials: [] } },
  { name: "Inline + Preferences", Component: FooterInlinePreferences, copy: footerInlinePreferencesCopy, text: { en: "Dark mode", ar: "الوضع الداكن" }, navs: 1, collections: { links: [] } },
] as const

describe.each(TYPES)("$name", ({ Component, copy, text, navs, collections }) => {
  const C = Component as React.ComponentType<Record<string, unknown>>
  it.each(["en", "ar"] as const)("renders in %s with one footer landmark and the Figma copy", (locale) => {
    const { container } = render(<C locale={locale} />)
    expect(container.querySelectorAll("footer")).toHaveLength(1)
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1)
    expect(container.textContent).toContain(text[locale])
  })

  it.each(["en", "ar"] as const)("labels every link group in %s", (locale) => {
    const { container } = render(<C locale={locale} />)
    const groups = container.querySelectorAll("nav")
    expect(groups).toHaveLength(navs)
    groups.forEach((nav) => {
      const name = nav.getAttribute("aria-label") ?? container.querySelector(`#${CSS.escape(nav.getAttribute("aria-labelledby") ?? "none")}`)?.textContent
      expect(name?.trim()).toBeTruthy()
    })
  })

  it("has no em dash or middle dot in the Arabic copy", () => {
    for (const value of strings((copy as Record<string, unknown>).ar)) {
      expect(value).not.toMatch(/[—·]/)
    }
  })

  it("accepts empty collections without crashing or drawing an empty group", () => {
    const { container } = render(<C {...collections} />)
    expect(container.querySelectorAll("footer")).toHaveLength(1)
    expect(container.querySelectorAll("nav ul:empty")).toHaveLength(0)
  })

  it("names every social mark and draws no mirrored class on a mark", () => {
    const { container } = render(<C />)
    container.querySelectorAll("a[aria-label]").forEach((a) => expect(a.getAttribute("aria-label")).toBeTruthy())
    expect(container.querySelectorAll("svg[class*='rtl:-scale-x-100']")).toHaveLength(0)
  })
})

describe("Inline + Preferences", () => {
  it("starts on light with the switch off and the English language chosen", () => {
    render(<FooterInlinePreferences />)
    expect((screen.getByRole("switch", { name: "Dark mode" }) as HTMLInputElement).checked).toBe(false)
    expect(screen.getByText("English (US)")).toBeTruthy()
  })

  it("starts on the Arabic language in Arabic", () => {
    render(<FooterInlinePreferences locale="ar" />)
    expect(screen.getByText("العربية")).toBeTruthy()
  })

  it("toggles its own state and reports it, without touching the page", () => {
    const onThemeChange = vi.fn()
    render(<FooterInlinePreferences onThemeChange={onThemeChange} />)
    const toggle = screen.getByRole("switch", { name: "Dark mode" }) as HTMLInputElement
    fireEvent.click(toggle)
    expect(toggle.checked).toBe(true)
    expect(onThemeChange).toHaveBeenLastCalledWith("dark")
    fireEvent.click(toggle)
    expect(toggle.checked).toBe(false)
    expect(onThemeChange).toHaveBeenLastCalledWith("light")
    expect(document.documentElement.classList.contains("dark")).toBe(false)
  })

  it("is controlled when `theme` is passed: the switch follows the prop", () => {
    const onThemeChange = vi.fn()
    const { rerender } = render(<FooterInlinePreferences theme="dark" onThemeChange={onThemeChange} />)
    const toggle = screen.getByRole("switch", { name: "Dark mode" }) as HTMLInputElement
    expect(toggle.checked).toBe(true)
    fireEvent.click(toggle)
    expect(onThemeChange).toHaveBeenCalledWith("light")
    rerender(<FooterInlinePreferences theme="light" onThemeChange={onThemeChange} />)
    expect((screen.getByRole("switch", { name: "Dark mode" }) as HTMLInputElement).checked).toBe(false)
  })

  it("names the language field", () => {
    render(<FooterInlinePreferences />)
    expect(screen.getByRole("combobox", { name: "Language" })).toBeTruthy()
  })
})
