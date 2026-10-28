"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"
import { REVEAL, Reveal, TeamHeader, TeamLinkArrow, TeamSection, initialsOf, type TeamPerson } from "../team/team"

/*
 * Figma: `Team` (46368:243916), Type=Grid Backdrop Roster.
 *
 * Grid paper behind a centred header: hairlines in the `border` token every
 * 41px, fading out under the headline so the tiles sit on a clean page (an
 * overlay of `background`, so Dark mode works). The headline is 5XL on Desktop,
 * 4XL on Tablet, 3XL on phones, with two buttons under it: Outline "Read our
 * story" and Solid "See open roles", side by side from Tablet, stacked and
 * full width on phones.
 *
 * Eight tiles follow, four to a row on Desktop, three on Tablet (3, 3, 2), two
 * on phones. Each is a `soft-info` tile with a transparent cut-out photo
 * standing on its bottom edge, then the name with a link arrow and the role.
 * A person with an `href` is a link and the whole tile is its focus target;
 * without one it is a plain `div`. Hover and focus lay a second `soft-info`
 * layer over the tile (soft tokens have one step, so two layers make the
 * next) and nudge the arrow 2px up and toward the end.
 *
 * Motion: the backdrop fades in, the headline and buttons rise, then the tiles
 * reveal row by row with each cut-out rising 8px. Once, never scroll-linked.
 *
 * Mobile first: the base classes are Figma's Mobile (360),
 * `[@container(min-width:40rem)]:` its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop, by the block's own width.
 */

/** A person in the roster. */
export interface TeamRosterPerson extends TeamPerson {
  /** Makes the whole tile a link to their profile. Without it the tile is not interactive. */
  href?: string
}

/** One of the two buttons under the headline. */
export interface TeamRosterAction {
  label: React.ReactNode
  /** Renders the button as a link. */
  href?: string
}

