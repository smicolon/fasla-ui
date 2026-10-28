"use client"

import * as React from "react"
import { Mail } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { buttonVariants } from "../../ui/button/button"
import { SocialIcon } from "../../ui/social-icons/social-icons"
import { Reveal, TeamHeader, TeamRule, TeamSection, type TeamLocale, type TeamPerson } from "../team/team"

/*
 * Figma: `Team` (46368:243916), Type=Compact Directory Rows.
 *
 * A header (eyebrow, heading, intro) over a directory of rows: a 40px Avatar,
 * the name and the role, and two icon-only ghost buttons (email, LinkedIn).
 * Rows are split by a hairline. Desktop sets ten rows in two columns of five,
 * filled column by column; Tablet one column; Mobile one column with the
 * buttons under the person, as Figma stacks them.
 *
 * Motion (motion card): the rows fade in once per column, top-down. The two
 * buttons rest at 40% and 8px toward the end edge, and rise to full opacity and
 * their place on row hover or focus-within. Only a device that can hover
 * rests them dimmed; Mobile and touch show them at full opacity, always.
 *
 * Mobile first: the base classes are Figma's Mobile (360),
 * `[@container(min-width:40rem)]:` its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop, by the block's own width.
 */

/** How many rows fill a column on Desktop. */
const ROWS_PER_COLUMN = 5

export interface TeamDirectoryPerson extends TeamPerson {
  /** Where the email button goes. Default `#`. */
  mailHref?: string
  /** Where the LinkedIn button goes. Default `#`. */
  linkedinHref?: string
}

export interface TeamCompactDirectoryRowsCopy {
  /** The small label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The people, in reading order: the first five fill column one on Desktop. */
  people: TeamDirectoryPerson[]
  /** The two buttons' accessible names; the person's name follows, as "Email: Layla Mansour". */
  actionLabels: { mail: string; linkedin: string }
}

/** Figma's copy, English and Arabic. Two people Figma shows have no photo to ship, so others stand in. */
const COPY: Record<TeamLocale, TeamCompactDirectoryRowsCopy> = {
  en: {
    eyebrow: "DIRECTORY",
    heading: "The whole team, one page",
    description: "Design, engineering, product and the people who keep it all moving.",
    people: [
      { name: "Layla Mansour", role: "Co-founder & Chief Executive" },
      { name: "Karim Haddad", role: "Co-founder & Chief Technology" },
      { name: "Yara Khalil", role: "VP of Design" },
      { name: "Tomas Vidal", role: "VP of Engineering" },
      { name: "Omar Nasser", role: "Head of Product" },
      { name: "Lukas Berg", role: "Design Systems Lead" },
      { name: "Grace Okafor", role: "Principal Engineer" },
      { name: "Elena Novak", role: "Staff Product Designer" },
      { name: "Marcus Boateng", role: "Head of Marketing" },
      { name: "Clara Weiss", role: "People & Culture Lead" },
    ],
    actionLabels: { mail: "Email", linkedin: "LinkedIn" },
  },
  ar: {
    eyebrow: "الدليل",
    heading: "الفريق بالكامل في صفحة واحدة",
    description: "التصميم والهندسة والمنتج، والأشخاص الذين يحفظون استمرارية العمل.",
    people: [
      { name: "ليلى منصور", role: "شريكة مؤسِّسة والرئيسة التنفيذية" },
      { name: "كريم حداد", role: "شريك مؤسِّس ورئيس التقنية" },
      { name: "يارا خليل", role: "نائبة رئيس التصميم" },
      { name: "توماس فيدال", role: "نائب رئيس الهندسة" },
      { name: "عمر ناصر", role: "رئيس المنتج" },
      { name: "لوكاس بيرغ", role: "قائد أنظمة التصميم" },
      { name: "غرايس أوكافور", role: "مهندسة رئيسية" },
      { name: "إيلينا نوفاك", role: "مصمِّمة منتجات أولى" },
      { name: "ماركوس بواتينغ", role: "رئيس التسويق" },
      { name: "كلارا فايس", role: "قائدة الموارد البشرية والثقافة" },
    ],
    actionLabels: { mail: "البريد الإلكتروني", linkedin: "لينكدإن" },
  },
}

export interface TeamCompactDirectoryRowsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<TeamCompactDirectoryRowsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: TeamLocale
}

// Only a device that can hover rests the buttons dimmed, and only from Tablet up.
const REST = "[@container(min-width:40rem)]:[@media(hover)]:opacity-40 [@container(min-width:40rem)]:[@media(hover)]:translate-x-[var(--team-slide)]"
const RAISED =
  "[@container(min-width:40rem)]:[@media(hover)]:group-hover/row:opacity-100 [@container(min-width:40rem)]:[@media(hover)]:group-hover/row:translate-x-0 " +
  "[@container(min-width:40rem)]:[@media(hover)]:group-focus-within/row:opacity-100 [@container(min-width:40rem)]:[@media(hover)]:group-focus-within/row:translate-x-0"

export function TeamCompactDirectoryRows({
  locale = "en",
  eyebrow,
  heading,
  description,
  people,
  actionLabels,
  className,
  ...props
}: TeamCompactDirectoryRowsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = people ?? copy.people
  const labels = actionLabels ?? copy.actionLabels
  const label = (action: string, name: React.ReactNode) => (typeof name === "string" ? `${action}: ${name}` : action)

  return (
    <TeamSection labelledBy={headingId} className={className} contentClassName="gap-16" {...props}>
      <TeamHeader
        headingId={headingId}
        eyebrow={eyebrow === undefined ? copy.eyebrow : eyebrow}
        heading={heading ?? copy.heading}
        description={description ?? copy.description}
      />
      {list.length > 0 ? (
        <ul
          className={cn(
            "grid w-full grid-cols-1 gap-x-16",
            "[@container(min-width:64rem)]:grid-flow-col [@container(min-width:64rem)]:grid-cols-none",
            // Five to a column, filled down, so the sixth person starts column two.
            "[@container(min-width:64rem)]:[grid-template-rows:repeat(5,auto)]"
          )}
        >
          {list.map((person, index) => (
            <Reveal key={index} as="li" index={index % ROWS_PER_COLUMN} className="group/row flex flex-col">
              <TeamRule />
              <div className="flex flex-col items-start gap-2 py-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  {/* The name beside it names the person, so the photo is not read out twice. */}
                  <span aria-hidden className="shrink-0">
                    <Avatar radius="rounded" className="size-10" src={person.photo?.src} name={typeof person.name === "string" ? person.name : ""} />
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <span className="text-base font-medium text-foreground">{person.name}</span>
                    <span className="text-sm text-muted-foreground">{person.role}</span>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex shrink-0 items-center gap-1 [--team-slide:0.5rem] rtl:[--team-slide:-0.5rem]",
                    "motion-safe:transition-[opacity,transform] motion-safe:duration-200 motion-safe:ease-out",
                    REST,
                    RAISED
                  )}
                >
                  <a
                    href={person.linkedinHref ?? "#"}
                    aria-label={label(labels.linkedin, person.name)}
                    className={buttonVariants({ variant: "ghost", size: "icon-sm", radius: "rounded" })}
                  >
                    <SocialIcon platform="linkedin" color="current" />
                  </a>
                  <a
                    href={person.mailHref ?? "#"}
                    aria-label={label(labels.mail, person.name)}
                    className={buttonVariants({ variant: "ghost", size: "icon-sm", radius: "rounded" })}
                  >
                    <Mail aria-hidden />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      ) : null}
    </TeamSection>
  )
}

/** The default copy, English and Arabic, as `locale` picks it. Spread it to change a few strings and keep the rest. */
export const teamCompactDirectoryRowsCopy = COPY
