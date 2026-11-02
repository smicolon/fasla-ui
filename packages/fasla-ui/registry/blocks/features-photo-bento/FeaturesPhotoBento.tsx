"use client"

import * as React from "react"
import { Workflow, Zap } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"
import { FeaturesHeader, FeaturesPhotoSlot, FeaturesSection, Figures, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Photo Bento.
 *
 * A header row, the section header at the start and an outline Take the tour
 * button at the end, over a bento of four cards in two rows: a photo card
 * (the planning canvas) with a stat card, then a copy card with a second
 * photo card (reporting). A photo card is the photo over a title and a line;
 * the stat and copy cards each hold a 40px mark chip with their text at the
 * bottom.
 *
 * Desktop sets 760px photo cards beside 464px cards, in two rows that
 * mirror each other. Tablet sets the four two across, equal. Mobile stacks
 * them, and the button takes the full width under the header.
 *
 * Content limits: a card's title up to 36 characters and its line up to 100.
 * The other limits are in the block's documentation page.
 */

export interface FeaturesBentoText {
  /** The card's title. */
  title: React.ReactNode
  /** One line on it. */
  description: React.ReactNode
}

export interface FeaturesPhotoBentoStat {
  /** The large figure, such as "4.2×". */
  figure: React.ReactNode
  /** What it measures. */
  label: React.ReactNode
  /** One line on it. */
  description: React.ReactNode
}

export interface FeaturesPhotoBentoCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The header button's label. */
  tour: string
  /** The first photo card. */
  planning: FeaturesBentoText
  /** The stat card. */
  stat: FeaturesPhotoBentoStat
  /** The copy card. */
  rules: FeaturesBentoText
  /** The second photo card. */
  reporting: FeaturesBentoText
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesPhotoBentoCopy> = {
  en: {
    eyebrow: "INSIDE THE PRODUCT",
    heading: "A workspace shaped like your team",
    tour: "Take the tour",
    planning: { title: "Shared planning canvas", description: "Everyone edits the same board — roadmap, sprint and backlog stay in step automatically." },
    stat: { figure: "4.2×", label: "faster hand-offs", description: "Measured across 900 teams in their first quarter on the platform." },
    rules: { title: "Rules instead of reminders", description: "Build the routing once and the right person is notified every time, without anyone chasing." },
    reporting: { title: "Reporting for every audience", description: "One source of truth, rendered as a board for the team and a summary for the exec review." },
  },
  ar: {
    eyebrow: "داخل المنتج",
    heading: "مساحة عمل تتشكّل حسب فريقك",
    tour: "ابدأ الجولة",
    planning: { title: "لوحة تخطيط مشتركة", description: "الجميع يحرّرون اللوحة نفسها، وتبقى خارطة الطريق والسبرنت وقائمة الأعمال متوافقة تلقائيًا." },
    stat: { figure: "4.2×", label: "أسرع في التسليم", description: "مقيسة عبر 900 فريق في ربعهم الأول على المنصّة." },
    rules: { title: "قواعد بدل التذكيرات", description: "اضبط التوجيه مرة واحدة ليصل الإشعار إلى الشخص المناسب في كل مرة، دون أن يلاحق أحد أحدًا." },
    reporting: { title: "تقارير تناسب كل جمهور", description: "مصدر واحد للحقيقة، يُعرض كلوحة للفريق وكملخّص لمراجعة الإدارة التنفيذية." },
  },
}

export interface FeaturesPhotoBentoProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesPhotoBentoCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** The two photos, the planning card's first. A `muted` placeholder shows for any left out. */
  photos?: FeaturesPhoto[]
  /** Where the header button goes. Without it, the button calls `onTour`. */
  tourHref?: string
  /** Called when the header button is pressed and has no `tourHref`. */
  onTour?: () => void
}

