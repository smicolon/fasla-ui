"use client"

import * as React from "react"
import { Captions, Ellipsis, Hand, Heart, Mic, MicOff, PartyPopper, ScreenShare, Smile, ThumbsUp, Video, VideoOff } from "lucide-react"
import { Badge } from "../../ui/badge/badge"
import { Button, buttonVariants } from "../../ui/button/button"
import { cn } from "../../../src/lib/utils"
import {
  BASE_MS,
  ControlsDock,
  FAST_MS,
  Figures,
  ParticipantTile,
  STANDARD,
  playEntrance,
  prefersReducedMotion,
  useContainerTier,
  type DockControl,
  type VideoCallLocale,
  type VideoCallPhoto,
} from "../video-call/video-call"

/*
 * Figma: `Video Call` (42869:1033), Type=Captions & Reactions.
 *
 * A call stage in a card: the speaker's still, with a raise-hand chip at the
 * top start, a column of reactions at the top end, the live-captions bar at
 * the bottom start and the speaker's name chip at the bottom end. Below it a
 * picker of five reactions over the controls dock.
 *
 * The stage is 1216 × 468 on Desktop, 16:9 on Tablet and portrait 3:4 on
 * Mobile. The caption bar is 62% of the stage on Desktop, 74% on Tablet and
 * full width on Mobile, where each line stacks the speaker over the text, the
 * speaker chip is left out (the captions name them) and the reactions become a
 * centred row above the bar. The dock drops to five controls with an icon-only
 * Leave. In Arabic everything mirrors: the bar and the hand chip sit on
 * the right, the reactions on the left.
 *
 * The caption bar is a fixed two-line window and never scrolls: when a line
 * is added it rises in over 180ms and the oldest drops out. The raise-hand chip
 * slides down on arrival and stays until `onHandClear` clears it. Choosing a
 * reaction calls `onReact` and floats it up from the stage's bottom end,
 * 120–180px along a slight wave over 2.4s, fading in the last 600ms; eight run
 * at once and the rest queue. With reduced motion a reaction only fades.
 *
 * The bar is painted with the inverse tokens, so the block needs the
 * `theme-inverse` item. Content limits: a caption line up to 120 characters in
 * two lines of the bar, a speaker name up to 24. The other limits are in the
 * block's documentation page, which the default copy stays inside.
 */

export type ReactionId = "thumbs-up" | "heart" | "celebrate" | "smile" | "hand"

const REACTION_ICON: Record<ReactionId, React.ElementType> = {
  "thumbs-up": ThumbsUp,
  heart: Heart,
  celebrate: PartyPopper,
  smile: Smile,
  hand: Hand,
}

/** The five reactions the picker offers, in Figma's order. */
export const REACTION_IDS: ReactionId[] = ["thumbs-up", "heart", "celebrate", "smile", "hand"]

export interface VideoCallCaption {
  /** Keys the line. A new id adds a line to the window. */
  id: string
  /** Who is speaking. */
  speaker: string
  /** What they said. */
  text: string
}

export interface VideoCallHandQueue {
  /** Who raised a hand, in full: `Nour Khalil`. */
  name: string
  /** The short form phones show: `Nour K.`. */
  shortName: string
  /** How many are waiting. */
  count: number
}

export interface VideoCallCaptionsReactionsCopy {
  /** The title of the captions bar. */
  captionsTitle: string
  /** The captions in the window; the last two show. */
  captions: VideoCallCaption[]
  /** The name chip at the bottom end of the stage. */
  speaker: string
  /** The raise-hand chip. `{name}` and `{count}` are filled in. Desktop and Tablet. */
  handQueueFull: string
  /** The same for phones. */
  handQueueShort: string
  /** Names for the reactions, in the picker and on the stage. */
  reactionLabels: Record<ReactionId, string>
  /** Names the picker. */
  pickerLabel: string
  /** Names the close button on the raise-hand chip. */
  clearHand: string
  /** The dock's controls, and Leave's three lines. */
  dock: {
    label: string
    mic: { label: string; pressedLabel: string; tip: string }
    video: { label: string; pressedLabel: string }
    share: string
    captions: { label: string; pressedLabel: string }
    reactions: string
    hand: { label: string; pressedLabel: string }
    more: string
    menu: { id: string; label: string }[]
    leave: string
    leaveConfirm: string
    leaveHint: string
  }
}

