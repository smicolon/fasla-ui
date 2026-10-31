import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { HowItWorksAccordionSteps, howItWorksAccordionStepsCopy } from "./how-it-works-accordion-steps"
import { HowItWorksOrbitalProcess, howItWorksOrbitalProcessCopy } from "./how-it-works-orbital-process"
import { HowItWorksPhotoRailProgress, howItWorksPhotoRailProgressCopy } from "./how-it-works-photo-rail-progress"
import { HowItWorksStepTabsPhotoPanel, howItWorksStepTabsPhotoPanelCopy } from "./how-it-works-step-tabs-photo-panel"
import { HowItWorksTallVisualRail, howItWorksTallVisualRailCopy } from "./how-it-works-tall-visual-rail"

/*
 * The five Sliding and interactive Types. jsdom has no media queries, observers
 * or Web Animations, so each is stubbed: the tests check what the blocks do with
 * them (the finished state under reduced motion, one play when the block enters
 * the view), and what a press, a key or a scroll changes.
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

const PHOTOS = [
  { src: "/a.webp", alt: "First photo" },
  { src: "/b.webp", alt: "Second photo" },
  { src: "/c.webp", alt: "Third photo" },
  { src: "/d.webp", alt: "Fourth photo" },
]

const TYPES = [
  { name: "Photo Rail + Progress", Block: HowItWorksPhotoRailProgress, copy: howItWorksPhotoRailProgressCopy },
  { name: "Tall Visual Rail", Block: HowItWorksTallVisualRail, copy: howItWorksTallVisualRailCopy },
  { name: "Step Tabs + Photo Panel", Block: HowItWorksStepTabsPhotoPanel, copy: howItWorksStepTabsPhotoPanelCopy },
  { name: "Accordion Steps", Block: HowItWorksAccordionSteps, copy: howItWorksAccordionStepsCopy },
  { name: "Orbital Process", Block: HowItWorksOrbitalProcess, copy: howItWorksOrbitalProcessCopy },
] as const

/** Step Tabs + Photo Panel animates a tab change and has no entrance; that is tested below. */
const WITH_ENTRANCE = TYPES.filter((type) => type.name !== "Step Tabs + Photo Panel")