function PhotoCard({ photo, text, className }: { photo?: FeaturesPhoto; text: FeaturesBentoText; className?: string }) {
  return (
    <li className={cn("group flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground", className)}>
      <FeaturesPhotoSlot photo={photo} className="aspect-[1.547] shrink-0 [@container(min-width:72rem)]:aspect-auto [@container(min-width:72rem)]:h-[260px]" imageClassName="motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.03]" />
      <div className="flex flex-col gap-1.5 p-6">
        <h3 className="text-lg font-semibold text-card-foreground">{text.title}</h3>
        <p className="text-sm text-muted-foreground">{text.description}</p>
      </div>
    </li>
  )
}

export function FeaturesPhotoBento({ locale = "en", eyebrow, heading, tour, planning, stat, rules, reporting, photos, tourHref, onTour, className, ...props }: FeaturesPhotoBentoProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const label = tour ?? copy.tour
  const buttonClass = "w-full shrink-0 [@container(min-width:48rem)]:w-auto"

  return (
    <FeaturesSection labelledBy={headingId} gap="md" className={className} {...props}>
      <div className="flex flex-col gap-4 [@container(min-width:48rem)]:flex-row [@container(min-width:48rem)]:items-end [@container(min-width:48rem)]:justify-between [@container(min-width:48rem)]:gap-4 [@container(min-width:72rem)]:gap-16">
        <FeaturesHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} className="flex-1" />
        {tourHref ? (
          <a href={tourHref} className={buttonVariants({ variant: "outline", size: "md", className: buttonClass })}>
            {label}
          </a>
        ) : (
          <Button type="button" variant="outline" size="md" onClick={onTour} className={buttonClass}>
            {label}
          </Button>
        )}
      </div>
      <ul role="list" className="grid grid-cols-1 gap-6 [@container(min-width:48rem)]:flex [@container(min-width:48rem)]:flex-wrap [@container(min-width:72rem)]:grid [@container(min-width:72rem)]:grid-cols-[464fr_272fr_464fr]">
        <PhotoCard photo={photos?.[0]} text={planning ?? copy.planning} className="[@container(min-width:48rem)]:w-[calc((100%-24px)*285/616)] [@container(min-width:72rem)]:w-auto [@container(min-width:72rem)]:col-span-2" />
        <li className="flex min-w-0 flex-col justify-between gap-0 [@container(min-width:48rem)]:gap-4 rounded-lg bg-secondary p-6 text-secondary-foreground [@container(min-width:48rem)]:w-[calc((100%-24px)*331/616)] [@container(min-width:72rem)]:w-auto [@container(min-width:72rem)]:col-start-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-card text-card-foreground">
            <Zap size={18} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
          </span>
          <div className="flex flex-col gap-1.5">
            <p className="text-3xl font-semibold [@container(min-width:72rem)]:text-5xl text-secondary-foreground">
              <Figures>{(stat ?? copy.stat).figure}</Figures>
            </p>
            <p className="text-base font-medium text-secondary-foreground">{(stat ?? copy.stat).label}</p>
            <p className="text-sm text-muted-foreground">
              <Figures>{(stat ?? copy.stat).description}</Figures>
            </p>
          </div>
        </li>
        <li className="flex min-w-0 flex-col justify-between gap-0 [@container(min-width:48rem)]:gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground [@container(min-width:48rem)]:w-[calc((100%-24px)*332/616)] [@container(min-width:72rem)]:w-auto [@container(min-width:72rem)]:col-start-1">
          <span className="flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Workflow size={18} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
          </span>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-lg font-semibold text-card-foreground">{(rules ?? copy.rules).title}</h3>
            <p className="text-sm text-muted-foreground">{(rules ?? copy.rules).description}</p>
          </div>
        </li>
        <PhotoCard photo={photos?.[1]} text={reporting ?? copy.reporting} className="[@container(min-width:48rem)]:w-[calc((100%-24px)*284/616)] [@container(min-width:72rem)]:w-auto [@container(min-width:72rem)]:col-span-2" />
      </ul>
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresPhotoBentoCopy = COPY
