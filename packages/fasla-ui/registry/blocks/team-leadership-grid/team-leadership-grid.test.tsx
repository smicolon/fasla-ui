import { beforeAll, describe, it, expect, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { TeamLeadershipGrid, teamLeadershipGridCopy } from "./TeamLeadershipGrid"

// jsdom has no matchMedia, which the shared reveal hook asks for.
beforeAll(() => {
  window.matchMedia ??= ((query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia
})

describe("Team Leadership Grid", () => {
  it.each(["en", "ar"] as const)("renders three leaders in %s, under an h2 that names the section", (locale) => {
    const { container } = render(<TeamLeadershipGrid locale={locale} />)
    const copy = teamLeadershipGridCopy[locale]
    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading.textContent).toBe(copy.heading)
    expect(container.querySelector("section")?.getAttribute("aria-labelledby")).toBe(heading.id)
    expect(screen.getAllByRole("listitem")).toHaveLength(3)
    expect(screen.getAllByRole("button", { name: String(copy.readFullBio) })).toHaveLength(3)
    for (const person of copy.people) expect(screen.getByText(person.name as string)).toBeTruthy()
  })

  it("calls onReadBio with the leader's id, and makes the button a link given an href", () => {
    const onReadBio = vi.fn()
    const people = [
      { id: "a", name: "A", role: "r", bio: "b" },
      { id: "b", name: "B", role: "r", bio: "b", href: "/b" },
    ]
    render(<TeamLeadershipGrid people={people} onReadBio={onReadBio} />)
    fireEvent.click(screen.getByRole("button", { name: "Read full bio" }))
    expect(onReadBio).toHaveBeenCalledWith("a")
    expect(screen.getByRole("link", { name: "Read full bio" }).getAttribute("href")).toBe("/b")
  })

  it("renders no cards for an empty list", () => {
    render(<TeamLeadershipGrid people={[]} />)
    expect(screen.queryAllByRole("listitem")).toHaveLength(0)
  })
})
