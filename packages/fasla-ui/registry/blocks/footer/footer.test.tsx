import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"
import {
  FOOTER_COMMON,
  FOOTER_FORM_COPY,
  FOOTER_YEAR,
  FooterLegalBar,
  FooterLinkColumn,
  FooterNewsletterForm,
  FooterRule,
  FooterSection,
  FooterSocial,
  useFooterReveal,
} from "./footer"

// What these tests can and cannot prove: jsdom has no layout, so the container
// query layouts and the motion were checked in a browser. These assert the
// contract around them: the shared copy and its Arabic rules, the form's state
// machine (idle, loading, sent, error, invalid), the social links, the labelled
// link columns, and the reveal hook playing once, in reading order, and not at
// all under reduced motion.

const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : []

describe("shared copy", () => {
  it("fixes the year at 2026 in both languages, so the demo never changes", () => {
    expect(FOOTER_YEAR).toBe(2026)
    expect(FOOTER_COMMON.en.copyright).toContain("2026")
    expect(FOOTER_COMMON.ar.copyright).toContain("2026")
  })

  it("has no em dash or middle dot in Arabic, and writes فاصلة, not Fasla, in Arabic sentences", () => {
    for (const text of [...strings(FOOTER_COMMON.ar), ...strings(FOOTER_FORM_COPY.ar)]) {
      expect(text, text).not.toMatch(/[—·]/)
      expect(text, text).not.toMatch(/Fasla/)
    }
  })

  it("has the approved confirmation, error and thank-you lines", () => {
    expect(FOOTER_FORM_COPY.en.sent).toBe("Thanks. Check your inbox to confirm.")
    expect(FOOTER_FORM_COPY.en.error).toBe("That didn't go through. Try again in a moment.")
    expect(FOOTER_FORM_COPY.en.docsThanks).toBe("Thanks for the feedback.")
    expect(FOOTER_FORM_COPY.ar.sent).toBe("شكرًا لك. تحقق من بريدك لتأكيد الاشتراك.")
    expect(FOOTER_FORM_COPY.ar.docsThanks).toBe("شكرًا على ملاحظاتك.")
  })
})

describe("FooterSection", () => {
  it("is one footer landmark, a query container, painted by the inverse tokens when asked", () => {
    const { container, rerender } = render(<FooterSection>x</FooterSection>)
    const footer = container.querySelector("footer")!
    expect(footer.className).toContain("[container-type:inline-size]")
    expect(footer.className).toContain("bg-background")
    expect(footer.className).not.toContain("bg-background-inverse")
    rerender(<FooterSection inverse>x</FooterSection>)
    expect(container.querySelector("footer")!.className).toContain("bg-background-inverse")
    expect(container.querySelector("footer")!.className).toContain("text-foreground-inverse")
  })

  it("keeps its padding and its column in logical, symmetrical classes", () => {
    const { container } = render(<FooterSection>x</FooterSection>)
    expect(container.querySelector("footer")!.className).toMatch(/\bpx-4\b/)
    expect(container.innerHTML).not.toMatch(/\b(ml|mr|pl|pr)-\d/)
  })
})

describe("FooterRule", () => {
  it("is a presentational 1px line, and uses the inverse tokens on an inverse band", () => {
    const { container, rerender } = render(<FooterRule />)
    expect(container.firstElementChild!.getAttribute("role")).toBe("presentation")
    expect(container.firstElementChild!.className).toContain("h-px")
    expect(container.firstElementChild!.className).toContain("bg-border")
    rerender(<FooterRule inverse />)
    expect(container.firstElementChild!.className).toContain("bg-foreground-inverse")
  })
})

describe("FooterSocial", () => {
  it("links each platform with its own name and keeps the marks unmirrored", () => {
    render(<FooterSocial platforms={["linkedin", "x", "github"]} />)
    expect(screen.getByRole("link", { name: "LinkedIn" })).toBeTruthy()
    expect(screen.getByRole("link", { name: "GitHub" })).toBeTruthy()
    expect(document.body.innerHTML).not.toContain("rtl:-scale-x-100")
  })

  it("draws the marks at Figma's sizes", () => {
    const { container } = render(<FooterSocial platforms={["x"]} size={18} />)
    expect(container.querySelector("svg")!.getAttribute("class")).toContain("size-[18px]")
  })
})

describe("FooterLinkColumn and FooterLegalBar", () => {
  it("names a column by its title and lists its links", () => {
    render(<FooterLinkColumn title="Product" links={[{ label: "Blocks", href: "#" }, { label: "Changelog", href: "#" }]} />)
    const nav = screen.getByRole("navigation", { name: "Product" })
    expect(nav.querySelectorAll("li")).toHaveLength(2)
  })

  it("puts the copyright and the legal links in one bar", () => {
    render(<FooterLegalBar copyright="© 2026 Fasla" links={[{ label: "Privacy Policy", href: "#" }]} label="Legal" />)
    expect(screen.getByText("© 2026 Fasla")).toBeTruthy()
    expect(screen.getByRole("navigation", { name: "Legal" })).toBeTruthy()
  })
})

describe("FooterNewsletterForm", () => {
  const copy = {
    placeholder: "you@company.com",
    emailLabel: "Email address",
    submitLabel: "Subscribe",
    sentMessage: "Thanks. Check your inbox to confirm.",
    errorMessage: "That didn't go through. Try again in a moment.",
    invalidMessage: "Enter a valid email address.",
  }
  const type = (value: string) => fireEvent.change(screen.getByLabelText("Email address"), { target: { value } })
  const submit = () => fireEvent.click(screen.getByRole("button", { name: /Subscribe/ }))

  it("starts idle: a field and a button, the confirmation drawn but invisible", () => {
    render(<FooterNewsletterForm {...copy} />)
    expect(screen.getByLabelText("Email address")).toBeTruthy()
    expect(screen.getByRole("status").className).toContain("opacity-0")
  })

  it("refuses an address that isn't one and says so under the field", async () => {
    const onSubscribe = vi.fn()
    render(<FooterNewsletterForm {...copy} onSubscribe={onSubscribe} />)
    type("nope")
    await act(async () => submit())
    expect(onSubscribe).not.toHaveBeenCalled()
    expect(screen.getByRole("alert").textContent).toBe("Enter a valid email address.")
    expect(screen.getByLabelText("Email address").getAttribute("aria-invalid")).toBe("true")
  })

  it("shows the spinner and disables the field while sending, then the one-line confirmation", async () => {
    let finish!: () => void
    const onSubscribe = vi.fn(() => new Promise<void>((resolve) => (finish = resolve)))
    render(<FooterNewsletterForm {...copy} onSubscribe={onSubscribe} />)
    type("ada@example.com")
    await act(async () => submit())
    expect(onSubscribe).toHaveBeenCalledWith("ada@example.com")
    expect((screen.getByLabelText("Email address") as HTMLInputElement).disabled).toBe(true)
    await act(async () => finish())
    const status = screen.getByRole("status")
    expect(status.textContent).toBe("Thanks. Check your inbox to confirm.")
    expect(status.className).toContain("opacity-100")
  })

  it("holds the form's room when sent: both layers share one grid cell", () => {
    const { container } = render(<FooterNewsletterForm {...copy} status="sent" />)
    const form = container.querySelector("form")!
    expect(form.className).toContain("col-start-1 row-start-1")
    expect(screen.getByRole("status").className).toContain("col-start-1 row-start-1")
    expect(form.getAttribute("aria-hidden")).toBe("true")
  })

  it("fails to an error line and a field marked invalid, and lets the visitor try again", async () => {
    const onSubscribe = vi.fn().mockRejectedValueOnce(new Error("no")).mockResolvedValueOnce(undefined)
    render(<FooterNewsletterForm {...copy} onSubscribe={onSubscribe} />)
    type("ada@example.com")
    await act(async () => submit())
    expect(screen.getByRole("alert").textContent).toBe("That didn't go through. Try again in a moment.")
    await act(async () => submit())
    expect(screen.getByRole("status").textContent).toBe("Thanks. Check your inbox to confirm.")
  })

  it("can be held in a state from outside, for a story", () => {
    const { rerender } = render(<FooterNewsletterForm {...copy} status="loading" />)
    expect((screen.getByLabelText("Email address") as HTMLInputElement).disabled).toBe(true)
    rerender(<FooterNewsletterForm {...copy} status="error" />)
    expect(screen.getByRole("alert").textContent).toContain("didn't go through")
  })
})

describe("useFooterReveal", () => {
  type Play = { el: Element; keyframes: Keyframe[]; options: KeyframeAnimationOptions }
  let plays: Play[]
  let intersect: () => void
  const originalAnimate = Element.prototype.animate

  function setMotion(reduce: boolean) {
    window.matchMedia = ((query: string) => ({
      matches: reduce && query.includes("reduce"),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia
  }

  beforeEach(() => {
    plays = []
    intersect = () => {}
    Element.prototype.animate = function (this: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
      plays.push({ el: this, keyframes, options })
      return {} as Animation
    } as typeof Element.prototype.animate
    globalThis.IntersectionObserver = class {
      constructor(private cb: (entries: { isIntersecting: boolean }[]) => void) {
        intersect = () => this.cb([{ isIntersecting: true }])
      }
      observe() {}
      disconnect() {}
      unobserve() {}
      takeRecords() { return [] }
    } as unknown as typeof IntersectionObserver
    setMotion(false)
  })
  afterEach(() => {
    Element.prototype.animate = originalAnimate
  })

  function Probe() {
    const ref = React.useRef<HTMLDivElement>(null)
    useFooterReveal(ref, { stagger: 60, duration: 300, rise: 12 })
    return (
      <div ref={ref}>
        <p data-reveal="">a</p>
        <p data-reveal="">b</p>
        <p>c</p>
      </div>
    )
  }

  it("plays nothing until the block is on screen, then once, in order, 60ms apart", () => {
    render(<Probe />)
    expect(plays).toHaveLength(0)
    act(() => intersect())
    expect(plays).toHaveLength(2)
    expect(plays.map((p) => p.options.delay)).toEqual([0, 60])
    expect(plays[0]!.keyframes[0]).toMatchObject({ opacity: 0, transform: "translateY(12px)" })
    expect(plays[0]!.options).toMatchObject({ duration: 300, fill: "backwards" })
  })

  it("plays nothing under reduced motion", () => {
    setMotion(true)
    render(<Probe />)
    act(() => intersect())
    expect(plays).toHaveLength(0)
  })
})
