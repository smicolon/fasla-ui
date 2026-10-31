"use client"

import * as React from "react"
import { Maximize, Presentation, ScreenShareOff, TrendingUp, Users } from "lucide-react"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { cn } from "../../../src/lib/utils"
import {
  CallStage,
  ControlsDock,
  Figures,
  ParticipantTile,
  STAGE_DOCK_COPY,
  STANDARD,
  VideoCallSection,
  containerTier,
  fillTemplate,
  playEntrance,
  prefersReducedMotion,
  stageDockControls,
  type StageDockCopy,
  type VideoCallLocale,
  type VideoCallParticipant,
  type VideoCallPhotos,
} from "../video-call/video-call"

/*
 * Figma: `Video Call` (42869:1033), Type=Screen Share Stage.
 *
 * A call stage in a card while someone presents: a bar that says who is
 * presenting (and to whom) with a Stop presenting button, the people count and
 * fullscreen at the end; the shared surface; the presenter rail; and the
 * controls dock.
 *
 * The shared surface is a capture of someone else's screen, so it keeps its own
 * direction: it follows the language of what was captured, not the page's
 * `dir` (an Arabic capture is right to left even in an English page). Only the
 * Fasla chrome around it mirrors. Here it is a small analytics slide, built from
 * plain elements.
 *
 * Desktop puts the surface beside a 240px rail of tiles; Tablet puts the rail
 * under the surface as a strip; a phone keeps a fixed 300px band with the slide
 * header and two stats stacked (no third stat, no chart), two thumbnails in
 * the rail and a 44px icon-only Leave.
 *
 * Starting a share wipes the surface in from the rail's side with a clip-path
 * inset over 200ms (bottom-up when the rail is a strip under it; a straight
 * 160ms cross-fade on a phone, where the travel is too short to read), while
 * the "is presenting" line drops 8px and fades in. The presenting frame pulses
 * once and then holds: a permanent pulse around live content tires the eye.
 * Stopping reverses the wipe and leaves the presenter's camera in the surface's
 * place. Reduced motion makes every wipe a plain fade.
 *
 * Stills only. Every real action (Stop presenting, fullscreen, the dock) is a
 * callback; whether the share is on is state the block keeps itself.
 *
 * Content limits: the slide's title up to 32 characters, a stat label up to 20.
 * The other limits are in the block's documentation page, which the default
 * copy stays inside.
 */

export interface VideoCallShareStat {
  id: string
  label: string
  value: string
  /** The trend line beside the value, in `success`. */
  trend: string
}

export interface VideoCallScreenShareStageCopy {
  /** The line that says who presents: "Karim is presenting". */
  presenting: string
  /** The muted line under it. */
  audience: string
  /** What the bar says once the share has stopped. */
  stopped: string
  /** Stop presenting, and the button that starts a share again. */
  stop: string
  start: string
  /** Names the fullscreen button. */
  fullscreen: string
  /** Names the people badge; `{count}` is filled in. */
  people: string
  /** The slide's title, and the line under it. */
  slideTitle: string
  slideMeta: string
  /** The slide's stats. A phone shows the first two. */
  stats: VideoCallShareStat[]
  /** The tiles in the rail: the presenter first. A phone shows two. */
  participants: VideoCallParticipant[]
  /** The dock's controls, and Leave's three lines. */
  dock: StageDockCopy
}

/** The heights of the slide's twelve bars, in percent; the last is `primary`. */
const BARS = [32, 44, 38, 54, 48, 64, 58, 75, 68, 51, 62, 70]

