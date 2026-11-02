import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, within } from "@testing-library/react"
import { FooterFourColumnDirectory, footerFourColumnDirectoryCopy } from "./footer-four-column-directory"
import { FooterWideSitemapMega, footerWideSitemapMegaCopy } from "./footer-wide-sitemap-mega"
import { FooterAccordionSitemap, footerAccordionSitemapCopy } from "./footer-accordion-sitemap"
import { FooterTwoTierDoormat, footerTwoTierDoormatCopy } from "./footer-two-tier-doormat"
import { FooterIndexNumberedColumns, footerIndexNumberedColumnsCopy } from "./footer-index-numbered-columns"

// What these tests can and cannot prove: jsdom has no layout, no hover and no
// Web Animations, so the breakpoints (container queries), the Select menu's
// placement, the Accordion's height animation and the hairline draw were
// checked in a browser. Here `Element.animate`, `IntersectionObserver` and
// `matchMedia` are stubs, so the tests assert the contract: the landmarks, the
// labelled link groups, Figma's copy in both languages, the empty cases, the
// Accordion's one-open-at-a-time rule, and the timings and reduced-motion
// behaviour handed to the Index-Numbered Columns entrance.

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
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
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

type Locale = "en" | "ar"

interface Case {
  name: string
  render: (locale: Locale, props?: Record<string, unknown>) => React.ReactElement
  copy: { en: unknown; ar: unknown }
  /** Strings Figma shows, per language. */
  key: Record<Locale, string[]>
  /** Props that empty every collection the Type has. */
  empty: Record<string, unknown>
}

const CASES: Case[] = [
  {
    name: "Four-Column Directory",
    render: (locale, props) => <FooterFourColumnDirectory locale={locale} {...props} />,
    copy: footerFourColumnDirectoryCopy,
    key: { en: ["Product", "Resources", "Company", "Legal", "Privacy Policy"], ar: ["المنتج", "الموارد", "الشركة", "قانوني", "سياسة الخصوصية"] },
    empty: { columns: [], legal: [], socials: [] },
  },
  {
    name: "Wide Sitemap Mega",
    render: (locale, props) => <FooterWideSitemapMega locale={locale} {...props} />,
    copy: footerWideSitemapMegaCopy,
    key: {
      en: ["Design system for bilingual products", "Components", "Foundations", "Request a feature", "System status", "Sitemap"],
      ar: ["نظام تصميم للمنتجات ثنائية اللغة", "المكوّنات", "الأساسيات", "اطلب ميزة", "حالة النظام", "خريطة الموقع"],
    },
    empty: { columns: [], legal: [], languages: [], regions: [], tagline: "" },
  },
  {
    name: "Accordion Sitemap",
    render: (locale, props) => <FooterAccordionSitemap locale={locale} {...props} />,
    copy: footerAccordionSitemapCopy,
    key: {
      en: ["Documentation & product sitemap", "Product", "Resources", "Developers", "Legal & Trust", "Buttons"],
      ar: ["التوثيق وخريطة المنتج", "المنتج", "الموارد", "المطوّرون", "القانون والثقة", "الأزرار"],
    },
    empty: { groups: [], legal: [], socials: [], tagline: "" },
  },
  {
    name: "Two-Tier Doormat",
    render: (locale, props) => <FooterTwoTierDoormat locale={locale} {...props} />,
    copy: footerTwoTierDoormatCopy,
    key: {
      en: ["Platform", "Solutions", "Head office", "Talk to sales", "Product support", "Press & partnerships"],
      ar: ["المنصة", "الحلول", "المقر الرئيسي", "تحدّث إلى المبيعات", "دعم المنتج", "الصحافة والشراكات"],
    },
    empty: { columns: [], contacts: [], legal: [], socials: [] },
  },
  {
    name: "Index-Numbered Columns",
    render: (locale, props) => <FooterIndexNumberedColumns locale={locale} {...props} />,
    copy: footerIndexNumberedColumnsCopy,
    key: {
      en: ["A design system built in two directions", "INDEX", "Product", "Learn", "Support", "Back to top"],
      ar: ["نظام تصميم مبني في اتجاهين", "الفهرس", "المنتج", "تعلّم", "الدعم", "العودة إلى الأعلى"],
    },
    empty: { columns: [], legal: [], statement: "", indexLabel: "" },
  },
]

