"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Colour Stage Hero.
 *
 * A stage in `chart-3` under a faint grid of hairlines. Centred on it: a pill
 * link with a "New" badge, the headline, a paragraph, a light button and a
 * text link, then a row of brand wordmarks set as text. Product windows rise
 * from the foot of the stage: a projects list with status badges and an
 * assistant chat.
 *
 * Desktop sets the six wordmarks in one spread row and the two windows side
 * by side, both running past the stage's bottom edge, which crops them.
 * Tablet sets the wordmarks three to a row and Mobile two; both show only
 * the assistant window, whole, at full width. Mobile also stacks the button
 * over the link and steps the type down.
 *
 * The stage is a deliberate colour band, not a photo: its text and grid use
 * the inverse tokens in both modes, as Figma binds them.
 *
 * In Arabic the copy and the windows mirror: the projects window moves to
 * the right, the question bubble to the left and the link arrows point left.
 * No photos: the block draws nothing but text, tokens and atoms.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at, and the switch every Hero block shares, so
 * Tablet's layout covers 768 to 1439.
 */

export interface HeroColourStageAction {
  label: React.ReactNode
  href: string
}

export interface HeroColourStageProject {
  /** The project's name. */
  name: React.ReactNode
  /** Its status, on a soft badge. */
  status: React.ReactNode
  /** The badge's tone. */
  tone: "info" | "success" | "warning"
}

export interface HeroColourStageCopy {
  /** The badge inside the pill link. */
  badge: React.ReactNode
  /** The pill link above the headline. Hidden when null. */
  announcement: HeroColourStageAction | null
  /** The headline, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The light button. */
  primaryAction: HeroColourStageAction
  /** The text link beside it, with an arrow. Hidden when null. */
  secondaryAction: HeroColourStageAction | null
  /** The wordmarks under the buttons, set as text. Figma shows six. Hidden when empty. */
  brands: React.ReactNode[]
  /** The projects window's title, an `h2`. Desktop only. */
  projectsTitle: React.ReactNode
  /** The projects window's rows. Figma shows three. */
  projects: HeroColourStageProject[]
  /** The assistant window's title, an `h2`. */
  assistantTitle: React.ReactNode
  /** The question in the assistant window, at the end side. */
  question: React.ReactNode
  /** The reply under it, at the start side. */
  answer: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", HeroColourStageCopy> = {
  en: {
    badge: "New",
    announcement: { label: "See what’s new this season", href: "#whats-new" },
    headline: "The calm platform\nfor busy teams",
    description: "Bring projects, docs and conversations into one place, with automation that quietly handles the rest.",
    primaryAction: { label: "Start free trial", href: "#trial" },
    secondaryAction: { label: "Book a demo", href: "#demo" },
    brands: ["Corvane", "Tessaro", "Halcyn", "Nuvra", "Oblique", "Marloe"],
    projectsTitle: "Projects",
    projects: [
      { name: "Website refresh", status: "On track", tone: "info" },
      { name: "Spring campaign", status: "On track", tone: "success" },
      { name: "Hiring plan", status: "On track", tone: "warning" },
    ],
    assistantTitle: "Assistant",
    question: "Can you sum up this week?",
    answer: "Three projects moved forward and one is waiting for your review.",
  },
  ar: {
    badge: "جديد",
    announcement: { label: "اكتشف جديد هذا الموسم", href: "#whats-new" },
    headline: "المنصة الهادئة\nللفرق المشغولة",
    description: "اجمع المشاريع والمستندات والمحادثات في مكان واحد، ودع الأتمتة تتولى الباقي بهدوء.",
    primaryAction: { label: "ابدأ التجربة المجانية", href: "#trial" },
    secondaryAction: { label: "احجز عرضًا تجريبيًا", href: "#demo" },
    brands: ["كروان", "رواق", "سراج", "وهج", "مرآة", "أفق"],
    projectsTitle: "المشاريع",
    projects: [
      { name: "تجديد الموقع", status: "في المسار", tone: "info" },
      { name: "حملة الربيع", status: "في المسار", tone: "success" },
      { name: "خطة التوظيف", status: "في المسار", tone: "warning" },
    ],
    assistantTitle: "المساعد",
    question: "هل يمكنك تلخيص هذا الأسبوع؟",
    answer: "تقدّمت ثلاثة مشاريع، وواحد ينتظر مراجعتك.",
  },
}