/** Figma's copy, English and Arabic. */
const COPY: Record<VideoCallLocale, VideoCallCaptionsReactionsCopy> = {
  en: {
    captionsTitle: "Live captions · English",
    captions: [
      { id: "c1", speaker: "Adam Farouk", text: "— so the short version is we ship the lobby first, then the recording pipeline." },
      { id: "c2", speaker: "Mona Darwish", text: "Agreed. I'll take the lobby states." },
    ],
    speaker: "Adam Farouk",
    handQueueFull: "{name} raised a hand · {count} in queue",
    handQueueShort: "{name} · {count} in queue",
    reactionLabels: { "thumbs-up": "Thumbs up", heart: "Heart", celebrate: "Celebrate", smile: "Smile", hand: "Raised hand" },
    pickerLabel: "Send a reaction",
    clearHand: "Clear raised hand",
    dock: {
      label: "Call controls",
      mic: { label: "Mute", pressedLabel: "Unmute", tip: "You're muted. Press ⌘ D to talk" },
      video: { label: "Stop video", pressedLabel: "Start video" },
      share: "Share screen",
      captions: { label: "Turn off captions", pressedLabel: "Turn on captions" },
      reactions: "Reactions",
      hand: { label: "Raise hand", pressedLabel: "Lower hand" },
      more: "More",
      menu: [
        { id: "settings", label: "Settings" },
        { id: "report", label: "Report a problem" },
      ],
      leave: "Leave",
      leaveConfirm: "Press again to leave",
      leaveHint: "Hold to leave",
    },
  },
  ar: {
    captionsTitle: "التسميات المباشرة بالإنجليزية",
    captions: [
      { id: "c1", speaker: "آدم فاروق", text: "باختصار، نطلق غرفة الانتظار أولاً، ثم مسار التسجيل." },
      { id: "c2", speaker: "منى درويش", text: "موافقة. سأتولى حالات غرفة الانتظار." },
    ],
    speaker: "آدم فاروق",
    handQueueFull: "{name} رفعت يدها، {count} في الانتظار",
    handQueueShort: "{name}، {count} في الانتظار",
    reactionLabels: { "thumbs-up": "إعجاب", heart: "قلب", celebrate: "احتفال", smile: "ابتسامة", hand: "يد مرفوعة" },
    pickerLabel: "أرسل تفاعلًا",
    clearHand: "إزالة اليد المرفوعة",
    dock: {
      label: "عناصر التحكم في المكالمة",
      mic: { label: "كتم", pressedLabel: "إلغاء الكتم", tip: "الميكروفون مكتوم. اضغط ⌘ D للتحدث" },
      video: { label: "إيقاف الفيديو", pressedLabel: "تشغيل الفيديو" },
      share: "مشاركة الشاشة",
      captions: { label: "إيقاف التسميات", pressedLabel: "تشغيل التسميات" },
      reactions: "التفاعلات",
      hand: { label: "رفع اليد", pressedLabel: "خفض اليد" },
      more: "المزيد",
      menu: [
        { id: "settings", label: "الإعدادات" },
        { id: "report", label: "الإبلاغ عن مشكلة" },
      ],
      leave: "خروج",
      leaveConfirm: "اضغط مرة أخرى للخروج",
      leaveHint: "اضغط مطولًا للخروج",
    },
  },
}

/** The hand-queue people Figma shows, in each language. */
const HAND: Record<VideoCallLocale, VideoCallHandQueue> = {
  en: { name: "Nour Khalil", shortName: "Nour K.", count: 2 },
  ar: { name: "نور خليل", shortName: "نور خ.", count: 2 },
}

const MAX_FLOATING = 8
const FLOAT_MS = 2400

interface Floating {
  key: number
  id: ReactionId
}

