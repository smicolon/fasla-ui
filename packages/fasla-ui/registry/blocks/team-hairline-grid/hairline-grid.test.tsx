import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { TeamHairlineGrid } from "./TeamHairlineGrid"

describe("Team Hairline Grid", () => {
  it("renders Figma's English copy with six people under an h2 that names the section", () => {
    render(<TeamHairlineGrid />)
    expect(screen.getByRole("heading", { level: 2, name: "The people who own the system" })).toBeTruthy()
    expect(screen.getByRole("region", { name: "The people who own the system" })).toBeTruthy()
    expect(screen.getAllByRole("listitem")).toHaveLength(6)
    expect(screen.getByText("Co-founder & Chief Technology, Fasla")).toBeTruthy()
  })

  it("renders the Arabic copy", () => {
    render(<TeamHairlineGrid locale="ar" />)
    expect(screen.getByRole("heading", { level: 2, name: "الفريق المسؤول عن النظام" })).toBeTruthy()
    expect(screen.getAllByRole("listitem")).toHaveLength(6)
    expect(screen.getByText("شريك مؤسِّس ورئيس التقنية، فاصلة")).toBeTruthy()
  })

  it("is painted with the inverse tokens and its rules are logical borders", () => {
    const { container } = render(<TeamHairlineGrid />)
    const section = container.querySelector("section")!
    expect(section.className).toContain("bg-background-inverse")
    const list = screen.getByRole("list")
    expect(list.className).toContain("border-s")
    expect(list.className).toContain("border-foreground-inverse")
    expect(screen.getAllByRole("listitem")[0]!.className).toContain("border-e")
  })

  it("draws crosshairs at every crossing of each layout: 4x3, 3x4 and 2x7", () => {
    const { container } = render(<TeamHairlineGrid />)
    const counts = ["1x6", "2x3", "3x2"].map((id) => container.querySelector(`[data-lattice="${id}"]`)!.children.length)
    // strips (cols + 1 verticals, rows + 1 horizontals) plus one crosshair per crossing
    expect(counts).toEqual([2 + 7 + 14, 3 + 4 + 12, 4 + 3 + 12])
  })

  it("keeps portraits in colour on touch: greyscale is behind the hover media query", () => {
    render(<TeamHairlineGrid people={[{ name: "A B", role: "x", photo: { src: "/a.webp", alt: "A" } }]} />)
    const img = screen.getByAltText("A")
    expect(img.className).toContain("[@media(hover)]:[@container(min-width:40rem)]:grayscale")
    expect(img.className).not.toMatch(/(^|\s)grayscale(\s|$)/)
  })

  it("renders no grid for an empty roster", () => {
    render(<TeamHairlineGrid people={[]} />)
    expect(screen.queryByRole("list")).toBeNull()
  })
})
