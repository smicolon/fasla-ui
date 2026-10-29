import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { BlogCardsClassic3UpGrid, blogCardsClassic3UpGridCopy } from "./blog-cards-classic-3-up-grid"
import { BlogCardsFeaturedTwoUp, blogCardsFeaturedTwoUpCopy } from "./blog-cards-featured-two-up"
import { BlogCardsCompact4UpThumbGrid, blogCardsCompact4UpThumbGridCopy } from "./blog-cards-compact-4-up-thumb-grid"
import { BlogCardsBentoEditorialGrid, blogCardsBentoEditorialGridCopy } from "./blog-cards-bento-editorial-grid"
import { BlogCardsOverlayPhotoTrio, blogCardsOverlayPhotoTrioCopy } from "./blog-cards-overlay-photo-trio"
import { BlogCardsJournalBento, blogCardsJournalBentoCopy } from "./blog-cards-journal-bento"

// What these tests can and cannot prove: jsdom has no layout, so the Figma
// sizes, the container-query layouts and the hover motion were measured in a
// browser. These assert the contract around them: the copy, the semantics of
// a card (one link, the title's), the empty state, and the Arabic rules.

type Block = React.ComponentType<{ locale?: "en" | "ar" } & Record<string, unknown>>
const GRIDS: { name: string; Block: Block; copy: { en: object; ar: object }; links: number; empty: Record<string, unknown> }[] = [
  { name: "Classic 3-Up Grid", Block: BlogCardsClassic3UpGrid as Block, copy: blogCardsClassic3UpGridCopy, links: 4, empty: { posts: [] } },
  { name: "Featured + Two-Up", Block: BlogCardsFeaturedTwoUp as Block, copy: blogCardsFeaturedTwoUpCopy, links: 3, empty: { posts: [] } },
  { name: "Compact 4-Up Thumb Grid", Block: BlogCardsCompact4UpThumbGrid as Block, copy: blogCardsCompact4UpThumbGridCopy, links: 5, empty: { posts: [] } },
  {
    name: "Bento Editorial Grid",
    Block: BlogCardsBentoEditorialGrid as Block,
    copy: blogCardsBentoEditorialGridCopy,
    links: 4,
    empty: {
      photoTiles: [],
      quote: { text: "", author: "", role: "" },
      post: { category: "", title: "", summary: "", href: "#" },
      stat: { label: "", value: "", note: "" },
      subscribe: { title: "", note: "", label: "", href: "#" },
    },
  },
  { name: "Overlay Photo Trio", Block: BlogCardsOverlayPhotoTrio as Block, copy: blogCardsOverlayPhotoTrioCopy, links: 4, empty: { posts: [] } },
  { name: "Journal Bento", Block: BlogCardsJournalBento as Block, copy: blogCardsJournalBentoCopy, links: 6, empty: { features: [], stories: [] } },
]

const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : []

describe.each(GRIDS)("$name", ({ Block, copy, links, empty }) => {
  it.each(["en", "ar"] as const)("renders its heading and one link per article in %s", (locale) => {
    const { container } = render(<Block locale={locale} />)
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy()
    // A card is one link, named by its title, and holds no link of its own inside: the header button
    // is the one extra link where there is one.
    const cards = container.querySelectorAll("li > a, a[aria-labelledby]")
    expect(cards.length).toBeGreaterThan(0)
    cards.forEach((card) => {
      expect(card.querySelectorAll("a").length).toBe(0)
      const name = card.getAttribute("aria-labelledby")
      expect(name && container.querySelector(`[id="${name}"]`)?.tagName).toBe("H3")
    })
    expect(container.querySelectorAll("a").length).toBeLessThanOrEqual(links)
  })

  it("shows its empty line, and no cards, when it has nothing to show", () => {
    const { container } = render(<Block locale="en" {...empty} />)
    expect(container.querySelectorAll("a[aria-labelledby]").length).toBe(0)
    expect(screen.getByText("No articles yet.", { exact: false })).toBeTruthy()
  })

  it("keeps Arabic free of em dashes and middle dots", () => {
    for (const text of strings(copy.ar)) {
      expect(text, text).not.toMatch(/[—·]/)
    }
  })
})

describe("the covers", () => {
  it("show a photo when one is passed and a placeholder when none is", () => {
    const { container, rerender } = render(<BlogCardsClassic3UpGrid />)
    expect(container.querySelectorAll("img").length).toBe(0)
    const posts = blogCardsClassic3UpGridCopy.en.posts.map((post) => ({ ...post, image: { src: "/a.webp", alt: "A photo" } }))
    rerender(<BlogCardsClassic3UpGrid posts={posts} />)
    expect(container.querySelectorAll("img").length).toBe(3)
    expect(screen.getAllByAltText("A photo")).toHaveLength(3)
  })

  it("hides the author avatars from assistive technology, since the name sits beside them", () => {
    const { container } = render(<BlogCardsClassic3UpGrid />)
    container.querySelectorAll('[data-slot="avatar"]').forEach((avatar) => expect(avatar.getAttribute("aria-hidden")).toBe("true"))
  })
})

describe("Compact 4-Up Thumb Grid header", () => {
  it.each(["en", "ar"] as const)("keeps the heading and the Browse all button on one row, 32px above the rule, in %s", (locale) => {
    const { container } = render(<BlogCardsCompact4UpThumbGrid locale={locale} />)
    const header = container.querySelector("h2")?.parentElement
    const button = header?.querySelector("a")
    expect(header?.getAttribute("class")).toMatch(/\bflex\b/)
    expect(header?.getAttribute("class")).not.toContain("flex-col")
    expect(header?.getAttribute("class")).toContain("justify-between")
    expect(header?.parentElement?.getAttribute("class")).toContain("gap-8")
    // xs (26px) on Mobile, sm (32px) from Tablet up
    expect(button?.getAttribute("class")).toContain("h-[1.625rem]")
    expect(button?.getAttribute("class")).toContain("[@container(min-width:40rem)]:h-8")
    expect(button?.getAttribute("class")).not.toContain("w-full")
  })
})
