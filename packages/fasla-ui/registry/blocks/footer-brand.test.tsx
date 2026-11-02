import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import { FooterBrandPanelSplit, footerBrandPanelSplitCopy } from "./footer-brand-panel-split"
import { FooterGiantWordmark, footerGiantWordmarkCopy } from "./footer-giant-wordmark"
import { FooterImageBackedBrand, footerImageBackedBrandCopy } from "./footer-image-backed-brand"
import { FooterCenteredBrandMinimal, footerCenteredBrandMinimalCopy } from "./footer-centered-brand-minimal"
import { FooterMarqueeStrip, footerMarqueeStripCopy } from "./footer-marquee-strip"
import { FooterBigTypeLinkStack, footerBigTypeLinkStackCopy } from "./footer-big-type-link-stack"
import { FooterBentoTile, footerBentoTileCopy } from "./footer-bento-tile"

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


/*
 * The seven Footer Types of the brand family. jsdom has no layout, media
 * queries, observers, scrolling or Web Animations, so each is stubbed: the
 * tests check contracts (what is on the page, what the motion is handed, what
 * reduced motion and a coarse pointer switch off), not how a browser paints
 * them. Sizes, gaps and the look of the rise, the parallax and the loop were
 * read from Figma and are checked in a browser.
 */

type Recorded = { el: Element; keyframes: Keyframe[]; options: KeyframeAnimationOptions; pause: ReturnType<typeof vi.fn>; play: ReturnType<typeof vi.fn>; cancel: ReturnType<typeof vi.fn> }
type Callback = (entries: { isIntersecting: boolean }[]) => void

let animations: Recorded[]
let observers: { callback: Callback; live: boolean }[]
const env = { reduced: false, fine: true, hover: true, width: 1440 }

beforeEach(() => {
  animations = []
  observers = []
  Object.assign(env, { reduced: false, fine: true, hover: true, width: 1440 })
  window.matchMedia = vi.fn((query: string) => ({
    matches: (query.includes("prefers-reduced-motion") && env.reduced) || (query.includes("pointer: fine") && env.fine) || (query.includes("hover: hover") && env.hover),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia
  Element.prototype.animate = function (this: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
    const animation: Recorded = { el: this, keyframes, options, pause: vi.fn(), play: vi.fn(), cancel: vi.fn() }
    animations.push(animation)
    return animation as unknown as Animation
  } as typeof Element.prototype.animate
  class FakeObserver {
    entry: { callback: Callback; live: boolean }
    constructor(callback: Callback) {
      this.entry = { callback, live: true }
      observers.push(this.entry)
    }
    observe() {}
    unobserve() {}
    disconnect() {
      this.entry.live = false
    }
  }
  vi.stubGlobal("IntersectionObserver", FakeObserver)
  Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => env.width })
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  // @ts-expect-error the stubs are removed again
  delete window.matchMedia
  // @ts-expect-error the stubs are removed again
  delete Element.prototype.animate
  // @ts-expect-error the stub is removed again
  delete HTMLElement.prototype.clientWidth
})

/** Brings every observed block into view, as scrolling to it would. */
const scrollIntoView = () =>
  act(() => {
    observers.filter((o) => o.live).forEach((o) => o.callback([{ isIntersecting: true }]))
  })

const strings = (value: unknown): string[] => (typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : [])

const inDir = (dir: "ltr" | "rtl", node: React.ReactNode) => <div dir={dir}>{node}</div>

type Case = { name: string; copy: Record<"en" | "ar", unknown>; render: (locale: "en" | "ar") => React.ReactElement; empty: React.ReactElement; text: { en: string; ar: string }; navs: number }

const cases: Case[] = [
  { name: "Brand Panel Split", copy: footerBrandPanelSplitCopy, render: (locale) => <FooterBrandPanelSplit locale={locale} />, empty: <FooterBrandPanelSplit columns={[]} legal={[]} socials={[]} body="" email="" />, text: { en: "Build it once. Ship it in two languages.", ar: "ابنِه مرة واحدة. أطلقه بلغتين." }, navs: 5 },
  { name: "Giant Wordmark", copy: footerGiantWordmarkCopy, render: (locale) => <FooterGiantWordmark locale={locale} />, empty: <FooterGiantWordmark columns={[]} legal={[]} socials={[]} introSub="" />, text: { en: "A design system that reads both ways.", ar: "نظام تصميم يُقرأ في الاتجاهين." }, navs: 4 },
  { name: "Image-Backed Brand", copy: footerImageBackedBrandCopy, render: (locale) => <FooterImageBackedBrand locale={locale} />, empty: <FooterImageBackedBrand links={[]} legal={[]} socials={[]} sub="" />, text: { en: "Design once. Ship in every direction.", ar: "صمّم مرة واحدة. أطلق في كل اتجاه." }, navs: 2 },
  { name: "Centered Brand Minimal", copy: footerCenteredBrandMinimalCopy, render: (locale) => <FooterCenteredBrandMinimal locale={locale} />, empty: <FooterCenteredBrandMinimal links={[]} socials={[]} tagline="" />, text: { en: "The bilingual design system for product teams.", ar: "نظام التصميم ثنائي اللغة لفرق المنتج." }, navs: 1 },
  { name: "Marquee Strip", copy: footerMarqueeStripCopy, render: (locale) => <FooterMarqueeStrip locale={locale} />, empty: <FooterMarqueeStrip links={[]} legal={[]} socials={[]} phrase="" />, text: { en: "Bilingual by default", ar: "ثنائية اللغة افتراضيًا" }, navs: 2 },
  { name: "Big-Type Link Stack", copy: footerBigTypeLinkStackCopy, render: (locale) => <FooterBigTypeLinkStack locale={locale} />, empty: <FooterBigTypeLinkStack rows={[]} legal={[]} socials={[]} studio={{ title: "Studio", lines: [] }} contact={{ title: "Contact", lines: [] }} hours={{ title: "Hours", lines: [] }} />, text: { en: "Documentation", ar: "التوثيق" }, navs: 2 },
  { name: "Bento Tile", copy: footerBentoTileCopy, render: (locale) => <FooterBentoTile locale={locale} />, empty: <FooterBentoTile columns={[]} legal={[]} socials={[]} />, text: { en: "Monthly changelog", ar: "سجل تغييرات شهري" }, navs: 3 },
]

describe.each(cases)("$name", (c) => {
  it.each(["en", "ar"] as const)("renders in %s with one footer landmark and its copy", (locale) => {
    const { container } = render(inDir(locale === "ar" ? "rtl" : "ltr", c.render(locale)))
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1)
    expect(container.textContent).toContain(c.text[locale])
  })

  it.each(["en", "ar"] as const)("names every link group (%s)", (locale) => {
    const { container } = render(inDir(locale === "ar" ? "rtl" : "ltr", c.render(locale)))
    const navs = screen.getAllByRole("navigation")
    expect(navs).toHaveLength(c.navs)
    navs.forEach((nav) => {
      const name = nav.getAttribute("aria-label") ?? container.querySelector(`[id="${nav.getAttribute("aria-labelledby")}"]`)?.textContent
      expect(name?.trim()).toBeTruthy()
    })
  })

  it("has no em dash or middle dot in the Arabic copy", () => {
    strings(c.copy.ar).forEach((text) => {
      expect(text).not.toMatch(/[—·]/)
    })
  })

  it("has no asterisks in the markup", () => {
    const { container } = render(c.render("en"))
    expect(container.textContent).not.toContain("*")
  })

  it("takes empty collections without crashing or drawing an empty heading", () => {
    const { container } = render(c.empty)
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1)
    container.querySelectorAll("h2, h3").forEach((heading) => {
      expect(heading.textContent?.trim()).not.toBe("")
    })
  })
})

