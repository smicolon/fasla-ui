"use client"

import * as React from "react"
import { ArrowDown } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { MahaamPauseButton, usePausedState, type MahaamPauseButtonLabels } from "./mahaam-pause-button"
import { useInView, useLoopClock, usePageVisible, usePrefersReducedMotion } from "./mahaam-motion"

/*
 * Figma: `Mahaam Template` (47694:6712), the Features section of each of its
 * six variants, and the motion cards "Language Stack", "Hand-off" and "Recap".
 *
 * A heading and three cards, each a tinted stage with a small window on it and
 * the words under (or, on Tablet, beside) it:
 *  - Languages: the same sentence in ten languages, stacked like a deck. Every
 *    2.2s the front bubble moves back and the next comes in from below.
 *  - Hand-off: a cursor assigns a task to Khalid; a toast says he accepted.
 *  - Recap: a summary types itself, its action items fade up, and Send turns
 *    into "Sent to #marketing".
 * Desktop sets the cards side by side, Tablet stacks them with the stage at the
 * start and the words at the end, Mobile stacks stage over words.
 *
 * MOTION EXCEPTION (see `mahaam-motion.ts`): the three windows play on their
 * own and loop. Each waits under the pointer (and the card lifts 6px), while it
 * is off screen and while the page is hidden. One pause button stops all three.
 * Under `prefers-reduced-motion: reduce` they stay on Figma's still frames and
 * the button is not drawn.
 *
 * Arabic has no country flag, so it gets a neutral tile with «ع», and the "Heard in" badge an initials Avatar.
 *
 * The tints are the soft tokens Figma's opacity/info/10, warning/10 and
 * success/10 are, laid over the card. Flags are images and are not mirrored; the
 * Latin sentences keep their direction in Arabic.
 *
 * Sized by the section's own width: Mobile is the base,
 * `[@container(min-width:48rem)]:` is Figma's Tablet and
 * `[@container(min-width:90rem)]:` its Desktop.
 */

type Locale = "en" | "ar"

export interface MahaamFeaturesCopy {
  heading: string
  subheading: string
  languages: {
    label: string
    title: string
    body: string
    /** The pill at the top of the window. */
    count: string
    listening: string
    task: string
    /** Before the language's name, in the task's badge. */
    heardIn: (language: string) => string
    /** The ten languages, in the order they come to the front: the one said, its name and its direction. */
    items: { key: (typeof LANGS)[number]["key"]; name: string; say: string; dir: "ltr" | "rtl" }[]
  }
  handoff: {
    label: string
    title: string
    body: string
    source: string
    task: string
    fields: { due: string; priority: string; project: string; estimate: string; labels: string; reminder: string }
    values: { due: string; priority: string; project: string; estimate: string; labels: [string, string]; reminder: string }
    assignee: string
    unassigned: string
    people: [string, string, string]
    log: string
    toast: string
  }
  recap: {
    label: string
    title: string
    body: string
    ready: string
    meeting: string
    summary: string
    actionItems: string
    items: { text: string; due: string }[]
    send: string
    sent: string
  }
}

const LANGS = [
  { key: "arabic", say: "ذكّرني أتصل بالمورّد بكرة الصبح", dir: "rtl" },
  { key: "english", say: "Remind me to call the supplier tomorrow morning", dir: "ltr" },
  { key: "french", say: "Rappelle-moi d’appeler le fournisseur demain matin", dir: "ltr" },
  { key: "spanish", say: "Recuérdame llamar al proveedor mañana por la mañana", dir: "ltr" },
  { key: "hindi", say: "मुझे कल सुबह सप्लायर को फ़ोन करना याद दिलाना", dir: "ltr" },
  { key: "turkish", say: "Yarın sabah tedarikçiyi aramamı hatırlat", dir: "ltr" },
  { key: "japanese", say: "明日の朝、仕入れ先に電話するのを思い出させて", dir: "ltr" },
  { key: "german", say: "Erinnere mich, morgen früh den Lieferanten anzurufen", dir: "ltr" },
  { key: "indonesian", say: "Ingatkan saya menelepon pemasok besok pagi", dir: "ltr" },
  { key: "portuguese", say: "Lembra-me de ligar ao fornecedor amanhã de manhã", dir: "ltr" },
] as const

const NAMES: Record<Locale, Record<(typeof LANGS)[number]["key"], string>> = {
  en: { arabic: "Arabic", english: "English", french: "French", spanish: "Spanish", hindi: "Hindi", turkish: "Turkish", japanese: "Japanese", german: "German", indonesian: "Indonesian", portuguese: "Portuguese" },
  ar: { arabic: "العربية", english: "الإنجليزية", french: "الفرنسية", spanish: "الإسبانية", hindi: "الهندية", turkish: "التركية", japanese: "اليابانية", german: "الألمانية", indonesian: "الإندونيسية", portuguese: "البرتغالية" },
}

const items = (locale: Locale) => LANGS.map((l) => ({ ...l, name: NAMES[locale][l.key] }))

/** Figma's copy, English and Arabic. */
const COPY: Record<Locale, MahaamFeaturesCopy> = {
  en: {
    heading: "From voice to done.",
    subheading: "Everything that happens after you stop talking, handled for you.",
    languages: {
      label: "Any language",
      title: "Talk in any language",
      body: "More than 40 languages, and you can switch mid-sentence. Every task comes out clean and in one place.",
      count: "40+ languages",
      listening: "Listening",
      task: "Call the supplier",
      heardIn: (language) => `Heard in ${language}`,
      items: items("en"),
    },
    handoff: {
      label: "Hand-offs",
      title: "Hand it off in one tap",
      body: "Every commitment from a call gets an owner. It lands in their list with the due date, project and context already attached.",
      source: "From Marketing sync",
      task: "Check the campaign numbers",
      fields: { due: "Due", priority: "Priority", project: "Project", estimate: "Estimate", labels: "Labels", reminder: "Reminder" },
      values: { due: "Friday", priority: "Medium", project: "Q4 campaign", estimate: "2 hours", labels: ["Finance", "Marketing"], reminder: "Thursday, 16:00" },
      assignee: "Assignee",
      unassigned: "Unassigned",
      people: ["Khalid Mansour", "Noura Al-Harbi", "Faisal Al-Otaibi"],
      log: "You assigned this to Khalid, just now",
      toast: "Khalid accepted the task",
    },
    recap: {
      label: "Recaps",
      title: "Recaps that write themselves",
      body: "Summary, decisions and action items with owners, ready seconds after you hang up. Send it to the team or a client as is.",
      ready: "Ready 4 seconds after the call",
      meeting: "Marketing sync",
      summary: "Smaller first cut of the campaign. Khalid checks the numbers by Friday; Noura owns the brief.",
      actionItems: "Action items",
      items: [
        { text: "Check the campaign numbers", due: "Fri" },
        { text: "Write the creative brief", due: "Wed" },
        { text: "Book the studio", due: "Next week" },
      ],
      send: "Send to #marketing",
      sent: "Sent to #marketing",
    },
  },
  ar: {
    heading: "من الصوت إلى الإنجاز.",
    subheading: "كل ما يحدث بعد أن تنتهي من الكلام، نتولّاه عنك.",
    languages: {
      label: "أي لغة",
      title: "تحدّث بأي لغة",
      body: "أكثر من 40 لغة، ويمكنك التنقل بينها في منتصف الجملة. تخرج كل مهمة مرتبة وفي مكان واحد.",
      count: "أكثر من 40 لغة",
      listening: "جارٍ الاستماع",
      task: "الاتصال بالمورّد",
      heardIn: (language) => `قيلت ب${language}`,
      items: items("ar"),
    },
    handoff: {
      label: "الإسناد",
      title: "أسندها بلمسة واحدة",
      body: "كل التزام في المكالمة يجد مسؤولًا عنه. يصل إلى قائمته ومعه الموعد والمشروع والسياق.",
      source: "من اجتماع التسويق",
      task: "راجع أرقام الحملة",
      fields: { due: "موعد التسليم", priority: "الأولوية", project: "المشروع", estimate: "التقدير", labels: "التصنيفات", reminder: "التذكير" },
      values: { due: "الجمعة", priority: "متوسطة", project: "حملة الربع الرابع", estimate: "ساعتان", labels: ["المالية", "التسويق"], reminder: "الخميس، 16:00" },
      assignee: "المسؤول",
      unassigned: "بلا مسؤول",
      people: ["خالد منصور", "نورة الحربي", "فيصل العتيبي"],
      log: "أسندتَ هذه المهمة إلى خالد قبل لحظات",
      toast: "قبل خالد المهمة",
    },
    recap: {
      label: "الملخصات",
      title: "ملخصات تكتب نفسها",
      body: "ملخص وقرارات ومهام لها مسؤولون، جاهزة بعد ثوانٍ من إنهاء المكالمة. أرسلها إلى فريقك أو عميلك كما هي.",
      ready: "جاهز بعد 4 ثوانٍ من انتهاء المكالمة",
      meeting: "اجتماع التسويق",
      summary: "نسخة أولى أصغر من الحملة. يراجع خالد الأرقام بحلول الجمعة، وتتولى نورة المذكرة.",
      actionItems: "المهام المطلوبة",
      items: [
        { text: "راجع أرقام الحملة", due: "الجمعة" },
        { text: "كتابة الملخص الإبداعي", due: "الأربعاء" },
        { text: "حجز الاستوديو", due: "الأسبوع القادم" },
      ],
      send: "إرسال إلى #التسويق",
      sent: "أُرسل إلى #التسويق",
    },
  },
}

export interface MahaamFeaturesProps extends React.HTMLAttributes<HTMLElement>, Partial<MahaamFeaturesCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: Locale
  /** The faces on the cards. */
  avatars?: { noura?: string; khalid?: string; faisal?: string }
  /** The flags, by language key (`arabic`, `english`, ...). */
  flags?: Partial<Record<(typeof LANGS)[number]["key"], string>>
  paused?: boolean
  defaultPaused?: boolean
  /** Holds the section on Figma's still frame without changing the pause button, which still shows Pause. For stills of the finished state. */
  still?: boolean
  onPausedChange?: (paused: boolean) => void
  pauseLabels?: Partial<MahaamPauseButtonLabels>
  /** Where in each loop the cards start, 0 to 1. Without it they start from the beginning, or from Figma's still frame when paused. */
  progress?: number
  /** Replaces the visitor's reduced-motion setting. For stories and tests. */
  reducedMotion?: boolean
}

/** Frames of 100ms: the languages turn every 22; the hand-off runs 100; the recap 130. Figma's still frames. */
const FRAME_MS = 100
const LANG_FRAMES = 22
const STILL = { lang: 10, handoff: 70, recap: 100 }

type Avatars = NonNullable<MahaamFeaturesProps["avatars"]>
type Flags = NonNullable<MahaamFeaturesProps["flags"]>

const WINDOW_SHADOW = "shadow-[0_30px_60px_-30px_color-mix(in_srgb,var(--foreground)_25%,transparent)]"

function Flag({ src, className }: { src?: string; className?: string }) {
  return src ? <img src={src} alt="" aria-hidden="true" className={cn("shrink-0 object-cover", className)} /> : <span aria-hidden="true" className={cn("shrink-0 bg-muted", className)} />
}

/** Arabic has no country flag: a small neutral tile with its letter «ع», the size of a flag, in theme tokens. */
function ArabicTile() {
  return (
    <span aria-hidden="true" className="flex h-[13px] w-[18px] shrink-0 items-center justify-center rounded-sm border border-border bg-card font-arabic text-xxs font-medium text-foreground">
      ع
    </span>
  )
}

