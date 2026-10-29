"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { CarouselDots } from "../../ui/carousel/carousel"
import {
  Isolated,
  SocialProofQuote,
  SocialProofSection,
  SocialProofStepper,
  stepKeys,
  useStepper,
  useSwipeStep,
  type SocialProofLocale,
  type SocialProofPerson,
  type SocialProofPhotos,
} from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Spotlight Carousel.
 *
 * One quote at a time, centred in 2XL (XL on phones), the author under it
 * with the Avatar drawn at 56px, previous and next arrows (Icon Button,
 * Outline xs) either side, and the Carousel dots under it. On phones the
 * arrows drop below the quote, either side of the dots.
 *
 * Motion (Figma's ⚡ Motion note): arrows and dots step through four quotes,
 * one at a time. Manual only: no autoplay, no timer, and paging stops at the
 * first and last quote instead of wrapping, so previous is disabled on the
 * first. On change the outgoing quote fades out and the new quote, avatar and
 * name slide up 10px with a fade (slideUp, 180ms); the active dot stretches
 * to a pill. The arrow keys move between quotes; Tab reaches the arrows and
 * the dots. On phones, swiping the quote also steps. Reduced motion: opacity
 * only, 120ms. In RTL the first quote is the rightmost dot, and the left
 * arrow goes to the next quote.
 *
 * Figma shows the first quote. The other three are quotes the same people
 * give elsewhere in the set: Tariq Zaki's from Centered Logo Spotlight, Ziad
 * Karam's from Overlay Photo Quote and Yousef Amin's from Dark Editorial
 * Split.
 */

export interface SocialProofSpotlightCarouselItem {
  /** Up to 164 characters in English, 133 in Arabic. */
  quote: React.ReactNode
  author: SocialProofPerson
}

export interface SocialProofSpotlightCarouselCopy {
  /** Names the carousel for assistive tech. */
  label: string
  /** The quotes, in order. Four, as Figma's dots count them. */
  items: SocialProofSpotlightCarouselItem[]
}

const p = (id: string, name: string, role: string): SocialProofPerson => ({ id, name, role })

/** Figma's copy, English and Arabic. Every person and company is invented. */
const COPY: Record<SocialProofLocale, SocialProofSpotlightCarouselCopy> = {
  en: {
    label: "Customer quotes",
    items: [
      {
        quote: "“Support tickets about visual bugs dropped to almost zero. Our team finally talks about features, not fixes.”",
        author: p("rashed-al-amri", "Rashed Al-Amri", "Design Ops Manager, Willow & Co"),
      },
      {
        quote: "“Fasla turned our design language into a growth channel. Every launch ships looking exactly like us — on the first try.”",
        author: p("tariq-zaki", "Tariq Zaki", "Head of Product, Marlow HR"),
      },
      {
        quote: "“Half our team works from the field. Fasla is why the app they carry looks as considered as the site we pitch with.”",
        author: p("ziad-karam", "Ziad Karam", "CEO, Quillfield"),
      },
      {
        quote: "“Fasla set a new bar for quality — and the team hit it while shipping ahead of schedule.”",
        author: p("yousef-amin", "Yousef Amin", "Co-founder, Halcyon Games"),
      },
    ],
  },
  ar: {
    label: "اقتباسات العملاء",
    items: [
      {
        quote: "«كادت بلاغات الأخطاء البصرية تختفي من الدعم، وصار فريقنا يناقش الميزات أخيرًا لا الإصلاحات.»",
        author: p("rashed-al-amri", "راشد العمري", "مدير عمليات التصميم، ويلو آند كو"),
      },
      {
        quote: "«جعلت فاصلة هويتنا البصرية مصدرًا للنمو، فكل إطلاق يخرج بصورتنا تمامًا من المحاولة الأولى.»",
        author: p("tariq-zaki", "طارق زكي", "رئيس المنتج، مارلو إتش آر"),
      },
      {
        quote: "«نصف فريقنا يعمل في الميدان، وبفضل فاصلة يبدو التطبيق الذي يستخدمونه متقنًا كموقعنا الذي نقدّم به عروضنا.»",
        author: p("ziad-karam", "زياد كرم", "الرئيس التنفيذي، كويلفيلد"),
      },
      {
        quote: "«رفعت فاصلة سقف الجودة، وبلغه الفريق وأطلق قبل موعده.»",
        author: p("yousef-amin", "يوسف أمين", "شريك مؤسس، هالسيون غيمز"),
      },
    ],
  },
}

/** Each dot's accessible name, per language. */
const DOT_LABEL: Record<SocialProofLocale, (index: number, count: number) => string> = {
  en: (index, count) => `Quote ${index + 1} of ${count}`,
  ar: (index, count) => `الاقتباس ${index + 1} من ${count}`,
}

export interface SocialProofSpotlightCarouselProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofSpotlightCarouselCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Avatar photos by person id. Without them the avatars show initials. */
  photos?: SocialProofPhotos
  /** The quote shown, from 0, to control the carousel. */
  index?: number
  /** Called when the arrows, dots, keys or a swipe change the quote. */
  onIndexChange?: (index: number) => void
}

