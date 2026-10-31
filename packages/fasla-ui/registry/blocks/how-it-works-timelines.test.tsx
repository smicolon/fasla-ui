import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { HowItWorksCenterSpineTimeline, howItWorksCenterSpineTimelineCopy } from "./how-it-works-center-spine-timeline"
import { HowItWorksContainedTimeline, howItWorksContainedTimelineCopy } from "./how-it-works-contained-timeline"
import { HowItWorksPhaseLine, howItWorksPhaseLineCopy } from "./how-it-works-phase-line"
import { HowItWorksPillTimeline, howItWorksPillTimelineCopy } from "./how-it-works-pill-timeline"
import { HowItWorksVerticalTimelineCard, howItWorksVerticalTimelineCardCopy } from "./how-it-works-vertical-timeline-card"

/*
 * The five Timelines and phases Types. jsdom has no media queries, observers or
 * Web Animations, so each is stubbed: the tests check what the blocks do with
 * them (the finished state under reduced motion, one play when the block enters
 * the view, no motion that never ends), and what a press changes.
 */

let started: number
let optionsSeen: KeyframeAnimationOptions[]
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
  optionsSeen = []
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
  Element.prototype.animate = vi.fn((_keyframes: unknown, options?: KeyframeAnimationOptions) => {
    started += 1
    optionsSeen.push(options ?? {})
    return { cancel: vi.fn(), finished: Promise.resolve() } as unknown as Animation
  }) as unknown as typeof Element.prototype.animate
})
afterEach(() => {
  cleanup()
})

const PHOTOS = [
  { src: "/a.webp", alt: "First photo" },
  { src: "/b.webp", alt: "Second photo" },
  { src: "/c.webp", alt: "Third photo" },
  { src: "/d.webp", alt: "Fourth photo" },
]

const TYPES = [
  { name: "Center Spine Timeline", Block: HowItWorksCenterSpineTimeline, copy: howItWorksCenterSpineTimelineCopy },
  { name: "Vertical Timeline Card", Block: HowItWorksVerticalTimelineCard, copy: howItWorksVerticalTimelineCardCopy },
  { name: "Contained Timeline", Block: HowItWorksContainedTimeline, copy: howItWorksContainedTimelineCopy },
  { name: "Phase Line", Block: HowItWorksPhaseLine, copy: howItWorksPhaseLineCopy },
  { name: "Pill Timeline", Block: HowItWorksPillTimeline, copy: howItWorksPillTimelineCopy },
] as const

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

  it("has no motion that never ends: nothing repeats for ever, nothing repeats more than twice", () => {
    render(<Block />)
    scrollIntoView()
    for (const options of optionsSeen) expect(options.iterations ?? 1).toBeLessThanOrEqual(2)
  })
})

describe("Center Spine Timeline", () => {
  it("has four weeks in an ordered list, a photo each when given, and a spine that draws", () => {
    const { container } = render(<HowItWorksCenterSpineTimeline photos={PHOTOS} />)
    expect(container.querySelectorAll("ol > li")).toHaveLength(4)
    expect(container.querySelectorAll("img")).toHaveLength(4)
    expect(screen.getByAltText("Third photo")).toBeTruthy()
    expect(container.querySelector('[data-reveal="spine"]')).toBeTruthy()
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4)
  })

  it("alternates the copy and the photo from one week to the next, and keeps a muted box where a photo is missing", () => {
    const { container } = render(<HowItWorksCenterSpineTimeline photos={PHOTOS.slice(0, 2)} />)
    const rows = [...container.querySelectorAll("ol > li")]
    const copyColumn = (row: Element) => (row.querySelector('[data-reveal="copy"]')?.parentElement?.className.includes("col-start-1") ? 1 : 3)
    expect(rows.map(copyColumn)).toEqual([1, 3, 1, 3])
    expect(container.querySelectorAll("img")).toHaveLength(4)
  })
})

