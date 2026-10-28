import { describe, it, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import { TeamMemberTable, teamMemberTableCopy } from "./TeamMemberTable"

describe("Team Member Table", () => {
  it("is a real table with five columns and eight people", () => {
    render(<TeamMemberTable />)
    expect(screen.getByRole("heading", { level: 2, name: "Who does what, and where" })).toBeTruthy()
    expect(screen.getByRole("region", { name: "Who does what, and where" })).toBeTruthy()
    expect(screen.getAllByRole("columnheader")).toHaveLength(5)
    expect(screen.getByRole("columnheader", { name: "BASED IN" })).toBeTruthy()
    expect(screen.getAllByRole("row")).toHaveLength(9)
  })

  it("puts the name, role, team badge, city and a named link in a row", () => {
    render(<TeamMemberTable />)
    const row = screen.getAllByRole("row")[3]!
    expect(within(row).getAllByText("Yara Khalil").length).toBeGreaterThan(0)
    expect(within(row).getByText("VP of Design")).toBeTruthy()
    expect(within(row).getByText("Design")).toBeTruthy()
    expect(within(row).getByText("Dubai")).toBeTruthy()
    expect(within(row).getByRole("link", { name: "View profile: Yara Khalil" })).toBeTruthy()
  })

  it("hides the location column below Desktop and fills the row on hover from Tablet", () => {
    const { container } = render(<TeamMemberTable />)
    const bodyRow = container.querySelector("tbody tr")!
    expect(bodyRow.className).toContain("hover:[@container(min-width:40rem)]:bg-muted")
    expect(bodyRow.className).toContain("focus-within:[@container(min-width:40rem)]:bg-muted")
    const location = container.querySelectorAll("tbody tr:first-child td")[3]!
    expect(location.className).toContain("[@container(min-width:40rem)]:hidden")
    expect(location.className).toContain("[@container(min-width:64rem)]:table-cell")
  })

  it("renders the Arabic copy and nothing for an empty list", () => {
    const { rerender } = render(<TeamMemberTable locale="ar" />)
    expect(screen.getByRole("heading", { level: 2, name: teamMemberTableCopy.ar.heading as string })).toBeTruthy()
    expect(screen.getAllByRole("row")).toHaveLength(9)
    expect(screen.getByRole("link", { name: "عرض الملف الشخصي: رامي عزيز" })).toBeTruthy()
    rerender(<TeamMemberTable rows={[]} />)
    expect(screen.queryByRole("table")).toBeNull()
  })
})
