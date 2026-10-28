"use client"

import * as React from "react"
import { Pause, Play, VolumeX } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Video-in-Type Hero.
 *
 * A film launch on a `primary` band: a "now playing" line behind a red dot,
 * a huge two-line word with the footage playing inside its letters, a
 * playback bar under it, and a paragraph with two buttons.
 *
 * Desktop keeps the line, the word and the bar in the start column and sets
 * the paragraph and buttons in a 430px column at the end, its foot 48px above
 * the bar's. Tablet and Mobile stack everything in that order, the bar at full
 * width; the word steps down from 9XL to 7XL, and Mobile also steps the
 * paragraph down and stacks the buttons at full width.
 *
 * The footage is a real video, muted and looping, and plays inside the
 * letters. Under it lies the poster, its first frame. The word is the `h1`,
 * real text, set twice over the video: an unseen copy multiplies it (white
 * letters keep the footage, the black ground removes it), then the heading
 * screens the result (its black letters let the footage through, its ground,
 * the section's own colour, shows exactly). Black and white are the blend's
 * two constants, not paint: neither ever shows. So the band and the space
 * round the letters are the same token, and the letters are the footage.
 *
 * The band is `primary` in light mode. In dark mode `primary` turns light and
 * bright footage would not read against it, so the band stays dark there:
 * `background`, with `foreground` text and a light playback bar.
 *
 * The video starts on its own unless the visitor asks for reduced motion;
 * then the letters hold the poster, still, until they press play. Figma's
 * playback bar is the real control: its button plays and pauses the video,
 * and the time and the track follow the video's own position and length.
 * Without a video there is nothing to play: the letters hold the poster, or
 * `muted` without one, and the bar is left out. The footage is decoration
 * and hidden from assistive technology; the heading carries the words.
 *
 * In Arabic the columns mirror: the word and the bar sit on the right and the
 * paragraph on the left, and the track fills from the right, as Figma draws
 * it. The play glyph is never flipped, the time stays left to right, and the
 * footage is never mirrored.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the switch every Hero block shares, so
 * Tablet's layout covers 768 to 1439.
 */

export interface HeroVideoInTypeAction {
  label: React.ReactNode
  href: string
}

export interface HeroVideoInTypeVideo {
  src: string
  /** The file's MIME type, such as `video/webm`. Lets the browser skip a format it can't play. */
  type?: string
}

export interface HeroVideoInTypePoster {
  src: string
  /**
   * Describes the frame. The footage sits inside the headline as decoration
   * and is hidden from assistive technology, so this is not announced here.
   */
  alt: string
}

export interface HeroVideoInTypeCopy {
  /** The line beside the red dot, above the word. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The word the footage plays in, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph beside the word. */
  description: React.ReactNode
  /** The light button. */
  primaryAction: HeroVideoInTypeAction
  /** The ghost button beside it. Hidden when null. */
  secondaryAction: HeroVideoInTypeAction | null
  /** The label at the end of the playback bar: the footage has no sound. */
  mutedLabel: React.ReactNode
  /** The playback bar's accessible name. */
  controlsLabel: string
  /** The play button's accessible name while the video plays. */
  pauseLabel: string
  /** Its accessible name while the video is paused. */
  playLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroVideoInTypeCopy> = {
  en: {
    eyebrow: (
      <>
        NOW PLAYING — NORTHFIELD FILM <bdi dir="ltr">01</bdi>
      </>
    ),
    headline: "IN\nMOTION",
    description: "A year of work, cut to four minutes — the studio, the arguments, the launches that stuck.",
    primaryAction: { label: "Watch full film", href: "#film" },
    secondaryAction: { label: "Credits", href: "#credits" },
    mutedLabel: "muted",
    controlsLabel: "Film playback",
    pauseLabel: "Pause the film",
    playLabel: "Play the film",
  },
  ar: {
    eyebrow: (
      <>
        يُعرض الآن، فيلم شمال <bdi dir="ltr">01</bdi>
      </>
    ),
    headline: "في\nحركة",
    description: "عام من العمل في أربع دقائق: الاستوديو، والنقاشات، والإطلاقات التي بقيت.",
    primaryAction: { label: "شاهد الفيلم كاملًا", href: "#film" },
    secondaryAction: { label: "فريق العمل", href: "#credits" },
    mutedLabel: "صامت",
    controlsLabel: "تشغيل الفيلم",
    pauseLabel: "إيقاف الفيلم مؤقتًا",
    playLabel: "تشغيل الفيلم",
  },
}

/** The word's type, shared by the heading and its unseen copy so their letters land on the same pixels. */
const WORD = "whitespace-pre-line text-7xl font-semibold [@container(min-width:90rem)]:text-9xl"

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

function subscribeToReducedMotion(onChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => {}
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/** Whether the visitor asks for reduced motion, kept up to date. False on the server and while hydrating. */
function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribeToReducedMotion,
    () => typeof window.matchMedia === "function" && window.matchMedia(REDUCED_MOTION).matches,
    () => false
  )
}

/** Seconds as `mm:ss`. Nothing known yet reads as `00:00`. */
function clock(seconds: number) {
  const whole = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0
  return `${String(Math.floor(whole / 60)).padStart(2, "0")}:${String(whole % 60).padStart(2, "0")}`
}

export interface HeroVideoInTypeProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroVideoInTypeCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The footage that plays inside the letters: muted, looping, and started
   * on its own unless the visitor asks for reduced motion. None by default:
   * the letters hold the poster, and the playback bar is left out.
   * @default none: the poster, still
   */
  video?: HeroVideoInTypeVideo
  /**
   * The video's first frame, shown inside the letters until it plays, under
   * reduced motion, and in place of a missing video. None by default: the
   * letters show the `muted` colour in its place.
   * @default none: a `muted` placeholder
   */
  poster?: HeroVideoInTypePoster
}

