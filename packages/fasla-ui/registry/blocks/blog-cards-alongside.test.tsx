import { describe, expect, it, vi } from "vitest"
import { createEvent, fireEvent, render, screen } from "@testing-library/react"
import { BlogCardsNewsletterLatest, blogCardsNewsletterLatestCopy } from "./blog-cards-newsletter-latest"
import { BlogCardsAuthorSpotlight, blogCardsAuthorSpotlightCopy } from "./blog-cards-author-spotlight"
import { BlogCardsRelatedPostsStrip, blogCardsRelatedPostsStripCopy } from "./blog-cards-related-posts-strip"

// What these tests can and cannot prove: jsdom has no layout, so the Figma
// sizes, the container-query layouts, the order of the columns in each
// direction and the hover motion were measured in a browser. These assert the
// contract around them: the copy, the links and their names, the form, the
// avatars, the empty state, and the Arabic rules.

type Block = React.ComponentType<{ locale?: "en" | "ar" } & Record<string, unknown>>
const ALONGSIDE: { name: string; Block: Block; copy: { en: object; ar: object }; links: number; empty: Record<string, unknown> }[] = [
  { name: "Newsletter + Latest", Block: BlogCardsNewsletterLatest as Block, copy: blogCardsNewsletterLatestCopy, links: 4, empty: { latest: [] } },
  { name: "Author Spotlight", Block: BlogCardsAuthorSpotlight as Block, copy: blogCardsAuthorSpotlightCopy, links: 3, empty: { author: null, posts: [] } },
  { name: "Related Posts Strip", Block: BlogCardsRelatedPostsStrip as Block, copy: blogCardsRelatedPostsStripCopy, links: 3, empty: { posts: [] } },
]

/** The letters an Avatar draws: its hidden initials, not the name it keeps for assistive technology. */
const initialsOf = (avatar: Element | null | undefined) => avatar?.querySelector("span[aria-hidden='true'].select-none")?.textContent

const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : []

describe.each(ALONGSIDE)("$name", ({ Block, copy, links, empty }) => {
  it.each(["en", "ar"] as const)("makes every row or card one link named by its title in %s", (locale) => {
    const { container } = render(<Block locale={locale} />)
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(0)
    const anchors = container.querySelectorAll("a[aria-labelledby]")
    expect(anchors).toHaveLength(links)
    anchors.forEach((link) => {
      expect(link.querySelectorAll("a, button").length).toBe(0)
      const title = container.querySelector(`[id="${link.getAttribute("aria-labelledby")}"]`)
      expect(title?.tagName).toBe("H3")
      expect(link.contains(title)).toBe(true)
    })
    expect(container.textContent).not.toContain("·")
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

describe("Newsletter + Latest", () => {
  it("has an email field and a submit button, and no error or success state", () => {
    const { container } = render(<BlogCardsNewsletterLatest />)
    const input = screen.getByRole("textbox", { name: "you@company.com" })
    expect(input.getAttribute("type")).toBe("email")
    expect(screen.getByRole("button", { name: "Subscribe" }).getAttribute("type")).toBe("submit")
    expect(container.querySelector("[role='alert'], [role='status'], [aria-invalid='true']")).toBeNull()
  })

  it("submits nowhere, and hands the event to onSubmit", () => {
    const onSubmit = vi.fn()
    const { container } = render(<BlogCardsNewsletterLatest onSubmit={onSubmit} />)
    const form = container.querySelector("form")!
    const event = createEvent.submit(form)
    fireEvent(form, event)
    expect(event.defaultPrevented).toBe(true)
    expect(onSubmit).toHaveBeenCalledTimes(1)
    const quiet = createEvent.submit(form)
    const { container: other } = render(<BlogCardsNewsletterLatest />)
    fireEvent(other.querySelector("form")!, quiet)
    expect(quiet.defaultPrevented).toBe(true)
  })

  it("is painted with the inverse tokens on the panel", () => {
    const { container } = render(<BlogCardsNewsletterLatest />)
    const html = container.innerHTML
    expect(html).toContain("bg-background-inverse")
    expect(html).toContain("text-foreground-inverse")
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(|oklch\(/)
  })
})

describe("Author Spotlight", () => {
  it("fills the portrait slot with the Avatar's initials, and with the photo once one is passed", () => {
    const { container, rerender } = render(<BlogCardsAuthorSpotlight />)
    expect(container.querySelectorAll("img").length).toBe(0)
    expect(initialsOf(container.querySelector("[data-slot='avatar']"))).toBe("NA")
    const author = { ...blogCardsAuthorSpotlightCopy.en.author!, image: { src: "/noor.webp", alt: "Noor" } }
    rerender(<BlogCardsAuthorSpotlight author={author} />)
    expect(container.querySelector("[data-slot='avatar']")).toBeTruthy()
  })

  it("draws the social marks from Social Icons, named by their links", () => {
    const { container } = render(<BlogCardsAuthorSpotlight />)
    for (const label of ["LinkedIn", "X", "GitHub"]) expect(screen.getByRole("link", { name: label })).toBeTruthy()
    const marks = container.querySelectorAll("svg[data-platform]")
    expect(Array.from(marks).map((svg) => svg.getAttribute("data-platform"))).toEqual(["linkedin", "x", "github"])
    marks.forEach((svg) => expect(svg.getAttribute("aria-hidden")).toBe("true"))
  })

  it("lists three figures, each a value over its label", () => {
    const { container } = render(<BlogCardsAuthorSpotlight />)
    expect(container.querySelectorAll("dl > div")).toHaveLength(3)
    expect(Array.from(container.querySelectorAll("dd")).map((el) => el.textContent)).toEqual(["9", "3", "2026"])
  })

  it("mirrors the all-posts arrow in Arabic by the class", () => {
    const { container } = render(<BlogCardsAuthorSpotlight locale="ar" />)
    expect(container.querySelector("a svg.lucide-arrow-right")?.getAttribute("class")).toContain("rtl:-scale-x-100")
  })
})

describe("Related Posts Strip", () => {
  it("shows two initials in English and one letter in Arabic on the 20px avatars", () => {
    const { container, unmount } = render(<BlogCardsRelatedPostsStrip locale="en" />)
    const en = Array.from(container.querySelectorAll("[data-slot='avatar']")).map(initialsOf)
    expect(en).toEqual(["YF", "YF", "YF"])
    unmount()
    const { container: ar } = render(<BlogCardsRelatedPostsStrip locale="ar" />)
    const letters = Array.from(ar.querySelectorAll("[data-slot='avatar']")).map(initialsOf)
    expect(letters).toEqual(["ي", "ي", "ي"])
  })

  it("points the back arrow with the page's direction and slides it toward the start", () => {
    const { container } = render(<BlogCardsRelatedPostsStrip locale="ar" />)
    const arrow = container.querySelector("a svg.lucide-arrow-left")
    expect(arrow?.getAttribute("aria-hidden")).toBe("true")
    const className = arrow?.getAttribute("class") ?? ""
    expect(className).toContain("rtl:-scale-x-100")
    expect(className).toContain("ltr:-translate-x-1")
    expect(className).toContain("rtl:translate-x-1")
    expect(className).toContain("motion-reduce:transition-none")
  })

  it("lets the odd last card take the full width on Tablet only", () => {
    const { container } = render(<BlogCardsRelatedPostsStrip />)
    const items = container.querySelectorAll("ul > li")
    expect(items[2]?.getAttribute("class")).toContain("col-span-2")
    expect(items[0]?.getAttribute("class")).not.toContain("col-span-2")
  })
})
