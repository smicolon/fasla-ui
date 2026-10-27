"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Carousel, CarouselContent, CarouselDots, CarouselItem, useCarousel } from "../../ui/carousel/carousel"

/*
 * Figma: `Gallery` (42478:479), Type=Horizontal Scroll Rail.
 *
 * A header (eyebrow and heading at the start, an arrow pair at the end) over
 * a single row of photo cards that runs off the end of the page, and a
 * footer with the Carousel dots at the start and a hint at the end. Each
 * card is a photo with a title and a meta line ("January · 12 photos")
 * under it. No photos come with the block: pass each card's `image`, and
 * until then each photo is a `muted` placeholder of the same size.
 *
 * The rail is the Carousel atom: a real scroll-snap track, so touch,
 * trackpad and the arrow keys (once the track has focus) all scroll it, and
 * the dots follow the card snapped to the start. The arrows move one card
 * and stop at the ends. Nothing scrolls on its own.
 *
 * Figma lines the first card up with the header but lets the row run to the
 * page's edge, the last card in view cut off to show there is more. So the
 * block is a three-column grid, a gutter either side of the 1248px column:
 * the header and footer sit in the middle column, and the track spans the
 * middle and end columns. It needs no viewport units, so it bleeds to the
 * block's edge wherever the block is placed. The track has no end padding,
 * because the Carousel counts its dots from the track's width: every dot
 * names a card the track can bring to the start.
 *
 * Figma's motion notes ask for the arrows to be hidden on a phone, but its
 * Mobile variant draws them, under the heading, and the hint still says
 * "use the arrows". The drawing wins: they stay.
 *
 * In Arabic the row runs right to left and bleeds off the left edge, the
 * arrows move to the left of the header and point the other way, and the
 * dots and hint swap sides. The photographs are never flipped, and the
 * numerals stay left to right.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container, so the block lays out for the room it is
 * given, such as a docs preview narrower than the screen. The base classes
 * are Figma's Mobile (360); `[@container(min-width:48rem)]:` is its Tablet,
 * from 768px, and `[@container(min-width:64rem)]:` its Desktop, from
 * 1024px. The section's own padding still follows the window, since an
 * element can't query itself.
 */

export interface GalleryHorizontalScrollRailPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryHorizontalScrollRailItem {
  /** The card's title, under the photo. */
  title: React.ReactNode
  /** The line under the title, in parts. A middle dot goes between each part. */
  meta: React.ReactNode[]
  /** The card's photo. A `muted` placeholder when missing. */
  image?: GalleryHorizontalScrollRailPhoto
}

export interface GalleryHorizontalScrollRailCopy {
  /** The short label above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. It also names the carousel. */
  heading: React.ReactNode
  /** The cards, in order from the start of the rail. Figma draws five. */
  items: GalleryHorizontalScrollRailItem[]
  /** The line of help beside the dots. */
  hint: React.ReactNode
  /** The accessible name of the back arrow. */
  previousLabel: string
  /** The accessible name of the forward arrow. */
  nextLabel: string
  /** Shown in place of the rail when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryHorizontalScrollRailCopy> = {
  en: {
    eyebrow: "STORIES",
    heading: "Scroll through the year",
    items: [
      { title: "Kick-off in the mountains", meta: ["January", "12 photos"] },
      { title: "Dashboards, day one", meta: ["March", "8 photos"] },
      { title: "The people behind the product", meta: ["May", "20 photos"] },
      { title: "Riverside offices open", meta: ["July", "15 photos"] },
      { title: "Hack week", meta: ["August", "32 photos"] },
    ],
    hint: "Drag or use the arrows to scroll",
    previousLabel: "Previous",
    nextLabel: "Next",
    empty: "No photos yet.",
  },
  ar: {
    eyebrow: "حكايات",
    heading: "تنقّل عبر العام",
    items: [
      {
        title: "انطلاقة في الجبال",
        meta: [
          "يناير",
          <>
            <bdi dir="ltr">12</bdi> صورة
          </>,
        ],
      },
      {
        title: "لوحات المعلومات، اليوم الأول",
        meta: [
          "مارس",
          <>
            <bdi dir="ltr">8</bdi> صور
          </>,
        ],
      },
      {
        title: "الأشخاص خلف المنتج",
        meta: [
          "مايو",
          <>
            <bdi dir="ltr">20</bdi> صورة
          </>,
        ],
      },
      {
        title: "افتتاح مكاتب ريفرسايد",
        meta: [
          "يوليو",
          <>
            <bdi dir="ltr">15</bdi> صورة
          </>,
        ],
      },
      {
        title: "أسبوع الابتكار",
        meta: [
          "أغسطس",
          <>
            <bdi dir="ltr">32</bdi> صورة
          </>,
        ],
      },
    ],
    hint: "اسحب أو استخدم الأسهم للتنقل",
    previousLabel: "السابق",
    nextLabel: "التالي",
    empty: "لا توجد صور بعد.",
  },
}

/** A line made of parts, each isolated, with a middle dot between them that never flips. */
function Parts({ parts }: { parts: React.ReactNode[] }) {
  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 ? <span aria-hidden="true"> · </span> : null}
          <bdi>{part}</bdi>
        </React.Fragment>
      ))}
    </>
  )
}

