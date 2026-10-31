"use client"

import * as React from "react"
import { ChartLine, Database, FolderOpen } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { FeaturesRule, FeaturesSection, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Numbered Steps + Floating Cards.
 *
 * A header (a 12px eyebrow, a two-tone heading in `foreground` and
 * `muted-foreground`, and a 16px line), then the steps beside a visual. The
 * steps are three rows divided by hairlines; a row is a 24px number and a 24px
 * title, and the open one adds a soft destructive "Without it" Badge and a
 * line. The visual is a 608 × 480 blurred photo under a half-strength
 * `background-inverse` scrim, with a numbered tag, a pill holding an
 * Avatar and the question, a connector, and two `card` file cards.
 *
 * Pressing a row opens it (closing the open one) and crossfades the visual to
 * that step's question and files in 200ms (at once under reduced motion);
 * nothing moves by itself. Figma draws only step 02 open, so steps 01 and 03
 * have details and files written for the code. File names stay Latin in Arabic.
 *
 * Desktop sets the steps (640px) beside the visual. Tablet and Mobile put the
 * visual under the steps.
 *
 * Content limits: a step's title up to 28 characters, its detail up to 50,
 * the question up to 48. The other limits are in the block's documentation page.
 */

export interface FeaturesStepFile {
  /** The file's name, which stays Latin. */
  name: string
  /** The line under it, such as "3 touchpoints". */
  meta: string
  /** `chart` and `database` set the mark; the tile's tint follows. */
  kind: "chart" | "database"
}

export interface FeaturesNumberedStep {
  /** Keys the step. */
  id: string
  /** The number, such as "01". */
  number: string
  /** The step's title. */
  title: React.ReactNode
  /** The badge on the open step, such as "Without it". */
  badge: string
  /** The line under the badge. */
  detail: React.ReactNode
  /** The question on the visual while this step is open. */
  question: string
  /** The two file cards on the visual while this step is open. */
  files: [FeaturesStepFile, FeaturesStepFile]
}

export interface FeaturesNumberedStepsFloatingCardsCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The heading's first part, in `foreground`. An `h2` with the rest. */
  heading: React.ReactNode
  /** The heading's second part, in `muted-foreground`. */
  headingMuted: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The steps, in order. */
  steps: FeaturesNumberedStep[]
}

