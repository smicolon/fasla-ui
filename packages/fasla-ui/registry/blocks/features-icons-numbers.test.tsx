import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { FeaturesIconCardGrid, featuresIconCardGridCopy } from "./features-icon-card-grid"
import { FeaturesCompactIconIndex, featuresCompactIconIndexCopy } from "./features-compact-icon-index"
import { FeaturesNumberedFeatureRows, featuresNumberedFeatureRowsCopy } from "./features-numbered-feature-rows"
import { FeaturesFeatureChecklistColumns, featuresFeatureChecklistColumnsCopy } from "./features-feature-checklist-columns"
import { FeaturesColourBlockCards, featuresColourBlockCardsCopy } from "./features-colour-block-cards"
import { FeaturesStatFeatureBand, featuresStatFeatureBandCopy } from "./features-stat-feature-band"

// What these tests can and cannot prove: jsdom has no layout, so the Figma
// sizes and the container-query layouts were measured in a browser. These
// assert the contract around them: one h2 naming the section, the items in
// Figma's order and count in both languages, the empty state, and the Arabic
// rules (no dash or middle dot, nothing left in English).

type Block = React.ComponentType<{ locale?: "en" | "ar" } & Record<string, unknown>>
const TYPES: { name: string; Block: Block; copy: { en: object; ar: object }; items: number; empty: Record<string, unknown> }[] = [
  { name: "Icon Card Grid", Block: FeaturesIconCardGrid as Block, copy: featuresIconCardGridCopy, items: 6, empty: { cards: [] } },
  { name: "Compact Icon Index", Block: FeaturesCompactIconIndex as Block, copy: featuresCompactIconIndexCopy, items: 16, empty: { items: [] } },
  { name: "Numbered Feature Rows", Block: FeaturesNumberedFeatureRows as Block, copy: featuresNumberedFeatureRowsCopy, items: 4, empty: { features: [] } },
  { name: "Feature Checklist Columns", Block: FeaturesFeatureChecklistColumns as Block, copy: featuresFeatureChecklistColumnsCopy, items: 3, empty: { columns: [] } },
  { name: "Colour Block Cards", Block: FeaturesColourBlockCards as Block, copy: featuresColourBlockCardsCopy, items: 4, empty: { cards: [] } },
  { name: "Stat Feature Band", Block: FeaturesStatFeatureBand as Block, copy: featuresStatFeatureBandCopy, items: 4, empty: { stats: [] } },
]

/** The copy a reader sees: every string except the ids and tones that key an item. */
const strings = (value: unknown): string[] =>
  typeof value === "string"
    ? [value]
    : value && typeof value === "object"
      ? Object.entries(value).flatMap(([key, inner]) => (key === "id" || key === "tone" ? [] : strings(inner)))
      : []

/** The key shape of a copy object, so English and Arabic can be compared. */
const shape = (value: unknown): unknown =>
  Array.isArray(value) ? value.map(shape) : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, shape(inner)])) : typeof value

describe.each(TYPES)("$name", ({ Block, copy, items, empty }) => {
  it.each(["en", "ar"] as const)("renders one h2 that names the section, and every item, in %s", (locale) => {
    const { container } = render(<Block locale={locale} />)
    const headings = screen.getAllByRole("heading", { level: 2 })
    expect(headings).toHaveLength(1)
    expect(container.querySelector("section")?.getAttribute("aria-labelledby")).toBe(headings[0]!.id)
    expect(container.querySelectorAll("ul > li, ol > li, section section").length).toBeGreaterThanOrEqual(items)
  })

  it("has the same shape in English and Arabic", () => {
    expect(shape(copy.ar)).toEqual(shape(copy.en))
  })

  it("writes no em dash or middle dot in the Arabic copy, and no English left in it", () => {
    for (const text of strings(copy.ar)) {
      expect(text, text).not.toMatch(/[—·]/)
      // Latin letters belong only to names that stay Latin: SSO, SCIM, SAML, Okta, Entra, Google, API, REST, JSON, CSV.
      const latin = text.replace(/\b(SSO|SCIM|SAML|Okta|Entra|Google|API|REST|JSON|CSV|hrs)\b/g, "")
      expect(latin, text).not.toMatch(/[A-Za-z]{3,}/)
    }
  })

  it("keeps Western digits in the Arabic copy", () => {
    for (const text of strings(copy.ar)) expect(text, text).not.toMatch(/[٠-٩]/)
  })

  it("shows its heading and no items when it has nothing to show", () => {
    const { container } = render(<Block locale="en" {...empty} />)
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1)
    expect(container.querySelectorAll("ul, ol").length).toBe(0)
  })

  it("passes the heading and className through, and lets copy props replace the defaults", () => {
    const { container } = render(<Block locale="en" heading="Custom heading" className="custom" />)
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Custom heading")
    expect(container.querySelector("section")?.className).toContain("custom")
  })
})

describe("Feature Checklist Columns", () => {
  it("renders six checked items in each column, and the button reports presses without a link", () => {
    let pressed = 0
    render(<FeaturesFeatureChecklistColumns onCompare={() => pressed++} />)
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3)
    expect(document.querySelectorAll("li")).toHaveLength(18)
    screen.getByRole("button", { name: "Compare plans" }).click()
    expect(pressed).toBe(1)
  })

  it("renders the button as a link when it has a href", () => {
    render(<FeaturesFeatureChecklistColumns compareHref="/pricing" />)
    expect(screen.getByRole("link", { name: "Compare plans" }).getAttribute("href")).toBe("/pricing")
  })
})

describe("Numbered Feature Rows and Colour Block Cards", () => {
  it("paint with the inverse tokens, as their registry entries say", () => {
    const { container } = render(<FeaturesNumberedFeatureRows />)
    expect(container.querySelector("section")?.className).toContain("bg-background-inverse")
    const cards = render(<FeaturesColourBlockCards />)
    expect(cards.container.querySelectorAll("li")[3]!.className).toContain("bg-primary")
  })
})

describe("Stat Feature Band", () => {
  it("keeps a figure in order inside Arabic text by isolating it left to right", () => {
    const { container } = render(<FeaturesStatFeatureBand locale="ar" />)
    expect(container.querySelectorAll("bdi[dir='ltr']").length).toBeGreaterThanOrEqual(4)
  })
})
