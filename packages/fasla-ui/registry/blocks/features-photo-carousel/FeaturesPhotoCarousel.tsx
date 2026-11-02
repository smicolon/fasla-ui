"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { CarouselDots } from "../../ui/carousel/carousel"
import { FeaturesHeader, FeaturesPhotoSlot, FeaturesSection, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Photo Carousel.
 *
 * A header row, the section header at the start and two outline icon buttons
 * (Secondary, md, rounded: previous and next) at the end (under the heading on
 * Tablet and Mobile), then one slide at a
 * time inside a 1px `border` frame, then the dot stepper. A slide is a photo
 * and a `secondary` panel: a solid Primary counter Badge ("01 / 04"), a 30px
 * title, a 16px line and a primary link with an arrow.
 *
 * Desktop sets the photo (60%) and the panel side by side at 460px; Tablet
 * and Mobile stack them. Only the visitor advances it: there is no autoplay,
 * no timer and no loop. The previous and next buttons disable at the ends,
 * the dots step to any slide, and a change fades the slide in 300ms (at once
 * under reduced motion). All slides sit in one cell, so the height never
 * jumps between slides.
 *
 * Content limits: a slide's title up to 40 characters, its line up to 190
 * and its link up to 24. The other limits are in the block's documentation page.
 */

export interface FeaturesCarouselSlide {
  /** Keys the slide. */
  id: string
  /** The slide's title. */
  title: React.ReactNode
  /** The line under it. */
  description: React.ReactNode
  /** The link's label. */
  linkLabel: React.ReactNode
  /** Where the link goes. Without it, the link calls `onLinkClick` with the slide's `id`. */
  href?: string
  /** The slide's photo. */
  image?: FeaturesPhoto
}

export interface FeaturesPhotoCarouselCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The slides, in order. */
  slides: FeaturesCarouselSlide[]
  /** Names the previous button. */
  previousLabel: string
  /** Names the next button. */
  nextLabel: string
  /** Names the slide group for assistive technology. */
  carouselLabel: string
}

/** Figma's copy for the first slide, English and Arabic; the other three are written for the code, in the same voice. */
const COPY: Record<FeaturesLocale, FeaturesPhotoCarouselCopy> = {
  en: {
    eyebrow: "FEATURE TOUR",
    heading: "See it on a real project",
    previousLabel: "Previous slide",
    nextLabel: "Next slide",
    carouselLabel: "Feature tour",
    slides: [
      {
        id: "templates",
        title: "Every project starts from a template",
        description: "Pick a shape that matches the work — launch, sprint, campaign, intake — and the views, fields and automations come with it. Adjust once and every future project inherits the change.",
        linkLabel: "Browse templates",
      },
      {
        id: "views",
        title: "Views that follow the work",
        description: "Switch between board, table, timeline and chart without rebuilding anything. Every view reads the same records, so a change in one shows up in all of them.",
        linkLabel: "See the views",
      },
      {
        id: "automations",
        title: "Automations you can read",
        description: "Each rule is a sentence: when this happens, do that. Turn one on for a single project or roll it out to every team at once.",
        linkLabel: "Explore automations",
      },
      {
        id: "reports",
        title: "Reports without exports",
        description: "Build a dashboard from the same data the team works in. Share it as a live link and it stays current without anyone refreshing a spreadsheet.",
        linkLabel: "Browse reports",
      },
    ],
  },
  ar: {
    eyebrow: "جولة في الميزات",
    heading: "شاهده على مشروع حقيقي",
    previousLabel: "الشريحة السابقة",
    nextLabel: "الشريحة التالية",
    carouselLabel: "جولة في الميزات",
    slides: [
      {
        id: "templates",
        title: "كل مشروع يبدأ من قالب",
        description: "اختر شكلًا يناسب العمل، سواء إطلاق أو سبرنت أو حملة أو استقبال طلبات، فتأتي معه العروض والحقول والأتمتة. عدّله مرة واحدة ليرث كل مشروع لاحق التغيير.",
        linkLabel: "تصفّح القوالب",
      },
      {
        id: "views",
        title: "عروض تتبع العمل",
        description: "بدّل بين اللوحة والجدول والجدول الزمني والرسم البياني دون إعادة بناء أي شيء. كل عرض يقرأ السجلات نفسها، فيظهر التغيير في أحدها في جميعها.",
        linkLabel: "شاهد العروض",
      },
      {
        id: "automations",
        title: "أتمتة يمكنك قراءتها",
        description: "كل قاعدة جملة واحدة: عندما يحدث هذا، افعل ذلك. فعّلها لمشروع واحد أو عمّمها على كل الفرق دفعة واحدة.",
        linkLabel: "استكشف الأتمتة",
      },
      {
        id: "reports",
        title: "تقارير دون تصدير",
        description: "ابنِ لوحة معلومات من البيانات نفسها التي يعمل عليها الفريق. شاركها برابط حي فتبقى محدَّثة دون أن يحدّث أحد جدول بيانات.",
        linkLabel: "تصفّح التقارير",
      },
    ],
  },
}

export interface FeaturesPhotoCarouselProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "defaultValue">, Partial<FeaturesPhotoCarouselCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** The shown slide, when you control it. */
  index?: number
  /** The slide shown first, when you do not. */
  defaultIndex?: number
  /** Called with the new slide's index when a button or a dot changes it. */
  onIndexChange?: (index: number) => void
  /** Called with the slide's `id` when its link is pressed and the slide has no `href`. */
  onLinkClick?: (id: string) => void
}

export function FeaturesPhotoCarousel({
  locale = "en",
  eyebrow,
  heading,
  slides,
  previousLabel,
  nextLabel,
  carouselLabel,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  onLinkClick,
  className,
  ...props
}: FeaturesPhotoCarouselProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = slides ?? copy.slides
  const [inner, setInner] = React.useState(defaultIndex)
  const index = Math.min(Math.max(indexProp ?? inner, 0), Math.max(list.length - 1, 0))
  const go = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), list.length - 1)
    if (clamped === index) return
    if (indexProp === undefined) setInner(clamped)
    onIndexChange?.(clamped)
  }
  const count = list.length
  const linkClass = "group/link inline-flex items-center gap-2 self-start text-sm font-medium text-primary hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  const arrow = (
    <ArrowRight
      size={16}
      strokeWidth={1.5}
      absoluteStrokeWidth
      aria-hidden
      className="[&:dir(rtl)]:-scale-x-100 motion-safe:transition-transform motion-safe:group-hover/link:translate-x-0.5 motion-safe:rtl:group-hover/link:-translate-x-0.5"
    />
  )

  return (
    <FeaturesSection labelledBy={headingId} gap="md" contentClassName="gap-12" className={className} {...props}>
      <div className="flex flex-col gap-4 [@container(min-width:72rem)]:flex-row [@container(min-width:72rem)]:items-end [@container(min-width:72rem)]:justify-between [@container(min-width:72rem)]:gap-16">
        <FeaturesHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} className="flex-1" />
        <div className="flex shrink-0 gap-2">
          <Button type="button" variant="outline" tone="secondary" size="icon-md" radius="rounded" aria-label={previousLabel ?? copy.previousLabel} disabled={index <= 0} onClick={() => go(index - 1)}>
            <ArrowLeft aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
          </Button>
          <Button type="button" variant="outline" tone="secondary" size="icon-md" radius="rounded" aria-label={nextLabel ?? copy.nextLabel} disabled={index >= count - 1} onClick={() => go(index + 1)}>
            <ArrowRight aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
          </Button>
        </div>
      </div>

      {count > 0 ? (
        <div role="group" aria-roledescription="carousel" aria-label={carouselLabel ?? copy.carouselLabel} className="flex flex-col items-center gap-12">
          <div aria-live="polite" className="grid w-full overflow-hidden rounded-lg border border-border">
            {list.map((slide, position) => {
              const active = position === index
              return (
                <div
                  key={slide.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${position + 1} / ${count}`}
                  aria-hidden={active ? undefined : true}
                  {...(active ? {} : ({ inert: "" } as object))}
                  className={cn(
                    "col-start-1 row-start-1 flex flex-col motion-safe:transition-opacity motion-safe:duration-300 [@container(min-width:72rem)]:flex-row",
                    active ? "opacity-100" : "pointer-events-none opacity-0"
                  )}
                >
                  <FeaturesPhotoSlot photo={slide.image} className="aspect-[294/182] w-full shrink-0 [@container(min-width:48rem)]:aspect-[638/393] [@container(min-width:72rem)]:aspect-auto [@container(min-width:72rem)]:min-h-[458px] [@container(min-width:72rem)]:w-[60%]" />
                  <div className="flex flex-1 flex-col items-start justify-center gap-5 bg-secondary p-6 [@container(min-width:48rem)]:p-10 [@container(min-width:72rem)]:p-12">
                    <Badge variant="solid" tone="primary" size="sm" radius="rounded">
                      <bdi dir="ltr">{`${String(position + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`}</bdi>
                    </Badge>
                    <h3 className="text-2xl leading-8 font-semibold text-secondary-foreground [@container(min-width:48rem)]:text-3xl [@container(min-width:48rem)]:leading-10">{slide.title}</h3>
                    <p className="text-base text-muted-foreground">{slide.description}</p>
                    {slide.href ? (
                      <a href={slide.href} className={linkClass} tabIndex={active ? undefined : -1}>
                        {slide.linkLabel}
                        {arrow}
                      </a>
                    ) : (
                      <button type="button" onClick={() => onLinkClick?.(slide.id)} className={linkClass} tabIndex={active ? undefined : -1}>
                        {slide.linkLabel}
                        {arrow}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <CarouselDots count={count} activeIndex={index} onActiveIndexChange={go} />
        </div>
      ) : null}
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresPhotoCarouselCopy = COPY
