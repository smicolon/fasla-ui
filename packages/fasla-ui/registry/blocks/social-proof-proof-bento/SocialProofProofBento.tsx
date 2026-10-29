"use client"

import * as React from "react"
import { Play, X } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"
import {
  Isolated,
  SocialProofAuthor,
  SocialProofPhoto,
  SocialProofQuote,
  SocialProofSection,
  SocialProofStars,
  useVideoPlayback,
  type SocialProofLocale,
  type SocialProofPerson,
  type SocialProofPhotos,
} from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Proof Bento.
 *
 * A header with a `See all case studies` button (Ghost, xs) at its end, over
 * a bento of five tiles in two rows: a wide `primary` tint holding the
 * featured quote and its author beside a `primary` stat tile (figure, label,
 * company); then a `warning` rating tile (five stars, 4.9, the review count),
 * a `card` quote tile with its author, and a video tile, a photo with a play
 * button and a pill saying whose story it is and how long. Phones stack the
 * five tiles in one column.
 *
 * Motion (Figma's ⚡ Motion note): the play button on the video tile starts the
 * story only when the reader clicks or taps it: no hover preview, no autoplay
 * and no pulse. On click the tile swaps its photo for the video with a fade
 * (fadeIn, 180ms). The rest of the bento stays still. Reduced motion: opacity
 * only, 120ms. In RTL the bento mirrors, so on Desktop and Tablet the video
 * tile moves to the opposite end of its row; on Mobile it stays last. The play
 * glyph is not mirrored.
 *
 * Figma shows the poster only; the playing state, with the video's own
 * controls and a button that closes it, is the block's. The video plays when
 * you pass `videoSrc`.
 */

export interface SocialProofProofBentoCopy {
  /** Up to 46 characters in English, 40 in Arabic. */
  heading: React.ReactNode
  /** Up to 25 characters in English, 26 in Arabic. */
  button: React.ReactNode
  /** The wide tile. Its quote is up to 290 characters in English, 284 in Arabic. */
  featured: { quote: React.ReactNode; author: SocialProofPerson }
  /** The figure is up to 5 characters in English, 9 in Arabic; the label up to 60 in English, 56 in Arabic; the company up to 20. */
  stat: { value: string; label: React.ReactNode; company: React.ReactNode }
  rating: { value: string; label: React.ReactNode }
  /** The card tile. Its quote is up to 154 characters in English, 136 in Arabic. */
  quote: { quote: React.ReactNode; author: SocialProofPerson }
  /** The pill on the video tile: a name and a duration, one line, about 30 characters in English and 24 in Arabic. */
  videoLabel: React.ReactNode
  /** The key in `photos` for the video tile's poster. */
  posterId: string
}

const p = (id: string, name: string, role: string): SocialProofPerson => ({ id, name, role })

const COPY: Record<SocialProofLocale, SocialProofProofBentoCopy> = {
  en: {
    heading: "Every kind of proof, one glance",
    button: "See all case studies",
    featured: {
      quote: "“We consolidated three design tools and an entire QA checklist into one system. Fasla is the rare platform both our brand team and our engineers call theirs.”",
      author: p("fahad-salem", "Fahad Salem", "Brand Director, Arvenna Bank"),
    },
    stat: { value: "6×", label: "faster brand theming since switching", company: "COBALT SYSTEMS" },
    rating: { value: "4.9", label: "Average across 812 verified reviews" },
    quote: { quote: "“Zero regressions in the migration quarter. QA signed off early.”", author: p("khalid-saad", "Khalid Saad", "Frontend Lead, Atlas Freight") },
    videoLabel: "Watch Rashed's story · 2:14",
    posterId: "proof-bento-video",
  },
  ar: {
    heading: "كل أشكال الإثبات في نظرة واحدة",
    button: "اعرض كل دراسات الحالة",
    featured: {
      quote: "«دمجنا ثلاث أدوات تصميم وقائمة فحص جودة كاملة في نظام واحد. وفاصلة من المنصات النادرة التي يعدّها فريق العلامة والمهندسون أداتهم.»",
      author: p("fahad-salem", "فهد سالم", "مدير العلامة التجارية، بنك أرفينا"),
    },
    stat: { value: "6×", label: "أسرع في تطبيق سمات العلامة منذ الانتقال", company: "كوبالت سيستمز" },
    rating: { value: "4.9", label: "متوسط 812 تقييمًا موثّقًا" },
    quote: { quote: "«لا تراجعات في ربع الانتقال، ووافق فريق الجودة مبكرًا.»", author: p("khalid-saad", "خالد سعد", "قائد الواجهات الأمامية، أطلس فريت") },
    videoLabel: "شاهد قصة راشد، 2:14",
    posterId: "proof-bento-video",
  },
}

export interface SocialProofProofBentoProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<SocialProofProofBentoCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Avatar photos by person id, and the video tile's poster by its `posterId`. */
  photos?: SocialProofPhotos
  /** The video the tile plays. Without it the tile is a still. */
  videoSrc?: string
  /** The file's media type, such as "video/mp4". */
  videoType?: string
  /** Where the header button goes. */
  href?: string
}

