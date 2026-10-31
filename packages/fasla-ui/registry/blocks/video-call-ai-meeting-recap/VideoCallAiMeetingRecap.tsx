"use client"

import * as React from "react"
import { ChevronRight, Download, FileText, ListChecks, Pin, Play, Share2, Sparkles } from "lucide-react"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { Checkbox } from "../../ui/checkbox/checkbox"
import { cn } from "../../../src/lib/utils"
import {
  FAST_MS,
  Figures,
  STANDARD,
  VideoCallSection,
  VideoCallToast,
  passedCopy,
  prefersReducedMotion,
  restOf,
  useVideoCallToast,
  type VideoCallLocale,
  type VideoCallPhoto,
  type VideoCallPhotos,
} from "../video-call/video-call"

/*
 * Figma: `Video Call` (42869:1033), Type=AI Meeting Recap.
 *
 * A header with a Generated badge, the meeting's name, a line on it, and Share
 * recap and Open transcript. Under it two columns: the summary (an Overview
 * card, and an Action items card where each item is a checkbox, a task, and
 * its owner with a due date) and the moments (the recording's still with a
 * play button, a duration and download and share, and a Key moments card whose
 * rows are a timestamp and a line).
 *
 * Desktop sets the columns side by side, the moments column 420px; Tablet puts
 * the recording and the moments below the summary; a phone stacks the header,
 * folds the key moments into a row of chips that scrolls sideways, and lets an
 * owner's line wrap.
 *
 * The first time a recap is generated (`reveal`) its overview shows word by
 * word, about 35ms a word; on any later visit, under reduced motion, or with
 * data saver on, it is simply there. Checking an action item fills the box and
 * draws the strikethrough over 240ms, from the start of the line, so in Arabic
 * from the right. Choosing a key moment scrubs the still's time to it and
 * flashes that moment's timestamp once. Sharing slides a confirmation toast up
 * from the end corner. Timestamps stay left to right, as clock values do, and
 * each moment's chevron flips in Arabic.
 *
 * Stills only. The player is a photo with a time: every real action (Share
 * recap, Open transcript, download, share, the seek, an action item's change)
 * is a callback; which items are done, which moment is chosen and the toast are
 * state the block keeps itself.
 *
 * Content limits: an action item up to 64 characters, a moment up to 40. The
 * other limits are in the block's documentation page, which the default copy
 * stays inside.
 */

export interface VideoCallRecapOwner {
  /** Picks the owner's photo from `photos`. */
  id: string
  name: string
}

export interface VideoCallRecapAction {
  id: string
  task: string
  owner: VideoCallRecapOwner
  /** When it is due: `due Fri 13 Mar`. */
  due: string
  /** Whether it starts done. */
  done?: boolean
}

export interface VideoCallRecapMoment {
  id: string
  /** The time in the recording, always left to right: `04:12`. */
  time: string
  text: string
}