/** Figma's copy, English and Arabic. Step 02's open state is Figma's; the other two are written for the code. */
const COPY: Record<FeaturesLocale, FeaturesNumberedStepsFloatingCardsCopy> = {
  en: {
    eyebrow: "WHAT A GOOD ANSWER NEEDS",
    heading: "Three things have to be in place",
    headingMuted: "before a question can be answered well.",
    description: "Give the model two of the three and it will not stop to ask for the third. It fills the gap and answers anyway, in the same tone it uses when it is right.",
    steps: [
      {
        id: "true",
        number: "01",
        title: "What is true today",
        badge: "Without it",
        detail: "A confident answer about last quarter, not this one.",
        question: "Where does the pipeline stand this week?",
        files: [
          { name: "/pipeline/q3-forecast.md", meta: "updated just now", kind: "chart" },
          { name: "/crm/open-deals.table", meta: "v208 · 2 min ago", kind: "database" },
        ],
      },
      {
        id: "done",
        number: "02",
        title: "How the work is done",
        badge: "Without it",
        detail: "A plausible answer, not your process.",
        question: "Should we shift more budget behind this?",
        files: [
          { name: "/playbooks/handoff-checklist.md", meta: "3 touchpoints", kind: "chart" },
          { name: "/campaigns/regional-rollup.table", meta: "v112 · 4 min ago", kind: "database" },
        ],
      },
      {
        id: "decided",
        number: "03",
        title: "Why it was decided",
        badge: "Without it",
        detail: "A conclusion with no reasoning behind it.",
        question: "Why did we change the pricing last quarter?",
        files: [
          { name: "/decisions/pricing-change.md", meta: "signed off 12 Mar", kind: "chart" },
          { name: "/meetings/q3-review.notes", meta: "v31 · 1 week ago", kind: "database" },
        ],
      },
    ],
  },
  ar: {
    eyebrow: "ما تحتاجه الإجابة الجيدة",
    heading: "ثلاثة أمور يجب أن تتوافر",
    headingMuted: "قبل أن يُجاب عن السؤال إجابة جيدة.",
    description: "أعطِ النموذج اثنين من الثلاثة ولن يتوقف ليسأل عن الثالث. سيملأ الفراغ ويجيب على أي حال، بالنبرة نفسها التي يستخدمها حين يكون محقًا.",
    steps: [
      {
        id: "true",
        number: "01",
        title: "ما هو صحيح اليوم",
        badge: "بدونه",
        detail: "إجابة واثقة عن الربع الماضي لا عن هذا الربع.",
        question: "أين وصل خط المبيعات هذا الأسبوع؟",
        files: [
          { name: "/pipeline/q3-forecast.md", meta: "حُدّث الآن", kind: "chart" },
          { name: "/crm/open-deals.table", meta: "v208، قبل دقيقتين", kind: "database" },
        ],
      },
      {
        id: "done",
        number: "02",
        title: "كيف يُنجَز العمل",
        badge: "بدونه",
        detail: "إجابة معقولة، لا عمليتك الفعلية.",
        question: "هل ننقل ميزانية أكبر لدعم هذا؟",
        files: [
          { name: "/playbooks/handoff-checklist.md", meta: "3 نقاط تواصل", kind: "chart" },
          { name: "/campaigns/regional-rollup.table", meta: "v112، قبل 4 دقائق", kind: "database" },
        ],
      },
      {
        id: "decided",
        number: "03",
        title: "لماذا اتُّخذ القرار",
        badge: "بدونه",
        detail: "خلاصة لا تسندها أي أسباب.",
        question: "لماذا غيّرنا التسعير في الربع الماضي؟",
        files: [
          { name: "/decisions/pricing-change.md", meta: "اعتُمد في 12 مارس", kind: "chart" },
          { name: "/meetings/q3-review.notes", meta: "v31، قبل أسبوع", kind: "database" },
        ],
      },
    ],
  },
}

export interface FeaturesNumberedStepsFloatingCardsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "defaultValue">, Partial<FeaturesNumberedStepsFloatingCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** The photo behind the visual, shown blurred. A `muted` placeholder shows without it. */
  photo?: FeaturesPhoto
  /** The photo in the question pill's Avatar. The Avatar's icon shows without it. */
  avatar?: FeaturesPhoto
  /** The `id` of the open step, when you control it. */
  value?: string
  /** The `id` of the step open first, when you do not. The second by default, as Figma draws it. */
  defaultValue?: string
  /** Called with the step's `id` when the visitor opens another. */
  onValueChange?: (value: string) => void
}

export function FeaturesNumberedStepsFloatingCards({
  locale = "en",
  eyebrow,
  heading,
  headingMuted,
  description,
  steps,
  photo,
  avatar,
  value,
  defaultValue,
  onValueChange,
  className,
  ...props
}: FeaturesNumberedStepsFloatingCardsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = steps ?? copy.steps
  const [inner, setInner] = React.useState(defaultValue ?? list[Math.min(1, list.length - 1)]?.id)
  const openId = value ?? inner
  const baseId = React.useId()
  const choose = (id: string) => {
    if (id === openId) return
    if (value === undefined) setInner(id)
    onValueChange?.(id)
  }

  return (
    <FeaturesSection labelledBy={headingId} gap="md" className={className} {...props}>
      <header className="flex flex-col items-start gap-4">
        {(eyebrow ?? copy.eyebrow) ? <p className="text-xs font-medium tracking-wide text-muted-foreground rtl:tracking-normal">{eyebrow ?? copy.eyebrow}</p> : null}
        <h2 id={headingId} className="max-w-[760px] text-2xl font-semibold text-foreground [@container(min-width:48rem)]:text-3xl [@container(min-width:72rem)]:text-4xl">
          {heading ?? copy.heading} <span className="text-muted-foreground">{headingMuted ?? copy.headingMuted}</span>
        </h2>
        <p className="max-w-[620px] text-base text-muted-foreground">{description ?? copy.description}</p>
      </header>

      {list.length > 0 ? (
        <div className="flex flex-col gap-6 [@container(min-width:48rem)]:gap-8 [@container(min-width:72rem)]:flex-row [@container(min-width:72rem)]:gap-0">
          <div className="flex min-w-0 flex-col [@container(min-width:72rem)]:w-[640px] [@container(min-width:72rem)]:shrink-0">
            <FeaturesRule />
            {list.map((step) => {
              const open = step.id === openId
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col gap-4 py-5">
                    <h3 className="text-xl font-medium [@container(min-width:48rem)]:text-2xl">
                      <button
                        type="button"
                        id={`${baseId}-${step.id}-trigger`}
                        aria-expanded={open}
                        aria-controls={`${baseId}-${step.id}-panel`}
                        onClick={() => choose(step.id)}
                        className={cn(
                          "flex w-full items-baseline gap-4 rounded-sm text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          open ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span className="w-8 shrink-0 text-base font-normal [@container(min-width:48rem)]:text-xl">{step.number}</span>
                        <span>{step.title}</span>
                      </button>
                    </h3>
                    <div
                      id={`${baseId}-${step.id}-panel`}
                      role="region"
                      aria-labelledby={`${baseId}-${step.id}-trigger`}
                      hidden={!open}
                      className={cn("flex-wrap items-center gap-3 ps-12 text-base text-foreground", open ? "flex" : "hidden")}
                    >
                      <Badge variant="soft" tone="destructive" size="sm" radius="standard">
                        {step.badge}
                      </Badge>
                      <span>{step.detail}</span>
                    </div>
                  </div>
                  <FeaturesRule />
                </React.Fragment>
              )
            })}
          </div>

          <div className="relative isolate flex min-h-[400px] min-w-0 flex-1 items-center justify-center overflow-hidden bg-background-inverse p-4 [@container(min-width:48rem)]:min-h-[440px] [@container(min-width:72rem)]:min-h-[480px]">
            {photo ? <img src={photo.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 -z-20 size-full scale-110 object-cover blur-md" /> : null}
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-background-inverse/50" />
            <p className="absolute start-4 top-4 rounded-sm border border-foreground-inverse px-1 text-xs leading-4 text-foreground-inverse">
              {list.find((step) => step.id === openId)?.number}
            </p>
            <div className="grid w-full max-w-[440px] justify-items-center">
              {list.map((step) => (
                <div
                  key={step.id}
                  aria-hidden={step.id === openId ? undefined : true}
                  className={cn(
                    "col-start-1 row-start-1 flex w-full flex-col items-center motion-safe:transition-opacity motion-safe:duration-200",
                    step.id === openId ? "opacity-100" : "pointer-events-none opacity-0"
                  )}
                >
                  <div className="flex max-w-full items-center gap-2 rounded-full border border-foreground-inverse bg-background-inverse/20 p-1 pe-4 text-sm text-foreground-inverse">
                    <Avatar variant={avatar ? "image" : "icon"} src={avatar?.src} size="32" radius="rounded" />
                    <span className="min-w-0">{step.question}</span>
                  </div>
                  <span aria-hidden="true" className="h-7 w-px bg-foreground-inverse" />
                  <ul role="list" className="flex w-full flex-col">
                    {step.files.map((file) => {
                      const Icon = file.kind === "chart" ? ChartLine : Database
                      return (
                        <li key={file.name} className="flex items-center gap-3 bg-card px-0 text-card-foreground first:border-b first:border-border">
                          <span className={cn("flex size-[3.5rem] shrink-0 items-center justify-center", file.kind === "chart" ? "bg-success/30" : "bg-info/30")}>
                            <Icon size={18} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
                          </span>
                          <span className="flex min-w-0 flex-col py-2 pe-3">
                            <span className="truncate text-xs font-medium" dir="ltr">
                              {file.name}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <FolderOpen size={12} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
                              {file.meta}
                            </span>
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresNumberedStepsFloatingCardsCopy = COPY
