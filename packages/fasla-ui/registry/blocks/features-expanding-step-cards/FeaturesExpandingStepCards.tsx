"use client"

import * as React from "react"
import { CircleCheck, CreditCard, Hourglass, Mic, NotebookText, Send, Sparkles } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { Button, buttonVariants } from "../../ui/button/button"
import { Progress } from "../../ui/progress/progress"
import { SkeletonText } from "../../ui/skeleton/skeleton"
import { FeaturesSection, type FeaturesLocale } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Expanding Step Cards.
 *
 * On a `muted` section, a centred header (a 36px heading, a 16px line and a
 * solid Primary lg button) over four 24px-radius `card` cards, each a 30px
 * title, a 14px line and a mock-up of the product clipped at its bottom edge.
 * The first, Plan, is the featured card: wider (401px against 258px) and open,
 * with a list of three steps (28px tinted tiles joined by a 1px connector) and
 * a message from an assistant over an `info` wash. The other three show a
 * Briefing, a Recording (a Progress at 40%) and a Follow-up checklist on a
 * neutral wash, using the Badge, Avatar, Progress and Skeleton atoms.
 *
 * The first, Plan, has its message card flush with the bottom edge; the
 * three static cards centre their mock-up in a `soft-neutral` wash with
 * 16px top corners, and the
 * marks in the tiles take their tone's colour.
 *
 * Desktop sets the four across. Tablet gives Plan and Next steps a full row
 * and sets Ready and Record side by side. Mobile stacks all four. Plan stays
 * the featured card at every width; the others are static, and every card
 * only lifts 4px on hover. (Figma draws no expanded state for the other three,
 * so they do not take over from Plan.)
 *
 * Content limits: a card's title up to 14 characters and its line up to 90,
 * a step up to 36 characters. The other limits are in the block's documentation page.
 */

export interface FeaturesExpandingStep {
  /** Keys the step. */
  id: string
  /** The step's text. */
  label: React.ReactNode
  /** The tile's tint. */
  tone: "success" | "info" | "warning"
}

export interface FeaturesExpandingStepCardsCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The button's label. */
  cta: string
  plan: {
    title: React.ReactNode
    description: React.ReactNode
    steps: FeaturesExpandingStep[]
    /** The assistant's message, in the mock-up. */
    message: { sender: string; to: string; text: string; times: string[] }
  }
  ready: { title: React.ReactNode; description: React.ReactNode; label: string; badge: string; attendee: string }
  record: { title: React.ReactNode; description: React.ReactNode; label: string; badge: string; note: string }
  next: { title: React.ReactNode; description: React.ReactNode; label: string; badge: string; items: string[] }
}

const STEP_ICONS = [Sparkles, Hourglass, CreditCard]

const TILE_TONE = {
  success: "bg-soft-success-30",
  info: "bg-soft-info-30",
  warning: "bg-soft-warning-30",
} as const

/** The mark in a tile is painted in the tone's own colour, as Figma binds it. */
const ICON_TONE = {
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
} as const

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesExpandingStepCardsCopy> = {
  en: {
    heading: "Everything around the meeting, handled",
    description: "Meetings move work forward, but the work around them can slow you down. Fasla takes care of the tasks before, during and after, so you have more room for what matters.",
    cta: "Start for free",
    plan: {
      title: "Plan",
      description: "A client emails asking to meet. Share a booking link, or ask your assistant to find times that work for everyone.",
      steps: [
        { id: "reply", tone: "success", label: "Assistant replies with times to meet" },
        { id: "pick", tone: "info", label: "Client picks Tuesday at 2 p.m." },
        { id: "pay", tone: "warning", label: "Client pays a deposit upfront" },
      ],
      message: {
        sender: "Fasla Assistant",
        to: "to you, Dominic Mills",
        text: "Happy to set up a call for you with Dominic. Here are a few times you are both available.",
        times: ["10:00 AM", "2:30 PM", "3:00 PM"],
      },
    },
    ready: { title: "Ready", description: "Never walk into a meeting cold.", label: "Briefing", badge: "Ready", attendee: "Dominic Mills" },
    record: { title: "Record", description: "Focus on the conversation while notes take care of themselves.", label: "Recording", badge: "Live", note: "Notes are written as you talk." },
    next: { title: "Next steps", description: "Work keeps moving after the meeting ends.", label: "Follow-up", badge: "Sent", items: ["Recap shared", "Task assigned"] },
  },
  ar: {
    heading: "كل ما يحيط بالاجتماع، منجَز",
    description: "الاجتماعات تدفع العمل إلى الأمام، لكن العمل المحيط بها قد يبطئك. تتولى فاصلة المهام قبلها وأثناءها وبعدها، فيتسع وقتك لما يهم.",
    cta: "ابدأ مجانًا",
    plan: {
      title: "التخطيط",
      description: "يراسلك عميل طالبًا لقاءً. شارك رابط الحجز، أو اطلب من مساعدك إيجاد أوقات تناسب الجميع.",
      steps: [
        { id: "reply", tone: "success", label: "يردّ المساعد بأوقات مقترحة للقاء" },
        { id: "pick", tone: "info", label: "يختار العميل الثلاثاء الساعة 2 ظهرًا" },
        { id: "pay", tone: "warning", label: "يدفع العميل عربونًا مقدمًا" },
      ],
      message: {
        sender: "مساعد فاصلة",
        to: "إليك، محمد حسين",
        text: "يسعدني ترتيب مكالمة لك مع محمد. إليك بعض الأوقات المناسبة لكما.",
        times: ["10:00 ص", "2:30 م", "3:00 م"],
      },
    },
    ready: { title: "الاستعداد", description: "لا تدخل اجتماعًا دون استعداد.", label: "الإحاطة", badge: "جاهزة", attendee: "محمد حسين" },
    record: { title: "التسجيل", description: "ركّز على الحوار بينما تتكفّل الملاحظات بنفسها.", label: "جارٍ التسجيل", badge: "مباشرة", note: "تُكتب الملاحظات أثناء حديثك." },
    next: { title: "الخطوات التالية", description: "يستمر العمل بعد انتهاء الاجتماع.", label: "المتابعة", badge: "أُرسلت", items: ["شُوركت الخلاصة", "أُسندت المهمة"] },
  },
}

export interface FeaturesExpandingStepCardsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesExpandingStepCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** Where the header button goes. Without it, the button calls `onStart`. */
  startHref?: string
  /** Called when the header button is pressed and has no `startHref`. */
  onStart?: () => void
}

const CARD = "group flex flex-col gap-4 overflow-hidden rounded-3xl bg-card p-6 text-card-foreground motion-safe:transition-transform motion-safe:duration-200 hover:motion-safe:-translate-y-1 [@container(min-width:48rem)]:p-8 [@container(min-width:48rem)]:pb-0 pb-0"
const TITLE = "text-3xl font-medium text-foreground"
const BODY = "text-sm text-muted-foreground"

/** A small mock-up card sitting on a wash, as the three static cards show. */
function MockCard({ tone, icon: Icon, label, children }: { tone: keyof typeof TILE_TONE; icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl bg-card p-4 text-card-foreground">
      <div className="flex items-center gap-2">
        <span className={cn("flex size-7 items-center justify-center rounded-[10px]", TILE_TONE[tone])}>
          <Icon size={14} strokeWidth={1.5} aria-hidden className={ICON_TONE[tone]} />
        </span>
        <span className="text-sm font-semibold text-card-foreground">{label}</span>
      </div>
      {children}
    </div>
  )
}

export function FeaturesExpandingStepCards({ locale = "en", heading, description, cta, plan, ready, record, next, startHref, onStart, className, ...props }: FeaturesExpandingStepCardsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const planCopy = plan ?? copy.plan
  const readyCopy = ready ?? copy.ready
  const recordCopy = record ?? copy.record
  const nextCopy = next ?? copy.next
  const label = cta ?? copy.cta
  const attendee = readyCopy.attendee
  const buttonClass = "w-full [@container(min-width:48rem)]:w-auto"

  return (
    <FeaturesSection labelledBy={headingId} contentClassName="gap-10 [@container(min-width:48rem)]:gap-12" className={cn("bg-muted", className)} {...props}>
      <header className="mx-auto flex w-full max-w-[760px] flex-col items-center gap-5 text-center">
        <h2 id={headingId} className="max-w-[290px] text-3xl font-medium text-foreground [@container(min-width:48rem)]:max-w-none [@container(min-width:48rem)]:leading-[44px] [@container(min-width:48rem)]:rtl:leading-[60px] [@container(min-width:72rem)]:text-4xl">
          {heading ?? copy.heading}
        </h2>
        <p className="text-base text-muted-foreground [@container(min-width:72rem)]:max-w-[560px]">{description ?? copy.description}</p>
        {startHref ? (
          <a href={startHref} className={buttonVariants({ variant: "default", size: "lg", className: buttonClass })}>
            {label}
          </a>
        ) : (
          <Button type="button" variant="default" size="lg" onClick={onStart} className={buttonClass}>
            {label}
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 gap-6 [@container(min-width:48rem)]:grid-cols-2 [@container(min-width:72rem)]:grid-cols-[401fr_258fr_258fr_258fr]">
        <section aria-label={String(planCopy.title)} className={cn(CARD, "[@container(min-width:48rem)]:col-span-2 [@container(min-width:72rem)]:col-span-1 [@container(min-width:72rem)]:h-[560px]")}>
          <div className="flex flex-col gap-3">
            <h3 className={TITLE}>{planCopy.title}</h3>
            <p className={BODY}>{planCopy.description}</p>
          </div>
          <ol role="list" className="flex flex-col">
            {planCopy.steps.map((step, position) => {
              const Icon = STEP_ICONS[position % STEP_ICONS.length]!
              return (
                <li key={step.id} className="flex flex-col">
                  {position > 0 ? <span aria-hidden="true" className="ms-3.5 h-2.5 w-px bg-border" /> : null}
                  <div className="flex items-center gap-3">
                    <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-[10px]", TILE_TONE[step.tone])}>
                      <Icon size={14} strokeWidth={1.5} aria-hidden className={ICON_TONE[step.tone]} />
                    </span>
                    <span className={cn(BODY, "min-w-0")}>{step.label}</span>
                  </div>
                </li>
              )
            })}
          </ol>
          <div className="flex flex-col justify-end bg-soft-info-20 px-4 pt-4 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:pt-6 [@container(min-width:72rem)]:min-h-0 [@container(min-width:72rem)]:flex-1">
            <div className="flex flex-col gap-3 rounded-t-2xl bg-card p-4 text-card-foreground shadow-lg">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-soft-success-30">
                  <Sparkles size={20} strokeWidth={1.5} aria-hidden className="text-success" />
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="text-sm font-semibold text-card-foreground">{planCopy.message.sender}</span>
                  <span className="text-xs text-muted-foreground">{planCopy.message.to}</span>
                </div>
              </div>
              <p className="text-sm text-card-foreground">{planCopy.message.text}</p>
              <div className="flex flex-wrap gap-2 rounded-lg bg-soft-info p-2">
                {planCopy.message.times.map((time) => (
                  <Button key={time} type="button" variant="soft" size="xs" tabIndex={-1}>
                    <bdi dir="ltr">{time}</bdi>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section aria-label={String(readyCopy.title)} className={cn(CARD, "[@container(min-width:72rem)]:h-[560px]")}>
          <div className="flex flex-col gap-3">
            <h3 className={TITLE}>{readyCopy.title}</h3>
            <p className={BODY}>{readyCopy.description}</p>
          </div>
          <div className="flex flex-col justify-center rounded-t-[16px] bg-soft-neutral p-4 [@container(min-width:72rem)]:min-h-0 [@container(min-width:72rem)]:flex-1">
            <MockCard tone="info" icon={NotebookText} label={readyCopy.label}>
              <Badge variant="soft" tone="info" size="sm" radius="standard" className="self-start">
                {readyCopy.badge}
              </Badge>
              <div className="flex items-center gap-2">
                <Avatar variant="initials" name={attendee} size="24" radius="rounded" />
                <span className="text-xs text-card-foreground">{attendee}</span>
              </div>
              <SkeletonText lines={2} />
            </MockCard>
          </div>
        </section>

        <section aria-label={String(recordCopy.title)} className={cn(CARD, "[@container(min-width:72rem)]:h-[560px]")}>
          <div className="flex flex-col gap-3">
            <h3 className={TITLE}>{recordCopy.title}</h3>
            <p className={BODY}>{recordCopy.description}</p>
          </div>
          <div className="flex flex-col justify-center rounded-t-[16px] bg-soft-neutral p-4 [@container(min-width:72rem)]:min-h-0 [@container(min-width:72rem)]:flex-1">
            <MockCard tone="info" icon={Mic} label={recordCopy.label}>
              <Badge variant="soft" tone="info" size="sm" radius="standard" className="self-start">
                {recordCopy.badge}
              </Badge>
              <Progress value={40} size="md" showPercentage={false} aria-label={recordCopy.label} />
              <p className="text-xs text-muted-foreground">{recordCopy.note}</p>
            </MockCard>
          </div>
        </section>

        <section aria-label={String(nextCopy.title)} className={cn(CARD, "[@container(min-width:48rem)]:col-span-2 [@container(min-width:72rem)]:col-span-1 [@container(min-width:72rem)]:h-[560px]")}>
          <div className="flex flex-col gap-3">
            <h3 className={TITLE}>{nextCopy.title}</h3>
            <p className={BODY}>{nextCopy.description}</p>
          </div>
          <div className="flex flex-col justify-center rounded-t-[16px] bg-soft-neutral p-4 [@container(min-width:72rem)]:min-h-0 [@container(min-width:72rem)]:flex-1">
            <MockCard tone="success" icon={Send} label={nextCopy.label}>
              <Badge variant="soft" tone="success" size="sm" radius="standard" className="self-start">
                {nextCopy.badge}
              </Badge>
              <ul role="list" className="flex flex-col gap-2">
                {nextCopy.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-card-foreground">
                    <CircleCheck size={14} strokeWidth={1.5} aria-hidden className="shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </MockCard>
          </div>
        </section>
      </div>
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresExpandingStepCardsCopy = COPY
