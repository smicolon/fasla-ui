"use client"

import * as React from "react"
import { CircleDot, Hand, MessageSquare, Mic, MonitorUp, PhoneOff, Star, Users, Video, Zap } from "lucide-react"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { cn } from "../../../src/lib/utils"
import {
  BASE_MS,
  FAST_MS,
  Figures,
  STAGGER_MS,
  STANDARD,
  VideoCallSection,
  containerTier,
  passedCopy,
  prefersReducedMotion,
  restOf,
  type VideoCallLocale,
  type VideoCallPhotos,
} from "../video-call/video-call"

/*
 * Figma: `Video Call` (42869:1033), Type=Hero — Call Mockup.
 *
 * The marketing hero for a page that sells a call product: a tag, the
 * headline, a line under it, two buttons, and a line of proof (five faces,
 * five stars and what they say), beside a picture of the product, a call with
 * a bar, three tiles and a dock. The picture is a still: it does nothing, and
 * is hidden from assistive technology and from the keyboard.
 *
 * Desktop sets the copy 580px wide at the start and the mockup filling the
 * rest, centred on the copy. Tablet stacks them, the copy over the mockup,
 * with the headline still 48px. A phone sets the headline at 30px, the buttons
 * full width and the proof in a column, and the mockup keeps two tiles and a
 * dock of three controls and Leave.
 *
 * On load the tag, headline, line, buttons and proof each rise 16px and fade
 * in, 70ms apart. The mockup follows 120ms after the last, scaling from 0.96
 * with its shadow growing in the same move, and then its tiles settle one after
 * another, 60ms apart. The REC dot pulses only once the mockup has landed, and
 * it is the one thing in the block that loops. A phone has no scale (a 0.96
 * scale does not read at that size), so the mockup fades in. Reduced motion
 * shows everything in one 120ms fade and nothing loops. The motion has no
 * reading direction; the columns mirror, and the tiles fill from the start.
 *
 * Stills only. The buttons call `onStart` and `onTour`.
 *
 * Content limits: a headline up to 32 characters and a line under it up to
 * 140. The other limits are in the block's documentation page, which the
 * default copy stays inside.
 */

export interface VideoCallHeroTile {
  /** Keys the tile, and picks its photo from `photos`. */
  id: string
  /** The name on the chip: `Mona`. */
  name: string
}

export interface VideoCallHeroCallMockupCopy {
  /** The small badge above the headline. */
  tag: string
  /** The headline, an `h2`. */
  heading: string
  /** The line under it. */
  description: string
  /** The primary button, and the outline one beside it. */
  start: string
  tour: string
  /** What the proof says, beside the faces and the stars. */
  proof: string
  /** Names the five stars: `Rated 4.9 out of 5`. */
  ratingLabel: string
  /** The faces in the proof, by `id` in `photos`. */
  people: string[]
  /** What the mockup's bar says: the call's name, the recording badge and the head count. */
  mockupTitle: string
  rec: string
  count: string
  /** The mockup's tiles, in order. A phone shows the first two. */
  tiles: VideoCallHeroTile[]
  /** The mockup's five dock controls, in order (mic, camera, share, chat, hand), named for the warning every icon button raises. */
  controls: string[]
  /** The mockup's Leave button. */
  leave: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<VideoCallLocale, VideoCallHeroCallMockupCopy> = {
  en: {
    tag: "No downloads · joins in one tap",
    heading: "Meetings that start on time",
    description: "Fasla runs in the browser, remembers every device choice, and hands you the recap before anyone has left the room.",
    start: "Start a free room",
    tour: "Watch a 2-min tour",
    proof: "4.9 from 2,100 teams that switched this year",
    ratingLabel: "Rated 4.9 out of 5",
    people: ["mona", "karim", "nour", "tariq", "layla"],
    mockupTitle: "Design sync",
    rec: "REC",
    count: "3",
    tiles: [
      { id: "mona", name: "Mona" },
      { id: "adam", name: "Adam" },
      { id: "nour", name: "Nour" },
    ],
    controls: ["Mute", "Camera", "Share screen", "Chat", "Raise hand"],
    leave: "Leave",
  },
  ar: {
    tag: "بدون تنزيل وانضمام بلمسة واحدة",
    heading: "اجتماعات تبدأ في وقتها",
    description: "تعمل فاصلة في المتصفح، وتتذكر كل اختيار للأجهزة، وتمنحك الملخّص قبل أن يخرج أحد من الغرفة.",
    start: "ابدأ غرفة مجانية",
    tour: "شاهد جولة بدقيقتين",
    proof: "4.9 من 2,100 فريق انتقلوا هذا العام",
    ratingLabel: "تقييم 4.9 من 5",
    people: ["mona", "karim", "nour", "tariq", "layla"],
    mockupTitle: "مزامنة التصميم",
    rec: "تسجيل",
    count: "3",
    tiles: [
      { id: "mona", name: "منى" },
      { id: "adam", name: "آدم" },
      { id: "nour", name: "نور" },
    ],
    controls: ["كتم", "الكاميرا", "مشاركة الشاشة", "الدردشة", "رفع اليد"],
    leave: "خروج",
  },
}

const COPY_KEYS = Object.keys(COPY.en)

/** Names for the faces in the proof, for the avatars' accessible names. */
const PERSON_NAMES: Record<VideoCallLocale, Record<string, string>> = {
  en: { mona: "Mona Darwish", karim: "Karim Nasser", nour: "Nour Khalil", tariq: "Tariq Aziz", layla: "Layla Hassan" },
  ar: { mona: "منى درويش", karim: "كريم ناصر", nour: "نور خليل", tariq: "طارق عزيز", layla: "ليلى حسن" },
}

export interface VideoCallHeroCallMockupProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<VideoCallHeroCallMockupCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: VideoCallLocale
  /** The photos of the faces and tiles, by `id`. A person without one shows their initials. */
  photos?: VideoCallPhotos
  /** Called when the primary button (Start a free room) is pressed. */
  onStart?: () => void
  /** Called when the outline button (Watch a 2-min tour) is pressed. */
  onTour?: () => void
}