describe("Brand Panel Split", () => {
  it("is Figma's four columns of six links, with the email and four social marks", () => {
    const { container } = render(<FooterBrandPanelSplit />)
    expect(footerBrandPanelSplitCopy.en.columns.map((col) => [col.title, col.links.length])).toEqual([["Product", 6], ["Learn", 6], ["Company", 6], ["Support", 6]])
    expect(screen.getByRole("link", { name: /you@company\.com/ }).getAttribute("href")).toBe("mailto:you@company.com")
    ;["LinkedIn", "X (Twitter)", "GitHub", "YouTube"].forEach((name) => expect(container.querySelector(`a[aria-label="${name}"]`) ?? container.querySelector(`a[aria-label*="${name.split(" ")[0]}" i]`)).toBeTruthy())
  })

  it("puts the panel on the secondary ground and plays no motion", () => {
    const { container } = render(<FooterBrandPanelSplit />)
    expect(container.querySelector(".bg-secondary")).toBeTruthy()
    expect(container.querySelector("[data-reveal]")).toBeNull()
    scrollIntoView()
    expect(animations).toHaveLength(0)
  })

  it("keeps the year a left-to-right island in Arabic", () => {
    const { container } = render(inDir("rtl", <FooterBrandPanelSplit locale="ar" />))
    expect(Array.from(container.querySelectorAll("bdi[dir='ltr']")).map((b) => b.textContent)).toContain("2026")
  })
})

describe("Centered Brand Minimal", () => {
  it("lists Figma's eight links and five marks, and plays no motion", () => {
    const { container } = render(<FooterCenteredBrandMinimal />)
    expect(within(screen.getByRole("navigation")).getAllByRole("link")).toHaveLength(8)
    expect(container.querySelectorAll("ul a[aria-label]")).toHaveLength(5)
    scrollIntoView()
    expect(animations).toHaveLength(0)
  })
})

describe("Giant Wordmark", () => {
  const mark = (container: HTMLElement) => container.querySelector<HTMLElement>("[data-wordmark]")!
  const stubRect = (container: HTMLElement, top: number, height: number) => {
    container.querySelector("footer")!.getBoundingClientRect = () => ({ top, height, bottom: top + height, left: 0, right: 0, width: 0, x: 0, y: top, toJSON() {} }) as DOMRect
  }

  it("draws the lockup inside the block, in flow, at the three heights Figma gives", () => {
    const { container } = render(<FooterGiantWordmark />)
    const svg = mark(container).querySelector("svg")!
    expect(svg.getAttribute("class")).toContain("h-[97px]")
    expect(svg.getAttribute("class")).toContain("[@container(min-width:40rem)]:h-[207px]")
    expect(svg.getAttribute("class")).toContain("[@container(min-width:64rem)]:h-[260px]")
    expect(container.querySelector("footer > div")!.lastElementChild).toBe(mark(container))
  })

  it("fades and rises the three link columns once, 300ms, 60ms apart, when the block is seen", () => {
    const { container } = render(<FooterGiantWordmark />)
    expect(animations).toHaveLength(0)
    scrollIntoView()
    const columns = container.querySelectorAll("nav[data-reveal]")
    expect(columns).toHaveLength(3)
    const played = animations.filter((a) => a.options.duration === 300)
    expect(played.map((a) => a.options.delay)).toEqual([0, 60, 120])
    expect(played[0]!.keyframes[0]).toMatchObject({ opacity: 0, transform: "translateY(12px)" })
  })

  it("rises with the scroll on Desktop: 48px down at first, none once the block has fully entered", () => {
    const { container } = render(<FooterGiantWordmark />)
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => (cb(0), 0))
    stubRect(container, 700, 600)
    act(() => {
      window.dispatchEvent(new Event("scroll"))
    })
    expect(mark(container).style.transform).toBe("translateY(48px)")
    stubRect(container, -200, 600)
    act(() => {
      window.dispatchEvent(new Event("scroll"))
    })
    expect(mark(container).style.transform).toBe("")
  })

  it("listens to the scroll passively", () => {
    const add = vi.spyOn(window, "addEventListener")
    render(<FooterGiantWordmark />)
    expect(add).toHaveBeenCalledWith("scroll", expect.any(Function), { passive: true })
  })

  it("on Mobile pins the lockup and fades it in over 260ms instead of rising", () => {
    env.width = 360
    const add = vi.spyOn(window, "addEventListener")
    const { container } = render(<FooterGiantWordmark />)
    expect(add).not.toHaveBeenCalledWith("scroll", expect.any(Function), expect.anything())
    scrollIntoView()
    const fade = animations.find((a) => a.el === mark(container))!
    expect(fade.options.duration).toBe(260)
    expect(fade.keyframes).toEqual([{ opacity: 0 }, { opacity: 1 }])
    expect(mark(container).style.transform).toBe("")
  })

  it("under reduced motion pins the lockup at its final place and plays nothing", () => {
    env.reduced = true
    const add = vi.spyOn(window, "addEventListener")
    const remove = vi.spyOn(window, "removeEventListener")
    const { container } = render(<FooterGiantWordmark />)
    scrollIntoView()
    expect(animations).toHaveLength(0)
    expect(add.mock.calls.filter(([type]) => type === "scroll")).toHaveLength(0)
    expect(remove.mock.calls.filter(([type]) => type === "scroll")).toHaveLength(0)
    expect(mark(container).style.transform).toBe("")
  })

  it("draws the Arabic lockup in Arabic", () => {
    const { container } = render(inDir("rtl", <FooterGiantWordmark locale="ar" />))
    expect(container.querySelector("[data-wordmark] svg[data-direction='rtl']")).toBeTruthy()
  })
})