export function HeroVideoInType({
  locale = "en",
  eyebrow,
  headline,
  description,
  primaryAction,
  secondaryAction,
  mutedLabel,
  controlsLabel,
  pauseLabel,
  playLabel,
  video,
  poster,
  className,
  ...props
}: HeroVideoInTypeProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const reduced = usePrefersReducedMotion()
  const videoRef = React.useRef<HTMLVideoElement>(null)
  /** Set once the visitor pauses: the video then waits for them, whatever the motion setting does. */
  const heldRef = React.useRef(false)
  const [playing, setPlaying] = React.useState(false)
  const [time, setTime] = React.useState({ current: 0, duration: 0 })
  const label = eyebrow ?? copy.eyebrow
  const word = headline ?? copy.headline
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const src = video?.src

  // Starts the footage once mounted, never under reduced motion, and stops it
  // when the visitor turns reduced motion on. The query is read here, not from
  // the hook: while hydrating the hook still says false, and the video would
  // play for a frame before stopping.
  React.useEffect(() => {
    const element = videoRef.current
    if (!element) return
    if (window.matchMedia?.(REDUCED_MOTION).matches) {
      element.pause()
      return
    }
    if (heldRef.current) return
    element.muted = true
    element.play().catch(() => {
      // The browser refused to start it: it stays on the poster, and the
      // button offers play.
    })
  }, [reduced, src])

  /** Reads the position and length off the video. */
  const sync = (element: HTMLVideoElement) => setTime({ current: element.currentTime, duration: element.duration })

  const toggle = () => {
    const element = videoRef.current
    if (!element) return
    if (element.paused) {
      heldRef.current = false
      element.muted = true
      element.play().catch(() => {})
    } else {
      heldRef.current = true
      element.pause()
    }
  }

  const progress = time.duration > 0 ? Math.min(100, (time.current / time.duration) * 100) : 0

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-primary dark:bg-background", className)} {...props}>
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="mx-auto grid w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] content-start gap-10 px-4 py-8 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:min-h-[800px] [@container(min-width:90rem)]:grid-cols-[minmax(0,1fr)_26.875rem] [@container(min-width:90rem)]:gap-x-8 [@container(min-width:90rem)]:gap-y-0 [@container(min-width:90rem)]:px-[110px] [@container(min-width:90rem)]:py-[110px]">
        {label ? (
          <p className="flex items-center gap-3 text-sm font-medium text-primary-foreground/75 dark:text-foreground/75 [@container(min-width:90rem)]:col-start-1">
            <span aria-hidden className="size-[9px] shrink-0 rounded-full bg-destructive" />
            <span>{label}</span>
          </p>
        ) : null}

        {/*
           * The word, hugging its letters. Bottom to top: the footage, the
           * unseen copy that multiplies it (white letters on black), and the
           * heading that screens the result (black letters on `primary`). In
           * forced colours the blends are gone, so the footage and the copy
           * step aside and the heading reads as plain text.
           */}
        <div className="relative isolate w-fit max-w-full overflow-hidden [@container(min-width:90rem)]:col-start-1 [@container(min-width:90rem)]:mt-[50px]">
          <div aria-hidden className="absolute inset-0 bg-muted forced-colors:hidden">
            {video ? (
              <video
                key={video.src}
                ref={videoRef}
                poster={poster?.src}
                muted
                loop
                playsInline
                preload="metadata"
                tabIndex={-1}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onLoadedMetadata={(event) => sync(event.currentTarget)}
                onDurationChange={(event) => sync(event.currentTarget)}
                onTimeUpdate={(event) => sync(event.currentTarget)}
                className="absolute inset-0 size-full object-cover"
              >
                <source src={video.src} type={video.type} />
              </video>
            ) : poster ? (
              <img src={poster.src} alt={poster.alt} decoding="async" className="absolute inset-0 size-full object-cover" />
            ) : null}
          </div>
          <p aria-hidden className={cn("absolute inset-0 bg-[black] text-[white] mix-blend-multiply forced-colors:hidden", WORD)}>
            {word}
          </p>
          <h1 id={headingId} className={cn("relative bg-primary text-[black] mix-blend-screen dark:bg-background", WORD)}>
            {word}
          </h1>
        </div>

        {video ? (
          <div
            role="group"
            aria-label={controlsLabel ?? copy.controlsLabel}
            className="flex h-8 min-w-0 items-center gap-4 rounded-full bg-primary-foreground/95 pe-4 ps-2 text-xs text-primary dark:bg-foreground/95 dark:text-background [@container(min-width:90rem)]:col-start-1 [@container(min-width:90rem)]:mt-[94px] [@container(min-width:90rem)]:w-fit"
          >
            {/* Figma's play glyph, as the real button: it plays and pauses the footage. */}
            <Button
              type="button"
              variant="ghost"
              tone="primary"
              size="icon-sm"
              radius="rounded"
              aria-label={playing ? pauseLabel ?? copy.pauseLabel : playLabel ?? copy.playLabel}
              onClick={toggle}
              className="-me-2 dark:text-background hover:dark:bg-background/10 hover:dark:text-background active:dark:bg-background/10 active:dark:text-background"
            >
              {playing ? (
                <Pause aria-hidden="true" size={16} strokeWidth={1.5} absoluteStrokeWidth fill="currentColor" />
              ) : (
                <Play aria-hidden="true" size={16} strokeWidth={1.5} absoluteStrokeWidth fill="currentColor" />
              )}
            </Button>
            <p className="whitespace-nowrap font-medium tabular-nums">
              <bdi dir="ltr">
                {clock(time.current)} / {clock(time.duration)}
              </bdi>
            </p>
            {/* The track follows the video; the time beside it says the same in words. */}
            <div
              aria-hidden
              className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-primary/25 dark:bg-background/25 [@container(min-width:90rem)]:w-[220px] [@container(min-width:90rem)]:flex-none"
            >
              <div className="h-full rounded-full bg-primary dark:bg-background" style={{ width: `${progress}%` }} />
            </div>
            <p className="flex shrink-0 items-center gap-1 whitespace-nowrap">
              <VolumeX aria-hidden="true" size={12} strokeWidth={1.5} absoluteStrokeWidth className="size-3" />
              {mutedLabel ?? copy.mutedLabel}
            </p>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-col gap-5 [@container(min-width:90rem)]:col-start-2 [@container(min-width:90rem)]:row-span-3 [@container(min-width:90rem)]:row-start-1 [@container(min-width:90rem)]:mb-12 [@container(min-width:90rem)]:self-end">
          <p className="text-pretty text-base text-primary-foreground dark:text-foreground [@container(min-width:48rem)]:text-lg">{description ?? copy.description}</p>
          <div className="flex flex-col gap-3 [@container(min-width:48rem)]:flex-row">
            <a href={primary.href} className={buttonVariants({ variant: "secondary", size: "lg" })}>
              {primary.label}
            </a>
            {secondary ? (
              <a
                href={secondary.href}
                // Figma sets the ghost label in `primary-foreground` to read on
                // the band; the hover tint follows it, so the label stays legible.
                className={buttonVariants({
                  variant: "ghost",
                  tone: "secondary",
                  size: "lg",
                  className: "text-primary-foreground hover:bg-primary-foreground/10 active:bg-primary-foreground/10 dark:text-foreground hover:dark:bg-foreground/10 active:dark:bg-foreground/10",
                })}
              >
                {secondary.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroVideoInTypeCopy = COPY
