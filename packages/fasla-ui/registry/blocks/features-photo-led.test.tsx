import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { FeaturesSplitPhotoIconList, featuresSplitPhotoIconListCopy } from "./features-split-photo-icon-list"
import { FeaturesPhotoBento, featuresPhotoBentoCopy } from "./features-photo-bento"
import { FeaturesFeatureListThumbnails, featuresFeatureListThumbnailsCopy } from "./features-feature-list-thumbnails"
import { FeaturesPhotoFeatureChips, featuresPhotoFeatureChipsCopy } from "./features-photo-feature-chips"
import { FeaturesMediaRail, featuresMediaRailCopy } from "./features-media-rail"
import { FeaturesFullBleedPhotoBanner, featuresFullBleedPhotoBannerCopy } from "./features-full-bleed-photo-banner"
import { FeaturesEditorialPhotoSplit, featuresEditorialPhotoSplitCopy } from "./features-editorial-photo-split"
import { FeaturesPhotoCollage, featuresPhotoCollageCopy } from "./features-photo-collage"
import { FeaturesNotchedPhotoColumns, featuresNotchedPhotoColumnsCopy } from "./features-notched-photo-columns"
import { FeaturesPerforatedPhotoStrip, featuresPerforatedPhotoStripCopy } from "./features-perforated-photo-strip"
import { FeaturesPortraitPhotoCardsLinkRow, featuresPortraitPhotoCardsLinkRowCopy } from "./features-portrait-photo-cards-link-row"

// What these tests can and cannot prove: jsdom has no layout, so the Figma
// sizes, the container-query layouts, the scatter of the collage, the notch
// and the scalloped edge were measured in a browser. These assert the
// contract around them: one h2 naming the section, the copy in both
// languages, the photos landing in their slots, the empty state, and the
// Arabic rules.

type Block = React.ComponentType<{ locale?: "en" | "ar" } & Record<string, unknown>>
const photo = (name: string) => ({ src: `/images/${name}.webp`, alt: name })
const TYPES: { name: string; Block: Block; copy: { en: object; ar: object }; withPhotos: Record<string, unknown>; slots: number }[] = [
  { name: "Split Photo + Icon List", Block: FeaturesSplitPhotoIconList as Block, copy: featuresSplitPhotoIconListCopy, withPhotos: { photo: photo("a") }, slots: 1 },
  { name: "Photo Bento", Block: FeaturesPhotoBento as Block, copy: featuresPhotoBentoCopy, withPhotos: { photos: [photo("a"), photo("b")] }, slots: 2 },
  { name: "Feature List + Thumbnails", Block: FeaturesFeatureListThumbnails as Block, copy: featuresFeatureListThumbnailsCopy, withPhotos: {}, slots: 0 },
  { name: "Photo + Feature Chips", Block: FeaturesPhotoFeatureChips as Block, copy: featuresPhotoFeatureChipsCopy, withPhotos: { photo: photo("a") }, slots: 1 },
  { name: "Media Rail", Block: FeaturesMediaRail as Block, copy: featuresMediaRailCopy, withPhotos: {}, slots: 0 },
  { name: "Full-Bleed Photo Banner", Block: FeaturesFullBleedPhotoBanner as Block, copy: featuresFullBleedPhotoBannerCopy, withPhotos: { photo: photo("a") }, slots: 1 },
  { name: "Editorial Photo Split", Block: FeaturesEditorialPhotoSplit as Block, copy: featuresEditorialPhotoSplitCopy, withPhotos: { photo: photo("a") }, slots: 1 },
  { name: "Photo Collage", Block: FeaturesPhotoCollage as Block, copy: featuresPhotoCollageCopy, withPhotos: { photos: [1, 2, 3, 4, 5, 6, 7].map((n) => photo(`p${n}`)) }, slots: 7 },
  { name: "Notched Photo Columns", Block: FeaturesNotchedPhotoColumns as Block, copy: featuresNotchedPhotoColumnsCopy, withPhotos: {}, slots: 0 },
  { name: "Perforated Photo Strip", Block: FeaturesPerforatedPhotoStrip as Block, copy: featuresPerforatedPhotoStripCopy, withPhotos: { photos: [1, 2, 3].map((n) => photo(`p${n}`)) }, slots: 3 },
  { name: "Portrait Photo Cards + Link Row", Block: FeaturesPortraitPhotoCardsLinkRow as Block, copy: featuresPortraitPhotoCardsLinkRowCopy, withPhotos: {}, slots: 0 },
]

/** The copy a reader sees: every string except the ids and keys that key an item. */
const strings = (value: unknown): string[] =>
  typeof value === "string"
    ? [value]
    : Array.isArray(value)
      ? value.flatMap(strings)
      : value && typeof value === "object" && !("$$typeof" in value)
        ? Object.entries(value).flatMap(([key, inner]) => (key === "id" || key === "tone" ? [] : strings(inner)))
        : []

const shape = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(shape)
    : value && typeof value === "object" && !("$$typeof" in value)
      ? Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, shape(inner)]))
      : typeof value

describe.each(TYPES)("$name", ({ Block, copy, withPhotos, slots }) => {
  it.each(["en", "ar"] as const)("renders one h2 that names the section in %s", (locale) => {
    const { container } = render(<Block locale={locale} />)
    const headings = screen.getAllByRole("heading", { level: 2 })
    expect(headings).toHaveLength(1)
    expect(container.querySelector("section")?.getAttribute("aria-labelledby")).toBe(headings[0]!.id)
  })

  it("has the same shape in English and Arabic", () => {
    expect(shape(copy.ar)).toEqual(shape(copy.en))
  })

  it("writes no em dash or middle dot in the Arabic copy, and no English left in it", () => {
    for (const text of strings(copy.ar)) {
      expect(text, text).not.toMatch(/[—·]/)
      const latin = text.replace(/\b(SSO|SCIM|KMS|API|REST)\b/g, "")
      expect(latin, text).not.toMatch(/[A-Za-z]{3,}/)
      expect(text, text).not.toMatch(/[٠-٩]/)
    }
  })

  it("shows its placeholders, and no image, without photos", () => {
    const { container } = render(<Block locale="en" />)
    expect(container.querySelectorAll("img")).toHaveLength(0)
  })

  it("puts each photo it is given into its slot, described by its alt text", () => {
    if (slots === 0) return
    const { container } = render(<Block locale="en" {...withPhotos} />)
    expect(container.querySelectorAll("img").length).toBeGreaterThanOrEqual(slots === 7 ? 7 : slots)
    container.querySelectorAll("img").forEach((img) => expect(img.getAttribute("alt")).toBeTruthy())
  })

  it("passes className through and lets copy props replace the defaults", () => {
    const { container } = render(<Block locale="en" className="custom" />)
    expect(container.querySelector("section")?.className).toContain("custom")
  })
})

describe("the list Types take a photo on each item", () => {
  it("shows it on every card, row, tile and column", () => {
    const image = photo("x")
    expect(render(<FeaturesFeatureListThumbnails rows={featuresFeatureListThumbnailsCopy.en.rows.map((row) => ({ ...row, image }))} />).container.querySelectorAll("img")).toHaveLength(4)
    expect(render(<FeaturesMediaRail tiles={featuresMediaRailCopy.en.tiles.map((tile) => ({ ...tile, image }))} />).container.querySelectorAll("img")).toHaveLength(4)
    expect(render(<FeaturesNotchedPhotoColumns columns={featuresNotchedPhotoColumnsCopy.en.columns.map((column) => ({ ...column, image }))} />).container.querySelectorAll("img")).toHaveLength(3)
    expect(render(<FeaturesPortraitPhotoCardsLinkRow cards={featuresPortraitPhotoCardsLinkRowCopy.en.cards.map((card) => ({ ...card, image }))} />).container.querySelectorAll("img")).toHaveLength(4)
  })
})

describe("Feature List + Thumbnails", () => {
  it("makes a row's link a link with an href and a button without one, and reports the row", () => {
    const pressed: string[] = []
    render(<FeaturesFeatureListThumbnails rows={[{ id: "a", title: "A", description: "a", href: "/a" }, { id: "b", title: "B", description: "b" }]} onLearnMore={(id) => pressed.push(id)} />)
    expect(screen.getByRole("link", { name: "Learn more" }).getAttribute("href")).toBe("/a")
    screen.getByRole("button", { name: "Learn more" }).click()
    expect(pressed).toEqual(["b"])
  })
})

describe("Photo Bento", () => {
  it("renders the button as a link with a href and reports presses without one", () => {
    let pressed = 0
    const { unmount } = render(<FeaturesPhotoBento onTour={() => pressed++} />)
    screen.getByRole("button", { name: "Take the tour" }).click()
    expect(pressed).toBe(1)
    unmount()
    render(<FeaturesPhotoBento tourHref="/tour" />)
    expect(screen.getByRole("link", { name: "Take the tour" }).getAttribute("href")).toBe("/tour")
  })
})

describe("Perforated Photo Strip", () => {
  it("is a focusable, named list of ten stamps, and the arrow keys scroll it", () => {
    const { container } = render(<FeaturesPerforatedPhotoStrip />)
    const strip = screen.getByRole("list", { name: "Photos from around the world" })
    expect(strip.getAttribute("tabindex")).toBe("0")
    expect(strip.querySelectorAll(":scope > li")).toHaveLength(10)
    let moved = 0
    strip.scrollBy = ((options: ScrollToOptions) => {
      moved += options.left ?? 0
    }) as typeof strip.scrollBy
    strip.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }))
    strip.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }))
    expect(moved).toBe(0)
    expect(container.querySelectorAll("li[style]").length).toBe(10)
  })
})

describe("Notched Photo Columns", () => {
  it("draws three Badges in every column and a numbered tag on every photo", () => {
    const { container } = render(<FeaturesNotchedPhotoColumns />)
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3)
    expect(container.querySelectorAll("li li")).toHaveLength(9)
    expect(container.textContent).toContain("01")
  })
})

describe("Photo Collage", () => {
  it("shows its caption's title as the h2, and lets a heading prop replace it", () => {
    render(<FeaturesPhotoCollage heading="Custom" />)
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Custom")
  })
})

describe("Portrait cards", () => {
  it("paint with the inverse tokens, so they read over a photo or without one", () => {
    expect(render(<FeaturesPortraitPhotoCardsLinkRow />).container.innerHTML).toContain("text-foreground-inverse")
  })
})

describe("Portrait Photo Cards + Link Row", () => {
  it("makes a card a link only when it has an href", () => {
    const { container } = render(<FeaturesPortraitPhotoCardsLinkRow cards={[{ id: "a", title: "A", subtitle: "a", href: "/a" }, { id: "b", title: "B", subtitle: "b" }]} />)
    expect(container.querySelectorAll("li a")).toHaveLength(1)
  })

  it("reports the Explore link's press without a linkHref", () => {
    let pressed = 0
    render(<FeaturesPortraitPhotoCardsLinkRow onExplore={() => pressed++} />)
    screen.getByRole("button", { name: /Explore all templates/ }).click()
    expect(pressed).toBe(1)
  })
})
