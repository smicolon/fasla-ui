import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { MahaamTestimonials } from "./mahaam-testimonials"

/*
 * The stack does not autoplay: it changes only on the arrows and the dots.
 */

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

const front = () => document.querySelector("figure:not([aria-hidden])")?.textContent ?? ""

describe("MahaamTestimonials", () => {
  it("stays on the first card however long it waits", () => {
    render(<MahaamTestimonials />)
    const first = front()
    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(front()).toBe(first)
    expect(first).toContain("Noura Al-Harbi")
  })

  it("keeps the two back cards' words and photo out of sight and out of assistive technology", () => {
    render(<MahaamTestimonials />)
    const cards = Array.from(document.querySelectorAll("figure"))
    expect(cards).toHaveLength(3)
    const back = cards.filter((card) => card.getAttribute("aria-hidden") === "true")
    expect(back).toHaveLength(2)
    for (const card of back) {
      expect(card.hasAttribute("inert")).toBe(true)
      for (const child of Array.from(card.children)) expect(child.className).toContain("opacity-0")
    }
    const front = cards.find((card) => !card.hasAttribute("aria-hidden"))!
    expect(front.hasAttribute("inert")).toBe(false)
    for (const child of Array.from(front.children)) expect(child.className).toContain("opacity-100")
  })

  it("moves on the arrows, both ways, and wraps", () => {
    render(<MahaamTestimonials />)
    fireEvent.click(screen.getByRole("button", { name: "Next testimonial" }))
    expect(front()).toContain("Khalid Mansour")
    fireEvent.click(screen.getByRole("button", { name: "Previous testimonial" }))
    fireEvent.click(screen.getByRole("button", { name: "Previous testimonial" }))
    expect(front()).toContain("Faisal Al-Otaibi")
  })

  it("moves to the card a dot names", () => {
    render(<MahaamTestimonials />)
    fireEvent.click(screen.getByRole("button", { name: "Testimonial 3 of 3" }))
    expect(front()).toContain("Faisal Al-Otaibi")
  })

  it("draws no pause button, and works under reduced motion", () => {
    render(<MahaamTestimonials reducedMotion />)
    expect(screen.queryByRole("button", { name: /animation/ })).toBeNull()
    fireEvent.click(screen.getByRole("button", { name: "Next testimonial" }))
    expect(front()).toContain("Khalid Mansour")
  })
})
