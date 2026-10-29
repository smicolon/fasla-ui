"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { Progress } from "../../ui/progress/progress"
import {
  Isolated,
  SocialProofPhoto,
  SocialProofQuote,
  SocialProofSection,
  SocialProofStepper,
  stepKeys,
  useColumnCount,
  useStepper,
  useSwipeStep,
  type SocialProofLocale,
  type SocialProofPhotos,
} from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Progress Carousel.
 *
 * A heading with previous and next arrows (Icon Button, Outline xs) at its
 * end, over one customer story at a time on a `card` panel: the company in
 * XS Bold, the quote in LG, the attribution, a link to the story, and a photo
 * (460 by 300 on Desktop, 280 by 220 on Tablet, full width and 200 tall above
 * the copy on phones). Under the card, the counter (01 / 04) and the Progress
 * bar.
 *
 * Motion (Figma's ⚡ Motion note): the arrows step through four stories, one
 * at a time. Manual only: no autoplay, no timer, and paging stops at the first
 * and last story, so previous is disabled on the first. On change the
 * outgoing story fades out, the new copy slides up 10px with a fade (slideUp,
 * 180ms) and the photo crossfades (fadeIn, 180ms); on phones the photo comes
 * first and the copy 60ms after it (stagger). The counter and the bar show
 * the position: the bar moves in 25% steps, one per story, only when you
 * navigate; it never fills over time. The arrow keys move between stories; on
 * phones, swiping the copy also steps. Reduced motion: opacity only, 120ms.
 * In RTL the bar fills from the right and the left arrow goes to the next
 * story.
 *
 * Figma shows the first story. The other three are quotes the same people
 * give elsewhere in the set: Fahad Salem's from Bracket-Framed Quote, Adel
 * Qasim's from Tinted-Panel Portrait and Khalid Saad's from Persona
 * Pillars. Only the first story has a photo in Figma; the other three have
 * `photoId`s of their own, so a `photos` map can fill them too.
 */

export interface SocialProofProgressCarouselLink {
  label: React.ReactNode
  href: string
}

export interface SocialProofProgressCarouselItem {
  /** The company, above the quote. Up to 20 characters. */
  company: React.ReactNode
  /** Up to 290 characters in English, 284 in Arabic. */
  quote: React.ReactNode
  /** The author and role, under the quote. Up to 48 characters in English, 50 in Arabic. */
  attribution: React.ReactNode
  /** The key in `photos` for the story's photo. Without one the slot is empty. */
  photoId?: string
  /** The link to the full story. Hidden when empty. Up to 25 characters in English, 26 in Arabic. */
  link?: SocialProofProgressCarouselLink | null
}

export interface SocialProofProgressCarouselCopy {
  heading: React.ReactNode
  /** The stories, in order. Four, as Figma's counter counts them. */
  items: SocialProofProgressCarouselItem[]
}

/** Figma's copy, English and Arabic. Every person and company is invented. */
const COPY: Record<SocialProofLocale, SocialProofProgressCarouselCopy> = {
  en: {
    heading: "Why leading teams trust Fasla",
    items: [
      {
        company: "BEACON ANALYTICS",
        quote: "“The team at Fasla has made foundational contributions to how we build product. Their system helps us harness design at enterprise scale — automate the routine, accelerate the rest.”",
        attribution: "— Bader Al-Ghamdi, Chief Technology Officer",
        photoId: "progress-carousel-1",
        link: { label: "Read the story", href: "#" },
      },
      {
        company: "ARVENNA BANK",
        quote: "“I've found Fasla to be a genuinely valuable thought partner. The relationship is as much about how we execute near-term as it is about where design is going.”",
        attribution: "— Fahad Salem, Brand Director",
        photoId: "progress-carousel-2",
        link: { label: "Read the story", href: "#" },
      },
      {
        company: "FORMA STUDIO",
        quote: "“Fasla changed everything. We now build exactly what my team designs, pixel for pixel. Having that power and flexibility at our fingertips is a paradigm shift.”",
        attribution: "— Adel Qasim, Director of Brand Design",
        photoId: "progress-carousel-3",
        link: { label: "Read the story", href: "#" },
      },
      {
        company: "ATLAS FREIGHT",
        quote: "“Fasla is central to how we build — whether it's sprint UI reviews or big launches, its guardrails help engineers ship polished screens without waiting on design.”",
        attribution: "— Khalid Saad, Frontend Lead",
        photoId: "progress-carousel-4",
        link: { label: "Read the story", href: "#" },
      },
    ],
  },
  ar: {
    heading: "سرّ ثقة الفرق الرائدة بفاصلة",
    items: [
      {
        company: "بيكون أناليتكس",
        quote: "«أسهم فريق فاصلة إسهامًا أساسيًا في طريقة بنائنا للمنتج، ونظامهم يعيننا على إدارة التصميم على مستوى المؤسسة: نؤتمت المتكرر ونسرّع الباقي.»",
        attribution: "بدر الغامدي، الرئيس التقني",
        photoId: "progress-carousel-1",
        link: { label: "اقرأ القصة", href: "#" },
      },
      {
        company: "بنك أرفينا",
        quote: "«وجدت في فاصلة شريكًا نتبادل معه الأفكار بحق، فعلاقتنا تشمل طريقة تنفيذنا اليوم بقدر ما تشمل مستقبل التصميم.»",
        attribution: "فهد سالم، مدير العلامة التجارية",
        photoId: "progress-carousel-2",
        link: { label: "اقرأ القصة", href: "#" },
      },
      {
        company: "فورما ستوديو",
        quote: "«غيّرت فاصلة كل شيء. صرنا نبني تمامًا ما يصممه فريقي، بكسلًا بكسل. وامتلاك هذه القوة والمرونة بين أيدينا غيّر طريقة تفكيرنا كلها.»",
        attribution: "عادل قاسم، مدير تصميم العلامة",
        photoId: "progress-carousel-3",
        link: { label: "اقرأ القصة", href: "#" },
      },
      {
        company: "أطلس فريت",
        quote: "«فاصلة في صميم طريقة عملنا. ففي مراجعات الواجهات خلال كل سبرنت وفي الإطلاقات الكبرى، تساعد ضوابطها المهندسين على إطلاق شاشات متقنة دون انتظار فريق التصميم.»",
        attribution: "خالد سعد، قائد الواجهات الأمامية",
        photoId: "progress-carousel-4",
        link: { label: "اقرأ القصة", href: "#" },
      },
    ],
  },
}

/** The counter, as Figma writes it: two digits each side, `01 / 04`. */
const counter = (index: number, count: number) => `${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`

export interface SocialProofProgressCarouselProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofProgressCarouselCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Story photos by `photoId`. Without one a story's photo slot is empty. */
  photos?: SocialProofPhotos
  /** The story shown, from 0, to control the carousel. */
  index?: number
  /** Called when the arrows, keys or a swipe change the story. */
  onIndexChange?: (index: number) => void
}