export function SocialProofSpotlightCarousel({
  locale = "en",
  label,
  items,
  photos,
  index: indexProp,
  onIndexChange,
  className,
  ...props
}: SocialProofSpotlightCarouselProps) {
  const copy = COPY[locale]
  const list = items ?? copy.items
  const slideId = React.useId()
  const { ref, index, go } = useStepper<HTMLDivElement>({ count: list.length, index: indexProp, onIndexChange })
  const swipe = useSwipeStep((delta) => go(index + delta))
  const item = list[index]
  if (!item) return null

  return (
    <SocialProofSection
      aria-label={label ?? copy.label}
      aria-roledescription="carousel"
      className={cn("lg:px-24", className)}
      contentClassName="max-w-[1248px]"
      onKeyDown={stepKeys(index, list.length, go)}
      {...props}
    >
      <div
        className={cn(
          "grid w-full items-center gap-x-5 gap-y-10 [grid-template-areas:'slide_slide_slide_slide_slide'_'._prev_dots_next_.'] [grid-template-columns:1fr_auto_auto_auto_1fr]",
          "[@container(min-width:40rem)]:gap-x-10 [@container(min-width:40rem)]:px-4 [@container(min-width:40rem)]:[grid-template-areas:'prev_slide_next'_'._dots_.'] [@container(min-width:40rem)]:[grid-template-columns:auto_1fr_auto]",
          "[@container(min-width:64rem)]:px-16"
        )}
      >
        <SocialProofStepper
          index={index}
          count={list.length}
          onIndexChange={go}
          locale={locale}
          variant="outline"
          controls={slideId}
          className="contents [&>*:first-child]:[grid-area:prev] [&>*:last-child]:[grid-area:next]"
        />
        <div
          ref={ref}
          id={slideId}
          role="group"
          aria-roledescription="slide"
          aria-label={DOT_LABEL[locale](index, list.length)}
          aria-live="polite"
          tabIndex={0}
          className="rounded-md [grid-area:slide] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...swipe}
        >
          <figure className="m-0 flex flex-col items-center gap-8 text-center">
            <SocialProofQuote
              key={`quote-${index}`}
              data-step-item="slide"
              quote={item.quote}
              className="text-xl text-foreground [@container(min-width:40rem)]:text-2xl"
            />
            <figcaption key={`author-${index}`} data-step-item="slide" className="flex flex-col items-center gap-2">
              <Avatar aria-hidden size="32" radius="rounded" src={photos?.[item.author.id]} name={item.author.name} className="size-14" />
              <span className="flex flex-col">
                <cite className="text-sm font-medium not-italic text-foreground">{item.author.name}</cite>
                <span className="text-xs text-muted-foreground">
                  <Isolated>{item.author.role}</Isolated>
                </span>
              </span>
            </figcaption>
          </figure>
        </div>
        <CarouselDots
          count={list.length}
          activeIndex={index}
          onActiveIndexChange={go}
          label={DOT_LABEL[locale]}
          className="[grid-area:dots]"
        />
      </div>
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofSpotlightCarouselCopy = COPY
