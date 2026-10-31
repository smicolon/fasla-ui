"use client"

import * as React from "react"
import { Check, DoorOpen, LockKeyhole, Mic, MicOff, PhoneOff, ShieldCheck, Video, VideoOff, X } from "lucide-react"
import { Avatar } from "../../ui/avatar/avatar"
import { Button } from "../../ui/button/button"
import { cn } from "../../../src/lib/utils"
import {
  FAST_MS,
  Figures,
  VIDEO_CALL_CARD,
  VideoCallSection,
  fillTemplate,
  passedCopy,
  prefersReducedMotion,
  restOf,
  type VideoCallLocale,
  type VideoCallPhotos,
} from "../video-call/video-call"

/*
 * Figma: `Video Call` (42869:1033), Type=Waiting Room & Knock.
 *
 * Two cards, the guest's and the host's. The guest's says the room is waiting:
 * a lock that breathes, a heading, a line on who has been told, the mic and
 * camera and a Cancel, and the guest's own 160 × 96 preview at its end corner.
 * The host's says who is knocking: a heading with a count, one row for each
 * person (their photo or initials, their name and how they were invited, Deny
 * and Admit), Admit everyone and Keep locked, and a note on external guests.
 *
 * Desktop sets the cards side by side, the host's at 440px; Tablet stacks them;
 * a phone stacks them too, the guest's as a 320px band and the host's with a
 * sheet handle on top, each row's buttons under the person.
 *
 * A new knock grows in at the top over 200ms, height and opacity together.
 * Admitting or denying collapses that row to nothing over 180ms and the rows
 * below slide up with it. The lock breathes between 98% and 102% on a 2.4s
 * loop so the screen never looks frozen. Reduced motion makes each of these a
 * plain fade and stops the breathing. The soft chime and the swipe to admit
 * belong to the product, not to this block.
 *
 * Stills only. Every real action (admit, deny, admit everyone, keep locked,
 * cancel, a mic or camera change) is a callback; the rows and the toggles are
 * state the block keeps itself, and a `knocks` list you pass in replaces them.
 *
 * Content limits: a guest's name up to 28 characters, their detail line up to
 * 40. The other limits are in the block's documentation page, which the
 * default copy stays inside.
 */

export interface VideoCallKnock {
  /** Keys the guest, and picks their photo from `photos`. */
  id: string
  /** Their name. */
  name: string
  /** How they were invited, such as `nour@fasla.design · invited`. */
  detail: string
  /** Letters for a guest with no photo. */
  initials?: string
}

type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string }

export interface VideoCallWaitingRoomKnockCopy {
  /** The guest card's heading. */
  guestTitle: string
  /** The line under it. `{host}` and `{meeting}` are filled in. */
  guestText: string
  /** The host who was told, and the meeting's name. */
  host: string
  meeting: string
  /** The guest card's controls. */
  mic: { label: string; offLabel: string }
  camera: { label: string; offLabel: string }
  cancel: string
  /** Names the guest's preview. */
  selfPreview: string
  /** The host card's heading, by plural form; `{count}` is filled in. */
  waiting: PluralForms
  /** The line under it. */
  locked: string
  /** Shown when nobody is knocking. */
  empty: string
  /** The row's buttons; `{name}` is filled in on the two that name a person. */
  admit: string
  admitLabel: string
  denyLabel: string
  /** The two bulk buttons. */
  admitAll: string
  keepLocked: string
  /** The note at the bottom. */
  note: string
  /** The guests knocking. */
  knocks: VideoCallKnock[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<VideoCallLocale, VideoCallWaitingRoomKnockCopy> = {
  en: {
    guestTitle: "You're in the waiting room",
    guestText: "{host} has been notified. You'll join {meeting} as soon as he lets you in.",
    host: "Adam Farouk",
    meeting: "Design sync — weekly",
    mic: { label: "Mute microphone", offLabel: "Unmute microphone" },
    camera: { label: "Turn camera off", offLabel: "Turn camera on" },
    cancel: "Cancel",
    selfPreview: "Your camera",
    waiting: { one: "{count} person is waiting", other: "{count} people are waiting" },
    locked: "Room is locked · knocking enabled",
    empty: "No one is waiting.",
    admit: "Admit",
    admitLabel: "Admit {name}",
    denyLabel: "Deny {name}",
    admitAll: "Admit everyone",
    keepLocked: "Keep locked",
    note: "External guests are always held in the waiting room, even with the link.",
    knocks: [
      { id: "nour", name: "Nour Khalil", detail: "nour@fasla.design · invited" },
      { id: "hala", name: "Hala Mansour", detail: "Guest link · not signed in", initials: "HM" },
      { id: "tariq", name: "Tariq Aziz", detail: "tariq@northwind.co · external" },
    ],
  },
  ar: {
    guestTitle: "أنت في غرفة الانتظار",
    guestText: "تم إشعار {host}. ستنضم إلى {meeting} بمجرد أن يسمح لك بالدخول.",
    host: "آدم فاروق",
    meeting: "مزامنة التصميم الأسبوعية",
    mic: { label: "كتم الميكروفون", offLabel: "إلغاء كتم الميكروفون" },
    camera: { label: "إيقاف الكاميرا", offLabel: "تشغيل الكاميرا" },
    cancel: "إلغاء",
    selfPreview: "كاميرتك",
    waiting: { zero: "لا أحد في الانتظار", one: "شخص واحد في الانتظار", two: "شخصان في الانتظار", few: "{count} أشخاص في الانتظار", many: "{count} شخصًا في الانتظار", other: "{count} شخص في الانتظار" },
    locked: "الغرفة مقفلة، الطرق على الباب مفعّل",
    empty: "لا أحد في الانتظار.",
    admit: "سماح",
    admitLabel: "السماح بدخول {name}",
    denyLabel: "رفض {name}",
    admitAll: "السماح للجميع",
    keepLocked: "إبقاء القفل",
    note: "يُحتجز الضيوف الخارجيون دائمًا في غرفة الانتظار، حتى مع وجود الرابط.",
    knocks: [
      { id: "nour", name: "نور خليل", detail: "nour@fasla.design، مدعوّ" },
      { id: "hala", name: "هالة منصور", detail: "رابط ضيف، غير مسجّل", initials: "ه م" },
      { id: "tariq", name: "طارق عزيز", detail: "tariq@northwind.co، خارجي" },
    ],
  },
}

const COPY_KEYS = Object.keys(COPY.en)

export interface VideoCallWaitingRoomKnockProps extends React.HTMLAttributes<HTMLElement>, Partial<VideoCallWaitingRoomKnockCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: VideoCallLocale
  /** The photos, by `id`: the guests', and `yasmin` for the guest's own preview. A guest without one shows initials. */
  photos?: VideoCallPhotos
  /** Called with the guest's id when Admit is pressed. */
  onAdmit?: (id: string) => void
  /** Called with the guest's id when Deny is pressed. */
  onDeny?: (id: string) => void
  /** Called when Admit everyone is pressed, with every id still waiting. */
  onAdmitAll?: (ids: string[]) => void
  /** Called when Keep locked is pressed. */
  onKeepLocked?: () => void
  /** Called when the guest presses Cancel. */
  onCancel?: () => void
  /** Called with `mic` or `camera` and whether it is now on. */
  onControl?: (id: "mic" | "camera", on: boolean) => void
}

/** The tint Figma's `opacity/primary/5` gives: a gradient of one colour, since a plain background tint of a theme colour has no rule under Tailwind 3. */
const TINT = "bg-gradient-to-r from-primary/5 to-primary/5"

export function VideoCallWaitingRoomKnock({
  locale = "en",
  photos,
  onAdmit,
  onDeny,
  onAdmitAll,
  onKeepLocked,
  onCancel,
  onControl,
  className,
  ...props
}: VideoCallWaitingRoomKnockProps) {
  const copy = { ...COPY[locale], ...passedCopy(COPY_KEYS, props) } as VideoCallWaitingRoomKnockCopy
  const rest = restOf(COPY_KEYS, props) as React.HTMLAttributes<HTMLElement>
  const [rows, setRows] = React.useState<VideoCallKnock[]>(copy.knocks)
  const [micOn, setMicOn] = React.useState(true)
  const [cameraOn, setCameraOn] = React.useState(true)
  const lock = React.useRef<HTMLDivElement>(null)
  const nodes = React.useRef(new Map<string, HTMLElement>())
  const known = React.useRef(new Set(copy.knocks.map((knock) => knock.id)))
  const passed = props.knocks

  // A list passed in replaces the rows.
  React.useEffect(() => {
    if (passed) setRows(passed)
  }, [passed])

  // A new knock grows in from nothing, height and opacity together over 200ms.
  React.useEffect(() => {
    for (const row of rows) {
      if (known.current.has(row.id)) continue
      known.current.add(row.id)
      const node = nodes.current.get(row.id)
      if (!node || typeof node.animate !== "function") continue
      const reduced = prefersReducedMotion()
      node.animate(reduced ? [{ opacity: 0 }, { opacity: 1 }] : [{ height: "0px", opacity: 0, marginBottom: "-8px" }, { height: `${node.offsetHeight}px`, opacity: 1, marginBottom: "0px" }], {
        duration: reduced ? FAST_MS : 200,
        easing: "cubic-bezier(0.2, 0, 0, 1)",
      })
    }
  }, [rows])

  // The lock breathes between 98% and 102% on a 2.4s loop; reduced motion holds it still.
  React.useEffect(() => {
    const node = lock.current
    if (!node || typeof node.animate !== "function" || prefersReducedMotion()) return
    const animation = node.animate([{ transform: "scale(0.98)" }, { transform: "scale(1.02)" }], { duration: 1200, iterations: Infinity, direction: "alternate", easing: "ease-in-out" })
    return () => animation.cancel()
  }, [])

  // A row collapses to nothing over 180ms and the rows below move up with it.
  const collapse = (ids: string[]) => {
    const done = () => setRows((current) => current.filter((row) => !ids.includes(row.id)))
    const reduced = prefersReducedMotion()
    const animations = ids
      .map((id) => nodes.current.get(id))
      .filter((node): node is HTMLElement => Boolean(node) && typeof node!.animate === "function")
      .map((node) =>
        node.animate(reduced ? [{ opacity: 1 }, { opacity: 0 }] : [{ height: `${node.offsetHeight}px`, opacity: 1, marginBottom: "0px" }, { height: "0px", opacity: 0, marginBottom: "-8px" }], {
          duration: reduced ? FAST_MS : 180,
          easing: "cubic-bezier(0.2, 0, 0, 1)",
          fill: "forwards",
        })
      )
    if (!animations.length) return done()
    animations[0]!.onfinish = done
  }

  const toggle = (id: "mic" | "camera") => {
    const next = id === "mic" ? !micOn : !cameraOn
    if (id === "mic") setMicOn(next)
    else setCameraOn(next)
    onControl?.(id, next)
  }

  const plural = (count: number) => {
    const form = new Intl.PluralRules(locale).select(count)
    return fillTemplate(copy.waiting[form] ?? copy.waiting.other, { count })
  }

  return (
    <VideoCallSection aria-label={copy.guestTitle} className={className} {...rest}>
      <div className="flex flex-col gap-5 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:gap-8">
        {/* The guest's card */}
        <div className={cn(VIDEO_CALL_CARD, "relative flex min-h-[320px] min-w-0 flex-1 flex-col items-center justify-center gap-3.5 p-8 text-center [@container(min-width:40rem)]:gap-5")}>
          <div
            aria-hidden
            className="absolute end-3 top-3 h-[58px] w-24 overflow-hidden rounded-lg bg-muted [@container(min-width:40rem)]:end-6 [@container(min-width:40rem)]:top-6 [@container(min-width:40rem)]:h-24 [@container(min-width:40rem)]:w-40"
          >
            {photos?.yasmin ? <img src={photos.yasmin.src} alt="" loading="lazy" decoding="async" className="size-full object-cover object-[50%_35%]" /> : null}
          </div>
          <div ref={lock} className={cn("flex size-[72px] items-center justify-center rounded-full text-primary", TINT)}>
            <LockKeyhole aria-hidden className="size-7" />
          </div>
          <h2 className="text-xl font-semibold text-foreground [@container(min-width:40rem)]:text-2xl">{copy.guestTitle}</h2>
          <p className="max-w-[420px] text-sm text-muted-foreground">
            <Figures>{fillTemplate(copy.guestText, { host: copy.host, meeting: copy.meeting })}</Figures>
          </p>
          <div role="group" aria-label={copy.selfPreview} className="flex items-center gap-2">
            <Button
              type="button"
              tone={micOn ? "primary" : "destructive"}
              size="icon-lg"
              radius="rounded"
              aria-label={micOn ? copy.mic.label : copy.mic.offLabel}
              aria-pressed={!micOn}
              onClick={() => toggle("mic")}
              className="size-12 transition-colors duration-[160ms] motion-reduce:transition-none"
            >
              {micOn ? <Mic aria-hidden /> : <MicOff aria-hidden />}
            </Button>
            <Button
              type="button"
              tone={cameraOn ? "primary" : "destructive"}
              size="icon-lg"
              radius="rounded"
              aria-label={cameraOn ? copy.camera.label : copy.camera.offLabel}
              aria-pressed={!cameraOn}
              onClick={() => toggle("camera")}
              className="size-12 transition-colors duration-[160ms] motion-reduce:transition-none"
            >
              {cameraOn ? <Video aria-hidden /> : <VideoOff aria-hidden />}
            </Button>
            <Button type="button" variant="destructive" size="lg" radius="rounded" onClick={onCancel}>
              <PhoneOff aria-hidden />
              {copy.cancel}
            </Button>
          </div>
        </div>

        {/* The host's card, a sheet on a phone */}
        <div className={cn(VIDEO_CALL_CARD, "flex shrink-0 flex-col gap-5 p-6 [@container(min-width:64rem)]:w-[440px]")}>
          <div aria-hidden className="flex justify-center [@container(min-width:40rem)]:hidden">
            <span className="h-1 w-9 rounded-full bg-muted-foreground" />
          </div>
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
              <DoorOpen aria-hidden className="size-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-medium text-foreground" aria-live="polite">
                {plural(rows.length)}
              </h3>
              <p className="text-xs text-muted-foreground">{copy.locked}</p>
            </div>
          </div>
          {rows.length ? (
            <ul className="flex flex-col gap-2">
              {rows.map((row) => (
                <li
                  key={row.id}
                  ref={(node) => {
                    if (node) nodes.current.set(row.id, node)
                    else nodes.current.delete(row.id)
                  }}
                  className="overflow-hidden rounded-md bg-muted"
                >
                  <div className="flex flex-wrap items-center gap-3 p-3">
                    <Avatar
                      size="32"
                      radius="rounded"
                      variant={photos?.[row.id] ? "image" : "initials"}
                      src={photos?.[row.id]?.src}
                      name={row.name}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1 basis-32">
                      <p className="truncate text-sm font-medium text-foreground">{row.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        <Figures>{row.detail}</Figures>
                      </p>
                    </div>
                    <div className="flex w-full items-center gap-2 [@container(min-width:40rem)]:w-auto">
                      <Button
                        type="button"
                        variant="outline"
                        tone="secondary"
                        size="icon-sm"
                        aria-label={fillTemplate(copy.denyLabel, { name: row.name })}
                        onClick={() => {
                          onDeny?.(row.id)
                          collapse([row.id])
                        }}
                      >
                        <X aria-hidden />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        aria-label={fillTemplate(copy.admitLabel, { name: row.name })}
                        onClick={() => {
                          onAdmit?.(row.id)
                          collapse([row.id])
                        }}
                      >
                        <Check aria-hidden />
                        {copy.admit}
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p role="status" className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
              {copy.empty}
            </p>
          )}
          {rows.length ? (
            <div className="flex flex-col gap-2 [@container(min-width:64rem)]:flex-row">
              <Button
                type="button"
                className="w-full [@container(min-width:64rem)]:flex-1"
                onClick={() => {
                  onAdmitAll?.(rows.map((row) => row.id))
                  collapse(rows.map((row) => row.id))
                }}
              >
                {copy.admitAll}
              </Button>
              <Button type="button" variant="outline" tone="secondary" className="w-full [@container(min-width:64rem)]:flex-1" onClick={onKeepLocked}>
                {copy.keepLocked}
              </Button>
            </div>
          ) : null}
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0" />
            <span>{copy.note}</span>
          </p>
        </div>
      </div>
    </VideoCallSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const videoCallWaitingRoomKnockCopy = COPY
