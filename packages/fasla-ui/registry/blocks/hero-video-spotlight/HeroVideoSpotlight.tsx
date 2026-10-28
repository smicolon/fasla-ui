"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Hero` (46552:249264), Type=Video Spotlight Hero.
 *
 * A film in the spotlight: a centred headline between two thin rules, a
 * line about the film, and one large card holding it. Before it plays the
 * card shows the poster, a round play button in its middle, a small panel
 * with the film's title and a line about it at the bottom start, and a chip
 * with its running time at the bottom end.
 *
 * It is a real player. The play button starts the film with sound, since the
 * visitor chose to play it, hides the poster and its labels, and hands over
 * to the browser's own controls: keyboard operable, with a captions menu when
 * `captions` are passed, and full screen. Focus moves to the player, so it
 * is not lost with the button. It never plays by itself, so reduced motion
 * needs nothing more. Without a `video` the card is a still: the poster and
 * its labels, no button.
 *
 * Desktop draws the rules beside the headline and the card 560px tall, its
 * labels 24px from the edges. Tablet keeps the rules, the card 400px tall and
 * the labels 16px in. Mobile drops the rules and the title panel, sets the
 * headline at the start as Figma does, and keeps the card 220px tall with the
 * running time.
 *
 * In Arabic the title panel moves to the right and the running time to the
 * left. The running time stays left to right. The poster and the film are
 * never flipped, and neither is the play triangle: it names the direction a
 * film runs, not the direction of reading.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container and everything inside, its padding included, follows it. Mobile
 * is the base; `[@container(min-width:48rem)]:` is Figma's Tablet (768) and
 * `[@container(min-width:90rem)]:` its Desktop, from 1440px, the width Figma
 * draws it at. Narrower, the wide card turns into a letterbox, so Tablet's
 * layout covers 768 to 1439.
 */

export interface HeroVideoSpotlightVideo {
  src: string
  /** The file's media type, such as "video/webm". Lets the browser skip a format it cannot play. */
  type?: string
}

export interface HeroVideoSpotlightPoster {
  src: string
  /** Describes the still. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroVideoSpotlightCaptions {
  /** A WebVTT file. From another origin it needs CORS headers. */
  src: string
  /** The captions' language, such as "en" or "ar". */
  srcLang: string
  /** The name the player's captions menu shows. */
  label: string
  /** Turns these captions on from the start. */
  default?: boolean
}

export interface HeroVideoSpotlightCopy {
  /** The headline, an `h1`. */
  headline: React.ReactNode
  /** The line under the headline. */
  description: React.ReactNode
  /** The film's title, in the panel at the card's bottom start. Also the player's name. Hidden when empty. */
  videoTitle: React.ReactNode
  /** The line under the title. Hidden when empty. */
  videoDescription: React.ReactNode
  /** The running time, in the chip at the card's bottom end. Shown left to right. Hidden when empty. */
  duration: React.ReactNode
  /** The play button's accessible name. */
  playLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroVideoSpotlightCopy> = {
  en: {
    headline: "Make every team calm",
    description: "Four minutes on why we think work should feel quieter — and what we built to get there.",
    videoTitle: "The Northfield story",
    videoDescription: "Our founders on calm software",
    duration: "4:12",
    playLabel: "Play the film",
  },
  ar: {
    headline: "اجعل كل فريق هادئًا",
    description: "أربع دقائق عن سبب إيماننا بأن العمل يجب أن يكون أهدأ، وما بنيناه لنصل إلى ذلك.",
    videoTitle: "قصة شمال",
    videoDescription: "مؤسسونا يتحدثون عن البرمجيات الهادئة",
    duration: "4:12",
    playLabel: "شغّل الفيلم",
  },
}

export interface HeroVideoSpotlightProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroVideoSpotlightCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The film. None by default: the card is a still, with no play button.
   * @default none: a still card
   */
  video?: HeroVideoSpotlightVideo
  /**
   * The still shown before the film plays, usually its first frame. None by
   * default: the card shows the `muted` colour in its place.
   * @default none: a `muted` placeholder
   */
  poster?: HeroVideoSpotlightPoster
  /**
   * Caption tracks, one per language, offered in the player's captions menu.
   * @default none
   */
  captions?: HeroVideoSpotlightCaptions[]
}

