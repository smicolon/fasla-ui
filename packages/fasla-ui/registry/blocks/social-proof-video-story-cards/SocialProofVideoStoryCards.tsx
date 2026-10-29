"use client"

import * as React from "react"
import { Play, X } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"
import {
  Isolated,
  SocialProofPhoto,
  SocialProofSection,
  useVideoPlayback,
  type SocialProofLocale,
  type SocialProofPhotos,
} from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Video Story Cards.
 *
 * A header with a `See more stories` button (Outline, rounded) at its end,
 * over two video cards 420px tall (side by side on Desktop and Tablet,
 * stacked on phones). Each card is a photo under a 50% dark scrim, with the
 * play button (Icon Button, 40px, Secondary) over the story's name, its role,
 * company and running time, and a quote at the foot.
 *
 * Motion (Figma's ⚡ Motion note): the play button starts a story only when
 * the reader clicks or taps it: no hover preview, no autoplay and no pulse.
 * On click the card swaps its photo for the video with a fade (fadeIn,
 * 180ms). Reduced motion: opacity only, 120ms. In RTL the card order mirrors
 * and the play glyph is not mirrored.
 *
 * Figma shows the poster state only. The playing state is the block's: the
 * video fills the card with its own controls, and a close button at the
 * card's end stops it and brings the poster back. A story plays when you pass
 * its `videoSrc`; without one the card is a still, with the button disabled.
 * Cards are independent: starting one does not stop the other.
 */

export interface SocialProofVideoStory {
  /** The key in `photos` for the poster. */
  id: string
  /** `Rashed's Story`: the person's first name and `Story`. */
  title: React.ReactNode
  /** Role, company and running time, as Figma sets them. */
  meta: React.ReactNode
  /** About 110 characters on Desktop in English and 90 in Arabic; about 80 on Tablet and Mobile in both. */
  quote: React.ReactNode
  /** The video. Without it the card shows its poster only. */
  videoSrc?: string
  /** The file's media type, such as "video/mp4". */
  videoType?: string
}

export interface SocialProofVideoStoryCardsCopy {
  /** Up to 46 characters in English, 40 in Arabic. */
  heading: React.ReactNode
  /** Up to 128 characters in English, 125 in Arabic. */
  description: React.ReactNode
  /** Up to 25 characters in English, 26 in Arabic. */
  button: React.ReactNode
  /** The stories, in reading order: two. */
  items: SocialProofVideoStory[]
}

const COPY: Record<SocialProofLocale, SocialProofVideoStoryCardsCopy> = {
  en: {
    heading: "Customer stories, on camera",
    description: "Fasla is changing how thousands of teams ship.",
    button: "See more stories",
    items: [
      { id: "video-story-rashed", title: "Rashed's Story", meta: "Design Ops · Willow & Co  ·  2:14", quote: "“Fasla gives me all the right defaults so I can focus on the decisions that matter.”" },
      { id: "video-story-omar", title: "Omar's Story", meta: "VP Engineering · Cobalt Systems  ·  3:02", quote: "“I feel genuinely confident shipping UI without a design review in the loop.”" },
    ],
  },
  ar: {
    heading: "قصص العملاء بالصوت والصورة",
    description: "فاصلة تغيّر طريقة إطلاق آلاف الفرق لمنتجاتها.",
    button: "اعرض المزيد من القصص",
    items: [
      { id: "video-story-rashed", title: "قصة راشد", meta: "عمليات التصميم، ويلو آند كو، 2:14", quote: "«تمنحني فاصلة كل الإعدادات الافتراضية الصحيحة لأركّز على القرارات المهمة.»" },
      { id: "video-story-omar", title: "قصة عمر", meta: "نائب رئيس الهندسة، كوبالت سيستمز، 3:02", quote: "«أُطلق الواجهات بثقة تامة دون انتظار مراجعة التصميم.»" },
    ],
  },
}

function VideoCard({ story, locale, photos }: { story: SocialProofVideoStory; locale: SocialProofLocale; photos?: SocialProofPhotos }) {
  const { videoRef, playRef, started, play, stop, labels, available } = useVideoPlayback(story.videoSrc, locale)
  const titleId = React.useId()
  const poster = photos?.[story.id]
  return (
    <article
      aria-labelledby={titleId}
      className="relative isolate flex min-h-[200px] min-w-0 flex-col gap-6 [@container(min-width:40rem)]:h-[300px] [@container(min-width:40rem)]:flex-1 [@container(min-width:64rem)]:h-[420px] items-center justify-between overflow-hidden rounded-xl bg-muted px-6 py-8 text-center [@container(min-width:40rem)]:px-12"
    >
      {started && story.videoSrc ? (
        <video ref={videoRef} controls playsInline preload="metadata" aria-labelledby={titleId} className="absolute inset-0 -z-10 size-full bg-background-inverse object-contain">
          <source src={story.videoSrc} type={story.videoType} />
        </video>
      ) : (
        <>
          <SocialProofPhoto src={poster} className="absolute inset-0 -z-20" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-backdrop-overlay" />
        </>
      )}
      {started ? (
        <Button type="button" variant="secondary" size="icon-md" radius="rounded" aria-label={labels.stop} onClick={stop} className="absolute end-3 top-3">
          <X aria-hidden />
        </Button>
      ) : (
        <>
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-foreground-inverse dark:text-foreground">
            <Button ref={playRef} type="button" variant="secondary" size="icon-md" radius="rounded" aria-label={labels.play} aria-describedby={titleId} aria-disabled={available ? undefined : true} onClick={play}>
              <Play aria-hidden fill="currentColor" />
            </Button>
            <h3 id={titleId} className="text-lg font-semibold">
              {story.title}
            </h3>
            <p className="text-xs opacity-85">
              <Isolated>{story.meta}</Isolated>
            </p>
          </div>
          <blockquote className="m-0 max-w-[500px] text-sm font-medium text-foreground-inverse dark:text-foreground">
            <p>
              <Isolated>{story.quote}</Isolated>
            </p>
          </blockquote>
        </>
      )}
      {started ? (
        <h3 id={titleId} className="sr-only">
          {story.title}
        </h3>
      ) : null}
    </article>
  )
}

export interface SocialProofVideoStoryCardsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<SocialProofVideoStoryCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Posters by each story's `id`. Without one the card shows its `muted` ground. */
  photos?: SocialProofPhotos
  /** Where the header button goes. */
  href?: string
}

export function SocialProofVideoStoryCards({ locale = "en", heading, description, button, items, photos, href = "#", className, ...props }: SocialProofVideoStoryCardsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  return (
    <SocialProofSection labelledBy={headingId} className={className} contentClassName="items-stretch gap-10" {...props}>
      <header className="flex w-full flex-col items-start gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-6">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl">
            {heading ?? copy.heading}
          </h2>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
        </div>
        <a href={href} className={buttonVariants({ variant: "outline", radius: "rounded", className: "shrink-0" })}>
          {button ?? copy.button}
        </a>
      </header>
      <div className={cn("flex w-full flex-col gap-6 [@container(min-width:40rem)]:flex-row")}>
        {(items ?? copy.items).map((story) => (
          <VideoCard key={story.id} story={story} locale={locale} photos={photos} />
        ))}
      </div>
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofVideoStoryCardsCopy = COPY
