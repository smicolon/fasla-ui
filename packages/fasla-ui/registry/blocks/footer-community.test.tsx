import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, within } from "@testing-library/react"
import { FooterCareersCulture, footerCareersCultureCopy } from "./footer-careers-culture"
import { FooterCommunityEvents, footerCommunityEventsCopy } from "./footer-community-events"

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


// What these tests can and cannot prove: jsdom has no layout, no hover and no
// Web Animations, so the row wipe, the lift, the arrow slide and the
// breakpoints were checked in a browser. Here `Element.animate`,
// `IntersectionObserver` and `matchMedia` are stubs, so the tests assert the
// contract around the motion: what starts it (a reveal, never the load), which
// elements it plays on, the timings handed to it, the classes that carry the
// hover, and what reduced motion does instead.

type Animation = { el: Element; keyframes: Keyframe[]; options: KeyframeAnimationOptions }
let animations: Animation[] = []
let observers: { callback: IntersectionObserverCallback; target?: Element }[] = []

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

/** Tells every observer its target is on screen. */
const reveal = () => {
  observers.forEach(({ callback, target }) => {
    callback([{ isIntersecting: true, target } as unknown as IntersectionObserverEntry], {} as IntersectionObserver)
  })
}

beforeEach(() => {
  animations = []
  observers = []
  setMotion(false)
  Element.prototype.animate = function (this: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
    animations.push({ el: this, keyframes, options })
    return {} as globalThis.Animation
  } as typeof Element.prototype.animate
  class FakeObserver {
    entry: { callback: IntersectionObserverCallback; target?: Element }
    constructor(callback: IntersectionObserverCallback) {
      this.entry = { callback }
      observers.push(this.entry)
    }
    observe(target: Element) {
      this.entry.target = target
    }
    disconnect() {
      observers = observers.filter((o) => o !== this.entry)
    }
    unobserve() {}
  }
  vi.stubGlobal("IntersectionObserver", FakeObserver)
})
afterEach(() => {
  vi.unstubAllGlobals()
  // @ts-expect-error the stubs are removed again
  delete window.matchMedia
  // @ts-expect-error the stubs are removed again
  delete Element.prototype.animate
})

const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : []

const landmarks = (container: HTMLElement) => {
  expect(container.querySelectorAll("footer")).toHaveLength(1)
  expect(screen.getAllByRole("contentinfo")).toHaveLength(1)
  const navs = screen.getAllByRole("navigation")
  navs.forEach((nav) => expect(nav.getAttribute("aria-label") || nav.getAttribute("aria-labelledby")).toBeTruthy())
  return navs
}

