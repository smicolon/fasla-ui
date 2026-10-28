"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Reveal, TeamHeader, TeamPortrait, TeamSection, type TeamLocale, type TeamPerson } from "../team/team"

/*
 * Figma: `Team` (46368:243916), Type=Overlay Portrait Cards (Desktop LTR 41435:1091).
 *
 * Four 420px-tall portraits, square-cornered, in the inverse band under a
 * light heading (no description). Over the foot of each photo a caption bar
 * (a scrim, 88px) carries the name and role. Desktop sets the cards four to
 * a row; Tablet two by two; phones one under another.
 *
 * Figma draws no bio, but the motion card has one: hovering (or focusing) a
 * card raises its bar 8px and fades a one-line bio in beneath the role, and
 * on phones the bar is always raised with the bio shown. So each person takes
 * an optional `bio`; without one the bar still raises and nothing fades in.
 * Where there is no hover (touch screens) the bio is shown, so it is never
 * hidden from anyone; a card with a bio takes focus so a keyboard can reveal it.
 *
 * Motion (motion card): the portraits scale 1.08 to 1 once on entry; the
 * cards' own entrance runs from the start side. Nothing else moves.
 *
 * The scrim is dark and the text light in both modes: a photograph does not
 * change with the theme, so `dark:` switches to the page's own tokens that
 * hold the same two colours, as Gallery Full-Bleed Slider does.
 *
 * The photographs are in greyscale, as Figma draws them.
 *
 * Mobile first: base classes are Figma's Mobile (360),
 * `[@container(min-width:40rem)]:` its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop, by the block's own width.
 */

export interface TeamOverlayPerson extends TeamPerson {
  /** The list key. */
  id: string
  /** One line shown under the role on hover, focus and phones. Figma draws none. */
  bio?: React.ReactNode
}

export interface TeamOverlayPortraitCardsCopy {
  /** The small label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The people, in reading order. An empty list renders no cards. */
  people: TeamOverlayPerson[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<TeamLocale, TeamOverlayPortraitCardsCopy> = {
  en: {
    eyebrow: "IN THE ROOM",
    heading: "The people you will actually work with",
    people: [
      { id: "omar-nasser", name: "Omar Nasser", role: "Head of Product" },
      { id: "grace-okafor", name: "Grace Okafor", role: "Principal Engineer" },
      { id: "sofia-marchetti", name: "Sofia Marchetti", role: "Brand Designer" },
      { id: "mei-tanaka", name: "Mei Tanaka", role: "Customer Success Lead" },
    ],
  },
  ar: {
    eyebrow: "في الغرفة",
    heading: "الفريق الذي ستعمل معه فعلًا",
    people: [
      { id: "omar-nasser", name: "عمر ناصر", role: "رئيس المنتج" },
      { id: "grace-okafor", name: "غرايس أوكافور", role: "مهندسة رئيسية" },
      { id: "sofia-marchetti", name: "صوفيا ماركيتي", role: "مصمِّمة هوية" },
      { id: "mei-tanaka", name: "ماي تاناكا", role: "قائدة نجاح العملاء" },
    ],
  },
}

// Written out in full, not built from parts: Tailwind only finds class names that appear whole.
/** Raised on phones; from Tablet at rest until hover or focus. */
const BAR =
  "-translate-y-2 [@container(min-width:40rem)]:translate-y-0 [@container(min-width:40rem)]:group-hover/card:-translate-y-2 [@container(min-width:40rem)]:group-focus-within/card:-translate-y-2"
/** Shown on phones and on touch screens; from Tablet faded out until hover or focus. */
const BIO =
  "grid-rows-[1fr] opacity-100 [@container(min-width:40rem)]:grid-rows-[0fr] [@container(min-width:40rem)]:opacity-0 " +
  "[@container(min-width:40rem)]:group-hover/card:grid-rows-[1fr] [@container(min-width:40rem)]:group-hover/card:opacity-100 " +
  "[@container(min-width:40rem)]:group-focus-within/card:grid-rows-[1fr] [@container(min-width:40rem)]:group-focus-within/card:opacity-100 " +
  "[@container(min-width:40rem)]:[@media(hover:none)]:grid-rows-[1fr] [@container(min-width:40rem)]:[@media(hover:none)]:opacity-100"

export interface TeamOverlayPortraitCardsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<TeamOverlayPortraitCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: TeamLocale
}

export function TeamOverlayPortraitCards({ locale = "en", eyebrow, heading, people, className, ...props }: TeamOverlayPortraitCardsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = people ?? copy.people

  return (
    <TeamSection inverse labelledBy={headingId} className={className} {...props}>
      <TeamHeader
        inverse
        headingId={headingId}
        eyebrow={eyebrow === undefined ? copy.eyebrow : eyebrow}
        heading={heading ?? copy.heading}
        headingClassName="font-light"
      />
      {list.length > 0 ? (
        <ul className="grid w-full grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-4">
          {list.map((person, index) => (
            <Reveal key={person.id} as="li" index={index} className="flex">
              <article
                tabIndex={person.bio ? 0 : undefined}
                className="group/card relative h-[26.25rem] w-full overflow-hidden bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <TeamPortrait
                  person={person}
                  className="absolute inset-0"
                  imageClassName="grayscale motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-data-[reveal=pending]/team:scale-[1.08]"
                />
                {/* Rests 8px below the card's edge so raising it never leaves a gap under the scrim. */}
                <div
                  className={cn(
                    "absolute inset-x-0 -bottom-2 px-5 pb-7 pt-5 text-foreground-inverse dark:text-foreground",
                    "bg-background-inverse/[0.55] dark:bg-background/[0.55]",
                    "motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out",
                    BAR
                  )}
                >
                  <h3 className="text-lg font-medium">{person.name}</h3>
                  <p className="text-sm">{person.role}</p>
                  {person.bio ? (
                    <div className={cn("grid motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-300", BIO)}>
                      <p className="min-h-0 overflow-hidden pt-1 text-sm">{person.bio}</p>
                    </div>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      ) : null}
    </TeamSection>
  )
}

/** The default copy, English and Arabic, as `locale` picks it. Spread it to change a few strings and keep the rest. */
export const teamOverlayPortraitCardsCopy = COPY
