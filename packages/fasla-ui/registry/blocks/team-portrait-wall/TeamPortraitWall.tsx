"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { REVEAL, TeamHeader, TeamPortrait, TeamSection, type TeamPerson } from "../team/team"

/*
 * Figma: `Team` (46368:243916), Type=Portrait Wall.
 *
 * An eyebrow and heading, then twelve portraits with a name and a role under
 * each. Desktop sets them six to a row, Tablet four, phones two. The portraits
 * fade in on a diagonal wave that starts at the top-start corner (column plus
 * row sets each one's delay, so right-to-left pages start from the right). On
 * devices with hover, pointing at one portrait dims the others to 40% and
 * lifts it 4px; touch devices get neither. Nothing is scroll-linked.
 *
 * Mobile first: the base classes are Figma's Mobile (360),
 * `[@container(min-width:40rem)]:` its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop, by the block's own width.
 */

export interface TeamPortraitWallCopy {
  /** The small label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The people, in reading order. Photos come with each person's `photo`. */
  people: TeamPerson[]
}

/** Figma's copy, English and Arabic. Figma shows Nadia Rahman and Amira Sultan, whose photos can't ship: Clara Weiss and Yara Khalil stand in. */
const COPY: Record<"en" | "ar", TeamPortraitWallCopy> = {
  en: {
    eyebrow: "EVERYONE",
    heading: "Nineteen people, one system",
    people: [
      { name: "Layla Mansour", role: "Chief Executive" },
      { name: "Karim Haddad", role: "Chief Technology" },
      { name: "Clara Weiss", role: "Accessibility Lead" },
      { name: "Tomas Vidal", role: "VP of Engineering" },
      { name: "Omar Nasser", role: "Head of Product" },
      { name: "Lukas Berg", role: "Design Systems Lead" },
      { name: "Grace Okafor", role: "Principal Engineer" },
      { name: "Elena Novak", role: "Staff Product Designer" },
      { name: "Marcus Boateng", role: "Head of Marketing" },
      { name: "Yara Khalil", role: "Product Manager" },
      { name: "Rami Aziz", role: "Solutions Architect" },
      { name: "Sofia Marchetti", role: "Brand Designer" },
    ],
  },
  ar: {
    eyebrow: "الجميع",
    heading: "تسعة عشر شخصًا، نظام واحد",
    people: [
      { name: "ليلى منصور", role: "الرئيسة التنفيذية" },
      { name: "كريم حداد", role: "رئيس التقنية" },
      { name: "كلارا فايس", role: "قائدة إمكانية الوصول" },
      { name: "توماس فيدال", role: "نائب رئيس الهندسة" },
      { name: "عمر ناصر", role: "رئيس المنتج" },
      { name: "لوكاس بيرغ", role: "قائد أنظمة التصميم" },
      { name: "غرايس أوكافور", role: "مهندسة رئيسية" },
      { name: "إيلينا نوفاك", role: "مصمِّمة منتجات أولى" },
      { name: "ماركوس بواتينغ", role: "رئيس التسويق" },
      { name: "يارا خليل", role: "مديرة المنتج" },
      { name: "رامي عزيز", role: "مهندس حلول" },
      { name: "صوفيا ماركيتي", role: "مصمِّمة هوية" },
    ],
  },
}

export const teamPortraitWallCopy = COPY

export interface TeamPortraitWallProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<TeamPortraitWallCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function TeamPortraitWall({ locale = "en", eyebrow, heading, people, className, ...props }: TeamPortraitWallProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = people ?? copy.people

  return (
    <TeamSection labelledBy={headingId} className={className} contentClassName="gap-16" {...props}>
      <TeamHeader headingId={headingId} eyebrow={eyebrow === undefined ? copy.eyebrow : eyebrow} heading={heading ?? copy.heading} />
      {list.length > 0 ? (
        <ul
          className={cn(
            "group/wall grid w-full grid-cols-2 gap-x-3 gap-y-6",
            "[@container(min-width:40rem)]:grid-cols-4 [@container(min-width:40rem)]:gap-x-4",
            "[@container(min-width:64rem)]:grid-cols-6 [@container(min-width:64rem)]:gap-x-6"
          )}
        >
          {list.map((person, index) => (
            <li
              key={index}
              className={cn(
                REVEAL,
                // The wave: column + row, for whichever column count is showing.
                "[--reveal-i:var(--team-wave-2)] [@container(min-width:40rem)]:[--reveal-i:var(--team-wave-4)] [@container(min-width:64rem)]:[--reveal-i:var(--team-wave-6)]"
              )}
              style={
                {
                  "--reveal-y": "12px",
                  "--reveal-step": "70ms",
                  "--team-wave-2": (index % 2) + Math.floor(index / 2),
                  "--team-wave-4": (index % 4) + Math.floor(index / 4),
                  "--team-wave-6": (index % 6) + Math.floor(index / 6),
                } as React.CSSProperties
              }
            >
              {/* Hover lives on this inner box so the reveal's delay never lags it. */}
              <div
                className={cn(
                  "flex flex-col gap-2 motion-safe:transition-[opacity,transform] motion-safe:duration-200 motion-reduce:transition-none",
                  "[@media(hover)]:group-hover/wall:opacity-40 hover:[@media(hover)]:!opacity-100 hover:[@media(hover)]:motion-safe:-translate-y-1 "
                )}
              >
                <TeamPortrait person={person} className="aspect-[4/5] w-full" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{person.name}</span>
                  <span className="text-xs text-muted-foreground">{person.role}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </TeamSection>
  )
}
