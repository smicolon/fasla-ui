"use client"

import * as React from "react"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Carousel, CarouselContent, CarouselDots, CarouselItem, useCarousel } from "../../ui/carousel/carousel"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Post Carousel with Controls.
 *
 * A row of post cards that scrolls sideways, on the page background. A header
 * with an eyebrow, a title and a pair of arrow buttons at its end (an outline
 * back arrow and a solid forward one); under it the cards, 320 wide and 24
 * apart, each a `card` panel with a cover, a category, a title and a line of
 * date and read time; under them the Carousel atom's dots. Each card is one
 * link named by its title.
 *
 * The track is the Carousel atom, as Gallery's rail is: a real scroll-snap
 * scroller, so touch, trackpad and the keyboard all work, and the direction
 * comes from the page's `dir`. A step is one card and its gap (344px), and the
 * card that shows only in part is the sign that there is more. The arrows stop at
 * the ends (they are `aria-disabled` there, and stay focusable) and the dots are buttons that jump to a view.
 * There is no autoplay: the track moves only when the reader drags, presses an
 * arrow or a dot, or uses the keys. Reduced motion jumps to the card at once.
 *
 * Desktop (Figma 1440) shows the 320px cards in a 1280 stage. Tablet (768) shows
 * the same cards in a 720 stage, so the step is still 344px. Mobile (360) makes
 * the cards 280 wide, so the step is 304px and one card shows with a 24px peek;
 * the arrows move under the heading.
 *
 * Arabic mirrors by the page's `dir`: the track runs right to left, so the first
 * card is at the right and the peek is on the left. The Next button is the
 * solid one on the left, with an arrow pointing left, and Previous is the
 * outline one on the right, with an arrow pointing right. Photographs are never
 * flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsPostCarouselWithControlsPost {
  /** The cover. Without one the cover is a placeholder of the same size. */
  image?: { src: string; alt: string }
  /** The category. */
  category: React.ReactNode
  /** The title, an `h3`, and the card's accessible name. */
  title: React.ReactNode
  /** The date, as written: "Aug 4, 2026". */
  date: React.ReactNode
  /** The read time, as written: "6 min read". */
  readTime: React.ReactNode
  /** Where the card goes. */
  href: string
}

export interface BlogCardsPostCarouselWithControlsCopy {
  /** The small line over the title. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section title, an `h2`, which names the carousel. */
  heading: React.ReactNode
  /** The back button's accessible name. */
  previousLabel: string
  /** The forward button's accessible name. */
  nextLabel: string
  /** The cards, in order. */
  posts: BlogCardsPostCarouselWithControlsPost[]
  /** Shown instead of the carousel when `posts` is empty. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsPostCarouselWithControlsCopy> = {
  en: {
    eyebrow: "MORE FROM THE BLOG",
    heading: "Keep scrolling sideways",
    previousLabel: "Previous posts",
    nextLabel: "Next posts",
    posts: [
      { category: "FOUNDATIONS", title: "The 8-point grid is not a religion", date: "Aug 4, 2026", readTime: "6 min read", href: "#" },
      { category: "PRODUCT", title: "The empty state is a product decision", date: "Jun 16, 2026", readTime: "6 min read", href: "#" },
      { category: "RESEARCH", title: "What our first design-system survey told us", date: "May 26, 2026", readTime: "9 min read", href: "#" },
      { category: "RESEARCH", title: "Reading the room: research at Fasla", date: "Mar 31, 2026", readTime: "7 min read", href: "#" },
      { category: "COMPANY", title: "Where our design system goes next", date: "Jan 27, 2026", readTime: "6 min read", href: "#" },
    ],
    emptyLabel: "No articles yet.",
  },
  ar: {
    eyebrow: "المزيد من المدونة",
    heading: "تابع التمرير جانبياً",
    previousLabel: "المقالات السابقة",
    nextLabel: "المقالات التالية",
    posts: [
      { category: "الأساسيات", title: "شبكة الثماني نقاط ليست عقيدة", date: "4 أغسطس 2026", readTime: "قراءة 6 دقائق", href: "#" },
      { category: "المنتج", title: "الحالة الفارغة قرار منتج", date: "16 يونيو 2026", readTime: "قراءة 6 دقائق", href: "#" },
      { category: "الأبحاث", title: "ما أخبرنا به أول استبيان لنظام التصميم", date: "26 مايو 2026", readTime: "قراءة 9 دقائق", href: "#" },
      { category: "الأبحاث", title: "قراءة المشهد: الأبحاث في فاصلة", date: "31 مارس 2026", readTime: "قراءة 7 دقائق", href: "#" },
      { category: "الشركة", title: "إلى أين يتجه نظام تصميمنا", date: "27 يناير 2026", readTime: "قراءة 6 دقائق", href: "#" },
    ],
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsPostCarouselWithControlsCopy = COPY

/** The arrows draw `arrow-left` and `arrow-right`; the nearest `dir` mirrors them, so Next points left in Arabic. */
const ICON = "[&:dir(rtl)]:-scale-x-100"

/**
 * Figma's pair: an outline back arrow and a solid forward one. At the ends an
 * arrow is `aria-disabled`, not `disabled`: it looks disabled (the Button's own
 * `aria-disabled` styles) and a press does nothing, but it stays focusable, so
 * keyboard focus is not thrown out of the controls when the last card is reached.
 */
function Controls({ previousLabel, nextLabel }: { previousLabel: string; nextLabel: string }) {
  const { activeIndex, lastIndex, scrollTo } = useCarousel()
  const atStart = activeIndex <= 0
  const atEnd = activeIndex >= lastIndex
  return (
    <div className="flex shrink-0 gap-2">
      <Button
        variant="outline"
        size="icon-lg"
        radius="rounded"
        aria-label={previousLabel}
        aria-disabled={atStart || undefined}
        onClick={() => {
          if (!atStart) scrollTo(activeIndex - 1)
        }}
      >
        <ArrowLeftIcon aria-hidden="true" className={cn("size-4", ICON)} />
      </Button>
      <Button
        size="icon-lg"
        radius="rounded"
        aria-label={nextLabel}
        aria-disabled={atEnd || undefined}
        onClick={() => {
          if (!atEnd) scrollTo(activeIndex + 1)
        }}
      >
        <ArrowRightIcon aria-hidden="true" className={cn("size-4", ICON)} />
      </Button>
    </div>
  )
}

export interface BlogCardsPostCarouselWithControlsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsPostCarouselWithControlsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The card to start on. The first, by default. */
  defaultActiveIndex?: number
  /** Called with the index of the card at the start of the view whenever it changes. */
  onActiveIndexChange?: (index: number) => void
}