const ICON = "[&:dir(rtl)]:-scale-x-100"

/** Figma's arrow pair: an outline back arrow and a solid forward one. They stop at the ends. */
function RailArrows({ previousLabel, nextLabel }: { previousLabel: string; nextLabel: string }) {
  const { activeIndex, lastIndex, scrollTo } = useCarousel()
  return (
    <div className="flex shrink-0 gap-2">
      <Button
        variant="outline"
        size="icon-md"
        radius="rounded"
        aria-label={previousLabel}
        disabled={activeIndex <= 0}
        onClick={() => scrollTo(activeIndex - 1)}
      >
        <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.5} absoluteStrokeWidth className={ICON} />
      </Button>
      <Button
        size="icon-md"
        radius="rounded"
        aria-label={nextLabel}
        disabled={activeIndex >= lastIndex}
        onClick={() => scrollTo(activeIndex + 1)}
      >
        <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} absoluteStrokeWidth className={ICON} />
      </Button>
    </div>
  )
}

/** A gutter either side of the 1248px column, as wide as Figma's section padding at least. */
const GRID =
  "grid grid-cols-[minmax(2rem,1fr)_minmax(0,1248px)_minmax(2rem,1fr)] [@container(min-width:48rem)]:grid-cols-[minmax(4rem,1fr)_minmax(0,1248px)_minmax(4rem,1fr)] [@container(min-width:64rem)]:grid-cols-[minmax(6rem,1fr)_minmax(0,1248px)_minmax(6rem,1fr)]"

export interface GalleryHorizontalScrollRailProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryHorizontalScrollRailCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The card to start on, scrolled to the start of the rail. The first, by default. */
  defaultActiveIndex?: number
  /** Called with the index of the card at the start of the rail whenever it changes. */
  onActiveIndexChange?: (index: number) => void
}

export function GalleryHorizontalScrollRail({
  locale = "en",
  eyebrow,
  heading,
  items,
  hint,
  previousLabel,
  nextLabel,
  empty,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  className,
  ...props
}: GalleryHorizontalScrollRailProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items

  const header = (
    <div className="flex min-w-0 flex-col gap-4 text-start">
      <p className="text-xs font-medium text-primary">{eyebrow ?? copy.eyebrow}</p>
      <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:48rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
        {heading ?? copy.heading}
      </h2>
    </div>
  )

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background py-8 md:py-16 lg:py-24", className)} {...props}>
      {list.length === 0 ? (
        <div className={cn(GRID, "gap-y-10")}>
          <div className="col-start-2">{header}</div>
          <p className="col-start-2 py-12 text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        </div>
      ) : (
        <Carousel
          aria-labelledby={headingId}
          defaultActiveIndex={defaultActiveIndex}
          onActiveIndexChange={onActiveIndexChange}
          className={cn(GRID, "gap-y-10")}
        >
          <div className="col-start-2 flex flex-col gap-4 [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-center [@container(min-width:48rem)]:justify-between [@container(min-width:48rem)]:gap-16">
            {header}
            <RailArrows previousLabel={previousLabel ?? copy.previousLabel} nextLabel={nextLabel ?? copy.nextLabel} />
          </div>

          <CarouselContent className="col-start-2 col-end-4 gap-6">
            {list.map((item, index) => (
              <CarouselItem key={index} className="group flex basis-[280px] flex-col gap-3 [@container(min-width:48rem)]:basis-[300px] [@container(min-width:64rem)]:basis-[352px]">
                <div className="relative h-[200px] overflow-hidden rounded-lg bg-muted [@container(min-width:48rem)]:h-[240px] [@container(min-width:64rem)]:h-[300px]">
                  {item.image ? (
                    <img
                      src={item.image.src}
                      alt={item.image.alt}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                    />
                  ) : null}
                </div>
                <div className="flex min-w-0 flex-col gap-1 text-start">
                  <p className="truncate text-base font-semibold text-foreground">{item.title}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    <Parts parts={item.meta} />
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="col-start-2 flex flex-col gap-3 [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-center [@container(min-width:48rem)]:justify-between [@container(min-width:48rem)]:gap-6">
            <CarouselDots className="justify-start" />
            <p className="text-sm text-muted-foreground [@container(min-width:48rem)]:whitespace-nowrap">{hint ?? copy.hint}</p>
          </div>
        </Carousel>
      )}
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const galleryHorizontalScrollRailCopy = COPY
