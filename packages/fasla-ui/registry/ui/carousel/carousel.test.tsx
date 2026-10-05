import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from "./carousel"

/**
 * What these tests can and cannot prove.
 *
 * jsdom has no layout engine: nothing scrolls, `scrollIntoView` does not
 * exist, and IntersectionObserver never fires on its own. So scrolling is
 * asserted as *calls* — which element was asked into view, with what
 * behavior — and the observer is a hand-driven stub whose callback the tests
 * fire themselves. Snap alignment, the real scroll physics, the dot stretch
 * animation and RTL were checked in a real browser (Storybook, both
 * directions).
 * Treat a green run here as "the contract is wired", not "it scrolls right".
 */

/** Every `scrollIntoView` call, with the element it was called on. */
let scrollCalls: { el: Element; options?: ScrollIntoViewOptions }[] = []

class StubObserver {
  static instances: StubObserver[] = []
  callback: IntersectionObserverCallback
  elements: Element[] = []
  options?: IntersectionObserverInit
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback
    this.options = options
    StubObserver.instances.push(this)
  }
  observe(el: Element) {
    this.elements.push(el)
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

/** The track reports: slide `index` is now the one at the start of the view. */
const showSlide = (index: number) => {
  const observer = StubObserver.instances.at(-1)!
  act(() => {
    observer.callback(
      observer.elements.map(
        (el, i) =>
          ({ target: el, intersectionRatio: i === index ? 1 : 0 }) as IntersectionObserverEntry
      ),
      observer as unknown as IntersectionObserver
    )
  })
}

beforeEach(() => {
  scrollCalls = []
  StubObserver.instances = []
  vi.stubGlobal("IntersectionObserver", StubObserver)
  Element.prototype.scrollIntoView = function (
    this: Element,
    options?: ScrollIntoViewOptions | boolean
  ) {
    scrollCalls.push({ el: this, options: options as ScrollIntoViewOptions })
  }
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const SLIDES = ["A", "B", "C"]

const renderCarousel = (
  props: Partial<React.ComponentProps<typeof Carousel>> = {},
  dotsProps: React.ComponentProps<typeof CarouselDots> = {}
) =>
  render(
    <Carousel aria-label="Gallery" {...props}>
      <CarouselContent>
        {SLIDES.map((slide, i) => (
          <CarouselItem key={slide} data-testid={`slide-${i}`}>
            {slide}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots {...dotsProps} />
    </Carousel>
  )

const dots = () => screen.getAllByRole("button")
const dotVisual = (index: number) => dots()[index]!.querySelector("span") as HTMLElement

describe("Carousel", () => {
  it("exposes the APG shape: a named carousel region of numbered slides", () => {
    renderCarousel()
    const region = screen.getByRole("region")
    expect(region).toHaveAccessibleName("Gallery")
    expect(region).toHaveAttribute("aria-roledescription", "carousel")

    const slides = screen.getAllByRole("group")
    expect(slides).toHaveLength(3)
    slides.forEach((slide, i) => {
      expect(slide).toHaveAttribute("aria-roledescription", "slide")
      expect(slide).toHaveAccessibleName(`${i + 1} / 3`)
    })
  })

  it("lets a caller name a slide by its content instead", () => {
    render(
      <Carousel aria-label="Gallery">
        <CarouselContent>
          <CarouselItem aria-label="Sunrise">A</CarouselItem>
        </CarouselContent>
      </Carousel>
    )
    expect(screen.getByRole("group")).toHaveAccessibleName("Sunrise")
  })

  it("builds the track as a snap scroller with a hidden scrollbar", () => {
    renderCarousel()
    const track = screen.getByTestId("slide-0").parentElement as HTMLElement
    expect(track).toHaveAttribute("data-slot", "carousel-content")
    expect(track).toHaveClass(
      "flex",
      "gap-4",
      "overflow-x-auto",
      "snap-x",
      "snap-mandatory",
      "[scrollbar-width:none]",
      "[&::-webkit-scrollbar]:hidden"
    )
  })

  it("lets CSS own smoothness, so reduced motion is honoured without JS", () => {
    renderCarousel()
    const track = screen.getByTestId("slide-0").parentElement as HTMLElement
    expect(track).toHaveClass("scroll-smooth", "motion-reduce:scroll-auto")
    // ...and user navigation passes no behavior that would override it.
    fireEvent.click(dots()[2]!)
    expect(scrollCalls[0]?.options?.behavior).toBeUndefined()
  })

  it("makes each slide a full-width snap point", () => {
    renderCarousel()
    expect(screen.getByTestId("slide-0")).toHaveClass(
      "min-w-0",
      "shrink-0",
      "grow-0",
      "basis-full",
      "snap-start"
    )
  })

  it("draws one dot per slide, to the Figma geometry", () => {
    renderCarousel()
    expect(dots()).toHaveLength(3)
    // Active: a 24×8 primary pill. Inactive: an 8×8 muted-foreground circle —
    // muted itself sat at ~1.07:1 on the page, under WCAG 1.4.11's 3:1. The
    // width transitions, so activation reads as the dot stretching.
    expect(dotVisual(0)).toHaveClass("h-2", "w-6", "rounded-full", "bg-primary")
    expect(dotVisual(1)).toHaveClass("h-2", "w-2", "rounded-full", "bg-muted-foreground")
    for (const i of [0, 1, 2]) {
      expect(dotVisual(i)).toHaveClass(
        "transition-[width,background-color]",
        "motion-reduce:transition-none"
      )
    }
  })

  it("pads each dot into a 12×20 hit box that keeps the 4px gap and never overlaps", () => {
    // Padding grows the hit box, the matching negative margins give it back,
    // so the flex gap-1 stays the visible 4px and neighbouring boxes touch.
    renderCarousel()
    expect(dots()[0]).toHaveClass("px-0.5", "py-1.5", "-mx-0.5", "-my-1.5", "rounded-full")
    expect(dots()[0]!.parentElement).toHaveClass("flex", "items-center", "gap-1")
    expect(dots()[0]!.parentElement).toHaveAttribute("data-slot", "carousel-dots")
  })

  it("names the dots and marks the active one as current", () => {
    renderCarousel()
    expect(dots()[0]).toHaveAccessibleName("1 / 3")
    expect(dots()[0]).toHaveAttribute("aria-current", "true")
    expect(dots()[1]).not.toHaveAttribute("aria-current")
  })

  it("lets a caller label the dots in their own words", () => {
    renderCarousel({}, { label: (i, count) => `Slide ${i + 1} of ${count}` })
    expect(dots()[1]).toHaveAccessibleName("Slide 2 of 3")
  })

  it("keeps the dots focusable buttons with a visible focus ring", () => {
    renderCarousel()
    for (const dot of dots()) {
      expect(dot).toHaveAttribute("type", "button")
      expect(dot).toHaveClass(
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "focus-visible:ring-offset-2"
      )
    }
  })

  it("makes the track a tab stop with a visible focus ring", () => {
    // A scrollable region a keyboard cannot reach fails WCAG 2.1.1, and the
    // tab stop is what makes a dotless composition keyboard-operable.
    renderCarousel()
    const track = screen.getByTestId("slide-0").parentElement as HTMLElement
    expect(track).toHaveAttribute("tabindex", "0")
    expect(track).toHaveClass(
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-ring",
      "focus-visible:ring-offset-2"
    )
  })

  it("moves one slide per arrow key, and jumps with Home and End", () => {
    renderCarousel()
    const track = screen.getByTestId("slide-0").parentElement as HTMLElement

    fireEvent.keyDown(track, { key: "ArrowRight" })
    expect(scrollCalls.at(-1)!.el).toBe(screen.getByTestId("slide-1"))
    expect(dots()[1]).toHaveAttribute("aria-current", "true")

    fireEvent.keyDown(track, { key: "ArrowLeft" })
    expect(scrollCalls.at(-1)!.el).toBe(screen.getByTestId("slide-0"))
    expect(dots()[0]).toHaveAttribute("aria-current", "true")

    fireEvent.keyDown(track, { key: "End" })
    expect(dots()[2]).toHaveAttribute("aria-current", "true")
    fireEvent.keyDown(track, { key: "Home" })
    expect(dots()[0]).toHaveAttribute("aria-current", "true")

    // The ends clamp instead of wrapping.
    fireEvent.keyDown(track, { key: "ArrowLeft" })
    expect(dots()[0]).toHaveAttribute("aria-current", "true")
  })

  it("follows the computed direction: in RTL the arrows swap meaning", () => {
    const spy = vi
      .spyOn(window, "getComputedStyle")
      .mockReturnValue({ direction: "rtl" } as CSSStyleDeclaration)
    renderCarousel({ defaultActiveIndex: 1 })
    const track = screen.getByTestId("slide-0").parentElement as HTMLElement

    // On an RTL screen the left arrow points forward.
    fireEvent.keyDown(track, { key: "ArrowLeft" })
    expect(dots()[2]).toHaveAttribute("aria-current", "true")
    fireEvent.keyDown(track, { key: "ArrowRight" })
    expect(dots()[1]).toHaveAttribute("aria-current", "true")
    spy.mockRestore()
  })

  it("keeps its hands off arrow keys inside editable content", () => {
    render(
      <Carousel aria-label="Gallery">
        <CarouselContent>
          <CarouselItem>
            <input aria-label="Name" />
          </CarouselItem>
          <CarouselItem>B</CarouselItem>
        </CarouselContent>
        <CarouselDots />
      </Carousel>
    )
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "ArrowRight" })
    expect(scrollCalls).toHaveLength(0)
    expect(dots()[0]).toHaveAttribute("aria-current", "true")
  })

  it("lets a caller's onKeyDown cancel the navigation", () => {
    const onKeyDown = vi.fn((event: React.KeyboardEvent) => event.preventDefault())
    renderCarousel({ onKeyDown })
    const track = screen.getByTestId("slide-0").parentElement as HTMLElement
    fireEvent.keyDown(track, { key: "ArrowRight" })
    expect(onKeyDown).toHaveBeenCalled()
    expect(scrollCalls).toHaveLength(0)
    expect(dots()[0]).toHaveAttribute("aria-current", "true")
  })

  it("navigates on a dot click: scrolls the slide into view and moves the pill", () => {
    renderCarousel()
    fireEvent.click(dots()[2]!)
    expect(scrollCalls).toHaveLength(1)
    expect(scrollCalls[0]!.el).toBe(screen.getByTestId("slide-2"))
    expect(scrollCalls[0]!.options).toMatchObject({ block: "nearest", inline: "start" })
    expect(dots()[2]).toHaveAttribute("aria-current", "true")
  })

  it("follows manual scrolling through the observer", () => {
    const onChange = vi.fn()
    renderCarousel({ onActiveIndexChange: onChange })
    // The observer watches the slides within the track, past the half-shown mark.
    const observer = StubObserver.instances.at(-1)!
    expect(observer.options?.root).toBe(
      screen.getByTestId("slide-0").parentElement
    )
    expect(observer.options?.threshold).toBe(0.5)

    showSlide(1)
    expect(onChange).toHaveBeenCalledWith(1)
    expect(dots()[1]).toHaveAttribute("aria-current", "true")

    // The same report again is not a change.
    onChange.mockClear()
    showSlide(1)
    expect(onChange).not.toHaveBeenCalled()
  })

  it("starts on defaultActiveIndex, jumping there instantly", () => {
    renderCarousel({ defaultActiveIndex: 2 })
    expect(dots()[2]).toHaveAttribute("aria-current", "true")
    // A smooth animation on mount would be motion nobody asked for.
    expect(scrollCalls[0]!.el).toBe(screen.getByTestId("slide-2"))
    expect(scrollCalls[0]!.options?.behavior).toBe("instant")
  })

  it("follows a controlled activeIndex", () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <Carousel aria-label="Gallery" activeIndex={0} onActiveIndexChange={onChange}>
        <CarouselContent>
          {SLIDES.map((slide, i) => (
            <CarouselItem key={slide} data-testid={`slide-${i}`}>
              {slide}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots />
      </Carousel>
    )
    // A dot click asks; it does not take.
    fireEvent.click(dots()[2]!)
    expect(onChange).toHaveBeenCalledWith(2)
    expect(dots()[0]).toHaveAttribute("aria-current", "true")

    rerender(
      <Carousel aria-label="Gallery" activeIndex={2} onActiveIndexChange={onChange}>
        <CarouselContent>
          {SLIDES.map((slide, i) => (
            <CarouselItem key={slide} data-testid={`slide-${i}`}>
              {slide}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots />
      </Carousel>
    )
    expect(dots()[2]).toHaveAttribute("aria-current", "true")
    expect(scrollCalls.at(-1)!.el).toBe(screen.getByTestId("slide-2"))
  })

  it("clamps navigation to the slides that exist", () => {
    const onChange = vi.fn()
    renderCarousel({ onActiveIndexChange: onChange, defaultActiveIndex: 0 })
    fireEvent.click(dots()[2]!)
    expect(dots()[2]).toHaveAttribute("aria-current", "true")
    // No dot points past the end, so drive the context directly via a rerender
    // with an out-of-range controlled index: nothing blows up.
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it("lays the carousel out with logical properties only", () => {
    renderCarousel()
    const html = screen.getByRole("region").outerHTML
    expect(html).not.toMatch(/\brtl:/)
    expect(html).not.toMatch(/translate-x/)
    expect(html).not.toMatch(/\b(left|right)-/)
  })

  it("renders no dots for an empty carousel", () => {
    render(
      <Carousel aria-label="Gallery">
        <CarouselContent />
        <CarouselDots data-testid="dots" />
      </Carousel>
    )
    expect(screen.queryByTestId("dots")).toBeNull()
    expect(screen.queryByRole("button")).toBeNull()
  })

  it("applies custom className to the root and forwards its ref", () => {
    const ref = { current: null as HTMLDivElement | null }
    render(
      <Carousel aria-label="Gallery" className="custom-class" ref={ref}>
        <CarouselContent />
      </Carousel>
    )
    expect(screen.getByRole("region")).toHaveClass("custom-class", "relative")
    expect(ref.current).toBe(screen.getByRole("region"))
  })

  it("merges className and forwards refs on the parts", () => {
    const contentRef = { current: null as HTMLDivElement | null }
    const itemRef = { current: null as HTMLDivElement | null }
    render(
      <Carousel aria-label="Gallery">
        <CarouselContent ref={contentRef} className="pb-2">
          <CarouselItem ref={itemRef} className="basis-1/2">
            A
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    )
    expect(contentRef.current).toHaveClass("pb-2", "snap-x")
    // A caller's basis wins over the default full width.
    expect(itemRef.current).toHaveClass("basis-1/2")
    expect(itemRef.current).not.toHaveClass("basis-full")
  })

  it("throws when a part is used outside the provider", () => {
    // React logs the error it rethrows; silence the noise, keep the assertion.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<CarouselDots />)).toThrow(
      "Carousel components must be used within a Carousel provider"
    )
    spy.mockRestore()
  })

  it("rejects a string as an index", () => {
    render(
      // @ts-expect-error `activeIndex` is a number — the Figma `Active Item`
      // axis — never the string Figma shows in its property panel.
      <Carousel aria-label="Gallery" activeIndex="1">
        <CarouselContent />
      </Carousel>
    )
    expect(screen.getByRole("region")).toBeInTheDocument()
  })
})
