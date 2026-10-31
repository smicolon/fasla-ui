"use client"

import * as React from "react"
import { LayoutGrid, Maximize, Users } from "lucide-react"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { CarouselDots } from "../../ui/carousel/carousel"
import { cn } from "../../../src/lib/utils"
import {
  CallStage,
  ControlsDock,
  Figures,
  ParticipantTile,
  STAGE_DOCK_COPY,
  StageBar,
  VideoCallSection,
  fillTemplate,
  prefersReducedMotion,
  stageDockControls,
  useDebouncedValue,
  useFlip,
  type StageDockCopy,
  type VideoCallLocale,
  type VideoCallParticipant,
  type VideoCallPhotos,
} from "../video-call/video-call"

/*
 * Figma: `Video Call` (42869:1033), Type=Grid Gallery Call.
 *
 * A call stage in a card: the stage bar (REC, the meeting name and its time at
 * the start; the view button, the people count and fullscreen at the end), the
 * grid of participant tiles, and the controls dock.
 *
 * Desktop lays the six tiles three across, Tablet two across, and a phone
 * shows three of them one at a time in a row that snaps, with Carousel dots
 * under it (in Arabic the first tile is on the right and the row scrolls the
 * other way). A phone's stage bar drops REC and wraps its buttons to a second
 * line, and the dock keeps five controls with an icon-only Leave.
 *
 * The tiles live in one list, so when someone joins or leaves the ones that
 * stay slide to their new place (a hand-written FLIP over 260ms, ease-out)
 * instead of jumping. The speaking ring cross-fades in 90ms and follows
 * `speakingId` only after it has held still for 400ms, so it never strobes
 * between two people talking over each other. REC pulses on a 1.6s loop and is
 * the only thing that loops. A tile can be pinned. Reduced motion stops the
 * pulse and the slide.
 *
 * Stills only: each tile is a photo, never a video. Every real action (the view
 * button, fullscreen, the dock, pinning) is a callback.
 *
 * Content limits: a name chip up to 28 characters and the meeting name up to
 * 42. The other limits are in the block's documentation page, which the
 * default copy stays inside.
 */

export interface VideoCallGridGalleryCallCopy {
  /** The meeting's name. */
  title: string
  /** The elapsed time. */
  time: string
  /** The REC badge's text. */
  recordingLabel: string
  /** The view button's label. */
  view: string
  /** Names the fullscreen button. */
  fullscreen: string
  /** Names the people badge; `{count}` is filled in. */
  people: string
  /** Names a tile's pin button; `{name}` is filled in. */
  pinLabel: string
  /** Names a dot of the phone's pager; `{n}` and `{total}` are filled in. */
  tileLabel: string
  /** The people on the call, in order. Tiles beyond the third do not show on a phone. */
  participants: VideoCallParticipant[]
  /** The dock's controls, and Leave's three lines. */
  dock: StageDockCopy
}

/** Figma's copy, English and Arabic. */
const COPY: Record<VideoCallLocale, VideoCallGridGalleryCallCopy> = {
  en: {
    title: "Design sync — weekly",
    time: "24:18",
    recordingLabel: "REC",
    view: "Grid",
    fullscreen: "Full screen",
    people: "{count} people on the call",
    pinLabel: "Pin {name}",
    tileLabel: "Show tile {n} of {total}",
    participants: [
      { id: "karim", name: "Karim Nasser" },
      { id: "mona", name: "Mona Darwish" },
      { id: "omar", name: "Omar Youssef" },
      { id: "salma", name: "Salma Rahal", initials: "SR" },
      { id: "tariq", name: "Tariq Aziz" },
      { id: "yasmin", name: "Yasmin Haddad (you)" },
    ],
    dock: STAGE_DOCK_COPY.en,
  },
  ar: {
    title: "مزامنة التصميم الأسبوعية",
    time: "24:18",
    recordingLabel: "تسجيل",
    view: "شبكة",
    fullscreen: "ملء الشاشة",
    people: "{count} أشخاص في المكالمة",
    pinLabel: "تثبيت {name}",
    tileLabel: "عرض البلاطة {n} من {total}",
    participants: [
      { id: "karim", name: "كريم ناصر" },
      { id: "mona", name: "منى درويش" },
      { id: "omar", name: "عمر يوسف" },
      { id: "salma", name: "سلمى رحال", initials: "س ر" },
      { id: "tariq", name: "طارق عزيز" },
      { id: "yasmin", name: "ياسمين حداد (أنت)" },
    ],
    dock: STAGE_DOCK_COPY.ar,
  },
}

export interface VideoCallGridGalleryCallProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<VideoCallGridGalleryCallCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: VideoCallLocale
  /** The people's photos, by participant `id`. A person without one shows their initials. */
  photos?: VideoCallPhotos
  /** Who is speaking. The ring follows after 400ms of holding still. */
  speakingId?: string
  /** Shows REC. */
  recording?: boolean
  /** The `id`s of the tiles that can be pinned. Defaults to your own tile, `yasmin`. */
  pinnableIds?: string[]
  /** Called with the tile's `id` when it is pinned, or `null` when it is unpinned. */
  onPinnedChange?: (id: string | null) => void
  /** Called when the view button is pressed. */
  onViewChange?: () => void
  /** Called when fullscreen is pressed. */
  onFullscreen?: () => void
  /** Called when a dock control is pressed. Toggles also say whether they are now pressed. */
  onControl?: (id: string, pressed: boolean) => void
  /** Called with the id of the chosen More-menu item. */
  onMenuAction?: (id: string) => void
  /** Called once Leave is held for 400ms, or confirmed with a second press from the keyboard. */
  onLeave?: () => void
}

