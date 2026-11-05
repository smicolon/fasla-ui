import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, render, screen } from "@testing-library/react"
import { MahaamHero, mahaamHeroCopy } from "./MahaamHero"

/*
 * The Hero plays and loops, which the repo's motion rules otherwise forbid
 * (see mahaam-motion.ts). jsdom has no media queries or Web Animations, so they
 * are stubbed: the tests check what the section does with them, not how the
 * browser animates.
 */

let animate: ReturnType<typeof vi.fn>

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

beforeEach(() => {
  animate = vi.fn(() => ({ pause: vi.fn(), play: vi.fn(), cancel: vi.fn() }))
  Element.prototype.animate = animate as unknown as Element["animate"]
  setReducedMotion(false)
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

const en = mahaamHeroCopy.en.planner

describe("Mahaam Hero: the finished state", () => {
  it("is what reduced motion shows, with nothing animating", () => {
    render(<MahaamHero reducedMotion />)
    expect(screen.getByText(en.added(3))).toBeTruthy()
    expect(screen.getByText(/☑ Pricing table/)).toBeTruthy()
    expect(screen.getByText(/☐ Delivery timeline/)).toBeTruthy()
    expect(animate).not.toHaveBeenCalled()
  })

  it("is what the visitor's own reduced-motion setting shows", () => {
    setReducedMotion(true)
    render(<MahaamHero />)
    expect(screen.getByText(en.added(3))).toBeTruthy()
    expect(animate).not.toHaveBeenCalled()
  })

  it("is Figma's Arabic copy in the Arabic locale", () => {
    render(<MahaamHero locale="ar" reducedMotion />)
    expect(screen.getByText("أُضيفت 3 مهام من ملاحظتك الصوتية")).toBeTruthy()
    expect(screen.getByText("ابدأ مع مهام مجانًا")).toBeTruthy()
  })
})

describe("Mahaam Hero: paused", () => {
  it("holds the frame it is given: two blocks have landed at frame 80", () => {
    render(<MahaamHero paused frame={80} />)
    expect(screen.getByText(en.added(2))).toBeTruthy()
    expect(screen.getByText(/☐ Pricing table/)).toBeTruthy()
  })

  it("does not advance", () => {
    vi.useFakeTimers()
    render(<MahaamHero paused frame={80} />)
    act(() => {
      vi.advanceTimersByTime(60 * 200)
    })
    expect(screen.getByText(en.added(2))).toBeTruthy()
  })
})

describe("Mahaam Hero: playing", () => {
  it("starts from the first frame and plays through, then loops", () => {
    vi.useFakeTimers()
    render(<MahaamHero />)
    expect(screen.getByText(en.listening)).toBeTruthy()
    act(() => {
      vi.advanceTimersByTime(60 * 100)
    })
    expect(screen.getByText(en.added(3))).toBeTruthy()
    // The blocks fade at frame 190 and the loop begins again at frame 201.
    act(() => {
      vi.advanceTimersByTime(60 * 105)
    })
    expect(screen.getByText(en.listening)).toBeTruthy()
  })

  it("runs its animations, and stops them when paused", () => {
    const { rerender } = render(<MahaamHero />)
    expect(animate).toHaveBeenCalled()
    const pauses = (animate.mock.results as { value: { pause: ReturnType<typeof vi.fn> } }[]).map((result) => result.value.pause)
    rerender(<MahaamHero paused />)
    expect(pauses.some((pause) => pause.mock.calls.length > 0)).toBe(true)
  })
})