/**
 * The mockup's still: a tile is a photo with a name chip at the bottom start.
 * The shared `ParticipantTile` carries a mic mark on its chip, which this
 * picture does not draw, so the tile is its own few lines.
 */
function MockTile({ name, photo, className }: { name: string; photo?: { src: string; alt: string }; className?: string }) {
  return (
    <div data-hero-tile="" className={cn("relative isolate overflow-hidden rounded-lg bg-muted", className)}>
      {photo ? <img src={photo.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 -z-10 size-full object-cover object-[50%_42%]" /> : null}
      <Badge variant="solid" tone="primary" size="lg" radius="standard" className="absolute bottom-2 start-2">
        <Figures>{name}</Figures>
      </Badge>
    </div>
  )
}

export function VideoCallHeroCallMockup({ locale = "en", photos, onStart, onTour, className, ...props }: VideoCallHeroCallMockupProps) {
  const copy = { ...COPY[locale], ...passedCopy(COPY_KEYS, props) } as VideoCallHeroCallMockupCopy
  const rest = restOf(COPY_KEYS, props) as React.HTMLAttributes<HTMLElement>
  const headingId = React.useId()
  const anchor = React.useRef<HTMLDivElement>(null)
  const names = PERSON_NAMES[locale]

  // The copy rises 70ms apart, the mockup follows and its tiles settle, and the REC dot pulses once it has landed.
  React.useLayoutEffect(() => {
    const node = anchor.current?.closest<HTMLElement>("[data-video-call]")
    if (!node) return
    const copyNodes = Array.from(node.querySelectorAll<HTMLElement>("[data-hero-copy]")).filter((item) => typeof item.animate === "function")
    const mock = node.querySelector<HTMLElement>("[data-hero-mock]")
    const tiles = Array.from(node.querySelectorAll<HTMLElement>("[data-hero-tile]")).filter((item) => typeof item.animate === "function")
    const dot = node.querySelector<HTMLElement>("[data-hero-dot]")
    const animations: Animation[] = []
    let cancelled = false
    const fade = [{ opacity: 0 }, { opacity: 1 }]

    if (prefersReducedMotion()) {
      for (const item of [...copyNodes, ...(mock && typeof mock.animate === "function" ? [mock] : [])]) animations.push(item.animate(fade, { duration: FAST_MS, easing: STANDARD, fill: "backwards" }))
      return () => animations.forEach((animation) => animation.cancel())
    }

    copyNodes.forEach((item, index) => {
      animations.push(
        item.animate([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], {
          duration: BASE_MS,
          delay: index * 70,
          easing: STANDARD,
          fill: "backwards",
        })
      )
    })

    const mockDelay = Math.max(copyNodes.length - 1, 0) * 70 + 120
    if (mock && typeof mock.animate === "function") {
      const phone = containerTier(node) === "mobile"
      // The shadow it grows into is the one `shadow-2xl` gives it, read off the element so the token stays the only source.
      const restShadow = getComputedStyle(mock).boxShadow || "none"
      const landed = mock.animate(
        phone
          ? fade
          : [
              { opacity: 0, transform: "scale(0.96)", boxShadow: "none" },
              { opacity: 1, transform: "none", boxShadow: restShadow },
            ],
        { duration: 240, delay: mockDelay, easing: STANDARD, fill: "backwards" }
      )
      animations.push(landed)
      tiles.forEach((item, index) => {
        animations.push(
          item.animate([{ opacity: 0, transform: "scale(0.98)" }, { opacity: 1, transform: "none" }], {
            duration: BASE_MS,
            delay: mockDelay + 240 + index * STAGGER_MS,
            easing: STANDARD,
            fill: "backwards",
          })
        )
      })
      // The one loop in the block starts when the mockup has landed.
      const pulse = () => {
        if (cancelled || !dot || typeof dot.animate !== "function") return
        animations.push(dot.animate([{ opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }], { duration: 1600, iterations: Infinity, easing: "ease-in-out" }))
      }
      if (landed.finished) landed.finished.then(pulse, () => undefined)
      else pulse()
    }

    return () => {
      cancelled = true
      animations.forEach((animation) => animation.cancel())
    }
  }, [])

  return (
    <VideoCallSection
      labelledBy={headingId}
      className={className}
      gap="sm"
      contentClassName="gap-6 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:gap-12"
      {...rest}
    >
      <div ref={anchor} className="flex min-w-0 flex-col gap-6 [@container(min-width:64rem)]:w-[580px] [@container(min-width:64rem)]:shrink-0">
        <div data-hero-copy="" className="flex">
          <Badge variant="solid" tone="primary" size="lg" radius="rounded" icon={<Zap />}>
            <Figures>{copy.tag}</Figures>
          </Badge>
        </div>
        <h2 id={headingId} data-hero-copy="" className="text-balance text-3xl font-semibold text-foreground [@container(min-width:40rem)]:text-5xl">
          {copy.heading}
        </h2>
        <p data-hero-copy="" className="max-w-[580px] text-base text-muted-foreground">
          {copy.description}
        </p>
        <div data-hero-copy="" className="flex flex-col gap-2 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-3">
          <Button type="button" size="lg" onClick={onStart} className="w-full [@container(min-width:40rem)]:w-auto">
            {copy.start}
          </Button>
          <Button type="button" size="lg" variant="outline" tone="secondary" onClick={onTour} className="w-full [@container(min-width:40rem)]:w-auto">
            {copy.tour}
          </Button>
        </div>
        <div data-hero-copy="" className="flex flex-col items-start gap-2 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-3">
          <div aria-hidden className="flex shrink-0 items-center gap-1.5">
            {copy.people.map((id) => (
              <Avatar key={id} size="32" radius="standard" variant={photos?.[id] ? "image" : "initials"} src={photos?.[id]?.src} name={names[id] ?? id} />
            ))}
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <div role="img" aria-label={copy.ratingLabel} className="flex items-center gap-1.5 text-warning">
              {Array.from({ length: 5 }, (_, index) => (
                <Star key={index} aria-hidden className="size-3.5" />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              <Figures>{copy.proof}</Figures>
            </p>
          </div>
        </div>
      </div>

      <div className="min-w-0 [@container(min-width:64rem)]:flex-1">
        <div
          data-hero-mock=""
          aria-hidden
          // The picture is a still: nothing in it takes focus or a click.
          {...({ inert: "" } as Record<string, unknown>)}
          className="pointer-events-none flex select-none flex-col gap-2 rounded-[0.875rem] border border-border bg-card p-2 shadow-2xl"
        >
          <div className="flex h-8 items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Badge variant="solid" tone="destructive" size="lg" radius="rounded" icon={<span data-hero-dot="" className="inline-flex size-3 items-center justify-center [&>svg]:size-3"><CircleDot /></span>}>
                {copy.rec}
              </Badge>
              <span className="text-xs text-foreground">
                <Figures>{copy.mockupTitle}</Figures>
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users aria-hidden className="size-3" />
              <Figures>{copy.count}</Figures>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 [@container(min-width:40rem)]:grid-cols-3">
            {copy.tiles.map((tile, index) => (
              <MockTile
                key={tile.id}
                name={tile.name}
                photo={photos?.[tile.id]}
                className={cn("h-[7.5rem] [@container(min-width:40rem)]:h-[11.75rem]", index > 1 && "hidden [@container(min-width:40rem)]:block")}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-1.5 py-1.5">
            {[0, 1, 2, 3, 4].map((index) => (
              <Button key={index} type="button" tabIndex={-1} size="icon-sm" radius="rounded" aria-label={copy.controls[index]} aria-hidden className={cn(index > 2 && "hidden [@container(min-width:40rem)]:inline-flex")}>
                {React.createElement(DOCK_GLYPHS[index]!, { "aria-hidden": true })}
              </Button>
            ))}
            <Button type="button" tabIndex={-1} size="sm" radius="rounded" variant="default" tone="destructive" aria-hidden>
              <PhoneOff aria-hidden />
              {copy.leave}
            </Button>
          </div>
        </div>
      </div>
    </VideoCallSection>
  )
}

/** The dock's five controls, in Figma's order: mic, camera, share, chat, hand. */
const DOCK_GLYPHS: React.ElementType[] = [Mic, Video, MonitorUp, MessageSquare, Hand]

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const videoCallHeroCallMockupCopy = COPY
