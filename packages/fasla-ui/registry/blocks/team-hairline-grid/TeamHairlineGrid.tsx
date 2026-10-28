"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { TeamHeader, TeamPortrait, TeamSection, type TeamPerson } from "../team/team"

/*
 * Figma: `Team` (46368:243916), Type=Hairline Team Grid (named Hairline Grid
 * here: code names do not carry the block name).
 *
 * Painted with the inverse tokens. An eyebrow and a light heading, then six
 * people in a ruled grid: three across by two on Desktop, two by three on
 * Tablet, one by six on phones. Each cell is a portrait beside a name and a
 * role, and a small plus sits where the rules cross.
 *
 * The rules are real borders on the cells (`border-s`/`border-e`, so they
 * mirror with the page's `dir`): a top and start edge on the grid, an end and
 * bottom edge on each cell. The draw-in is a one-time layer of strips in the
 * section's own colour that scale away over them with CSS transforms,
 * verticals first, then horizontals, then the crosshairs pop. Without motion,
 * or before it runs, the rules are simply there.
 *
 * Portraits rest greyscale where there is hover and the room for it (Tablet
 * and up). Pointing at a cell returns its portrait to colour and dims the
 * others to 30%; on touch and on Mobile every portrait is in colour.
 *
 * Mobile first: the base classes are Figma's Mobile (360),
 * `[@container(min-width:40rem)]:` its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop, by the block's own width.
 */

