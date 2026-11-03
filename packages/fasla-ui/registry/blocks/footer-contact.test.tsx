import * as React from "react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { act, render, screen } from "@testing-library/react"
import { FooterContactFirst, footerContactFirstCopy } from "./footer-contact-first"
import { FooterSupportContact, footerSupportContactCopy } from "./footer-support-contact"
import { FooterLocalBusiness, footerLocalBusinessCopy } from "./footer-local-business"

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


// What these tests can and cannot prove: jsdom has no layout, no Web Animations
// and no hover, so the 220ms arrow and underline, the card lift, the breakpoints
// and the photo sizes were checked in a browser. Here `Element.animate`,
// `matchMedia` and `IntersectionObserver` are stubs, so the tests assert the
// contract around the motion (what starts it, the timings handed to it, what
// reduced motion does instead) and the classes that carry the hover and focus
// rules, the copy, the landmarks and the empty cases.

type Animation = { el: Element; keyframes: Keyframe[]; options: KeyframeAnimationOptions }
let animations: Animation[] = []
let observers: { callback: IntersectionObserverCallback; live: boolean }[] = []

const setMotion = (reduced: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: reduced && query.includes("reduce"),
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
}

beforeEach(() => {
  animations = []
  observers = []
  setMotion(false)
  Element.prototype.animate = function (this: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
    animations.push({ el: this, keyframes, options })
    return {} as globalThis.Animation
  } as typeof Element.prototype.animate
  window.IntersectionObserver = class {
    entry: { callback: IntersectionObserverCallback; live: boolean }
    constructor(callback: IntersectionObserverCallback) {
      this.entry = { callback, live: true }
      observers.push(this.entry)
    }
    observe() {}
    unobserve() {}
    disconnect() {
      this.entry.live = false
    }
    takeRecords() {
      return []
    }
  } as unknown as typeof IntersectionObserver
})
afterEach(() => {
  // @ts-expect-error the stubs are removed again
  delete window.matchMedia
  // @ts-expect-error the stubs are removed again
  delete Element.prototype.animate
  // @ts-expect-error the stubs are removed again
  delete window.IntersectionObserver
})

const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : []

const intersect = () => act(() => observers.filter((o) => o.live).forEach((o) => o.callback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)))

const TYPES = [
  { name: "Contact-First", Component: FooterContactFirst, copy: footerContactFirstCopy, text: { en: "Start a conversation", ar: "ابدأ محادثة" }, navs: 2, empty: { offices: [], legal: [], socials: [], sub: "", email: "", label: "" } },
  { name: "Support & Contact", Component: FooterSupportContact, copy: footerSupportContactCopy, text: { en: "How can we help?", ar: "كيف نساعدك؟" }, navs: 2, empty: { topics: [], channels: [], legal: [] } },
  { name: "Local Business", Component: FooterLocalBusiness, copy: footerLocalBusinessCopy, text: { en: "Opening hours", ar: "ساعات العمل" }, navs: 2, empty: { hours: [], address: [], legal: [], socials: [], mapLabel: [], email: "" } },
] as const

describe.each(TYPES)("$name", ({ Component, copy, text, navs, empty }) => {
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
    expect(groups.length).toBeGreaterThanOrEqual(navs - 1)
    groups.forEach((nav) => expect(nav.getAttribute("aria-label")?.trim()).toBeTruthy())
  })

  it("has no em dash or middle dot in the Arabic copy", () => {
    for (const value of strings((copy as Record<string, unknown>).ar)) expect(value).not.toMatch(/[—·]/)
  })

  it("accepts empty collections without crashing or drawing an empty group", () => {
    const { container } = render(<C {...empty} />)
    expect(container.querySelectorAll("footer")).toHaveLength(1)
    expect(container.querySelectorAll("ul:empty, nav ul:empty")).toHaveLength(0)
  })
})