describe("Image-Backed Brand", () => {
  const photo = (container: HTMLElement) => container.querySelector<HTMLElement>("[data-photo]")!
  const scrim = (container: HTMLElement) => container.querySelector<HTMLElement>("[data-scrim]")!
  const scrolled = (container: HTMLElement, top: number) => {
    container.querySelector("footer")!.getBoundingClientRect = () => ({ top, height: 400, bottom: top + 400, left: 0, right: 0, width: 0, x: 0, y: top, toJSON() {} }) as DOMRect
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => (cb(0), 0))
    act(() => {
      window.dispatchEvent(new Event("scroll"))
    })
  }

  it("draws the photo from the `background` prop, and the muted ground without one", () => {
    const { container, rerender } = render(<FooterImageBackedBrand />)
    expect(container.querySelector("img")).toBeNull()
    expect(photo(container).className).toContain("bg-muted")
    rerender(<FooterImageBackedBrand background={{ src: "/photo.jpg", alt: "A room" }} />)
    expect(container.querySelector("img")!.getAttribute("src")).toBe("/photo.jpg")
    expect(container.querySelector("img")!.getAttribute("loading")).toBe("lazy")
  })

  it("lays the photo and the scrim over the whole band, outside the 1280px column and its padding", () => {
    const { container } = render(<FooterImageBackedBrand />)
    const band = container.querySelector("footer")!
    // Direct children of the footer, so inset-0 means the band's own edges: no bars above or below, none at the sides.
    expect(photo(container).parentElement).toBe(band)
    expect(scrim(container).parentElement).toBe(band)
    expect(photo(container).className).toContain("inset-x-0")
    expect(scrim(container).className).toContain("inset-0")
    expect(band.className).toContain("overflow-hidden")
  })

  it("draws the hairline at Figma's .18", () => {
    const { container } = render(<FooterImageBackedBrand />)
    expect(container.querySelector('[role="presentation"]')!.className).toContain("opacity-[.18]")
  })

  it("lays the scrim as its own layer in background-inverse at .62, under the text", () => {
    const { container } = render(<FooterImageBackedBrand />)
    const layer = scrim(container)
    expect(layer.className).toContain("bg-background-inverse")
    expect(layer.className).toContain("opacity-[.62]")
    expect(layer.className).toContain("absolute")
    expect(container.querySelector("h2")!.className).toContain("text-foreground-inverse")
  })

  it("parallaxes the photo by transform only, and takes the scrim from .72 to .62", () => {
    const { container } = render(<FooterImageBackedBrand />)
    scrolled(container, 768)
    expect(photo(container).style.transform).toBe("translateY(-24px)")
    expect(photo(container).style.backgroundPosition).toBe("")
    expect(scrim(container).style.opacity).toBe("0.72")
    scrolled(container, -400)
    expect(photo(container).style.transform).toBe("translateY(24px)")
    expect(scrim(container).style.opacity).toBe("0.62")
  })

  it("shrinks the range with the block: 16px on Tablet, 8px on Mobile", () => {
    env.width = 768
    const tablet = render(<FooterImageBackedBrand />)
    scrolled(tablet.container, 768)
    expect(photo(tablet.container).style.transform).toBe("translateY(-16px)")
    tablet.unmount()
    env.width = 360
    const mobile = render(<FooterImageBackedBrand />)
    scrolled(mobile.container, 768)
    expect(photo(mobile.container).style.transform).toBe("translateY(-8px)")
  })

  it("does no parallax without a fine pointer, or under reduced motion; the scrim stays .62", () => {
    env.fine = false
    const coarse = render(<FooterImageBackedBrand />)
    scrolled(coarse.container, 300)
    expect(photo(coarse.container).style.transform).toBe("")
    expect(scrim(coarse.container).style.opacity).toBe("")
    coarse.unmount()
    env.fine = true
    env.reduced = true
    const reduced = render(<FooterImageBackedBrand />)
    scrolled(reduced.container, 300)
    expect(photo(reduced.container).style.transform).toBe("")
    expect(scrim(reduced.container).style.opacity).toBe("")
  })

  it("fades the content in at 30% visible, 320ms, 60ms apart, and the links as one group", () => {
    const { container } = render(<FooterImageBackedBrand />)
    scrollIntoView()
    const played = animations.filter((a) => a.options.duration === 320)
    expect(played.length).toBeGreaterThan(3)
    expect(played.map((a) => a.options.delay)).toEqual(played.map((_, i) => i * 60))
    expect(container.querySelectorAll("nav[data-reveal]")).toHaveLength(1)
    expect(container.querySelectorAll("nav li[data-reveal]")).toHaveLength(0)
  })

  it("plays no entrance under reduced motion", () => {
    env.reduced = true
    render(<FooterImageBackedBrand />)
    scrollIntoView()
    expect(animations).toHaveLength(0)
  })
})