export function BlogCardsPostCarouselWithControls({
  locale = "en",
  eyebrow,
  heading,
  previousLabel,
  nextLabel,
  posts,
  emptyLabel,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  className,
  ...props
}: BlogCardsPostCarouselWithControlsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const titleId = React.useId()
  const list = posts ?? copy.posts
  const line = eyebrow ?? copy.eyebrow

  const header = (
    <div className="flex min-w-0 flex-col gap-2">
      {line ? <p className="text-xs font-medium uppercase text-muted-foreground">{line}</p> : null}
      <h2
        id={headingId}
        className="text-3xl font-semibold text-foreground [@container(min-width:40rem)]:text-4xl"
      >
        {heading ?? copy.heading}
      </h2>
    </div>
  )

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:px-20 lg:py-24",
        className
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1280px]">
        {list.length === 0 ? (
          <div className="flex flex-col gap-8">
            {header}
            <p className="text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
          </div>
        ) : (
          <Carousel
            aria-labelledby={headingId}
            defaultActiveIndex={defaultActiveIndex}
            onActiveIndexChange={onActiveIndexChange}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-8">
              {header}
              <Controls previousLabel={previousLabel ?? copy.previousLabel} nextLabel={nextLabel ?? copy.nextLabel} />
            </div>

            <CarouselContent className="gap-6">
              {list.map((post, index) => (
                <CarouselItem key={index} className="flex basis-[280px] [@container(min-width:40rem)]:basis-[320px]">
                  <a
                    href={post.href}
                    aria-labelledby={`${titleId}-${index}`}
                    className="flex w-full flex-col overflow-hidden rounded-lg border bg-card [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <div className="relative aspect-[280/158] w-full overflow-hidden bg-muted [@container(min-width:40rem)]:aspect-[320/180]">
                      {post.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.image.src} alt={post.image.alt} loading="lazy" className="absolute inset-0 size-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2 p-5">
                      <span className="text-xs font-medium uppercase text-muted-foreground">{post.category}</span>
                      <h3 id={`${titleId}-${index}`} className="text-lg font-semibold text-foreground">
                        {post.title}
                      </h3>
                      <span className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{post.date}</span>
                        <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
                        <span>{post.readTime}</span>
                      </span>
                    </div>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselDots />
          </Carousel>
        )}
      </div>
    </section>
  )
}