describe.each(TYPES)("$name", ({ Block, copy }) => {
  it.each(["en", "ar"] as const)("renders in %s under an h2 that names the section", (locale) => {
    const { container } = render(<Block locale={locale} />)
    const section = container.querySelector("section")
    expect(section).toBeTruthy()
    const heading = screen.getAllByRole("heading", { level: 2 })[0]
    expect(heading).toBeTruthy()
    expect(section?.getAttribute("aria-labelledby")).toBe(heading?.id)
    expect(Object.keys(copy)).toEqual(["en", "ar"])
  })

  it("draws every colour from the theme: no hex, rgb or palette colours in its classes", () => {
    const { container } = render(<Block />)
    const classes = [...container.querySelectorAll("[class]")].map((node) => node.getAttribute("class") ?? "").join(" ")
    expect(classes).not.toMatch(/\[#|\brgb\(|\bhsl\(/)
    expect(classes).not.toMatch(/\b(?:bg|text|border|ring|fill|stroke|from|to)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|black|white)(?:-\d+)?\b/)
    expect(container.innerHTML).not.toMatch(/style="[^"]*(?:#[0-9a-f]{3,8}|rgb\()/i)
  })

  it("does not move by itself: once it has played, a minute later the markup is the same", () => {
    vi.useFakeTimers({ toFake: ["setTimeout"] })
    const { container } = render(<Block />)
    scrollIntoView()
    act(() => {
      vi.advanceTimersByTime(2_000)
    })
    const settled = container.innerHTML
    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(container.innerHTML).toBe(settled)
  })
})

describe.each(WITH_ENTRANCE)("$name entrance", ({ Block }) => {
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

describe("Photo Rail + Progress", () => {
  it("has four steps in a rail with a progress bar, a counter and arrows, and a photo per step when given", () => {
    const { container } = render(<HowItWorksPhotoRailProgress photos={PHOTOS} />)
    expect(screen.getByRole("progressbar")).toBeTruthy()
    expect(screen.getByRole("button", { name: "Next step" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "Previous step" })).toBeTruthy()
    expect(container.querySelectorAll("img")).toHaveLength(4)
    expect(screen.getByAltText("Second photo")).toBeTruthy()
    expect(container.textContent).toContain("01")
  })

  it("follows the rail's scroll: the counter and the bar move with scrollLeft", async () => {
    const { container } = render(<HowItWorksPhotoRailProgress photos={PHOTOS} />)
    const rail = container.querySelector<HTMLElement>("[data-slot='carousel-content']")
    expect(rail).toBeTruthy()
    Object.defineProperty(rail!, "scrollWidth", { configurable: true, value: 1400 })
    Object.defineProperty(rail!, "clientWidth", { configurable: true, value: 1000 })
    const bar = () => Number(screen.getByRole("progressbar").getAttribute("aria-valuenow"))
    const before = bar()
    rail!.scrollLeft = 400
    fireEvent.scroll(rail!)
    await waitFor(() => expect(bar()).toBeGreaterThan(before))
  })
})

describe("Tall Visual Rail", () => {
  it("has four cards with a Learn more button each, and tells the page which was pressed", () => {
    const onAction = vi.fn()
    render(<HowItWorksTallVisualRail onAction={onAction} />)
    const buttons = screen.getAllByRole("button", { name: /Learn more/ })
    expect(buttons).toHaveLength(4)
    fireEvent.click(buttons[2]!)
    expect(onAction).toHaveBeenCalledWith(2)
  })

  it("shows every picture finished under reduced motion", () => {
    setReducedMotion(true)
    render(<HowItWorksTallVisualRail />)
    scrollIntoView()
    expect(started).toBe(0)
  })
})

describe("Step Tabs + Photo Panel", () => {
  it("has four tabs, the first selected, and a panel that follows the tab", () => {
    const onStepChange = vi.fn()
    render(<HowItWorksStepTabsPhotoPanel photos={PHOTOS} onStepChange={onStepChange} />)
    const tabs = screen.getAllByRole("tab")
    expect(tabs).toHaveLength(4)
    expect(tabs[0]?.getAttribute("aria-selected")).toBe("true")
    const steps = howItWorksStepTabsPhotoPanelCopy.en.steps
    expect(screen.getByRole("heading", { level: 3 }).textContent).toBe(steps[0]?.title)
    fireEvent.click(tabs[2]!)
    expect(tabs[2]?.getAttribute("aria-selected")).toBe("true")
    expect(screen.getByRole("heading", { level: 3 }).textContent).toBe(steps[2]?.title)
    expect(onStepChange).toHaveBeenCalled()
  })

  it("changes panel with no animation under reduced motion", () => {
    setReducedMotion(true)
    render(<HowItWorksStepTabsPhotoPanel />)
    fireEvent.click(screen.getAllByRole("tab")[1]!)
    expect(started).toBe(0)
  })
})

describe("Accordion Steps", () => {
  it("opens one step at a time, the first at first", () => {
    render(<HowItWorksAccordionSteps />)
    const triggers = screen.getAllByRole("button", { expanded: false }).concat(screen.getAllByRole("button", { expanded: true }))
    expect(screen.getAllByRole("button", { expanded: true })).toHaveLength(1)
    expect(triggers.length).toBeGreaterThanOrEqual(5)
    const second = screen.getAllByRole("button").find((button) => button.textContent?.includes("02"))!
    fireEvent.click(second)
    expect(screen.getAllByRole("button", { expanded: true })).toHaveLength(1)
    expect(second.getAttribute("aria-expanded")).toBe("true")
  })

  it("cross-fades to the open step's photo", () => {
    const { container } = render(<HowItWorksAccordionSteps photos={PHOTOS} />)
    const faded = () => [...container.querySelectorAll("img")].map((img) => img.parentElement?.className.includes("opacity-100") ?? false)
    expect(faded().slice(0, 3)).toEqual([true, false, false])
    fireEvent.click(screen.getAllByRole("button").find((button) => button.textContent?.includes("03"))!)
    expect(faded().slice(0, 3)).toEqual([false, false, true])
  })
})

describe("Orbital Process", () => {
  it("starts on step 01 with the other two as satellites, and a press swaps them", () => {
    const onStepChange = vi.fn()
    render(<HowItWorksOrbitalProcess onStepChange={onStepChange} />)
    const copy = howItWorksOrbitalProcessCopy.en
    expect(screen.getAllByText(copy.steps[0].body as string)).not.toHaveLength(0)
    const satellite = screen.getAllByRole("button", { name: "Step 2: Design" })[0]!
    fireEvent.click(satellite)
    expect(onStepChange).toHaveBeenCalledWith(1)
    expect(screen.getAllByText(copy.steps[1].body as string)).not.toHaveLength(0)
    expect(screen.getAllByRole("button", { name: "Step 1: Sketch the flow" }).length).toBeGreaterThan(0)
  })

  it("swaps with a travelling pill, and with no animation under reduced motion", () => {
    render(<HowItWorksOrbitalProcess />)
    fireEvent.click(screen.getAllByRole("button", { name: "Step 3: Review" })[0]!)
    expect(started).toBeGreaterThan(0)

    cleanup()
    started = 0
    setReducedMotion(true)
    render(<HowItWorksOrbitalProcess />)
    fireEvent.click(screen.getAllByRole("button", { name: "Step 3: Review" })[0]!)
    expect(started).toBe(0)
  })

  it("marks the active step in the Mobile list", () => {
    render(<HowItWorksOrbitalProcess />)
    const rows = screen.getAllByRole("listitem").map((item) => item.querySelector("button")!)
    expect(rows[0]?.getAttribute("aria-current")).toBe("step")
    fireEvent.click(rows[2]!)
    expect(rows[2]?.getAttribute("aria-current")).toBe("step")
    expect(rows[0]?.getAttribute("aria-current")).toBeNull()
  })
})
