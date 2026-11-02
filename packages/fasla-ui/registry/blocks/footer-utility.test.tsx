import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, within } from "@testing-library/react"
import { FooterDashboardSlimBar, footerDashboardSlimBarCopy } from "./footer-dashboard-slim-bar"
import { FooterDocsPage, footerDocsPageCopy } from "./footer-docs-page"
import { FooterMultiRegion, footerMultiRegionCopy } from "./footer-multi-region"
import { FooterProductFamilySwitcher, footerProductFamilySwitcherCopy } from "./footer-product-family-switcher"

/** Whether some class on `cls` has every variant in `spec`, in any order, and the same utility: `a:b:x` matches `b:a:x`. */
function hasVariants(cls: string, spec: string): boolean {
  const split = (token: string) => {
    const out: string[] = []
    let cur = ""
    let depth = 0
    for (const ch of token) {
      if (ch === "[" || ch === "(") depth++
      if (ch === "]" || ch === ")") depth--
      if (ch === ":" && depth === 0) {
        out.push(cur)
        cur = ""
      } else cur += ch
    }
    out.push(cur)
    return out
  }
  const want = split(spec)
  const util = want.pop()
  return cls.split(/\s+/).some((token) => {
    const have = split(token)
    return have.pop() === util && want.every((variant) => have.includes(variant))
  })
}


// What these tests can and cannot prove: jsdom has no layout, no container
// queries and no hover, so the items Figma drops by breakpoint, the card lift,
// the chevron slide and the scroll position were checked in a browser. Here
// `matchMedia` and `scrollIntoView` are stubs, so the tests assert the
// contract: what is on the page, which classes carry the drops and the hover,
// how the vote and the region choice change the DOM, and what reduced motion
// does instead.

const setMotion = (reduced: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: reduced && query.includes("reduce"),
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
}

beforeEach(() => setMotion(false))
afterEach(() => {
  vi.restoreAllMocks()
  // @ts-expect-error the stubs are removed again
  delete window.matchMedia
})

const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : []

const landmarks = (container: HTMLElement) => {
  expect(container.querySelectorAll("footer")).toHaveLength(1)
  expect(screen.getAllByRole("contentinfo")).toHaveLength(1)
  const navs = screen.getAllByRole("navigation")
  navs.forEach((nav) => expect(nav.getAttribute("aria-label") || nav.getAttribute("aria-labelledby")).toBeTruthy())
  return navs
}

const hasClass = (el: Element, text: string) => (el.getAttribute("class") ?? "").includes(text)

describe.each(["en", "ar"] as const)("Dashboard Slim Bar (%s)", (locale) => {
  const copy = footerDashboardSlimBarCopy[locale]

  it("renders one footer landmark with a labelled nav for the release link and one for the help links", () => {
    const { container } = render(<FooterDashboardSlimBar locale={locale} />)
    expect(landmarks(container)).toHaveLength(2)
    expect(screen.getByRole("navigation", { name: copy.releaseLabel })).toBeTruthy()
    expect(screen.getByRole("navigation", { name: copy.helpLinksLabel })).toBeTruthy()
  })

  it("draws the online dot, the status, the version, the changelog, the hint, three links and the help Icon Button", () => {
    const { container } = render(<FooterDashboardSlimBar locale={locale} />)
    expect(screen.getByText(copy.status)).toBeTruthy()
    expect(container.querySelector("span.bg-success .sr-only")?.textContent).toBe(copy.statusLabel)
    expect(screen.getByText(copy.version)).toBeTruthy()
    expect(screen.getByRole("link", { name: copy.changelog.label })).toBeTruthy()
    expect(screen.getByText(copy.searchHint)).toBeTruthy()
    expect(container.querySelector("kbd")?.textContent).toBe("⌘K")
    copy.links.forEach((link) => expect(screen.getByRole("link", { name: link.label })).toBeTruthy())
    const help = screen.getByRole("button", { name: copy.helpLabel })
    expect(hasClass(help, "size-[1.625rem]")).toBe(true)
    expect(container.querySelector("span.bg-success.size-2")).toBeTruthy()
  })

  it("keeps the English wording from Figma", () => {
    if (locale !== "en") return
    expect([copy.status, copy.version, copy.changelog.label, copy.searchHint, ...copy.links.map((l) => l.label)]).toEqual(["System status", "Latest", "Changelog", "to search", "Documentation", "Support", "Send feedback"])
  })

  it("has no em dash or middle dot in the Arabic copy; the facts are separated by a drawn dot", () => {
    if (locale === "ar") strings(copy).forEach((text) => expect(text).not.toMatch(/[—·]/))
    const { container } = render(<FooterDashboardSlimBar locale={locale} />)
    expect(container.textContent).not.toMatch(/[·]/)
    expect(container.querySelectorAll("span[aria-hidden='true'].rounded-full")).toHaveLength(1)
  })

  it("drops items by the block's own width: the hint below Desktop, the links below Tablet, the help button never", () => {
    const { container } = render(<FooterDashboardSlimBar locale={locale} />)
    const hint = container.querySelector("kbd")!.parentElement!
    expect(hasClass(hint, "hidden")).toBe(true)
    expect(hasVariants(hint.getAttribute("class") ?? "", "[@container(min-width:64rem)]:flex")).toBe(true)
    const links = screen.getByRole("navigation", { name: copy.helpLinksLabel })
    expect(hasClass(links, "hidden")).toBe(true)
    expect(hasVariants(links.getAttribute("class") ?? "", "[@container(min-width:40rem)]:flex")).toBe(true)
    const help = screen.getByRole("button", { name: copy.helpLabel })
    expect(help.closest(".hidden")).toBeNull()
    const bar = container.querySelector("footer")!
    expect(hasClass(bar, "py-3")).toBe(true)
    expect(hasVariants(bar.getAttribute("class") ?? "", "lg:py-4")).toBe(true)
  })

  it("accepts an empty link list without crashing", () => {
    const { container } = render(<FooterDashboardSlimBar locale={locale} links={[]} />)
    expect(container.querySelector("footer")).toBeTruthy()
    expect(screen.queryByRole("navigation", { name: copy.helpLinksLabel })).toBeNull()
  })

  it("calls onHelp", () => {
    const onHelp = vi.fn()
    render(<FooterDashboardSlimBar locale={locale} onHelp={onHelp} />)
    fireEvent.click(screen.getByRole("button", { name: copy.helpLabel }))
    expect(onHelp).toHaveBeenCalledTimes(1)
  })
})

