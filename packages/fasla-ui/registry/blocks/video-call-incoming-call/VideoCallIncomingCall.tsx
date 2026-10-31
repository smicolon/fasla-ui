"use client"

import * as React from "react"
import { MessageSquare, Mic, Pause, PhoneCall, PhoneIncoming, PhoneMissed, PhoneOff, Play, Video } from "lucide-react"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { cn } from "../../../src/lib/utils"
import {
  Figures,
  VIDEO_CALL_CARD,
  VideoCallSection,
  passedCopy,
  prefersReducedMotion,
  restOf,
  type VideoCallLocale,
  type VideoCallPhotos,
} from "../video-call/video-call"

/*
 * Figma: `Video Call` (42869:1033), Type=Incoming Call.
 *
 * Three cards on a `muted` plate, one for each state a call has before it is
 * live. Incoming: a tag, the caller's 88px portrait inside two rings, their
 * name and a line, Decline and Join as two round buttons with a label under
 * each, and Reply with a message. Calling: the same head with three dots that
 * count, one Cancel, and Switch to audio only. Missed: the same head with a
 * voice note (a play button and a waveform) and Call back and Message.
 *
 * Desktop sets the three in a row; Tablet wraps them two across; a phone
 * stacks them full width. Decline sits on the start side and Join on the end
 * side in both directions, so in Arabic Decline is on the right.
 *
 * Two rings scale from 100% to 135% and fade out on a 1.4s loop, 400ms apart,
 * on the incoming portrait; the calling dots cycle every 200ms; the voice
 * note's waveform moves only while it plays, and stays in its own left-to-right
 * order because it is a timeline, not text. Reduced motion stops the rings, the
 * dots and the waveform. Shared-element transitions into the call (Join
 * expanding the portrait into its tile, Decline shaking and dropping the card)
 * belong to the product that owns the call, so here they are callbacks.
 *
 * Stills only. Every real action (join, decline, reply, cancel, switch to
 * audio, call back, message, play) is a callback; the play button's state is
 * the block's own.
 *
 * Content limits: a caller's name up to 28 characters, the line under it up to
 * 40. The other limits are in the block's documentation page, which the
 * default copy stays inside.
 */

export type VideoCallCallState = "incoming" | "calling" | "missed"

interface CallCopy {
  /** The tag above the portrait. */
  tag: string
  /** The caller's name, and the id that picks their photo. */
  id: string
  name: string
  /** The line under the name. */
  detail: string
}

export interface VideoCallIncomingCallCopy {
  incoming: CallCopy & { decline: string; join: string; reply: string }
  calling: CallCopy & { cancel: string; audioOnly: string }
  missed: CallCopy & { callBack: string; message: string; play: string; pause: string }
  /** Names the whole block. */
  label: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<VideoCallLocale, VideoCallIncomingCallCopy> = {
  en: {
    label: "Calls",
    incoming: { tag: "Incoming · ringing", id: "mona", name: "Mona Darwish", detail: "Fasla video call · Design sync", decline: "Decline", join: "Join", reply: "Reply with a message" },
    calling: { tag: "Calling · connecting", id: "karim", name: "Karim Nasser", detail: "Ringing on 2 devices · 00:08", cancel: "Cancel", audioOnly: "Switch to audio only" },
    missed: { tag: "Missed · 14 min ago", id: "tariq", name: "Tariq Aziz", detail: "Left a voice note · 0:24", callBack: "Call back", message: "Message", play: "Play voice note", pause: "Pause voice note" },
  },
  ar: {
    label: "المكالمات",
    incoming: { tag: "مكالمة واردة، يرنّ", id: "mona", name: "منى درويش", detail: "مكالمة فيديو فاصلة، مزامنة التصميم", decline: "رفض", join: "انضمام", reply: "الرد برسالة" },
    calling: { tag: "يتم الاتصال، جارٍ الربط", id: "karim", name: "كريم ناصر", detail: "يرنّ على جهازين، 00:08", cancel: "إلغاء", audioOnly: "التحويل إلى الصوت فقط" },
    missed: { tag: "مكالمة فائتة، قبل 14 دقيقة", id: "tariq", name: "طارق عزيز", detail: "ترك رسالة صوتية، 0:24", callBack: "إعادة الاتصال", message: "رسالة", play: "تشغيل الرسالة الصوتية", pause: "إيقاف الرسالة الصوتية" },
  },
}

const COPY_KEYS = Object.keys(COPY.en)

export interface VideoCallIncomingCallProps extends React.HTMLAttributes<HTMLElement>, Partial<VideoCallIncomingCallCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: VideoCallLocale
  /** The callers' photos, by `id` (`mona`, `karim`, `tariq`). A caller without one shows a plain `muted` portrait. */
  photos?: VideoCallPhotos
  /** Which cards to show, in order. A phone's real call shows one. */
  show?: VideoCallCallState[]
  /** Called when Join is pressed. */
  onJoin?: () => void
  /** Called when Decline is pressed. */
  onDecline?: () => void
  /** Called when Reply with a message is pressed. */
  onReply?: () => void
  /** Called when Cancel is pressed on the calling card. */
  onCancel?: () => void
  /** Called when Switch to audio only is pressed. */
  onSwitchToAudio?: () => void
  /** Called when Call back is pressed. */
  onCallBack?: () => void
  /** Called when Message is pressed. */
  onMessage?: () => void
  /** Called with whether the voice note is now playing. */
  onPlayChange?: (playing: boolean) => void
}

