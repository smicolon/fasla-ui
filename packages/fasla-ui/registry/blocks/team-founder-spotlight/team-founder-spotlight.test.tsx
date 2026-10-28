import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import { TeamFounderSpotlight, teamFounderSpotlightCopy } from "./TeamFounderSpotlight"

beforeEach(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
})
afterEach(() => cleanup())

describe("Team Founder Spotlight", () => {
  it.each(["en", "ar"] as const)("renders one feature and three support cards under an h2 that names the section in %s", (locale) => {
    const { container } = render(<TeamFounderSpotlight locale={locale} />)
    const copy = teamFounderSpotlightCopy[locale]
    expect(container.querySelectorAll("article")).toHaveLength(1)
    expect(container.querySelectorAll("li")).toHaveLength(3)
    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading.textContent).toBe(copy.heading)
    expect(container.querySelector("section")?.getAttribute("aria-labelledby")).toBe(heading.id)
    expect(container.querySelector("blockquote")?.textContent).toBe(copy.feature.quote)
    for (const person of copy.supporters) {
      expect(screen.getByText(person.name as string)).toBeTruthy()
      expect(screen.getByText(person.description as string)).toBeTruthy()
    }
  })

  it("takes photos from the people, with initials when there is none, and the alt text given", () => {
    const base = teamFounderSpotlightCopy.en
    render(
      <TeamFounderSpotlight
        feature={{ ...base.feature, photo: { src: "/layla.jpg", alt: "Layla Mansour smiling" } }}
        supporters={base.supporters.slice(0, 2)}
      />
    )
    expect(screen.getByAltText("Layla Mansour smiling")).toBeTruthy()
    expect(screen.getAllByRole("listitem")).toHaveLength(2)
    expect(screen.getByText("KH")).toBeTruthy()
  })

  it("has its entrance only as motion-safe classes, so reduced motion shows it at rest", () => {
    const { container } = render(<TeamFounderSpotlight />)
    const classes = [...container.querySelectorAll("[class]")].map((node) => node.getAttribute("class") ?? "").join(" ")
    const hidden = classes.match(/\S*group-data-\[reveal=pending\]\/team:\S+/g) ?? []
    expect(hidden.length).toBeGreaterThan(0)
    expect(hidden.every((name) => name.startsWith("motion-safe:"))).toBe(true)
  })

  it("leaves the support column off when there are no supporters", () => {
    const { container } = render(<TeamFounderSpotlight supporters={[]} />)
    expect(container.querySelector("ul")).toBeNull()
  })

  it("leaves the feature card off with feature={null}, and draws nothing but the heading when there are no supporters either", () => {
    const { container, rerender } = render(<TeamFounderSpotlight feature={null} />)
    expect(container.querySelector("article")).toBeNull()
    expect(container.querySelectorAll("li").length).toBe(3)
    rerender(<TeamFounderSpotlight feature={null} supporters={[]} />)
    expect(container.querySelector("article")).toBeNull()
    expect(container.querySelector("ul")).toBeNull()
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy()
  })
})