export interface VideoCallAiMeetingRecapCopy {
  /** The badge above the title. */
  tag: string
  /** The meeting's name, an `h2`, and the line under it. */
  title: string
  meta: string
  share: string
  transcript: string
  /** The Overview card. */
  overviewTitle: string
  overview: string
  /** The Action items card, its count line, and what joins an owner to a due date. */
  actionsTitle: string
  assigned: string
  actions: VideoCallRecapAction[]
  dueJoin: string
  /** The recording card: its label, the still's duration, and the names of its three buttons. */
  recordingLabel: string
  duration: string
  playLabel: string
  downloadLabel: string
  shareRecordingLabel: string
  /** The Key moments card. */
  momentsTitle: string
  moments: VideoCallRecapMoment[]
  /** The toast after sharing. */
  sharedToast: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<VideoCallLocale, VideoCallAiMeetingRecapCopy> = {
  en: {
    tag: "Generated 2 minutes after the call",
    title: "Design sync — weekly",
    meta: "Thu 12 Mar · 47 min · 6 participants · recorded",
    share: "Share recap",
    transcript: "Open transcript",
    overviewTitle: "Overview",
    overview:
      "The team locked the pre-join lobby as the first shippable surface. Recording and transcript work moves to the following sprint so the lobby can go out on its own. Mona takes the lobby states, Adam owns the device-permission edge cases, and the encryption copy goes to legal before Friday.",
    actionsTitle: "Action items",
    assigned: "3 of 5 assigned",
    actions: [
      { id: "states", task: "Design the four lobby states incl. permission denied", owner: { id: "mona", name: "Mona Darwish" }, due: "due Fri 13 Mar", done: true },
      { id: "sdk", task: "Handle the camera-blocked edge case in the browser SDK", owner: { id: "adam", name: "Adam Farouk" }, due: "due Mon 16 Mar" },
      { id: "legal", task: "Send the encryption wording to legal for sign-off", owner: { id: "nour", name: "Nour Khalil" }, due: "due Thu 12 Mar" },
      { id: "ksa", task: "Confirm the dial-in numbers for KSA", owner: { id: "tariq", name: "Tariq Aziz" }, due: "due Next week" },
    ],
    dueJoin: "·",
    recordingLabel: "Full recording",
    duration: "47:12",
    playLabel: "Play the recording",
    downloadLabel: "Download the recording",
    shareRecordingLabel: "Share the recording",
    momentsTitle: "Key moments",
    moments: [
      { id: "decision", time: "04:12", text: "Decision — lobby ships first" },
      { id: "risk", time: "11:38", text: "Risk — permission prompts on Safari" },
      { id: "demo", time: "22:05", text: "Demo — new grid layout" },
      { id: "question", time: "35:47", text: "Question — do we need dial-in for KSA?" },
      { id: "next", time: "44:19", text: "Next steps and owners" },
    ],
    sharedToast: "Recap shared",
  },
  ar: {
    tag: "أُنشئ بعد دقيقتين من المكالمة",
    title: "مزامنة التصميم الأسبوعية",
    meta: "الخميس 12 مارس، 47 دقيقة، 6 مشاركين، مُسجّل",
    share: "مشاركة الملخّص",
    transcript: "فتح النص",
    overviewTitle: "نظرة عامة",
    overview:
      "اتفق الفريق على أن تكون غرفة الانتظار أول واجهة قابلة للإطلاق. ينتقل عمل التسجيل والنص إلى السبرنت التالي حتى تُطلق غرفة الانتظار وحدها. تتولى منى حالات غرفة الانتظار، ويتولى آدم حالات صلاحيات الأجهزة، ويُحال نص التشفير إلى القسم القانوني قبل الجمعة.",
    actionsTitle: "بنود العمل",
    assigned: "3 من 5 مُعيّنة",
    actions: [
      { id: "states", task: "تصميم حالات غرفة الانتظار الأربع، بما فيها رفض الصلاحية", owner: { id: "mona", name: "منى درويش" }, due: "تستحق الجمعة 13 مارس", done: true },
      { id: "sdk", task: "معالجة حالة حجب الكاميرا في SDK المتصفح", owner: { id: "adam", name: "آدم فاروق" }, due: "تستحق الاثنين 16 مارس" },
      { id: "legal", task: "إرسال نص التشفير إلى القسم القانوني للموافقة", owner: { id: "nour", name: "نور خليل" }, due: "تستحق الخميس 12 مارس" },
      { id: "ksa", task: "تأكيد أرقام الاتصال للسعودية", owner: { id: "tariq", name: "طارق عزيز" }, due: "تستحق الأسبوع القادم" },
    ],
    dueJoin: "،",
    recordingLabel: "التسجيل الكامل",
    duration: "47:12",
    playLabel: "تشغيل التسجيل",
    downloadLabel: "تنزيل التسجيل",
    shareRecordingLabel: "مشاركة التسجيل",
    momentsTitle: "اللحظات المهمة",
    moments: [
      { id: "decision", time: "04:12", text: "قرار: إطلاق غرفة الانتظار أولًا" },
      { id: "risk", time: "11:38", text: "مخاطرة: نوافذ الصلاحيات في Safari" },
      { id: "demo", time: "22:05", text: "عرض: تخطيط الشبكة الجديد" },
      { id: "question", time: "35:47", text: "سؤال: هل نحتاج اتصالًا هاتفيًا للسعودية؟" },
      { id: "next", time: "44:19", text: "الخطوات التالية والمسؤولون" },
    ],
    sharedToast: "تمت مشاركة الملخّص",
  },
}

const COPY_KEYS = Object.keys(COPY.en)

export interface VideoCallAiMeetingRecapProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<VideoCallAiMeetingRecapCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: VideoCallLocale
  /** The still on the recording card. Without one it is a plain `muted` tile. */
  photo?: VideoCallPhoto
  /** The photos of the owners, by their `id`. An owner without one shows their initials. */
  photos?: VideoCallPhotos
  /** Reveals the overview word by word, as it does the first time a recap is generated. */
  reveal?: boolean
  /** The moment chosen when the block opens. */
  defaultMomentId?: string
  /** Called when Share recap is pressed. The toast follows it. */
  onShare?: () => void
  /** Called when Open transcript is pressed. */
  onOpenTranscript?: () => void
  /** Called when the still's download button is pressed. */
  onDownload?: () => void
  /** Called when the still's share button is pressed. */
  onShareRecording?: () => void
  /** Called when the play button is pressed. */
  onPlay?: () => void
  /** Called with the moment's id and its time when a key moment is chosen. */
  onSeek?: (id: string, time: string) => void
  /** Called with an action item's id and whether it is now done. */
  onActionChange?: (id: string, done: boolean) => void
}