const BARS = [6, 12, 20, 14, 26, 18, 10, 22, 16, 8, 18, 12, 24, 10, 14]
const RING = "cubic-bezier(0.2, 0, 0, 1)"

export function VideoCallIncomingCall({
  locale = "en",
  photos,
  show = ["incoming", "calling", "missed"],
  onJoin,
  onDecline,
  onReply,
  onCancel,
  onSwitchToAudio,
  onCallBack,
  onMessage,
  onPlayChange,
  className,
  ...props
}: VideoCallIncomingCallProps) {
  const copy = { ...COPY[locale], ...passedCopy(COPY_KEYS, props) } as VideoCallIncomingCallCopy
  const rest = restOf(COPY_KEYS, props) as React.HTMLAttributes<HTMLElement>
  const [playing, setPlaying] = React.useState(false)

  return (
    <VideoCallSection aria-label={copy.label} className={className} {...rest}>
      <div className="grid gap-5 rounded-3xl bg-muted px-8 py-12 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:grid-cols-3 [@container(min-width:64rem)]:p-12">
        {show.map((state) => {
          if (state === "incoming") {
            const c = copy.incoming
            return (
              <CallCard key={state} state={state} call={c} photos={photos} ringing>
                <div className="flex items-start gap-10">
                  <RoundAction label={c.decline} tone="destructive" onClick={onDecline}>
                    <PhoneOff aria-hidden />
                  </RoundAction>
                  <RoundAction label={c.join} tone="primary" onClick={onJoin}>
                    <Video aria-hidden />
                  </RoundAction>
                </div>
                <Button type="button" variant="outline" tone="secondary" size="sm" radius="rounded" onClick={onReply}>
                  <MessageSquare aria-hidden />
                  {c.reply}
                </Button>
              </CallCard>
            )
          }
          if (state === "calling") {
            const c = copy.calling
            return (
              <CallCard key={state} state={state} call={c} photos={photos}>
                <CountingDots />
                <RoundAction label={c.cancel} tone="destructive" onClick={onCancel}>
                  <PhoneOff aria-hidden />
                </RoundAction>
                <Button type="button" variant="outline" tone="secondary" size="sm" radius="rounded" onClick={onSwitchToAudio}>
                  <Mic aria-hidden />
                  {c.audioOnly}
                </Button>
              </CallCard>
            )
          }
          const c = copy.missed
          return (
            <CallCard key={state} state={state} call={c} photos={photos}>
              <VoiceNote
                playing={playing}
                label={playing ? c.pause : c.play}
                onToggle={() => {
                  setPlaying(!playing)
                  onPlayChange?.(!playing)
                }}
              />
              <div className="flex w-full flex-col gap-3 [@container(min-width:40rem)]:flex-row">
                <Button type="button" radius="rounded" className="w-full [@container(min-width:40rem)]:flex-1" onClick={onCallBack}>
                  {c.callBack}
                </Button>
                <Button type="button" variant="outline" tone="secondary" radius="rounded" className="w-full [@container(min-width:40rem)]:flex-1" onClick={onMessage}>
                  {c.message}
                </Button>
              </div>
            </CallCard>
          )
        })}
      </div>
    </VideoCallSection>
  )
}

const TAGS = {
  incoming: { tone: "success", icon: <PhoneIncoming /> },
  calling: { tone: "primary", icon: <PhoneCall /> },
  missed: { tone: "destructive", icon: <PhoneMissed /> },
} as const

function CallCard({
  state,
  call,
  photos,
  ringing = false,
  children,
}: {
  state: VideoCallCallState
  call: CallCopy
  photos?: VideoCallPhotos
  ringing?: boolean
  children: React.ReactNode
}) {
  const photo = photos?.[call.id]
  const tag = TAGS[state]
  return (
    <article
      aria-label={call.name}
      data-state={state}
      className={cn(VIDEO_CALL_CARD, "flex min-w-0 flex-col items-center gap-3 px-6 py-8 text-center shadow-lg [@container(min-width:64rem)]:gap-5")}
    >
      <Badge variant="solid" tone={tag.tone} size="lg" radius="rounded" icon={tag.icon}>
        <Figures>{call.tag}</Figures>
      </Badge>
      <div className={cn("relative size-[88px]", ringing && "my-2")}>
        {ringing ? <Rings /> : null}
        <div className="relative size-full overflow-hidden rounded-full bg-muted">
          {photo ? <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="size-full object-cover object-[50%_30%]" /> : null}
        </div>
      </div>
      <p className="text-lg font-semibold text-foreground [@container(min-width:64rem)]:text-2xl">{call.name}</p>
      <p className="max-w-full text-sm text-muted-foreground">
        <Figures>{call.detail}</Figures>
      </p>
      {children}
    </article>
  )
}

/** Two rings that scale from 100% to 135% and fade out on a 1.4s loop, 400ms apart. Reduced motion draws none. */
function Rings() {
  const rings = React.useRef<HTMLSpanElement[]>([])
  React.useEffect(() => {
    if (prefersReducedMotion()) return
    const animations = rings.current
      .filter((node) => node && typeof node.animate === "function")
      .map((node, index) => node.animate([{ transform: "scale(1)", opacity: 0.6 }, { transform: "scale(1.35)", opacity: 0 }], { duration: 1400, delay: index * 400, iterations: Infinity, easing: RING }))
    return () => animations.forEach((animation) => animation.cancel())
  }, [])
  return (
    <>
      {[0, 1].map((index) => (
        <span
          key={index}
          aria-hidden
          ref={(node) => {
            if (node) rings.current[index] = node
          }}
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-success opacity-0 motion-reduce:hidden"
        />
      ))}
    </>
  )
}

function RoundAction({ label, tone, onClick, children }: { label: string; tone: "primary" | "destructive"; onClick?: () => void; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button type="button" tone={tone} size="icon-lg" radius="rounded" aria-label={label} onClick={onClick}>
        {children}
      </Button>
      <span aria-hidden className="text-xs text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

/** Three dots that take turns being dark, every 200ms; reduced motion holds the first. */
function CountingDots() {
  const [active, setActive] = React.useState(0)
  React.useEffect(() => {
    if (prefersReducedMotion()) return
    const timer = setInterval(() => setActive((current) => (current + 1) % 3), 200)
    return () => clearInterval(timer)
  }, [])
  return (
    <div aria-hidden className="flex items-center gap-1.5">
      {[0, 1, 2].map((index) => (
        <span key={index} className={cn("size-2 rounded-full transition-colors duration-100 motion-reduce:transition-none", index === active ? "bg-foreground" : "bg-border")} />
      ))}
    </div>
  )
}

/** A play button and a waveform. The bars move only while it plays, and keep their order in either direction. */
function VoiceNote({ playing, label, onToggle }: { playing: boolean; label: string; onToggle: () => void }) {
  const bars = React.useRef<HTMLSpanElement[]>([])
  React.useEffect(() => {
    if (!playing || prefersReducedMotion()) return
    const animations = bars.current
      .filter((node) => node && typeof node.animate === "function")
      .map((node, index) => node.animate([{ transform: "scaleY(1)" }, { transform: "scaleY(0.45)" }], { duration: 600, delay: index * 40, iterations: Infinity, direction: "alternate", easing: "ease-in-out" }))
    return () => animations.forEach((animation) => animation.cancel())
  }, [playing])
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-2">
      <Button type="button" variant="ghost" tone="secondary" size="icon-xs" radius="rounded" aria-label={label} aria-pressed={playing} onClick={onToggle}>
        {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
      </Button>
      <div dir="ltr" aria-hidden className="flex h-7 items-center gap-[3px]">
        {BARS.map((height, index) => (
          <span
            key={index}
            ref={(node) => {
              if (node) bars.current[index] = node
            }}
            style={{ height }}
            className="w-[3px] rounded-full bg-muted-foreground"
          />
        ))}
      </div>
    </div>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const videoCallIncomingCallCopy = COPY