describe.each(["en", "ar"] as const)("Careers & Culture (%s)", (locale) => {
  const copy = footerCareersCultureCopy[locale]
  const photo = (n: number) => ({ src: `/p${n}.jpg`, alt: `Photo ${n}` })

  it("renders one footer landmark, a labelled roles nav and a labelled legal nav", () => {
    const { container } = render(<FooterCareersCulture locale={locale} />)
    const navs = landmarks(container)
    expect(navs).toHaveLength(2)
    expect(screen.getByRole("navigation", { name: copy.rolesLabel })).toBeTruthy()
    expect(screen.getByRole("navigation", { name: copy.legalLabel })).toBeTruthy()
    expect(screen.getByRole("contentinfo").getAttribute("aria-labelledby")).toBeTruthy()
  })

  it("draws the header, a Button default md CTA, four roles with arrow-up-right, the caption and four social marks", () => {
    const { container } = render(<FooterCareersCulture locale={locale} />)
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(copy.title)
    const cta = screen.getByRole("link", { name: copy.cta })
    expect(cta.className).toContain("bg-primary")
    expect(cta.className).toContain("h-9")
    const rows = within(screen.getByRole("navigation", { name: copy.rolesLabel })).getAllByRole("link")
    expect(rows).toHaveLength(4)
    expect(rows[0]?.textContent).toContain(copy.roles[0]!.title)
    expect(container.querySelectorAll("svg.lucide-arrow-up-right")).toHaveLength(4)
    expect(screen.getByText(copy.caption)).toBeTruthy()
    expect(["LinkedIn", "GitHub", "Instagram", "X"].every((name) => container.querySelector(`a[aria-label="${name}"]`))).toBe(true)
  })

  it("keeps the English wording from Figma", () => {
    if (locale !== "en") return
    expect(copy.roles.map((r) => r.title)).toEqual(["Senior Product Designer", "Design Engineer, Components", "Arabic Type Designer", "Technical Writer, Docs"])
    expect(copy.cta).toBe("See all roles")
  })

  it("has no em dash or middle dot in the Arabic copy", () => {
    if (locale !== "ar") return
    strings(copy).forEach((text) => expect(text).not.toMatch(/[—·]/))
  })

  it("separates the facts with drawn dots, never typed ones", () => {
    const { container } = render(<FooterCareersCulture locale={locale} />)
    expect(container.textContent).not.toMatch(/[·]/)
    expect(container.querySelectorAll("span[aria-hidden='true'].rounded-full").length).toBeGreaterThanOrEqual(4)
  })

  it("mirrors the arrow in Arabic by class, and wipes the row from the inline start", () => {
    const { container } = render(<FooterCareersCulture locale={locale} />)
    const arrow = container.querySelector("svg.lucide-arrow-up-right")
    expect(arrow?.getAttribute("class")).toContain("rtl:-scale-x-100")
    const row = within(screen.getByRole("navigation", { name: copy.rolesLabel })).getAllByRole("link")[0]!
    expect(hasVariants(row.getAttribute("class") ?? "", "before:start-0")).toBe(true)
    expect(hasVariants(row.getAttribute("class") ?? "", "before:duration-200")).toBe(true)
    expect(hasVariants(row.getAttribute("class") ?? "", "motion-reduce:before:transition-none")).toBe(true)
    expect(hasVariants(row.getAttribute("class") ?? "", "hover:before:[@container(min-width:40rem)]:w-full")).toBe(true)
    expect(hasVariants(row.getAttribute("class") ?? "", "active:[@media(hover:none)]:bg-secondary")).toBe(true)
  })

  it("takes the photos as props: the studio and two team photos, and a muted ground without them", () => {
    const { container, rerender } = render(<FooterCareersCulture locale={locale} />)
    expect(container.querySelectorAll("img")).toHaveLength(0)
    expect(container.querySelectorAll("[data-photo]")).toHaveLength(3)
    rerender(<FooterCareersCulture locale={locale} studio={photo(1)} team={[photo(2), photo(3)]} />)
    const imgs = Array.from(container.querySelectorAll("img"))
    expect(imgs.map((img) => img.getAttribute("src"))).toEqual(["/p1.jpg", "/p2.jpg", "/p3.jpg"])
    imgs.forEach((img) => {
      expect(img.getAttribute("loading")).toBe("lazy")
      expect(img.className).not.toMatch(/scale-x/)
    })
  })

  it("plays nothing on load; the reveal then staggers the roles 60ms with an 8px rise and the photos on their own", () => {
    render(<FooterCareersCulture locale={locale} />)
    expect(animations).toHaveLength(0)
    reveal()
    const roles = animations.filter((a) => a.el.hasAttribute("data-role"))
    expect(roles).toHaveLength(4)
    expect(roles.map((a) => a.options.delay)).toEqual([0, 60, 120, 180])
    expect(JSON.stringify(roles[0]!.keyframes)).toContain("translateY(8px)")
    const photos = animations.filter((a) => a.el.hasAttribute("data-photo"))
    expect(photos).toHaveLength(3)
    expect(photos.map((a) => a.options.delay)).toEqual([0, 90, 180])
    expect(JSON.stringify(photos[0]!.keyframes)).toContain("scale(1.04)")
    expect(photos[0]!.options.easing).toBe("cubic-bezier(.16,1,.3,1)")
  })

  it("watches the photo cluster with its own observer, apart from the roles", () => {
    const { container } = render(<FooterCareersCulture locale={locale} />)
    const cluster = container.querySelector("[data-photo]")?.parentElement?.parentElement
    expect(observers.some((o) => o.target === cluster)).toBe(true)
    expect(observers.length).toBeGreaterThanOrEqual(2)
  })

  it("runs the photo scale-in 500ms from Tablet and 380ms on phones", () => {
    const { container } = render(<FooterCareersCulture locale={locale} />)
    const footer = container.querySelector("footer") as HTMLElement
    footer.getBoundingClientRect = () => ({ width: 1000 }) as DOMRect
    reveal()
    expect(animations.find((a) => a.el.hasAttribute("data-photo"))?.options.duration).toBe(500)
    animations = []
    footer.getBoundingClientRect = () => ({ width: 360 }) as DOMRect
    // a fresh render reads the phone width
    observers = []
    const second = render(<FooterCareersCulture locale={locale} />)
    ;(second.container.querySelector("footer") as HTMLElement).getBoundingClientRect = () => ({ width: 360 }) as DOMRect
    reveal()
    expect(animations.find((a) => a.el.hasAttribute("data-photo"))?.options.duration).toBe(380)
  })

  it("plays neither reveal under reduced motion", () => {
    setMotion(true)
    render(<FooterCareersCulture locale={locale} />)
    reveal()
    expect(animations).toHaveLength(0)
  })

  it("accepts empty collections without crashing or drawing empty headings", () => {
    const { container } = render(<FooterCareersCulture locale={locale} roles={[]} legal={[]} socials={[]} caption="" />)
    expect(container.querySelector("footer")).toBeTruthy()
    expect(screen.queryByRole("navigation", { name: copy.rolesLabel })).toBeNull()
    expect(screen.queryByRole("navigation", { name: copy.legalLabel })).toBeNull()
  })
})

