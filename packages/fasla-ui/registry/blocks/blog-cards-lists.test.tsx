import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { BlogCardsLeftThumbRowCards, blogCardsLeftThumbRowCardsCopy } from "./blog-cards-left-thumb-row-cards"
import { BlogCardsHairlineTextIndex, blogCardsHairlineTextIndexCopy } from "./blog-cards-hairline-text-index"
import { BlogCardsNumberedReadingList, blogCardsNumberedReadingListCopy } from "./blog-cards-numbered-reading-list"
import { BlogCardsLatestPopularSplit, blogCardsLatestPopularSplitCopy } from "./blog-cards-latest-popular-split"

// What these tests can and cannot prove: jsdom has no layout, so the Figma
// sizes, the container-query layouts, the per-breakpoint thumbnails and the
// hover motion were measured in a browser. These assert the contract around
// them: the copy, a row being one link named by its title with its arrow
// drawn and hidden, the empty state, and the Arabic rules.

type Block = React.ComponentType<{ locale?: "en" | "ar" } & Record<string, unknown>>
const LISTS: { name: string; Block: Block; copy: { en: object; ar: object }; rows: number; empty: Record<string, unknown> }[] = [
  { name: "Left-Thumb Row Cards", Block: BlogCardsLeftThumbRowCards as Block, copy: blogCardsLeftThumbRowCardsCopy, rows: 4, empty: { posts: [] } },
  { name: "Hairline Text Index", Block: BlogCardsHairlineTextIndex as Block, copy: blogCardsHairlineTextIndexCopy, rows: 7, empty: { posts: [] } },
  { name: "Numbered Reading List", Block: BlogCardsNumberedReadingList as Block, copy: blogCardsNumberedReadingListCopy, rows: 5, empty: { posts: [] } },
  { name: "Latest / Popular Split", Block: BlogCardsLatestPopularSplit as Block, copy: blogCardsLatestPopularSplitCopy, rows: 10, empty: { latest: [], popular: [] } },
]

const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : []

describe.each(LISTS)("$name", ({ Block, copy, rows, empty }) => {
  it.each(["en", "ar"] as const)("renders every row as one link named by its title in %s", (locale) => {
    const { container } = render(<Block locale={locale} />)
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(0)
    const links = container.querySelectorAll("a[aria-labelledby]")
    expect(links).toHaveLength(rows)
    links.forEach((link) => {
      expect(link.querySelectorAll("a, button").length).toBe(0)
      const title = container.querySelector(`[id="${link.getAttribute("aria-labelledby")}"]`)
      expect(title?.tagName).toBe("H3")
      expect(link.contains(title)).toBe(true)
    })
  })

  it("draws every arrow and rank as decoration, hidden from assistive technology", () => {
    const { container } = render(<Block locale="en" />)
    container.querySelectorAll("a[aria-labelledby] svg").forEach((svg) => {
      expect(svg.closest("[aria-hidden='true']") ?? svg).toBeTruthy()
      expect(svg.getAttribute("aria-hidden") ?? svg.parentElement?.getAttribute("aria-hidden")).toBe("true")
    })
  })

  it("shows its empty line, and no rows, when it has nothing to show", () => {
    const { container } = render(<Block locale="en" {...empty} />)
    expect(container.querySelectorAll("a[aria-labelledby]").length).toBe(0)
    expect(screen.getAllByText("No articles yet.", { exact: false }).length).toBeGreaterThan(0)
  })

  it("keeps Arabic free of em dashes and middle dots", () => {
    for (const text of strings(copy.ar)) expect(text, text).not.toMatch(/[—·]/)
  })
})

describe("the arrows", () => {
  it("is arrow-up-right in Left-Thumb Row Cards and Hairline Text Index, mirrored in Arabic by the class", () => {
    for (const Block of [BlogCardsLeftThumbRowCards, BlogCardsHairlineTextIndex] as Block[]) {
      const { container, unmount } = render(<Block locale="ar" />)
      const arrow = container.querySelector("svg.lucide-arrow-up-right")
      expect(arrow).toBeTruthy()
      expect(arrow?.getAttribute("class")).toContain("rtl:-scale-x-100")
      unmount()
    }
  })

  it("is arrow-right in Numbered Reading List, mirrored in Arabic by the class", () => {
    const { container } = render(<BlogCardsNumberedReadingList locale="ar" />)
    const arrow = container.querySelector("svg.lucide-arrow-right")
    expect(arrow).toBeTruthy()
    expect(arrow?.getAttribute("class")).toContain("rtl:-scale-x-100")
  })
})

describe("the thumbnails", () => {
  it("show a photo when one is passed and a placeholder when none is", () => {
    const { container, rerender } = render(<BlogCardsLeftThumbRowCards />)
    expect(container.querySelectorAll("img").length).toBe(0)
    const posts = blogCardsLeftThumbRowCardsCopy.en.posts.map((post) => ({ ...post, image: { src: "/a.webp", alt: "A photo" } }))
    rerender(<BlogCardsLeftThumbRowCards posts={posts} />)
    expect(screen.getAllByAltText("A photo")).toHaveLength(4)
  })

  it("exist only in the Latest column of Latest / Popular Split", () => {
    const latest = blogCardsLatestPopularSplitCopy.en.latest.map((post) => ({ ...post, image: { src: "/a.webp", alt: "A photo" } }))
    const popular = blogCardsLatestPopularSplitCopy.en.popular.map((post) => ({ ...post, image: { src: "/b.webp", alt: "B photo" } }))
    const { container } = render(<BlogCardsLatestPopularSplit latest={latest} popular={popular} />)
    expect(container.querySelectorAll("img").length).toBe(5)
    expect(screen.queryAllByAltText("B photo")).toHaveLength(0)
  })
})
