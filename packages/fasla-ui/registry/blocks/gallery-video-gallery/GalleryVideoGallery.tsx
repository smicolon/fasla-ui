"use client"

import * as React from "react"
import { ArrowUpRightIcon, Maximize2Icon, PlayIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Button, buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Gallery` (42478:479), Type=Video Gallery.
 *
 * A start-aligned header with an "All videos" link at its end, one featured
 * video across the full width, and a row of three clips under it. The
 * featured poster carries a scrim, a large play disc in its centre and, from
 * Tablet up, its caption and a full-screen button along the bottom. Each
 * clip is a poster with a small play button and a duration Badge at its
 * foot, and its title and category under it. Tablet puts the clips two to a
 * row and lets an odd last one take the whole row, as Figma's third clip
 * does; a phone lists them as rows, the poster at the start and the text
 * beside it, and moves the featured caption under its poster.
 *
 * No video ships with the block: the posters are photos, passed on each
 * video (`videos[i].image`), and until then each shows a `muted`
 * placeholder of the same box. The first video is the featured one. Playing
 * is the page's job: a video with an `href` makes its play controls links to
 * it; without one they are buttons that call `onPlayVideo(index, { fullscreen })`,
 * so a page can open its own player. Nothing autoplays.
 *
 * The scrims and the featured caption are the inverse tokens Figma binds, so
 * the block needs the `theme-inverse` item. The featured meta line is
 * Figma's `muted`, a light tone on the dark scrim.
 *
 * In Arabic the header, the clip rows and every caption mirror; the play
 * triangles keep pointing right, as media controls do in Figma's RTL
 * variants, and only the "All videos" arrow turns. Durations and numbers sit
 * in `<bdi dir="ltr">`, and a meta line is separate parts with the middle
 * dot between them. The photographs are never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container, so the block lays out for the room it is
 * given, such as a docs preview narrower than the screen. The base classes
 * are Figma's Mobile (360); `[@container(min-width:40rem)]:` is its Tablet,
 * from 640px of content (Figma's Tablet, 768 less its padding), and
 * `[@container(min-width:64rem)]:` its Desktop, from 1024px of content.
 * The section's own padding still follows the window, since an element
 * can't query itself.
 */

export interface GalleryVideoGalleryPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryVideoGalleryVideo {
  /** The video's title, an `h3`. */
  title: React.ReactNode
  /** What kind of video it is ("Documentary", "Culture"). One line. */
  category: React.ReactNode
  /** The running time, as it should read ("4:12"). On a clip it is the Badge on the poster. */
  duration: string
  /** Where the video plays. With it, the play controls are links; without it, they call `onPlayVideo`. */
  href?: string
  /**
   * The poster. None by default: the poster shows a `muted` placeholder.
   * @default none: `muted` placeholder
   */
  image?: GalleryVideoGalleryPhoto
}

export interface GalleryVideoGalleryCopy {
  /** The short label above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The outline link at the header's end. Hidden when null. */
  allAction: { label: React.ReactNode; href: string } | null
  /**
   * The videos, in order: the first is the featured one, the rest the clips
   * under it. Each has a `title`, a `category`, a `duration`, and an optional
   * `href` and `image`.
   */
  videos: GalleryVideoGalleryVideo[]
  /** Read before a video's title on its play controls: "Play". */
  playLabel: string
  /** Read before the featured video's title on the full-screen button. */
  fullscreenLabel: string
  /** Shown in place of the videos when `videos` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryVideoGalleryCopy> = {
  en: {
    eyebrow: "WATCH",
    heading: "Films and studio sessions",
    allAction: { label: "All videos", href: "#videos" },
    videos: [
      { title: "Inside the studio: a year in 4 minutes", category: "Documentary", duration: "4:12" },
      { title: "Dashboards, explained", category: "Product walkthrough", duration: "2:48" },
      { title: "How we run design crits", category: "Behind the scenes", duration: "6:15" },
      { title: "Summer picnic 2026", category: "Culture", duration: "1:30" },
    ],
    playLabel: "Play",
    fullscreenLabel: "Watch full screen",
    empty: "No videos yet.",
  },
  ar: {
    eyebrow: "شاهد",
    heading: "أفلام وجلسات من الاستوديو",
    allAction: { label: "كل المقاطع", href: "#videos" },
    videos: [
      {
        title: (
          <>
            داخل الاستوديو: عام في <bdi dir="ltr">4</bdi> دقائق
          </>
        ),
        category: "فيلم وثائقي",
        duration: "4:12",
      },
      { title: "لوحات المعلومات، بالتفصيل", category: "جولة في المنتج", duration: "2:48" },
      { title: "كيف ندير جلسات نقد التصميم", category: "من كواليس العمل", duration: "6:15" },
      {
        title: (
          <>
            نزهة الصيف <bdi dir="ltr">2026</bdi>
          </>
        ),
        category: "ثقافة الفريق",
        duration: "1:30",
      },
    ],
    playLabel: "تشغيل",
    fullscreenLabel: "المشاهدة بملء الشاشة",
    empty: "لا توجد مقاطع بعد.",
  },
}

const FOCUS =
  "[outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const ICON = { size: 16, strokeWidth: 1.5, absoluteStrokeWidth: true, "aria-hidden": true } as const

function Poster({ image }: { image?: GalleryVideoGalleryPhoto }) {
  return image ? (
    <img
      src={image.src}
      alt={image.alt}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 size-full object-cover"
    />
  ) : null
}

export interface GalleryVideoGalleryProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryVideoGalleryCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * Called when a play control of a video without an `href` is pressed, with
   * the video's index in `videos`. `fullscreen` is true for the featured
   * video's full-screen button.
   */
  onPlayVideo?: (index: number, options: { fullscreen: boolean }) => void
}

export function GalleryVideoGallery({
  locale = "en",
  eyebrow,
  heading,
  allAction,
  videos,
  playLabel,
  fullscreenLabel,
  empty,
  onPlayVideo,
  className,
  ...props
}: GalleryVideoGalleryProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const baseId = React.useId()
  const list = videos ?? copy.videos
  const all = allAction === undefined ? copy.allAction : allAction
  const featured = list[0]
  const clips = list.slice(1)

  // Each control is named by a hidden label plus the video's own title, so
  // a title written with JSX (Arabic with `<bdi>`) still names it.
  const playId = `${baseId}-play`
  const fullscreenId = `${baseId}-fullscreen`
  const titleId = (index: number) => `${baseId}-title-${index}`

  /** A play control: a link to the video when it has an `href`, else a button that calls `onPlayVideo`. */
  const control = (
    index: number,
    video: GalleryVideoGalleryVideo,
    fullscreen: boolean,
    className: string,
    children: React.ReactNode,
    variant?: "default" | "secondary",
    size?: "icon-sm" | "icon-md"
  ) => {
    const labelledBy = `${fullscreen ? fullscreenId : playId} ${titleId(index)}`
    if (video.href) {
      return (
        <a
          href={video.href}
          aria-labelledby={labelledBy}
          className={variant ? buttonVariants({ variant, size, radius: "rounded", className }) : className}
        >
          {children}
        </a>
      )
    }
    if (variant) {
      return (
        <Button
          type="button"
          variant={variant}
          size={size}
          radius="rounded"
          aria-labelledby={labelledBy}
          onClick={() => onPlayVideo?.(index, { fullscreen })}
          className={className}
        >
          {children}
        </Button>
      )
    }
    return (
      <button
        type="button"
        aria-labelledby={labelledBy}
        onClick={() => onPlayVideo?.(index, { fullscreen })}
        className={className}
      >
        {children}
      </button>
    )
  }

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <span id={playId} hidden>
        {playLabel ?? copy.playLabel}
      </span>
      <span id={fullscreenId} hidden>
        {fullscreenLabel ?? copy.fullscreenLabel}
      </span>

      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-10">
        <header className="flex flex-col items-start gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-16">
          <div className="flex min-w-0 flex-col gap-3 [@container(min-width:64rem)]:gap-4">
            <p className="text-xs font-medium text-primary">{eyebrow ?? copy.eyebrow}</p>
            <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
              {heading ?? copy.heading}
            </h2>
          </div>
          {all ? (
            <a href={all.href} className={buttonVariants({ variant: "outline" })}>
              {all.label}
              <ArrowUpRightIcon {...ICON} className="[&:dir(rtl)]:-scale-x-100" />
            </a>
          ) : null}
        </header>

        {!featured ? (
          <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <>
            <article className="relative flex flex-col gap-3">
              <div className="relative aspect-[37/25] overflow-hidden rounded-lg bg-muted [@container(min-width:40rem)]:aspect-[8/5] [@container(min-width:64rem)]:aspect-[78/35]">
                <Poster image={featured.image} />
                <div aria-hidden="true" className="absolute inset-0 bg-background-inverse/35" />
                {control(
                  0,
                  featured,
                  false,
                  cn(
                    "absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full bg-card text-foreground shadow-lg",
                    FOCUS
                  ),
                  <PlayIcon size={24} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                )}
              </div>
              {/* Under the poster on a phone; over its foot, on the scrim, from Tablet up. */}
              <div className="flex items-end justify-between gap-4 [@container(min-width:40rem)]:pointer-events-none [@container(min-width:40rem)]:absolute [@container(min-width:40rem)]:inset-x-6 [@container(min-width:40rem)]:bottom-6">
                <div className="flex min-w-0 flex-col gap-1">
                  <h3 id={titleId(0)} className="text-base font-semibold text-foreground [@container(min-width:40rem)]:text-xl [@container(min-width:40rem)]:text-foreground-inverse">
                    {featured.title}
                  </h3>
                  <p className="whitespace-nowrap text-sm text-muted-foreground [@container(min-width:40rem)]:text-muted">
                    <span>{featured.category}</span>
                    <span aria-hidden="true" className="mx-1">
                      ·
                    </span>
                    <bdi dir="ltr">{featured.duration}</bdi>
                  </p>
                </div>
                {control(
                  0,
                  featured,
                  true,
                  "pointer-events-auto hidden [@container(min-width:40rem)]:inline-flex",
                  <Maximize2Icon {...ICON} />,
                  "secondary",
                  "icon-md"
                )}
              </div>
            </article>

            {clips.length > 0 ? (
              <ul className="grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:grid-cols-3">
                {clips.map((clip, i) => {
                  const index = i + 1
                  // Tablet's odd last clip takes the whole row, as Figma's third does.
                  const spans = i === clips.length - 1 && clips.length % 2 === 1
                  return (
                    <li
                      key={index}
                      className={cn(
                        "flex items-center gap-3 [@container(min-width:40rem)]:flex-col [@container(min-width:40rem)]:items-stretch",
                        spans && "[@container(min-width:40rem)]:col-span-2 [@container(min-width:64rem)]:col-span-1"
                      )}
                    >
                      <div className="relative h-[90px] w-[140px] shrink-0 overflow-hidden rounded-lg bg-muted [@container(min-width:40rem)]:h-[200px] [@container(min-width:40rem)]:w-auto [@container(min-width:64rem)]:aspect-[25/14] [@container(min-width:64rem)]:h-auto">
                        <Poster image={clip.image} />
                        <div aria-hidden="true" className="absolute inset-0 bg-background-inverse/20" />
                        <div className="absolute inset-x-2 bottom-2 flex items-end justify-between gap-2 [@container(min-width:40rem)]:inset-x-3 [@container(min-width:40rem)]:bottom-3">
                          {control(index, clip, false, "", <PlayIcon {...ICON} />, "default", "icon-sm")}
                          <Badge variant="solid" tone="secondary" size="sm" radius="rounded">
                            <bdi dir="ltr">{clip.duration}</bdi>
                          </Badge>
                        </div>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <h3 id={titleId(index)} className="text-base font-semibold text-foreground">
                          {clip.title}
                        </h3>
                        <p className="truncate text-sm text-muted-foreground">{clip.category}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const galleryVideoGalleryCopy = COPY