describe.each(CASES)("$name", (kase) => {
  describe.each(["en", "ar"] as const)("in %s", (locale) => {
    it("renders one footer landmark", () => {
      const { container } = render(<div>{kase.render(locale)}</div>)
      expect(container.querySelectorAll("footer")).toHaveLength(1)
      expect(screen.getAllByRole("contentinfo")).toHaveLength(1)
    })

    it("names every link group", () => {
      const { container } = render(<div>{kase.render(locale)}</div>)
      const navs = Array.from(container.querySelectorAll("nav"))
      expect(navs.length).toBeGreaterThan(0)
      navs.forEach((nav) => {
        const labelledBy = nav.getAttribute("aria-labelledby")
        const name = nav.getAttribute("aria-label") ?? (labelledBy ? container.querySelector(`[id="${labelledBy}"]`)?.textContent : "")
        expect(name?.trim()).toBeTruthy()
      })
    })

    it("shows Figma's copy", () => {
      const { container } = render(<div>{kase.render(locale)}</div>)
      kase.key[locale].forEach((text) => expect(container.textContent).toContain(text))
    })

    it("draws no mirrored rotation and sets no direction of its own", () => {
      const { container } = render(<div>{kase.render(locale)}</div>)
      expect(container.innerHTML).not.toContain("rtl:rotate-180")
      expect(container.querySelector("footer")?.getAttribute("dir")).toBeNull()
    })

    it("accepts empty collections and draws no empty heading", () => {
      const { container } = render(<div>{kase.render(locale, kase.empty)}</div>)
      expect(container.querySelectorAll("footer")).toHaveLength(1)
      container.querySelectorAll("h2, h3, h4").forEach((heading) => expect(heading.textContent?.trim()).toBeTruthy())
      container.querySelectorAll("ul").forEach((list) => expect(list.children.length).toBeGreaterThan(0))
    })
  })

  it("writes the Arabic with no em dash and no middle dot", () => {
    strings(kase.copy.ar).forEach((text) => {
      expect(text).not.toMatch(/[—·]/)
      expect(text).not.toMatch(/\*/)
    })
  })
})

describe("Wide Sitemap Mega", () => {
  it("has two Selects named by language and region, the first set to the page's language", () => {
    render(<FooterWideSitemapMega />)
    const language = screen.getByRole("combobox", { name: "Language" })
    const region = screen.getByRole("combobox", { name: "Region" })
    expect(language.textContent).toContain("English (US)")
    expect(region.textContent).toContain("Europe")
  })

  it("starts the Arabic page on Arabic and the Arabic region", () => {
    render(<FooterWideSitemapMega locale="ar" />)
    expect(screen.getByRole("combobox", { name: "اللغة" }).textContent).toContain("العربية")
    expect(screen.getByRole("combobox", { name: "المنطقة" }).textContent).toContain("أوروبا")
  })

  it("shows the online Status Indicator beside its words, named once", () => {
    const { container } = render(<FooterWideSitemapMega />)
    const dot = container.querySelector("span.bg-success")
    expect(dot).toBeTruthy()
    expect(dot?.textContent).toBe("")
    expect(container.textContent).toContain("System status")
  })

  it("draws six columns of seven links", () => {
    const { container } = render(<FooterWideSitemapMega />)
    const columns = Array.from(container.querySelectorAll("nav")).filter((nav) => nav.hasAttribute("aria-labelledby"))
    expect(columns).toHaveLength(6)
    columns.forEach((nav) => expect(nav.querySelectorAll("li")).toHaveLength(7))
  })

  it("plays no motion", () => {
    render(<FooterWideSitemapMega />)
    reveal()
    expect(animations).toHaveLength(0)
  })
})

