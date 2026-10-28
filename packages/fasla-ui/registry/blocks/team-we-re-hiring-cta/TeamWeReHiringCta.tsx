"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { buttonVariants } from "../../ui/button/button"
import { Reveal, TeamRule, TeamSection, type TeamLocale, type TeamPerson } from "../team/team"

/*
 * Figma: `Team` (46368:243916), Type=We're Hiring CTA (named We're Hiring CTA
 * here, folder team-we-re-hiring-cta).
 *
 * A split on the `secondary` surface. On the start side: a stack of five
 * overlapping Avatars with a ring, the heading, a paragraph and a Primary
 * Button. On the other: a list of five open roles, each a title, a details line
 * ("Design · Amman · Full-time") and a right arrow, between hairlines. The
 * whole row is the link.
 *
 * Desktop sets them side by side (copy 460px, roles filling the rest);
 * Tablet and Mobile stack them, and on Mobile the Button runs the full width.
 *
 * Motion (motion card): the avatars fan out once from one stack, 6px and 40ms
 * apart. Hovering or keyboard-focusing a role wipes a line in along its bottom
 * edge (a `scale-x` bar, from the start side) and slides the arrow 6px toward
 * the end. Mobile has no wipe; the arrow moves on tap instead.
 *
 * Mobile first: the base classes are Figma's Mobile (360),
 * `[@container(min-width:40rem)]:` its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop, by the block's own width.
 */

/** One open role. */
export interface TeamOpenRole {
  /** The role's title. */
  title: React.ReactNode
  /** The line under it: team, place and contract. */
  details: React.ReactNode
  /** Where the role's page is. Default `#`. */
  href?: string
}

export interface TeamWeReHiringCtaCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The paragraph under the heading. */
  description: React.ReactNode
  /** The Button's label. */
  actionLabel: React.ReactNode
  /** The people in the avatar stack (five in Figma), with their photos. */
  members: Pick<TeamPerson, "name" | "photo">[]
  /** The open roles, in reading order. */
  roles: TeamOpenRole[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<TeamLocale, TeamWeReHiringCtaCopy> = {
  en: {
    heading: "We're hiring across the system",
    description: "Five open roles right now, across design, engineering and marketing. Remote-friendly, with hubs in Amman, Dubai, Berlin and Lisbon.",
    actionLabel: "See all openings",
    members: [{ name: "Layla Mansour" }, { name: "Karim Haddad" }, { name: "Tomas Vidal" }, { name: "Omar Nasser" }, { name: "Lukas Berg" }],
    roles: [
      { title: "Senior Product Designer", details: "Design · Amman · Full-time" },
      { title: "Design Systems Engineer", details: "Engineering · Remote · Full-time" },
      { title: "Technical Writer", details: "Design · Lisbon · Contract" },
      { title: "Developer Advocate", details: "Marketing · Remote · Full-time" },
      { title: "Accessibility Specialist", details: "Design · Berlin · Full-time" },
    ],
  },
  ar: {
    heading: "نوظّف في كل التخصصات",
    description: "خمس وظائف متاحة حاليًا في التصميم والهندسة والتسويق. نعمل عن بُعد، ولدينا مكاتب في عمّان ودبي وبرلين ولشبونة.",
    actionLabel: "تصفَّح الوظائف",
    members: [{ name: "ليلى منصور" }, { name: "كريم حداد" }, { name: "توماس فيدال" }, { name: "عمر ناصر" }, { name: "لوكاس بيرغ" }],
    roles: [
      { title: "مصمِّم منتجات أول", details: "التصميم · عمّان · دوام كامل" },
      { title: "مهندس أنظمة تصميم", details: "الهندسة · عن بُعد · دوام كامل" },
      { title: "كاتب تقني", details: "التصميم · لشبونة · عقد" },
      { title: "مناصر المطوّرين", details: "التسويق · عن بُعد · دوام كامل" },
      { title: "أخصائي إمكانية الوصول", details: "التصميم · برلين · دوام كامل" },
    ],
  },
}

export interface TeamWeReHiringCtaProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<TeamWeReHiringCtaCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: TeamLocale
  /** Where the Button goes. Default `#`. */
  actionHref?: string
}

