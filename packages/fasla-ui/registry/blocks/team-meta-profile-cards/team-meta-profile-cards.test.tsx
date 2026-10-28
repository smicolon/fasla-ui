import { beforeAll, describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { TeamMetaProfileCards, teamMetaProfileCardsCopy } from "./TeamMetaProfileCards"

// jsdom has no matchMedia, which the shared reveal hook asks for.
beforeAll(() => {
  window.matchMedia ??= ((query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia
})

describe("Team Meta Profile Cards", () => {
  it.each(["en", "ar"] as const)("renders three profiles of four meta rows in %s, under an h2 that names the section", (locale) => {
    const { container } = render(<TeamMetaProfileCards locale={locale} />)
    const copy = teamMetaProfileCardsCopy[locale]
    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading.textContent).toBe(copy.heading)
    expect(container.querySelector("section")?.getAttribute("aria-labelledby")).toBe(heading.id)
    expect(screen.getAllByRole("listitem").filter((li) => li.closest("ul")?.parentElement?.tagName !== "DL")).toHaveLength(3)
    expect(container.querySelectorAll("dl")).toHaveLength(3)
    expect(container.querySelectorAll("dt")).toHaveLength(12)
    expect([...container.querySelector("dl")!.querySelectorAll("dt")].map((dt) => dt.textContent)).toEqual(copy.metaLabels)
  })

  it("turns the name into a card-wide link given an href, and renders nothing for an empty list", () => {
    const { rerender } = render(<TeamMetaProfileCards people={[{ id: "a", name: "A", role: "r", meta: ["1", "2", "3", "4"], href: "/a" }]} />)
    expect(screen.getByRole("link", { name: "A" }).getAttribute("href")).toBe("/a")
    rerender(<TeamMetaProfileCards people={[]} />)
    expect(screen.queryAllByRole("listitem")).toHaveLength(0)
  })
})