export function SocialProofProgressCarousel({
  locale = "en",
  heading,
  items,
  photos,
  index: indexProp,
  onIndexChange,
  className,
  ...props
}: SocialProofProgressCarouselProps) {
  const copy = COPY[locale]
  const list = items ?? copy.items
  const headingId = React.useId()
  const storyId = React.useId()
  const [sizeRef, columns] = useColumnCount<HTMLDivElement>(2)
  const { ref, index, go } = useStepper<HTMLDivElement>({ count: list.length, index: indexProp, onIndexChange, stagger: columns === 1 })
  const swipe = useSwipeStep((delta) => go(index + delta))
  const story = list[index]
  if (!story) return null

  return (
    <SocialProofSection
      labelledBy={headingId}
      aria-roledescription="carousel"
      className={className}
      contentClassName="items-stretch gap-8"
      onKeyDown={stepKeys(index, list.length, go)}
      {...props}
    >
      <div ref={sizeRef} className="flex w-full items-center justify-between gap-6">
        <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl">
          <Isolated>{heading ?? copy.heading}</Isolated>
        </h2>
        <SocialProofStepper index={index} count={list.length} onIndexChange={go} locale={locale} variant="outline" controls={storyId} className="shrink-0" />
      </div>
      <div
        ref={ref}
        id={storyId}
        role="group"
        aria-roledescription="slide"
        aria-label={counter(index, list.length)}
        aria-live="polite"
        tabIndex={0}
        className="flex flex-col gap-6 rounded-xl bg-card p-10 ring-1 ring-inset ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring forced-colors:border [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-10"
        {...swipe}
      >
        <SocialProofPhoto
          key={`photo-${index}`}
          data-step-item="fade"
          src={story.photoId ? photos?.[story.photoId] : undefined}
          className="h-[200px] w-full shrink-0 rounded-lg [@container(min-width:40rem)]:order-last [@container(min-width:40rem)]:h-[220px] [@container(min-width:40rem)]:w-[280px] [@container(min-width:64rem)]:h-[300px] [@container(min-width:64rem)]:w-[460px]"
        />
        <figure key={`story-${index}`} data-step-item="slide" className="m-0 flex min-w-0 flex-1 flex-col gap-5">
          <p className="text-xs font-bold text-foreground">
            <Isolated>{story.company}</Isolated>
          </p>
          <SocialProofQuote quote={story.quote} className="text-lg text-foreground" />
          <figcaption className="flex flex-col gap-5">
            <span className="text-sm text-muted-foreground">
              <Isolated>{story.attribution}</Isolated>
            </span>
            {story.link ? (
              <a
                href={story.link.href}
                className="inline-flex items-center gap-1.5 self-start rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Isolated>{story.link.label}</Isolated>
                <ArrowRight aria-hidden size={16} className="rtl:rotate-180" />
              </a>
            ) : null}
          </figcaption>
        </figure>
      </div>
      <div className="flex w-full items-center gap-5">
        <span aria-hidden className="shrink-0 text-sm font-medium text-foreground">
          <bdi dir="ltr">{counter(index, list.length)}</bdi>
        </span>
        <Progress value={((index + 1) / list.length) * 100} size="sm" showPercentage={false} aria-label={counter(index, list.length)} className="flex-1" />
      </div>
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofProgressCarouselCopy = COPY
