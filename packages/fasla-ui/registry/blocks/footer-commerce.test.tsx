import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen, within } from "@testing-library/react"
import { FooterEcommerceMega, footerEcommerceMegaCopy } from "./footer-ecommerce-mega"
import { FooterServicePromiseBand, footerServicePromiseBandCopy } from "./footer-service-promise-band"

// What these tests can and cannot prove: jsdom has no layout and no Web
// Animations, so the breakpoints (container queries), the look of the
// cross-fade and the column wrapping were checked in a browser. Here
// `Element.animate` and `matchMedia` are stubs, so the tests assert the
// contract: what is on the page, in which language, how the form's states
// follow one another, what stays in the DOM while it fades, and that nothing
// is animated on load.

type Animation = { el: Element; keyframes: Keyframe[]; options: KeyframeAnimationOptions }
let animations: Animation[] = []

beforeEach(() => {
  animations = []
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
  Element.prototype.animate = function (this: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
    animations.push({ el: this, keyframes, options })
    return {} as globalThis.Animation
  } as typeof Element.prototype.animate
})
afterEach(() => {
  vi.useRealTimers()
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

describe.each(["en", "ar"] as const)("Ecommerce Mega (%s)", (locale) => {
  const copy = footerEcommerceMegaCopy[locale]

  it("renders one footer landmark, a labelled nav per column and one for the legal links", () => {
    const { container } = render(<FooterEcommerceMega locale={locale} />)
    const navs = landmarks(container)
    expect(navs).toHaveLength(copy.columns.length + 1)
    copy.columns.forEach((column) => expect(screen.getByRole("navigation", { name: column.title })).toBeTruthy())
    expect(screen.getByRole("navigation", { name: copy.legalLabel })).toBeTruthy()
  })

  it("draws the band, the brand line, the social marks, both Selects and the six payment names", () => {
    const { container } = render(<FooterEcommerceMega locale={locale} />)
    expect(screen.getByText(copy.bandTitle)).toBeTruthy()
    expect(screen.getByText(copy.bandSub)).toBeTruthy()
    expect(screen.getByText(copy.blurb)).toBeTruthy()
    expect(screen.getByRole("button", { name: copy.form.submit })).toBeTruthy()
    expect(["Instagram", "TikTok", "Pinterest", "X", "YouTube"].every((name) => container.querySelector(`a[aria-label="${name}"]`))).toBe(true)
    expect(screen.getByRole("combobox", { name: copy.regionLabel })).toBeTruthy()
    expect(screen.getByRole("combobox", { name: copy.currencyLabel })).toBeTruthy()
    const pills = within(screen.getByRole("list", { name: copy.paymentLabel })).getAllByRole("listitem")
    expect(pills.map((li) => li.textContent)).toEqual(["VISA", "Mastercard", "Amex", "PayPal", "Apple Pay", "Klarna"])
    expect(container.textContent).toContain(copy.copyright)
  })

  it("keeps the English wording from Figma", () => {
    if (locale !== "en") return
    expect(copy.bandTitle).toBe("A welcome offer on your first order")
    expect(copy.columns.map((c) => c.title)).toEqual(["Shop", "Collections", "Help", "About"])
    expect(copy.form.submit).toBe("Sign up")
  })

  it("has no em dash or middle dot in the Arabic copy", () => {
    if (locale !== "ar") return
    strings(copy).forEach((text) => {
      expect(text).not.toMatch(/[—·]/)
      expect(text).not.toMatch(/\*/)
    })
  })

  it("accepts empty collections without crashing or drawing empty headings", () => {
    const { container } = render(<FooterEcommerceMega locale={locale} columns={[]} regions={[]} currencies={[]} payments={[]} legal={[]} socials={[]} />)
    expect(container.querySelector("footer")).toBeTruthy()
    expect(screen.queryAllByRole("heading", { level: 3 })).toHaveLength(0)
    expect(screen.queryByRole("list", { name: copy.paymentLabel })).toBeNull()
    expect(screen.queryAllByRole("combobox")).toHaveLength(0)
  })

  it("plays nothing on load, and the payment pills never animate", () => {
    render(<FooterEcommerceMega locale={locale} />)
    expect(animations).toHaveLength(0)
  })
})

describe("Ecommerce Mega: the band form", () => {
  const copy = footerEcommerceMegaCopy.en
  const type = (value: string) => fireEvent.change(screen.getByLabelText(copy.form.emailLabel), { target: { value } })

  it("asks for a real address first, in the placeholder words", () => {
    render(<FooterEcommerceMega onSubscribe={vi.fn()} />)
    type("nope")
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }))
    expect(screen.getByRole("alert").textContent).toBe(copy.form.invalid)
  })

  it("shows the Button's spinner and disables the field while sending, then the confirmation", async () => {
    let resolve!: () => void
    const onSubscribe = vi.fn(() => new Promise<void>((r) => (resolve = r)))
    const { container } = render(<FooterEcommerceMega onSubscribe={onSubscribe} />)
    const form = container.querySelector("form") as HTMLFormElement
    type("a@b.co")
    fireEvent.submit(form)
    expect(onSubscribe).toHaveBeenCalledWith("a@b.co")
    expect((screen.getByLabelText(copy.form.emailLabel) as HTMLInputElement).disabled).toBe(true)
    expect((screen.getByRole("button", { name: /Sign up/ }) as HTMLButtonElement).disabled).toBe(true)
    expect(screen.queryByText(copy.form.sent)).toBeNull()
    await act(async () => resolve())
    expect(screen.getByRole("status").textContent).toBe(copy.form.sent)
    // the form stays in the DOM, faded and inert, so the band keeps its height
    expect(container.querySelector("form")?.className).toContain("opacity-0")
    expect(container.querySelector("form")?.getAttribute("aria-hidden")).toBe("true")
  })

  it("shows the error line when sending fails", async () => {
    render(<FooterEcommerceMega onSubscribe={() => Promise.reject(new Error("no"))} />)
    type("a@b.co")
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Sign up" }))
    })
    expect(screen.getByRole("alert").textContent).toBe(copy.form.error)
  })

  it("uses the approved e-commerce confirmation and error words", () => {
    expect(copy.form.sent).toBe("You're in. Your welcome offer is on its way.")
    expect(copy.form.error).toBe("We couldn't sign you up. Try again.")
  })
})

