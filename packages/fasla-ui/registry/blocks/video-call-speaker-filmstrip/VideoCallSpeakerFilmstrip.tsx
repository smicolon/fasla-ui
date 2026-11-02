"use client"

import * as React from "react"
import { Captions, LayoutGrid, SignalHigh } from "lucide-react"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { cn } from "../../../src/lib/utils"
import {
  CallStage,
  ControlsDock,
  FAST_MS,
  Figures,
  ParticipantTile,
  STAGE_DOCK_COPY,
  STANDARD,
  StageBar,
  VideoCallSection,
  fillTemplate,
  prefersReducedMotion,
  stageDockControls,
  type StageDockCopy,
  type VideoCallLocale,
  type VideoCallParticipant,
  type VideoCallPhotos,
} from "../video-call/video-call"

/*
 * Figma: `Video Call` (42869:1033), Type=Speaker & Filmstrip.
 *
 * A call stage in a card: the stage bar (the meeting name and its time; the
 * view button, a captions badge and the connection badge), one big tile for
 * whoever is speaking, a strip of everyone else, and the controls dock.
 *
 * Desktop puts the strip beside the speaker as a 232px rail (at the start in
 * Arabic, on the left); Tablet puts it under the speaker as a row; a phone
 * keeps three thumbnails and a shorter meeting name, and the stage bar keeps
 * only the connection badge. The dock keeps five controls with an icon-only
 * Leave on a phone.
 *
 * When the dominant speaker changes (`speakerId`) the big tile cross-dissolves
 * over 200ms while the outgoing thumbnail scales 0.96 to 1 back into the strip,
 * and the strip scrolls the new speaker into view smoothly. Pressing a
 * thumbnail makes that person the speaker. Pinning suspends the automatic
 * swap until it is released, and the pin turns 15 degrees as it is pressed. The
 * speaker's name and the speaking mark do not mirror. Reduced motion makes the
 * swap a plain fade and the scroll an instant one.
 *
 * Stills only: each tile is a photo, never a video. Every real action (the view
 * button, a speaker change, pinning, the dock) is a callback.
 *
 * Content limits: a name chip up to 28 characters and the meeting name up to
 * 42, shortened to 14 on a phone. The other limits are in the block's
 * documentation page, which the default copy stays inside.
 */

export interface VideoCallSpeakerFilmstripCopy {
  /** The meeting's name. */
  title: string
  /** The shorter name a phone shows. */
  shortTitle: string
  /** The elapsed time. */
  time: string
  /** The view button's label. */
  view: string
  /** The captions badge's text. */
  captions: string
  /** The connection badge's text. */
  connection: string
  /** The chip on the speaker's tile; `{name}` is filled in. */
  speaking: string
  /** Names a pin button; `{name}` is filled in. */
  pinLabel: string
  /** Names a thumbnail's button; `{name}` is filled in. */
  thumbLabel: string
  /** The people on the call. The first is the speaker; the rest fill the strip, and a phone shows three of them. */
  participants: VideoCallParticipant[]
  /** The dock's controls, and Leave's three lines. */
  dock: StageDockCopy
}

/** Figma's copy, English and Arabic. */
const COPY: Record<VideoCallLocale, VideoCallSpeakerFilmstripCopy> = {
  en: {
    title: "Client review — Q3 launch",
    shortTitle: "Client review",
    time: "41:07",
    view: "Grid",
    captions: "Captions on",
    connection: "Excellent",
    speaking: "{name} — speaking",
    pinLabel: "Pin {name}",
    thumbLabel: "Make {name} the speaker",
    participants: [
      { id: "adam", name: "Adam Farouk" },
      { id: "nour", name: "Nour Khalil" },
      { id: "bilal", name: "Bilal Sultan", muted: true },
      { id: "hala", name: "Hala Mansour", initials: "HM" },
      { id: "yasmin", name: "Yasmin (you)" },
    ],
    dock: { ...STAGE_DOCK_COPY.en, leave: "Leave call" },
  },
  ar: {
    title: "مراجعة العميل لإطلاق الربع الثالث",
    shortTitle: "مراجعة العميل",
    time: "41:07",
    view: "شبكة",
    captions: "التسميات مفعّلة",
    connection: "ممتاز",
    speaking: "{name}، يتحدث",
    pinLabel: "تثبيت {name}",
    thumbLabel: "اجعل {name} المتحدث",
    participants: [
      { id: "adam", name: "آدم فاروق" },
      { id: "nour", name: "نور خليل" },
      { id: "bilal", name: "بلال سلطان", muted: true },
      { id: "hala", name: "هالة منصور", initials: "ه م" },
      { id: "yasmin", name: "ياسمين (أنت)" },
    ],
    dock: { ...STAGE_DOCK_COPY.ar, leave: "إنهاء المكالمة" },
  },
}

export interface VideoCallSpeakerFilmstripProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<VideoCallSpeakerFilmstripCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: VideoCallLocale
  /** The people's photos, by participant `id`. A person without one shows their initials. */
  photos?: VideoCallPhotos
  /** Who is speaking. A change swaps the big tile, unless someone is pinned. Defaults to the first person. */
  speakerId?: string
  /** Who starts pinned. A pin keeps that person on the big tile until it is released. */
  defaultPinnedId?: string | null
  /** Called when a thumbnail is pressed, with that person's `id`. */
  onSpeakerChange?: (id: string) => void
  /** Called with a person's `id` when they are pinned, or `null` when the pin is released. */
  onPinnedChange?: (id: string | null) => void
  /** Called when the view button is pressed. */
  onViewChange?: () => void
  /** Called when a dock control is pressed. Toggles also say whether they are now pressed. */
  onControl?: (id: string, pressed: boolean) => void
  /** Called with the id of the chosen More-menu item. */
  onMenuAction?: (id: string) => void
  /** Called once Leave is held for 400ms, or confirmed with a second press from the keyboard. */
  onLeave?: () => void
}

export function VideoCallSpeakerFilmstrip({
  locale = "en",
  title,
  shortTitle,
  time,
  view,
  captions,
  connection,
  speaking,
  pinLabel,
  thumbLabel,
  participants,
  dock,
  photos,
  speakerId,
  defaultPinnedId = null,
  onSpeakerChange,
  onPinnedChange,
  onViewChange,
  onControl,
  onMenuAction,
  onLeave,
  className,
  ...props
}: VideoCallSpeakerFilmstripProps) {
  const copy = COPY[locale]
  const list = participants ?? copy.participants
  const d = dock ?? copy.dock
  const name = title ?? copy.title
  const [pinned, setPinned] = React.useState<string | null>(defaultPinnedId)
  const [picked, setPicked] = React.useState<string | null>(null)
  const incoming = speakerId ?? list[0]?.id
  // A new speaker from outside clears a pick made by hand, and a pin overrides both.
  React.useEffect(() => setPicked(null), [incoming])
  const currentId = pinned ?? picked ?? incoming
  const current = list.find((person) => person.id === currentId) ?? list[0]
  const strip = list.filter((person) => person.id !== current?.id)
  const stage = React.useRef<HTMLDivElement>(null)
  const filmstrip = React.useRef<HTMLDivElement>(null)
  const previous = React.useRef<string | undefined>(current?.id)

  // The big tile cross-dissolves over 200ms, the outgoing thumbnail scales 0.96 to 1 back into the strip, and the strip scrolls the new speaker's neighbour into view.
  React.useEffect(() => {
    const before = previous.current
    previous.current = current?.id
    if (before === undefined || before === current?.id) return
    const reduced = prefersReducedMotion()
    const big = stage.current
    if (big && typeof big.animate === "function") big.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduced ? FAST_MS : 200, easing: STANDARD })
    const out = filmstrip.current?.querySelector<HTMLElement>(`[data-thumb="${before}"]`)
    if (out && typeof out.animate === "function" && !reduced) out.animate([{ transform: "scale(0.96)" }, { transform: "none" }], { duration: 200, easing: STANDARD })
    out?.scrollIntoView?.({ behavior: reduced ? "auto" : "smooth", block: "nearest", inline: "nearest" })
  }, [current?.id])

  const togglePin = (id: string) => {
    const next = pinned === id ? null : id
    setPinned(next)
    onPinnedChange?.(next)
  }
  if (!current) return null

  return (
    <VideoCallSection aria-label={name} gap="sm" className={className} {...props}>
      <CallStage>
        <StageBar
          className="px-2 py-1"
          title={
            <>
              <span className="[@container(min-width:40rem)]:hidden">
                <Figures>{shortTitle ?? copy.shortTitle}</Figures>
              </span>
              <span className="hidden [@container(min-width:40rem)]:inline">
                <Figures>{name}</Figures>
              </span>
            </>
          }
          time={time ?? copy.time}
          actions={
            <>
              <Button type="button" size="xs" radius="rounded" className="hidden [@container(min-width:40rem)]:inline-flex" onClick={onViewChange}>
                <LayoutGrid aria-hidden />
                {view ?? copy.view}
              </Button>
              <Badge variant="solid" tone="primary" size="lg" radius="rounded" icon={<Captions />} className="hidden [@container(min-width:40rem)]:inline-flex">
                {captions ?? copy.captions}
              </Badge>
              <Badge variant="solid" tone="primary" size="lg" radius="rounded" icon={<SignalHigh />}>
                {connection ?? copy.connection}
              </Badge>
            </>
          }
        />

        <div className="flex flex-col gap-2 [@container(min-width:40rem)]:gap-3 [@container(min-width:64rem)]:flex-row">
          <div ref={stage} className="min-w-0 flex-1">
            <ParticipantTile
              name={fillTemplate(speaking ?? copy.speaking, { name: current.name })}
              photo={photos?.[current.id]}
              initials={photos?.[current.id] ? undefined : current.initials}
              muted={current.muted}
              speaking
              pinned={pinned === current.id}
              pinLabel={fillTemplate(pinLabel ?? copy.pinLabel, { name: current.name })}
              onPinnedChange={() => togglePin(current.id)}
              className="aspect-[288/149] w-full rounded-[0.625rem] [@container(min-width:40rem)]:aspect-video [@container(min-width:64rem)]:aspect-auto [@container(min-width:64rem)]:h-[468px]"
            />
          </div>
          <div
            ref={filmstrip}
            className="grid shrink-0 grid-cols-3 gap-2 [@container(min-width:40rem)]:grid-cols-4 [@container(min-width:40rem)]:gap-3 [@container(min-width:64rem)]:max-h-[468px] [@container(min-width:64rem)]:w-[232px] [@container(min-width:64rem)]:grid-cols-1 [@container(min-width:64rem)]:overflow-y-auto"
          >
            {strip.map((person, index) => (
              <button
                key={person.id}
                type="button"
                data-thumb={person.id}
                aria-label={fillTemplate(thumbLabel ?? copy.thumbLabel, { name: person.name })}
                onClick={() => {
                  setPicked(person.id)
                  onSpeakerChange?.(person.id)
                }}
                className={cn("block rounded-[0.625rem] text-start outline-none focus-visible:ring-2 focus-visible:ring-ring", index >= 3 && "hidden [@container(min-width:40rem)]:block")}
              >
                <ParticipantTile
                  name={locale === "ar" ? person.name : (person.shortName ?? person.name)}
                  photo={photos?.[person.id]}
                  initials={photos?.[person.id] ? undefined : person.initials}
                  muted={person.muted}
                  chipClassName="max-w-[calc(100%-1.5rem)] [&>span]:truncate"
                  className="h-[72px] w-full rounded-[0.625rem] [@container(min-width:40rem)]:h-[100px] [@container(min-width:64rem)]:h-[108px]"
                />
              </button>
            ))}
          </div>
        </div>

        <ControlsDock
          className="pt-2 pb-1"
          label={d.label}
          size="lg"
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
export const videoCallSpeakerFilmstripCopy = COPY
