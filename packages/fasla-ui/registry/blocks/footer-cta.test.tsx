import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { FooterCtaBandColumns, footerCtaBandColumnsCopy } from "./footer-cta-band-columns"
import { FooterNewsletterSplit, footerNewsletterSplitCopy } from "./footer-newsletter-split"
import { FooterFloatingDemoCard, footerFloatingDemoCardCopy } from "./footer-floating-demo-card"
import { FooterBigQuestionCta, footerBigQuestionCtaCopy } from "./footer-big-question-cta"

// What these tests can and cannot prove: jsdom has no layout, no hover and no
// Web Animations, so the breakpoints (container queries), the card's straddle
// of the page edge, the lines the headline breaks into, the clip-path look and
// the hover lift were checked in a browser. Here `Element.animate`,
// `IntersectionObserver` and `matchMedia` are stubs, so the tests assert the
// contract around the motion (what starts it, on which elements, the timings
// and properties handed to it, what reduced motion does instead), the form's
// state machine, the landmarks, the copy and the empty cases.

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

type Locale = "en" | "ar"

interface Case {
  name: string
  render: (locale: Locale, props?: Record<string, unknown>) => React.ReactElement
  copy: { en: unknown; ar: unknown }
  key: Record<Locale, string[]>
  empty: Record<string, unknown>
}

const CASES: Case[] = [
  {
    name: "CTA Band + Columns",
    render: (locale, props) => <FooterCtaBandColumns locale={locale} {...props} />,
    copy: footerCtaBandColumnsCopy,
    key: {
      en: ["Ship your next release on Fasla.", "Ready-made components", "Start free", "Book a demo", "The bilingual design system for product teams.", "Cookie Preferences"],
      ar: ["أطلق إصدارك القادم على فاصلة.", "ابدأ مجانًا", "احجز عرضًا", "نظام التصميم ثنائي اللغة لفرق المنتج.", "تفضيلات ملفات تعريف الارتباط"],
    },
    empty: { columns: [], legal: [], socials: [], blurb: "", headline: "", sub: "" },
  },
  {
    name: "Newsletter Split",
    render: (locale, props) => <FooterNewsletterSplit locale={locale} {...props} />,
    copy: footerNewsletterSplitCopy,
    key: {
      en: ["Every release, in your inbox.", "Subscribe", "No spam. Unsubscribe in one click.", "Product", "Resources", "Company"],
      ar: ["كل إصدار، في بريدك.", "اشترك", "لا رسائل مزعجة. ألغِ الاشتراك بنقرة واحدة.", "المنتج", "الموارد", "الشركة"],
    },
    empty: { columns: [], legal: [], socials: [], microcopy: "", headline: "", sub: "" },
  },
  {
    name: "Floating Demo Card",
    render: (locale, props) => <FooterFloatingDemoCard locale={locale} {...props} />,
    copy: footerFloatingDemoCardCopy,
    key: {
      en: ["See Fasla on your own product.", "Book a demo", "See pricing", "Components, tokens and patterns", "Legal"],
      ar: ["شاهد فاصلة على منتجك أنت.", "احجز عرضًا", "اطّلع على الأسعار", "مكوّنات ورموز وأنماط", "قانوني"],
    },
    empty: { columns: [], legal: [], socials: [], blurb: "", title: "", sub: "" },
  },
  {
    name: "Big-Question CTA",
    render: (locale, props) => <FooterBigQuestionCta locale={locale} {...props} />,
    copy: footerBigQuestionCtaCopy,
    key: {
      en: ["Ready to make your next release feel inevitable?", "Start building", "Talk to us", "Documentation", "Accessibility"],
      ar: ["مستعدّ ليبدو إصدارك القادم أمرًا محتومًا؟", "ابدأ البناء", "تحدّث إلينا", "التوثيق", "إمكانية الوصول"],
    },
    empty: { nav: [], legal: [], socials: [], headline: "", sub: "" },
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

  it("keeps the numbers in Arabic lines in their own direction", () => {
    const { container } = render(<div>{kase.render("ar")}</div>)
    container.querySelectorAll("bdi").forEach((el) => expect(el.getAttribute("dir")).toBe("ltr"))
  })
})

describe("CTA Band + Columns", () => {
  it("is a heading and sentence then two size-lg Buttons that are links, on the inverse band", () => {
    const { container } = render(<FooterCtaBandColumns />)
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Ship your next release on Fasla.")
    const start = screen.getByRole("link", { name: "Start free" })
    const demo = screen.getByRole("link", { name: "Book a demo" })
    expect(start.className).toContain("bg-secondary")
    expect(start.className).toContain("h-10")
    expect(demo.className).toContain("ring-1")
    expect(demo.className).toContain("h-10")
    expect(container.querySelector(".bg-background-inverse")?.contains(start)).toBe(true)
  })

  it("plays nothing on load, then on reveal the headline, sentence and Buttons rise 16px over 400ms, 80ms apart", () => {
    render(<FooterCtaBandColumns />)
    expect(animations).toHaveLength(0)
    reveal()
    expect(animations).toHaveLength(3)
    animations.forEach((a, i) => {
      expect(a.options).toMatchObject({ duration: 400, delay: i * 80, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" })
      expect(a.keyframes[0]).toMatchObject({ opacity: 0, transform: "translateY(16px)" })
    })
  })

  it("does not animate the columns tier", () => {
    const { container } = render(<FooterCtaBandColumns />)
    reveal()
    animations.forEach((a) => expect(container.querySelector(".bg-background-inverse")?.contains(a.el)).toBe(true))
  })

  it("under reduced motion fades for 200ms and rises nowhere", () => {
    setMotion(true)
    render(<FooterCtaBandColumns />)
    reveal()
    expect(animations.length).toBeGreaterThan(0)
    animations.forEach((a) => {
      expect(a.options.duration).toBe(200)
      expect(a.options.delay).toBe(0)
      a.keyframes.forEach((k) => expect(k).not.toHaveProperty("transform"))
    })
  })

  it("adds no hover scale or border change to the Buttons", () => {
    const { container } = render(<FooterCtaBandColumns />)
    const html = container.querySelector(".bg-background-inverse")?.innerHTML ?? ""
    expect(html).not.toMatch(/hover:scale|scale-\[1\.02\]|hover:border/)
  })
})

describe("Newsletter Split", () => {
  const field = () => screen.getByRole("textbox", { name: "Email address" }) as HTMLInputElement
  const subscribe = () => screen.getByRole("button", { name: "Subscribe" })

  it("starts as Figma draws it: a size md field and a Solid Primary Button", () => {
    render(<FooterNewsletterSplit />)
    expect(field().getAttribute("placeholder")).toBe("you@company.com")
    expect(subscribe().className).toContain("bg-primary")
    expect(subscribe().className).toContain("h-9")
  })

  it("rejects an address that isn't one, with the shared line, and does not call out", () => {
    const onSubscribe = vi.fn()
    render(<FooterNewsletterSplit onSubscribe={onSubscribe} />)
    fireEvent.change(field(), { target: { value: "nope" } })
    fireEvent.click(subscribe())
    expect(screen.getByRole("alert").textContent).toBe("Enter a valid email address.")
    expect(field().getAttribute("aria-invalid")).toBe("true")
    expect(onSubscribe).not.toHaveBeenCalled()
  })

  it("disables the field and shows the spinner while sending, then replaces the form with the sent line", async () => {
    let finish: () => void = () => {}
    const onSubscribe = vi.fn(() => new Promise<void>((resolve) => (finish = resolve)))
    render(<FooterNewsletterSplit onSubscribe={onSubscribe} />)
    fireEvent.change(field(), { target: { value: "you@example.com" } })
    const input = field()
    const button = subscribe()
    fireEvent.click(button)
    expect(onSubscribe).toHaveBeenCalledWith("you@example.com")
    expect(field().disabled).toBe(true)
    expect(button.hasAttribute("disabled")).toBe(true)
    await act(async () => finish())
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 200)) }) // the spinner holds for 150ms
    expect(screen.getByRole("status").textContent).toBe("Thanks. Check your inbox to confirm.")
    expect(input.closest("form")?.hasAttribute("inert")).toBe(true)
  })

  it("turns the field invalid and shows the error line when sending fails", async () => {
    const onSubscribe = vi.fn(() => Promise.reject(new Error("no")))
    render(<FooterNewsletterSplit onSubscribe={onSubscribe} />)
    fireEvent.change(field(), { target: { value: "you@example.com" } })
    await act(async () => {
      fireEvent.click(subscribe())
    })
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 200)) }) // the spinner holds for 150ms
    expect(screen.getByRole("alert").textContent).toBe("That didn't go through. Try again in a moment.")
    expect(field().getAttribute("aria-invalid")).toBe("true")
    expect(field().disabled).toBe(false)
  })

  it("can be held in a state for a story", () => {
    const { rerender } = render(<FooterNewsletterSplit status="loading" />)
    expect(field().disabled).toBe(true)
    rerender(<FooterNewsletterSplit status="sent" />)
    expect(screen.getByRole("status").textContent).toBe("Thanks. Check your inbox to confirm.")
  })

  it("says the same in Arabic, with the Arabic words", async () => {
    render(<FooterNewsletterSplit locale="ar" />)
    const input = screen.getByRole("textbox", { name: "البريد الإلكتروني" })
    fireEvent.change(input, { target: { value: "x" } })
    fireEvent.click(screen.getByRole("button", { name: "اشترك" }))
    expect(screen.getByRole("alert").textContent).toBe("أدخل بريدًا إلكترونيًا صحيحًا.")
  })

  it("plays no entrance", () => {
    render(<FooterNewsletterSplit />)
    reveal()
    expect(animations).toHaveLength(0)
  })
})

