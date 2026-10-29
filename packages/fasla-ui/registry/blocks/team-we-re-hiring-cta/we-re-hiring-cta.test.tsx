import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { TeamWeReHiringCta, teamWeReHiringCtaCopy } from "./TeamWeReHiringCta"

describe("Team We're Hiring CTA", () => {
  it("names the section by its h2, with five avatars, five roles and the button", () => {
    const { container } = render(<TeamWeReHiringCta />)
    expect(screen.getByRole("heading", { level: 2, name: "We're hiring across the system" })).toBeTruthy()
    expect(screen.getByRole("region", { name: "We're hiring across the system" })).toBeTruthy()
    expect(container.querySelectorAll("[data-slot='avatar'], ul:first-of-type li")).toBeTruthy()
    const items = screen.getAllByRole("listitem")
    expect(items).toHaveLength(10) // five avatars + five roles
    expect(screen.getByRole("link", { name: "See all openings" })).toBeTruthy()
    expect(screen.getByRole("link", { name: /Senior Product Designer/ })).toBeTruthy()
    expect(screen.getByText("Design · Amman · Full-time")).toBeTruthy()
  })

  it("wipes the underline on hover and on focus, and runs it from the start edge in both directions", () => {
    const { container } = render(<TeamWeReHiringCta />)
    const bar = container.querySelector("a span[aria-hidden].scale-x-0")!
    expect(bar.className).toContain("group-hover/role:scale-x-100")
    expect(bar.className).toContain("group-focus-visible/role:scale-x-100")
    expect(bar.className).toContain("rtl:origin-right")
    const arrow = container.querySelector("a svg")!
    expect(arrow.getAttribute("class")).toContain("rtl:-scale-x-100")
    expect(arrow.getAttribute("class")).toContain("group-focus-visible/role:translate-x-")
  })

  it("makes the button full width on Mobile only", () => {
    render(<TeamWeReHiringCta />)
    const button = screen.getByRole("link", { name: "See all openings" })
    expect(button.className).toContain("w-full")
    expect(button.className).toContain("[@container(min-width:40rem)]:w-auto")
  })

  it("renders the Arabic copy and nothing for empty lists", () => {
    const { rerender } = render(<TeamWeReHiringCta locale="ar" />)
    expect(screen.getByRole("heading", { level: 2, name: teamWeReHiringCtaCopy.ar.heading as string })).toBeTruthy()
    expect(screen.getByText("التصميم · عمّان · دوام كامل")).toBeTruthy()
    rerender(<TeamWeReHiringCta members={[]} roles={[]} />)
    expect(screen.queryAllByRole("listitem")).toHaveLength(0)
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy()
  })
})