/** Whether the visitor's connection asks to save data, where the browser says. */
function savesData() {
  const connection = typeof navigator !== "undefined" ? (navigator as Navigator & { connection?: { saveData?: boolean } }).connection : undefined
  return !!connection?.saveData
}

/** The overview, word by word when `reveal` asks for it: each word fades in about 35ms after the one before. */
function Overview({ text, reveal }: { text: string; reveal: boolean }) {
  const ref = React.useRef<HTMLParagraphElement>(null)
  const words = React.useMemo(() => text.split(/(\s+)/), [text])
  React.useLayoutEffect(() => {
    const node = ref.current
    if (!node || !reveal || prefersReducedMotion() || savesData()) return
    const spans = Array.from(node.querySelectorAll<HTMLElement>("[data-word]"))
    const animations = spans
      .filter((span) => typeof span.animate === "function")
      .map((span, index) => span.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, delay: index * 35, easing: STANDARD, fill: "backwards" }))
    return () => animations.forEach((animation) => animation.cancel())
  }, [reveal, text])
  return (
    <p ref={ref} className="text-base leading-6 text-foreground">
      {reveal
        ? words.map((word, index) => (/^\s+$/.test(word) ? word : <span key={index} data-word="">{word}</span>))
        : text}
    </p>
  )
}

/** A task whose strikethrough draws over 240ms from the start of the line when it is checked. */
function Task({ done, children }: { done: boolean; children: React.ReactNode }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const first = React.useRef(true)
  React.useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const rtl = getComputedStyle(node).direction === "rtl"
    node.style.backgroundPosition = `${rtl ? "100%" : "0"} 56%`
    if (first.current) {
      first.current = false
      return
    }
    if (typeof node.animate !== "function" || !done) return
    const animation = node.animate(prefersReducedMotion() ? [{ opacity: 0.6 }, { opacity: 1 }] : [{ backgroundSize: "0% 1px" }, { backgroundSize: "100% 1px" }], {
      duration: prefersReducedMotion() ? FAST_MS : 240,
      easing: STANDARD,
    })
    return () => animation.cancel()
  }, [done])
  return (
    <span
      ref={ref}
      style={{ backgroundImage: "linear-gradient(currentColor, currentColor)", backgroundRepeat: "no-repeat", backgroundSize: done ? "100% 1px" : "0% 1px", backgroundPosition: "0 56%" }}
      className={cn("text-sm [box-decoration-break:clone]", done ? "text-muted-foreground" : "text-foreground")}
    >
      {children}
    </span>
  )
}

export function VideoCallAiMeetingRecap({
  locale = "en",
  photo,
  photos,
  reveal = false,
  defaultMomentId,
  onShare,
  onOpenTranscript,
  onDownload,
  onShareRecording,
  onPlay,
  onSeek,
  onActionChange,
  className,
  ...props
}: VideoCallAiMeetingRecapProps) {
  const copy = { ...COPY[locale], ...passedCopy(COPY_KEYS, props) } as VideoCallAiMeetingRecapCopy
  const rest = restOf(COPY_KEYS, props) as React.HTMLAttributes<HTMLElement>
  const headingId = React.useId()
  const [done, setDone] = React.useState<Record<string, boolean>>(() => Object.fromEntries(copy.actions.map((action) => [action.id, !!action.done])))
  const [momentId, setMomentId] = React.useState<string | undefined>(defaultMomentId)
  const toast = useVideoCallToast()
  const chips = React.useRef(new Map<string, HTMLElement>())

  const moment = copy.moments.find((entry) => entry.id === momentId)
  const shownTime = moment?.time ?? copy.duration

  const toggle = (id: string, value: boolean) => {
    setDone((current) => ({ ...current, [id]: value }))
    onActionChange?.(id, value)
  }
  const seek = (entry: VideoCallRecapMoment) => {
    setMomentId(entry.id)
    onSeek?.(entry.id, entry.time)
    const chip = chips.current.get(entry.id)
    if (chip && typeof chip.animate === "function") chip.animate([{ opacity: 1 }, { opacity: 0.3 }, { opacity: 1 }], { duration: prefersReducedMotion() ? FAST_MS : 320, easing: STANDARD })
  }
  const share = () => {
    onShare?.()
    toast.show(copy.sharedToast)
  }

  const card = "rounded-[0.875rem] border border-border bg-card"
  const cardTitle = "text-sm font-semibold text-foreground"

  return (
    <VideoCallSection labelledBy={headingId} className={cn("relative", className)} gap="sm" contentClassName="gap-6" {...rest}>
      <div className="flex flex-col gap-4 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-end [@container(min-width:64rem)]:justify-between">
        <div className="flex min-w-0 flex-col items-start gap-2">
          <Badge variant="solid" tone="primary" size="lg" radius="rounded" icon={<Sparkles />}>
            {copy.tag}
          </Badge>
          <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl">
            <Figures>{copy.title}</Figures>
          </h2>
          <p className="text-sm text-muted-foreground">
            <Figures>{copy.meta}</Figures>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={share}>
            {copy.share}
          </Button>
          <Button type="button" variant="outline" tone="secondary" onClick={onOpenTranscript}>
            {copy.transcript}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-5 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start">
        {/* The summary */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className={cn(card, "flex flex-col gap-3 p-6")}>
            <div className="flex items-center gap-2">
              <FileText aria-hidden className="size-4 text-muted-foreground" />
              <h3 className={cardTitle}>{copy.overviewTitle}</h3>
            </div>
            <Overview text={copy.overview} reveal={reveal} />
          </div>

          <div className={cn(card, "flex flex-col gap-4 p-6")}>
            <div className="flex items-center gap-2">
              <ListChecks aria-hidden className="size-4 text-muted-foreground" />
              <h3 className={cardTitle}>{copy.actionsTitle}</h3>
              <span className="ms-auto text-xs text-muted-foreground">
                <Figures>{copy.assigned}</Figures>
              </span>
            </div>
            <ul className="flex flex-col gap-4">
              {copy.actions.map((action) => {
                const isDone = !!done[action.id]
                const photoOf = photos?.[action.owner.id]
                return (
                  <li key={action.id} className="flex items-start gap-3">
                    <Checkbox size="md" checked={isDone} aria-label={action.task} onChange={(event) => toggle(action.id, event.currentTarget.checked)} className="mt-0.5" />
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <p>
                        <Task done={isDone}>
                          <Figures>{action.task}</Figures>
                        </Task>
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <Avatar size="32" radius="standard" variant={photoOf ? "image" : "initials"} src={photoOf?.src} name={action.owner.name} />
                        <span className="text-xs text-muted-foreground">
                          {action.owner.name}
                          <span aria-hidden className={locale === "ar" ? "me-1" : "mx-1"}>
                            {copy.dueJoin}
                          </span>
                          <Figures>{action.due}</Figures>
                        </span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* The moments */}
        <div className="flex min-w-0 flex-col gap-4 [@container(min-width:64rem)]:w-[420px] [@container(min-width:64rem)]:shrink-0">
          <div className={cn(card, "flex flex-col gap-3 p-4")}>
            <div className="relative aspect-[388/200] w-full overflow-hidden rounded-[0.625rem] bg-muted">
              {photo ? <img src={photo.src} alt={photo.alt} className="size-full object-cover" /> : null}
              <Button type="button" size="icon-lg" radius="rounded" aria-label={copy.playLabel} onClick={onPlay} className="absolute inset-0 m-auto">
                <Play aria-hidden />
              </Button>
              <Badge variant="solid" tone="primary" size="lg" radius="standard" className="absolute bottom-2 end-2 tabular-nums">
                <bdi dir="ltr" aria-live="polite">
                  {shownTime}
                </bdi>
              </Badge>
            </div>
            <div className="flex items-center gap-1 ps-2">
              <p className="me-auto text-sm font-medium text-foreground">{copy.recordingLabel}</p>
              <Button type="button" variant="ghost" tone="secondary" size="icon-sm" aria-label={copy.downloadLabel} onClick={onDownload}>
                <Download aria-hidden />
              </Button>
              <Button type="button" variant="ghost" tone="secondary" size="icon-sm" aria-label={copy.shareRecordingLabel} onClick={onShareRecording}>
                <Share2 aria-hidden />
              </Button>
            </div>
          </div>

          <div className={cn(card, "flex flex-col gap-4 p-6")}>
            <div className="flex items-center gap-2">
              <Pin aria-hidden className="size-4 text-muted-foreground" />
              <h3 className={cardTitle}>{copy.momentsTitle}</h3>
            </div>
            <ul className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [@container(min-width:40rem)]:mx-0 [@container(min-width:40rem)]:flex-col [@container(min-width:40rem)]:gap-3 [@container(min-width:40rem)]:overflow-visible [@container(min-width:40rem)]:p-0">
              {copy.moments.map((entry) => (
                <li key={entry.id} className="shrink-0 [@container(min-width:40rem)]:shrink">
                  <button
                    type="button"
                    aria-pressed={entry.id === momentId}
                    onClick={() => seek(entry)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-full border border-border px-3 py-2 text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring [@container(min-width:40rem)]:rounded-md [@container(min-width:40rem)]:border-transparent [@container(min-width:40rem)]:p-0",
                      entry.id === momentId && "bg-muted [@container(min-width:40rem)]:bg-transparent"
                    )}
                  >
                    <span
                      ref={(node) => {
                        if (node) chips.current.set(entry.id, node)
                        else chips.current.delete(entry.id)
                      }}
                      className="inline-flex shrink-0"
                    >
                      <Badge variant="solid" tone="primary" size="lg" radius="standard" className="tabular-nums">
                        <bdi dir="ltr">{entry.time}</bdi>
                      </Badge>
                    </span>
                    <span className="min-w-0 flex-1 whitespace-nowrap text-sm text-foreground [@container(min-width:40rem)]:whitespace-normal">
                      <Figures>{entry.text}</Figures>
                    </span>
                    <ChevronRight aria-hidden className="hidden size-4 shrink-0 text-muted-foreground [@container(min-width:40rem)]:block rtl:-scale-x-100" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 end-4">
        <VideoCallToast message={toast.message} />
      </div>
    </VideoCallSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const videoCallAiMeetingRecapCopy = COPY
