import { describe, it, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import { TeamCompactDirectoryRows, teamCompactDirectoryRowsCopy } from "./TeamCompactDirectoryRows"

describe("Team Compact Directory Rows", () => {
  it("names the section by its h2 and lists ten people", () => {
    render(<TeamCompactDirectoryRows />)
    const heading = screen.getByRole("heading", { level: 2, name: "The whole team, one page" })
    expect(screen.getByRole("region", { name: "The whole team, one page" })).toBeTruthy()
    expect(heading.tagName).toBe("H2")
    expect(screen.getAllByRole("listitem")).toHaveLength(10)
  })

  it("gives every row two icon-only buttons with a name from the copy", () => {
    render(<TeamCompactDirectoryRows />)
    const row = screen.getAllByRole("listitem")[0]!
    expect(within(row).getByRole("link", { name: "Email: Layla Mansour" })).toBeTruthy()
    expect(within(row).getByRole("link", { name: "LinkedIn: Layla Mansour" })).toBeTruthy()
    expect(screen.getAllByRole("link")).toHaveLength(20)
  })

  it("rests the buttons dimmed only where a hover exists, and raises them on hover and focus", () => {
    const { container } = render(<TeamCompactDirectoryRows />)
    const group = container.querySelector("li .flex.shrink-0.items-center.gap-1")!
    expect(group.className).toContain("[@media(hover)]:opacity-40")
    expect(group.className).toContain("group-hover/row:opacity-100")
    expect(group.className).toContain("group-focus-within/row:opacity-100")
    expect(group.className).not.toMatch(/(^|\s)opacity-40/)
  })

  it("renders the Arabic copy, and nothing for an empty list", () => {
    const { rerender } = render(<TeamCompactDirectoryRows locale="ar" />)
    expect(screen.getByRole("heading", { level: 2, name: teamCompactDirectoryRowsCopy.ar.heading as string })).toBeTruthy()
    expect(screen.getAllByRole("listitem")).toHaveLength(10)
    expect(screen.getByText("شريك مؤسِّس ورئيس التقنية")).toBeTruthy()
    rerender(<TeamCompactDirectoryRows people={[]} />)
    expect(screen.queryAllByRole("listitem")).toHaveLength(0)
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy()
  })
})