export interface TeamGridBackdropRosterCopy {
  /** The headline, an `h2`. */
  heading: React.ReactNode
  /** The Outline button. Hidden when absent. */
  secondaryAction: TeamRosterAction | null
  /** The Solid button. Hidden when absent. */
  primaryAction: TeamRosterAction | null
  /** The people, in reading order. Figma has eight. */
  people: TeamRosterPerson[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", TeamGridBackdropRosterCopy> = {
  en: {
    heading: "We are the people who make up Fasla",
    secondaryAction: { label: "Read our story" },
    primaryAction: { label: "See open roles" },
    people: [
      { name: "Clara Weiss", role: "Accessibility Lead" },
      { name: "Karim Haddad", role: "Co-founder & CTO" },
      { name: "Hana Kobayashi", role: "Motion Designer" },
      { name: "Tomas Vidal", role: "VP of Engineering" },
      { name: "Yara Khalil", role: "Product Manager" },
      { name: "Marcus Boateng", role: "Head of Marketing" },
      { name: "Mei Tanaka", role: "Customer Success Lead" },
      { name: "Lukas Berg", role: "Design Systems Lead" },
    ],
  },
  ar: {
    heading: "الفريق الذي يصنع فاصلة",
    secondaryAction: { label: "اقرأ قصتنا" },
    primaryAction: { label: "تصفَّح الوظائف" },
    people: [
      { name: "كلارا فايس", role: "قائدة إمكانية الوصول" },
      { name: "كريم حداد", role: "شريك مؤسِّس ورئيس التقنية" },
      { name: "هانا كوباياشي", role: "مصمِّمة حركة" },
      { name: "توماس فيدال", role: "نائب رئيس الهندسة" },
      { name: "يارا خليل", role: "مديرة المنتج" },
      { name: "ماركوس بواتينغ", role: "رئيس التسويق" },
      { name: "ماي تاناكا", role: "قائدة نجاح العملاء" },
      { name: "لوكاس بيرغ", role: "قائد أنظمة التصميم" },
    ],
  },
}

export const teamGridBackdropRosterCopy = COPY

function ActionButton({ action, variant }: { action: TeamRosterAction; variant: "outline" | "default" }) {
  const width = "w-full [@container(min-width:40rem)]:w-auto"
  if (action.href) {
    return (
      <a href={action.href} className={buttonVariants({ variant, className: width })}>
        {action.label}
      </a>
    )
  }
  return (
    <Button type="button" variant={variant} className={width}>
      {action.label}
    </Button>
  )
}

export interface TeamGridBackdropRosterProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<TeamGridBackdropRosterCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function TeamGridBackdropRoster({
  locale = "en",
  heading,
  secondaryAction,
  primaryAction,
  people,
  className,
  ...props
}: TeamGridBackdropRosterProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = people ?? copy.people
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const primary = primaryAction === undefined ? copy.primaryAction : primaryAction

  return (
    <TeamSection labelledBy={headingId} className={cn("relative overflow-hidden", className)} contentClassName="items-center gap-16" {...props}>
      {/* Grid paper: 1px lines every 41px (Figma's 40px gap), fading out under the headline. */}
      <div
        aria-hidden
        data-slot="grid-backdrop"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-[412px] [@container(min-width:40rem)]:h-[404px] [@container(min-width:64rem)]:h-[493px]",
          "motion-safe:transition-opacity motion-safe:duration-200 motion-safe:ease-out motion-safe:group-data-[reveal=pending]/team:opacity-0"
        )}
      >
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:41px_41px]" />
        <div className="absolute inset-x-0 bottom-0 top-[22%] bg-gradient-to-b from-transparent via-background via-60% to-background" />
      </div>

      <TeamHeader
        centered
        headingId={headingId}
        heading={heading ?? copy.heading}
        className="relative gap-8"
        headingClassName={cn(
          "text-balance [@container(min-width:64rem)]:text-5xl",
          "mx-auto max-w-full [@container(min-width:40rem)]:max-w-[25rem]",
          locale === "ar" ? "[@container(min-width:64rem)]:max-w-[40rem]" : "[@container(min-width:64rem)]:max-w-[30rem]"
        )}
      >
        {secondary || primary ? (
          <Reveal index={3} y={8} className="flex w-full flex-col gap-3 [@container(min-width:40rem)]:w-auto [@container(min-width:40rem)]:flex-row">
            {secondary ? <ActionButton action={secondary} variant="outline" /> : null}
            {primary ? <ActionButton action={primary} variant="default" /> : null}
          </Reveal>
        ) : null}
      </TeamHeader>

      {list.length > 0 ? (
        <ul className="relative grid w-full grid-cols-2 gap-x-3 gap-y-6 [@container(min-width:40rem)]:grid-cols-3 [@container(min-width:40rem)]:gap-x-4 [@container(min-width:40rem)]:gap-y-8 [@container(min-width:64rem)]:grid-cols-4 [@container(min-width:64rem)]:gap-x-6 [@container(min-width:64rem)]:gap-y-10">
          {list.map((person, index) => {
            const Tag: React.ElementType = person.href ? "a" : "div"
            return (
              <li
                key={index}
                className={cn(
                  REVEAL,
                  // Row by row: the row index, for whichever column count is showing.
                  "[--reveal-i:var(--team-row-2)] [@container(min-width:40rem)]:[--reveal-i:var(--team-row-3)] [@container(min-width:64rem)]:[--reveal-i:var(--team-row-4)]"
                )}
                style={
                  {
                    "--reveal-y": "0px",
                    "--reveal-step": "50ms",
                    "--team-row-2": Math.floor(index / 2),
                    "--team-row-3": Math.floor(index / 3),
                    "--team-row-4": Math.floor(index / 4),
                  } as React.CSSProperties
                }
              >
                <Tag
                  {...(person.href ? { href: person.href } : {})}
                  className="group/tile flex flex-col gap-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="relative aspect-[302/320] w-full overflow-hidden bg-soft-info">
                    {/* The second soft-info layer: hover, focus and tap fade it in. */}
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-soft-info opacity-0 motion-safe:transition-opacity motion-safe:duration-200 group-hover/tile:opacity-100 group-focus-visible/tile:opacity-100 motion-reduce:transition-none"
                    />
                    {person.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- a registry block can't assume next/image
                      <img
                        src={person.photo.src}
                        alt={person.photo.alt}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className={cn("absolute inset-0 size-full object-cover object-bottom", REVEAL)}
                        style={{ "--reveal-y": "8px" } as React.CSSProperties}
                      />
                    ) : (
                      <span aria-hidden className="absolute inset-0 flex items-center justify-center text-lg font-medium text-muted-foreground">
                        {initialsOf(person.name)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 text-base font-medium text-foreground">{person.name}</span>
                      <TeamLinkArrow
                        className={cn(
                          "text-foreground motion-safe:transition-transform motion-safe:duration-200 motion-reduce:transition-none",
                          "group-hover/tile:-translate-y-0.5 group-hover/tile:translate-x-0.5 rtl:group-hover/tile:-translate-x-0.5",
                          "group-focus-visible/tile:-translate-y-0.5 group-focus-visible/tile:translate-x-0.5 rtl:group-focus-visible/tile:-translate-x-0.5"
                        )}
                      />
                    </span>
                    <span className="text-sm text-muted-foreground">{person.role}</span>
                  </div>
                </Tag>
              </li>
            )
          })}
        </ul>
      ) : null}
    </TeamSection>
  )
}
