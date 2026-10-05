import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { ContentCarousel, ContentCarouselItem } from "./content-carousel"

/**
 * What these tests can and cannot prove.
 *
 * jsdom has no layout engine and nothing scrolls: `scrollIntoView` is stubbed
 * and asserted as calls, and the IntersectionObserver that would confirm a
 * manual scroll never fires (the engine's own observer tests live next to the
 * engine, in carousel.test.tsx). So these assert the Content Carousel's own
 * contract: the Figma row and card geometry, the arrows' states at the ends
 * per `itemsPerView`, and the wiring back into the engine. The snap, the
 * arrow mirroring and the card widths were measured in a real browser.
 */

let scrollCalls: { el: Element; options?: ScrollIntoViewOptions }[] = []

beforeEach(() => {
  scrollCalls = []
  Element.prototype.scrollIntoView = function (
    this: Element,
    options?: ScrollIntoViewOptions | boolean
  ) {
    scrollCalls.push({ el: this, options: options as ScrollIntoViewOptions })
  }
})

const CARDS = ["A", "B", "C"]

const renderCarousel = (props: Partial<React.ComponentProps<typeof ContentCarousel>> = {}) =>
  render(
    <ContentCarousel aria-label="Featured" {...props}>
      {CARDS.map((card, i) => (
        <ContentCarouselItem key={card} data-testid={`card-${i}`}>
          {card}
        </ContentCarouselItem>
      ))}
    </ContentCarousel>
  )

const prev = () => screen.getByRole("button", { name: "Previous" })
const next = () => screen.getByRole("button", { name: "Next" })