/** A product window: Figma's card, border and two drop shadows (Tailwind's `shadow-xl`). */
const WINDOW = "flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl"

/** A text link on the stage, with its 44px hit area and a light focus ring. */
const STAGE_LINK =
  "relative before:absolute before:-inset-x-1 before:-inset-y-3 [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground-inverse"

export interface HeroColourStageProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroColourStageCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function HeroColourStage({
  locale = "en",
  badge,
  announcement,
  headline,
  description,
  primaryAction,
  secondaryAction,
  brands,
  projectsTitle,
  projects,
  assistantTitle,
  question,
  answer,
  className,
  ...props
}: HeroColourStageProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const pill = announcement === undefined ? copy.announcement : announcement
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const marks = brands ?? copy.brands
  const rows = projects ?? copy.projects

  return (
    <section
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] relative isolate overflow-hidden bg-chart-3", className)}
      {...props}
    >
      {/*
       * Figma's grid: 1px lines in `foreground-inverse` at 7%, every 96px
       * (72px on Mobile), across the whole stage. Drawn in `currentColor`,
       * so the token sets it.
       */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 text-foreground-inverse opacity-[0.07] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:72px_72px] [@container(min-width:48rem)]:[background-size:96px_96px]"
      />

      {/*
       * The stage's colour and grid fill the whole width; its content does
       * not. From Tablet up to Desktop the content keeps Figma's Tablet
       * width, 720px inside 24px padding, and centres, so a wide container
       * shows Figma's Tablet layout rather than a stretched one.
       */}
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col gap-10 px-4 py-8 [@container(min-width:48rem)]:gap-12 [@container(min-width:48rem)]:px-6 [@container(min-width:48rem)]:py-16 [@container(min-width:90rem)]:gap-0 [@container(min-width:90rem)]:px-[120px] [@container(min-width:90rem)]:pb-0 [@container(min-width:90rem)]:pt-[72px]">
        <div className="flex w-full flex-col items-center gap-5 text-center [@container(min-width:90rem)]:mx-auto [@container(min-width:90rem)]:max-w-[1000px]">
          {pill ? (
            <a
              href={pill.href}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-muted-foreground-inverse py-1 pe-3 ps-1 text-xs font-medium text-foreground-inverse hover:underline hover:underline-offset-4",
                STAGE_LINK
              )}
            >
              <Badge variant="solid" tone="secondary" size="sm" radius="rounded">
                {badge ?? copy.badge}
              </Badge>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                {pill.label}
                <ArrowRight size={12} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
              </span>
            </a>
          ) : null}
          <h1
            id={headingId}
            className="whitespace-pre-line text-3xl font-light text-foreground-inverse [@container(min-width:48rem)]:text-6xl [@container(min-width:90rem)]:text-7xl"
          >
            {headline ?? copy.headline}
          </h1>
          <p className="text-balance text-base text-muted-foreground-inverse dark:text-foreground-inverse [@container(min-width:48rem)]:text-lg [@container(min-width:90rem)]:max-w-[620px]">
            {description ?? copy.description}
          </p>
          <div className="flex w-full flex-col items-center gap-4 [@container(min-width:48rem)]:w-auto [@container(min-width:48rem)]:flex-row">
            <a href={primary.href} className={buttonVariants({ variant: "secondary", size: "lg", radius: "rounded", className: "w-full [@container(min-width:48rem)]:w-auto" })}>
              {primary.label}
            </a>
            {secondary ? (
              <a
                href={secondary.href}
                className={cn(
                  "inline-flex items-center gap-1 rounded-sm text-sm font-medium text-foreground-inverse hover:underline hover:underline-offset-4",
                  STAGE_LINK
                )}
              >
                {secondary.label}
                <ArrowRight size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
              </a>
            ) : null}
          </div>
        </div>

        {marks.length > 0 ? (
          <ul className="grid grid-cols-2 gap-4 text-center text-xl font-semibold text-muted-foreground-inverse dark:text-foreground-inverse [@container(min-width:48rem)]:grid-cols-3 [@container(min-width:48rem)]:gap-x-6 [@container(min-width:48rem)]:text-2xl [@container(min-width:90rem)]:mt-8 [@container(min-width:90rem)]:flex [@container(min-width:90rem)]:justify-between">
            {marks.map((mark, index) => (
              <li key={index} className="whitespace-nowrap">
                {mark}
              </li>
            ))}
          </ul>
        ) : null}

        {/*
         * Desktop: the two windows sit where Figma places them, 133px in from
         * the content's start edge and 17px apart, and run past the stage's
         * foot; the row is only as tall as the part that shows (294px), so
         * the section's own edge crops them. Below Desktop only the assistant
         * window shows, whole.
         */}
        <div className="flex [@container(min-width:90rem)]:mt-[104px] [@container(min-width:90rem)]:h-[294px] [@container(min-width:90rem)]:items-start [@container(min-width:90rem)]:gap-[17px] [@container(min-width:90rem)]:ps-[133px]">
          <div className={cn(WINDOW, "hidden [@container(min-width:90rem)]:mt-[35px] [@container(min-width:90rem)]:flex [@container(min-width:90rem)]:h-[360px] [@container(min-width:90rem)]:w-[520px] [@container(min-width:90rem)]:shrink-0")}>
            <div className="flex items-center gap-2 px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">{projectsTitle ?? copy.projectsTitle}</h2>
            </div>
            {/* A plain 1px line where Figma draws its Separator. Swap in Separator once it is built. */}
            <div aria-hidden className="h-px shrink-0 bg-border" />
            <ul className="flex flex-1 flex-col gap-3 p-5">
              {rows.map((row, index) => (
                <li key={index} className="flex items-center justify-between gap-3 rounded-lg bg-muted p-3">
                  <span className="min-w-0 text-sm font-medium text-foreground">{row.name}</span>
                  <Badge variant="soft" tone={row.tone} size="sm" radius="rounded">
                    {row.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>

          <div className={cn(WINDOW, "h-[320px] w-full [@container(min-width:48rem)]:h-[340px] [@container(min-width:90rem)]:h-[400px] [@container(min-width:90rem)]:w-[440px] [@container(min-width:90rem)]:shrink-0")}>
            <div className="flex items-center gap-2 px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">{assistantTitle ?? copy.assistantTitle}</h2>
            </div>
            {/* A plain 1px line where Figma draws its Separator. Swap in Separator once it is built. */}
            <div aria-hidden className="h-px shrink-0 bg-border" />
            <div className="flex flex-1 flex-col gap-3 p-5">
              <p className="max-w-full self-end rounded-xl bg-primary px-4 py-3 text-sm text-primary-foreground">{question ?? copy.question}</p>
              <p className="text-pretty rounded-xl bg-muted px-4 py-3 text-sm text-foreground [@container(min-width:90rem)]:w-[300px]">
                {answer ?? copy.answer}
              </p>
              {/* Figma's three placeholder lines: the reply still being written. */}
              <div aria-hidden className="flex flex-col gap-3">
                <span className="h-2 w-[320px] max-w-full rounded-full bg-muted" />
                <span className="h-2 w-[260px] max-w-full rounded-full bg-muted" />
                <span className="h-2 w-[200px] max-w-full rounded-full bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const heroColourStageCopy = COPY