/** One reaction drifting up from the stage: 120–180px on a slight wave, fading in the last 600ms. */
function FloatingReaction({ id, label, offset, rise, onDone }: { id: ReactionId; label: string; offset: number; rise: number; onDone: () => void }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const Icon = REACTION_ICON[id]
  React.useEffect(() => {
    const node = ref.current
    if (!node || typeof node.animate !== "function") {
      const timer = setTimeout(onDone, 0)
      return () => clearTimeout(timer)
    }
    const reduced = prefersReducedMotion()
    const animation = node.animate(
      reduced
        ? [{ opacity: 0 }, { opacity: 1, offset: 0.4 }, { opacity: 0 }]
        : [
            { transform: "translate(0, 0)", opacity: 1 },
            { transform: `translate(${offset}px, ${-rise * 0.25}px)`, opacity: 1, offset: 0.25 },
            { transform: `translate(${-offset}px, ${-rise * 0.5}px)`, opacity: 1, offset: 0.5 },
            { transform: `translate(${offset}px, ${-rise * 0.75}px)`, opacity: 1, offset: 0.75 },
            { transform: `translate(0, ${-rise}px)`, opacity: 0 },
          ],
      { duration: reduced ? 1200 : FLOAT_MS, easing: "linear", fill: "forwards" }
    )
    animation.onfinish = onDone
    return () => animation.cancel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <span ref={ref} data-reaction-drift={id} role="img" aria-label={label} className="pointer-events-none absolute bottom-0 end-0 flex size-9 items-center justify-center rounded-full bg-card text-foreground shadow-lg">
      <Icon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
    </span>
  )
}

export interface VideoCallCaptionsReactionsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<VideoCallCaptionsReactionsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: VideoCallLocale
  /** The speaker's still. A `muted` ground shows without it. */
  photo?: VideoCallPhoto
  /** Who raised a hand. Pass `null` for none. Defaults to Figma's. */
  handQueue?: VideoCallHandQueue | null
  /** The reactions on show at the stage's top end, newest first. */
  reactions?: ReactionId[]
  /** Called when a reaction is picked. */
  onReact?: (id: ReactionId) => void
  /** Called when the raise-hand chip is cleared. Without it the chip has no close button. */
  onHandClear?: () => void
  /** Called when a dock control is pressed. Toggles also say whether they are now pressed. */
  onControl?: (id: string, pressed: boolean) => void
  /** Called with the id of the chosen More-menu item. */
  onMenuAction?: (id: string) => void
  /** Called once Leave is held for 400ms, or confirmed with a second press from the keyboard. */
  onLeave?: () => void
}

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""))

export function VideoCallCaptionsReactions({
  locale = "en",
  captionsTitle,
  captions,
  speaker,
  handQueueFull,
  handQueueShort,
  reactionLabels,
  pickerLabel,
  clearHand,
  dock,
  photo,
  handQueue,
  reactions = ["heart", "thumbs-up", "celebrate", "smile"],
  onReact,
  onHandClear,
  onControl,
  onMenuAction,
  onLeave,
  className,
  ...props
}: VideoCallCaptionsReactionsProps) {
  const copy = COPY[locale]
  const [sectionRef, tier, measured] = useContainerTier<HTMLElement>()
  const reactionSize = tier === "mobile" ? "icon-md" : "icon-lg"
  // The reactions are a different atom size on a phone and from Tablet: wait for the first reading (see useContainerTier).
  const waiting = !measured
  const d = dock ?? copy.dock
  const labels = reactionLabels ?? copy.reactionLabels
  const lines = (captions ?? copy.captions).slice(-2)
  const hand = handQueue === undefined ? HAND[locale] : handQueue
  const [pickerOpen, setPickerOpen] = React.useState(true)
  const [floating, setFloating] = React.useState<Floating[]>([])
  const [queued, setQueued] = React.useState<ReactionId[]>([])
  const nextKey = React.useRef(0)
  const handRef = React.useRef<HTMLSpanElement>(null)
  const lastLine = React.useRef<HTMLDivElement>(null)
  const lastId = React.useRef(lines[lines.length - 1]?.id)

  // The chip slides down once, as it arrives.
  React.useEffect(() => {
    if (hand && handRef.current) playEntrance([handRef.current], { rise: -12, stagger: false })
  }, [hand?.name]) // eslint-disable-line react-hooks/exhaustive-deps

  // A new caption rises into the window over 180ms.
  React.useEffect(() => {
    const id = lines[lines.length - 1]?.id
    if (id === lastId.current) return
    lastId.current = id
    const node = lastLine.current
    if (!node || typeof node.animate !== "function") return
    node.animate(prefersReducedMotion() ? [{ opacity: 0 }, { opacity: 1 }] : [{ transform: "translateY(100%)", opacity: 0 }, { transform: "none", opacity: 1 }], {
      duration: prefersReducedMotion() ? FAST_MS : BASE_MS,
      easing: STANDARD,
    })
  })

  const spawn = (id: ReactionId) => setFloating((list) => (list.length >= MAX_FLOATING ? list : [...list, { key: nextKey.current++, id }]))
  const react = (id: ReactionId) => {
    onReact?.(id)
    if (floating.length >= MAX_FLOATING) setQueued((list) => [...list, id])
    else spawn(id)
  }
  const done = (key: number) => setFloating((list) => list.filter((item) => item.key !== key))
  // A queued reaction starts as soon as one of the eight finishes.
  React.useEffect(() => {
    if (!queued.length || floating.length >= MAX_FLOATING) return
    const [next, ...rest] = queued
    setQueued(rest)
    if (next) spawn(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queued, floating.length])

  const controls: DockControl[] = [
    { id: "mic", icon: Mic, pressedIcon: MicOff, label: d.mic.label, pressedLabel: d.mic.pressedLabel, pressedTip: d.mic.tip, toggle: true },
    { id: "video", icon: Video, pressedIcon: VideoOff, label: d.video.label, pressedLabel: d.video.pressedLabel, toggle: true },
    { id: "screen-share", icon: ScreenShare, label: d.share, hideOnPhone: true },
    { id: "captions", icon: Captions, label: d.captions.label, pressedLabel: d.captions.pressedLabel, kind: "on", toggle: true, hideOnPhone: true },
    { id: "reactions", icon: Smile, label: d.reactions, hideOnPhone: true },
    { id: "hand", icon: Hand, label: d.hand.label, pressedLabel: d.hand.pressedLabel, kind: "on", toggle: true },
    { id: "more", icon: Ellipsis, label: d.more, menu: d.menu },
  ]
  const speakerLine = (line: VideoCallCaption, index: number) => {
    const tone = index === 0 ? "text-foreground-inverse" : "text-muted-foreground-inverse"
    return (
      <div
        key={line.id}
        ref={index === lines.length - 1 ? lastLine : undefined}
        className="flex flex-col text-sm [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-baseline [@container(min-width:40rem)]:gap-2"
      >
        <span className={cn("shrink-0 font-semibold", tone)}>
          <Figures>{line.speaker}</Figures>
        </span>
        <span className={cn("min-w-0", tone)}>
          <Figures>{line.text}</Figures>
        </span>
      </div>
    )
  }

  return (
    <section ref={sectionRef} data-video-call="" aria-label={captionsTitle ?? copy.captionsTitle} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-4 rounded-2xl border border-border bg-card p-4">
        <ParticipantTile
          name={speaker ?? copy.speaker}
          photo={photo}
          chip="end"
          chipClassName="hidden [@container(min-width:40rem)]:inline-flex end-3.5 bottom-5 [@container(min-width:64rem)]:end-3.5"
          className="aspect-[3/4] w-full rounded-lg [@container(min-width:40rem)]:aspect-video [@container(min-width:64rem)]:aspect-[1216/468]"
        >
          {hand ? (
            <span ref={handRef} className="absolute start-3 top-3 [@container(min-width:64rem)]:start-5 [@container(min-width:64rem)]:top-5">
              <Badge
                variant="solid"
                tone="warning"
                size="lg"
                radius="rounded"
                icon={<Hand />}
                onClose={onHandClear}
                closeLabel={clearHand ?? copy.clearHand}
              >
                <span className="[@container(min-width:40rem)]:hidden">
                  <Figures>{fill(handQueueShort ?? copy.handQueueShort, { name: hand.shortName, count: hand.count })}</Figures>
                </span>
                <span className="hidden [@container(min-width:40rem)]:inline">
                  <Figures>{fill(handQueueFull ?? copy.handQueueFull, { name: hand.name, count: hand.count })}</Figures>
                </span>
              </Badge>
            </span>
          ) : null}

          {/* On a phone the reactions and the caption bar stack at the bottom, the row above the bar; from Tablet the wrapper steps aside and each sits where Figma puts it. */}
          <div className="absolute inset-x-1 bottom-1 flex flex-col items-center gap-3 [@container(min-width:40rem)]:contents">
            <ul
              aria-label={pickerLabel ?? copy.pickerLabel}
              className={cn("flex justify-center gap-3 [@container(min-width:40rem)]:absolute [@container(min-width:40rem)]:end-3 [@container(min-width:40rem)]:top-3 [@container(min-width:40rem)]:flex-col [@container(min-width:64rem)]:end-6 [@container(min-width:64rem)]:top-6", waiting && "invisible")}
            >
              {reactions.map((id, index) => {
                const Icon = REACTION_ICON[id]
                return (
                  <li key={`${id}-${index}`}>
                    <span
                      role="img"
                      aria-label={labels[id]}
                      className={buttonVariants({ size: reactionSize, radius: "rounded", tone: id === "heart" ? "destructive" : "primary" })}
                    >
                      <Icon aria-hidden />
                    </span>
                  </li>
                )
              })}
            </ul>

            <div
              aria-label={captionsTitle ?? copy.captionsTitle}
              role="group"
              className="flex w-full flex-col gap-2 overflow-hidden rounded-lg bg-background-inverse px-5 py-4 text-foreground-inverse [@container(min-width:40rem)]:absolute [@container(min-width:40rem)]:bottom-3 [@container(min-width:40rem)]:start-3 [@container(min-width:40rem)]:w-[74%] [@container(min-width:64rem)]:bottom-5 [@container(min-width:64rem)]:start-5 [@container(min-width:64rem)]:w-[62%]"
            >
              <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground-inverse">
                <Captions size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
                <span>{captionsTitle ?? copy.captionsTitle}</span>
              </p>
              <div aria-live="polite" className="flex flex-col gap-2">
                {lines.map(speakerLine)}
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-40 end-6 size-9 [@container(min-width:40rem)]:bottom-24">
            {floating.map((item) => (
              <FloatingReaction key={item.key} id={item.id} label={labels[item.id]} offset={8 + (item.key % 3) * 3} rise={120 + (item.key % 4) * 20} onDone={() => done(item.key)} />
            ))}
          </div>
        </ParticipantTile>

        <div className="flex flex-col items-center gap-3">
          {pickerOpen ? (
            <div role="group" aria-label={pickerLabel ?? copy.pickerLabel} className={cn("flex items-center gap-2 rounded-full bg-muted px-3 py-2", waiting && "invisible")}>
              {REACTION_IDS.map((id) => {
                const Icon = REACTION_ICON[id]
                return (
                  <Button key={id} type="button" size={reactionSize} radius="rounded" aria-label={labels[id]} data-reaction={id} onClick={() => react(id)}>
                    <Icon aria-hidden />
                  </Button>
                )
              })}
            </div>
          ) : null}
          <ControlsDock
            label={d.label}
            size="lg"
            controls={controls}
            leaveLabel={d.leave}
            leaveConfirmLabel={d.leaveConfirm}
            leaveHint={d.leaveHint}
            onControl={(id, pressed) => {
              if (id === "reactions") setPickerOpen((open) => !open)
              onControl?.(id, pressed)
            }}
            onMenuAction={onMenuAction}
            onLeave={onLeave}
          />
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const videoCallCaptionsReactionsCopy = COPY