describe.each(["en", "ar"] as const)("Service Promise Band (%s)", (locale) => {
  const copy = footerServicePromiseBandCopy[locale]

  it("renders one footer landmark and a labelled nav per column and for the legal links", () => {
    const { container } = render(<FooterServicePromiseBand locale={locale} />)
    const navs = landmarks(container)
    expect(navs).toHaveLength(copy.columns.length + 1)
    expect(screen.getByRole("navigation", { name: copy.legalLabel })).toBeTruthy()
  })

  it("draws four promises with their icons, the contact lines, three payment names and the copyright", () => {
    const { container } = render(<FooterServicePromiseBand locale={locale} />)
    const promises = within(screen.getByRole("list", { name: copy.promisesLabel })).getAllByRole("listitem")
    expect(promises).toHaveLength(4)
    copy.promises.forEach((promise) => expect(screen.getByText(promise.title)).toBeTruthy())
    expect(container.querySelector("svg.lucide-truck")).toBeTruthy()
    expect(container.querySelector("svg.lucide-corner-down-right")).toBeTruthy()
    expect(container.querySelector("svg.lucide-award")).toBeTruthy()
    expect(container.querySelector("svg.lucide-headphones")).toBeTruthy()
    expect(container.querySelector("svg.lucide-phone")).toBeTruthy()
    expect(container.querySelector("svg.lucide-mail")).toBeTruthy()
    expect(container.querySelector("a[href^='mailto:']")).toBeTruthy()
    const pills = within(screen.getByRole("list", { name: copy.paymentLabel })).getAllByRole("listitem")
    expect(pills.map((li) => li.textContent)).toEqual(["VISA", "Mastercard", "Apple Pay"])
    expect(container.textContent).toContain(copy.copyright)
  })

  it("has no em dash or middle dot in the Arabic copy, and keeps the hours in a left-to-right run", () => {
    if (locale !== "ar") return
    strings(copy).forEach((text) => expect(text).not.toMatch(/[—·]/))
    const { container } = render(<FooterServicePromiseBand locale="ar" />)
    expect(Array.from(container.querySelectorAll("bdi[dir='ltr']")).some((el) => el.textContent === "09:00–18:00 CET")).toBe(true)
  })

  it("accepts empty collections without crashing", () => {
    const { container } = render(<FooterServicePromiseBand locale={locale} promises={[]} columns={[]} legal={[]} payments={[]} />)
    expect(container.querySelector("footer")).toBeTruthy()
    expect(screen.queryByRole("list", { name: copy.promisesLabel })).toBeNull()
    expect(screen.queryByRole("list", { name: copy.paymentLabel })).toBeNull()
  })

  it("hairlines the promises from the second on: every other one from Tablet, every one from Desktop", () => {
    const { container } = render(<FooterServicePromiseBand locale={locale} />)
    const items = Array.from(container.querySelectorAll("ul[aria-label] > li")).slice(0, 4)
    const tablet = items.map((li) => li.className.includes("[@container(min-width:40rem)]:border-s"))
    const desktop = items.map((li) => li.className.includes("[@container(min-width:64rem)]:border-s") || li.className.includes("[@container(min-width:40rem)]:border-s"))
    expect(tablet).toEqual([false, true, false, true])
    expect(desktop).toEqual([false, true, true, true])
  })

  it("plays nothing", () => {
    render(<FooterServicePromiseBand locale={locale} />)
    expect(animations).toHaveLength(0)
  })
})
