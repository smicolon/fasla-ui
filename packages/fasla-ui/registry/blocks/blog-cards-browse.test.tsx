import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen, within } from "@testing-library/react"
import { BlogCardsFilterSidebarResults, blogCardsFilterSidebarResultsCopy } from "./blog-cards-filter-sidebar-results"
import { BlogCardsSearchChipsResults, blogCardsSearchChipsResultsCopy } from "./blog-cards-search-chips-results"
import { BlogCardsPostCarouselWithControls, blogCardsPostCarouselWithControlsCopy } from "./blog-cards-post-carousel-with-controls"

// What these tests can and cannot prove: jsdom has no layout and no Web
// Animations, so the heights, the cross-fade's look, the rolling number and the
// scrolling were checked in a browser. Here `Element.animate` and `matchMedia`
// are stubs, so the tests assert the contract around the motion: what starts it
// (a press or typing, never the load), in what order, what stays in the DOM while
// it plays, the timings handed to it, and what reduced motion does instead.

type Animation = { el: Element; keyframes: Keyframe[]; options: KeyframeAnimationOptions; onfinish: (() => void) | null }
let animations: Animation[] = []

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

beforeEach(() => {
  animations = []
  setMotion(false)
  Element.prototype.animate = function (this: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
    const animation: Animation = { el: this, keyframes, options, onfinish: null }
    animations.push(animation)
    return animation as unknown as globalThis.Animation
  } as typeof Element.prototype.animate
  Element.prototype.getAnimations = (() => []) as typeof Element.prototype.getAnimations
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

describe("Filter Sidebar + Results", () => {
  const rows = (container: HTMLElement) => Array.from(container.querySelectorAll("ul > li")).filter((li) => li.getAttribute("aria-hidden") !== "true")
  const count = (container: HTMLElement) => container.querySelector("[role='status']")?.textContent

  it("starts as Figma draws it: Design Systems and Field notes pressed, four rows, nothing animated", () => {
    const { container } = render(<BlogCardsFilterSidebarResults />)
    expect(screen.getByRole("button", { name: /Design Systems/ }).getAttribute("aria-pressed")).toBe("true")
    expect(screen.getByRole("button", { name: /Field notes/ }).getAttribute("aria-pressed")).toBe("true")
    expect(screen.getByRole("button", { name: /All posts/ }).getAttribute("aria-pressed")).toBe("false")
    expect(rows(container)).toHaveLength(4)
    expect(count(container)).toBe("4 results")
    expect(container.textContent).toContain("Filtered by")
    expect(animations).toHaveLength(0)
  })

  it("makes every result one link named by its title, and the count a polite status", () => {
    const { container } = render(<BlogCardsFilterSidebarResults />)
    const status = container.querySelector("[role='status']")
    expect(status?.getAttribute("aria-live")).toBe("polite")
    container.querySelectorAll("a[aria-labelledby]").forEach((link) => {
      const title = container.querySelector(`[id="${link.getAttribute("aria-labelledby")}"]`)
      expect(title?.tagName).toBe("H3")
      expect(link.contains(title)).toBe(true)
    })
  })

  it("filters for real: a topic, a format, both, and back to everything", () => {
    vi.stubGlobal("matchMedia", undefined)
    // @ts-expect-error no animations in this test
    delete Element.prototype.animate
    const { container } = render(<BlogCardsFilterSidebarResults defaultTopic={null} defaultFormat={null} />)
    expect(count(container)).toBe("13 results")
    fireEvent.click(screen.getByRole("button", { name: /Typography/ }))
    expect(count(container)).toBe("1 result")
    expect(rows(container)).toHaveLength(1)
    fireEvent.click(screen.getByRole("button", { name: /Long reads/ }))
    expect(count(container)).toBe("1 result")
    fireEvent.click(screen.getByRole("button", { name: /Research/ }))
    expect(count(container)).toBe("0 results")
    expect(screen.getByText("No posts match these filters.")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: /Research/ }))
    fireEvent.click(screen.getByRole("button", { name: /All posts/ }))
    expect(count(container)).toBe("13 results")
    vi.unstubAllGlobals()
  })

  it("collapses leaving rows and expands arriving ones in 220ms, 30ms apart, and removes the leavers when done", () => {
    const { container } = render(<BlogCardsFilterSidebarResults />)
    expect(animations).toHaveLength(0)
    fireEvent.click(screen.getByRole("button", { name: /All posts/ }))
    // The topic cleared: the Field notes posts of other topics arrive, the four stay.
    const arriving = animations.filter((a) => a.options.fill === "backwards")
    expect(arriving.length).toBeGreaterThan(0)
    arriving.forEach((a, i) => {
      expect(a.options.duration).toBe(220)
      expect(a.options.delay).toBe(i * 30)
      expect(a.keyframes[0]).toMatchObject({ height: "0px", opacity: 0 })
    })
    fireEvent.click(screen.getByRole("button", { name: /Typography/ }))
    const leaving = animations.filter((a) => a.options.fill === "forwards")
    expect(leaving.length).toBeGreaterThan(0)
    leaving.forEach((a) => {
      expect(a.options.duration).toBe(220)
      expect(a.keyframes[1]).toMatchObject({ height: "0px", opacity: 0 })
      expect(a.el.getAttribute("aria-hidden")).toBe("true")
    })
    const before = container.querySelectorAll("ul > li").length
    act(() => leaving.forEach((a) => a.onfinish?.()))
    expect(container.querySelectorAll("ul > li").length).toBeLessThan(before)
  })

  it("rolls the count when it changes and not before", () => {
    const { container } = render(<BlogCardsFilterSidebarResults />)
    expect(animations).toHaveLength(0)
    fireEvent.click(screen.getByRole("button", { name: /All posts/ }))
    const roll = animations.filter((a) => a.options.duration === 300)
    expect(roll).toHaveLength(2)
    expect(container.querySelector("[role='status'] [aria-hidden='true']")).toBeTruthy()
  })

  it("changes everything at once when motion is reduced", () => {
    setMotion(true)
    const { container } = render(<BlogCardsFilterSidebarResults />)
    fireEvent.click(screen.getByRole("button", { name: /Typography/ }))
    expect(animations).toHaveLength(0)
    expect(rows(container)).toHaveLength(0)
    expect(container.querySelectorAll("ul > li")).toHaveLength(0)
    expect(count(container)).toBe("0 results")
  })

  it("does not build the sticky rail", () => {
    const { container } = render(<BlogCardsFilterSidebarResults />)
    expect(container.innerHTML).not.toMatch(/sticky/)
  })

  it("shows its empty line when there are no posts, and keeps Arabic free of em dashes and middle dots", () => {
    render(<BlogCardsFilterSidebarResults posts={[]} />)
    expect(screen.getByText("No articles yet.")).toBeTruthy()
    for (const text of strings(blogCardsFilterSidebarResultsCopy.ar)) expect(text, text).not.toMatch(/[—·]/)
  })

  it("counts in Arabic with the right plural forms", () => {
    const { container } = render(<BlogCardsFilterSidebarResults locale="ar" />)
    expect(count(container)).toBe("4 نتائج")
  })
})

