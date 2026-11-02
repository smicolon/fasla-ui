import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { FooterLegalFirstSlim, footerLegalFirstSlimCopy } from "./footer-legal-first-slim"
import { FooterTrustCompliance, footerTrustComplianceCopy } from "./footer-trust-compliance"

/** Whether some class on `cls` has every variant in `spec`, in any order, and the same utility: `a:b:x` matches `b:a:x`. */
function hasVariants(cls: string, spec: string): boolean {
  const split = (token: string) => {
    const out: string[] = []
    let cur = ""
    let depth = 0
    for (const ch of token) {
      if (ch === "[" || ch === "(") depth++
      if (ch === "]" || ch === ")") depth--
      if (ch === ":" && depth === 0) {
        out.push(cur)
        cur = ""
      } else cur += ch
    }
    out.push(cur)
    return out
  }
  const want = split(spec)
  const util = want.pop()
  return cls.split(/\s+/).some((token) => {
    const have = split(token)
    return have.pop() === util && want.every((variant) => have.includes(variant))
  })
}


// What these tests can and cannot prove: jsdom has no layout and no hover, so
// the rows, the wrapping, the 160ms lift and the breakpoints were checked in a
// browser. Here `matchMedia` is a stub and the tests assert the contracts: one
// footer landmark, labelled link groups, the Figma copy, an Arabic copy without
// an em dash or a middle dot, empty collections, the atoms' sizes and the
// classes that carry the hover, :active and reduced-motion rules.

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
  { name: "Legal-First Slim", Component: FooterLegalFirstSlim, copy: footerLegalFirstSlimCopy, text: { en: "Data Processing Addendum", ar: "ملحق معالجة البيانات" }, empty: { policies: [], cookieLabel: "", badges: [], entity: [], socials: [] } },
  { name: "Trust & Compliance", Component: FooterTrustCompliance, copy: footerTrustComplianceCopy, text: { en: "Built to pass your security review.", ar: "مبني ليجتاز مراجعتك الأمنية." }, empty: { certifications: [], payments: [], paymentNote: "", legal: [], title: "", sub: "", trustLabel: "" } },
] as const

describe.each(TYPES)("$name", ({ Component, copy, text, empty }) => {
  const C = Component as React.ComponentType<Record<string, unknown>>
  it.each(["en", "ar"] as const)("renders in %s with one footer landmark and the Figma copy", (locale) => {
    const { container } = render(<C locale={locale} />)
    expect(container.querySelectorAll("footer")).toHaveLength(1)
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1)
    expect(container.textContent).toContain(text[locale])
  })

  it.each(["en", "ar"] as const)("labels every link group in %s", (locale) => {
    const { container } = render(<C locale={locale} />)
    const groups = container.querySelectorAll("nav, ul[aria-label]")
    expect(groups.length).toBeGreaterThan(0)
    container.querySelectorAll("nav").forEach((nav) => expect(nav.getAttribute("aria-label")?.trim()).toBeTruthy())
  })

  it("has no em dash or middle dot in the Arabic copy", () => {
    for (const value of strings((copy as Record<string, unknown>).ar)) expect(value).not.toMatch(/[—·]/)
  })

  it("accepts empty collections without crashing or drawing an empty group", () => {
    const { container } = render(<C {...empty} />)
    expect(container.querySelectorAll("footer")).toHaveLength(1)
    expect(container.querySelectorAll("ul:empty")).toHaveLength(0)
  })
})