describe("Accordion Sitemap", () => {
  const triggers = () => screen.getAllByRole("button").filter((button) => button.getAttribute("aria-expanded") !== null)

  it("opens the first group, as Figma draws it, and shows its three columns", () => {
    render(<FooterAccordionSitemap />)
    const first = triggers()[0]!
    const rest = triggers().slice(1)
    expect(first.textContent).toContain("Product")
    expect(first.getAttribute("aria-expanded")).toBe("true")
    rest.forEach((button) => expect(button.getAttribute("aria-expanded")).toBe("false"))
    const panel = screen.getByRole("region", { name: /Product/ })
    expect(within(panel).getAllByRole("navigation")).toHaveLength(3)
    expect(within(panel).getByRole("navigation", { name: "Components" })).toBeTruthy()
  })

  it("keeps one group open: opening another closes the first", () => {
    render(<FooterAccordionSitemap />)
    fireEvent.click(screen.getByRole("button", { name: /Developers/ }))
    expect(screen.getByRole("button", { name: /Developers/ }).getAttribute("aria-expanded")).toBe("true")
    expect(screen.getByRole("button", { name: /Product/ }).getAttribute("aria-expanded")).toBe("false")
    expect(triggers().filter((button) => button.getAttribute("aria-expanded") === "true")).toHaveLength(1)
  })

  it("closes the open group when its header is pressed again", () => {
    render(<FooterAccordionSitemap />)
    fireEvent.click(screen.getByRole("button", { name: /Product/ }))
    expect(triggers().filter((button) => button.getAttribute("aria-expanded") === "true")).toHaveLength(0)
  })

  it("can start with another group open, or none", () => {
    const { unmount } = render(<FooterAccordionSitemap defaultOpen="company" />)
    expect(screen.getByRole("button", { name: /Company/ }).getAttribute("aria-expanded")).toBe("true")
    unmount()
    render(<FooterAccordionSitemap defaultOpen="" />)
    expect(triggers().filter((button) => button.getAttribute("aria-expanded") === "true")).toHaveLength(0)
  })

  it("leaves the open and close motion to the Accordion atom", () => {
    render(<FooterAccordionSitemap />)
    reveal()
    fireEvent.click(screen.getByRole("button", { name: /Resources/ }))
    expect(animations).toHaveLength(0)
  })
})

describe("Two-Tier Doormat", () => {
  it("draws five doormat columns of five links and four contact cards of two lines", () => {
    const { container } = render(<FooterTwoTierDoormat />)
    const columns = Array.from(container.querySelectorAll("nav")).filter((nav) => nav.hasAttribute("aria-labelledby"))
    expect(columns).toHaveLength(5)
    columns.forEach((nav) => expect(nav.querySelectorAll("li")).toHaveLength(5))
    const cards = Array.from(container.querySelectorAll("h3")).filter((heading) => heading.closest("li"))
    expect(cards.map((heading) => heading.textContent)).toEqual(["Head office", "Talk to sales", "Product support", "Press & partnerships"])
  })

  it.each(["en", "ar"] as const)("gives the four contact cards equal columns and the full width of each, in %s", (locale) => {
    const { container } = render(<FooterTwoTierDoormat locale={locale} />)
    const list = Array.from(container.querySelectorAll("ul")).find((ul) => ul.querySelector("h3"))!
    // minmax(0, 1fr): a long line cannot widen one column. jsdom has no layout, so the classes are the contract.
    expect(list.className).toContain("grid-cols-[minmax(0,1fr)]")
    expect(list.className).toContain("[@container(min-width:40rem)]:grid-cols-[repeat(2,minmax(0,1fr))]")
    expect(list.className).toContain("[@container(min-width:64rem)]:grid-cols-[repeat(4,minmax(0,1fr))]")
    list.querySelectorAll("li").forEach((item) => {
      expect(item.className).toContain("min-w-0")
      expect(item.querySelector("h3")!.parentElement!.className).toContain("w-full")
    })
  })

  it("keeps digits, emails and times in their own direction inside Arabic lines", () => {
    const { container } = render(<FooterTwoTierDoormat locale="ar" />)
    const bidi = Array.from(container.querySelectorAll("bdi")).map((el) => el.textContent)
    expect(bidi).toContain("123")
    expect(bidi).toContain("you@company.com")
    expect(bidi).toContain("09:00–18:00 CET")
    container.querySelectorAll("bdi").forEach((el) => expect(el.getAttribute("dir")).toBe("ltr"))
  })

  it("never mirrors the social marks", () => {
    const { container } = render(<FooterTwoTierDoormat locale="ar" />)
    expect(container.innerHTML).not.toMatch(/rtl:-scale-x-100/)
    expect(screen.getByRole("link", { name: "LinkedIn" })).toBeTruthy()
  })
})