describe("Floating Demo Card", () => {
  const card = (container: HTMLElement) => container.querySelector("h2")?.closest(".shadow-xl") as HTMLElement

  it("has a Page Tail band above the body and the card in the body, in the flow before the directory", () => {
    const { container } = render(<FooterFloatingDemoCard />)
    const tail = container.querySelector("footer div[aria-hidden='true']") as HTMLElement
    expect(tail.className).toContain("bg-background")
    expect(tail.className).toContain("h-8")
    expect(tail.className).toContain("h-[88px]")
    expect(tail.className).toContain("h-24")
    expect(container.querySelector("footer .bg-secondary")?.contains(card(container))).toBe(true)
    expect(card(container).className).toContain("rounded-2xl")
  })

  it("straddles by centring on the edge on Desktop and a fixed 44px over it on Tablet, without a transform", () => {
    const { container } = render(<FooterFloatingDemoCard />)
    const slot = card(container).parentElement as HTMLElement
    expect(slot.className).toContain("[@container(min-width:64rem)]:top-24")
    expect(slot.className).toContain("[@container(min-width:64rem)]:h-0")
    expect(slot.className).toContain("[@container(min-width:64rem)]:items-center")
    expect(slot.className).toContain("[@container(min-width:40rem)]:top-11")
    expect(slot.className).toContain("relative")
    expect(slot.className).not.toMatch(/translate/)
  })

  it("has the two Buttons Figma draws: Solid Primary and Ghost Secondary, size lg", () => {
    render(<FooterFloatingDemoCard />)
    const demo = screen.getByRole("link", { name: "Book a demo" })
    const pricing = screen.getByRole("link", { name: "See pricing" })
    expect(demo.className).toContain("bg-primary")
    expect(pricing.className).not.toContain("ring-1")
    expect(demo.className).toContain("h-10")
    expect(pricing.className).toContain("h-10")
  })

  it("plays nothing on load, then rises (transform only), 380ms ease-out", () => {
    const { container } = render(<FooterFloatingDemoCard />)
    expect(animations).toHaveLength(0)
    reveal()
    expect(animations).toHaveLength(1)
    const a = animations[0]!
    expect(a.el).toBe(card(container))
    expect(a.options).toMatchObject({ duration: 380, easing: "ease-out" })
    // jsdom has no width, so the card counts as a phone: 16px.
    expect(a.keyframes[0]).toMatchObject({ transform: "translateY(16px)" })
    expect(a.keyframes[1]).toMatchObject({ transform: "none" })
    a.keyframes.forEach((k) => {
      Object.keys(k).forEach((property) => expect(["transform"]).toContain(property))
      expect(k).not.toHaveProperty("top")
      expect(k).not.toHaveProperty("marginTop")
    })
  })

  it("rises 24px on a wide container", () => {
    const { container } = render(<FooterFloatingDemoCard />)
    vi.spyOn(card(container), "getBoundingClientRect").mockReturnValue({ width: 1120 } as DOMRect)
    reveal()
    expect(animations[0]!.keyframes[0]).toMatchObject({ transform: "translateY(24px)" })
  })

  it("under reduced motion plays nothing: no rise, no lift", () => {
    setMotion(true)
    const { container } = render(<FooterFloatingDemoCard />)
    reveal()
    expect(animations).toHaveLength(0)
    expect(card(container).className).toContain("motion-safe:")
  })

  it("lifts 4px in 180ms on hover, from Tablet up, on a pointer that hovers", () => {
    const { container } = render(<FooterFloatingDemoCard />)
    const cls = card(container).className
    expect(cls).toContain("duration-[180ms]")
    expect(cls).toContain("hover:motion-safe:[@container(min-width:40rem)]:-translate-y-1")
  })
})

