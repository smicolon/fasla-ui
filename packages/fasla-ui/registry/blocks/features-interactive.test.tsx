import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, within } from "@testing-library/react"
import { FeaturesPhotoCarousel, featuresPhotoCarouselCopy } from "./features-photo-carousel"
import { FeaturesPhotoTabsPanel, featuresPhotoTabsPanelCopy } from "./features-photo-tabs-panel"
import { FeaturesAccordionPhoto, featuresAccordionPhotoCopy } from "./features-accordion-photo"
import { FeaturesExpandingStepCards, featuresExpandingStepCardsCopy } from "./features-expanding-step-cards"

// What these tests can and cannot prove: jsdom has no layout or animation, so
// the Figma sizes, the container-query layouts, the fade and the sliding tab
// indicator were measured in a browser. These assert the behaviour: what the
// visitor can operate and what each action changes, in both languages.

type Block = React.ComponentType<{ locale?: "en" | "ar" } & Record<string, unknown>>
const TYPES: { name: string; Block: Block; copy: { en: object; ar: object } }[] = [
  { name: "Photo Carousel", Block: FeaturesPhotoCarousel as Block, copy: featuresPhotoCarouselCopy },
  { name: "Photo Tabs Panel", Block: FeaturesPhotoTabsPanel as Block, copy: featuresPhotoTabsPanelCopy },
  { name: "Accordion + Photo", Block: FeaturesAccordionPhoto as Block, copy: featuresAccordionPhotoCopy },
  { name: "Expanding Step Cards", Block: FeaturesExpandingStepCards as Block, copy: featuresExpandingStepCardsCopy },
]

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
      const latin = text.replace(/\b(API|REST|CSV|SSO|SCIM)\b/g, "")
      expect(latin, text).not.toMatch(/[A-Za-z]{3,}/)
      expect(text, text).not.toMatch(/[٠-٩]/)
    }
  })

  it("passes className through", () => {
    const { container } = render(<Block locale="en" className="custom" />)
    expect(container.querySelector("section")?.className).toContain("custom")
  })
})

describe("Photo Carousel", () => {
  it("shows the first slide, counts it, and disables previous at the start", () => {
    render(<FeaturesPhotoCarousel />)
    expect(screen.getByRole("button", { name: "Previous slide" })).toHaveProperty("disabled", true)
    expect(screen.getByRole("button", { name: "Next slide" })).toHaveProperty("disabled", false)
    expect(screen.getAllByText("01 / 04").length).toBeGreaterThan(0)
  })

  it("moves one slide with the buttons, to any slide with the dots, and stops at the ends", () => {
    const changes: number[] = []
    render(<FeaturesPhotoCarousel onIndexChange={(next) => changes.push(next)} />)
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }))
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }))
    expect(changes).toEqual([1, 2])
    fireEvent.click(screen.getByRole("button", { name: "4 / 4" }))
    expect(changes.at(-1)).toBe(3)
    expect(screen.getByRole("button", { name: "Next slide" })).toHaveProperty("disabled", true)
    fireEvent.click(screen.getByRole("button", { name: "Previous slide" }))
    expect(changes.at(-1)).toBe(2)
  })

  it("hides every slide but the shown one from assistive technology and the keyboard", () => {
    const { container } = render(<FeaturesPhotoCarousel index={1} />)
    const slides = [...container.querySelectorAll("[aria-roledescription='slide']")]
    expect(slides).toHaveLength(4)
    expect(slides.map((slide) => slide.getAttribute("aria-hidden"))).toEqual(["true", null, "true", "true"])
    expect(slides.map((slide) => slide.hasAttribute("inert"))).toEqual([true, false, true, true])
  })

  it("never advances by itself", () => {
    vi.useFakeTimers()
    const onIndexChange = vi.fn()
    render(<FeaturesPhotoCarousel onIndexChange={onIndexChange} />)
    vi.advanceTimersByTime(60_000)
    expect(onIndexChange).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it("makes a link of a slide with an href and reports the press of one without", () => {
    const pressed: string[] = []
    const { container } = render(<FeaturesPhotoCarousel slides={[{ id: "a", title: "A", description: "a", linkLabel: "Go", href: "/a" }, { id: "b", title: "B", description: "b", linkLabel: "Go" }]} onLinkClick={(id) => pressed.push(id)} />)
    expect(container.querySelectorAll("a[href='/a']")).toHaveLength(1)
    fireEvent.click(container.querySelector("button[type='button'].group\\/link")!)
    expect(pressed).toEqual(["b"])
  })
})

