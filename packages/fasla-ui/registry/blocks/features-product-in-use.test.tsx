import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, within } from "@testing-library/react"
import { FeaturesComparePanelsChatAnswer, featuresComparePanelsChatAnswerCopy } from "./features-compare-panels-chat-answer"
import { FeaturesNumberedStepsFloatingCards, featuresNumberedStepsFloatingCardsCopy } from "./features-numbered-steps-floating-cards"
import { FeaturesSolidColourCards, featuresSolidColourCardsCopy } from "./features-solid-colour-cards"
import { FeaturesIconTitledPreviewRail, featuresIconTitledPreviewRailCopy } from "./features-icon-titled-preview-rail"
import { FeaturesTintedProductBento, featuresTintedProductBentoCopy } from "./features-tinted-product-bento"
import { FeaturesShowcaseCardPair, featuresShowcaseCardPairCopy } from "./features-showcase-card-pair"

// What these tests can and cannot prove: jsdom has no layout or animation, so
// the Figma sizes, the container-query layouts, the mock-ups' proportions and
// the crossfades were measured in a browser. These assert the behaviour: what
// the visitor can operate, what each action changes, and the Arabic rules.

type Block = React.ComponentType<{ locale?: "en" | "ar" } & Record<string, unknown>>
const TYPES: { name: string; Block: Block; copy: { en: object; ar: object } }[] = [
  { name: "Compare Panels + Chat Answer", Block: FeaturesComparePanelsChatAnswer as Block, copy: featuresComparePanelsChatAnswerCopy },
  { name: "Numbered Steps + Floating Cards", Block: FeaturesNumberedStepsFloatingCards as Block, copy: featuresNumberedStepsFloatingCardsCopy },
  { name: "Solid Colour Cards", Block: FeaturesSolidColourCards as Block, copy: featuresSolidColourCardsCopy },
  { name: "Icon-Titled Preview Rail", Block: FeaturesIconTitledPreviewRail as Block, copy: featuresIconTitledPreviewRailCopy },
  { name: "Tinted Product Bento", Block: FeaturesTintedProductBento as Block, copy: featuresTintedProductBentoCopy },
  { name: "Showcase Card Pair", Block: FeaturesShowcaseCardPair as Block, copy: featuresShowcaseCardPairCopy },
]

const strings = (value: unknown): string[] =>
  typeof value === "string"
    ? [value]
    : Array.isArray(value)
      ? value.flatMap(strings)
      : value && typeof value === "object" && !("$$typeof" in value)
        ? Object.entries(value).flatMap(([key, inner]) => (key === "id" || key === "tone" || key === "kind" || key === "href" ? [] : strings(inner)))
        : []

const shape = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(shape)
    : value && typeof value === "object" && !("$$typeof" in value)
      ? Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, shape(inner)]))
      : typeof value

/** A file path or name: an identifier, so it stays Latin in Arabic. */
const IDENTIFIER = /^\/?[\w./-]+\.(md|yaml|table|csv|log|eml|notes)$|^\/[\w./-]+$/

describe.each(TYPES)("$name", ({ Block, copy }) => {
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
      expect(text, text).not.toMatch(/[٠-٩]/)
      if (IDENTIFIER.test(text)) continue
      const latin = text.replace(/\b(API|SSO|SCIM|CSV|KMS|REST)\b/g, "")
      expect(latin, text).not.toMatch(/[A-Za-z]{3,}/)
    }
  })

  it("passes className through", () => {
    const { container } = render(<Block locale="en" className="custom" />)
    expect(container.querySelector("section")?.className).toContain("custom")
  })
})

describe("Compare Panels + Chat Answer", () => {
  it("opens the Files card first, and a chip opens its own card and closes the other", () => {
    render(<FeaturesComparePanelsChatAnswer />)
    const chips = ["Billing", "Chat", "Notes", "Mail", "Files"].map((name) => screen.getByRole("button", { name }))
    expect(chips.map((chip) => chip.getAttribute("aria-expanded"))).toEqual(["false", "false", "false", "false", "true"])
    expect(screen.getByText("/standards/handoff-playbook.md")).toBeTruthy()
    fireEvent.click(chips[0]!)
    expect(chips[0]!.getAttribute("aria-expanded")).toBe("true")
    expect(chips[4]!.getAttribute("aria-expanded")).toBe("false")
    expect(screen.getByText("/finance/invoices-q3.csv")).toBeTruthy()
    expect(screen.queryByText("/standards/handoff-playbook.md")).toBeNull()
  })

  it("keeps the file names Latin in Arabic and the percentages spelled out", () => {
    const { container } = render(<FeaturesComparePanelsChatAnswer locale="ar" />)
    expect(container.textContent).toContain("pipeline-q3.md")
    expect(container.textContent).toContain("بالمئة")
  })
})

describe("Numbered Steps + Floating Cards", () => {
  it("opens step 02 first, one step at a time, and reports the change", () => {
    const onValueChange = vi.fn()
    render(<FeaturesNumberedStepsFloatingCards onValueChange={onValueChange} />)
    const triggers = screen.getAllByRole("button")
    expect(triggers.map((trigger) => trigger.getAttribute("aria-expanded"))).toEqual(["false", "true", "false"])
    fireEvent.click(triggers[2]!)
    expect(onValueChange).toHaveBeenCalledWith("decided")
    expect(screen.getAllByRole("button").map((trigger) => trigger.getAttribute("aria-expanded"))).toEqual(["false", "false", "true"])
  })

  it("shows only the open step's detail, and the question and files for every step stacked in one cell", () => {
    const { container } = render(<FeaturesNumberedStepsFloatingCards />)
    expect([...container.querySelectorAll("[role='region']")].map((panel) => panel.hasAttribute("hidden"))).toEqual([true, false, true])
    expect(container.querySelectorAll("li > span + span, li span.truncate").length).toBeGreaterThan(0)
  })
})

describe("Solid Colour Cards", () => {
  it("draws four cards built from the atoms, with two live switches in the first", () => {
    const { container } = render(<FeaturesSolidColourCards />)
    expect(container.querySelectorAll("ul > li.bg-chart-3")).toHaveLength(4)
    const switches = screen.getAllByRole("switch")
    expect(switches).toHaveLength(2)
    expect((switches[0] as HTMLInputElement).checked).toBe(true)
    fireEvent.click(switches[0]!)
    expect((switches[0] as HTMLInputElement).checked).toBe(false)
  })

  it("draws two Progress bars, the workflow at 75% and Setup at 85%", () => {
    render(<FeaturesSolidColourCards />)
    expect(screen.getAllByRole("progressbar", { hidden: true }).map((bar) => bar.getAttribute("aria-valuenow"))).toEqual(["75", "85"])
  })
})

describe("Icon-Titled Preview Rail", () => {
  it("is a focusable, named list of five items, and the arrow keys scroll it", () => {
    render(<FeaturesIconTitledPreviewRail />)
    const rail = screen.getByRole("list", { name: "Parts of the platform" })
    expect(rail.getAttribute("tabindex")).toBe("0")
    expect(within(rail).getAllByRole("heading", { level: 3 })).toHaveLength(5)
    const scrollBy = vi.fn()
    rail.scrollBy = scrollBy as typeof rail.scrollBy
    fireEvent.keyDown(rail, { key: "ArrowRight" })
    fireEvent.keyDown(rail, { key: "ArrowLeft" })
    expect(scrollBy.mock.calls.map(([options]) => Math.sign(options.left))).toEqual([1, -1])
  })

  it("bolds the caption's opening words and shows the contact's photo when given one", () => {
    const { container } = render(<FeaturesIconTitledPreviewRail contactPhoto={{ src: "/x.webp", alt: "x" }} />)
    expect(container.querySelectorAll("p > span.font-semibold")).toHaveLength(5)
    expect(container.querySelector("img[src='/x.webp']")).toBeTruthy()
  })
})

describe("Tinted Product Bento", () => {
  it("draws three cards and three panels, with a live Auto-scale switch and a Progress at 60%", () => {
    render(<FeaturesTintedProductBento />)
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3)
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("60")
    const toggle = screen.getByRole("switch", { name: "Auto-scale" }) as HTMLInputElement
    fireEvent.click(toggle)
    expect(toggle.checked).toBe(false)
  })

  it("reports the panel's id when its button is pressed, and links when it has an href", () => {
    const onExplore = vi.fn()
    render(<FeaturesTintedProductBento onExplore={onExplore} />)
    fireEvent.click(screen.getByRole("button", { name: "Explore templates" }))
    fireEvent.click(screen.getAllByRole("button", { name: "Learn more" })[1]!)
    expect(onExplore.mock.calls).toEqual([["workflows"], ["dedicated"]])
    const linked = render(<FeaturesTintedProductBento panels={[{ id: "workflows", tag: "A", title: "T", description: "d", useLabel: "u", bullets: ["b"], action: "Go", href: "/go" }]} />)
    expect(within(linked.container).getByRole("link", { name: "Go" }).getAttribute("href")).toBe("/go")
  })
})

describe("Showcase Card Pair", () => {
  it("reports the arrow's press, and crossfades to the edited photo only when one is given", () => {
    const onApply = vi.fn()
    const edited = { src: "/edited.webp", alt: "edited" }
    const { container, rerender } = render(<FeaturesShowcaseCardPair onApply={onApply} />)
    fireEvent.click(screen.getByRole("button", { name: "Apply the edit" }))
    expect(onApply).toHaveBeenCalledTimes(1)
    expect(container.querySelector("img")).toBeNull()
    rerender(<FeaturesShowcaseCardPair onApply={onApply} editedImage={edited} />)
    const img = container.querySelector("img[src='/edited.webp']")!
    expect(img.className).toContain("opacity-0")
    fireEvent.click(screen.getByRole("button", { name: "Apply the edit" }))
    expect(img.className).toContain("opacity-100")
  })

  it("always draws the selection box and names both captions", () => {
    const { container } = render(<FeaturesShowcaseCardPair />)
    expect(container.querySelectorAll("[aria-hidden='true'].border")).toHaveLength(1)
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2)
  })
})
