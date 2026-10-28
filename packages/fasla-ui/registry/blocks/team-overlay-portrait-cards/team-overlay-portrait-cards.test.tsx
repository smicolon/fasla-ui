import { beforeAll, describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { TeamOverlayPortraitCards, teamOverlayPortraitCardsCopy } from "./TeamOverlayPortraitCards"

// jsdom has no matchMedia, which the shared reveal hook asks for.
beforeAll(() => {
  window.matchMedia ??= ((query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia
})

describe("Team Overlay Portrait Cards", () => {
  it.each(["en", "ar"] as const)("renders four portraits in %s, under an h2 that names the section", (locale) => {
    const { container } = render(<TeamOverlayPortraitCards locale={locale} />)
    const copy = teamOverlayPortraitCardsCopy[locale]
    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading.textContent).toBe(copy.heading)
    expect(container.querySelector("section")?.getAttribute("aria-labelledby")).toBe(heading.id)
    expect(screen.getAllByRole("listitem")).toHaveLength(4)
    for (const person of copy.people) expect(screen.getByText(person.name as string)).toBeTruthy()
  })

  it("shows the sample bios in both languages, so the hover has something to reveal", () => {
    const { container, rerender } = render(<TeamOverlayPortraitCards />)
    expect(screen.getByText("Shapes how Fasla looks and sounds.")).toBeTruthy()
    expect(container.querySelectorAll("article[tabindex='0']")).toHaveLength(4)
    rerender(<TeamOverlayPortraitCards locale="ar" />)
    expect(screen.getByText("تصوغ هوية فاصلة البصرية.")).toBeTruthy()
  })

  it("draws no bio unless a person has one, and a card with one takes focus so a keyboard can reveal it", () => {
    const { container, rerender } = render(<TeamOverlayPortraitCards people={[{ id: "a", name: "A", role: "r" }]} />)
    expect(container.querySelectorAll("article[tabindex]")).toHaveLength(0)
    rerender(<TeamOverlayPortraitCards people={[{ id: "a", name: "A", role: "r", bio: "Ships the thing." }]} />)
    expect(screen.getByText("Ships the thing.")).toBeTruthy()
    expect(container.querySelectorAll("article[tabindex='0']")).toHaveLength(1)
  })

  it("paints the caption bar with the inverse tokens, so it follows the mode as the section does", () => {
    const { container } = render(<TeamOverlayPortraitCards />)
    const bar = container.querySelector("article > div:last-child")!
    expect(bar.className).toContain("bg-background-inverse")
    expect(bar.className).toContain("text-foreground-inverse")
    expect(bar.className).not.toContain("dark:")
  })

  it("renders no cards for an empty list", () => {
    render(<TeamOverlayPortraitCards people={[]} />)
    expect(screen.queryAllByRole("listitem")).toHaveLength(0)
  })
})