/** One card: a tinted stage, and the words beside or under it. */
function Card({
  tint,
  stageClassName,
  textClassName,
  hovered,
  onHover,
  label,
  title,
  body,
  children,
}: {
  tint: string
  stageClassName: string
  textClassName?: string
  hovered: boolean
  onHover: (hovered: boolean) => void
  label: string
  title: string
  body: string
  children: React.ReactNode
}) {
  return (
    <article
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl bg-muted p-3 transition-transform duration-300 motion-reduce:transition-none",
        `[@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-center [@container(min-width:90rem)]:flex-1 [@container(min-width:90rem)]:flex-col [@container(min-width:90rem)]:items-stretch`,
        hovered && "-translate-y-1.5"
      )}
    >
      <div className={cn("flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-card bg-gradient-to-r", tint, `[@container(min-width:48rem)]:h-[500px] [@container(min-width:48rem)]:w-[368px]`, stageClassName)}>{children}</div>
      <div className={cn("flex flex-col gap-2 px-4 pb-5 pt-6", `[@container(min-width:48rem)]:w-[248px] [@container(min-width:48rem)]:shrink-0`, `[@container(min-width:90rem)]:w-auto`, textClassName)}>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <h3 className="text-3xl font-normal text-foreground">{title}</h3>
        <p className="text-base text-muted-foreground">{body}</p>
      </div>
    </article>
  )
}

const BUBBLE_POSITION = {
  front: "top-24 inset-x-0 opacity-100 z-[3]",
  second: "top-12 inset-x-[3%] opacity-65 z-[2]",
  third: "top-2 inset-x-[6%] opacity-45 z-[1]",
  entering: "top-[150px] inset-x-0 opacity-0 z-0",
  leaving: "-top-5 inset-x-[8%] opacity-0 z-0",
} as const

function Languages({ copy, flags, frame }: { copy: MahaamFeaturesCopy["languages"]; flags: Flags; frame: number }) {
  const n = copy.items.length
  const current = Math.floor(frame / LANG_FRAMES) % n
  const sub = frame % LANG_FRAMES
  const front = copy.items[current] ?? copy.items[0]!
  return (
    <div className={cn("flex w-[256px] flex-col gap-2.5 overflow-hidden rounded-[14px] border border-border bg-card p-4", WINDOW_SHADOW, `[@container(min-width:48rem)]:w-[316px]`)}>
      <div className="flex h-5 items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-medium text-foreground">
          <span aria-hidden="true" className="size-[7px] rounded-full bg-foreground" />
          {copy.listening}
        </span>
        <Badge variant="solid" tone="primary" size="sm">
          {copy.count}
        </Badge>
      </div>
      <div className="relative h-44" aria-hidden="true">
        {copy.items.map((item, index) => {
          const rel = (current - index + n) % n
          const position = rel === 0 ? "front" : rel === 1 ? "second" : rel === 2 ? "third" : rel === n - 1 ? "entering" : "leaving"
          return (
            <div
              key={item.key}
              className={cn(
                "absolute rounded-[14px] bg-card bg-gradient-to-r from-muted to-muted px-3.5 py-3 transition-[top,left,right,opacity] duration-[800ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
                BUBBLE_POSITION[position]
              )}
            >
              <div dir="ltr" className="mb-1 flex items-center gap-1.5 text-xxs font-medium text-muted-foreground">
                {item.key === "arabic" ? <ArabicTile /> : <Flag src={flags[item.key]} className="h-[13px] w-[18px] rounded-sm border border-border" />}
                {item.name}
              </div>
              <p dir={item.dir} className="text-start text-sm font-medium text-foreground">
                {item.say}
              </p>
            </div>
          )
        })}
      </div>
      <ArrowDown aria-hidden="true" size={16} strokeWidth={2} className="mx-auto text-ring" />
      <div className="flex flex-col items-center gap-2 rounded-[10px] border border-border px-3.5 py-3 text-center [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:justify-between [@container(min-width:48rem)]:gap-2.5 [@container(min-width:48rem)]:text-start">
        <span className="text-sm font-semibold text-foreground">{copy.task}</span>
        <Badge variant="soft" tone="info" size="sm" className={cn("transition-opacity duration-300 motion-reduce:transition-none", sub < 3 ? "opacity-0" : "opacity-100")}>
          {front.key === "arabic" ? <Avatar variant="initials" size="12" radius="rounded" name="ع" /> : <Flag src={flags[front.key]} className="size-3 rounded-full" />}
          {copy.heardIn(front.name)}
        </Badge>
      </div>
    </div>
  )
}