describe("Search + Chips + Results", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  const cards = (container: HTMLElement) => container.querySelectorAll("a[aria-labelledby]")
  const showing = (container: HTMLElement) => container.querySelector("[aria-live='polite']")?.textContent
  const type = (value: string) => fireEvent.change(screen.getByRole("searchbox"), { target: { value } })

  it("shows three of eleven at first, with the count line polite and nothing animated", () => {
    const { container } = render(<BlogCardsSearchChipsResults />)
    expect(cards(container)).toHaveLength(3)
    expect(showing(container)).toBe("Showing 3 of 11 posts")
    expect(animations).toHaveLength(0)
  })

  it("makes the chips buttons with aria-pressed, All pressed at first, wearing the Badge's classes", () => {
    render(<BlogCardsSearchChipsResults />)
    const group = screen.getByRole("group", { name: "Topics" })
    const chips = within(group).getAllByRole("button")
    expect(chips).toHaveLength(8)
    expect(chips[0]!.getAttribute("aria-pressed")).toBe("true")
    expect(chips[0]!.className).toContain("bg-primary")
    expect(chips[1]!.getAttribute("aria-pressed")).toBe("false")
    expect(chips[1]!.className).toContain("ring-secondary")
    expect(chips[1]!.className).toContain("duration-150")
  })

  it("debounces typing by 250ms, keeps focus in the field and then swaps the results", () => {
    const { container } = render(<BlogCardsSearchChipsResults />)
    const field = screen.getByRole("searchbox")
    field.focus()
    type("survey")
    act(() => void vi.advanceTimersByTime(249))
    expect(showing(container)).toBe("Showing 3 of 11 posts")
    act(() => void vi.advanceTimersByTime(1))
    // The cross-fade: the old results go out over 100ms, then the new come in.
    expect(container.querySelector(".opacity-0")).toBeTruthy()
    act(() => void vi.advanceTimersByTime(100))
    expect(showing(container)).toBe("Showing 1 of 1 post")
    expect(container.querySelector(".opacity-0")).toBeNull()
    expect(document.activeElement).toBe(field)
    expect(screen.getByRole("searchbox")).toBe(field)
  })

  it("gives each chip a 44px hit area while the chip keeps its Badge size", () => {
    render(<BlogCardsSearchChipsResults />)
    for (const chip of within(screen.getByRole("group", { name: "Topics" })).getAllByRole("button")) {
      expect(chip.className).toContain("after:h-11")
      expect(chip.className).toContain("after:w-[max(100%,2.75rem)]")
      expect(chip.className).toContain("relative")
      expect(chip.className).toContain("min-h-[1.375rem]")
    }
  })

  it("applies a chip at once, narrowing with the text, and swaps with the cross-fade", () => {
    const { container } = render(<BlogCardsSearchChipsResults />)
    fireEvent.click(screen.getByRole("button", { name: "RTL & Arabic" }))
    expect(screen.getByRole("button", { name: "RTL & Arabic" }).getAttribute("aria-pressed")).toBe("true")
    act(() => void vi.advanceTimersByTime(100))
    expect(showing(container)).toBe("Showing 3 of 3 posts")
    type("kashida")
    act(() => void vi.advanceTimersByTime(250 + 100))
    expect(showing(container)).toBe("Showing 2 of 2 posts")
  })

  it("shows the empty line only after 400ms of no results", () => {
    const { container } = render(<BlogCardsSearchChipsResults />)
    type("zzzz")
    act(() => void vi.advanceTimersByTime(250))
    act(() => void vi.advanceTimersByTime(399))
    expect(screen.queryByText("No posts match your search.")).toBeNull()
    expect(cards(container)).toHaveLength(3)
    act(() => void vi.advanceTimersByTime(1 + 100))
    expect(screen.getByText("No posts match your search.")).toBeTruthy()
    expect(showing(container)).toBe("Showing 0 of 0 posts")
  })

  it("never shows the empty line to a typist who passes through no results", () => {
    render(<BlogCardsSearchChipsResults />)
    type("zzzz")
    act(() => void vi.advanceTimersByTime(250 + 200))
    type("kashida")
    act(() => void vi.advanceTimersByTime(250 + 100 + 500))
    expect(screen.queryByText("No posts match your search.")).toBeNull()
  })

  it("swaps at once when motion is reduced", () => {
    setMotion(true)
    const { container } = render(<BlogCardsSearchChipsResults />)
    type("zzzz")
    act(() => void vi.advanceTimersByTime(250))
    expect(screen.getByText("No posts match your search.")).toBeTruthy()
    expect(container.querySelector(".opacity-0")).toBeNull()
    expect(animations).toHaveLength(0)
  })

  it("searches title, excerpt, topic and author", () => {
    const { container } = render(<BlogCardsSearchChipsResults />)
    for (const [text, expected] of [["Noor", 3], ["accessibility", 1], ["x-height", 1], ["ramp", 1]] as const) {
      type(text)
      act(() => void vi.advanceTimersByTime(250 + 100))
      expect(showing(container), text).toBe(`Showing ${Math.min(3, expected)} of ${expected} post${expected === 1 ? "" : "s"}`)
    }
  })

  it("shows the empty line at once when there are no posts, and keeps Arabic free of em dashes and middle dots", () => {
    render(<BlogCardsSearchChipsResults posts={[]} />)
    expect(screen.getByText("No articles yet.")).toBeTruthy()
    for (const text of strings(blogCardsSearchChipsResultsCopy.ar)) expect(text, text).not.toMatch(/[—·]/)
  })
})

