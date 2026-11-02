"use client"

import * as React from "react"
import { FeaturesHeader, FeaturesPhotoSlot, FeaturesSection, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Media Rail.
 *
 * A header row, the section header at the start and a 14px note at the end on
 * its bottom line, then four tiles. A tile is a tall photo (297 × 400, 8px
 * radius) over a 16px title and a 14px line. A photo grows slightly on hover.
 *
 * Desktop sets the four tiles in one row, 20px apart. Tablet sets them two
 * across. Mobile makes a rail: 220px tiles that scroll sideways and snap, and
 * stay reachable from the keyboard.
 *
 * Content limits: a tile's title up to 20 characters and its line up to 70.
 * The other limits are in the block's documentation page.
 */

export interface FeaturesMediaTile {
  /** Keys the tile. */
  id: string
  /** The tile's title. */
  title: React.ReactNode
  /** The line under it. */
  description: React.ReactNode
  /** The tile's photo. */
  image?: FeaturesPhoto
}

export interface FeaturesMediaRailCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The note beside the heading. */
  note: React.ReactNode
  /** The tiles, in order. */
  tiles: FeaturesMediaTile[]
  /** Names the scrolling rail on Mobile for assistive technology. */
  railLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesMediaRailCopy> = {
  en: {
    eyebrow: "HOW IT FEELS",
    heading: "Where form follows the work",
    note: "Four surfaces, one model underneath.",
    railLabel: "Surfaces",
    tiles: [
      { id: "board", title: "Board", description: "Drag work between states and every dependent date recalculates." },
      { id: "chart", title: "Chart", description: "Any view becomes a chart without exporting a single row." },
      { id: "docs", title: "Docs", description: "Specs live beside the tickets they describe, not in another tool." },
      { id: "spaces", title: "Spaces", description: "Give each team a home that still rolls into the company view." },
    ],
  },
  ar: {
    eyebrow: "كيف يبدو الاستخدام",
    heading: "حيث يتبع الشكلُ العملَ",
    note: "أربع واجهات، ونموذج واحد تحتها.",
    railLabel: "الواجهات",
    tiles: [
      { id: "board", title: "اللوحة", description: "اسحب العمل بين الحالات فتُعاد حساب كل تاريخ مرتبط به." },
      { id: "chart", title: "الرسم البياني", description: "يتحوّل أي عرض إلى رسم بياني دون تصدير صف واحد." },
      { id: "docs", title: "المستندات", description: "تعيش المواصفات إلى جانب التذاكر التي تصفها، لا في أداة أخرى." },
      { id: "spaces", title: "المساحات", description: "امنح كل فريق مساحته الخاصة مع بقائها ضمن عرض الشركة." },
    ],
  },
}

export interface FeaturesMediaRailProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesMediaRailCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
}

export function FeaturesMediaRail({ locale = "en", eyebrow, heading, note, tiles, railLabel, className, ...props }: FeaturesMediaRailProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = tiles ?? copy.tiles

  return (
    <FeaturesSection labelledBy={headingId} gap="md" className={className} {...props}>
      <div className="flex flex-col gap-3 [@container(min-width:72rem)]:flex-row [@container(min-width:72rem)]:items-end [@container(min-width:72rem)]:justify-between [@container(min-width:72rem)]:gap-16">
        <FeaturesHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} className="flex-1" />
        <p className="text-sm text-muted-foreground">{note ?? copy.note}</p>
      </div>
      {list.length > 0 ? (
        <ul
          role="list"
          tabIndex={0}
          aria-label={railLabel ?? copy.railLabel}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-1 [touch-action:pan-x_pan-y] focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [@container(min-width:48rem)]:grid [@container(min-width:48rem)]:snap-none [@container(min-width:48rem)]:grid-cols-2 [@container(min-width:48rem)]:gap-x-6 [@container(min-width:48rem)]:gap-y-5 [@container(min-width:48rem)]:overflow-visible [@container(min-width:72rem)]:grid-cols-4 [@container(min-width:72rem)]:gap-x-5"
        >
          {list.map((tile) => (
            <li key={tile.id} className="group flex w-[220px] shrink-0 snap-start flex-col gap-4 [@container(min-width:48rem)]:w-auto">
              <FeaturesPhotoSlot
                photo={tile.image}
                className="aspect-[220/297] w-full rounded-lg [@container(min-width:48rem)]:aspect-[310/419] [@container(min-width:72rem)]:aspect-[297/400]"
                imageClassName="motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.03]"
              />
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold text-foreground">{tile.title}</h3>
                <p className="text-sm text-muted-foreground">{tile.description}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresMediaRailCopy = COPY
