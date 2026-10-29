"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { REVEAL, Reveal, TeamFigures, TeamPortrait, TeamSection, type TeamPerson } from "../team/team"

/*
 * Figma: Team (46368:243916), Type=Split Intro + Member Rail (Desktop LTR 41435:1083).
 *
 * Two columns on Desktop: an intro at the start (eyebrow, a 3XL heading, a
 * paragraph and a stat line, 420px wide) and a rail of eight member rows at the
 * end. Each row is a 56px portrait, the name and role, and the location at the
 * row's end, with a hairline under it. Nothing is pinned or sticky: the intro
 * simply sits at the top of its column. Tablet and Mobile put the intro above
 * the rail; on Mobile the location moves under the role in the name block.
 *
 * Motion (the approved card): the intro fades up 12px once; the rows then
 * reveal 16px up, 40ms apart, the location sliding in 8px (it only fades on
 * Mobile). Hover or focus tints a row with `muted` and slides the name 4px
 * toward the end. All of it is `motion-safe:` and nothing replays or follows
 * the scroll.
 *
 * Mobile first, by the block's own width: base = Figma Mobile (360),
 * `[@container(min-width:40rem)]:` = Tablet, `[@container(min-width:64rem)]:` = Desktop.
 */

export interface TeamSplitMember extends TeamPerson {
  /** The city, at the row's end. */
  location: React.ReactNode
  /** Makes the name a link; the whole row becomes its target. */
  href?: string
}

export interface TeamSplitIntroMemberRailCopy {
  /** The small label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The paragraph under the heading. Hidden when empty. */
  description: React.ReactNode
  /** The line of figures under the paragraph. Hidden when empty. */
  stats: React.ReactNode
  /** The rail's rows, in reading order. Figma shows eight. */
  members: TeamSplitMember[]
}

/** Figma's copy. Dana Haddad and Zainab Idris have no shippable photo, so Tomas Vidal and Omar Nasser stand in. */
const COPY: Record<"en" | "ar", TeamSplitIntroMemberRailCopy> = {
  en: {
    eyebrow: "THE TEAM",
    heading: "A small team with deep range",
    description:
      "We hire people who have shipped systems before and want to do it properly this time. Everyone here writes, designs or reviews the components you use.",
    stats: "19 people · 7 disciplines · 4 cities",
    members: [
      { name: "Hana Kobayashi", role: "Motion Designer", location: "Singapore" },
      { name: "Clara Weiss", role: "Accessibility Lead", location: "Berlin" },
      { name: "Yara Khalil", role: "Product Manager", location: "Amman" },
      { name: "Mei Tanaka", role: "Customer Success Lead", location: "Singapore" },
      { name: "Tomas Vidal", role: "VP of Engineering", location: "Lisbon" },
      { name: "Chloe Dubois", role: "Content Designer", location: "Lisbon" },
      { name: "Omar Nasser", role: "Head of Product", location: "Dubai" },
      { name: "Sofia Marchetti", role: "Brand Designer", location: "Lisbon" },
    ],
  },
  ar: {
    eyebrow: "الفريق",
    heading: "فريق صغير بخبرة واسعة",
    description: "نستقطب من سبق له بناء أنظمة ويريد إنجازها بالشكل الصحيح هذه المرة. كل فرد هنا يكتب أو يصمّم أو يراجع المكوّنات التي تستخدمها.",
    stats: "19 فردًا · 7 تخصصات · 4 مدن",
    members: [
      { name: "هانا كوباياشي", role: "مصمِّمة حركة", location: "سنغافورة" },
      { name: "كلارا فايس", role: "قائدة إمكانية الوصول", location: "برلين" },
      { name: "يارا خليل", role: "مديرة المنتج", location: "عمّان" },
      { name: "ماي تاناكا", role: "قائدة نجاح العملاء", location: "سنغافورة" },
      { name: "توماس فيدال", role: "نائب رئيس الهندسة", location: "لشبونة" },
      { name: "كلوي دوبوا", role: "مصمِّمة محتوى", location: "لشبونة" },
      { name: "عمر ناصر", role: "رئيس المنتج", location: "دبي" },
      { name: "صوفيا ماركيتي", role: "مصمِّمة هوية", location: "لشبونة" },
    ],
  },
}

export interface TeamSplitIntroMemberRailProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<TeamSplitIntroMemberRailCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function TeamSplitIntroMemberRail({
  locale = "en",
  eyebrow,
  heading,
  description,
  stats,
  members,
  className,
  ...props
}: TeamSplitIntroMemberRailProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = members ?? copy.members
  const eyebrowText = eyebrow === undefined ? copy.eyebrow : eyebrow
  const descriptionText = description === undefined ? copy.description : description
  const statsText = stats === undefined ? copy.stats : stats

  return (
    <TeamSection
      labelledBy={headingId}
      className={className}
      contentClassName="gap-8 [@container(min-width:40rem)]:gap-12 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:gap-20"
      {...props}
    >
      {/* The intro is one block: it fades up once, and is not pinned. */}
      <Reveal index={0} className="flex w-full flex-col gap-4 [@container(min-width:64rem)]:w-[26.25rem] [@container(min-width:64rem)]:shrink-0">
        {eyebrowText ? <p className="text-sm font-medium text-muted-foreground">{eyebrowText}</p> : null}
        <h2
          id={headingId}
          className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl"
        >
          <TeamFigures>{heading ?? copy.heading}</TeamFigures>
        </h2>
        {descriptionText ? (
          <p className="text-base text-muted-foreground">
            <TeamFigures>{descriptionText}</TeamFigures>
          </p>
        ) : null}
        {statsText ? (
          <p className="text-sm font-medium text-foreground">
            <TeamFigures>{statsText}</TeamFigures>
          </p>
        ) : null}
      </Reveal>

      {list.length > 0 ? (
        <ul className="m-0 flex w-full min-w-0 list-none flex-col p-0 [@container(min-width:64rem)]:flex-1">
          {list.map((member, index) => (
            <RailRow key={index} member={member} index={index} />
          ))}
        </ul>
      ) : null}
    </TeamSection>
  )
}

function RailRow({ member, index }: { member: TeamSplitMember; index: number }) {
  // Index 0 is the intro; the rows follow it, 40ms apart.
  const order = index + 1
  return (
    <Reveal
      as="li"
      index={order}
      y={16}
      step={40}
      className={cn(
        "group/row relative isolate grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-x-4 border-b border-border py-3",
        "[@container(min-width:40rem)]:grid-cols-[3.5rem_minmax(0,1fr)_auto]",
        // The tint is its own layer, so it can run past the row's text without moving the layout.
        "before:absolute before:-inset-x-3 before:inset-y-0 before:-z-10 before:rounded-md before:bg-muted before:opacity-0 motion-safe:before:transition-opacity motion-safe:before:duration-150",
        "hover:before:opacity-100 focus-within:before:opacity-100"
      )}
    >
      <TeamPortrait person={member} className="row-span-3 size-14 rounded-md [@container(min-width:40rem)]:row-span-2" />
      <span
        className={cn(
          "col-start-2 row-start-1 self-end text-base font-medium text-foreground",
          "motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out",
          "group-hover/row:motion-safe:translate-x-1 group-focus-within/row:motion-safe:translate-x-1 rtl:group-hover/row:motion-safe:-translate-x-1 rtl:group-focus-within/row:motion-safe:-translate-x-1"
        )}
      >
        {member.href ? (
          <a
            href={member.href}
            className="rounded-sm outline-none after:absolute after:inset-0 focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {member.name}
          </a>
        ) : (
          member.name
        )}
      </span>
      <span className="col-start-2 row-start-2 self-start text-sm text-muted-foreground">{member.role}</span>
      <span
        style={{ "--reveal-i": order, "--reveal-y": "0px", "--reveal-step": "40ms" } as React.CSSProperties}
        className={cn(
          REVEAL,
          // Mobile: under the role, fading in with its row. From Tablet it sits at the end and slides in 8px.
          "col-start-2 row-start-3 self-start pt-0.5 text-xs text-muted-foreground [--reveal-x:0px]",
          "[@container(min-width:40rem)]:col-start-3 [@container(min-width:40rem)]:row-span-2 [@container(min-width:40rem)]:row-start-1 [@container(min-width:40rem)]:self-center [@container(min-width:40rem)]:pt-0 [@container(min-width:40rem)]:text-sm [@container(min-width:40rem)]:[--reveal-x:8px]"
        )}
      >
        {member.location}
      </span>
    </Reveal>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const teamSplitIntroMemberRailCopy = COPY