describe.each(["en", "ar"] as const)("Community & Events (%s)", (locale) => {
  const copy = footerCommunityEventsCopy[locale]

  it("renders one footer landmark and labelled navs for the events, the community cards and the legal links", () => {
    const { container } = render(<FooterCommunityEvents locale={locale} />)
    const navs = landmarks(container)
    expect(navs).toHaveLength(3)
    expect(screen.getByRole("navigation", { name: copy.eventsLabel })).toBeTruthy()
    expect(screen.getByRole("navigation", { name: copy.communityLabel })).toBeTruthy()
    expect(screen.getByRole("navigation", { name: copy.legalLabel })).toBeTruthy()
  })

  it("draws three events with an outline xs Register each, three community cards and five social marks", () => {
    const { container } = render(<FooterCommunityEvents locale={locale} />)
    const events = within(screen.getByRole("navigation", { name: copy.eventsLabel })).getAllByRole("listitem")
    expect(events).toHaveLength(3)
    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(3)
    buttons.forEach((button) => {
      expect(button.textContent).toBe(copy.register)
      expect(button.className).toContain("ring-1")
      expect(button.className).toContain("h-[1.625rem]")
    })
    const cards = within(screen.getByRole("navigation", { name: copy.communityLabel })).getAllByRole("link")
    expect(cards).toHaveLength(3)
    expect(cards.map((card) => card.querySelector("svg")?.getAttribute("class") ?? "").length).toBe(3)
    expect(["Discord", "GitHub", "X", "LinkedIn", "YouTube"].every((name) => container.querySelector(`footer > div > div > ul a[aria-label="${name}"], a[aria-label="${name}"]`))).toBe(true)
    copy.events.forEach((event) => expect(screen.getByText(event.title)).toBeTruthy())
  })

  it("keeps the English wording from Figma", () => {
    if (locale !== "en") return
    expect(copy.events.map((e) => `${e.month} ${e.day}`)).toEqual(["SEP 12", "OCT 03", "NOV 21"])
    expect(copy.cards.map((c) => c.title)).toEqual(["Community chat", "Repo discussions", "Community blog"])
  })

  it("has no em dash or middle dot in the Arabic copy", () => {
    if (locale !== "ar") return
    strings(copy).forEach((text) => expect(text).not.toMatch(/[—·]/))
  })

  it("carries the hover on classes: row tint, card border and lift, an arrow that slides up and to the end and is mirrored", () => {
    const { container } = render(<FooterCommunityEvents locale={locale} />)
    const row = within(screen.getByRole("navigation", { name: copy.eventsLabel })).getAllByRole("listitem")[0]!
    expect(hasVariants(row.getAttribute("class") ?? "", "hover:[@container(min-width:40rem)]:bg-secondary")).toBe(true)
    expect(row.className).toContain("duration-[160ms]")
    const card = within(screen.getByRole("navigation", { name: copy.communityLabel })).getAllByRole("link")[0]!
    expect(hasVariants(card.getAttribute("class") ?? "", "hover:[@container(min-width:40rem)]:border-foreground")).toBe(true)
    expect(hasVariants(card.getAttribute("class") ?? "", "hover:-translate-y-0.5")).toBe(true)
    expect(card.className).toContain("motion-safe:")
    const arrow = container.querySelector("svg.lucide-arrow-up-right")!
    const cls = arrow.getAttribute("class")!
    expect(hasVariants(cls, "rtl:-scale-x-100")).toBe(true)
    expect(hasVariants(cls, "group-hover/card:-translate-y-1")).toBe(true)
    expect(hasVariants(cls, "group-hover/card:translate-x-1")).toBe(true)
    expect(hasVariants(cls, "group-hover/card:-translate-x-1")).toBe(true)
    expect(hasVariants(card.getAttribute("class") ?? "", "active:[@media(hover:none)]:bg-secondary")).toBe(true)
  })

  it("calls onRegister with the event", () => {
    const onRegister = vi.fn()
    render(<FooterCommunityEvents locale={locale} onRegister={onRegister} />)
    fireEvent.click(screen.getAllByRole("button")[1]!)
    expect(onRegister).toHaveBeenCalledWith(copy.events[1])
  })

  it("separates the facts with drawn dots, never typed ones, and plays nothing", () => {
    const { container } = render(<FooterCommunityEvents locale={locale} />)
    expect(container.textContent).not.toMatch(/[·]/)
    expect(container.querySelectorAll("span[aria-hidden='true'].rounded-full").length).toBeGreaterThanOrEqual(4)
    expect(animations).toHaveLength(0)
  })

  it("accepts empty collections without crashing or drawing empty headings", () => {
    const { container } = render(<FooterCommunityEvents locale={locale} events={[]} cards={[]} legal={[]} socials={[]} />)
    expect(container.querySelector("footer")).toBeTruthy()
    expect(screen.queryAllByRole("heading")).toHaveLength(0)
    expect(screen.queryAllByRole("navigation")).toHaveLength(0)
  })
})
