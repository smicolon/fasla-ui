import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { TeamMemberCarousel, teamMemberCarouselCopy } from "./TeamMemberCarousel"

beforeEach(() => {
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
})
afterEach(() => cleanup())

describe("Team Member Carousel", () => {
  it.each(["en", "ar"] as const)("renders five cards and an h2 that names the section in %s", (locale) => {
    const { container } = render(<TeamMemberCarousel locale={locale} />)
    const copy = teamMemberCarouselCopy[locale]
    expect(container.querySelectorAll("[data-slot='carousel-item']")).toHaveLength(5)
    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading.textContent).toBe(copy.heading)
    expect(container.querySelector("section")?.getAttribute("aria-labelledby")).toBe(heading.id)
    expect(screen.getByRole("button", { name: copy.labels.next })).toBeTruthy()
    expect(screen.getByRole("button", { name: copy.labels.previous })).toBeTruthy()
  })

  it("steps one card per arrow press, and the dots follow", () => {
    const { container } = render(<TeamMemberCarousel />)
    const previous = screen.getByRole("button", { name: "Previous member" }) as HTMLButtonElement
    const next = screen.getByRole("button", { name: "Next member" })
    const current = () => container.querySelector("[data-slot='carousel-dot'][aria-current='true']")?.getAttribute("aria-label")
    expect(previous.disabled).toBe(true)
    expect(current()).toBe("1 / 5")
    fireEvent.click(next)
    expect(current()).toBe("2 / 5")
    expect(previous.disabled).toBe(false)
    fireEvent.click(previous)
    expect(current()).toBe("1 / 5")
  })

  it("makes a card a link only when it has an href, and draws no controls for an empty list", () => {
    const { container, rerender } = render(<TeamMemberCarousel people={[{ name: "Omar Nasser", role: "Head of Product", href: "/omar" }]} />)
    expect(container.querySelector("a")?.getAttribute("href")).toBe("/omar")
    rerender(<TeamMemberCarousel people={[]} />)
    expect(screen.queryByRole("button", { name: "Next member" })).toBeNull()
    expect(container.querySelector("[data-slot='carousel-content']")).toBeNull()
  })

  it("mirrors the arrow icons for right-to-left pages and never autoplays", () => {
    const { container } = render(<TeamMemberCarousel locale="ar" />)
    for (const svg of container.querySelectorAll("button svg")) expect(svg.getAttribute("class")).toContain("rtl:-scale-x-100")
    expect(container.querySelector("[aria-live]")).toBeNull()
  })
})