describe("Index-Numbered Columns", () => {
  it("numbers the columns 01 to 04 and puts the hairline at the inline start", () => {
    const { container } = render(<FooterIndexNumberedColumns />)
    const numbers = Array.from(container.querySelectorAll("[data-index-column] span[aria-hidden='true']:not([data-hairline])")).map((el) => el.textContent)
    expect(numbers).toEqual(["01", "02", "03", "04"])
    container.querySelectorAll("[data-hairline]").forEach((line) => {
      expect(line.className).toContain("start-0")
      expect(line.className).not.toMatch(/(^|\s)(left|right)-/)
    })
  })

  it("keeps Back to top's arrow vertical, with no mirroring", () => {
    render(<FooterIndexNumberedColumns locale="ar" />)
    const link = screen.getByRole("link", { name: "العودة إلى الأعلى" })
    expect(link.querySelector("svg")?.getAttribute("class")).not.toMatch(/scale-x|rotate/)
  })

  it("plays nothing on load", () => {
    render(<FooterIndexNumberedColumns />)
    expect(animations).toHaveLength(0)
  })

  it("on reveal draws each hairline from the top in 320ms, 60ms apart on wide containers, links 120ms behind", () => {
    const { container } = render(<FooterIndexNumberedColumns />)
    // jsdom has no width, so the block counts as a phone: all hairlines together.
    reveal()
    const lines = animations.filter((a) => a.el.hasAttribute("data-hairline"))
    expect(lines).toHaveLength(4)
    lines.forEach((a) => {
      expect(a.keyframes).toEqual([{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }])
      expect(a.options).toMatchObject({ duration: 320, delay: 0, easing: "ease-out" })
    })
    const links = animations.filter((a) => a.el.hasAttribute("data-link"))
    expect(links).toHaveLength(container.querySelectorAll("[data-link]").length)
    const firstColumn = animations.filter((a) => a.el.closest("[data-index-column]") === container.querySelector("[data-index-column]") && a.el.hasAttribute("data-link"))
    expect(firstColumn.map((a) => a.options.delay)).toEqual([120, 145, 170, 195, 220])
    firstColumn.forEach((a) => {
      expect(a.options.duration).toBe(220)
      expect(a.keyframes[0]).toMatchObject({ opacity: 0, transform: "translateY(8px)" })
    })
  })

  it("staggers 60ms per column on a wide container, in reading order (which is right to left in Arabic)", () => {
    const { container } = render(<FooterIndexNumberedColumns locale="ar" />)
    vi.spyOn(container.querySelector("footer") as HTMLElement, "getBoundingClientRect").mockReturnValue({ width: 1440 } as DOMRect)
    reveal()
    const delays = animations.filter((a) => a.el.hasAttribute("data-hairline")).map((a) => a.options.delay)
    expect(delays).toEqual([0, 60, 120, 180])
  })

  it("plays once", () => {
    render(<FooterIndexNumberedColumns />)
    reveal()
    const count = animations.length
    reveal()
    expect(animations).toHaveLength(count)
  })

  it("under reduced motion plays nothing: everything is drawn in place", () => {
    setMotion(true)
    render(<FooterIndexNumberedColumns />)
    reveal()
    expect(animations).toHaveLength(0)
  })

  it("lifts the arrow 3px on hover and on press, only on a pointer that hovers", () => {
    render(<FooterIndexNumberedColumns />)
    const arrow = screen.getByRole("link", { name: "Back to top" }).querySelector("svg")
    const cls = arrow?.getAttribute("class") ?? ""
    expect(cls).toContain("group-active/top:-translate-y-[3px]")
    expect(cls).toContain("group-hover/top:[@container(min-width:40rem)]:-translate-y-[3px]")
    expect(cls).toContain("motion-reduce:transition-none")
  })
})
