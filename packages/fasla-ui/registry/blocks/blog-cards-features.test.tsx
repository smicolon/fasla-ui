import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { BlogCardsSplitFeature, blogCardsSplitFeatureCopy } from "./blog-cards-split-feature"
import { BlogCardsLeadRankedPicks, blogCardsLeadRankedPicksCopy } from "./blog-cards-lead-ranked-picks"
import { BlogCardsDarkEditorialFeature, blogCardsDarkEditorialFeatureCopy } from "./blog-cards-dark-editorial-feature"
import { BlogCardsMagazineCoverStory, blogCardsMagazineCoverStoryCopy } from "./blog-cards-magazine-cover-story"
import { BlogCardsPullQuoteFeature, blogCardsPullQuoteFeatureCopy } from "./blog-cards-pull-quote-feature"

// What these tests can and cannot prove: jsdom has no layout, so the Figma
// sizes, the container-query layouts, the order of the columns in each
// direction and the hover motion were measured in a browser. These assert the
// contract around them: the copy, the links and their names, the tokens, the
// empty state, and the Arabic rules.

type Block = React.ComponentType<{ locale?: "en" | "ar" } & Record<string, unknown>>
const FEATURES: { name: string; Block: Block; copy: { en: object; ar: object }; empty: Record<string, unknown> }[] = [
  { name: "Split Feature", Block: BlogCardsSplitFeature as Block, copy: blogCardsSplitFeatureCopy, empty: { post: null } },
  { name: "Lead + Ranked Picks", Block: BlogCardsLeadRankedPicks as Block, copy: blogCardsLeadRankedPicksCopy, empty: { lead: null, picks: [] } },
  { name: "Dark Editorial Feature", Block: BlogCardsDarkEditorialFeature as Block, copy: blogCardsDarkEditorialFeatureCopy, empty: { post: null, more: [] } },
  { name: "Magazine Cover Story", Block: BlogCardsMagazineCoverStory as Block, copy: blogCardsMagazineCoverStoryCopy, empty: { masthead: null, story: null, briefs: [] } },
  { name: "Pull-Quote Feature", Block: BlogCardsPullQuoteFeature as Block, copy: blogCardsPullQuoteFeatureCopy, empty: { panel: null, related: [] } },
]

const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : []

describe.each(FEATURES)("$name", ({ Block, copy, empty }) => {
  it.each(["en", "ar"] as const)("is named by a heading and draws no dot glyphs in %s", (locale) => {
    const { container } = render(<Block locale={locale} />)
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(0)
    expect(container.textContent).not.toContain("·")
  })

  it("shows its empty line, and no links, when it has nothing to show", () => {
    const { container } = render(<Block locale="en" {...empty} />)
    expect(container.querySelectorAll("a").length).toBe(0)
    expect(screen.getAllByText("No articles yet.", { exact: false }).length).toBeGreaterThan(0)
  })

  it("keeps Arabic free of em dashes and middle dots", () => {
    for (const text of strings(copy.ar)) expect(text, text).not.toMatch(/[—·]/)
  })
})

describe("Split Feature", () => {
  it("has one button link, an arrow mirrored in Arabic, and a cover link that is out of the tab order", () => {
    const { container } = render(<BlogCardsSplitFeature locale="ar" />)
    const links = Array.from(container.querySelectorAll("a"))
    expect(links).toHaveLength(2)
    const cover = links.find((link) => link.getAttribute("aria-hidden") === "true")
    expect(cover?.getAttribute("tabindex")).toBe("-1")
    const button = links.find((link) => link !== cover)
    expect(button?.textContent).toBe(blogCardsSplitFeatureCopy.ar.post?.actionLabel)
    const arrow = button?.querySelector("svg.lucide-arrow-right")
    expect(arrow?.getAttribute("aria-hidden")).toBe("true")
    expect(arrow?.getAttribute("class")).toContain("rtl:-scale-x-100")
  })

  it("shows a photo when one is passed and a placeholder when none is", () => {
    const { container, rerender } = render(<BlogCardsSplitFeature />)
    expect(container.querySelectorAll("img").length).toBe(0)
    const post = { ...blogCardsSplitFeatureCopy.en.post!, image: { src: "/a.webp", alt: "A photo" } }
    rerender(<BlogCardsSplitFeature post={post} />)
    expect(screen.getAllByAltText("A photo")).toHaveLength(1)
  })
})

describe("Lead + Ranked Picks", () => {
  it("makes the lead and each pick one link named by its heading", () => {
    const { container } = render(<BlogCardsLeadRankedPicks />)
    const links = container.querySelectorAll("a[aria-labelledby]")
    expect(links).toHaveLength(6)
    links.forEach((link) => {
      expect(link.querySelectorAll("a, button").length).toBe(0)
      const title = container.querySelector(`[id="${link.getAttribute("aria-labelledby")}"]`)
      expect(link.contains(title)).toBe(true)
    })
    expect(container.querySelectorAll("a h2")).toHaveLength(1)
    expect(container.querySelectorAll("a h3")).toHaveLength(5)
  })

  it("numbers the picks 01 to 05, with Latin digits in Arabic too, hidden from assistive technology", () => {
    for (const locale of ["en", "ar"] as const) {
      const { container, unmount } = render(<BlogCardsLeadRankedPicks locale={locale} />)
      const ranks = Array.from(container.querySelectorAll("ol span[aria-hidden='true']")).filter((el) => /^\d\d$/.test(el.textContent ?? ""))
      expect(ranks.map((el) => el.textContent)).toEqual(["01", "02", "03", "04", "05"])
      unmount()
    }
  })

  it("lays its picks in the page's direction, with no logical override on the rank", () => {
    const { container } = render(<BlogCardsLeadRankedPicks locale="ar" />)
    const rank = container.querySelector("ol span[aria-hidden='true']")
    expect(rank?.getAttribute("class")).not.toMatch(/rtl:|ltr:|text-left|text-right/)
  })
})