describe.each(["en", "ar"] as const)("Docs Page (%s)", (locale) => {
  const copy = footerDocsPageCopy[locale]

  it("renders one footer landmark with a labelled pager nav and a labelled links nav", () => {
    const { container } = render(<FooterDocsPage locale={locale} />)
    expect(landmarks(container)).toHaveLength(2)
    expect(screen.getByRole("navigation", { name: copy.pagerLabel })).toBeTruthy()
    expect(screen.getByRole("navigation", { name: copy.linksLabel })).toBeTruthy()
  })

  it("draws the prompt with outline sm Yes and No, the edit link, two pager cards, three avatars and the update line", () => {
    const { container } = render(<FooterDocsPage locale={locale} />)
    expect(screen.getByText(copy.prompt)).toBeTruthy()
    const yes = screen.getByRole("button", { name: copy.yes })
    const no = screen.getByRole("button", { name: copy.no })
    ;[yes, no].forEach((button) => {
      expect(hasClass(button, "ring-1")).toBe(true)
      expect(hasClass(button, "h-8")).toBe(true)
    })
    expect(screen.getByRole("link", { name: copy.editLabel })).toBeTruthy()
    expect(container.querySelector("a[rel='prev']")?.textContent).toContain(copy.previous.title)
    expect(container.querySelector("a[rel='next']")?.textContent).toContain(copy.next.title)
    const people = within(screen.getByRole("list", { name: copy.contributorsLabel })).getAllByRole("listitem")
    expect(people).toHaveLength(3)
    expect(container.textContent).toContain("2026")
    copy.links.forEach((link) => expect(screen.getByRole("link", { name: link.label })).toBeTruthy())
  })

  it("has no em dash or middle dot in the Arabic copy and keeps the date's numbers left to right", () => {
    if (locale !== "ar") return
    strings(copy).forEach((text) => expect(text).not.toMatch(/[—·]/))
    const { container } = render(<FooterDocsPage locale="ar" />)
    const runs = Array.from(container.querySelectorAll("bdi[dir='ltr']")).map((el) => el.textContent)
    expect(runs).toEqual(["14", "2026", "3"])
  })

  it("mirrors both chevrons by class and slides each toward its card's outer edge", () => {
    const { container } = render(<FooterDocsPage locale={locale} />)
    const left = container.querySelector("svg.lucide-chevron-left")!
    const right = container.querySelector("svg.lucide-chevron-right")!
    ;[left, right].forEach((chevron) => expect(hasVariants(chevron.getAttribute("class") ?? "", "rtl:-scale-x-100")).toBe(true))
    expect(hasVariants(left.getAttribute("class") ?? "", "group-hover/card:-translate-x-1")).toBe(true)
    expect(hasVariants(left.getAttribute("class") ?? "", "group-hover/card:translate-x-1")).toBe(true)
    expect(hasVariants(right.getAttribute("class") ?? "", "group-hover/card:translate-x-1")).toBe(true)
    expect(hasVariants(right.getAttribute("class") ?? "", "group-hover/card:-translate-x-1")).toBe(true)
    const prev = container.querySelector("a[rel='prev']")!
    expect(hasVariants(prev.getAttribute("class") ?? "", "hover:[@container(min-width:40rem)]:border-foreground")).toBe(true)
    expect(hasClass(prev, "duration-[160ms]")).toBe(true)
    expect(hasVariants(prev.getAttribute("class") ?? "", "active:[@media(hover:none)]:bg-secondary")).toBe(true)
  })

  it("votes once: the chosen button becomes default, both disable, the prompt becomes the thank-you line", () => {
    const onVote = vi.fn()
    const { container } = render(<FooterDocsPage locale={locale} onVote={onVote} />)
    const yes = screen.getByRole("button", { name: copy.yes })
    const no = screen.getByRole("button", { name: copy.no })
    expect(screen.queryByRole("status")?.textContent ?? "").toBe("")
    fireEvent.click(no)
    expect(onVote).toHaveBeenCalledWith("no")
    expect(hasClass(no, "bg-primary")).toBe(true)
    expect(hasClass(yes, "bg-primary")).toBe(false)
    expect((yes as HTMLButtonElement).disabled).toBe(true)
    expect((no as HTMLButtonElement).disabled).toBe(true)
    expect(no.getAttribute("aria-pressed")).toBe("true")
    expect(screen.getByRole("status").textContent).toBe(copy.thanks)
    // the prompt stays in place, faded, so the row keeps its width
    const prompt = screen.getByText(copy.prompt)
    expect(prompt.parentElement?.getAttribute("aria-hidden")).toBe("true")
    expect(hasClass(prompt.parentElement!, "opacity-0")).toBe(true)
    expect(hasClass(prompt.parentElement!, "duration-200")).toBe(true)
    expect(hasVariants(prompt.parentElement!.className, "motion-reduce:transition-none")).toBe(true)
    fireEvent.click(yes)
    expect(onVote).toHaveBeenCalledTimes(1)
    expect(container.querySelectorAll("[role='status']")).toHaveLength(1)
  })

  it("uses the approved thank-you line", () => {
    expect(copy.thanks).toBe(locale === "en" ? "Thanks for the feedback." : "شكرًا على ملاحظاتك.")
  })

  it("can start with a vote already in", () => {
    render(<FooterDocsPage locale={locale} defaultVote="yes" />)
    expect(screen.getByRole("status").textContent).toBe(copy.thanks)
    expect((screen.getByRole("button", { name: copy.yes, hidden: true }) as HTMLButtonElement).disabled).toBe(true)
  })

  it("accepts empty collections without crashing", () => {
    const { container } = render(<FooterDocsPage locale={locale} contributors={[]} links={[]} />)
    expect(container.querySelector("footer")).toBeTruthy()
    expect(screen.queryByRole("list", { name: copy.contributorsLabel })).toBeNull()
    expect(screen.queryByRole("navigation", { name: copy.linksLabel })).toBeNull()
  })
})

