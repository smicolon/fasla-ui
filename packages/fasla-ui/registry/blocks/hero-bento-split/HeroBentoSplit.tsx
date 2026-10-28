"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Hero` (46552:249264), Type=Bento Split Hero.
 *
 * Three cards on a `muted` ground. The main card carries the pitch: a soft
 * badge, the headline, a paragraph, two buttons and a wide photo at its foot.
 * Beside it, two smaller cards make the secondary offers: an accent card in
 * `chart-1` with a rising line chart and its growth badge, and an inverse
 * card with a row of faces and a "join" button.
 *
 * Desktop sets the main card beside a 440px column holding the other two, all
 * filling the block's height. Tablet stacks the main card over the other two
 * side by side; Mobile stacks all three and the buttons go full width.
 *
 * In Arabic the main card moves to the right and the chart mirrors, rising
 * towards the left; the growth figure stays left to right. The photos are
 * never flipped.
 *
 * Sized by the block's own width, not the window's: the section is a query
 * container. Mobile is the base; `[@container(min-width:48rem)]:` is Figma's
 * Tablet (768) and `[@container(min-width:90rem)]:` its Desktop, from 1440px:
 * the width Figma draws it at. Narrower, the Desktop columns squeeze, so
 * Tablet's layout covers 768 to 1439.
 */

export interface HeroBentoSplitAction {
  label: React.ReactNode
  href: string
}

export interface HeroBentoSplitPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface HeroBentoSplitPerson {
  /** The face. Without it the avatar shows the name's initials. */
  src?: string
  /** The person's name: the photo's `alt` and the source of the initials. */
  name: string
}

export interface HeroBentoSplitCopy {
  /** The soft badge above the headline. Hidden when empty. */
  badge: React.ReactNode
  /** The headline, an `h1`. A line break in the string breaks the line. */
  headline: React.ReactNode
  /** The paragraph under the headline. */
  description: React.ReactNode
  /** The solid button. */
  primaryAction: HeroBentoSplitAction
  /** The ghost button beside it. Hidden when null. */
  secondaryAction: HeroBentoSplitAction | null
  /** The accent card's title, an `h2`. */
  accentTitle: React.ReactNode
  /** The figure on the chart's badge. Shown left to right in either language. */
  chartValue: React.ReactNode
  /** What the chart shows, for screen readers; it is drawn, not written. */
  chartLabel: string
  /** The inverse card's title, an `h2`. */
  inverseTitle: React.ReactNode
  /** The inverse card's button. */
  inverseAction: HeroBentoSplitAction
}

/** Figma's copy, English and Arabic. The chart's spoken label is ours: Figma only draws it. */
const COPY: Record<"en" | "ar", HeroBentoSplitCopy> = {
  en: {
    badge: "New · Spring cohort open",
    headline: "Take control of\nyour finances online.",
    description: "Short, practical courses and one-to-one mentoring that turn money stress into a clear plan.",
    primaryAction: { label: "Get started", href: "#start" },
    secondaryAction: { label: "View courses", href: "#courses" },
    accentTitle: "Book your\noffline seat",
    chartValue: "+46%",
    chartLabel: "Seat bookings, up 46%",
    inverseTitle: "Sign up for\na session",
    inverseAction: { label: "Join now", href: "#join" },
  },
  ar: {
    badge: "جديد · التسجيل مفتوح لدفعة الربيع",
    headline: "تحكّم في أموالك\nعبر الإنترنت.",
    description: "دورات قصيرة وعملية وإرشاد فردي يحوّل قلق المال إلى خطة واضحة.",
    primaryAction: { label: "ابدأ الآن", href: "#start" },
    secondaryAction: { label: "تصفّح الدورات", href: "#courses" },
    accentTitle: "احجز مقعدك\nفي القاعة",
    chartValue: "+46%",
    chartLabel: "حجوزات المقاعد، بزيادة 46 بالمئة",
    inverseTitle: "سجّل في\nجلسة",
    inverseAction: { label: "انضم الآن", href: "#join" },
  },
}

/**
 * Figma's trend line, in its 360 × 150 chart frame: five points rising from
 * the bottom-start corner. Dots mark the last four, 12px below them.
 */
const TREND = [
  [0, 128],
  [90, 106],
  [180, 114],
  [270, 52],
  [352, 0],
] as const
const CHART = { width: 360, height: 150 }

export interface HeroBentoSplitProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<HeroBentoSplitCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The wide photo at the foot of the main card. None by default: a `muted`
   * placeholder of the same size.
   * @default none: a `muted` placeholder
   */
  photo?: HeroBentoSplitPhoto
  /**
   * The faces on the inverse card. Figma shows three. None by default: the
   * row is left out.
   * @default none
   */
  people?: HeroBentoSplitPerson[]
}

