"use client"

import * as React from "react"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "../carousel/carousel"

/**
 * Figma's Content Carousel: previous arrow, a row of card slots, next arrow.
 * It rides the Carousel scroll-snap engine, so the cards also scroll by touch
 * and trackpad, and RTL needs nothing beyond the page's `dir` — the arrows
 * swap sides because the row is a flex row, and the icons mirror themselves.
 *
 * Figma's `Type` axis (Single box / Two boxes / Three boxes) is
 * `itemsPerView`: how many cards share the view. Each card is a slot that
 * takes any child — an image, a testimonial, a custom layout.
 */

/**
 * The share of the track each card takes: the full width less the 16px gaps
 * between the visible cards (one gap for two-up, two for three-up), split
 * evenly. Literal classes so Tailwind can find them; `?? [1]` catches an
 * untyped caller passing something else.
 */
const basisClasses = {
  1: "basis-full",
  2: "basis-[calc((100%-16px)/2)]",
  3: "basis-[calc((100%-32px)/3)]",
}

const ItemsPerViewContext = React.createContext<1 | 2 | 3>(1)

/**
 * Figma's Icon Button, which has no code atom yet: 32px round — 8px padding
 * around a 16px icon — on `background` with a 1px `border` stroke and
 * `shadow/default/sm`. Disabled is the variant root at 50% opacity.
 */
const arrowClasses =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-full border bg-background text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

export interface ContentCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Figma's `Type` axis: how many cards share the view. Declared as a literal
   * union rather than inferred, so `4` is a type error, not a layout surprise.
   */
  itemsPerView?: 1 | 2 | 3
  /** The controlled index of the first visible card. */
  activeIndex?: number
  /** The card to start on when the index is uncontrolled. */
  defaultActiveIndex?: number
  /** Called whenever the first visible card changes. */
  onActiveIndexChange?: (index: number) => void
  /** Accessible name for the previous arrow. */
  previousLabel?: string
  /** Accessible name for the next arrow. */
  nextLabel?: string
  children: React.ReactNode
}

/**
 * Name the carousel with `aria-label` (or `aria-labelledby`); the root is the
 * APG `region`/`carousel` from the engine. Children are `ContentCarouselItem`s.
 */
const ContentCarousel = React.forwardRef<HTMLDivElement, ContentCarouselProps>(
  (
    {
      itemsPerView = 1,
      previousLabel = "Previous",
      nextLabel = "Next",
      className,
      children,
      ...props
    },
    ref
  ) => (
    <ItemsPerViewContext.Provider value={itemsPerView}>
      {/* Figma's root row: arrow, cards, arrow, 16px apart, centred. */}
      <Carousel ref={ref} className={cn("flex items-center gap-4", className)} {...props}>
        <ContentCarouselPrevious aria-label={previousLabel} />
        <CarouselContent className="flex-1 self-stretch">{children}</CarouselContent>
        <ContentCarouselNext aria-label={nextLabel} />
      </Carousel>
    </ItemsPerViewContext.Provider>
  )
)
ContentCarousel.displayName = "ContentCarousel"

export interface ContentCarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

/**
 * One card slot: Figma's content box — `card` on a 1px `border` stroke,
 * 8px radius, `shadow/default/sm` — sized by the root's `itemsPerView`. The
 * slot itself adds no padding: edge-to-edge media goes straight in, text
 * content brings its own padding.
 */
const ContentCarouselItem = React.forwardRef<HTMLDivElement, ContentCarouselItemProps>(
  ({ className, ...props }, ref) => {
    const itemsPerView = React.useContext(ItemsPerViewContext)
    return (
      <CarouselItem
        ref={ref}
        className={cn(
          "overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
          basisClasses[itemsPerView] ?? basisClasses[1],
          className
        )}
        {...props}
      />
    )
  }
)
ContentCarouselItem.displayName = "ContentCarouselItem"

/**
 * The arrows advance one card at a time and disable at the ends, where Figma
 * dims them to 50%. The lucide arrows point backward and forward along the
 * *line*, so each mirrors under RTL — the one sanctioned `rtl:` use, and a
 * mirror rather than a rotation so a diagonal glyph would stay upright.
 */
const ContentCarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { activeIndex, scrollTo } = useCarousel()
  return (
    <button
      ref={ref}
      type="button"
      data-slot="carousel-previous"
      aria-label="Previous"
      disabled={activeIndex <= 0}
      onClick={() => scrollTo(activeIndex - 1)}
      className={cn(arrowClasses, className)}
      {...props}
    >
      <ArrowLeftIcon aria-hidden="true" className="size-4 rtl:-scale-x-100" />
    </button>
  )
})
ContentCarouselPrevious.displayName = "ContentCarouselPrevious"

const ContentCarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { activeIndex, count, scrollTo } = useCarousel()
  const itemsPerView = React.useContext(ItemsPerViewContext)
  return (
    <button
      ref={ref}
      type="button"
      data-slot="carousel-next"
      aria-label="Next"
      // The last page starts at `count - itemsPerView`: past it there is
      // nothing left to bring into view.
      disabled={activeIndex >= count - itemsPerView}
      onClick={() => scrollTo(activeIndex + 1)}
      className={cn(arrowClasses, className)}
      {...props}
    >
      <ArrowRightIcon aria-hidden="true" className="size-4 rtl:-scale-x-100" />
    </button>
  )
})
ContentCarouselNext.displayName = "ContentCarouselNext"

export {
  ContentCarousel,
  ContentCarouselItem,
  ContentCarouselPrevious,
  ContentCarouselNext,
}