/** Figma's copy, English and Arabic. */
const COPY: Record<VideoCallLocale, VideoCallScreenShareStageCopy> = {
  en: {
    presenting: "Karim is presenting",
    audience: "Everyone can see this screen",
    stopped: "Nobody is presenting",
    stop: "Stop presenting",
    start: "Share again",
    fullscreen: "Full screen",
    people: "{count} people on the call",
    slideTitle: "Q3 launch — activation funnel",
    slideMeta: "Updated 4 minutes ago · Fasla Analytics",
    stats: [
      { id: "invites", label: "Invites sent", value: "18,420", trend: "+12.4%" },
      { id: "rooms", label: "Rooms created", value: "6,913", trend: "+8.1%" },
      { id: "length", label: "Avg. call length", value: "27m 40s", trend: "+3.2%" },
    ],
    participants: [
      { id: "karim", name: "Karim (presenting)" },
      { id: "mona", name: "Mona Darwish" },
      { id: "salma", name: "Salma Rahal", initials: "SR" },
    ],
    dock: STAGE_DOCK_COPY.en,
  },
  ar: {
    presenting: "كريم يشارك شاشته",
    audience: "يمكن للجميع رؤية هذه الشاشة",
    stopped: "لا أحد يشارك شاشته",
    stop: "إيقاف المشاركة",
    start: "مشاركة مرة أخرى",
    fullscreen: "ملء الشاشة",
    people: "{count} أشخاص في المكالمة",
    slideTitle: "إطلاق الربع الثالث: مسار التنشيط",
    slideMeta: "حُدّث قبل 4 دقائق، تحليلات فاصلة",
    stats: [
      { id: "invites", label: "الدعوات المرسلة", value: "18,420", trend: "ارتفاع 12.4 في المئة" },
      { id: "rooms", label: "الغرف المُنشأة", value: "6,913", trend: "ارتفاع 8.1 في المئة" },
      { id: "length", label: "متوسط مدة المكالمة", value: "27د 40ث", trend: "ارتفاع 3.2 في المئة" },
    ],
    participants: [
      { id: "karim", name: "كريم (يشارك)" },
      { id: "mona", name: "منى درويش" },
      { id: "salma", name: "سلمى رحال", initials: "س ر" },
    ],
    dock: STAGE_DOCK_COPY.ar,
  },
}

export interface VideoCallScreenShareStageProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<VideoCallScreenShareStageCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: VideoCallLocale
  /** The people's photos, by participant `id`. A person without one shows their initials. */
  photos?: VideoCallPhotos
  /** The shared surface, instead of the built slide. It never mirrors with the page: pass `surfaceDir` if its language differs from `locale`. */
  surface?: React.ReactNode
  /** The direction of what was captured. Defaults to the direction of `locale`. */
  surfaceDir?: "ltr" | "rtl"
  /** Whether a share is on. Without it the block starts presenting and keeps its own state. */
  sharing?: boolean
  /** Called with the new state when Stop presenting or Share again is pressed. */
  onSharingChange?: (sharing: boolean) => void
  /** Called when fullscreen is pressed. */
  onFullscreen?: () => void
  /** Called when a dock control is pressed. Toggles also say whether they are now pressed. */
  onControl?: (id: string, pressed: boolean) => void
  /** Called with the id of the chosen More-menu item. */
  onMenuAction?: (id: string) => void
  /** Called once Leave is held for 400ms, or confirmed with a second press from the keyboard. */
  onLeave?: () => void
}

/** The clip-path a surface starts from, by where the rail is: the rail's side on Desktop, the bottom on Tablet. */
function wipeFrom(tier: ReturnType<typeof containerTier>, dir: string) {
  if (tier === "desktop") return dir === "rtl" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)"
  return "inset(100% 0 0 0)"
}

