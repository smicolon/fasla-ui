import { describe, it, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import { TeamSplitIntroMemberRail, teamSplitIntroMemberRailCopy } from "./TeamSplitIntroMemberRail"

describe("Team Split Intro + Member Rail", () => {
  it("names the section by its h2 and lists eight members", () => {
    const { container } = render(<TeamSplitIntroMemberRail />)
    const heading = screen.getByRole("heading", { level: 2, name: "A small team with deep range" })
    expect(container.querySelector("section")?.getAttribute("aria-labelledby")).toBe(heading.id)
    expect(screen.getAllByRole("listitem")).toHaveLength(8)
    expect(screen.getByText("THE TEAM")).toBeTruthy()
    expect(container.textContent).toContain("19 people · 7 disciplines · 4 cities")
  })

  it("shows a name, a role and a location in every row", () => {
    render(<TeamSplitIntroMemberRail />)
    const row = screen.getAllByRole("listitem")[0]!
    expect(within(row).getByText("Hana Kobayashi")).toBeTruthy()
    expect(within(row).getByText("Motion Designer")).toBeTruthy()
    expect(within(row).getByText("Singapore")).toBeTruthy()
  })

  it("renders Figma's Arabic copy", () => {
    render(<TeamSplitIntroMemberRail locale="ar" />)
    expect(screen.getByRole("heading", { level: 2, name: "فريق صغير بخبرة واسعة" })).toBeTruthy()
    expect(screen.getAllByRole("listitem")).toHaveLength(8)
    expect(screen.getByText("هانا كوباياشي")).toBeTruthy()
    expect(teamSplitIntroMemberRailCopy.ar.members).toHaveLength(8)
  })

  it("pins nothing: the intro is not sticky or fixed", () => {
    const { container } = render(<TeamSplitIntroMemberRail />)
    expect(container.innerHTML).not.toMatch(/sticky|fixed/)
  })

  it("makes the name a link, stretched over the row, when a member has an href", () => {
    render(<TeamSplitIntroMemberRail members={[{ name: "Ada", role: "Engineer", location: "Oslo", href: "/ada" }]} />)
    expect(screen.getByRole("link", { name: "Ada" }).getAttribute("href")).toBe("/ada")
  })

  it("renders no rail for an empty list", () => {
    render(<TeamSplitIntroMemberRail members={[]} />)
    expect(screen.queryByRole("list")).toBeNull()
  })

  it("accepts a photo and uses its alt", () => {
    render(
      <TeamSplitIntroMemberRail members={[{ name: "Ada", role: "Engineer", location: "Oslo", photo: { src: "/a.jpg", alt: "Ada at work" } }]} />
    )
    expect(screen.getByAltText("Ada at work")).toBeTruthy()
  })
})