describe("Dark Editorial Feature", () => {
  it("is painted with the inverse tokens alone", () => {
    const { container } = render(<BlogCardsDarkEditorialFeature />)
    const html = container.innerHTML
    expect(container.querySelector("section")?.getAttribute("class")).toContain("bg-background-inverse")
    expect(html).toContain("text-foreground-inverse")
    expect(html).toContain("text-muted-foreground-inverse")
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(|oklch\(/)
    expect(html).not.toMatch(/\b(?:bg|text|border|ring|outline)-(?:white|black)\b/)
  })

  it("links the title and the button to the article, and each more-reads row to its own", () => {
    const { container } = render(<BlogCardsDarkEditorialFeature />)
    expect(container.querySelectorAll("h2 a")).toHaveLength(1)
    expect(container.querySelectorAll("a[aria-labelledby]")).toHaveLength(3)
    expect(container.querySelectorAll("a")).toHaveLength(5)
  })

  it("truncates a long author name instead of letting it overflow", () => {
    const post = { ...blogCardsDarkEditorialFeatureCopy.en.post!, author: "A very long author name that goes on and on and on and on" }
    const { container } = render(<BlogCardsDarkEditorialFeature post={post} />)
    const name = Array.from(container.querySelectorAll("span")).find((el) => el.textContent === post.author && el.className.includes("font-medium"))
    expect(name?.className).toContain("truncate")
    expect(name?.className).toContain("min-w-0")
  })

  it("draws the title underline from the start edge in each direction", () => {
    const { container } = render(<BlogCardsDarkEditorialFeature />)
    const className = container.querySelector("h2 a")?.getAttribute("class") ?? ""
    expect(className).toContain("ltr:bg-[position:0_100%]")
    expect(className).toContain("rtl:bg-[position:100%_100%]")
    expect(className).toContain("motion-reduce:transition-none")
  })
})

describe("Magazine Cover Story", () => {
  it("uses no library components, no icons and no buttons", () => {
    const { container } = render(<BlogCardsMagazineCoverStory />)
    expect(container.querySelectorAll("svg, button, [data-slot]").length).toBe(0)
    expect(container.querySelectorAll("a[aria-labelledby]")).toHaveLength(5)
  })

  it("keeps the briefs' kickers at full strength, as the static frame draws them", () => {
    const { container } = render(<BlogCardsMagazineCoverStory />)
    const kickers = Array.from(container.querySelectorAll("a[aria-labelledby] span.text-info"))
    expect(kickers).toHaveLength(4)
    kickers.forEach((kicker) => expect(kicker.getAttribute("class")).not.toMatch(/opacity/))
  })

  it("puts the rule between the stories on the briefs' start edge, not its left", () => {
    const { container } = render(<BlogCardsMagazineCoverStory locale="ar" />)
    const briefs = container.querySelector("h2 + ul")?.parentElement
    const className = briefs?.getAttribute("class") ?? ""
    expect(className).toContain("border-s")
    expect(className).toContain("ps-8")
    expect(className).not.toMatch(/border-l|border-r|pl-|pr-/)
  })
})

describe("Pull-Quote Feature", () => {
  it("sets the quote in a figure, with the attribution as its caption", () => {
    const { container } = render(<BlogCardsPullQuoteFeature />)
    const figure = container.querySelector("figure")
    expect(figure?.querySelector("blockquote p")?.textContent).toBe(blogCardsPullQuoteFeatureCopy.en.panel?.quote)
    expect(figure?.querySelector("figcaption")?.textContent).toContain("Karim Nasser")
    expect(container.querySelectorAll("a[aria-labelledby]")).toHaveLength(3)
  })

  it("keeps the quote mark, the quote and the attribution centred in both directions", () => {
    for (const locale of ["en", "ar"] as const) {
      const { container, unmount } = render(<BlogCardsPullQuoteFeature locale={locale} />)
      const figure = container.querySelector("figure")
      expect(figure?.getAttribute("class")).toContain("items-center")
      expect(figure?.querySelector("blockquote p")?.getAttribute("class")).toContain("text-center")
      expect(figure?.querySelector("figcaption")?.getAttribute("class")).toContain("items-center")
      expect(figure?.querySelector("svg.lucide-quote")?.getAttribute("class")).not.toMatch(/rtl:|ltr:/)
      unmount()
    }
  })

  it("gives the button an arrow mirrored in Arabic", () => {
    const { container } = render(<BlogCardsPullQuoteFeature locale="ar" />)
    const arrow = container.querySelector("figure a svg.lucide-arrow-right")
    expect(arrow?.getAttribute("class")).toContain("rtl:-scale-x-100")
  })
})
