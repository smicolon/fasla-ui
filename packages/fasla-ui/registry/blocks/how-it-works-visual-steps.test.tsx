import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { HowItWorksDiagonalPhotoCollage, howItWorksDiagonalPhotoCollageCopy } from "./how-it-works-diagonal-photo-collage"
import { HowItWorksFannedDissolveCards, howItWorksFannedDissolveCardsCopy } from "./how-it-works-fanned-dissolve-cards"
import { HowItWorksFullBleedStepPanel, howItWorksFullBleedStepPanelCopy } from "./how-it-works-full-bleed-step-panel"
import { HowItWorksNumberedPhotoSteps, howItWorksNumberedPhotoStepsCopy } from "./how-it-works-numbered-photo-steps"
import { HowItWorksOverlayNumeralCards, howItWorksOverlayNumeralCardsCopy } from "./how-it-works-overlay-numeral-cards"
import { HowItWorksPhotoBentoSteps, howItWorksPhotoBentoStepsCopy } from "./how-it-works-photo-bento-steps"
import { HowItWorksSplitPhotoStepList, howItWorksSplitPhotoStepListCopy } from "./how-it-works-split-photo-step-list"
import { HowItWorksStackedMediaText, howItWorksStackedMediaTextCopy } from "./how-it-works-stacked-media-text"

/*
 * The eight Visual steps Types. jsdom has no media queries, observers or Web
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

/** Brings every observed block into view, as scrolling to it would. */
function scrollIntoView() {
  act(() => {
    for (const { callback, observer, active } of [...observers]) if (active) callback([{ isIntersecting: true } as IntersectionObserverEntry], observer)
  })
}

/** The switches. The windows are hidden from screen readers, so they are found by markup, not by role. */
const switchInputs = (container: HTMLElement) => [...container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')]

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
  { name: "Numbered Photo Steps", Block: HowItWorksNumberedPhotoSteps, copy: howItWorksNumberedPhotoStepsCopy },
  { name: "Split Photo + Step List", Block: HowItWorksSplitPhotoStepList, copy: howItWorksSplitPhotoStepListCopy },
  { name: "Full-Bleed Step Panel", Block: HowItWorksFullBleedStepPanel, copy: howItWorksFullBleedStepPanelCopy },
  { name: "Overlay Numeral Cards", Block: HowItWorksOverlayNumeralCards, copy: howItWorksOverlayNumeralCardsCopy },
  { name: "Diagonal Photo Collage", Block: HowItWorksDiagonalPhotoCollage, copy: howItWorksDiagonalPhotoCollageCopy },
  { name: "Photo Bento Steps", Block: HowItWorksPhotoBentoSteps, copy: howItWorksPhotoBentoStepsCopy },
  { name: "Fanned Dissolve Cards", Block: HowItWorksFannedDissolveCards, copy: howItWorksFannedDissolveCardsCopy },
  { name: "Stacked Media + Text", Block: HowItWorksStackedMediaText, copy: howItWorksStackedMediaTextCopy },
] as const

/** Full-Bleed Step Panel has no entrance: it animates a step change, and that is tested below. */
const WITH_ENTRANCE = TYPES.filter((type) => type.name !== "Full-Bleed Step Panel")

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

describe("Numbered Photo Steps", () => {
  it("has four steps in an ordered list, numbered 01 to 04, with a photo per step when given", () => {
    const { container } = render(<HowItWorksNumberedPhotoSteps photos={PHOTOS} />)
    expect(container.querySelectorAll("ol > li")).toHaveLength(4)
    expect([...container.querySelectorAll("bdi")].map((node) => node.textContent)).toEqual(["01", "02", "03", "04"])
    expect(screen.getByAltText("Third photo")).toBeTruthy()
  })

  it("shows a quiet box where a step has no photo, and takes its words from props", () => {
    const { container } = render(<HowItWorksNumberedPhotoSteps photos={PHOTOS.slice(0, 2)} heading="Plain steps" />)
    expect(container.querySelectorAll("img")).toHaveLength(2)
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Plain steps")
  })
})

