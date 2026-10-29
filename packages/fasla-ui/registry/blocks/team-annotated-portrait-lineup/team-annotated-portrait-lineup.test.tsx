import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import { TeamAnnotatedPortraitLineup, teamAnnotatedPortraitLineupCopy } from "./TeamAnnotatedPortraitLineup"

function stubMotion(reduce: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: reduce && query.includes("prefers-reduced-motion"),
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
}

beforeEach(() => stubMotion(false))
afterEach(() => cleanup())

describe("Team Annotated Portrait Lineup", () => {
  it.each(["en", "ar"] as const)("renders five people and an h2 that names the section in %s", (locale) => {
    const { container } = render(<TeamAnnotatedPortraitLineup locale={locale} />)
    const copy = teamAnnotatedPortraitLineupCopy[locale]
    expect(container.querySelectorAll("li")).toHaveLength(5)
    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading.textContent).toBe(copy.heading)
    expect(container.querySelector("section")?.getAttribute("aria-labelledby")).toBe(heading.id)
    for (const person of copy.people) expect(screen.getByText(person.name as string)).toBeTruthy()
  })

  it("draws one decorative arrow per person, alternating the curl, and aims it", () => {
    const { container } = render(<TeamAnnotatedPortraitLineup people={[...teamAnnotatedPortraitLineupCopy.en.people].map((p, i) => (i === 0 ? { ...p, aim: 0.3 } : p))} />)
    const arrows = [...container.querySelectorAll("svg")]
    expect(arrows).toHaveLength(5)
    expect(arrows.map((a) => a.getAttribute("data-curl"))).toEqual(["a", "b", "a", "b", "a"])
    expect(arrows.every((a) => a.getAttribute("aria-hidden") === "true")).toBe(true)
    expect(arrows[0]!.getAttribute("data-aim")).toBe("0.3")
    expect(arrows[0]!.style.getPropertyValue("--team-x-ltr")).toBe("calc(0.3 * 100% - 42.47px)")
    expect(arrows[0]!.style.getPropertyValue("--team-x-rtl")).toBe("calc(0.7000 * 100% - 42.47px)")
    // Rami's default head is 0.412 of the photo, and a B arrow has no inset.
    expect(arrows[1]!.style.getPropertyValue("--team-x-ltr")).toBe("calc(0.412 * 100%)")
  })

  it("keeps every arrow drawn at rest with reduced motion, and pending until the section is seen otherwise", () => {
    const { container, unmount } = render(<TeamAnnotatedPortraitLineup />)
    // jsdom has no IntersectionObserver, so the reveal never starts: nothing is hidden.
    expect(container.querySelector("section")?.getAttribute("data-reveal")).toBe("idle")
    unmount()
    stubMotion(true)
    const reduced = render(<TeamAnnotatedPortraitLineup />)
    expect(reduced.container.querySelector("section")?.getAttribute("data-reveal")).toBe("idle")
  })

  it("never mirrors a photo, takes the column from the image's aspect, and keeps the rail reachable", () => {
    const people = teamAnnotatedPortraitLineupCopy.en.people.map((p) => ({ ...p, photo: { src: `/${p.name}.png`, alt: `${p.name} portrait`, width: 100, height: 200 } }))
    const { container } = render(<TeamAnnotatedPortraitLineup people={people} />)
    const imgs = container.querySelectorAll("img")
    expect(imgs).toHaveLength(5)
    for (const img of imgs) expect(img.className).not.toMatch(/scale-x/)
    expect(screen.getByAltText("Omar Nasser portrait")).toBeTruthy()
    // Omar's Figma height is 309, so a 1:2 cut-out is 155px wide at Desktop size.
    expect(container.querySelector("li")?.style.width).toBe("calc(155px * var(--team-s))")
    expect(container.querySelector("[tabindex='0']")).toBeTruthy()
  })

  it("renders no rail for an empty list", () => {
    const { container } = render(<TeamAnnotatedPortraitLineup people={[]} />)
    expect(container.querySelector("ul")).toBeNull()
  })
})