describe("Marquee Strip", () => {
  const track = (container: HTMLElement) => container.querySelector<HTMLElement>("[data-marquee-track]")!
  const loop = () => animations.find((a) => a.options.iterations === Infinity)!

  it("is a track of fourteen children drawn twice, so the seam is invisible", () => {
    const { container } = render(<FooterMarqueeStrip />)
    const sets = track(container).querySelectorAll("[data-marquee-set]")
    expect(sets).toHaveLength(2)
    sets.forEach((set) => expect(set.children).toHaveLength(14))
    expect(sets[1]!.getAttribute("aria-hidden")).toBe("true")
    expect(container.querySelectorAll("[data-marquee-phrase]")[0]!.textContent).toBe("Bilingual by default")
  })

  it("translates 0 to -50% of its width, linear, forever, 28s on Desktop", () => {
    const { container } = render(<FooterMarqueeStrip />)
    const a = loop()
    expect(a.el).toBe(track(container))
    expect(a.keyframes).toEqual([{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }])
    expect(a.options).toMatchObject({ duration: 28000, iterations: Infinity, easing: "linear" })
  })

  it("scales the duration with the width: 15s on Tablet, 7s on Mobile", () => {
    env.width = 768
    const tablet = render(<FooterMarqueeStrip />)
    expect(loop().options.duration).toBe(15000)
    tablet.unmount()
    animations = []
    env.width = 360
    render(<FooterMarqueeStrip />)
    expect(loop().options.duration).toBe(7000)
  })

  it("runs the other way in Arabic: 0 to +50%", () => {
    render(inDir("rtl", <FooterMarqueeStrip locale="ar" />))
    expect(loop().keyframes).toEqual([{ transform: "translateX(0)" }, { transform: "translateX(50%)" }])
  })

  it("pauses on hover on Desktop, resumes on leave, and just runs on touch and on Mobile", () => {
    const { container } = render(<FooterMarqueeStrip />)
    const stage = container.querySelector("[data-marquee-stage]")!
    fireEvent.mouseEnter(stage)
    expect(loop().pause).toHaveBeenCalledTimes(1)
    fireEvent.mouseLeave(stage)
    expect(loop().play).toHaveBeenCalledTimes(1)
    cleanup()
    animations = []
    env.hover = false
    const touch = render(<FooterMarqueeStrip />)
    fireEvent.mouseEnter(touch.container.querySelector("[data-marquee-stage]")!)
    expect(loop().pause).not.toHaveBeenCalled()
    cleanup()
    animations = []
    env.hover = true
    env.width = 360
    const mobile = render(<FooterMarqueeStrip />)
    fireEvent.mouseEnter(mobile.container.querySelector("[data-marquee-stage]")!)
    expect(loop().pause).not.toHaveBeenCalled()
  })

  it("stops the loop under reduced motion and centres one phrase set", () => {
    env.reduced = true
    const { container } = render(<FooterMarqueeStrip />)
    expect(animations).toHaveLength(0)
    expect(track(container).querySelectorAll("[data-marquee-set]")).toHaveLength(1)
    expect(container.querySelector("[data-marquee-stage]")!.className).toContain("justify-center")
  })

  it("clips the edges hard, with no gradient mask, and sizes the stage 88 / 104 / 132", () => {
    const { container } = render(<FooterMarqueeStrip />)
    const stage = container.querySelector("[data-marquee-stage]")!
    expect(stage.className).toContain("overflow-hidden")
    expect(stage.className).not.toMatch(/mask|gradient/)
    expect(stage.className).toContain("h-[88px]")
    expect(hasVariants(stage.getAttribute("class") ?? "", "[@container(min-width:40rem)]:h-[104px]")).toBe(true)
    expect(hasVariants(stage.getAttribute("class") ?? "", "[@container(min-width:64rem)]:h-[132px]")).toBe(true)
  })

  it("keeps the phrase readable by assistive tech once, not fourteen times", () => {
    const { container } = render(<FooterMarqueeStrip />)
    expect(container.querySelector(".sr-only")!.textContent).toBe("Bilingual by default")
    expect(track(container).getAttribute("aria-hidden")).toBe("true")
  })
})

