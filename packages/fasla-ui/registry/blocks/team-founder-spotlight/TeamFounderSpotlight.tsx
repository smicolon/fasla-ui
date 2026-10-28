"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Reveal, TeamHeader, TeamPortrait, TeamSection, type TeamLocale, type TeamPerson } from "../team/team"

/*
 * Figma: `Team` (46368:243916), Type=Founder Spotlight.
 *
 * A header (eyebrow and heading), then a wide feature card, the portrait of one
 * founder beside a pull-quote in a large light style with the name and role,
 * next to a column of three support cards, each with a small portrait, a name,
 * a role and a one-line description.
 *
 * Desktop is Figma's row: the feature card 760px, the column 488px, 32px
 * apart; the portrait is 300px wide and the card as tall as the column.
 * Tablet puts the support cards under the feature card in three columns, each
 * a stacked card, with the feature card's portrait 280px wide. Mobile stacks
 * everything: the portrait across the top of the feature card, then the quote,
 * then the support cards one under another. In RTL the feature card sits at
 * the start (the right) and its portrait on the right of the card.
 *
 * Entrance (one time): the portrait fades in while it settles from 1.04 to
 * 1.0 (600ms), the quote fades up, then the support cards slide in from the end
 * side on Desktop, rising 12px on Tablet and Mobile, 80ms apart. Hovering a
 * support card tints it with `muted`.
 *
 * Mobile first: the base classes are Figma's Mobile (360),
 * `[@container(min-width:40rem)]:` its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop.
 */

export interface TeamFounder extends TeamPerson {
  /** The pull-quote, with its quotation marks. */
  quote: React.ReactNode
}

export interface TeamSupportingFounder extends TeamPerson {
  /** The one-line description under the role. Hidden when empty. */
  description?: React.ReactNode
}

export interface TeamFounderSpotlightCopy {
  /** The small label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The founder on the feature card. */
  feature: TeamFounder
  /** The three people on the support cards, in reading order. */
  supporters: TeamSupportingFounder[]
}

/**
 * Figma's copy, English and Arabic. Figma's second support card is Nadia
 * Rahman, whose photo can't ship: Sofia Marchetti stands in, with her own role.
 */
const COPY: Record<TeamLocale, TeamFounderSpotlightCopy> = {
  en: {
    eyebrow: "FOUNDERS",
    heading: "Why we started Fasla",
    feature: {
      name: "Layla Mansour",
      role: "Co-founder & Chief Executive",
      quote: "“Every design system I had worked on died the moment it left the design file. Fasla exists so that handoff is not where the work stops.”",
    },
    supporters: [
      { name: "Karim Haddad", role: "Co-founder & Chief Technology", description: "Owns the pipeline from token to shipped code." },
      { name: "Sofia Marchetti", role: "Brand Designer", description: "Built the first component library and its rules." },
      { name: "Tomas Vidal", role: "VP of Engineering", description: "Keeps the platform fast and the releases boring." },
    ],
  },
  ar: {
    eyebrow: "المؤسِّسون",
    heading: "لماذا أنشأنا فاصلة",
    feature: {
      name: "ليلى منصور",
      role: "شريكة مؤسِّسة والرئيسة التنفيذية",
      quote: "«كل نظام تصميم عملت عليه كان يموت لحظة خروجه من ملف التصميم. فاصلة موجود ليكون التسليم ليس نهاية العمل.»",
    },
    supporters: [
      { name: "كريم حداد", role: "شريك مؤسِّس ورئيس التقنية", description: "يدير المسار من الرمز التصميمي إلى الكود المنشور." },
      { name: "صوفيا ماركيتي", role: "مصمِّمة هوية", description: "أنشأت أول مكتبة مكوّنات وقواعدها." },
      { name: "توماس فيدال", role: "نائب رئيس الهندسة", description: "يحافظ على سرعة المنصة وهدوء الإصدارات." },
    ],
  },
}

export interface TeamFounderSpotlightProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<TeamFounderSpotlightCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: TeamLocale
}

/** A founder on the feature card, or `feature` left out to leave the card off. */
export function TeamFounderSpotlight({ locale = "en", eyebrow, heading, feature, supporters, className, ...props }: TeamFounderSpotlightProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const main = feature ?? copy.feature
  const others = (supporters ?? copy.supporters).slice(0, 3)

  return (
    <TeamSection labelledBy={headingId} className={className} contentClassName="gap-16" {...props}>
      <TeamHeader headingId={headingId} eyebrow={eyebrow === undefined ? copy.eyebrow : eyebrow} heading={heading ?? copy.heading} />
      <div className="grid w-full grid-cols-1 gap-6 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:grid-cols-[minmax(0,760fr)_minmax(0,488fr)]">
        <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card [@container(min-width:40rem)]:flex-row">
          {/* The portrait fades in while it settles from 1.04; the box clips the scale. */}
          <Reveal
            y={0}
            className="h-[300px] w-full shrink-0 motion-safe:duration-[600ms] [@container(min-width:40rem)]:h-auto [@container(min-width:40rem)]:w-[280px] [@container(min-width:64rem)]:w-[300px]"
          >
            <TeamPortrait
              person={main}
              className="size-full min-h-[260px]"
              imageClassName="motion-safe:transition-transform motion-safe:duration-[600ms] motion-safe:ease-out motion-safe:group-data-[reveal=pending]/team:scale-[1.04]"
            />
          </Reveal>
          <div className="flex min-w-0 flex-1 flex-col gap-6 p-10">
            <Reveal index={1} className="flex flex-col gap-6">
              <blockquote className="text-lg font-light text-foreground [@container(min-width:40rem)]:text-xl">{main.quote}</blockquote>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-foreground">{main.name}</span>
                <span className="text-sm text-muted-foreground">{main.role}</span>
              </div>
            </Reveal>
          </div>
        </article>

        {others.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-3 [@container(min-width:64rem)]:grid-cols-1 [@container(min-width:64rem)]:gap-5">
            {others.map((person, index) => (
              <Reveal
                as="li"
                key={index}
                index={index + 2}
                step={80}
                x={0}
                y={12}
                // From Desktop the card slides in from the end side instead of rising.
                className={cn(
                  "flex items-center gap-4 rounded-lg border border-border bg-card p-6 hover:bg-muted focus-within:bg-muted",
                  "motion-safe:transition-[opacity,transform,background-color]",
                  // Tablet stacks the portrait over the text, in three columns; Desktop and Mobile set it beside.
                  "[@container(min-width:40rem)]:flex-col [@container(min-width:40rem)]:items-start [@container(min-width:40rem)]:gap-3",
                  "[@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:gap-4 [@container(min-width:64rem)]:![--reveal-x:16px] [@container(min-width:64rem)]:![--reveal-y:0px]"
                )}
              >
                <TeamPortrait person={person} className="size-[76px] shrink-0 rounded-md" />
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-base font-medium text-foreground">{person.name}</span>
                  <span className="text-sm text-muted-foreground">{person.role}</span>
                  {person.description ? <span className="text-xs text-muted-foreground">{person.description}</span> : null}
                </div>
              </Reveal>
            ))}
          </ul>
        ) : null}
      </div>
    </TeamSection>
  )
}

/** The default copy, English and Arabic, as `locale` picks it. Spread it to change a few strings and keep the rest. */
export const teamFounderSpotlightCopy = COPY