export function HeroVideoSpotlight({
  locale = "en",
  headline,
  description,
  videoTitle,
  videoDescription,
  duration,
  playLabel,
  video,
  poster,
  captions,
  className,
  ...props
}: HeroVideoSpotlightProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const titleId = React.useId()
  const panelId = React.useId()
  const durationId = React.useId()
  const title = videoTitle ?? copy.videoTitle
  const subtitle = videoDescription ?? copy.videoDescription
  const time = duration ?? copy.duration
  const hasPanel = Boolean(title || subtitle)

  const videoRef = React.useRef<HTMLVideoElement>(null)
  // The film that was started. A new `video` reads as not started, so the
  // poster and its button come back without clearing any state.
  const [startedSrc, setStartedSrc] = React.useState<string | null>(null)
  const started = video !== undefined && startedSrc === video.src

  const play = () => {
    const player = videoRef.current
    if (!player || !video) return
    setStartedSrc(video.src)
    // Inside the click, so the browser counts it as the visitor's choice and
    // lets the film play with sound. If it still refuses, the player's own
    // controls are showing by then to start it.
    player.play().catch(() => {})
  }

  // The button is gone once the film starts: keep focus on the player.
  React.useEffect(() => {
    if (started) videoRef.current?.focus()
  }, [started])

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background", className)} {...props}>
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col gap-10 px-4 py-8 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:gap-8 [@container(min-width:90rem)]:px-20 [@container(min-width:90rem)]:pb-16 [@container(min-width:90rem)]:pt-20">
        <div className="flex items-center gap-6">
          {/* A plain 1px line where Figma draws its Separator. Swap in Separator once it is built. */}
          <div aria-hidden className="hidden h-px min-w-8 flex-1 bg-border [@container(min-width:48rem)]:block" />
          <h1
            id={headingId}
            className="min-w-0 text-balance text-4xl font-semibold text-foreground [@container(min-width:48rem)]:text-center [@container(min-width:48rem)]:text-5xl [@container(min-width:90rem)]:text-6xl"
          >
            {headline ?? copy.headline}
          </h1>
          <div aria-hidden className="hidden h-px min-w-8 flex-1 bg-border [@container(min-width:48rem)]:block" />
        </div>

        <p className="text-balance text-center text-base text-muted-foreground [@container(min-width:48rem)]:text-lg">
          {description ?? copy.description}
        </p>

        <div
          className={cn(
            "relative h-[220px] w-full overflow-hidden rounded-xl shadow-lg [@container(min-width:48rem)]:h-[400px] [@container(min-width:90rem)]:h-[560px]",
            // Playing, the film is shown whole, on a dark band in both modes
            // where its shape differs from the card's.
            started ? "bg-background-inverse dark:bg-muted" : "bg-muted"
          )}
        >
          {video ? (
            <video
              key={video.src}
              ref={videoRef}
              preload="metadata"
              playsInline
              controls={started}
              tabIndex={started ? 0 : -1}
              aria-hidden={started ? undefined : true}
              aria-labelledby={title ? titleId : undefined}
              className={cn("absolute inset-0 size-full", started ? "object-contain" : "object-cover")}
            >
              <source src={video.src} type={video.type} />
              {captions?.map((track) => (
                <track key={track.src} kind="captions" src={track.src} srcLang={track.srcLang} label={track.label} default={track.default} />
              ))}
            </video>
          ) : null}

          {started ? null : poster ? (
            <img src={poster.src} alt={poster.alt} decoding="async" className="absolute inset-0 size-full object-cover" />
          ) : video ? (
            <div aria-hidden className="absolute inset-0 bg-muted" />
          ) : null}

          {/* No display class on this wrapper, so `hidden` hides it. Kept in the DOM: the title names the player. */}
          <div hidden={started}>
            {hasPanel ? (
              <div
                id={panelId}
                className="absolute bottom-4 start-4 hidden max-w-[60%] flex-col gap-1 rounded-lg bg-background px-4 py-3 shadow-md [@container(min-width:48rem)]:flex [@container(min-width:90rem)]:bottom-6 [@container(min-width:90rem)]:start-6"
              >
                {title ? (
                  <p id={titleId} className="text-sm font-semibold text-foreground">
                    {title}
                  </p>
                ) : null}
                {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
              </div>
            ) : null}
            {time ? (
              <p
                id={durationId}
                className="absolute bottom-4 end-4 whitespace-nowrap rounded-full bg-background px-2.5 py-1 text-xs text-muted-foreground [@container(min-width:90rem)]:bottom-6 [@container(min-width:90rem)]:end-6"
              >
                <bdi dir="ltr">{time}</bdi>
              </p>
            ) : null}
          </div>

          {video && !started ? (
            <button
              type="button"
              onClick={play}
              aria-label={playLabel ?? copy.playLabel}
              aria-describedby={[hasPanel ? panelId : "", time ? durationId : ""].filter(Boolean).join(" ") || undefined}
              className="absolute inset-0 m-auto size-[84px] cursor-pointer rounded-full bg-background text-foreground shadow-lg transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] [outline:none] motion-reduce:transition-none hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring forced-colors:border forced-colors:border-[ButtonText]"
            >
              {/*
                 * Figma's triangle: 34 × 36 with 4px corners, its centre of
                 * mass on the circle's centre. Drawn 4px inside its edge and
                 * stroked 8px with round joins, which rounds the corners.
                 */}
              <svg aria-hidden viewBox="0 0 84 84" className="absolute inset-0 size-full">
                <path
                  d="M35.5 30.7 56.4 42 35.5 53.3Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth={8}
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroVideoSpotlightCopy = COPY
