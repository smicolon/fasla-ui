"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Reveal, TeamFigures, TeamHeader, TeamPortrait, TeamSection, type TeamLocale, type TeamPerson } from "../team/team"

/*
 * Figma: `Team` (46368:243916), Type=Meta Profile Cards (Desktop LTR 41435:1088).
 *
 * Three profile cards under a header: a 320px portrait, the name and role,
 * then four label / value rows (based in, focus, joined, ask me about), each
 * under a hairline, the label at the start and the value at the end. Desktop
 * sets the cards three to a row; Tablet two to a row, the third left alone at
 * half width as Figma draws it; phones stack them.
 *
 * Motion (motion card): the cards reveal once as the block enters, the meta
 * rows cascading 40ms apart beneath the name. Hovering a card scales its
 * portrait 1.04 inside the clip (not on phones, which have no hover: give a
 * person an `href` and the whole card is the tap-through to the profile).
 *
 * Mobile first: base classes are Figma's Mobile (360),
 * `[@container(min-width:40rem)]:` its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop, by the block's own width.
 */

export interface TeamProfile extends TeamPerson {
  /** The list key. */
  id: string
  /** The four meta values, in the order of `metaLabels`: based in, focus, joined, ask me about. */
  meta: [React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode]
  /** Makes the name a link that covers the whole card. */
  href?: string
}

export interface TeamMetaProfileCardsCopy {
  /** The small label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  /** The four row labels: based in, focus, joined, ask me about. */
  metaLabels: [React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode]
  /** The people, in reading order. An empty list renders no cards. */
  people: TeamProfile[]
}

/**
 * Figma's copy, English and Arabic. Amira Sultan's photo can't ship, so the
 * first card is Sofia Marchetti; her four meta rows are written for her role,
 * since Figma has none for her.
 */
const COPY: Record<TeamLocale, TeamMetaProfileCardsCopy> = {
  en: {
    eyebrow: "PROFILES",
    heading: "Get to know them properly",
    description: "A little more than a name and a job title.",
    metaLabels: ["BASED IN", "FOCUS", "JOINED", "ASK ME ABOUT"],
    people: [
      { id: "sofia-marchetti", name: "Sofia Marchetti", role: "Brand Designer", meta: ["Dubai", "Visual identity", "2023", "Type pairing"] },
      { id: "grace-okafor", name: "Grace Okafor", role: "Principal Engineer", meta: ["Berlin", "Token pipeline", "2021", "Build performance"] },
      { id: "hana-kobayashi", name: "Hana Kobayashi", role: "Motion Designer", meta: ["Singapore", "Interaction & motion", "2023", "Easing curves"] },
    ],
  },
  ar: {
    eyebrow: "الملفات",
    heading: "تعرَّف عليهم عن قرب",
    description: "أكثر من مجرد اسم ومسمّى وظيفي.",
    metaLabels: ["المقر", "التركيز", "تاريخ الانضمام", "اسألني عن"],
    people: [
      { id: "sofia-marchetti", name: "صوفيا ماركيتي", role: "مصمِّمة هوية", meta: ["دبي", "الهوية البصرية", "2023", "اختيار الخطوط"] },
      { id: "grace-okafor", name: "غرايس أوكافور", role: "مهندسة رئيسية", meta: ["برلين", "مسار الرموز التصميمية", "2021", "أداء البناء"] },
      { id: "hana-kobayashi", name: "هانا كوباياشي", role: "مصمِّمة حركة", meta: ["سنغافورة", "التفاعل والحركة", "2023", "منحنيات التوقيت"] },
    ],
  },
}

export interface TeamMetaProfileCardsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<TeamMetaProfileCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: TeamLocale
}

export function TeamMetaProfileCards({
  locale = "en",
  eyebrow,
  heading,
  description,
  metaLabels,
  people,
  className,
  ...props
}: TeamMetaProfileCardsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = people ?? copy.people
  const labels = metaLabels ?? copy.metaLabels

  return (
    <TeamSection labelledBy={headingId} className={className} {...props}>
      <TeamHeader
        headingId={headingId}
        eyebrow={eyebrow === undefined ? copy.eyebrow : eyebrow}
        heading={heading ?? copy.heading}
        description={description === undefined ? copy.description : description}
      />
      {list.length > 0 ? (
        <ul className="grid w-full grid-cols-1 gap-6 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:grid-cols-3">
          {list.map((person, index) => (
            <Reveal key={person.id} as="li" index={index} className="flex">
              <article
                className={cn(
                  "group/card relative flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card",
                  "focus-within:ring-2 focus-within:ring-ring"
                )}
              >
                <TeamPortrait
                  person={person}
                  className="h-80 shrink-0"
                  imageClassName="motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out [@container(min-width:40rem)]:group-hover/card:scale-[1.04]"
                />
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-foreground">
                      {person.href ? (
                        <a href={person.href} className="outline-none after:absolute after:inset-0">
                          {person.name}
                        </a>
                      ) : (
                        person.name
                      )}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">{person.role}</p>
                  </div>
                  <dl className="flex flex-col">
                    {labels.map((label, row) => (
                      <Reveal key={row} index={row + 1} y={8} step={40} className="flex items-center justify-between gap-3 border-b border-border py-2">
                        <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                        <dd className="text-end text-sm text-foreground">
                          <TeamFigures>{person.meta[row]}</TeamFigures>
                        </dd>
                      </Reveal>
                    ))}
                  </dl>
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
export const teamMetaProfileCardsCopy = COPY