describe("Post Carousel with Controls", () => {
  class StubObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  let scrolled: Element[] = []
  beforeEach(() => {
    scrolled = []
    vi.stubGlobal("IntersectionObserver", StubObserver)
    Element.prototype.scrollIntoView = function (this: Element) {
      scrolled.push(this)
    }
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("is a carousel of five cards, each a link named by its title, with a dot per view", () => {
    const { container } = render(<BlogCardsPostCarouselWithControls />)
    expect(container.querySelectorAll("[data-slot='carousel-item']")).toHaveLength(5)
    expect(container.querySelectorAll("a[aria-labelledby]")).toHaveLength(5)
    expect(container.querySelectorAll("[data-slot='carousel-dot']")).toHaveLength(5)
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Keep scrolling sideways")
  })

  it("marks Previous at the start and Next at the end aria-disabled, and keeps them focusable", () => {
    const { rerender } = render(<BlogCardsPostCarouselWithControls />)
    const state = (name: string) => screen.getByRole("button", { name })
    expect(state("Previous posts").getAttribute("aria-disabled")).toBe("true")
    expect((state("Previous posts") as HTMLButtonElement).disabled).toBe(false)
    expect(state("Next posts").getAttribute("aria-disabled")).toBeNull()
    rerender(<BlogCardsPostCarouselWithControls key="end" defaultActiveIndex={4} />)
    expect(state("Previous posts").getAttribute("aria-disabled")).toBeNull()
    expect(state("Next posts").getAttribute("aria-disabled")).toBe("true")
    expect((state("Next posts") as HTMLButtonElement).disabled).toBe(false)
  })

  it("does nothing when a disabled arrow is pressed, and focus stays on it", () => {
    render(<BlogCardsPostCarouselWithControls defaultActiveIndex={4} />)
    const next = screen.getByRole("button", { name: "Next posts" })
    next.focus()
    scrolled = [] // the carousel jumps to the starting card once on mount
    fireEvent.click(next)
    fireEvent.keyDown(next, { key: "Enter" })
    expect(scrolled).toHaveLength(0)
    expect(document.activeElement).toBe(next)
    const previous = screen.getByRole("button", { name: "Previous posts" })
    fireEvent.click(previous)
    expect(scrolled.length).toBeGreaterThan(0)
  })

  it("moves one card when Next is pressed, and a dot jumps to its card", () => {
    const { container } = render(<BlogCardsPostCarouselWithControls />)
    const items = container.querySelectorAll("[data-slot='carousel-item']")
    fireEvent.click(screen.getByRole("button", { name: "Next posts" }))
    expect(scrolled.at(-1)).toBe(items[1])
    fireEvent.click(container.querySelectorAll("[data-slot='carousel-dot']")[3]!)
    expect(scrolled.at(-1)).toBe(items[3])
  })

  it("has no autoplay: nothing moves on a timer", () => {
    vi.useFakeTimers()
    render(<BlogCardsPostCarouselWithControls />)
    act(() => void vi.advanceTimersByTime(120_000))
    expect(scrolled).toHaveLength(0)
    vi.useRealTimers()
  })

  it("draws arrow-left and arrow-right, each mirrored by the nearest dir, so Next points left in Arabic", () => {
    const { container } = render(<BlogCardsPostCarouselWithControls locale="ar" />)
    const previous = screen.getByRole("button", { name: "المقالات السابقة" })
    const next = screen.getByRole("button", { name: "المقالات التالية" })
    expect(previous.querySelector("svg.lucide-arrow-left")?.getAttribute("class")).toContain("[&:dir(rtl)]:-scale-x-100")
    expect(next.querySelector("svg.lucide-arrow-right")?.getAttribute("class")).toContain("[&:dir(rtl)]:-scale-x-100")
    // Previous comes first in the DOM, so a right-to-left page puts it at the right and Next at the left.
    expect(previous.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(container.querySelector("[data-slot='carousel-content']")).toBeTruthy()
  })

  it("keeps the track a focusable, scrollable region with reduced motion jumping at once", () => {
    const { container } = render(<BlogCardsPostCarouselWithControls />)
    const track = container.querySelector("[data-slot='carousel-content']")!
    expect(track.getAttribute("tabindex")).toBe("0")
    expect(track.className).toContain("motion-reduce:scroll-auto")
  })

  it("shows its empty line, and no carousel, without posts, and keeps Arabic free of em dashes and middle dots", () => {
    const { container } = render(<BlogCardsPostCarouselWithControls posts={[]} />)
    expect(container.querySelector("[data-slot='carousel-content']")).toBeNull()
    expect(screen.getByText("No articles yet.")).toBeTruthy()
    for (const text of strings(blogCardsPostCarouselWithControlsCopy.ar)) expect(text, text).not.toMatch(/[—·]/)
  })
})