/** The pulse REC's dot makes on a 1.6s loop, the only looping thing in the block. */
function RecordingDot() {
  const ref = React.useRef<HTMLSpanElement>(null)
  React.useEffect(() => {
    const node = ref.current
    if (!node || typeof node.animate !== "function" || prefersReducedMotion()) return
    const animation = node.animate([{ opacity: 1 }, { opacity: 0.35 }, { opacity: 1 }], { duration: 1600, iterations: Infinity, easing: "ease-in-out" })
    return () => animation.cancel()
  }, [])
  return <span ref={ref} aria-hidden className="size-2 rounded-full bg-current" />
}

const GAP = 12

export function VideoCallGridGalleryCall({
  locale = "en",
  title,
  time,
  recordingLabel,
  view,
  fullscreen,
  people,
  pinLabel,
  tileLabel,
  participants,
  dock,
  photos,
  speakingId = "karim",
  recording = true,
  pinnableIds = ["yasmin"],
  onPinnedChange,
  onViewChange,
  onFullscreen,
  onControl,
  onMenuAction,
  onLeave,
  className,
  ...props
}: VideoCallGridGalleryCallProps) {
  const copy = COPY[locale]
  const list = participants ?? copy.participants
  const d = dock ?? copy.dock
  const name = title ?? copy.title
  const ring = useDebouncedValue(speakingId, 400)
  const [pinned, setPinned] = React.useState<string | null>(null)
  const [page, setPage] = React.useState(0)
  const scroller = React.useRef<HTMLDivElement>(null)
  const grid = useFlip<HTMLDivElement>(list.map((person) => person.id).join(","))
  const phoneCount = Math.min(3, list.length)

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const node = event.currentTarget
    setPage(Math.max(0, Math.min(phoneCount - 1, Math.round(Math.abs(node.scrollLeft) / (node.clientWidth + GAP)))))
  }
  const goTo = (index: number) => {
    const node = scroller.current
    if (!node) return
    const sign = getComputedStyle(node).direction === "rtl" ? -1 : 1
    node.scrollTo({ left: sign * index * (node.clientWidth + GAP), behavior: prefersReducedMotion() ? "auto" : "smooth" })
  }

  return (
    <VideoCallSection aria-label={name} gap="sm" className={className} {...props}>
      <CallStage>
        <StageBar
          className="px-2 py-1"
          leading={
            recording ? (
              <Badge
                variant="solid"
                tone="destructive"
                size="md"
                radius="rounded"
                icon={<RecordingDot />}
                className="hidden [@container(min-width:40rem)]:inline-flex [@container(min-width:64rem)]:min-h-[1.625rem] [@container(min-width:64rem)]:gap-1.5 [@container(min-width:64rem)]:px-3"
              >
                {recordingLabel ?? copy.recordingLabel}
              </Badge>
            ) : null
          }
          title={<Figures>{name}</Figures>}
          time={time ?? copy.time}
          actions={
            <>
              <Button type="button" size="xs" radius="rounded" onClick={onViewChange}>
                <LayoutGrid aria-hidden />
                {view ?? copy.view}
              </Button>
              <Badge variant="solid" tone="primary" size="lg" radius="rounded" icon={<Users />} aria-label={fillTemplate(people ?? copy.people, { count: list.length })}>
                {list.length}
              </Badge>
              <Button type="button" size="icon-xs" radius="rounded" aria-label={fullscreen ?? copy.fullscreen} onClick={onFullscreen}>
                <Maximize aria-hidden />
              </Button>
            </>
          }
        />

        <div ref={grid}>
          <div
            ref={scroller}
            onScroll={onScroll}
            className={cn(
              "flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              "[@container(min-width:40rem)]:grid [@container(min-width:40rem)]:snap-none [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:overflow-visible [@container(min-width:64rem)]:grid-cols-3"
            )}
          >
            {list.map((person, index) => (
              <ParticipantTile
                key={person.id}
                data-flip={person.id}
                name={person.name}
                photo={photos?.[person.id]}
                initials={photos?.[person.id] ? undefined : person.initials}
                muted={person.muted}
                speaking={ring === person.id}
                pinned={pinned === person.id}
                pinLabel={fillTemplate(pinLabel ?? copy.pinLabel, { name: person.name })}
                onPinnedChange={
                  pinnableIds.includes(person.id)
                    ? (next) => {
                        setPinned(next ? person.id : null)
                        onPinnedChange?.(next ? person.id : null)
                      }
                    : undefined
                }
                className={cn(
                  "aspect-[4/3] w-full shrink-0 snap-center rounded-[0.625rem] [@container(min-width:40rem)]:aspect-[298/176] [@container(min-width:64rem)]:aspect-[397/224]",
                  index >= 3 && "hidden [@container(min-width:40rem)]:block"
                )}
              />
            ))}
          </div>
          {phoneCount > 1 ? (
            <CarouselDots
              count={phoneCount}
              activeIndex={page}
              onActiveIndexChange={goTo}
              label={(index, total) => fillTemplate(tileLabel ?? copy.tileLabel, { n: index + 1, total })}
              className="mt-3 [@container(min-width:40rem)]:hidden"
            />
          ) : null}
        </div>

        <ControlsDock
          className="pt-2 pb-1"
          label={d.label}
          size="lg" phoneSize="md"
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
export const videoCallGridGalleryCallCopy = COPY