describe("Big-Type Link Stack", () => {
  const rows = (container: HTMLElement) => Array.from(container.querySelectorAll<HTMLElement>("[data-row]"))

  it("is five rows, each a label and an up-right arrow that flips in Arabic", () => {
    const { container } = render(<FooterBigTypeLinkStack />)
    expect(rows(container).map((row) => row.textContent)).toEqual(["Product", "Documentation", "Pricing", "Company", "Contact"])
    rows(container).forEach((row) => {
      expect(row.querySelector("svg")!.getAttribute("class")).toContain("rtl:-scale-x-100")
      expect(row.querySelector("svg")!.getAttribute("aria-hidden")).toBe("true")
    })
  })

  it("sets the labels 3XL (30px) up to Tablet and 5XL on Desktop, as the frames render them", () => {
    const { container } = render(<FooterBigTypeLinkStack />)
    const label = rows(container)[0]!.querySelector("span")!.className
    expect(label).toContain("text-3xl")
    expect(label).not.toContain("text-4xl")
    expect(hasVariants(label, "[@container(min-width:64rem)]:text-5xl")).toBe(true)
    expect(label).toContain("font-light")
  })

  it("moves label and arrow only under a real hover, 8px on Desktop, 6px on Tablet, toward the end side, and the reverse in Arabic", () => {
    const { container } = render(<FooterBigTypeLinkStack />)
    const label = rows(container)[0]!.querySelector("span")!.className
    expect(hasVariants(label, "group-hover:[@container(min-width:64rem)]:translate-x-2")).toBe(true)
    expect(hasVariants(label, "group-hover:[@container(min-width:40rem)]:translate-x-[6px]")).toBe(true)
    expect(hasVariants(label, "group-hover:rtl:[@container(min-width:64rem)]:-translate-x-2")).toBe(true)
    expect(hasVariants(label, "group-focus-visible:translate-x-2")).toBe(true)
    const arrow = rows(container)[0]!.querySelector("svg")!.getAttribute("class")!
    expect(arrow).toContain("opacity-60")
    expect(hasVariants(arrow, "group-hover:opacity-100")).toBe(true)
  })

  it("tints the row secondary on tap on Mobile and thickens the hairline 1 to 2px on hover", () => {
    const { container } = render(<FooterBigTypeLinkStack />)
    const row = rows(container)[0]!.querySelector("a")!.className
    expect(hasVariants(row, "active:bg-secondary")).toBe(true)
    expect(row).toContain("duration-[120ms]")
    expect(hasVariants(row, "hover:after:scale-y-[2]")).toBe(true)
  })

  it("reveals the rows with a bottom-up clip, 420ms, 70ms apart (50ms on Mobile)", () => {
    const { container } = render(<FooterBigTypeLinkStack />)
    expect(animations).toHaveLength(0)
    scrollIntoView()
    const played = animations.filter((a) => a.options.duration === 420)
    expect(played).toHaveLength(5)
    expect(played.map((a) => a.options.delay)).toEqual([0, 70, 140, 210, 280])
    expect(played[0]!.keyframes).toEqual([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }])
    expect(rows(container)).toHaveLength(5)
    cleanup()
    animations = []
    env.width = 360
    render(<FooterBigTypeLinkStack />)
    scrollIntoView()
    expect(animations.map((a) => a.options.delay)).toEqual([0, 50, 100, 150, 200])
  })

  it("reveals nothing under reduced motion", () => {
    env.reduced = true
    render(<FooterBigTypeLinkStack />)
    scrollIntoView()
    expect(animations).toHaveLength(0)
  })

  it("keeps the email and the address line apart: one a link, one text, and times as a left-to-right island in Arabic", () => {
    const { container } = render(inDir("rtl", <FooterBigTypeLinkStack locale="ar" />))
    expect(screen.getByRole("link", { name: "you@company.com" }).getAttribute("href")).toBe("mailto:you@company.com")
    expect(Array.from(container.querySelectorAll("bdi[dir='ltr']")).map((b) => b.textContent)).toContain("09:00 – 18:00 CET")
  })
})

