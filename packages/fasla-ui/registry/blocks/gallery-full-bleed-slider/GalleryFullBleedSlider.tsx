"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Carousel, CarouselContent, CarouselItem } from "../../ui/carousel/carousel"

/*
 * Figma: `Gallery` (42478:479), Type=Full-Bleed Slider.
 *
 * One photograph across the whole block at a time, edge to edge, under a
 * scrim, with its caption (eyebrow, heading, description) at the bottom
 * start and the controls ("01 / 05", an outline back arrow and a solid
 * forward arrow) at the bottom end. On Mobile the controls drop under the
 * caption, at the start. No photos come with the block: pass each slide's
 * `image`, and until then each slide is a `muted` placeholder under the same
 * scrim.
 *
 * The slides are the Carousel atom's: a real scroll-snap track, so touch and
 * trackpad swipes work, and the arrow keys move a slide once the track has
 * focus. Each caption scrolls with its own photo; the controls stay put over
 * the track. The arrows wrap from the last slide to the first, which is why
 * Figma's back arrow is live on slide one. Nothing plays on its own.
 *
 * The scrim is dark and the text light in both modes, as Figma draws them: a
 * photograph does not change with the theme. In light mode that is the
 * inverse tokens, `background-inverse` at 45% and `foreground-inverse`; in
 * dark mode the page's own `background` and `foreground` hold the same two
 * colours, so `dark:` switches to them, as Error State Full-Bleed Photo
 * does. The buttons are the library's; only their focus ring is set here,
 * light, so it shows on the photo.
 *
 * Figma has no section heading, so the `h2` is visually hidden and each
 * slide's heading is an `h3`.
 *
 * In Arabic the caption moves to the right, the controls to the left (on
 * Mobile, to the right under the caption), and the arrows point the other
 * way. The photographs are never flipped, and the counter's numerals stay
 * left to right.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container, so the block lays out for the room it is
 * given, such as a docs preview narrower than the screen. The base classes
 * are Figma's Mobile (360); `[@container(min-width:48rem)]:` is its Tablet,
 * from 768px, and `[@container(min-width:64rem)]:` its Desktop, from
 * 1024px. The section's own padding still follows the window, since an
 * element can't query itself.
 */

export interface GalleryFullBleedSliderPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryFullBleedSliderSlide {
  /** The short label above the heading, in parts. A middle dot goes between each part. */
  eyebrow: React.ReactNode[]
  /** The slide's heading, an `h3`. */
  heading: React.ReactNode
  /** The line of text under the heading. */
  description: React.ReactNode
  /** The photo across the slide. A `muted` placeholder when missing. */
  image?: GalleryFullBleedSliderPhoto
}

export interface GalleryFullBleedSliderCopy {
  /** The section's heading, an `h2`. Visually hidden: Figma draws none. */
  heading: React.ReactNode
  /** The slides, in order. Each has an `eyebrow`, a `heading`, a `description` and an optional `image`. */
  slides: GalleryFullBleedSliderSlide[]
  /** The back arrow's accessible name. */
  previousLabel: string
  /** The forward arrow's accessible name. */
  nextLabel: string
  /** Shown in place of the slides when `slides` is empty. */
  empty: React.ReactNode
}

