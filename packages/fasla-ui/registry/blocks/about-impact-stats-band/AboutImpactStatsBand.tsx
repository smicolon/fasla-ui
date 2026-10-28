"use client"

import * as React from "react"
import { Pause, Play } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `About` (46368:243915), Type=Impact Stats Band.
 *
 * A full-bleed media strip, 340px tall, edge to edge (the block's root has
 * no padding), over a stats band on `primary`. The band, padded like any
 * section, centres three stats (a 48px figure over a small label, 96px
 * apart), then the mission heading and a paragraph held to 640px, then a
 * Secondary button.
 *
 * Tablet shortens the strip to 280px, the figures to 36px and their gap to
 * 48px, and lets the paragraph run the band's width. Mobile shortens the
 * strip to 200px, shares the band's width between the three stats in equal
 * columns, drops the heading to 24px and makes the button full width.
 *
 * In Arabic the stats run right to left in reading order and the copy is
 * centred as in English. The photo is never flipped, and neither is the play
 * glyph (media convention), as Figma's motion card says.
 *
 * Motion: Figma's card has the strip as an autoplaying, looping video. This
 * block never autoplays: the strip is a photo, and the play chip (Figma's
 * "Play Control") appears only when `videoSrc` is passed. It then plays and
 * pauses a muted inline video over the strip, as a toggle button with
 * `aria-pressed`. The figures count up from 0 over 1.5s, ease-out, once,
 * when the band scrolls into view; on a phone they start 150ms apart in
 * reading order. Under reduced motion the final values show at once.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container, and since it has no padding of its own the
 * band's padding follows the block's width too. The base classes are
 * Figma's Mobile (360); `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop.
 */

export interface AboutImpactStatsBandAction {
  label: React.ReactNode
  href: string
}

export interface AboutImpactStatsBandPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface AboutImpactStatsBandStat {
  /**
   * The figure, as it should read when the count ends, such as "140+". Its
   * number counts up from 0; the text around it stays.
   */
  value: string
  /** The label under the figure. */
  label: React.ReactNode
}