describe("Contact-First", () => {
  it("draws the address as a mailto link with an arrow that mirrors in RTL and 220ms hover and focus rules", () => {
    const { container } = render(<FooterContactFirst />)
    const link = container.querySelector("a[href='mailto:you@company.com']") as HTMLElement
    expect(link.className).toContain("group")
    const arrow = link.querySelector("svg") as SVGElement
    expect(arrow.getAttribute("class")).toContain("rtl:-scale-x-100")
    const mover = arrow.parentElement as HTMLElement
    expect(mover.className).toContain("duration-[220ms]")
    expect(hasVariants(mover.getAttribute("class") ?? "", "group-hover:-translate-y-1.5")).toBe(true)
    expect(hasVariants(mover.getAttribute("class") ?? "", "group-hover:translate-x-1.5")).toBe(true)
    expect(hasVariants(mover.getAttribute("class") ?? "", "group-hover:rtl:[@container(min-width:40rem)]:-translate-x-1.5")).toBe(true)
    expect(hasVariants(mover.getAttribute("class") ?? "", "group-focus-visible:-translate-y-1.5")).toBe(true)
    expect(mover.className).toContain("opacity-60")
    expect(hasVariants(mover.getAttribute("class") ?? "", "motion-reduce:transition-none")).toBe(true)
    const underline = link.querySelector("span") as HTMLElement
    expect(underline.className).toContain("duration-[220ms]")
    expect(hasVariants(underline.getAttribute("class") ?? "", "rtl:bg-[position:100%_100%]")).toBe(true)
    expect(hasVariants(underline.getAttribute("class") ?? "", "group-focus-visible:bg-[length:100%_1px]")).toBe(true)
  })

  it("only moves where hover exists and motion is allowed, and tints on :active", () => {
    const { container } = render(<FooterContactFirst />)
    const link = container.querySelector("a[href='mailto:you@company.com']") as HTMLElement
    expect(hasVariants(link.getAttribute("class") ?? "", "active:text-muted-foreground")).toBe(true)
    expect(hasVariants(link.getAttribute("class") ?? "", "hover:motion-reduce:text-muted-foreground")).toBe(true)
    const mover = link.querySelectorAll("span")[1]!
    expect(mover.className.split(/\s+/).filter((c) => c.includes("group-hover")).every((c) => c.includes("[@container(min-width:40rem)]"))).toBe(true)
    expect(mover.className).toContain("motion-safe:")
  })

  it("shows a photo per office when given, the muted ground when not", () => {
    const { container, rerender } = render(<FooterContactFirst />)
    expect(container.querySelectorAll("img")).toHaveLength(0)
    expect(container.querySelectorAll("ul > li > div.bg-muted")).toHaveLength(2)
    rerender(
      <FooterContactFirst
        offices={[
          { city: "A", address: ["1 Road"], email: "a@x.com", image: { src: "/a.jpg", alt: "Office A" } },
          { city: "B", address: ["2 Road"], email: "b@x.com" },
        ]}
      />
    )
    const img = screen.getByAltText("Office A")
    expect(img.getAttribute("loading")).toBe("lazy")
    expect(img.className).not.toContain("scale-x")
    expect(container.querySelectorAll("img")).toHaveLength(1)
  })

  it("writes the Arabic digits and emails as left-to-right runs", () => {
    const { container } = render(<FooterContactFirst locale="ar" />)
    const runs = Array.from(container.querySelectorAll("bdi[dir='ltr']")).map((n) => n.textContent)
    expect(runs).toContain("123")
    expect(runs).toContain("you@company.com")
  })
})

describe("Support & Contact", () => {
  it("has a search field with a search icon and a name", () => {
    const { container } = render(<FooterSupportContact />)
    const field = screen.getByRole("searchbox", { name: /Search the help centre/ })
    expect(field).toBeTruthy()
    expect(container.querySelectorAll("svg.lucide-search, svg[class*='lucide-search']").length).toBeGreaterThan(0)
  })

  it("draws three channel cards, each with an arrow that mirrors in RTL and slides only where hover exists", () => {
    const { container } = render(<FooterSupportContact />)
    const cards = container.querySelectorAll("ul[aria-label='Contact channels'] > li")
    expect(cards).toHaveLength(3)
    cards.forEach((card) => {
      const arrow = card.querySelector("a svg") as SVGElement
      expect(arrow.getAttribute("class")).toContain("rtl:-scale-x-100")
      const mover = arrow.parentElement as HTMLElement
      expect(hasVariants(mover.getAttribute("class") ?? "", "group-hover/card:motion-safe:[@container(min-width:40rem)]:translate-x-1")).toBe(true)
      expect(hasVariants(mover.getAttribute("class") ?? "", "group-hover/card:rtl:[@container(min-width:40rem)]:-translate-x-1")).toBe(true)
      const surface = card.firstElementChild as HTMLElement
      expect(surface.className).toContain("shadow-xs")
      expect(hasVariants(surface.getAttribute("class") ?? "", "hover:shadow-md")).toBe(true)
      expect(hasVariants(surface.getAttribute("class") ?? "", "hover:-translate-y-0.5")).toBe(true)
      expect(surface.className).toContain("duration-[160ms]")
      expect(hasVariants(surface.getAttribute("class") ?? "", "active:shadow-md")).toBe(true)
    })
  })

  it("brings the topic links in 40ms apart on first view, and nothing before", () => {
    render(<FooterSupportContact />)
    expect(animations).toHaveLength(0)
    intersect()
    expect(animations).toHaveLength(6)
    expect(animations.map((a) => a.options.delay)).toEqual([0, 40, 80, 120, 160, 200])
    expect(animations.every((a) => (a.el as HTMLElement).hasAttribute("data-reveal"))).toBe(true)
  })

  it("plays no entrance under reduced motion", () => {
    setMotion(true)
    render(<FooterSupportContact />)
    intersect()
    expect(animations).toHaveLength(0)
  })

  it("writes Arabic availability with its numbers and zone as left-to-right runs", () => {
    const { container } = render(<FooterSupportContact locale="ar" />)
    const runs = Array.from(container.querySelectorAll("bdi[dir='ltr']")).map((n) => n.textContent)
    expect(runs).toContain("09:00")
    expect(runs).toContain("18:00 CET")
  })
})

describe("Local Business", () => {
  it("shortens a long email inside its button instead of pushing the page sideways", () => {
    // Found at the 40-character documented limit on a 360px phone: the email button was 351px wide in a 328px column.
    render(<FooterLocalBusiness email="a-really-long-address-at-the-limit@example.com" />)
    const link = screen.getByRole("link", { name: /a-really-long-address/ })
    expect(link.className).toContain("max-w-full")
    expect(link.className).toContain("min-w-0")
    expect(link.querySelector("bdi")!.className).toContain("truncate")
  })

  it("shows the map photo when given and the muted ground when not", () => {
    const { container, rerender } = render(<FooterLocalBusiness />)
    expect(container.querySelectorAll("img")).toHaveLength(0)
    expect(container.querySelector(".bg-muted")).toBeTruthy()
    rerender(<FooterLocalBusiness map={{ src: "/map.jpg", alt: "Map of the studio" }} />)
    const img = screen.getByAltText("Map of the studio")
    expect(img.getAttribute("loading")).toBe("lazy")
    expect(img.className).not.toContain("scale-x")
  })

  it("draws the pill with a dot between its parts in English and without one in Arabic", () => {
    const { container, rerender } = render(<FooterLocalBusiness />)
    const pill = () => container.querySelector(".rounded-full.bg-background") as HTMLElement
    expect(pill().textContent).toBe("Fasla StudioExample City")
    expect(pill().querySelectorAll("span[aria-hidden='true'].rounded-full")).toHaveLength(1)
    rerender(<FooterLocalBusiness locale="ar" />)
    expect(pill().querySelectorAll("span[aria-hidden='true'].rounded-full")).toHaveLength(0)
    expect(pill().textContent).not.toMatch(/[·—]/)
  })

  it("has two buttons: Get directions (solid primary) and the email (outline)", () => {
    render(<FooterLocalBusiness />)
    const directions = screen.getByRole("link", { name: "Get directions" })
    const email = screen.getByRole("link", { name: "you@company.com" })
    expect(directions.querySelector("svg")).toBeTruthy()
    expect(email.querySelector("svg")).toBeTruthy()
    expect(directions.className).toContain("h-9")
    expect(email.className).toContain("h-9")
    expect(directions.className).toContain("bg-primary")
    expect(email.className).not.toContain("bg-primary")
  })

  it("lists three opening-hours rows", () => {
    const { container } = render(<FooterLocalBusiness />)
    expect(container.querySelectorAll("li.border-b")).toHaveLength(3)
    expect(screen.getAllByText("Closed")).toHaveLength(2)
  })
})
