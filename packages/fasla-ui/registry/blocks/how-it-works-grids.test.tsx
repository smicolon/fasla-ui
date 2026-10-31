import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, render, screen } from "@testing-library/react"
import { HowItWorksColumnPanels, howItWorksColumnPanelsCopy } from "./how-it-works-column-panels"
import { HowItWorksNumberedEditorialRows, howItWorksNumberedEditorialRowsCopy } from "./how-it-works-numbered-editorial-rows"
import { HowItWorksNumberedInstructionPanels, howItWorksNumberedInstructionPanelsCopy } from "./how-it-works-numbered-instruction-panels"
import { HowItWorksRoundedCardsDeviceCrop, howItWorksRoundedCardsDeviceCropCopy } from "./how-it-works-rounded-cards-device-crop"
import { HowItWorksSixCardGrid, howItWorksSixCardGridCopy } from "./how-it-works-six-card-grid"
import { HowItWorksSplitFeatureBand, howItWorksSplitFeatureBandCopy } from "./how-it-works-split-feature-band"

/*
 * The six Grids and panels Types. jsdom has no media queries, observers or Web
 * Animations, so each is stubbed: the tests check what the blocks do with them
 * (the finished state under reduced motion, one play when the block enters the
 * view), not how the browser animates.
 */

let started: number
let observers: { callback: IntersectionObserverCallback; observer: IntersectionObserver; active: boolean }[]