const CURSOR = {
  idle: "translate-x-[222px] translate-y-[9px] [@container(min-width:48rem)]:translate-x-[266px] [@container(min-width:48rem)]:translate-y-[57px]",
  field: "translate-x-[156px] translate-y-[271px] [@container(min-width:48rem)]:translate-x-[196px] [@container(min-width:48rem)]:translate-y-[243px]",
  khalid: "translate-x-[116px] translate-y-[311px] [@container(min-width:48rem)]:translate-x-[156px] [@container(min-width:48rem)]:translate-y-[283px]",
}

function Handoff({ copy, avatars, frame }: { copy: MahaamFeaturesCopy["handoff"]; avatars: Avatars; frame: number }) {
  const open = frame >= 18 && frame < 36
  const assigned = frame >= 36 && frame < 96
  const toast = frame >= 46 && frame < 96
  const press = frame >= 30 && frame < 33
  const cursor = frame >= 60 ? "idle" : frame >= 26 ? "khalid" : frame >= 10 ? "field" : "idle"
  const f = copy.fields
  const v = copy.values
  const row = (index: number, label: string, children: React.ReactNode) => (
    <div className="absolute start-[18px] end-[18px] flex h-6 items-center text-sm leading-5" style={{ top: `calc(var(--mahaam-f0) + ${index} * var(--mahaam-pitch))` }}>
      <span className="w-[76px] shrink-0 whitespace-nowrap text-muted-foreground [&:dir(rtl)]:w-[88px]">{label}</span>
      {children}
    </div>
  )
  return (
    <div
      className={cn(
        "relative h-[364px] w-[256px] rounded-[14px] border border-border bg-card [--mahaam-f0:100px] [--mahaam-pitch:26px] [--mahaam-assignee:264px] [--mahaam-toast:376px] [&:where(:dir(rtl))]:[--mahaam-f0:76px]",
        `[@container(min-width:48rem)]:h-[336px] [@container(min-width:48rem)]:w-[316px] [@container(min-width:48rem)]:[--mahaam-f0:72px] [@container(min-width:48rem)]:[--mahaam-pitch:26px] [@container(min-width:48rem)]:[--mahaam-assignee:236px] [@container(min-width:48rem)]:[--mahaam-toast:356px]`,
        WINDOW_SHADOW
      )}
    >
      <p className="absolute start-[18px] top-[18px] flex items-center gap-1.5 text-xs text-muted-foreground">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-foreground" />
        {copy.source}
      </p>
      <p className="absolute start-[18px] end-[18px] top-9 text-xl font-medium text-foreground">{copy.task}</p>
      {row(0, f.due, <span className="text-foreground">{v.due}</span>)}
      {row(1, f.priority, <Badge variant="soft" tone="warning" size="sm">{v.priority}</Badge>)}
      {row(
        2,
        f.project,
        <span className="flex items-center gap-1.5 text-foreground">
          <span aria-hidden="true" className="size-2 rounded-[2px] bg-info" />
          {v.project}
        </span>
      )}
      {row(3, f.estimate, <span className="text-foreground">{v.estimate}</span>)}
      {row(
        4,
        f.labels,
        <span className="flex gap-1">
          {v.labels.map((label) => (
            <Badge key={label} variant="soft" tone="secondary" size="sm">
              {label}
            </Badge>
          ))}
        </span>
      )}
      {row(5, f.reminder, <span className="text-foreground">{v.reminder}</span>)}
      <p className="absolute start-[18px] flex h-6 items-center text-sm text-muted-foreground" style={{ top: "calc(var(--mahaam-assignee) + 6px)" }}>
        {copy.assignee}
      </p>
      <div
        className={cn(
          "absolute end-[18px] flex h-8 items-center gap-2 rounded-lg border bg-card px-2 text-sm transition-colors duration-300 motion-reduce:transition-none start-[82px]",
          `[@container(min-width:48rem)]:start-[94px]`,
          open ? "border-foreground" : "border-border"
        )}
        style={{ top: "var(--mahaam-assignee)" }}
      >
        {assigned ? (
          <>
            <Avatar variant="image" size="24" radius="rounded" src={avatars.khalid} name="" />
            <span className="font-medium text-foreground">{copy.people[0]}</span>
          </>
        ) : (
          <>
            <span aria-hidden="true" className="size-6 rounded-full border border-dashed border-border" />
            <span className="text-muted-foreground">{copy.unassigned}</span>
          </>
        )}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "absolute end-[18px] z-[4] rounded-[10px] border border-border bg-card p-1 text-sm shadow-[0_20px_40px_-16px_color-mix(in_srgb,var(--foreground)_30%,transparent)] transition-[opacity,transform] duration-[250ms] motion-reduce:transition-none start-[82px]",
          `[@container(min-width:48rem)]:start-[94px]`,
          open ? "opacity-100" : "pointer-events-none -translate-y-1.5 opacity-0"
        )}
        style={{ top: "calc(var(--mahaam-assignee) + 38px)" }}
      >
        {[avatars.khalid, avatars.noura, avatars.faisal].map((src, index) => (
          <div key={index} className={cn("flex h-8 items-center gap-2 rounded-md px-2", index === 0 && frame >= 28 && open && "bg-muted")}>
            <Avatar variant="image" size="24" radius="rounded" src={src} name="" />
            {copy.people[index]}
          </div>
        ))}
      </div>
      <div className="absolute start-[18px] end-[18px] h-px bg-border" style={{ top: "calc(var(--mahaam-assignee) + 54px)" }} />
      <p
        className={cn("absolute start-[18px] text-xs text-muted-foreground transition-[opacity,transform] duration-[600ms] motion-reduce:transition-none", assigned ? "opacity-100" : "translate-y-2.5 opacity-0")}
        style={{ top: "calc(var(--mahaam-assignee) + 66px)" }}
      >
        {copy.log}
      </p>
      <div
        className={cn(
          "absolute inset-x-0 mx-auto flex h-10 w-[220px] items-center gap-2 rounded-[14px] bg-background-inverse px-3 py-2 text-foreground-inverse shadow-[0_24px_40px_-18px_color-mix(in_srgb,var(--foreground)_40%,transparent)] transition-[opacity,transform] duration-500 motion-reduce:transition-none",
          toast ? "opacity-100" : "translate-y-4 opacity-0"
        )}
        style={{ top: "var(--mahaam-toast)" }}
      >
        <Avatar variant="image" size="24" radius="rounded" src={avatars.khalid} name="" />
        <span className="text-xs font-medium">{copy.toast}</span>
      </div>
      <svg
        aria-hidden="true"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={cn("pointer-events-none absolute left-[-4px] top-[-3px] z-[6] overflow-visible transition-transform duration-700 ease-[cubic-bezier(.45,0,.2,1)] motion-reduce:transition-none", CURSOR[cursor], press && "scale-[.82]")}
      >
        <path d="M4 3l15 7.5-6.5 1.8L10 19z" className="fill-foreground stroke-background" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function Recap({ copy, avatars, frame }: { copy: MahaamFeaturesCopy["recap"]; avatars: Avatars; frame: number }) {
  const typed = copy.summary.slice(0, Math.max(0, Math.min(copy.summary.length, (frame - 4) * 3)))
  const at = [56, 62, 68]
  const sent = frame >= 92 && frame < 126
  const pulse = frame >= 76 && frame < 92
  const faces = [avatars.khalid, avatars.noura, avatars.faisal]
  return (
    <div className={cn("flex w-[256px] flex-col gap-1.5 overflow-hidden rounded-[14px] border border-border bg-card p-4", WINDOW_SHADOW, `[@container(min-width:48rem)]:w-[316px]`)}>
      <div className="flex min-h-6 items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{copy.ready}</span>
        <span className="flex shrink-0 [&>*+*]:-ms-2">
          {[avatars.noura, avatars.khalid, avatars.faisal].map((src, index) => (
            <Avatar key={index} variant="image" size="24" radius="rounded" border src={src} name="" />
          ))}
        </span>
      </div>
      <p className="text-xl font-medium text-foreground">{copy.meeting}</p>
      <p className="relative min-h-12 text-xs text-foreground [@container(min-width:48rem)]:min-h-8">
        <span className="opacity-0">{copy.summary}</span>
        <span aria-hidden="true" className="absolute inset-0">
          {typed}
        </span>
      </p>
      <p className={cn("text-xs font-medium text-muted-foreground transition-opacity duration-500 motion-reduce:transition-none", frame >= 52 && frame < 126 ? "opacity-100" : "opacity-0")}>{copy.actionItems}</p>
      {copy.items.map((item, index) => (
        <div
          key={item.text}
          className={cn(
            "flex items-center gap-2 py-1 transition-[opacity,transform] duration-[600ms] motion-reduce:transition-none",
            frame >= (at[index] ?? 0) && frame < 126 ? "opacity-100" : "translate-y-2.5 opacity-0"
          )}
        >
          <Avatar variant="image" size="24" radius="rounded" src={faces[index]} name="" />
          <span className="min-w-0 flex-1 text-xs text-foreground">{item.text}</span>
          <Badge variant="soft" tone="secondary" size="sm">
            {item.due}
          </Badge>
        </div>
      ))}
      <div className="flex justify-end">
        <span
          className={cn(
            "inline-flex items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-500 motion-reduce:transition-none",
            sent ? "bg-card bg-gradient-to-r from-soft-success to-soft-success text-success" : "bg-primary text-primary-foreground",
            pulse && "ring-4 ring-ring/30"
          )}
        >
          {sent ? copy.sent : copy.send}
        </span>
      </div>
    </div>
  )
}