describe.each(["en", "ar"] as const)("Multi-Region (%s)", (locale) => {
  const copy = footerMultiRegionCopy[locale]
  const cards = () => within(screen.getByRole("list", { name: copy.cardsLabel })).getAllByRole("button")

  it("renders one footer landmark and a labelled legal nav", () => {
    const { container } = render(<FooterMultiRegion locale={locale} />)
    expect(landmarks(container)).toHaveLength(1)
    expect(screen.getByRole("navigation", { name: copy.legalLabel })).toBeTruthy()
  })

  it("draws the title, three Selects and six region cards with cities, languages and hours", () => {
    const { container } = render(<FooterMultiRegion locale={locale} />)
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(copy.title)
    expect(screen.getByRole("combobox", { name: copy.regionLabel })).toBeTruthy()
    expect(screen.getByRole("combobox", { name: copy.languageLabel })).toBeTruthy()
    expect(screen.getByRole("combobox", { name: copy.currencyLabel })).toBeTruthy()
    expect(cards()).toHaveLength(6)
    expect(cards().map((card) => card.querySelector("span")?.textContent)).toEqual(copy.regions.map((r) => r.name))
    expect(container.querySelectorAll("svg.lucide-map-pin")).toHaveLength(6)
    expect(container.querySelectorAll("svg.lucide-languages")).toHaveLength(6)
    expect(container.querySelectorAll("svg.lucide-clock")).toHaveLength(6)
    expect(container.textContent).toContain(copy.copyright)
  })

  it("has no em dash or middle dot in the Arabic copy; the cities are separated by drawn dots", () => {
    if (locale === "ar") strings(copy).forEach((text) => expect(text).not.toMatch(/[—·]/))
    const { container } = render(<FooterMultiRegion locale={locale} />)
    expect(container.textContent).not.toMatch(/[·]/)
    // 2 + 2 + 1 + 1 + 0 + 1 dots between the cities
    expect(container.querySelectorAll("span[aria-hidden='true'].rounded-full")).toHaveLength(7)
  })

  it("starts with Europe chosen, as the region Select shows it, and gives only the chosen card the foreground border", () => {
    render(<FooterMultiRegion locale={locale} />)
    expect(cards().map((card) => card.getAttribute("aria-pressed"))).toEqual(["true", "false", "false", "false", "false", "false"])
    expect(hasClass(cards()[0]!, "border-foreground")).toBe(true)
    expect(hasClass(cards()[1]!, "border-border")).toBe(true)
  })

  it("chooses a region on click or Enter, and only one at a time", () => {
    const onRegionChange = vi.fn()
    render(<FooterMultiRegion locale={locale} onRegionChange={onRegionChange} />)
    fireEvent.click(cards()[2]!)
    expect(onRegionChange).toHaveBeenLastCalledWith("north-america")
    expect(cards().map((card) => card.getAttribute("aria-pressed"))).toEqual(["false", "false", "true", "false", "false", "false"])
    expect(hasClass(cards()[2]!, "border-foreground")).toBe(true)
    expect(hasClass(cards()[0]!, "border-border")).toBe(true)
    // a button takes Enter as a click
    cards()[4]!.focus()
    fireEvent.keyDown(cards()[4]!, { key: "Enter" })
    fireEvent.click(cards()[4]!)
    expect(cards()[4]!.getAttribute("aria-pressed")).toBe("true")
  })

  it("starts with no card chosen when asked", () => {
    render(<FooterMultiRegion locale={locale} defaultRegion={null} />)
    expect(cards().every((card) => card.getAttribute("aria-pressed") === "false")).toBe(true)
  })

  it("scrolls the chosen card into view only when it is below the fold", () => {
    const scroll = vi.fn()
    Element.prototype.scrollIntoView = scroll
    render(<FooterMultiRegion locale={locale} />)
    const target = cards()[5]!
    target.getBoundingClientRect = () => ({ bottom: window.innerHeight - 10 }) as DOMRect
    fireEvent.click(target)
    expect(scroll).not.toHaveBeenCalled()
    target.getBoundingClientRect = () => ({ bottom: window.innerHeight + 200 }) as DOMRect
    fireEvent.click(target)
    expect(scroll).toHaveBeenCalledWith({ block: "nearest", behavior: "smooth" })
    // @ts-expect-error the stub is removed again
    delete Element.prototype.scrollIntoView
  })

  it("scrolls without smoothing under reduced motion, and drops the lift", () => {
    setMotion(true)
    const scroll = vi.fn()
    Element.prototype.scrollIntoView = scroll
    render(<FooterMultiRegion locale={locale} />)
    const target = cards()[5]!
    target.getBoundingClientRect = () => ({ bottom: window.innerHeight + 200 }) as DOMRect
    fireEvent.click(target)
    expect(scroll).toHaveBeenCalledWith({ block: "nearest", behavior: "auto" })
    expect(hasClass(target, "motion-safe:")).toBe(true)
    // @ts-expect-error the stub is removed again
    delete Element.prototype.scrollIntoView
  })

  it("lifts a hovering card 2px from Tablet and changes its border at 160ms", () => {
    render(<FooterMultiRegion locale={locale} />)
    const card = cards()[1]!
    expect(hasVariants(card.getAttribute("class") ?? "", "hover:[@container(min-width:40rem)]:border-foreground")).toBe(true)
    expect(hasVariants(card.getAttribute("class") ?? "", "hover:-translate-y-0.5")).toBe(true)
    expect(hasClass(card, "[@container(min-width:40rem)]:")).toBe(true)
    expect(hasClass(card, "duration-[160ms]")).toBe(true)
  })

  it("accepts empty collections without crashing", () => {
    const { container } = render(<FooterMultiRegion locale={locale} regions={[]} languages={[]} currencies={[]} legal={[]} />)
    expect(container.querySelector("footer")).toBeTruthy()
    expect(screen.queryAllByRole("combobox")).toHaveLength(0)
    expect(screen.queryByRole("list", { name: copy.cardsLabel })).toBeNull()
  })
})