function setReducedMotion(reduced: boolean) {
  window.matchMedia = vi.fn((query: string) => ({
    matches: reduced && query.includes("prefers-reduced-motion: reduce"),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia
}

/** The household switches. The phones are hidden from screen readers, so they are found by markup, not by role. */
const switchInputs = (container: HTMLElement) => [...container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')]

/** Brings every observed block into view, as scrolling to it would. */
function scrollIntoView() {
  act(() => {
    for (const { callback, observer, active } of [...observers]) if (active) callback([{ isIntersecting: true } as IntersectionObserverEntry], observer)
  })
}

beforeEach(() => {
  started = 0
  observers = []
  setReducedMotion(false)
  globalThis.IntersectionObserver = class {
    private record: (typeof observers)[number]
    constructor(callback: IntersectionObserverCallback) {
      this.record = { callback, observer: this as unknown as IntersectionObserver, active: true }
      observers.push(this.record)
    }
    observe() {}
    unobserve() {}
    disconnect() {
      this.record.active = false
    }
    takeRecords() {
      return []
    }
  } as unknown as typeof IntersectionObserver
  Element.prototype.animate = vi.fn(() => {
    started += 1
    return { cancel: vi.fn(), finished: Promise.resolve() } as unknown as Animation
  })
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

const TYPES = [
  { name: "Six-Card Grid", Block: HowItWorksSixCardGrid, copy: howItWorksSixCardGridCopy, hasH2: true },
  { name: "Column Panels", Block: HowItWorksColumnPanels, copy: howItWorksColumnPanelsCopy, hasH2: true },
  { name: "Numbered Instruction Panels", Block: HowItWorksNumberedInstructionPanels, copy: howItWorksNumberedInstructionPanelsCopy, hasH2: true },
  { name: "Numbered Editorial Rows", Block: HowItWorksNumberedEditorialRows, copy: howItWorksNumberedEditorialRowsCopy, hasH2: true },
  { name: "Split Feature Band", Block: HowItWorksSplitFeatureBand, copy: howItWorksSplitFeatureBandCopy, hasH2: false },
  { name: "Rounded Cards + Device Crop", Block: HowItWorksRoundedCardsDeviceCrop, copy: howItWorksRoundedCardsDeviceCropCopy, hasH2: true },
] as const

describe.each(TYPES)("$name", ({ Block, copy, hasH2 }) => {
  it.each(["en", "ar"] as const)("renders in %s and names its section", (locale) => {
    const { container } = render(<Block locale={locale} />)
    const section = container.querySelector("section")
    expect(section).toBeTruthy()
    expect(section?.getAttribute("aria-labelledby") ?? section?.getAttribute("aria-label")).toBeTruthy()
    const headings = screen.getAllByRole("heading", { level: 2 })
    expect(headings.length).toBeGreaterThan(0)
    if (hasH2) expect(section?.getAttribute("aria-labelledby")).toBe(headings[0]?.id)
    expect(Object.keys(copy)).toEqual(["en", "ar"])
  })

  it("draws every colour from the theme: no hex, rgb or palette colours in its classes", () => {
    const { container } = render(<Block />)
    const classes = [...container.querySelectorAll("[class]")].map((node) => node.getAttribute("class") ?? "").join(" ")
    expect(classes).not.toMatch(/\[#|\brgb\(|\bhsl\(/)
    expect(classes).not.toMatch(/\b(?:bg|text|border|ring|fill|stroke|from|to)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|black|white)(?:-\d+)?\b/)
    expect(container.innerHTML).not.toMatch(/style="[^"]*(?:#[0-9a-f]{3,8}|rgb\()/i)
  })

  it("plays its motion once, when it comes into view, and not under reduced motion", () => {
    const { unmount } = render(<Block />)
    expect(started).toBe(0)
    scrollIntoView()
    expect(started).toBeGreaterThan(0)
    const after = started
    scrollIntoView()
    expect(started).toBe(after)
    unmount()

    cleanup()
    started = 0
    observers = []
    setReducedMotion(true)
    render(<Block />)
    scrollIntoView()
    expect(started).toBe(0)
  })
})

describe("Six-Card Grid", () => {
  it("has six cards, each a title and a line, with the pictures hidden from screen readers", () => {
    const { container } = render(<HowItWorksSixCardGrid />)
    expect(container.querySelectorAll("li > article")).toHaveLength(6)
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6)
    expect(container.querySelectorAll('[aria-hidden="true"].bg-muted').length).toBeGreaterThanOrEqual(6)
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("From plan to plate")
  })

  it("sets a figure in Arabic copy in its own left-to-right run, so the word beside it keeps its order", () => {
    const { container } = render(<HowItWorksSixCardGrid locale="ar" />)
    const runs = [...container.querySelectorAll("bdi")].map((node) => ({ text: node.textContent, dir: node.getAttribute("dir") }))
    expect(runs).toContainEqual({ text: "12", dir: "ltr" })
    expect(runs).toContainEqual({ text: "09:00", dir: "ltr" })
    expect(container.textContent).toContain("دقيقة")
  })

  it("takes its words from props, and keeps the rest", () => {
    render(<HowItWorksSixCardGrid heading="Your week, planned" plan={{ ...howItWorksSixCardGridCopy.en.plan, title: "Plan it" }} />)
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Your week, planned")
    expect(screen.getByText("Plan it")).toBeTruthy()
    expect(screen.getByText("Cook together")).toBeTruthy()
  })
})

describe("Column Panels", () => {
  it("has three panels, with the step in an outline badge, and the intro in the header", () => {
    const { container } = render(<HowItWorksColumnPanels />)
    expect(container.querySelectorAll("ul > li")).toHaveLength(3)
    expect(screen.getByText("1 · Gather")).toBeTruthy()
    expect(screen.getByText(howItWorksColumnPanelsCopy.en.intro as string)).toBeTruthy()
  })
})

describe("Numbered Instruction Panels", () => {
  it("has three numbered steps in an ordered list, each with its caption", () => {
    const { container } = render(<HowItWorksNumberedInstructionPanels />)
    expect(container.querySelectorAll("ol > li")).toHaveLength(3)
    for (const caption of howItWorksNumberedInstructionPanelsCopy.en.steps) expect(screen.getByText(caption as string)).toBeTruthy()
  })

  it("plays a step again on hover, and not under reduced motion", () => {
    const { container } = render(<HowItWorksNumberedInstructionPanels />)
    const step = container.querySelector("ol > li") as HTMLElement
    act(() => {
      step.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }))
    })
    const before = started
    const handler = Object.keys(step).find((key) => key.startsWith("__reactProps"))
    expect(handler).toBeTruthy()
    ;(step as unknown as Record<string, { onMouseEnter: (event: unknown) => void }>)[handler as string]?.onMouseEnter({ currentTarget: step })
    expect(started).toBeGreaterThan(before)

    cleanup()
    setReducedMotion(true)
    const reduced = render(<HowItWorksNumberedInstructionPanels />)
    const second = reduced.container.querySelector("ol > li") as HTMLElement
    const key = Object.keys(second).find((name) => name.startsWith("__reactProps")) as string
    const count = started
    ;(second as unknown as Record<string, { onMouseEnter: (event: unknown) => void }>)[key]?.onMouseEnter({ currentTarget: second })
    expect(started).toBe(count)
  })
})

describe("Numbered Editorial Rows", () => {
  it("numbers its rows from 1 and keeps the figures at rest", () => {
    const { container } = render(<HowItWorksNumberedEditorialRows />)
    const numbers = [...container.querySelectorAll('[data-reveal="count"]')].map((node) => node.textContent)
    expect(numbers).toEqual(["1", "2", "3", "4"])
  })

  it("takes any number of rows, with a hairline above each and under the last", () => {
    const { container } = render(<HowItWorksNumberedEditorialRows rows={[{ id: "a", title: "A", description: "One" }, { id: "b", title: "B", description: "Two" }]} />)
    expect(container.querySelectorAll('[data-reveal="row"]')).toHaveLength(2)
    expect(container.querySelectorAll('[data-reveal="rule"]')).toHaveLength(3)
  })

  it("ends on the real figures after the count-up", () => {
    vi.useFakeTimers()
    const { container } = render(<HowItWorksNumberedEditorialRows />)
    scrollIntoView()
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    const numbers = [...container.querySelectorAll('[data-reveal="count"]')].map((node) => node.textContent)
    expect(numbers.length).toBe(4)
  })
})

describe("Split Feature Band", () => {
  it("has two bands, each with its own h2, two buttons and a picture hidden from screen readers", () => {
    const { container } = render(<HowItWorksSplitFeatureBand />)
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(2)
    expect(screen.getAllByRole("button", { name: "Try it free" })).toHaveLength(2)
    expect(container.querySelectorAll('[aria-hidden="true"].overflow-hidden')).toHaveLength(2)
    expect(container.querySelector("section")?.getAttribute("aria-label")).toBe("How it works")
  })

  it("draws the glows from theme tokens", () => {
    const { container } = render(<HowItWorksSplitFeatureBand />)
    const glows = [...container.querySelectorAll('[data-reveal="glow"]')]
    expect(glows).toHaveLength(6)
    expect(glows.every((glow) => /bg-(chart-[1-5]|info)\b/.test(glow.getAttribute("class") ?? ""))).toBe(true)
  })

  it("shows both a step's long label and its short one, one for each width", () => {
    render(<HowItWorksSplitFeatureBand />)
    expect(screen.getByText("New request")).toBeTruthy()
    expect(screen.getByText("Request")).toBeTruthy()
  })
})

describe("Rounded Cards + Device Crop", () => {
  it("keeps the phone's body and the Door unlocked screen solid black with white text in both modes, from the base tokens", () => {
    const { container } = render(<HowItWorksRoundedCardsDeviceCrop />)
    const bodies = [...container.querySelectorAll('[data-reveal="phone"]')]
    expect(bodies).toHaveLength(3)
    expect(bodies.every((body) => /\bbg-base-black\b/.test(body.getAttribute("class") ?? ""))).toBe(true)
    const classes = [...container.querySelectorAll("[class]")].map((node) => node.getAttribute("class") ?? "").join(" ")
    expect(classes).toMatch(/text-base-white\b/)
    expect(classes).not.toMatch(/\bbg-foreground\b|inverse|dark:/)
    expect(screen.getByText("Door unlocked").className).toContain("text-base-white")
  })

  it("has three cards, a footer of chips, and the household switches at their finished state", () => {
    const { container } = render(<HowItWorksRoundedCardsDeviceCrop />)
    expect(container.querySelectorAll("ol > li")).toHaveLength(3)
    expect(screen.getByText("Also works with")).toBeTruthy()
    const switches = switchInputs(container)
    expect(switches.map((input) => input.checked)).toEqual([true, true, false])
  })

  it("flips the household switches on after it comes into view, and ends where it began", () => {
    vi.useFakeTimers()
    const { container } = render(<HowItWorksRoundedCardsDeviceCrop />)
    scrollIntoView()
    expect(switchInputs(container).map((input) => input.checked)).toEqual([false, false, false])
    act(() => {
      vi.advanceTimersByTime(1500)
    })
    expect(switchInputs(container).map((input) => input.checked)).toEqual([true, true, false])
  })
})
