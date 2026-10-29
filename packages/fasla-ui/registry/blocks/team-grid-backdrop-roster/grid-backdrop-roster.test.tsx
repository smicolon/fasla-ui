import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { TeamGridBackdropRoster } from "./TeamGridBackdropRoster"

describe("Team Grid Backdrop Roster", () => {
  it("renders Figma's English copy: an h2 naming the section, two buttons and eight tiles", () => {
    render(<TeamGridBackdropRoster />)
    expect(screen.getByRole("heading", { level: 2, name: "We are the people who make up Fasla" })).toBeTruthy()
    expect(screen.getByRole("region", { name: "We are the people who make up Fasla" })).toBeTruthy()
    expect(screen.getAllByRole("listitem")).toHaveLength(8)
    expect(screen.getByRole("button", { name: "Read our story" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "See open roles" })).toBeTruthy()
  })

  it("puts the two buttons in Figma's order: Outline first, Solid second", () => {
    render(<TeamGridBackdropRoster />)
    const buttons = screen.getAllByRole("button")
    expect(buttons.map((b) => b.textContent)).toEqual(["Read our story", "See open roles"])
    expect(buttons[0]!.getAttribute("data-variant")).toBe("outline")
    expect(buttons[1]!.getAttribute("data-variant")).toBe("default")
  })

  it("renders the Arabic copy", () => {
    render(<TeamGridBackdropRoster locale="ar" />)
    expect(screen.getByRole("heading", { level: 2, name: "الفريق الذي يصنع فاصلة" })).toBeTruthy()
    expect(screen.getAllByRole("listitem")).toHaveLength(8)
    expect(screen.getByRole("button", { name: "اقرأ قصتنا" })).toBeTruthy()
    expect(screen.getByText("شريك مؤسِّس ورئيس التقنية")).toBeTruthy()
  })

  it("renders a link only for a person with an href, and a plain div otherwise", () => {
    render(
      <TeamGridBackdropRoster
        people={[
          { name: "Clara Weiss", role: "Lead", href: "/people/clara" },
          { name: "Karim Haddad", role: "CTO" },
        ]}
      />
    )
    const link = screen.getByRole("link", { name: /Clara Weiss/ })
    expect(link.getAttribute("href")).toBe("/people/clara")
    expect(screen.getAllByRole("link")).toHaveLength(1)
    expect(screen.getByText("Karim Haddad").closest("a")).toBeNull()
  })

  it("stands the cut-out on the tile's bottom edge and lays the second tint layer over the tile", () => {
    const { container } = render(<TeamGridBackdropRoster people={[{ name: "A B", role: "x", photo: { src: "/a.webp", alt: "A" } }]} />)
    expect(screen.getByAltText("A").className).toContain("object-bottom")
    expect(container.querySelector(".bg-soft-info")).toBeTruthy()
    expect(container.querySelectorAll(".bg-soft-info").length).toBe(2)
  })

  it("fades the grid backdrop out with a background overlay", () => {
    const { container } = render(<TeamGridBackdropRoster />)
    const backdrop = container.querySelector('[data-slot="grid-backdrop"]')!
    expect(backdrop.innerHTML).toContain("to-background")
    expect(backdrop.getAttribute("aria-hidden")).toBe("true")
  })

  it("renders no list for an empty roster", () => {
    render(<TeamGridBackdropRoster people={[]} />)
    expect(screen.queryByRole("list")).toBeNull()
  })

  it("centres its capped heading in its box, so it sits on the buttons' axis in both directions", () => {
    for (const locale of ["en", "ar"] as const) {
      const { container, unmount } = render(<TeamGridBackdropRoster locale={locale} />)
      expect(container.querySelector("h2")?.className).toContain("mx-auto")
      unmount()
    }
  })
})