describe("Photo Tabs Panel", () => {
  it("shows the first tab's panel and switches to another when a tab is picked", () => {
    render(<FeaturesPhotoTabsPanel />)
    expect(screen.getAllByRole("tab")).toHaveLength(4)
    expect(screen.getByText("Roadmap, specs and releases on one timeline")).toBeTruthy()
    fireEvent.click(screen.getByRole("tab", { name: "Finance" }))
    expect(screen.getByText("Budgets, approvals and audit trails that agree")).toBeTruthy()
    expect(screen.queryByText("Roadmap, specs and releases on one timeline")).toBeNull()
  })

  it("reports the picked tab's id and takes a controlled value", () => {
    const onValueChange = vi.fn()
    const { rerender } = render(<FeaturesPhotoTabsPanel value="product" onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole("tab", { name: "Marketing" }))
    expect(onValueChange).toHaveBeenCalledWith("marketing")
    rerender(<FeaturesPhotoTabsPanel value="operations" onValueChange={onValueChange} />)
    expect(screen.getByText("Recurring work that runs on a template")).toBeTruthy()
  })

  it("draws three checked bullets in a panel", () => {
    const { container } = render(<FeaturesPhotoTabsPanel />)
    expect(container.querySelectorAll("[role='tabpanel'] ul li")).toHaveLength(3)
  })
})

describe("Accordion + Photo", () => {
  it("opens the first question, and opening another closes it", () => {
    render(<FeaturesAccordionPhoto />)
    const triggers = screen.getAllByRole("button")
    expect(triggers).toHaveLength(5)
    expect(triggers[0]!.getAttribute("aria-expanded")).toBe("true")
    fireEvent.click(triggers[1]!)
    expect(screen.getAllByRole("button")[1]!.getAttribute("aria-expanded")).toBe("true")
    expect(screen.getAllByRole("button")[0]!.getAttribute("aria-expanded")).toBe("false")
  })

  it("lets several stay open when multiple, and takes its open items from defaultValue", () => {
    render(<FeaturesAccordionPhoto multiple defaultValue={["api", "arabic"]} />)
    const open = screen.getAllByRole("button").filter((button) => button.getAttribute("aria-expanded") === "true")
    expect(open).toHaveLength(2)
  })
})

describe("Expanding Step Cards", () => {
  it("shows four named cards, Plan with three steps, and a button that reports its press", () => {
    let pressed = 0
    const { container } = render(<FeaturesExpandingStepCards onStart={() => pressed++} />)
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4)
    expect(container.querySelectorAll("section[aria-label='Plan'] ol li")).toHaveLength(3)
    fireEvent.click(screen.getByRole("button", { name: "Start for free" }))
    expect(pressed).toBe(1)
  })

  it("draws a Progress at 40% in the Record card and uses the atoms as drawn", () => {
    const { container } = render(<FeaturesExpandingStepCards />)
    const bar = within(container.querySelector("section[aria-label='Record']") as HTMLElement).getByRole("progressbar")
    expect(bar.getAttribute("aria-valuenow")).toBe("40")
    for (const text of ["Ready", "Live", "Sent"]) expect(container.textContent).toContain(text)
  })

  it("renders the button as a link with a startHref", () => {
    render(<FeaturesExpandingStepCards startHref="/start" />)
    expect(screen.getByRole("link", { name: "Start for free" }).getAttribute("href")).toBe("/start")
  })
})