export function SocialProofProofBento({
  locale = "en",
  heading,
  button,
  featured,
  stat,
  rating,
  quote,
  videoLabel,
  posterId,
  photos,
  videoSrc,
  videoType,
  href = "#",
  className,
  ...props
}: SocialProofProofBentoProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const f = featured ?? copy.featured
  const s = stat ?? copy.stat
  const r = rating ?? copy.rating
  const q = quote ?? copy.quote
  const { videoRef, playRef, started, play, stop, labels, available } = useVideoPlayback(videoSrc, locale)
  const label = videoLabel ?? copy.videoLabel
  const poster = photos?.[posterId ?? copy.posterId]
  const videoId = React.useId()

  return (
    <SocialProofSection labelledBy={headingId} className={className} contentClassName="items-stretch gap-10" {...props}>
      <header className="flex w-full items-center justify-between gap-6 [@container(min-width:64rem)]:gap-12">
        <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl">
          {heading ?? copy.heading}
        </h2>
        <a href={href} className={buttonVariants({ variant: "ghost", size: "xs", className: "shrink-0" })}>
          {button ?? copy.button}
        </a>
      </header>
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-6 [@container(min-width:40rem)]:flex-row">
          <figure className="m-0 flex min-w-0 flex-col justify-between gap-6 rounded-xl bg-primary/10 p-8 [@container(min-width:40rem)]:min-h-[220px] [@container(min-width:40rem)]:flex-[2] [@container(min-width:64rem)]:min-h-[280px] [@container(min-width:64rem)]:flex-[784]">
            <SocialProofQuote quote={f.quote} className="text-lg font-medium text-foreground [@container(min-width:64rem)]:text-xl" />
            <SocialProofAuthor person={f.author} photos={photos} />
          </figure>
          <div className="flex flex-col justify-between gap-6 rounded-xl bg-primary p-8 text-primary-foreground [@container(min-width:40rem)]:flex-1 [@container(min-width:64rem)]:flex-[408]">
            <p className="flex flex-col gap-1">
              <span className="text-6xl font-semibold">
                <Isolated>{s.value}</Isolated>
              </span>
              <span className="text-base">
                <Isolated>{s.label}</Isolated>
              </span>
            </p>
            <p className="text-xs font-medium">
              <bdi>{s.company}</bdi>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-6 [@container(min-width:40rem)]:flex-row [&>*]:min-w-0 [&>*]:flex-1">
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-xl bg-warning/10 p-6 text-center">
            <SocialProofStars locale={locale} className="[&_svg]:size-6" />
            <p className="text-5xl font-semibold text-foreground">
              <Isolated>{r.value}</Isolated>
            </p>
            <p className="text-sm text-muted-foreground">
              <Isolated>{r.label}</Isolated>
            </p>
          </div>
          <figure className="m-0 flex min-h-[240px] flex-col justify-between gap-6 rounded-xl border border-border bg-card p-6">
            <SocialProofQuote quote={q.quote} className="text-base text-foreground" />
            <SocialProofAuthor person={q.author} photos={photos} />
          </figure>
          <div className={cn("relative isolate flex min-h-[240px] flex-col items-center justify-between overflow-hidden rounded-xl bg-muted p-5", started && "bg-background-inverse")} role="group" aria-labelledby={videoId}>
            {started && videoSrc ? (
              <video ref={videoRef} controls playsInline preload="metadata" aria-labelledby={videoId} className="absolute inset-0 -z-10 size-full object-contain">
                <source src={videoSrc} type={videoType} />
              </video>
            ) : (
              <SocialProofPhoto src={poster} className="absolute inset-0 -z-10" />
            )}
            {started ? (
              <Button type="button" variant="secondary" size="icon-sm" radius="rounded" aria-label={labels.stop} onClick={stop} className="self-end">
                <X aria-hidden />
              </Button>
            ) : (
              <>
                <div className="flex flex-1 items-center justify-center">
                  <Button ref={playRef} type="button" variant="secondary" size="icon-md" radius="rounded" aria-label={labels.play} aria-describedby={videoId} aria-disabled={available ? undefined : true} onClick={play}>
                    <Play aria-hidden fill="currentColor" />
                  </Button>
                </div>
                <p id={videoId} className="whitespace-nowrap rounded-lg bg-background px-2.5 py-1.5 text-xs font-medium text-foreground">
                  <Isolated>{label}</Isolated>
                </p>
              </>
            )}
            {started ? (
              <p id={videoId} className="sr-only">
                {label}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofProofBentoCopy = COPY
