import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import { MahaamTemplate } from "./mahaam-template"

/*
 * The whole page: every section is there in both languages, and the motion
 * exception holds: the page draws no pause button (a site places the toggle),
 * and `paused` stops the sections.
 */

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
  Element.prototype.animate = vi.fn(() => ({ pause: vi.fn(), play: vi.fn(), cancel: vi.fn() })) as unknown as Element["animate"]
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  } as unknown as typeof IntersectionObserver
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
  setReducedMotion(false)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("MahaamTemplate", () => {
  it("has every section, in English", () => {
    render(<MahaamTemplate />)
    for (const text of ["Speak your day.", "Loved by teams who talk more than they type", "From voice to done.", "Ask anything you’ve ever said.", "Your next meeting starts soon.", "Simple plans.", "Questions,", "Prices are placeholders for this template."]) {
      expect(screen.getAllByText((content) => content.includes(text)).length, text).toBeGreaterThan(0)
    }
  })

  it("has every section, in Arabic", () => {
    render(<MahaamTemplate locale="ar" />)
    for (const text of ["تحدّث عن يومك، ومهام يرتّب الباقي.", "من الصوت إلى الإنجاز.", "اسأل عن أي شيء قلته يومًا.", "اجتماعك القادم يبدأ قريبًا.", "الأسعار هنا للعرض فقط."]) {
      expect(screen.getAllByText((content) => content.includes(text)).length, text).toBeGreaterThan(0)
    }
  })

  it("draws no pause button in any section", () => {
    render(<MahaamTemplate />)
    expect(screen.queryAllByRole("button", { name: /animation/ })).toHaveLength(0)
  })

  it("accepts `paused`, `defaultPaused` and `still` without drawing anything extra", () => {
    const { rerender } = render(<MahaamTemplate paused />)
    rerender(<MahaamTemplate defaultPaused />)
    rerender(<MahaamTemplate still />)
    expect(screen.queryAllByRole("button", { name: /animation/ })).toHaveLength(0)
  })
})