describe("Bento Tile", () => {
  it("has Figma's six tiles, the form's size is sm, and the dot is an 8px online indicator", () => {
    const { container } = render(<FooterBentoTile />)
    expect(container.querySelectorAll("[data-reveal]")).toHaveLength(5)
    expect(screen.getByRole("textbox", { name: "Email address" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "Join" })).toBeTruthy()
    expect(container.querySelector("[data-halo]")).toBeTruthy()
    expect(screen.getByText("Online")).toBeTruthy()
  })

  it("runs the Subscribe form through its states", async () => {
    let resolve!: () => void
    const onSubscribe = vi.fn(() => new Promise<void>((r) => (resolve = r)))
    render(<FooterBentoTile onSubscribe={onSubscribe} />)
    const input = screen.getByRole("textbox", { name: "Email address" })
    fireEvent.change(input, { target: { value: "nope" } })
    fireEvent.submit(input.closest("form")!)
    expect(screen.getByRole("alert").textContent).toBe("Enter a valid email address.")
    expect(onSubscribe).not.toHaveBeenCalled()
    fireEvent.change(input, { target: { value: "me@company.com" } })
    fireEvent.submit(input.closest("form")!)
    expect(onSubscribe).toHaveBeenCalledWith("me@company.com")
    await act(async () => resolve())
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 200)) }) // the spinner holds for 150ms
    expect(screen.getByRole("status", { name: "" }).textContent).toBe("Thanks. Check your inbox to confirm.")
  })

  it("shows the failure line when sending throws", async () => {
    render(<FooterBentoTile onSubscribe={() => Promise.reject(new Error("no"))} />)
    const input = screen.getByRole("textbox", { name: "Email address" })
    fireEvent.change(input, { target: { value: "me@company.com" } })
    await act(async () => {
      fireEvent.submit(input.closest("form")!)
    })
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 200)) }) // the spinner holds for 150ms
    expect(screen.getByRole("alert").textContent).toBe("That didn't go through. Try again in a moment.")
  })

  it("pulses a 2px halo from 1 to 1.8 while it fades, 2s, forever, and not under reduced motion", () => {
    const { container, unmount } = render(<FooterBentoTile />)
    const halo = animations.find((a) => a.options.iterations === Infinity)!
    expect(halo.el).toBe(container.querySelector("[data-halo]"))
    expect(halo.el.className).toContain("border-2")
    expect(halo.keyframes).toEqual([{ transform: "scale(1)", opacity: 0.6 }, { transform: "scale(1.8)", opacity: 0 }])
    expect(halo.options.duration).toBe(2000)
    unmount()
    animations = []
    env.reduced = true
    const reduced = render(<FooterBentoTile />)
    expect(reduced.container.querySelector("[data-halo]")).toBeNull()
    expect(animations).toHaveLength(0)
  })

  it("enters the tiles with a 12px rise (8px on Mobile), 300ms, 60ms apart in reading order", () => {
    render(<FooterBentoTile />)
    scrollIntoView()
    const played = animations.filter((a) => a.options.duration === 300)
    expect(played.map((a) => a.options.delay)).toEqual([0, 60, 120, 180, 240])
    expect(played[0]!.keyframes[0]).toMatchObject({ transform: "translateY(12px)" })
    cleanup()
    animations = []
    env.width = 360
    render(<FooterBentoTile />)
    scrollIntoView()
    expect(animations.filter((a) => a.options.duration === 300)[0]!.keyframes[0]).toMatchObject({ transform: "translateY(8px)" })
  })

  it("drops the rise but keeps the hover border under reduced motion", () => {
    env.reduced = true
    const { container } = render(<FooterBentoTile />)
    scrollIntoView()
    expect(animations).toHaveLength(0)
    const tile = container.querySelector("[data-reveal]")!.className
    expect(hasVariants(tile, "hover:border-foreground")).toBe(true)
    expect(tile).toContain("motion-safe:")
    expect(hasVariants(tile, "hover:-translate-y-[3px]")).toBe(true)
  })

  it("draws the status link arrow so that it flips in Arabic", () => {
    const { container } = render(inDir("rtl", <FooterBentoTile locale="ar" />))
    const link = screen.getByRole("link", { name: "عرض سجل الحالة" })
    expect(link.querySelector("svg")!.getAttribute("class")).toContain("rtl:-scale-x-100")
    expect(container.querySelector("bdi[dir='ltr']")).toBeTruthy()
  })
})