export function HeroBentoSplit({
  locale = "en",
  badge,
  headline,
  description,
  primaryAction,
  secondaryAction,
  accentTitle,
  chartValue,
  chartLabel,
  inverseTitle,
  inverseAction,
  photo,
  people,
  className,
  ...props
}: HeroBentoSplitProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const label = badge ?? copy.badge
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const join = inverseAction ?? copy.inverseAction
  const points = TREND.map(([x, y]) => `${x},${y}`).join(" ")

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-muted", className)} {...props}>
      {/*
         * The section's colour fills the whole width; its content does not.
         * From Tablet up to Desktop the content keeps Figma's Tablet width,
         * 720px inside 24px padding, and centres, so a wide container shows
         * Figma's Tablet layout rather than a stretched one.
         */}
      <div className="mx-auto flex w-full max-w-[1440px] [@container(min-width:48rem)]:max-w-[48rem] [@container(min-width:90rem)]:max-w-[1440px] flex-col gap-4 p-4 [@container(min-width:48rem)]:gap-6 [@container(min-width:48rem)]:p-6 [@container(min-width:90rem)]:min-h-[900px] [@container(min-width:90rem)]:flex-row">
        <div className="flex flex-col gap-8 rounded-[2rem] bg-background p-6 [@container(min-width:48rem)]:gap-10 [@container(min-width:48rem)]:p-10 [@container(min-width:90rem)]:min-w-0 [@container(min-width:90rem)]:flex-1 [@container(min-width:90rem)]:justify-between [@container(min-width:90rem)]:p-14">
          <div className="flex flex-col items-start gap-6">
            {label ? (
              <Badge variant="soft" tone="primary" size="md" radius="rounded">
                {label}
              </Badge>
            ) : null}
            <h1 id={headingId} className="whitespace-pre-line text-3xl font-semibold text-foreground [@container(min-width:48rem)]:text-6xl [@container(min-width:90rem)]:text-7xl">
              {headline ?? copy.headline}
            </h1>
            <p className="text-pretty text-base text-muted-foreground [@container(min-width:48rem)]:text-lg [@container(min-width:90rem)]:max-w-[520px]">
              {description ?? copy.description}
            </p>
            <div className="flex w-full flex-col gap-3 [@container(min-width:48rem)]:w-auto [@container(min-width:48rem)]:flex-row">
              <a href={primary.href} className={buttonVariants({ size: "lg", radius: "rounded" })}>
                {primary.label}
              </a>
              {secondary ? (
                <a href={secondary.href} className={buttonVariants({ variant: "ghost", tone: "primary", size: "lg", radius: "rounded" })}>
                  {secondary.label}
                </a>
              ) : null}
            </div>
          </div>
          <div className="relative h-[180px] overflow-hidden rounded-3xl bg-muted [@container(min-width:48rem)]:h-60 [@container(min-width:90rem)]:h-[260px]">
            {photo ? (
              <img src={photo.src} alt={photo.alt} decoding="async" className="absolute inset-0 size-full object-cover" />
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-6 [@container(min-width:48rem)]:flex-row [@container(min-width:90rem)]:w-[440px] [@container(min-width:90rem)]:shrink-0 [@container(min-width:90rem)]:flex-col">
          <div className="flex min-h-[260px] min-w-0 flex-1 flex-col justify-between gap-4 rounded-[2rem] bg-chart-1 p-6 [@container(min-width:48rem)]:min-h-[300px] [@container(min-width:48rem)]:p-8 [@container(min-width:90rem)]:min-h-0 [@container(min-width:90rem)]:p-10">
            <h2 className="whitespace-pre-line text-3xl font-semibold text-foreground-inverse [@container(min-width:48rem)]:text-4xl">
              {accentTitle ?? copy.accentTitle}
            </h2>
            <div role="img" aria-label={chartLabel ?? copy.chartLabel} className="relative h-[120px] w-full [@container(min-width:90rem)]:h-[150px]">
              <svg
                aria-hidden
                viewBox={`0 0 ${CHART.width} ${CHART.height}`}
                preserveAspectRatio="none"
                className="absolute inset-0 size-full overflow-visible text-foreground-inverse [&:dir(rtl)]:-scale-x-100"
              >
                <polyline points={points} fill="none" stroke="currentColor" strokeWidth={2} vectorEffect="non-scaling-stroke" />
              </svg>
              {/* The dots hang 12px below the line's points, as Figma draws them. */}
              {TREND.slice(1).map(([x, y]) => (
                <span
                  key={x}
                  aria-hidden
                  style={{ insetInlineStart: `${(x / CHART.width) * 100}%`, top: `calc(${(y / CHART.height) * 100}% + 12px)` }}
                  className="absolute -ms-[5px] -mt-[5px] size-2.5 rounded-full bg-foreground-inverse"
                />
              ))}
              {/* Above the fourth point, as Figma places it. */}
              <Badge
                aria-hidden
                variant="solid"
                tone="secondary"
                size="sm"
                radius="rounded"
                style={{ insetInlineStart: `${(250 / CHART.width) * 100}%` }}
                className="absolute top-4"
              >
                <bdi dir="ltr">{chartValue ?? copy.chartValue}</bdi>
              </Badge>
            </div>
          </div>

          <div className="flex min-h-[260px] min-w-0 flex-1 flex-col justify-between gap-4 rounded-[2rem] bg-background-inverse p-6 [@container(min-width:48rem)]:min-h-[300px] [@container(min-width:48rem)]:p-8 [@container(min-width:90rem)]:min-h-0 [@container(min-width:90rem)]:p-10">
            <h2 className="whitespace-pre-line text-3xl font-semibold text-foreground-inverse [@container(min-width:48rem)]:text-4xl">
              {inverseTitle ?? copy.inverseTitle}
            </h2>
            <div className="flex items-center justify-between gap-4">
              {people && people.length > 0 ? (
                <div className="flex gap-1">
                  {people.map((person, index) => (
                    <Avatar key={index} variant="image" size="32" radius="rounded" border src={person.src} name={person.name} />
                  ))}
                </div>
              ) : (
                <span />
              )}
              <a href={join.href} className={buttonVariants({ variant: "secondary", size: "md", radius: "rounded" })}>
                {join.label}
              </a>
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
export const heroBentoSplitCopy = COPY