describe("ContentCarousel", () => {
  it("is a named carousel region: arrow, cards, arrow", () => {
    renderCarousel()
    const region = screen.getByRole("region")
    expect(region).toHaveAccessibleName("Featured")
    expect(region).toHaveAttribute("aria-roledescription", "carousel")
    // Figma's root row: everything centred, 16px apart.
    expect(region).toHaveClass("flex", "items-center", "gap-4")

    const [first, track, last] = Array.from(region.children)
    expect(first).toHaveAttribute("data-slot", "carousel-previous")
    expect(track).toHaveAttribute("data-slot", "carousel-content")
    expect(track).toHaveClass("flex-1", "self-stretch")
    expect(last).toHaveAttribute("data-slot", "carousel-next")
  })

  it("exposes the cards as numbered slides", () => {
    renderCarousel()
    const slides = screen.getAllByRole("group")
    expect(slides).toHaveLength(3)
    expect(slides[1]).toHaveAttribute("aria-roledescription", "slide")
    expect(slides[1]).toHaveAccessibleName("2 / 3")
  })

  it("dresses each card to the Figma content box", () => {
    renderCarousel()
    expect(screen.getByTestId("card-0")).toHaveClass(
      "rounded-lg",
      "border",
      "bg-card",
      "text-card-foreground",
      "shadow-sm",
      "overflow-hidden",
      "snap-start"
    )
  })

  it("sizes the cards from itemsPerView, ceding the 16px gaps", () => {
    const cases = [
      [1, "basis-full"],
      [2, "basis-[calc((100%-16px)/2)]"],
      [3, "basis-[calc((100%-32px)/3)]"],
    ] as const
    for (const [itemsPerView, basis] of cases) {
      const { unmount } = renderCarousel({ itemsPerView })
      expect(screen.getByTestId("card-0")).toHaveClass(basis)
      unmount()
    }
  })

  it("shows one card per view by default, and for an untyped junk value", () => {
    const { unmount } = renderCarousel()
    expect(screen.getByTestId("card-0")).toHaveClass("basis-full")
    unmount()

    renderCarousel({ itemsPerView: 0 as unknown as 1 })
    expect(screen.getByTestId("card-0")).toHaveClass("basis-full")
  })

  it("draws the arrows as Figma's 32px round icon buttons", () => {
    renderCarousel()
    for (const arrow of [prev(), next()]) {
      expect(arrow).toHaveAttribute("type", "button")
      expect(arrow).toHaveClass(
        "size-8",
        "shrink-0",
        "rounded-full",
        "border",
        "bg-background",
        "shadow-sm",
        // Figma dims a disabled arrow to 50%, on the whole button.
        "disabled:opacity-50",
        "disabled:pointer-events-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring"
      )
      expect(arrow).toHaveClass("transition-colors", "motion-reduce:transition-none")
      const icon = arrow.querySelector("svg") as SVGElement
      // The one sanctioned `rtl:` use: a directional icon, mirrored not rotated.
      expect(icon).toHaveClass("size-4", "rtl:-scale-x-100")
      expect(icon).toHaveAttribute("aria-hidden", "true")
    }
  })

  it("keeps every other class logical for RTL", () => {
    renderCarousel({ itemsPerView: 2 })
    const html = screen.getByRole("region").outerHTML
    // Only the icon mirror may mention rtl:.
    expect(html.match(/rtl:[\w[\]().-]*/g)).toEqual([
      "rtl:-scale-x-100",
      "rtl:-scale-x-100",
    ])
    expect(html).not.toMatch(/translate-x/)
    expect(html).not.toMatch(/\b(left|right)-/)
  })

  it("starts with previous disabled and next live", () => {
    renderCarousel()
    expect(prev()).toBeDisabled()
    expect(next()).toBeEnabled()
  })

  it("advances one card per click and disables next on the last", () => {
    const onChange = vi.fn()
    renderCarousel({ onActiveIndexChange: onChange })

    fireEvent.click(next())
    expect(onChange).toHaveBeenLastCalledWith(1)
    expect(scrollCalls.at(-1)!.el).toBe(screen.getByTestId("card-1"))
    expect(prev()).toBeEnabled()

    fireEvent.click(next())
    expect(onChange).toHaveBeenLastCalledWith(2)
    expect(next()).toBeDisabled()

    fireEvent.click(prev())
    expect(onChange).toHaveBeenLastCalledWith(1)
    expect(scrollCalls.at(-1)!.el).toBe(screen.getByTestId("card-1"))
  })

  it("stops next at the last full view, not the last card", () => {
    // Three cards, two in view: the last page starts at card 1 (3 − 2).
    renderCarousel({ itemsPerView: 2 })
    fireEvent.click(next())
    expect(next()).toBeDisabled()
    expect(prev()).toBeEnabled()
  })

  it("disables both arrows when every card is already in view", () => {
    renderCarousel({ itemsPerView: 3 })
    expect(prev()).toBeDisabled()
    expect(next()).toBeDisabled()
  })

  it("follows a controlled activeIndex", () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <ContentCarousel aria-label="Featured" activeIndex={0} onActiveIndexChange={onChange}>
        {CARDS.map((card, i) => (
          <ContentCarouselItem key={card} data-testid={`card-${i}`}>
            {card}
          </ContentCarouselItem>
        ))}
      </ContentCarousel>
    )
    // A click asks; it does not take.
    fireEvent.click(next())
    expect(onChange).toHaveBeenCalledWith(1)
    expect(prev()).toBeDisabled()

    rerender(
      <ContentCarousel aria-label="Featured" activeIndex={2} onActiveIndexChange={onChange}>
        {CARDS.map((card, i) => (
          <ContentCarouselItem key={card} data-testid={`card-${i}`}>
            {card}
          </ContentCarouselItem>
        ))}
      </ContentCarousel>
    )
    expect(next()).toBeDisabled()
    expect(scrollCalls.at(-1)!.el).toBe(screen.getByTestId("card-2"))
  })

  it("rides the engine's keyboard navigation from anywhere inside", () => {
    const onChange = vi.fn()
    renderCarousel({ onActiveIndexChange: onChange })
    // The arrows have focus most often; an arrow key from one still navigates.
    fireEvent.keyDown(next(), { key: "ArrowRight" })
    expect(onChange).toHaveBeenLastCalledWith(1)
    expect(scrollCalls.at(-1)!.el).toBe(screen.getByTestId("card-1"))
    fireEvent.keyDown(screen.getByTestId("card-1"), { key: "End" })
    expect(onChange).toHaveBeenLastCalledWith(2)
    expect(next()).toBeDisabled()
  })

  it("renames the arrows for the locale", () => {
    renderCarousel({ previousLabel: "السابق", nextLabel: "التالي" })
    expect(screen.getByRole("button", { name: "السابق" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "التالي" })).toBeInTheDocument()
  })

  it("applies custom className to the root and forwards refs", () => {
    const ref = { current: null as HTMLDivElement | null }
    const itemRef = { current: null as HTMLDivElement | null }
    render(
      <ContentCarousel aria-label="Featured" className="custom-class" ref={ref}>
        <ContentCarouselItem ref={itemRef} className="p-6">
          A
        </ContentCarouselItem>
      </ContentCarousel>
    )
    expect(screen.getByRole("region")).toHaveClass("custom-class")
    expect(ref.current).toBe(screen.getByRole("region"))
    // The slot adds no padding of its own; a caller's padding sticks.
    expect(itemRef.current).toHaveClass("p-6")
  })

  it("rejects an items count outside the Figma set", () => {
    render(
      // @ts-expect-error `itemsPerView` is 1 | 2 | 3 — the Figma `Type` axis —
      // declared as a literal union rather than widened by VariantProps.
      <ContentCarousel aria-label="Featured" itemsPerView={4}>
        <ContentCarouselItem>A</ContentCarouselItem>
      </ContentCarousel>
    )
    expect(screen.getByRole("region")).toBeInTheDocument()
  })
})
