"use client"

import * as React from "react"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, type ButtonProps } from "../button/button"
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
 * The arrows are Figma's Icon Button, which is the Button atom at an icon
 * size: Outline, Secondary, `sm` (32px, a 16px icon), Rounded. Its focus
 * ring, hover, pressed and disabled looks are the Button's own; disabled is
 * the Enabled look at 50%, as Figma dims the arrows at the ends.
 *
 * They advance one card at a time. The lucide arrows point backward and
 * forward along the *line*, so each mirrors in RTL, reading its own
 * direction (`:dir(rtl)`) rather than any ancestor's, and a mirror rather
 * than a rotation so a diagonal glyph would stay upright.
 */
type ArrowProps = Omit<ButtonProps, "variant" | "tone" | "size" | "radius" | "asChild">

const arrowProps = { type: "button", variant: "outline", size: "icon-sm", radius: "rounded" } as const

const ContentCarouselPrevious = React.forwardRef<HTMLButtonElement, ArrowProps>(
  ({ className, ...props }, ref) => {
    const { activeIndex, scrollTo } = useCarousel()
    return (
      <Button
        ref={ref}
        {...arrowProps}
        data-slot="carousel-previous"
        aria-label="Previous"
        disabled={activeIndex <= 0}
        onClick={() => scrollTo(activeIndex - 1)}
        className={className}
        {...props}
      >
        <ArrowLeftIcon aria-hidden="true" className="[&:dir(rtl)]:-scale-x-100" />
      </Button>
    )
  }
)
ContentCarouselPrevious.displayName = "ContentCarouselPrevious"

const ContentCarouselNext = React.forwardRef<HTMLButtonElement, ArrowProps>(
  ({ className, ...props }, ref) => {
    const { activeIndex, count, lastIndex, scrollTo } = useCarousel()
    const itemsPerView = React.useContext(ItemsPerViewContext)
    return (
      <Button
        ref={ref}
        {...arrowProps}
        data-slot="carousel-next"
        aria-label="Next"
        // The last page starts at `count - itemsPerView`: past it there is
        // nothing left to bring into view. The carousel measures the same stop
        // from layout; the arithmetic holds before layout exists.
        disabled={activeIndex >= Math.min(lastIndex, count - itemsPerView)}
        onClick={() => scrollTo(activeIndex + 1)}
        className={className}
        {...props}
      >
        <ArrowRightIcon aria-hidden="true" className="[&:dir(rtl)]:-scale-x-100" />
      </Button>
    )
  }
)
ContentCarouselNext.displayName = "ContentCarouselNext"

export {
  ContentCarousel,
  ContentCarouselItem,
  ContentCarouselPrevious,
  ContentCarouselNext,
}
