"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { REVEAL, TeamHeader, TeamLinkArrow, TeamSection, type TeamLocale, type TeamPerson, teamAvatarFocus } from "../team/team"

/*
 * Figma: `Team` (46368:243916), Type=Team Table (named Member Table here: code
 * names do not carry the block name).
 *
 * A header (eyebrow, heading) over a bordered table on `card`: a `muted` header
 * row (MEMBER, ROLE, TEAM, BASED IN and an unlabelled link column), then one
 * row per person: Avatar and name, role, a Secondary Solid Badge for the team,
 * the city and an up-right arrow link. It is a real `<table>`.
 *
 * Desktop shows every column; Tablet drops BASED IN (by container query, so the
 * cell is hidden, not removed); Mobile turns each row into a stacked block:
 * person, role, then one line of badge, city and link. A block is `flex-wrap`
 * rather than `block`, only so that last line can sit on one row as Figma has it.
 *
 * Motion (motion card): rows fade in once, top-down. Hover or focus fills a
 * row with `muted`, scales the avatar to 1.08 and slides the arrow 4px toward
 * the end. Mobile has no row fill.
 *
 * Mobile first: the base classes are Figma's Mobile (360),
 * `[@container(min-width:40rem)]:` its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop, by the block's own width.
 */

export interface TeamMemberTableRow extends TeamPerson {
  /** The team, shown as a Badge. */
  team: React.ReactNode
  /** The city. Hidden on Tablet. */
  location: React.ReactNode
  /** Where the arrow link goes. Default `#`. */
  href?: string
}

export interface TeamMemberTableCopy {
  /** The small label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The column headings, and the name of the link column (read out, never drawn). */
  columns: { member: React.ReactNode; role: React.ReactNode; team: React.ReactNode; location: React.ReactNode; link: string }
  /** The link's accessible name; the person's name follows, as "View profile: Layla Mansour". */
  linkLabel: string
  /** The people, in reading order. */
  rows: TeamMemberTableRow[]
}

/** Figma's copy, English and Arabic. Two people Figma shows have no photo to ship, so others stand in. */
const COPY: Record<TeamLocale, TeamMemberTableCopy> = {
  en: {
    eyebrow: "TEAM DIRECTORY",
    heading: "Who does what, and where",
    columns: { member: "MEMBER", role: "ROLE", team: "TEAM", location: "BASED IN", link: "Profile" },
    linkLabel: "View profile",
    rows: [
      { name: "Layla Mansour", role: "Co-founder & Chief Executive", team: "Leadership", location: "Amman" },
      { name: "Karim Haddad", role: "Co-founder & Chief Technology", team: "Engineering", location: "Amman" },
      { name: "Yara Khalil", role: "VP of Design", team: "Design", location: "Dubai" },
      { name: "Tomas Vidal", role: "VP of Engineering", team: "Engineering", location: "Lisbon" },
      { name: "Omar Nasser", role: "Head of Product", team: "Product", location: "Dubai" },
      { name: "Grace Okafor", role: "Principal Engineer", team: "Engineering", location: "Berlin" },
      { name: "Clara Weiss", role: "People & Culture Lead", team: "People", location: "Amman" },
      { name: "Rami Aziz", role: "Solutions Architect", team: "Engineering", location: "Dubai" },
    ],
  },
  ar: {
    eyebrow: "دليل الفريق",
    heading: "من يفعل ماذا، وأين",
    columns: { member: "العضو", role: "الدور", team: "الفريق", location: "المقر", link: "الملف الشخصي" },
    linkLabel: "عرض الملف الشخصي",
    rows: [
      { name: "ليلى منصور", role: "شريكة مؤسِّسة والرئيسة التنفيذية", team: "القيادة", location: "عمّان" },
      { name: "كريم حداد", role: "شريك مؤسِّس ورئيس التقنية", team: "الهندسة", location: "عمّان" },
      { name: "يارا خليل", role: "نائبة رئيس التصميم", team: "التصميم", location: "دبي" },
      { name: "توماس فيدال", role: "نائب رئيس الهندسة", team: "الهندسة", location: "لشبونة" },
      { name: "عمر ناصر", role: "رئيس المنتج", team: "المنتج", location: "دبي" },
      { name: "غرايس أوكافور", role: "مهندسة رئيسية", team: "الهندسة", location: "برلين" },
      { name: "كلارا فايس", role: "قائدة الموارد البشرية والثقافة", team: "الموارد البشرية", location: "عمّان" },
      { name: "رامي عزيز", role: "مهندس حلول", team: "الهندسة", location: "دبي" },
    ],
  },
}

export interface TeamMemberTableProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<TeamMemberTableCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: TeamLocale
}