describe("Split Photo + Step List", () => {
  it("makes a step active on press, focus and hover, and marks it for assistive tech", () => {
    render(<HowItWorksSplitPhotoStepList photos={PHOTOS} />)
    const rows = screen.getAllByRole("button")
    expect(rows[0]?.getAttribute("aria-current")).toBe("step")
    fireEvent.click(rows[2]!)
    expect(rows[2]?.getAttribute("aria-current")).toBe("step")
    expect(rows[0]?.getAttribute("aria-current")).toBeNull()
    fireEvent.mouseEnter(rows[1]!)
    expect(rows[1]?.getAttribute("aria-current")).toBe("step")
    fireEvent.focus(rows[3]!)
    expect(rows[3]?.getAttribute("aria-current")).toBe("step")
  })

  it("cross-fades to the active step's photo, and stays on the one photo when the steps share it", () => {
    const { container, rerender } = render(<HowItWorksSplitPhotoStepList photos={PHOTOS} />)
    const faded = () => [...container.querySelectorAll("img")].map((img) => img.parentElement?.className.includes("opacity-100") ?? false)
    expect(faded().slice(0, 3)).toEqual([true, false, false])
    fireEvent.click(screen.getAllByRole("button")[2]!)
    expect(faded().slice(0, 3)).toEqual([false, false, true])
    rerender(<HowItWorksSplitPhotoStepList photos={PHOTOS.slice(0, 1)} />)
    fireEvent.click(screen.getAllByRole("button")[3]!)
    expect(container.querySelectorAll("img")).toHaveLength(1)
  })
})

describe("Full-Bleed Step Panel", () => {
  it("shows one step at a time and moves by the dots, with Home, End and the arrow keys", () => {
    render(<HowItWorksFullBleedStepPanel />)
    const steps = howItWorksFullBleedStepPanelCopy.en.steps
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(steps[0]?.title)
    const dots = screen.getAllByRole("button", { name: /Step \d of 4/ })
    expect(dots).toHaveLength(4)
    fireEvent.click(dots[2]!)
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(steps[2]?.title)
    fireEvent.keyDown(dots[2]!, { key: "ArrowRight" })
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(steps[3]?.title)
    fireEvent.keyDown(screen.getAllByRole("button", { name: /Step \d of 4/ })[3]!, { key: "Home" })
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(steps[0]?.title)
    fireEvent.keyDown(screen.getAllByRole("button", { name: /Step \d of 4/ })[0]!, { key: "End" })
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(steps[3]?.title)
  })

  it("does not change step by itself: no timer is ever set", () => {
    vi.useFakeTimers()
    render(<HowItWorksFullBleedStepPanel />)
    scrollIntoView()
    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(howItWorksFullBleedStepPanelCopy.en.steps[0]?.title)
  })

  it("reports a step change, and its buttons are links when given an href", () => {
    const onStepChange = vi.fn()
    render(<HowItWorksFullBleedStepPanel onStepChange={onStepChange} primaryHref="/process" />)
    fireEvent.click(screen.getAllByRole("button", { name: /Step \d of 4/ })[1]!)
    expect(onStepChange).toHaveBeenCalledWith(1)
    expect(screen.getByRole("link", { name: "See the process" }).getAttribute("href")).toBe("/process")
    expect(screen.getByRole("button", { name: "Read the guide" })).toBeTruthy()
  })

  it("moves the other way with the arrow keys in a right-to-left page", () => {
    const { container } = render(<HowItWorksFullBleedStepPanel locale="ar" />)
    const group = container.querySelector('[role="group"]') as HTMLElement
    group.style.direction = "rtl"
    fireEvent.keyDown(screen.getAllByRole("button", { name: /الخطوة \d من 4/ })[0]!, { key: "ArrowLeft" })
    expect(group.querySelector('[aria-current="step"]')?.getAttribute("aria-label")).toBe("الخطوة 2 من 4")
    fireEvent.keyDown(screen.getAllByRole("button", { name: /الخطوة \d من 4/ })[1]!, { key: "ArrowRight" })
    expect(group.querySelector('[aria-current="step"]')?.getAttribute("aria-label")).toBe("الخطوة 1 من 4")
  })

  it("animates a step change, and under reduced motion changes the step with no animation", () => {
    render(<HowItWorksFullBleedStepPanel />)
    fireEvent.click(screen.getAllByRole("button", { name: /Step \d of 4/ })[1]!)
    expect(started).toBeGreaterThan(0)
    cleanup()
    started = 0
    setReducedMotion(true)
    render(<HowItWorksFullBleedStepPanel />)
    fireEvent.click(screen.getAllByRole("button", { name: /Step \d of 4/ })[1]!)
    expect(started).toBe(0)
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(howItWorksFullBleedStepPanelCopy.en.steps[1]?.title)
  })
})

describe("Overlay Numeral Cards", () => {
  it("has four cards with numerals 01 to 04, and its scrim and text are fixed theme tokens, the same in both modes", () => {
    const { container } = render(<HowItWorksOverlayNumeralCards photos={PHOTOS} />)
    expect(container.querySelectorAll("ol > li")).toHaveLength(4)
    const classes = [...container.querySelectorAll("[class]")].map((node) => node.getAttribute("class") ?? "").join(" ")
    expect(classes).toMatch(/bg-base-black\/\d+/)
    expect(classes).toMatch(/text-base-white/)
    expect(classes).not.toMatch(/dark:/)
  })
})

describe("Diagonal Photo Collage", () => {
  it("lays three photos on the desktop collage, and the first two in the compact pair", () => {
    const { container } = render(<HowItWorksDiagonalPhotoCollage photos={PHOTOS} />)
    expect(container.querySelectorAll('[class*="rotate-"]')).toHaveLength(3)
    expect(container.querySelectorAll("img")).toHaveLength(5)
    expect(container.querySelectorAll("ol > li")).toHaveLength(3)
  })

  it("turns each tilt the other way in right-to-left", () => {
    const { container } = render(<HowItWorksDiagonalPhotoCollage />)
    const tilts = [...container.querySelectorAll('[class*="rotate-"]')].map((node) => node.getAttribute("class") ?? "")
    expect(tilts.every((name) => /\[&:dir\(rtl\)\]:-?rotate-\[/.test(name))).toBe(true)
  })
})

describe("Photo Bento Steps", () => {
  it("has a feature card and three small cards, and leaves a card with no photo as a quiet box", () => {
    const { container } = render(<HowItWorksPhotoBentoSteps photos={PHOTOS.slice(0, 3)} />)
    expect(container.querySelectorAll("article")).toHaveLength(1)
    expect(container.querySelectorAll("ol > li")).toHaveLength(3)
    expect(container.querySelectorAll("img")).toHaveLength(3)
  })

  it("numbers the feature 01 and the small cards from 02", () => {
    const { container } = render(<HowItWorksPhotoBentoSteps />)
    expect([...container.querySelectorAll("bdi")].map((node) => node.textContent)).toEqual(["01", "02", "03", "04"])
  })
})

describe("Fanned Dissolve Cards", () => {
  it("is on the inverse surface, with three cards and a row of pixel squares along each scene's foot", () => {
    const { container } = render(<HowItWorksFannedDissolveCards />)
    expect(container.querySelector("section")?.className).toContain("bg-background-inverse")
    expect(container.querySelectorAll("ol > li")).toHaveLength(3)
    expect(container.querySelectorAll('[data-reveal="pixel"]').length).toBeGreaterThanOrEqual(12)
  })

  it("tilts only the middle card, and only from Desktop", () => {
    const { container } = render(<HowItWorksFannedDissolveCards />)
    const cards = [...container.querySelectorAll("ol > li")].map((node) => node.getAttribute("class") ?? "")
    expect(cards.map((name) => name.includes("-rotate-3"))).toEqual([false, true, false])
    expect(cards[1]).toContain("[@container(min-width:64rem)]:-rotate-3")
    expect(cards[1]).toContain("[@container(min-width:64rem)]:[&:dir(rtl)]:rotate-3")
  })

  it("lists the trips with their status, and reads the route as one figure run in Arabic", () => {
    render(<HowItWorksFannedDissolveCards locale="ar" />)
    expect(screen.getByText("متأخرة")).toBeTruthy()
    expect(document.body.textContent).toContain("18")
  })
})

describe("Stacked Media + Text", () => {
  it("has three cards, and the quiet-hours switches at their finished state", () => {
    const { container } = render(<HowItWorksStackedMediaText />)
    expect(container.querySelectorAll("ol > li")).toHaveLength(3)
    expect(switchInputs(container).map((input) => input.checked)).toEqual([true, true, false])
  })

  it("flips the switches on one after another once in view, and ends where it began", () => {
    vi.useFakeTimers()
    const { container } = render(<HowItWorksStackedMediaText />)
    scrollIntoView()
    expect(switchInputs(container).map((input) => input.checked)).toEqual([false, false, false])
    act(() => {
      vi.advanceTimersByTime(1500)
    })
    expect(switchInputs(container).map((input) => input.checked)).toEqual([true, true, false])
  })

  it("keeps the gauge's figure in its own left-to-right run, and its button a link when given an href", () => {
    const { container } = render(<HowItWorksStackedMediaText locale="ar" actionHref="/app" />)
    expect(container.querySelector('[dir="ltr"] [data-reveal="count"]')?.textContent).toBe("76")
    expect(screen.getByRole("link", { name: "نزّل التطبيق" }).getAttribute("href")).toBe("/app")
  })
})