describe("Legal-First Slim", () => {
  it("draws four soft secondary small badges and an Outline xs button", () => {
    const { container } = render(<FooterLegalFirstSlim />)
    const items = container.querySelectorAll("ul[aria-label='Compliance'] > li")
    expect(items).toHaveLength(4)
    expect(items[0]!.textContent).toBe("Privacy compliance")
    const button = screen.getByRole("button", { name: "Cookie preferences" })
    expect(button.className).toContain("h-[1.625rem]")
  })

  it("calls onCookiePreferences from the button", () => {
    const onCookiePreferences = vi.fn()
    render(<FooterLegalFirstSlim onCookiePreferences={onCookiePreferences} />)
    fireEvent.click(screen.getByRole("button", { name: "Cookie preferences" }))
    expect(onCookiePreferences).toHaveBeenCalledTimes(1)
  })

  it("draws a dot between the entity facts, not a typed one, in both languages", () => {
    for (const locale of ["en", "ar"] as const) {
      const { container, unmount } = render(<FooterLegalFirstSlim locale={locale} />)
      const line = container.querySelector("p.text-xs") as HTMLElement
      expect(line.querySelectorAll("span[aria-hidden='true'].rounded-full")).toHaveLength(3)
      expect(line.textContent).not.toMatch(/[·—]/)
      unmount()
    }
  })

  it("writes the Arabic numbers as left-to-right runs", () => {
    const { container } = render(<FooterLegalFirstSlim locale="ar" />)
    const runs = Array.from(container.querySelectorAll("bdi[dir='ltr']")).map((n) => n.textContent)
    expect(runs).toContain("000000000")
  })

  it("keeps the policy links in the foreground colour", () => {
    render(<FooterLegalFirstSlim />)
    expect(screen.getByRole("link", { name: "Privacy Policy" }).className).toContain("text-foreground")
  })
})

describe("Trust & Compliance", () => {
  it("draws four certification cards with the icons and arrows that mirror in RTL", () => {
    const { container } = render(<FooterTrustCompliance />)
    const cards = container.querySelectorAll("ul[aria-label='Certifications'] > li")
    expect(cards).toHaveLength(4)
    const icons = Array.from(cards).map((card) => card.querySelector("span[aria-hidden='true'] svg")?.getAttribute("class") ?? "")
    expect(icons[0]).toContain("lucide-shield")
    expect(icons[1]).toContain("lucide-lock")
    expect(icons[2]).toContain("lucide-badge-check")
    expect(icons[3]).toContain("lucide-users")
    cards.forEach((card) => {
      expect(card.querySelector("a svg")?.getAttribute("class")).toContain("rtl:-scale-x-100")
    })
  })

  it("lifts a card on hover through its own border class, 160ms, only where hover exists", () => {
    const { container } = render(<FooterTrustCompliance />)
    const surface = container.querySelector("ul[aria-label='Certifications'] > li > div") as HTMLElement
    expect(surface.className).toContain("border-border")
    expect(hasVariants(surface.getAttribute("class") ?? "", "hover:border-foreground")).toBe(true)
    expect(hasVariants(surface.getAttribute("class") ?? "", "hover:[@container(min-width:40rem)]:border-foreground")).toBe(true)
    expect(hasVariants(surface.getAttribute("class") ?? "", "hover:motion-safe:[@container(min-width:40rem)]:-translate-y-0.5")).toBe(true)
    expect(surface.className).toContain("duration-[160ms]")
    expect(hasVariants(surface.getAttribute("class") ?? "", "active:bg-secondary")).toBe(true)
    expect(hasVariants(surface.getAttribute("class") ?? "", "motion-reduce:transform-none")).toBe(true)
  })

  it("slides the arrow 4px toward its direction only with hover and motion", () => {
    const { container } = render(<FooterTrustCompliance />)
    const mover = container.querySelector("ul[aria-label='Certifications'] a svg")!.parentElement as HTMLElement
    expect(hasVariants(mover.getAttribute("class") ?? "", "group-hover/card:motion-safe:[@container(min-width:40rem)]:translate-x-1")).toBe(true)
    expect(hasVariants(mover.getAttribute("class") ?? "", "group-hover/card:rtl:[@container(min-width:40rem)]:-translate-x-1")).toBe(true)
  })

  it("keeps the trust-centre button an Outline sm Button link", () => {
    render(<FooterTrustCompliance />)
    const link = screen.getByRole("link", { name: "Visit the trust centre" })
    expect(link.className).toContain("h-8")
  })

  it("draws the five payment names as plain text pills, left-to-right in both languages", () => {
    for (const locale of ["en", "ar"] as const) {
      const { container, unmount } = render(<FooterTrustCompliance locale={locale} />)
      const pills = Array.from(container.querySelectorAll("ul[aria-label] > li > span[dir='ltr']")).map((n) => n.textContent)
      expect(pills).toEqual(["VISA", "Mastercard", "Amex", "PayPal", "Apple Pay"])
      unmount()
    }
  })
})