// Cells: a table cell from Tablet up, a block child of a wrapping row below it.
const HEAD_CELL = cn("px-2 py-3 text-start text-xs font-medium text-muted-foreground first:ps-5 last:pe-5")
const CELL = cn(
  "px-0 py-0",
  `[@container(min-width:40rem)]:table-cell [@container(min-width:40rem)]:px-2 [@container(min-width:40rem)]:py-3 [@container(min-width:40rem)]:align-middle [@container(min-width:40rem)]:first:ps-5 [@container(min-width:40rem)]:last:pe-5`
)

export function TeamMemberTable({ locale = "en", eyebrow, heading, columns, linkLabel, rows, className, ...props }: TeamMemberTableProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = rows ?? copy.rows
  const cols = columns ?? copy.columns
  const link = linkLabel ?? copy.linkLabel

  return (
    <TeamSection labelledBy={headingId} className={className} {...props}>
      <TeamHeader headingId={headingId} eyebrow={eyebrow === undefined ? copy.eyebrow : eyebrow} heading={heading ?? copy.heading} />
      {list.length > 0 ? (
        <div className="w-full overflow-hidden rounded-lg border border-border bg-card">
          <table className={cn("block w-full border-collapse", `[@container(min-width:40rem)]:table [@container(min-width:40rem)]:table-fixed`)}>
            {/* Mobile has no columns to name, and its rows are blocks. */}
            <thead className={cn("hidden bg-muted", `[@container(min-width:40rem)]:table-header-group`)}>
              <tr>
                <th scope="col" className={cn(HEAD_CELL)}>{cols.member}</th>
                <th scope="col" className={cn(HEAD_CELL, `[@container(min-width:40rem)]:w-[12.5rem]`, `[@container(min-width:64rem)]:w-[16.25rem]`)}>{cols.role}</th>
                <th scope="col" className={cn(HEAD_CELL, `[@container(min-width:40rem)]:w-[8.75rem]`, `[@container(min-width:64rem)]:w-40`)}>{cols.team}</th>
                <th scope="col" className={cn(HEAD_CELL, "hidden", `[@container(min-width:64rem)]:table-cell [@container(min-width:64rem)]:w-[8.75rem]`)}>{cols.location}</th>
                <th scope="col" className={cn(HEAD_CELL, `w-8 [@container(min-width:64rem)]:w-10`)}>
                  <span className="sr-only">{cols.link}</span>
                </th>
              </tr>
            </thead>
            <tbody className="block [@container(min-width:40rem)]:table-row-group">
              {list.map((row, index) => (
                <tr
                  key={index}
                  style={{ "--reveal-i": index, "--reveal-y": "8px" } as React.CSSProperties}
                  className={cn(
                    REVEAL,
                    "group/row flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border p-4 first:border-t-0",
                    "motion-safe:transition-[opacity,transform,background-color]",
                    `[@container(min-width:40rem)]:table-row [@container(min-width:40rem)]:p-0 [@container(min-width:40rem)]:first:border-t hover:[@container(min-width:40rem)]:bg-muted focus-within:[@container(min-width:40rem)]:bg-muted`
                  )}
                >
                  <td className={cn(CELL, "w-full")}>
                    <div className="flex items-center gap-3">
                      <span aria-hidden className="shrink-0">
                        <Avatar
                          radius="rounded"
                          className={cn("size-9 motion-safe:transition-transform motion-safe:duration-200 group-hover/row:motion-safe:scale-[1.08] group-focus-within/row:motion-safe:scale-[1.08]", teamAvatarFocus(row.photo).className)}
                          style={teamAvatarFocus(row.photo).style}
                          src={row.photo?.src}
                          name={typeof row.name === "string" ? row.name : ""}
                        />
                      </span>
                      <span className="min-w-0 text-base font-medium text-foreground">{row.name}</span>
                    </div>
                  </td>
                  <td className={cn(CELL, "w-full text-sm text-muted-foreground", `[@container(min-width:40rem)]:w-auto`)}>{row.role}</td>
                  <td className={cn(CELL, "w-auto")}>
                    <Badge variant="solid" tone="secondary" size="sm" radius="rounded">
                      {row.team}
                    </Badge>
                  </td>
                  <td className={cn(CELL, "flex-1 text-sm text-muted-foreground", `[@container(min-width:40rem)]:hidden`, `[@container(min-width:64rem)]:table-cell`)}>{row.location}</td>
                  <td className={cn(CELL, "w-auto text-end")}>
                    <a
                      href={row.href ?? "#"}
                      aria-label={typeof row.name === "string" ? `${link}: ${row.name}` : link}
                      className="inline-flex rounded-sm text-foreground [outline:none] focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <TeamLinkArrow
                        className="[--team-nudge:0.25rem] rtl:[--team-nudge:-0.25rem] motion-safe:transition-transform motion-safe:duration-200 group-hover/row:motion-safe:translate-x-[var(--team-nudge)] group-focus-within/row:motion-safe:translate-x-[var(--team-nudge)]"
                      />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </TeamSection>
  )
}

/** The default copy, English and Arabic, as `locale` picks it. Spread it to change a few strings and keep the rest. */
export const teamMemberTableCopy = COPY