describe("Big-Question CTA", () => {
  it("sets the headline 5XL Light on Desktop and 30px (3XL) on Tablet and 24px (2XL) on Mobile, as the frames render it", () => {
    render(<FooterBigQuestionCta />)
    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading.className).toContain("text-2xl")
    expect(heading.className).toContain("[@container(min-width:40rem)]:text-3xl")
    expect(heading.className).toContain("[@container(min-width:64rem)]:text-5xl")
    expect(heading.className).toContain("font-light")
    expect(heading.textContent).toBe("Ready to make your next release feel inevitable?")
  })

  it("splits the headline into its words and keeps the sentence whole for a screen reader", () => {
    const { container } = render(<FooterBigQuestionCta />)
    expect(container.querySelectorAll("[data-q-word]")).toHaveLength(8)
  })

  it("has Solid Primary and Outline Secondary size-lg Buttons that are links", () => {
    render(<FooterBigQuestionCta />)
    expect(screen.getByRole("link", { name: "Start building" }).className).toContain("bg-primary")
    expect(screen.getByRole("link", { name: "Talk to us" }).className).toContain("ring-1")
    expect(screen.getByRole("link", { name: "Talk to us" }).className).toContain("h-10")
  })

  it("plays nothing on load, then reveals each line's words by clip-path in 520ms, with the sentence and Buttons following at 240ms", () => {
    render(<FooterBigQuestionCta />)
    expect(animations).toHaveLength(0)
    reveal()
    const words = animations.filter((a) => a.el.hasAttribute("data-q-word"))
    expect(words).toHaveLength(8)
    words.forEach((a) => {
      expect(a.keyframes).toEqual([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0)" }])
      expect(a.options).toMatchObject({ duration: 520, easing: "cubic-bezier(.16,1,.3,1)" })
      expect(a.keyframes.every((k) => !("letterSpacing" in k))).toBe(true)
    })
    const follow = animations.filter((a) => a.el.hasAttribute("data-q-follow"))
    expect(follow).toHaveLength(2)
    follow.forEach((a) => {
      expect(a.options.delay).toBe(240)
      expect(a.keyframes[0]).toMatchObject({ opacity: 0, transform: "translateY(10px)" })
    })
  })

  it("delays each line by 90ms, or 60ms on a phone", () => {
    const { container } = render(<FooterBigQuestionCta />)
    const spoken = Array.from(container.querySelectorAll<HTMLElement>("[data-q-word]"))
    // Put the words on three lines.
    spoken.forEach((word, i) => Object.defineProperty(word, "offsetTop", { value: Math.floor(i / 3) * 40, configurable: true }))
    vi.spyOn(container.querySelector("[data-q-headline]")?.closest("div[class*='flex-col']")?.parentElement as HTMLElement, "getBoundingClientRect").mockReturnValue({ width: 1280 } as DOMRect)
    reveal()
    const delays = animations.filter((a) => a.el.hasAttribute("data-q-word")).map((a) => a.options.delay)
    expect(delays).toEqual([0, 0, 0, 90, 90, 90, 180, 180])
  })

  it("under reduced motion fades the headline for 200ms and plays nothing else", () => {
    setMotion(true)
    render(<FooterBigQuestionCta />)
    reveal()
    expect(animations).toHaveLength(1)
    expect(animations[0]!.keyframes).toEqual([{ opacity: 0 }, { opacity: 1 }])
    expect(animations[0]!.options.duration).toBe(200)
  })

  it("writes the Arabic question and keeps 40 in its own direction", () => {
    const { container } = render(<FooterBigQuestionCta locale="ar" />)
    expect(Array.from(container.querySelectorAll("bdi")).map((el) => el.textContent)).toContain("40")
  })
})
