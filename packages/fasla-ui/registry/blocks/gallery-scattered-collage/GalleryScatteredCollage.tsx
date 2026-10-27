"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Gallery` (42478:479), Type=Scattered Collage.
 *
 * Seven captioned prints tipped out across the page under a centred header,
 * each turned a few degrees, like postcards on a table, with one outline
 * link under them. No photos come with the block: give each item an
 * `image`, and until then its print shows a `muted` placeholder of the same
 * size.
 *
 * From Tablet up the prints sit in two rails, as Error State's Photo Collage
 * Scatter keeps its prints: the first four in the top rail, the last three
 * in the bottom one. Inside a rail every print is stacked in the same grid
 * cell and moved to its spot with margins, which resolve against the rail's
 * width, so at Figma's 768 and 1440 each print lands on Figma's offset and
 * width, and at any other width the collage scales with the page; a print
 * never grows past Figma's size. Because the prints stay in the flow, each
 * rail is as tall as its lowest print, caption and all, so the bottom rail
 * can never slide over a caption in the top one when the photos shrink and
 * the captions don't. On Desktop that puts the bottom rail 18px lower than
 * Figma, where the Dolomites print overlaps it by that much.
 *
 * On a phone the prints are a two-column grid, turned alternately 3 degrees
 * either way, and an odd last print takes the full width, as Figma's Mobile
 * variant lays them. Its photos are 93px tall whatever their width.
 *
 * Offsets are logical (`ms`), so in Arabic each print moves to the mirrored
 * spot, as Figma's RTL variants place them. Figma keeps every print's angle
 * in RTL, turning it about its top-left corner, and so does the block. The
 * photographs are never flipped. A caption's two parts are isolated, so the
 * middle dot stays between them in both directions.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container, so the block lays out for the room it is
 * given, such as a docs preview narrower than the screen. The base classes
 * are Figma's Mobile (360); `[@container(min-width:40rem)]:` is its Tablet,
 * from 640px of content (Figma's Tablet, 768 less its padding), and
 * `[@container(min-width:64rem)]:` its Desktop, from 1024px of content.
 * The section's own padding still follows the window, since an element
 * can't query itself.
 */

export interface GalleryScatteredCollagePhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryScatteredCollageItem {
  /** The caption's first part: where. */
  place: React.ReactNode
  /** The second part, after the middle dot: when. Hidden when empty. */
  date?: React.ReactNode
  /** The print's photo. Without it the print shows a `muted` placeholder. */
  image?: GalleryScatteredCollagePhoto
}

export interface GalleryScatteredCollageAction {
  label: React.ReactNode
  href: string
}

export interface GalleryScatteredCollageCopy {
  /** The short label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /**
   * The prints, in Figma's order: the top rail from the start edge, then the
   * bottom rail. Figma's collage holds seven; prints past the seventh are
   * not shown.
   */
  items: GalleryScatteredCollageItem[]
  /** The outline link under the collage, to the full album. Hidden when null. */
  action: GalleryScatteredCollageAction | null
  /** Shown in place of the collage when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryScatteredCollageCopy> = {
  en: {
    eyebrow: "SNAPSHOTS",
    heading: "Postcards from the road",
    description: "Unedited, slightly crooked, exactly how we remember it.",
    items: [
      { place: "Lisbon", date: "May" },
      { place: "Tokyo", date: "March" },
      { place: "Dolomites", date: "July" },
      { place: "Kyoto", date: "Sept" },
      { place: "Lake Bled", date: "Aug" },
      { place: "Vineyard", date: "June" },
      { place: "Coast road", date: "July" },
    ],
    action: { label: "See all 128 photos", href: "#gallery" },
    empty: "No photos yet.",
  },
  ar: {
    eyebrow: "لقطات",
    heading: "بطاقات من الطريق",
    description: "بلا تعديل، مائلة قليلًا، تمامًا كما نتذكرها.",
    items: [
      { place: "لشبونة", date: "مايو" },
      { place: "طوكيو", date: "مارس" },
      { place: "الدولوميت", date: "يوليو" },
      { place: "كيوتو", date: "سبتمبر" },
      { place: "بحيرة بليد", date: "أغسطس" },
      { place: "الكرم", date: "يونيو" },
      { place: "طريق الساحل", date: "يوليو" },
    ],
    action: {
      label: (
        <>
          عرض كل الـ <bdi dir="ltr">128</bdi> صورة
        </>
      ),
      href: "#gallery",
    },
    empty: "لا توجد صور بعد.",
  },
}

type Slot = {
  /** The print's offset and width, as shares of its rail: Figma's at 768 (`md:`) and 1440 (`lg:`). */
  place: string
  /** The photo's shape from Tablet up, width over height. */
  aspect: string
  /** The angle: on a phone, then from Tablet up. Figma turns a print anticlockwise for a positive angle, CSS clockwise, so each is Figma's negated. */
  rotate: string
}

/** The seven prints, in Figma's order. The first four make the top rail. */
const SLOTS: Slot[] = [
  {
    place: "[@container(min-width:40rem)]:ms-[1.875%] [@container(min-width:40rem)]:mt-[4.844%] [@container(min-width:40rem)]:w-[28.906%] [@container(min-width:40rem)]:max-w-[185px] [@container(min-width:64rem)]:ms-[1.923%] [@container(min-width:64rem)]:mt-[3.205%] [@container(min-width:64rem)]:w-[22.756%] [@container(min-width:64rem)]:max-w-[284px]",
    aspect: "[@container(min-width:40rem)]:aspect-[260/190]",
    rotate: "rotate-[3deg] [@container(min-width:40rem)]:rotate-[6deg]",
  },
  {
    place: "[@container(min-width:40rem)]:ms-[23.438%] [@container(min-width:40rem)]:mt-0 [@container(min-width:40rem)]:w-[27.031%] [@container(min-width:40rem)]:max-w-[173px] [@container(min-width:64rem)]:ms-[24.038%] [@container(min-width:64rem)]:w-[21.154%] [@container(min-width:64rem)]:max-w-[264px]",
    aspect: "[@container(min-width:40rem)]:aspect-[240/180]",
    rotate: "rotate-[-3deg] [@container(min-width:40rem)]:rotate-[-4deg]",
  },
  {
    place: "[@container(min-width:40rem)]:ms-[43.75%] [@container(min-width:40rem)]:mt-[8.438%] [@container(min-width:40rem)]:w-[30.938%] [@container(min-width:40rem)]:max-w-[198px] [@container(min-width:64rem)]:ms-[44.872%] [@container(min-width:64rem)]:mt-[5.609%] [@container(min-width:64rem)]:w-[24.359%] [@container(min-width:64rem)]:max-w-[304px]",
    aspect: "[@container(min-width:40rem)]:aspect-[280/200]",
    rotate: "rotate-[3deg] [@container(min-width:40rem)]:rotate-[3deg]",
  },
  {
    place: "[@container(min-width:40rem)]:ms-[67.969%] [@container(min-width:40rem)]:mt-[1.094%] [@container(min-width:40rem)]:w-[27.969%] [@container(min-width:40rem)]:max-w-[179px] [@container(min-width:64rem)]:ms-[69.712%] [@container(min-width:64rem)]:mt-[0.801%] [@container(min-width:64rem)]:w-[21.955%] [@container(min-width:64rem)]:max-w-[274px]",
    aspect: "[@container(min-width:40rem)]:aspect-[250/190]",
    rotate: "rotate-[-3deg] [@container(min-width:40rem)]:rotate-[-6deg]",
  },
  {
    place: "[@container(min-width:40rem)]:ms-[12.5%] [@container(min-width:40rem)]:mt-0 [@container(min-width:40rem)]:w-[27.969%] [@container(min-width:40rem)]:max-w-[179px] [@container(min-width:64rem)]:ms-[12.821%] [@container(min-width:64rem)]:w-[21.955%] [@container(min-width:64rem)]:max-w-[274px]",
    aspect: "[@container(min-width:40rem)]:aspect-[250/180]",
    rotate: "rotate-[3deg] [@container(min-width:40rem)]:rotate-[-5deg]",
  },
  {
    place: "[@container(min-width:40rem)]:ms-[36.719%] [@container(min-width:40rem)]:mt-[2.344%] [@container(min-width:40rem)]:w-[27.031%] [@container(min-width:40rem)]:max-w-[173px] [@container(min-width:64rem)]:ms-[37.66%] [@container(min-width:64rem)]:mt-[1.603%] [@container(min-width:64rem)]:w-[21.154%] [@container(min-width:64rem)]:max-w-[264px]",
    aspect: "[@container(min-width:40rem)]:aspect-[240/180]",
    rotate: "rotate-[-3deg] [@container(min-width:40rem)]:rotate-[4deg]",
  },
  {
    place: "[@container(min-width:40rem)]:ms-[59.375%] [@container(min-width:40rem)]:mt-[1.094%] [@container(min-width:40rem)]:w-[29.844%] [@container(min-width:40rem)]:max-w-[191px] [@container(min-width:64rem)]:ms-[60.897%] [@container(min-width:64rem)]:mt-[0.801%] [@container(min-width:64rem)]:w-[23.558%] [@container(min-width:64rem)]:max-w-[294px]",
    aspect: "[@container(min-width:40rem)]:aspect-[270/200]",
    rotate: "rotate-[3deg] [@container(min-width:40rem)]:rotate-[-3deg]",
  },
]

const TOP_RAIL = 4

export interface GalleryScatteredCollageProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryScatteredCollageCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function GalleryScatteredCollage({
  locale = "en",
  eyebrow,
  heading,
  description,
  items,
  action,
  empty,
  className,
  ...props
}: GalleryScatteredCollageProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const label = eyebrow ?? copy.eyebrow
  const link = action === undefined ? copy.action : action
  const prints = (items ?? copy.items).slice(0, SLOTS.length)

  const print = (item: GalleryScatteredCollageItem, index: number) => {
    const slot = SLOTS[index] as Slot
    const fullRow = index === prints.length - 1 && prints.length % 2 === 1
    return (
      <figure
        key={index}
        className={cn(
          "flex min-w-0 origin-center flex-col gap-2 rounded-[var(--radius-sm)] bg-card p-3 shadow-lg",
          "[@container(min-width:40rem)]:origin-top-left [@container(min-width:40rem)]:self-start [@container(min-width:40rem)]:justify-self-start [@container(min-width:40rem)]:[grid-area:1/1]",
          fullRow && "col-span-2",
          slot.rotate,
          slot.place
        )}
      >
        <div className={cn("relative h-[93px] overflow-hidden rounded-[2px] bg-muted [@container(min-width:40rem)]:h-auto", slot.aspect)}>
          {item.image ? (
            <img
              src={item.image.src}
              alt={item.image.alt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
          ) : null}
        </div>
        <figcaption className="min-w-0 truncate whitespace-nowrap text-xs font-medium text-muted-foreground">
          <bdi>{item.place}</bdi>
          {item.date ? (
            <>
              <span aria-hidden="true" className="mx-1">
                ·
              </span>
              <bdi>{item.date}</bdi>
            </>
          ) : null}
        </figcaption>
      </figure>
    )
  }

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <header className="flex flex-col items-center gap-3 text-center">
          <div className="flex w-full flex-col gap-1.5">
            {label ? <p className="text-xs font-medium text-primary">{label}</p> : null}
            <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
              {heading ?? copy.heading}
            </h2>
          </div>
          <p className="w-full max-w-[560px] text-base text-muted-foreground">{description ?? copy.description}</p>
        </header>

        {prints.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-4 [@container(min-width:40rem)]:flex [@container(min-width:40rem)]:flex-col [@container(min-width:40rem)]:gap-2 [@container(min-width:40rem)]:pb-[31px] [@container(min-width:40rem)]:pt-4 [@container(min-width:64rem)]:gap-0 [@container(min-width:64rem)]:pb-[22px] [@container(min-width:64rem)]:pt-5">
            <div className="contents [@container(min-width:40rem)]:grid [@container(min-width:40rem)]:grid-cols-1">{prints.slice(0, TOP_RAIL).map((item, index) => print(item, index))}</div>
            {prints.length > TOP_RAIL ? (
              <div className="contents [@container(min-width:40rem)]:grid [@container(min-width:40rem)]:grid-cols-1">
                {prints.slice(TOP_RAIL).map((item, index) => print(item, TOP_RAIL + index))}
              </div>
            ) : null}
          </div>
        )}

        {link ? (
          <div className="flex justify-center">
            <a href={link.href} className={buttonVariants({ variant: "outline" })}>
              {link.label}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const galleryScatteredCollageCopy = COPY