export function MahaamFeatures({
  locale = "en",
  heading,
  subheading,
  languages,
  handoff,
  recap,
  avatars = {},
  flags = {},
  paused: pausedProp,
  defaultPaused,
  still,
  onPausedChange,
  pauseLabels,
  progress,
  reducedMotion,
  className,
  ...props
}: MahaamFeaturesProps) {
  const copy = COPY[locale]
  const rootRef = React.useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion(reducedMotion)
  const inView = useInView(rootRef)
  const visible = usePageVisible()
  const { paused, toggle } = usePausedState({ paused: pausedProp, defaultPaused, onPausedChange })
  const frozen = paused || Boolean(still)
  const [hovered, setHovered] = React.useState<null | "languages" | "handoff" | "recap">(null)
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => setReady(true), [])
  const running = !frozen && !reduced && inView && visible

  const start = (frames: number, still: number) => (progress !== undefined ? Math.floor(progress * frames) : frozen ? still : 0)
  const langClock = useLoopClock({ length: LANG_FRAMES * 10, intervalMs: FRAME_MS, active: running && hovered !== "languages", from: start(LANG_FRAMES * 10, STILL.lang) })
  const handoffClock = useLoopClock({ length: 100, intervalMs: FRAME_MS, active: running && hovered !== "handoff", from: start(100, STILL.handoff) })
  const recapClock = useLoopClock({ length: 130, intervalMs: FRAME_MS, active: running && hovered !== "recap", from: start(130, STILL.recap) })
  // The server and the first render draw Figma's still frames; once mounted the clocks take over.
  const live = ready && !reduced
  const stillOr = (value: number, still: number) => (live ? value : progress !== undefined && !reduced ? value : still)
  const langFrame = stillOr(langClock, STILL.lang)
  const handoffFrame = stillOr(handoffClock, STILL.handoff)
  const recapFrame = stillOr(recapClock, STILL.recap)

  const l = { ...copy.languages, ...languages }
  const h = { ...copy.handoff, ...handoff }
  const r = { ...copy.recap, ...recap }

  return (
    <section ref={rootRef} className={cn("relative [container-type:inline-size]", className)} {...props}>
      <div
        className={cn(
          "mx-auto flex max-w-[1440px] flex-col gap-8 px-8 pb-24 pt-28",
          `[@container(min-width:48rem)]:gap-10 [@container(min-width:48rem)]:px-16 [@container(min-width:48rem)]:pb-36 [@container(min-width:48rem)]:pt-40`,
          `[@container(min-width:90rem)]:gap-14 [@container(min-width:90rem)]:px-28 [@container(min-width:90rem)]:pb-40 [@container(min-width:90rem)]:pt-52`
        )}
      >
        <div className={cn("flex flex-col gap-4", `[@container(min-width:90rem)]:flex-row [@container(min-width:90rem)]:items-end [@container(min-width:90rem)]:justify-between [@container(min-width:90rem)]:gap-8`)}>
          <h2 className={cn("text-3xl font-normal text-foreground", `[@container(min-width:48rem)]:text-5xl [@container(min-width:90rem)]:text-6xl`)}>{heading ?? copy.heading}</h2>
          <p className={cn("text-base text-muted-foreground", `[@container(min-width:48rem)]:text-lg [@container(min-width:90rem)]:max-w-[380px]`)}>{subheading ?? copy.subheading}</p>
        </div>
        <div className={cn("flex flex-col gap-4", `[@container(min-width:48rem)]:gap-5 [@container(min-width:90rem)]:flex-row`)}>
          <Card
            tint="from-soft-info to-soft-info"
            stageClassName="h-[366px] [&:where(:dir(rtl))]:h-[378px]"
            hovered={hovered === "languages"}
            onHover={(on) => setHovered(on ? "languages" : null)}
            label={l.label}
            title={l.title}
            body={l.body}
          >
            <Languages copy={l} flags={flags} frame={langFrame} />
          </Card>
          <Card
            tint="from-soft-warning to-soft-warning"
            stageClassName="h-[438px] items-start pt-2 [@container(min-width:48rem)]:items-center [@container(min-width:48rem)]:pt-0"
            hovered={hovered === "handoff"}
            onHover={(on) => setHovered(on ? "handoff" : null)}
            label={h.label}
            title={h.title}
            body={h.body}
          >
            <Handoff copy={h} avatars={avatars} frame={handoffFrame} />
          </Card>
          <Card
            tint="from-soft-success to-soft-success"
            stageClassName="h-[352px] [&:where(:dir(rtl))]:h-[360px]"
            hovered={hovered === "recap"}
            onHover={(on) => setHovered(on ? "recap" : null)}
            label={r.label}
            title={r.title}
            body={r.body}
          >
            <Recap copy={r} avatars={avatars} frame={recapFrame} />
          </Card>
        </div>
      </div>
      {reduced ? null : (
        <MahaamPauseButton
          paused={paused}
          locale={locale}
          labels={pauseLabels}
          onClick={toggle}
          className="absolute end-8 top-16 z-10 [@container(min-width:48rem)]:end-16 [@container(min-width:48rem)]:top-[112px] [@container(min-width:90rem)]:end-28 [@container(min-width:90rem)]:top-40"
        />
      )}
    </section>
  )
}

/** The default copy, English and Arabic, as `locale` picks it. Spread it to change a few strings and keep the rest. */
export const mahaamFeaturesCopy = COPY