export function VideoCallScreenShareStage({
  locale = "en",
  presenting,
  audience,
  stopped,
  stop,
  start,
  fullscreen,
  people,
  slideTitle,
  slideMeta,
  stats,
  participants,
  dock,
  photos,
  surface,
  surfaceDir,
  sharing: sharingProp,
  onSharingChange,
  onFullscreen,
  onControl,
  onMenuAction,
  onLeave,
  className,
  ...props
}: VideoCallScreenShareStageProps) {
  const copy = COPY[locale]
  const list = participants ?? copy.participants
  const d = dock ?? copy.dock
  const rows = stats ?? copy.stats
  const [own, setOwn] = React.useState(true)
  const sharing = sharingProp ?? own
  const [mounted, setMounted] = React.useState(sharing)
  const area = React.useRef<HTMLDivElement>(null)
  const surfaceRef = React.useRef<HTMLDivElement>(null)
  const ringRef = React.useRef<HTMLSpanElement>(null)
  const lineRef = React.useRef<HTMLDivElement>(null)
  const first = React.useRef(true)
  const presenter = list[0]

  // Start: mount, wipe in, drop the line, pulse the frame once. Stop: wipe out, then swap in the camera.
  React.useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const node = surfaceRef.current
    const reduced = prefersReducedMotion()
    const tier = containerTier(area.current)
    const dir = area.current ? getComputedStyle(area.current).direction : "ltr"
    if (sharing) {
      setMounted(true)
      requestAnimationFrame(() => {
        const next = surfaceRef.current
        if (next && typeof next.animate === "function") {
          next.animate(reduced || tier === "mobile" ? [{ opacity: 0 }, { opacity: 1 }] : [{ clipPath: wipeFrom(tier, dir) }, { clipPath: "inset(0 0 0 0)" }], {
            duration: tier === "mobile" ? 160 : 200,
            easing: STANDARD,
          })
        }
        if (lineRef.current) playEntrance([lineRef.current], { rise: -8, stagger: false })
        const ring = ringRef.current
        if (ring && typeof ring.animate === "function" && !reduced) ring.animate([{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 0 }], { duration: 800, easing: "ease-out" })
      })
    } else if (node && typeof node.animate === "function") {
      const animation = node.animate(reduced || tier === "mobile" ? [{ opacity: 1 }, { opacity: 0 }] : [{ clipPath: "inset(0 0 0 0)" }, { clipPath: wipeFrom(tier, dir) }], {
        duration: tier === "mobile" ? 160 : 200,
        easing: STANDARD,
        fill: "forwards",
      })
      animation.onfinish = () => setMounted(false)
    } else {
      setMounted(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharing])

  const toggle = () => {
    const next = !sharing
    if (sharingProp === undefined) setOwn(next)
    onSharingChange?.(next)
  }
  const captureDir = surfaceDir ?? (locale === "ar" ? "rtl" : "ltr")
  const shown = rows.slice(0, 3)

  return (
    <VideoCallSection aria-label={sharing ? (presenting ?? copy.presenting) : (stopped ?? copy.stopped)} gap="sm" className={className} {...props}>
      <CallStage className="px-2 [@container(min-width:40rem)]:px-4">
        <div className="flex w-full flex-col gap-2 px-2 py-1 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-4">
          <div ref={lineRef} className="flex min-w-0 flex-col gap-0.5 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-2">
            <Presentation aria-hidden className="size-4 shrink-0 text-foreground" />
            <p className="min-w-0 truncate text-sm font-semibold text-foreground">
              <Figures>{sharing ? (presenting ?? copy.presenting) : (stopped ?? copy.stopped)}</Figures>
            </p>
            {sharing ? <p className="min-w-0 truncate text-xs text-muted-foreground">{audience ?? copy.audience}</p> : null}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" size="xs" radius="rounded" tone={sharing ? "destructive" : "primary"} onClick={toggle}>
              {sharing ? <ScreenShareOff aria-hidden /> : null}
              {sharing ? (stop ?? copy.stop) : (start ?? copy.start)}
            </Button>
            <Badge variant="solid" tone="primary" size="lg" radius="rounded" icon={<Users />} aria-label={fillTemplate(people ?? copy.people, { count: list.length })}>
              {list.length}
            </Badge>
            <Button type="button" size="icon-xs" radius="rounded" aria-label={fullscreen ?? copy.fullscreen} onClick={onFullscreen}>
              <Maximize aria-hidden />
            </Button>
          </div>
        </div>

        <div ref={area} className="flex flex-col gap-2 [@container(min-width:40rem)]:gap-3 [@container(min-width:64rem)]:flex-row">
          <div className="relative h-[300px] min-w-0 shrink-0 [@container(min-width:64rem)]:flex-1 [@container(min-width:40rem)]:h-[402px] [@container(min-width:64rem)]:h-[452px]">
            {mounted ? (
              <div
                ref={surfaceRef}
                dir={captureDir}
                data-shared-surface=""
                className="absolute inset-0 flex flex-col gap-2 overflow-hidden rounded-[0.625rem] border border-border bg-card px-4 py-3 [@container(min-width:40rem)]:gap-6 [@container(min-width:40rem)]:p-8"
              >
                {surface ?? (
                  <>
                    <div className="flex flex-col gap-1">
                      <p className="text-lg font-semibold text-foreground [@container(min-width:40rem)]:text-2xl">
                        <Figures>{slideTitle ?? copy.slideTitle}</Figures>
                      </p>
                      <p className="text-xs text-muted-foreground [@container(min-width:40rem)]:text-sm">
                        <Figures>{slideMeta ?? copy.slideMeta}</Figures>
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-4">
                      {shown.map((stat, index) => (
                        <div key={stat.id} className={cn("flex min-w-0 flex-1 flex-col gap-1 rounded-lg bg-muted px-4 py-3 [@container(min-width:40rem)]:py-4", index >= 2 && "hidden [@container(min-width:40rem)]:flex")}>
                          <span className="text-xs text-muted-foreground">{stat.label}</span>
                          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="text-xl font-semibold text-foreground [@container(min-width:40rem)]:text-2xl">
                              <Figures>{stat.value}</Figures>
                            </span>
                            <span className="flex items-center gap-1 text-xs text-success">
                              <TrendingUp aria-hidden className="size-3.5" />
                              <Figures>{stat.trend}</Figures>
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                    <div aria-hidden className="hidden min-h-0 flex-1 items-end gap-3 [@container(min-width:40rem)]:flex">
                      {BARS.map((value, index) => (
                        <span key={index} style={{ height: `${value}%` }} className={cn("flex-1 rounded-md", index === BARS.length - 1 ? "bg-primary" : "bg-muted")} />
                      ))}
                    </div>
                  </>
                )}
                <span ref={ringRef} aria-hidden className="pointer-events-none absolute inset-0 rounded-[0.625rem] opacity-0 ring-2 ring-inset ring-primary" />
              </div>
            ) : presenter ? (
              <ParticipantTile
                name={presenter.name}
                photo={photos?.[presenter.id]}
                initials={photos?.[presenter.id] ? undefined : presenter.initials}
                className="absolute inset-0 rounded-[0.625rem]"
              />
            ) : null}
          </div>

          <div className="flex shrink-0 gap-2 [@container(min-width:40rem)]:gap-3 [@container(min-width:64rem)]:w-60 [@container(min-width:64rem)]:flex-col">
            {list.map((person, index) => (
              <ParticipantTile
                key={person.id}
                name={person.name}
                photo={photos?.[person.id]}
                initials={photos?.[person.id] ? undefined : person.initials}
                muted={person.muted}
                chipClassName="max-w-[calc(100%-1.5rem)] [&>span]:truncate"
                className={cn(
                  "h-[90px] min-w-0 flex-1 rounded-[0.625rem] [@container(min-width:40rem)]:h-[120px] [@container(min-width:64rem)]:h-[143px] [@container(min-width:64rem)]:flex-none",
                  index === 0 && "ring-border",
                  index >= 2 && "hidden [@container(min-width:40rem)]:block"
                )}
              />
            ))}
          </div>
        </div>

        <ControlsDock
          className="pt-2 pb-1"
          label={d.label}
          size="stage"
          controls={stageDockControls(d)}
          leaveLabel={d.leave}
          leaveConfirmLabel={d.leaveConfirm}
          leaveHint={d.leaveHint}
          onControl={onControl}
          onMenuAction={onMenuAction}
          onLeave={onLeave}
        />
      </CallStage>
    </VideoCallSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const videoCallScreenShareStageCopy = COPY
