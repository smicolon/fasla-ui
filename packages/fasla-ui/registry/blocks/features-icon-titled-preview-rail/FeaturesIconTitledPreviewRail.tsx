"use client"

import * as React from "react"
import { ChartBar, Clock, CreditCard, Mail, Mic, Phone, Receipt, Share, Sparkles, User, Users, Wallet, NotebookText } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { Skeleton, SkeletonText } from "../../ui/skeleton/skeleton"
import { FeaturesSection, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Icon-Titled Preview Rail.
 *
 * A header (an eyebrow and a 48px heading, 820px wide) over a rail of five
 * items, each a title led by a 36px tinted mark, a 330 × 300 wash holding a
 * mock-up of one part of the product, and a caption whose first words are
 * heavier. The washes are `info`, `success`, `warning`, `success` and `info`
 * at 20%. The mock-ups use the Badge, Avatar and Skeleton atoms: a message
 * with a Scheduled badge, a meeting note, a contact card, three packages and a
 * weekly summary.
 *
 * The rail scrolls sideways and snaps item by item: swipe it, drag it with a
 * mouse, or focus it and use the arrow keys. An item lifts 2px on hover.
 * Items are 330px wide on Desktop, 300px on Tablet and 272px on Mobile.
 *
 * Content limits: an item's title up to 14 characters and its caption up to
 * 80. The other limits are in the block's documentation page.
 */

export interface FeaturesRailItem {
  /** Keys the item, and picks its mock-up. */
  id: "assistant" | "notes" | "contacts" | "payments" | "insights"
  /** The item's title. */
  title: string
  /** The caption's heavier opening. */
  lead: string
  /** The rest of the caption. */
  rest: string
}

export interface FeaturesIconTitledPreviewRailCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The items, in order. */
  items: FeaturesRailItem[]
  /** Names the scrolling rail for assistive technology. */
  railLabel: string
  assistant: { message: string; badge: string }
  notes: { record: string; title: string; recap: string }
  contacts: { name: string; role: string; last: string; follow: string }
  payments: { collect: string; packages: { name: string; detail: string }[] }
  insights: { title: string }
}

const MARKS = { assistant: Sparkles, notes: NotebookText, contacts: Users, payments: Wallet, insights: ChartBar } as const
const TINTS = { assistant: "info", notes: "success", contacts: "warning", payments: "success", insights: "info" } as const
const WASH = { info: "bg-info/20", success: "bg-success/20", warning: "bg-warning/20" } as const
const MARK_TEXT = { info: "text-info", success: "text-success", warning: "text-warning" } as const
const TILE = { info: "bg-info/30", success: "bg-success/30", warning: "bg-warning/30" } as const

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesIconTitledPreviewRailCopy> = {
  en: {
    eyebrow: "THE PLATFORM",
    heading: "There is more to the work than the meeting itself",
    railLabel: "Parts of the platform",
    items: [
      { id: "assistant", title: "Assistant", lead: "An assistant", rest: " that works right from your inbox." },
      { id: "notes", title: "Notes", lead: "A meeting notetaker", rest: " that turns every call into a recap with clear next steps." },
      { id: "contacts", title: "Contacts", lead: "Contact tools", rest: " that bring all the details you need into one place." },
      { id: "payments", title: "Payments", lead: "Built-in payments", rest: " that make it easy to sell services and get paid." },
      { id: "insights", title: "Insights", lead: "Shared reports", rest: " that show where the time went each week." },
    ],
    assistant: { message: "Sounds great! Can you set up a meeting with Dana for next week?", badge: "Scheduled by assistant" },
    notes: { record: "Record meeting", title: "Q2 hiring review", recap: "Recap" },
    contacts: { name: "Morgan Levine", role: "Consultant", last: "Last spoken to 1 week ago", follow: "Follow up" },
    payments: {
      collect: "Collect payment",
      packages: [
        { name: "Strategy Session Package", detail: "10 sessions · $950.00" },
        { name: "Workshop Day Package", detail: "5 sessions · $350.00" },
        { name: "Review Retainer Package", detail: "3 months · $600.00" },
      ],
    },
    insights: { title: "Weekly summary" },
  },
  ar: {
    eyebrow: "المنصة",
    heading: "في العمل أكثر من الاجتماع نفسه",
    railLabel: "أجزاء المنصة",
    items: [
      { id: "assistant", title: "المساعد", lead: "مساعد", rest: " يعمل مباشرة من بريدك الوارد." },
      { id: "notes", title: "الملاحظات", lead: "مدوّن اجتماعات", rest: " يحوّل كل مكالمة إلى خلاصة بخطوات تالية واضحة." },
      { id: "contacts", title: "جهات الاتصال", lead: "أدوات جهات الاتصال", rest: " تجمع كل ما تحتاجه من تفاصيل في مكان واحد." },
      { id: "payments", title: "المدفوعات", lead: "مدفوعات مدمجة", rest: " تسهّل بيع الخدمات والحصول على أجرها." },
      { id: "insights", title: "الرؤى", lead: "تقارير مشتركة", rest: " تُظهر أين ذهب الوقت كل أسبوع." },
    ],
    assistant: { message: "رائع! هل يمكنك ترتيب اجتماع مع منى الأسبوع القادم؟", badge: "جدولها المساعد" },
    notes: { record: "تسجيل الاجتماع", title: "مراجعة التوظيف للربع الثاني", recap: "الخلاصة" },
    contacts: { name: "ليلى حداد", role: "مستشارة", last: "آخر تواصل قبل أسبوع", follow: "متابعة" },
    payments: {
      collect: "تحصيل دفعة",
      packages: [
        { name: "باقة جلسات الاستراتيجية", detail: "10 جلسات، $950.00" },
        { name: "باقة يوم ورشة العمل", detail: "5 جلسات، $350.00" },
        { name: "باقة المراجعة الشهرية", detail: "3 أشهر، $600.00" },
      ],
    },
    insights: { title: "الملخص الأسبوعي" },
  },
}

export interface FeaturesIconTitledPreviewRailProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesIconTitledPreviewRailCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** The contact's photo in the Contacts mock-up. The Avatar's icon shows without it. */
  contactPhoto?: FeaturesPhoto
}

/** How far an arrow key moves the rail: an item and the 32px beside it. */
const STEP = 362

export function FeaturesIconTitledPreviewRail({
  locale = "en",
  eyebrow,
  heading,
  items,
  railLabel,
  assistant,
  notes,
  contacts,
  payments,
  insights,
  contactPhoto,
  className,
  ...props
}: FeaturesIconTitledPreviewRailProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items
  const a = assistant ?? copy.assistant
  const n = notes ?? copy.notes
  const c = contacts ?? copy.contacts
  const p = payments ?? copy.payments
  const i = insights ?? copy.insights
  const rail = React.useRef<HTMLUListElement>(null)
  const drag = React.useRef<{ x: number; left: number } | null>(null)
  const [dragging, setDragging] = React.useState(false)
  const stop = () => {
    drag.current = null
    setDragging(false)
  }
  const scrollBySteps = (steps: number) => {
    const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    rail.current?.scrollBy({ left: steps * STEP, behavior: reduced ? "auto" : "smooth" })
  }

  const preview = (id: FeaturesRailItem["id"]) => {
    const card = "flex w-full flex-col gap-3 rounded-[14px] bg-card p-4 text-foreground"
    if (id === "assistant")
      return (
        <>
          <div className={card}>
            <p className="text-sm">{a.message}</p>
          </div>
          <Badge variant="soft" tone="success" size="lg" radius="standard">
            {a.badge}
          </Badge>
        </>
      )
    if (id === "notes")
      return (
        <>
          <Badge variant="solid" tone="info" size="lg" radius="standard" icon={<Mic strokeWidth={1.5} />}>
            {n.record}
          </Badge>
          <div className={card}>
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">{n.title}</span>
              <Share size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="shrink-0 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">{n.recap}</p>
            <SkeletonText />
          </div>
        </>
      )
    if (id === "contacts")
      return (
        <>
          <div className={card}>
            <div className="flex items-center gap-3">
              <Avatar variant={contactPhoto ? "image" : "icon"} src={contactPhoto?.src} size="32" radius="rounded" />
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-semibold">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.role}</span>
              </div>
            </div>
            {[Mail, Phone, Clock].map((Icon, index) => (
              <div key={index} className="flex h-6 items-center gap-2" aria-hidden="true">
                <Icon size={14} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0 text-muted-foreground" />
                <div className="flex h-6 w-[126px] flex-col items-center justify-center gap-[9.6px]">
                  <Skeleton className="h-2.5 w-full rounded-[2.4px]" />
                  <Skeleton className="h-2.5 w-full rounded-[2.4px]" />
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">{c.last}</p>
          </div>
          <Badge variant="solid" tone="warning" size="lg" radius="standard" icon={<User strokeWidth={1.5} />}>
            {c.follow}
          </Badge>
        </>
      )
    if (id === "payments")
      return (
        <>
          <Badge variant="solid" tone="success" size="lg" radius="standard" icon={<CreditCard strokeWidth={1.5} />}>
            {p.collect}
          </Badge>
          <ul role="list" className="flex w-full flex-col gap-3">
            {p.packages.map((pkg, index) => (
              <li key={pkg.name} className={cn(card, "flex-row items-center p-3", index === 1 && "opacity-80", index === 2 && "opacity-40")}>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-soft-neutral">
                  <Receipt size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="text-muted-foreground" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-medium">{pkg.name}</span>
                  <span className="text-xs text-muted-foreground">
                    <bdi dir="ltr">{pkg.detail}</bdi>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )
    return (
      <div className={card}>
        <p className="text-sm font-medium">{i.title}</p>
        <SkeletonText />
      </div>
    )
  }

  return (
    <FeaturesSection labelledBy={headingId} gap="md" contentClassName="[@container(min-width:48rem)]:gap-12" className={className} {...props}>
      <header className="mx-auto flex w-full max-w-[820px] min-w-0 flex-col items-center gap-4 text-center">
        <p className="text-xs font-medium text-foreground">{eyebrow ?? copy.eyebrow}</p>
        <h2 id={headingId} className="text-3xl font-medium text-foreground ltr:leading-10 [@container(min-width:48rem)]:ltr:leading-[2.75rem] [@container(min-width:72rem)]:text-5xl [@container(min-width:72rem)]:ltr:leading-[3.625rem] [@container(min-width:48rem)]:rtl:leading-[3.75rem] [@container(min-width:72rem)]:rtl:leading-[4.5rem]">
          {heading ?? copy.heading}
        </h2>
      </header>
      {list.length > 0 ? (
        <ul
          ref={rail}
          role="list"
          tabIndex={0}
          aria-label={railLabel ?? copy.railLabel}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault()
              scrollBySteps(1)
            } else if (event.key === "ArrowLeft") {
              event.preventDefault()
              scrollBySteps(-1)
            }
          }}
          onPointerDown={(event) => {
            if (event.pointerType !== "mouse" || !rail.current) return
            drag.current = { x: event.clientX, left: rail.current.scrollLeft }
            setDragging(true)
            rail.current.setPointerCapture(event.pointerId)
          }}
          onPointerMove={(event) => {
            if (!drag.current || !rail.current) return
            rail.current.scrollLeft = drag.current.left - (event.clientX - drag.current.x)
          }}
          onPointerUp={stop}
          onPointerCancel={stop}
          onLostPointerCapture={stop}
          className={cn(
            "-mx-8 flex scroll-px-8 gap-5 overflow-x-auto overscroll-x-contain px-8 pb-2 pt-1 -mb-2 -mt-1 [scrollbar-width:none] [touch-action:pan-x_pan-y] [&::-webkit-scrollbar]:hidden [@container(min-width:48rem)]:-mx-16 [@container(min-width:48rem)]:scroll-px-16 [@container(min-width:48rem)]:gap-6 [@container(min-width:48rem)]:px-16 [@container(min-width:72rem)]:-mx-24 [@container(min-width:72rem)]:scroll-px-24 [@container(min-width:72rem)]:gap-8 [@container(min-width:72rem)]:px-24",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            dragging ? "cursor-grabbing select-none" : "cursor-grab snap-x snap-mandatory"
          )}
        >
          {list.map((item) => {
            const Icon = MARKS[item.id]
            const tint = TINTS[item.id]
            return (
              <li
                key={item.id}
                className="flex w-[272px] shrink-0 snap-start flex-col gap-6 motion-safe:transition-transform motion-safe:duration-200 hover:motion-safe:-translate-y-0.5 [@container(min-width:48rem)]:w-[300px] [@container(min-width:72rem)]:w-[330px]"
              >
                <h3 className="flex items-center gap-3 text-xl font-medium text-foreground">
                  <span className={cn("flex size-9 items-center justify-center rounded-[10px]", TILE[tint])}>
                    <Icon size={18} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className={MARK_TEXT[tint]} />
                  </span>
                  {item.title}
                </h3>
                <div className={cn("flex h-[330px] flex-col items-center justify-center gap-3 rounded-2xl p-6 [@container(min-width:48rem)]:h-[300px]", WASH[tint])}>{preview(item.id)}</div>
                <p className="text-base text-muted-foreground">
                  <span className="font-semibold text-foreground">{item.lead}</span>
                  {item.rest}
                </p>
              </li>
            )
          })}
        </ul>
      ) : null}
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresIconTitledPreviewRailCopy = COPY
