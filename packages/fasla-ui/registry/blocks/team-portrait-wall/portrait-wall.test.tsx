import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { TeamPortraitWall } from "./TeamPortraitWall"

describe("Team Portrait Wall", () => {
  it("renders Figma's English copy: an h2 naming the section and twelve people", () => {
    render(<TeamPortraitWall />)
    const heading = screen.getByRole("heading", { level: 2, name: "Nineteen people, one system" })
    expect(screen.getByRole("region", { name: "Nineteen people, one system" })).toBeTruthy()
    expect(heading.tagName).toBe("H2")
    expect(screen.getAllByRole("listitem")).toHaveLength(12)
    expect(screen.getByText("EVERYONE")).toBeTruthy()
    expect(screen.getByText("Sofia Marchetti")).toBeTruthy()
  })

  it("renders the Arabic copy", () => {
    render(<TeamPortraitWall locale="ar" />)
    expect(screen.getByRole("heading", { level: 2, name: "تسعة عشر شخصًا، نظام واحد" })).toBeTruthy()
    expect(screen.getAllByRole("listitem")).toHaveLength(12)
    expect(screen.getByText("قائدة إمكانية الوصول")).toBeTruthy()
  })

  it("shows a photo with its alt, or initials without one", () => {
    const { container } = render(
      <TeamPortraitWall people={[{ name: "Layla Mansour", role: "CEO", photo: { src: "/a.webp", alt: "Layla" } }, { name: "Karim Haddad", role: "CTO" }]} />
    )
    expect(screen.getByAltText("Layla")).toBeTruthy()
    expect(container.textContent).toContain("KH")
  })

  it("sets the wave delay from column plus row, per column count", () => {
    render(<TeamPortraitWall />)
    const items = screen.getAllByRole("listitem")
    // The 8th person (index 7): 6 columns -> col 1 + row 1; 4 columns -> col 3 + row 1; 2 columns -> col 1 + row 3.
    expect(items[7]!.style.getPropertyValue("--team-wave-6")).toBe("2")
    expect(items[7]!.style.getPropertyValue("--team-wave-4")).toBe("4")
    expect(items[7]!.style.getPropertyValue("--team-wave-2")).toBe("4")
  })

  it("renders no list for an empty roster", () => {
    render(<TeamPortraitWall people={[]} />)
    expect(screen.queryByRole("list")).toBeNull()
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy()
  })
})