describe("Vertical Timeline Card", () => {
  it("uses the Steps atom: four steps, the third current, and the status read after the label", () => {
    const { container } = render(<HowItWorksVerticalTimelineCard />)
    const items = [...container.querySelectorAll('[data-slot="steps-item"]')]
    expect(items.map((item) => item.getAttribute("data-status"))).toEqual(["done", "done", "current", "upcoming"])
    expect(container.querySelector('[data-slot="steps"]')?.getAttribute("data-orientation")).toBe("vertical")
    expect(items[2]?.getAttribute("aria-current")).toBe("step")
  })

  it("shows the first photo given, and tells the page when the link is pressed", () => {
    const onAction = vi.fn()
    render(<HowItWorksVerticalTimelineCard photos={PHOTOS} onAction={onAction} />)
    expect(screen.getByAltText("First photo")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: /Read the full process/ }))
    expect(onAction).toHaveBeenCalledTimes(1)
  })
})

describe("Contained Timeline", () => {
  it("has four steps in order with the done, current and goal dots, and a two-tone heading", () => {
    const { container } = render(<HowItWorksContainedTimeline />)
    expect(container.querySelectorAll("ol > li")).toHaveLength(4)
    expect(container.querySelectorAll('[data-reveal="dot"]')).toHaveLength(4)
    expect(container.querySelector('[data-reveal="dot"].bg-warning')).toBeTruthy()
    expect(screen.getByRole("heading", { level: 2 }).textContent).toContain("in four calm steps.")
  })

  it("marks the current step for assistive tech", () => {
    const { container } = render(<HowItWorksContainedTimeline />)
    const current = container.querySelectorAll('[aria-current="step"]')
    expect(current).toHaveLength(1)
    expect(current[0]?.textContent).toContain("Book together")
  })

  it("sends its current step's ring out twice and then lets it rest", () => {
    render(<HowItWorksContainedTimeline />)
    scrollIntoView()
    expect(optionsSeen.filter((options) => options.iterations === 2)).toHaveLength(1)
  })

  it("calls the two buttons' handlers", () => {
    const onPrimaryAction = vi.fn()
    const onSecondaryAction = vi.fn()
    render(<HowItWorksContainedTimeline onPrimaryAction={onPrimaryAction} onSecondaryAction={onSecondaryAction} />)
    fireEvent.click(screen.getByRole("button", { name: "Start planning" }))
    fireEvent.click(screen.getByRole("button", { name: "See a sample trip" }))
    expect(onPrimaryAction).toHaveBeenCalledTimes(1)
    expect(onSecondaryAction).toHaveBeenCalledTimes(1)
  })
})

describe("Phase Line", () => {
  it("has four phases, each marker in its own theme colour, and only the first line fills", () => {
    const { container } = render(<HowItWorksPhaseLine />)
    expect(container.querySelectorAll("ol > li")).toHaveLength(4)
    const markers = [...container.querySelectorAll('[data-reveal="marker"]')]
    expect(markers.map((marker) => ["bg-foreground", "bg-info", "bg-warning", "bg-destructive"].find((name) => marker.classList.contains(name)))).toEqual(["bg-foreground", "bg-info", "bg-warning", "bg-destructive"])
    expect(container.querySelectorAll('[data-reveal="fill"]')).toHaveLength(1)
  })

  it("keeps the numerals of a week range in their own order in Arabic", () => {
    const { container } = render(<HowItWorksPhaseLine locale="ar" />)
    expect([...container.querySelectorAll("bdi")].map((node) => node.textContent)).toContain("1")
  })
})

describe("Pill Timeline", () => {
  it("has three stages, each with a Badge, a pill button and a caption", () => {
    const { container } = render(<HowItWorksPillTimeline />)
    expect(container.querySelectorAll("ol > li")).toHaveLength(3)
    expect(screen.getAllByRole("button")).toHaveLength(3)
    expect(screen.getByText("Morning")).toBeTruthy()
    expect(container.querySelectorAll('[data-reveal="line"]')).toHaveLength(3)
  })

  it("tells the page which pill was pressed, and names each send button by its prompt", () => {
    const onStageSelect = vi.fn()
    render(<HowItWorksPillTimeline onStageSelect={onStageSelect} />)
    const pill = screen.getByRole("button", { name: "Ask: Is it too sunny here?" })
    fireEvent.click(pill)
    expect(onStageSelect).toHaveBeenCalledWith(1)
  })

  it("takes any number of stages from two to four", () => {
    const stages = howItWorksPillTimelineCopy.en.stages.slice(0, 2)
    render(<HowItWorksPillTimeline stages={stages} />)
    expect(screen.getAllByRole("listitem")).toHaveLength(2)
  })
})