describe.each(["en", "ar"] as const)("Product Family Switcher (%s)", (locale) => {
  const copy = footerProductFamilySwitcherCopy[locale]

  it("renders one footer landmark with labelled navs for the products, the company links and the legal links", () => {
    const { container } = render(<FooterProductFamilySwitcher locale={locale} />)
    expect(landmarks(container)).toHaveLength(3)
    expect(screen.getByRole("navigation", { name: copy.productsLabel })).toBeTruthy()
    expect(screen.getByRole("navigation", { name: copy.companyLabel })).toBeTruthy()
    expect(screen.getByRole("navigation", { name: copy.legalLabel })).toBeTruthy()
  })

  it("draws four product tiles with their icons and an Explore arrow, a ghost sm Compare button and four social marks", () => {
    const { container } = render(<FooterProductFamilySwitcher locale={locale} />)
    const tiles = within(screen.getByRole("navigation", { name: copy.productsLabel })).getAllByRole("link")
    expect(tiles).toHaveLength(4)
    copy.products.forEach((product, index) => expect(tiles[index]!.textContent).toContain(product.name))
    ;["sparkles", "book-open", "zap", "languages"].forEach((icon) => expect(container.querySelector(`svg.lucide-${icon}`)).toBeTruthy())
    tiles.forEach((tile) => expect(tile.textContent).toContain(copy.explore))
    const compare = screen.getByRole("link", { name: copy.compare.label })
    expect(hasClass(compare, "h-8")).toBe(true)
    expect(hasClass(compare, "bg-primary")).toBe(false)
    // At the start edge of the title at its own width, at every breakpoint: no stretching, no centring.
    expect(hasClass(compare, "w-full")).toBe(false)
    expect(compare.parentElement!.className).toContain("items-start")
    expect(compare.parentElement!.className).not.toContain("justify-between")
    expect(["LinkedIn", "X", "GitHub", "YouTube"].every((name) => container.querySelector(`a[aria-label="${name}"]`))).toBe(true)
  })

  it("keeps the product names as Figma has them", () => {
    expect(copy.products.map((p) => p.name)).toEqual(locale === "en" ? ["Fasla Core", "Fasla Blocks", "Fasla Tokens", "Fasla Arabic"] : ["فاصلة كور", "فاصلة بلوكس", "فاصلة توكنز", "فاصلة العربية"])
  })

  it("has no em dash or middle dot in the Arabic copy", () => {
    if (locale !== "ar") return
    strings(copy).forEach((text) => expect(text).not.toMatch(/[—·]/))
  })

  it("mirrors the arrows by class and slides the Explore arrow toward its direction", () => {
    const { container } = render(<FooterProductFamilySwitcher locale={locale} />)
    const arrows = Array.from(container.querySelectorAll("svg.lucide-arrow-right"))
    expect(arrows).toHaveLength(5)
    arrows.forEach((arrow) => expect(hasVariants(arrow.getAttribute("class") ?? "", "rtl:-scale-x-100")).toBe(true))
    const explore = arrows[1]!
    expect(hasVariants(explore.getAttribute("class") ?? "", "group-hover/tile:translate-x-1")).toBe(true)
    expect(hasVariants(explore.getAttribute("class") ?? "", "group-hover/tile:-translate-x-1")).toBe(true)
  })

  it("carries the tile hover on classes: border to foreground, a 2px lift at 160ms, an active tint on touch", () => {
    render(<FooterProductFamilySwitcher locale={locale} />)
    const tile = within(screen.getByRole("navigation", { name: copy.productsLabel })).getAllByRole("link")[0]!
    expect(hasVariants(tile.getAttribute("class") ?? "", "hover:[@container(min-width:40rem)]:border-foreground")).toBe(true)
    expect(hasVariants(tile.getAttribute("class") ?? "", "hover:-translate-y-0.5")).toBe(true)
    expect(hasClass(tile, "motion-safe:")).toBe(true)
    expect(hasClass(tile, "duration-[160ms]")).toBe(true)
    expect(hasVariants(tile.getAttribute("class") ?? "", "active:[@media(hover:none)]:bg-secondary")).toBe(true)
  })

  it("accepts empty collections without crashing or drawing empty navs", () => {
    const { container } = render(<FooterProductFamilySwitcher locale={locale} products={[]} company={[]} legal={[]} socials={[]} />)
    expect(container.querySelector("footer")).toBeTruthy()
    expect(screen.queryByRole("navigation", { name: copy.productsLabel })).toBeNull()
    expect(screen.queryByRole("navigation", { name: copy.companyLabel })).toBeNull()
  })
})