// Hover wipes and nudges only exist from Tablet up, on a device that can hover; focus-visible always does.

export function TeamWeReHiringCta({
  locale = "en",
  heading,
  description,
  actionLabel,
  members,
  roles,
  actionHref = "#",
  className,
  ...props
}: TeamWeReHiringCtaProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const people = members ?? copy.members
  const list = roles ?? copy.roles

  return (
    <TeamSection labelledBy={headingId} className={cn("bg-secondary", className)} {...props}>
      <div className="flex w-full flex-col gap-8 [@container(min-width:40rem)]:gap-12 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:gap-20">
        <div className="flex w-full flex-col items-start gap-5 [@container(min-width:64rem)]:w-[28.75rem] [@container(min-width:64rem)]:shrink-0">
          {people.length > 0 ? (
            <ul className="flex items-center ps-2">
              {people.map((person, index) => (
                <Reveal key={index} as="li" index={index} y={0} x={-6 * index} step={40} className="-ms-2">
                  <Avatar
                    radius="rounded"
                    border
                    className="size-10 [@container(min-width:40rem)]:size-11"
                    src={person.photo?.src}
                    name={typeof person.name === "string" ? person.name : ""}
                  />
                </Reveal>
              ))}
            </ul>
          ) : null}
          <Reveal index={1} className="w-full">
            <h2 id={headingId} className="text-3xl font-semibold text-foreground [@container(min-width:40rem)]:text-4xl">
              {heading ?? copy.heading}
            </h2>
          </Reveal>
          <Reveal index={2} className="w-full text-base text-muted-foreground [@container(min-width:40rem)]:text-lg">
            <p>{description ?? copy.description}</p>
          </Reveal>
          <Reveal index={3} className="w-full [@container(min-width:40rem)]:w-auto">
            <a href={actionHref} className={buttonVariants({ className: "w-full [@container(min-width:40rem)]:w-auto" })}>
              {actionLabel ?? copy.actionLabel}
            </a>
          </Reveal>
        </div>

        {list.length > 0 ? (
          <div className="flex w-full min-w-0 flex-col [@container(min-width:64rem)]:flex-1">
            <ul className="flex w-full flex-col">
              {list.map((role, index) => (
                <Reveal key={index} as="li" index={index} className="relative flex flex-col">
                  <TeamRule />
                  <a
                    href={role.href ?? "#"}
                    className="group/role relative flex items-center justify-between gap-4 py-4 [outline:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="text-lg font-medium text-foreground">{role.title}</span>
                      <span className="text-sm text-muted-foreground">{role.details}</span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      className={cn(
                        "size-5 shrink-0 text-foreground rtl:-scale-x-100 [--team-nudge:0.375rem] rtl:[--team-nudge:-0.375rem]",
                        "motion-safe:transition-transform motion-safe:duration-200",
                        `[@container(min-width:40rem)]:[@media(hover)]:group-hover/role:translate-x-[var(--team-nudge)]`,
                        "group-focus-visible/role:translate-x-[var(--team-nudge)] group-active/role:translate-x-[var(--team-nudge)]"
                      )}
                    />
                    {/* The underline wipe: a bar that scales in from the start edge. Focus draws it too. */}
                    <span
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-foreground rtl:origin-right",
                        "scale-x-0 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out",
                        `[@container(min-width:40rem)]:[@media(hover)]:group-hover/role:scale-x-100`,
                        "group-focus-visible/role:scale-x-100"
                      )}
                    />
                  </a>
                </Reveal>
              ))}
            </ul>
            <TeamRule />
          </div>
        ) : null}
      </div>
    </TeamSection>
  )
}

/** The default copy, English and Arabic, as `locale` picks it. Spread it to change a few strings and keep the rest. */
export const teamWeReHiringCtaCopy = COPY