export interface TeamHairlineGridCopy {
  /** The small label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The people, in reading order. Six fill the grid as Figma has it. */
  people: TeamPerson[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", TeamHairlineGridCopy> = {
  en: {
    eyebrow: "FASLA — THE TEAM",
    heading: "The people who own the system",
    people: [
      { name: "Karim Haddad", role: "Co-founder & Chief Technology, Fasla" },
      { name: "Omar Nasser", role: "Head of Product, Fasla" },
      { name: "Grace Okafor", role: "Principal Engineer, Fasla" },
      { name: "Clara Weiss", role: "Accessibility Lead, Fasla" },
      { name: "Rami Aziz", role: "Solutions Architect, Fasla" },
      { name: "Yara Khalil", role: "Product Manager, Fasla" },
    ],
  },
  ar: {
    eyebrow: "فاصلة — الفريق",
    heading: "الفريق المسؤول عن النظام",
    people: [
      { name: "كريم حداد", role: "شريك مؤسِّس ورئيس التقنية، فاصلة" },
      { name: "عمر ناصر", role: "رئيس المنتج، فاصلة" },
      { name: "غرايس أوكافور", role: "مهندسة رئيسية، فاصلة" },
      { name: "كلارا فايس", role: "قائدة إمكانية الوصول، فاصلة" },
      { name: "رامي عزيز", role: "مهندس حلول، فاصلة" },
      { name: "يارا خليل", role: "مديرة المنتج، فاصلة" },
    ],
  },
}

export const teamHairlineGridCopy = COPY

/** The three layouts of six cells, and the container width each one shows at. */
const LAYOUTS = [
  { cols: 1, rows: 6, show: "[@container(min-width:40rem)]:hidden" },
  { cols: 2, rows: 3, show: "hidden [@container(min-width:40rem)_and_(max-width:63.99rem)]:block" },
  { cols: 3, rows: 2, show: "hidden [@container(min-width:64rem)]:block" },
] as const

// The pending classes are written out whole below: Tailwind only generates a class it can read in the source.

/** The draw-in strips and the crosshairs for one layout. Decorative; the rules themselves are the cells' borders. */
function Lattice({ cols, rows, show }: (typeof LAYOUTS)[number]) {
  const verticals = Array.from({ length: cols + 1 }, (_, i) => i)
  const horizontals = Array.from({ length: rows + 1 }, (_, i) => i)
  const rulesAt = (cols + 1) * 80
  const crossAt = rulesAt + (rows + 1) * 60 + 150
  return (
    <div aria-hidden data-lattice={`${cols}x${rows}`} className={cn("pointer-events-none absolute inset-0", show)}>
      {verticals.map((i) => (
        <span
          key={`v${i}`}
          className={cn(
            "absolute inset-y-0 -ms-[1.5px] w-[3px] origin-bottom scale-y-0 bg-background-inverse",
            "motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:[transition-delay:var(--team-d)]",
            "motion-safe:group-data-[reveal=pending]/team:scale-y-100"
          )}
          style={{ insetInlineStart: `${(i / cols) * 100}%`, "--team-d": `${i * 80}ms` } as React.CSSProperties}
        />
      ))}
      {horizontals.map((j) => (
        <span
          key={`h${j}`}
          className={cn(
            "absolute inset-x-0 -mt-[1.5px] h-[3px] origin-right scale-x-0 bg-background-inverse rtl:origin-left",
            "motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:[transition-delay:var(--team-d)]",
            "motion-safe:group-data-[reveal=pending]/team:scale-x-100"
          )}
          style={{ top: `${(j / rows) * 100}%`, "--team-d": `${rulesAt + j * 60}ms` } as React.CSSProperties}
        />
      ))}
      {verticals.flatMap((i) =>
        horizontals.map((j) => (
          <span
            key={`c${i}-${j}`}
            className={cn(
              "absolute -ms-[5.5px] -mt-[5.5px] size-[11px]",
              "motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out motion-safe:[transition-delay:var(--team-d)]",
              "motion-safe:group-data-[reveal=pending]/team:scale-50 motion-safe:group-data-[reveal=pending]/team:opacity-0"
            )}
            style={{ insetInlineStart: `${(i / cols) * 100}%`, top: `${(j / rows) * 100}%`, "--team-d": `${crossAt}ms` } as React.CSSProperties}
          >
            <span className="absolute inset-x-0 top-1/2 h-px bg-foreground-inverse" />
            <span className="absolute inset-y-0 start-1/2 w-px bg-foreground-inverse" />
          </span>
        ))
      )}
    </div>
  )
}

export interface TeamHairlineGridProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<TeamHairlineGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function TeamHairlineGrid({ locale = "en", eyebrow, heading, people, className, ...props }: TeamHairlineGridProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = people ?? copy.people
  const eyebrowText = eyebrow === undefined ? copy.eyebrow : eyebrow

  return (
    <TeamSection inverse labelledBy={headingId} className={className} contentClassName="gap-16" {...props}>
      <TeamHeader
        inverse
        headingId={headingId}
        eyebrow={eyebrowText ? <span className="text-foreground-inverse">{eyebrowText}</span> : null}
        heading={heading ?? copy.heading}
        headingClassName="font-light"
      />
      {list.length > 0 ? (
        <div className="relative w-full">
          <ul
            className={cn(
              "group/grid grid w-full grid-cols-1 border-t border-s border-foreground-inverse",
              "[@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-3"
            )}
          >
            {list.map((person, index) => (
              <li key={index} className="group/cell border-b border-e border-foreground-inverse">
                <div
                  className={cn(
                    "flex items-start gap-5 p-6 motion-safe:transition-opacity motion-safe:duration-200 motion-reduce:transition-none",
                    "[@media(hover)]:group-hover/grid:opacity-30 hover:[@media(hover)]:!opacity-100"
                  )}
                >
                  <TeamPortrait
                    person={person}
                    className="size-24 shrink-0 [@container(min-width:40rem)]:size-[110px] [@container(min-width:64rem)]:size-[120px]"
                    imageClassName={cn(
                      "motion-safe:transition-[filter] motion-safe:duration-300 motion-reduce:transition-none",
                      // Greyscale only where there is hover and room: never on touch or Mobile.
                      "[@media(hover)]:[@container(min-width:40rem)]:grayscale [@media(hover)]:[@container(min-width:40rem)]:group-hover/cell:grayscale-0"
                    )}
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <span className="text-2xl font-light text-foreground-inverse">{person.name}</span>
                    <span className="text-sm text-foreground-inverse">{person.role}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {LAYOUTS.map((layout) => (
            <Lattice key={layout.cols} {...layout} />
          ))}
        </div>
      ) : null}
    </TeamSection>
  )
}