/*
 * Figma captions only the first slide ("Light studies from the coast
 * house"). The other four follow its pattern so every slide has one.
 */

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryFullBleedSliderCopy> = {
  en: {
    heading: "Photo stories",
    slides: [
      {
        eyebrow: ["EDITORIAL", "01"],
        heading: "Light studies from the coast house",
        description:
          "Twelve frames shot over a single afternoon as the fog lifted. Swipe or use the arrows to move through the set.",
      },
      {
        eyebrow: ["EDITORIAL", "02"],
        heading: "Morning on the salt flats",
        description: "Wide, quiet frames from the first hour after sunrise, before the wind picked up.",
      },
      {
        eyebrow: ["EDITORIAL", "03"],
        heading: "A studio in the old port",
        description: "Tools, worktables and north light in a ceramicist’s workshop by the harbour.",
      },
      {
        eyebrow: ["EDITORIAL", "04"],
        heading: "Concrete and shade",
        description: "A walk through the courtyards of a modernist campus at midday.",
      },
      {
        eyebrow: ["EDITORIAL", "05"],
        heading: "Last light in the valley",
        description: "The set closes on the drive home, as the hills turn from gold to blue.",
      },
    ],
    previousLabel: "Previous slide",
    nextLabel: "Next slide",
    empty: "No photos yet.",
  },
  ar: {
    heading: "قصص مصوّرة",
    slides: [
      {
        eyebrow: ["تحريري", <bdi key="n" dir="ltr">01</bdi>],
        heading: "دراسات الضوء في بيت الساحل",
        description: "اثنتا عشرة صورة في عصر واحد مع انقشاع الضباب. اسحب أو استخدم الأسهم للتنقل بين الصور.",
      },
      {
        eyebrow: ["تحريري", <bdi key="n" dir="ltr">02</bdi>],
        heading: "صباح على السبخات الملحية",
        description: "لقطات واسعة وهادئة من الساعة الأولى بعد الشروق، قبل أن تشتد الريح.",
      },
      {
        eyebrow: ["تحريري", <bdi key="n" dir="ltr">03</bdi>],
        heading: "ورشة في الميناء القديم",
        description: "أدوات وطاولات عمل وضوء شمالي في ورشة خزّاف قرب المرفأ.",
      },
      {
        eyebrow: ["تحريري", <bdi key="n" dir="ltr">04</bdi>],
        heading: "الخرسانة والظل",
        description: "جولة في باحات حرم جامعي حداثي عند منتصف النهار.",
      },
      {
        eyebrow: ["تحريري", <bdi key="n" dir="ltr">05</bdi>],
        heading: "آخر ضوء في الوادي",
        description: "تُختتم المجموعة بطريق العودة، حين تتحوّل التلال من الذهبي إلى الأزرق.",
      },
    ],
    previousLabel: "الشريحة السابقة",
    nextLabel: "الشريحة التالية",
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

/** "01", "02": Figma's counter pads to two digits. */
const pad = (n: number) => String(n).padStart(2, "0")

/** Each slide's height, and the caption's and controls' inset from its edges. */
const SLIDE = "h-[480px] [@container(min-width:48rem)]:h-[560px] [@container(min-width:64rem)]:h-[720px]"
const INSET = "mx-auto w-full max-w-[1440px] px-4 py-8 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-12 [@container(min-width:64rem)]:px-24 [@container(min-width:64rem)]:py-16"

/** The library's buttons with a light focus ring, so it shows on the photo. */
const ON_PHOTO_RING = "after:ring-foreground-inverse dark:after:ring-foreground"

const ICON = "size-4 [&:dir(rtl)]:-scale-x-100"

export interface GalleryFullBleedSliderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryFullBleedSliderCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The slide shown at first, by index. Figma shows the first.
   * @default 0
   */
  defaultActiveIndex?: number
  /** Called with the new index whenever the slide changes, by arrow, key or swipe. */
  onActiveIndexChange?: (index: number) => void
}

export function GalleryFullBleedSlider({
  locale = "en",
  heading,
  slides,
  previousLabel,
  nextLabel,
  empty,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  className,
  ...props
}: GalleryFullBleedSliderProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = slides ?? copy.slides
  const count = list.length
  const [requested, setRequested] = React.useState(defaultActiveIndex)
  const active = count === 0 ? 0 : Math.max(0, Math.min(count - 1, requested))

  const select = (index: number) => {
    if (count === 0) return
    const next = ((index % count) + count) % count
    if (next === active) return
    setRequested(next)
    onActiveIndexChange?.(next)
  }

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background", className)} {...props}>
      <h2 id={headingId} className="sr-only">
        {heading ?? copy.heading}
      </h2>

      {count === 0 ? (
        <div className={cn("flex items-center justify-center bg-muted", SLIDE)}>
          <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        </div>
      ) : (
        <Carousel aria-labelledby={headingId} activeIndex={active} onActiveIndexChange={select}>
          <CarouselContent className="gap-0 focus-visible:outline-offset-[-4px] focus-visible:outline-foreground-inverse focus-visible:dark:outline-foreground">
            {list.map((slide, index) => (
              <CarouselItem key={index} className={cn("relative overflow-hidden bg-muted", SLIDE)}>
                {slide.image ? (
                  <img
                    src={slide.image.src}
                    alt={slide.image.alt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : null}
                <div aria-hidden="true" className="absolute inset-0 bg-background-inverse/[0.45] dark:bg-background/[0.45]" />
                {/* On Mobile the controls sit under the caption: 24px gap + the 40px row. */}
                <div className={cn(INSET, "relative flex h-full flex-col justify-end pb-24 [@container(min-width:48rem)]:pb-12 [@container(min-width:64rem)]:pb-16")}>
                  <div className="flex flex-col gap-3 [@container(min-width:48rem)]:max-w-[min(560px,calc(100%-184px))]">
                    <p className="whitespace-nowrap text-xs font-medium text-muted-foreground-inverse dark:text-muted-foreground">
                      <Parts parts={slide.eyebrow} />
                    </p>
                    <h3 className="text-2xl font-semibold text-foreground-inverse [@container(min-width:48rem)]:text-3xl dark:text-foreground">
                      {slide.heading}
                    </h3>
                    <p className="text-base text-muted dark:text-foreground">{slide.description}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="pointer-events-none absolute inset-0">
            <div className={cn("flex h-full items-end justify-start [@container(min-width:48rem)]:justify-end", INSET)}>
              <div className="pointer-events-auto flex items-center gap-4">
                <p
                  aria-live="polite"
                  aria-atomic="true"
                  className="whitespace-nowrap text-sm font-medium text-foreground-inverse dark:text-foreground"
                >
                  <bdi dir="ltr">
                    {pad(active + 1)} / {pad(count)}
                  </bdi>
                </p>
                <Button
                  variant="outline"
                  size="icon-lg"
                  radius="rounded"
                  aria-label={previousLabel ?? copy.previousLabel}
                  onClick={() => select(active - 1)}
                  className={ON_PHOTO_RING}
                >
                  <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.5} absoluteStrokeWidth className={ICON} />
                </Button>
                <Button
                  size="icon-lg"
                  radius="rounded"
                  aria-label={nextLabel ?? copy.nextLabel}
                  onClick={() => select(active + 1)}
                  className={ON_PHOTO_RING}
                >
                  <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} absoluteStrokeWidth className={ICON} />
                </Button>
              </div>
            </div>
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
export const galleryFullBleedSliderCopy = COPY
