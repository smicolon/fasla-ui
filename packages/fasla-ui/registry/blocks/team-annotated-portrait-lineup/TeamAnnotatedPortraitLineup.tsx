"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import {
  Reveal,
  TeamHeader,
  TeamSection,
  initialsOf,
  type TeamLocale,
  type TeamPerson,
  type TeamPhoto,
} from "../team/team"

/*
 * Figma: `Team` (46368:243916), Type=Annotated Portrait Lineup.
 *
 * A cut-out Type: a centred header, then exactly five people standing on ONE
 * shared bottom line. There are no frames and no backgrounds; each photo is a
 * transparent cut-out. The name and role sit above the head, and a hand-drawn
 * dashed arrow runs from the text to the head. People differ in height, so the
 * columns are bottom-aligned (`items-end`) and the arrows land at different
 * heights.
 *
 * Desktop is Figma's row: five columns 224, 262, 168, 284 and 246px wide with
 * 24px between (1280). Tablet and Mobile are a swipe rail (`overflow-x-auto`,
 * `snap-x`, no scrollbar, no autoplay): each person is 78% (Tablet) and 60%
 * (Mobile) of the Desktop size, so about three and two people show and the
 * next peeks in. In right-to-left pages the rail starts at the end side.
 * Photos are never mirrored.
 *
 * The arrow is drawn in the 42 x 84 box Figma gives it. Odd people (A) curl
 * with the tip towards the end, even ones (B) are the mirror image; in RTL the
 * SVG is flipped by CSS and re-placed so its tip still lands on the head.
 *
 * Mobile first: the base classes are Figma's Mobile (360),
 * `[@container(min-width:40rem)]:` its Tablet, and Desktop's full-size row
 * from a 80rem section (1280px of content, which the five columns need).
 */

/** The width and height of the cut-out at Desktop size, and where the head is, per person, from Figma. */
const LAYOUT = [
  { width: 224, height: 309, aim: 0.45 },
  { width: 262, height: 381, aim: 0.412 },
  { width: 168, height: 313, aim: 0.494 },
  { width: 284, height: 360, aim: 0.564 },
  { width: 246, height: 376, aim: 0.48 },
] as const

/** The arrow's box, in px, as Figma draws it. */
const ARROW_W = 42.47
const ARROW_H = 84

/** Figma's two curves. A starts top-start and ends bottom-end; B is its mirror. */
const CURVE = {
  a: { d: "M 6.47 0 C -11.53 44 10.47 80 42.47 84", tip: [42.47, 84], from: [10.47, 80] },
  b: { d: "M 36 0 C 54 44 32 80 0 84", tip: [0, 84], from: [32, 80] },
} as const

/** The open arrowhead (Figma's arrow-lines end cap): two 8px strokes laid back 28 degrees from the tip's direction. */
function headPath(curl: "a" | "b") {
  const { tip, from } = CURVE[curl]
  const dx = tip[0] - from[0]
  const dy = tip[1] - from[1]
  const len = Math.hypot(dx, dy)
  const ux = -dx / len
  const uy = -dy / len
  const wing = (angle: number) => {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const x = tip[0] + 8 * (ux * cos - uy * sin)
    const y = tip[1] + 8 * (ux * sin + uy * cos)
    return `M ${x.toFixed(2)} ${y.toFixed(2)} L ${tip[0]} ${tip[1]}`
  }
  return `${wing(0.49)} ${wing(-0.49)}`
}

export interface TeamLineupPhoto extends TeamPhoto {
  /** The cut-out's own pixel width. With `height`, the column takes its width from the image's aspect. */
  width?: number
  /** The cut-out's own pixel height. */
  height?: number
}

export interface TeamLineupPerson extends Omit<TeamPerson, "photo"> {
  /** A transparent cut-out. With none, a tile with the initials stands in. */
  photo?: TeamLineupPhoto
  /**
   * Where the head is, from 0 to 1, as a fraction of the photo's width from its
   * start edge. The arrow's tip is placed over it. Defaults to Figma's value
   * for that place in the row.
   */
  aim?: number
}

export interface TeamAnnotatedPortraitLineupCopy {
  /** The small label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The paragraph under the heading. Hidden when empty. */
  description: React.ReactNode
  /** The five people, in reading order. */
  people: TeamLineupPerson[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<TeamLocale, TeamAnnotatedPortraitLineupCopy> = {
  en: {
    eyebrow: "THE TEAM",
    heading: "The people behind Fasla",
    description: "A small, senior team designs, builds and supports every part of the product. These are the people you will hear from first.",
    people: [
      { name: "Omar Nasser", role: "Head of Product" },
      { name: "Rami Aziz", role: "Solutions Architect" },
      { name: "Sofia Marchetti", role: "Brand Designer" },
      { name: "Mei Tanaka", role: "Customer Success Lead" },
      { name: "Chloe Dubois", role: "Content Designer" },
    ],
  },
  ar: {
    eyebrow: "الفريق",
    heading: "الفريق الذي يقف وراء فاصلة",
    description: "فريق صغير من ذوي الخبرة يصمّم كل جزء من المنتج ويبنيه ويدعمه. وهؤلاء أول من يتواصل معك.",
    people: [
      { name: "عمر ناصر", role: "رئيس المنتج" },
      { name: "رامي عزيز", role: "مهندس حلول" },
      { name: "صوفيا ماركيتي", role: "مصمِّمة هوية" },
      { name: "ماي تاناكا", role: "قائدة نجاح العملاء" },
      { name: "كلوي دوبوا", role: "مصمِّمة محتوى" },
    ],
  },
}

export interface TeamAnnotatedPortraitLineupProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<TeamAnnotatedPortraitLineupCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: TeamLocale
}

/**
 * Where the arrow's box starts, from the start edge of the column, as a CSS
 * length. `aim` is the head's centre as a fraction of the column's width from
 * the photo's left edge; the photo is never mirrored, so the head does not move
 * between LTR and RTL. W is the column's width, X the offset below.
 *
 * LTR, `inset-inline-start` is the left edge. A has its tip on the box's right
 * edge, so X = aim*W - 42.47; B has its tip on the box's left edge, X = aim*W.
 * RTL, `inset-inline-start` is the right edge and the SVG is flipped by CSS, so
 * the tips swap sides. A's tip is now on the box's left edge, which sits at
 * W - X - 42.47; setting that to aim*W gives X = (1 - aim)*W - 42.47. B's tip is
 * now on the box's right edge, W - X = aim*W, so X = (1 - aim)*W.
 */
function arrowOffsets(curl: "a" | "b", aim: number) {
  const inset = curl === "a" ? ` - ${ARROW_W}px` : ""
  return {
    ltr: `calc(${aim} * 100%${inset})`,
    rtl: `calc(${(1 - aim).toFixed(4)} * 100%${inset})`,
  }
}

function DashedArrow({ curl, aim, order }: { curl: "a" | "b"; aim: number; order: number }) {
  const maskId = `arrow-${React.useId().replace(/:/g, "")}`
  const offsets = arrowOffsets(curl, aim)
  const draw =
    "[stroke-dashoffset:0] motion-safe:transition-[stroke-dashoffset] motion-safe:duration-[400ms] motion-safe:ease-out motion-safe:group-data-[reveal=pending]/team:[stroke-dashoffset:1]"
  const delay = { transitionDelay: `${300 + order * 60}ms` }
  return (
    <svg
      aria-hidden
      focusable="false"
      width={ARROW_W}
      height={ARROW_H}
      viewBox={`0 0 ${ARROW_W} ${ARROW_H}`}
      fill="none"
      data-curl={curl}
      data-aim={aim}
      className="absolute top-0 overflow-visible [--team-x:var(--team-x-ltr)] [inset-inline-start:var(--team-x)] rtl:[--team-x:var(--team-x-rtl)] rtl:-scale-x-100"
      style={{ "--team-x-ltr": offsets.ltr, "--team-x-rtl": offsets.rtl } as React.CSSProperties}
    >
      <defs>
        {/* A solid stroke whose dash offset runs 1 to 0 reveals the dashed line beneath it. */}
        <mask id={maskId} maskUnits="userSpaceOnUse" x={-30} y={-10} width={110} height={110}>
          <path d={CURVE[curl].d} stroke="white" strokeWidth={6} pathLength={1} strokeDasharray="1 1" className={draw} style={delay} />
        </mask>
      </defs>
      <path
        d={CURVE[curl].d}
        mask={`url(#${maskId})`}
        className="stroke-muted-foreground"
        strokeWidth={1.5}
        strokeDasharray="5 5"
        strokeLinecap="butt"
      />
      <path
        d={headPath(curl)}
        className="stroke-muted-foreground motion-safe:transition-opacity motion-safe:duration-150 motion-safe:group-data-[reveal=pending]/team:opacity-0"
        style={{ transitionDelay: `${650 + order * 60}ms` }}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Five cut-out people on one bottom line, each with a name, a role and a
 * dashed arrow to the head. A swipe rail below 80rem of width.
 */
export function TeamAnnotatedPortraitLineup({
  locale = "en",
  eyebrow,
  heading,
  description,
  people,
  className,
  ...props
}: TeamAnnotatedPortraitLineupProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = (people ?? copy.people).slice(0, 5)

  return (
    <TeamSection labelledBy={headingId} className={className} contentClassName="gap-16" {...props}>
      <TeamHeader
        centered
        headingId={headingId}
        eyebrow={eyebrow === undefined ? copy.eyebrow : eyebrow}
        heading={heading ?? copy.heading}
        description={description === undefined ? copy.description : description}
      />
      {list.length > 0 ? (
        <div
          // A scroller a keyboard cannot reach fails WCAG 2.1.1, so it is a tab stop with a ring.
          tabIndex={0}
          role="region"
          aria-labelledby={headingId}
          className={cn(
            "snap-x overflow-x-auto pt-2 [outline:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            "[--team-s:0.6] [@container(min-width:40rem)]:[--team-s:0.78] [@container(min-width:80rem)]:[--team-s:1]"
          )}
        >
          <ul
            className={cn(
              "mx-auto flex w-max items-end gap-3 [@container(min-width:40rem)]:gap-4 [@container(min-width:80rem)]:gap-6"
            )}
          >
            {list.map((person, index) => {
              const base = LAYOUT[index % LAYOUT.length]!
              const photo = person.photo
              // With the photo's own size, the column keeps Figma's height and takes its width from the aspect.
              const width = photo?.width && photo?.height ? Math.round((base.height * photo.width) / photo.height) : base.width
              const curl = index % 2 === 0 ? "a" : "b"
              return (
                <Reveal
                  as="li"
                  key={index}
                  index={index + 3}
                  y={16}
                  className="shrink-0 snap-start"
                  style={{ width: `calc(${width}px * var(--team-s))` }}
                >
                  <div
                    className={cn(
                      "flex flex-col gap-3 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out",
                      "hover:motion-safe:-translate-y-1 focus-within:motion-safe:-translate-y-1"
                    )}
                  >
                    <div className={cn("flex flex-col gap-1", curl === "a" ? "text-start" : "text-end")}>
                      <p className="text-lg font-medium text-foreground">{person.name}</p>
                      <p className="text-sm text-muted-foreground">{person.role}</p>
                    </div>
                    <div aria-hidden className="relative h-[84px] w-full">
                      <DashedArrow curl={curl} aim={person.aim ?? base.aim} order={index} />
                    </div>
                    <div className="w-full" style={{ aspectRatio: `${width} / ${base.height}` }}>
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element -- a registry block can't assume next/image
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          width={photo.width}
                          height={photo.height}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          className="block size-full object-contain object-bottom"
                        />
                      ) : (
                        <span aria-hidden className="flex size-full items-center justify-center bg-muted text-lg font-medium text-muted-foreground">
                          {initialsOf(person.name)}
                        </span>
                      )}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </ul>
        </div>
      ) : null}
    </TeamSection>
  )
}

/** The default copy, English and Arabic, as `locale` picks it. Spread it to change a few strings and keep the rest. */
export const teamAnnotatedPortraitLineupCopy = COPY