export interface AboutImpactStatsBandCopy {
  /** The three stats, in reading order. */
  stats: AboutImpactStatsBandStat[]
  /** The mission heading, the section's heading, an `h2`. */
  heading: React.ReactNode
  /** The paragraph under the heading. */
  description: React.ReactNode
  /** The button under the paragraph. Hidden when null. */
  action: AboutImpactStatsBandAction | null
  /** The play chip's accessible name. Its pressed state says whether the video plays. */
  videoLabel: string
  /** Shown in place of the stats when `stats` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AboutImpactStatsBandCopy> = {
  en: {
    stats: [
      { value: "140+", label: "PEOPLE" },
      { value: "12", label: "COUNTRIES" },
      { value: "1", label: "MISSION" },
    ],
    heading: "The future of work is calm.",
    description:
      "We're building it with patient engineering and ship-day energy — one release at a time. See what the mission has changed so far.",
    action: { label: "Explore impact", href: "#impact" },
    videoLabel: "Play video",
    empty: "No figures yet.",
  },
  ar: {
    stats: [
      { value: "140+", label: "شخص" },
      { value: "12", label: "دولة" },
      { value: "1", label: "مهمة" },
    ],
    heading: "مستقبل العمل هادئ.",
    description: "نبنيه بهندسة صبورة وطاقة يوم الإطلاق، إصدارًا بعد إصدار. اطّلع على ما غيّرته المهمة حتى الآن.",
    action: { label: "استكشف الأثر", href: "#impact" },
    videoLabel: "تشغيل الفيديو",
    empty: "لا توجد أرقام بعد.",
  },
}

const FIGURE = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(\D*)$/

/** Splits "140+" into the text before the number, the number and the text after it. */
function parseFigure(text: string) {
  const match = FIGURE.exec(text)
  if (!match) return null
  const digits = match[2]!.replace(/,/g, "")
  return {
    prefix: match[1]!,
    value: Number(digits),
    decimals: digits.includes(".") ? digits.split(".")[1]!.length : 0,
    suffix: match[3]!,
  }
}

type Figure = NonNullable<ReturnType<typeof parseFigure>>

/** Western digits with grouping commas, in both languages, as Figma writes them. */
function formatFigure(figure: Figure, value: number) {
  const digits = value.toLocaleString("en-US", {
    minimumFractionDigits: figure.decimals,
    maximumFractionDigits: figure.decimals,
  })
  return figure.prefix + digits + figure.suffix
}

/**
 * Counts every `[data-count]` inside `scope` up from 0 over 1.5s, ease-out,
 * once, when `scope` scrolls into view. On a phone-width block they start
 * 150ms apart, in DOM order, which is reading order in both directions. The
 * visible figure is `aria-hidden`; the real value sits beside it for screen
 * readers, and is put back if the block unmounts mid-count.
 */
function useCountUp(scope: React.RefObject<HTMLElement | null>, key: string) {
  React.useLayoutEffect(() => {
    const node = scope.current
    if (!node || typeof IntersectionObserver === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const figures = Array.from(node.querySelectorAll<HTMLElement>("[data-count]")).flatMap((element) => {
      const figure = parseFigure(element.dataset.count ?? "")
      return figure ? [{ element, figure }] : []
    })
    if (figures.length === 0) return
    figures.forEach(({ element, figure }) => (element.textContent = formatFigure(figure, 0)))
    let frame = 0
    const run = () => {
      // Figma's Mobile: the stats start one after another.
      const offset = node.getBoundingClientRect().width < 640 ? 150 : 0
      const start = performance.now()
      const tick = (now: number) => {
        let running = false
        figures.forEach(({ element, figure }, index) => {
          const t = Math.max(0, Math.min(1, (now - start - index * offset) / 1500))
          if (t < 1) running = true
          element.textContent = formatFigure(figure, figure.value * (1 - Math.pow(1 - t, 3)))
        })
        if (running) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        run()
      },
      { threshold: 0.5 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      figures.forEach(({ element }) => (element.textContent = element.dataset.count ?? ""))
    }
  }, [scope, key])
}

export interface AboutImpactStatsBandProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AboutImpactStatsBandCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The media strip's photo, the one slot. It is also the video's poster.
   * Photos past the first are not shown. None by default: a `muted`
   * placeholder.
   * @default none: a `muted` placeholder
   */
  photos?: AboutImpactStatsBandPhoto[]
  /**
   * A video for the strip. When set, the play chip appears and plays it,
   * muted and inline, over the photo. It never plays on its own.
   */
  videoSrc?: string
}

export function AboutImpactStatsBand({
  locale = "en",
  stats,
  heading,
  description,
  action,
  videoLabel,
  empty,
  photos,
  videoSrc,
  className,
  ...props
}: AboutImpactStatsBandProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const band = React.useRef<HTMLDivElement>(null)
  const video = React.useRef<HTMLVideoElement>(null)
  const [started, setStarted] = React.useState(false)
  const [playing, setPlaying] = React.useState(false)
  // A new or removed video starts over: not mounted, not playing, so the
  // chip never shows Pause for a video that isn't playing.
  const [source, setSource] = React.useState(videoSrc)
  if (source !== videoSrc) {
    setSource(videoSrc)
    setStarted(false)
    setPlaying(false)
  }
  const figures = stats ?? copy.stats
  const button = action === undefined ? copy.action : action
  const photo = photos?.[0]

  useCountUp(band, figures.map((figure) => figure.value).join("|"))

  // Once the video is mounted by the first press, play it.
  React.useEffect(() => {
    if (started && playing) void video.current?.play().catch(() => setPlaying(false))
  }, [started, playing])

  const toggle = () => {
    if (!started) {
      setStarted(true)
      setPlaying(true)
      return
    }
    const node = video.current
    if (!node) return
    if (node.paused) void node.play().catch(() => setPlaying(false))
    else node.pause()
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size]", className)}
      {...props}
    >
      <div className="relative flex h-[200px] items-center justify-center overflow-hidden bg-muted [@container(min-width:40rem)]:h-[280px] [@container(min-width:64rem)]:h-[340px]">
        {photo ? (
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        ) : null}
        {videoSrc && started ? (
          <video
            ref={video}
            src={videoSrc}
            poster={photo?.src}
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            className="absolute inset-0 size-full object-cover"
          />
        ) : null}
        {videoSrc ? (
          <button
            type="button"
            aria-pressed={playing}
            aria-label={videoLabel ?? copy.videoLabel}
            onClick={toggle}
            className="relative flex size-16 items-center justify-center rounded-full bg-card text-foreground shadow-lg [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {playing ? (
              <Pause size={24} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
            ) : (
              <Play size={24} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
            )}
          </button>
        ) : null}
      </div>

      <div className="flex flex-col items-center gap-12 bg-primary px-4 py-8 text-center text-primary-foreground [@container(min-width:40rem)]:px-6 [@container(min-width:40rem)]:py-16 [@container(min-width:64rem)]:p-24">
        <div ref={band} className="w-full">
          {figures.length === 0 ? (
            <p className="text-sm">{empty ?? copy.empty}</p>
          ) : (
            <dl className="mx-auto grid w-full max-w-max grid-cols-3 gap-6 [@container(min-width:40rem)]:flex [@container(min-width:40rem)]:gap-12 [@container(min-width:64rem)]:gap-24">
              {figures.map((figure, index) => (
                <div key={index} className="flex flex-col-reverse items-center gap-1">
                  <dt className="text-sm">{figure.label}</dt>
                  <dd className="text-4xl font-semibold tabular-nums [@container(min-width:64rem)]:text-5xl">
                    <span aria-hidden="true" dir="ltr" data-count={figure.value}>
                      {figure.value}
                    </span>
                    <span className="sr-only">{figure.value}</span>
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="flex w-full flex-col items-center gap-5">
          <h2 id={headingId} className="text-2xl font-semibold [@container(min-width:40rem)]:text-3xl">
            {heading ?? copy.heading}
          </h2>
          <p className="text-base [@container(min-width:64rem)]:max-w-[640px]">{description ?? copy.description}</p>
        </div>

        {button ? (
          <a
            href={button.href}
            className={buttonVariants({
              variant: "secondary",
              className: "w-full [@container(min-width:40rem)]:w-auto",
            })}
          >
            {button.label}
          </a>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const aboutImpactStatsBandCopy = COPY
