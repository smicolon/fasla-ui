"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Gallery` (42478:479), Type=Hover Caption Cards.
 *
 * A centred header (eyebrow and heading) over three tall photo cards in a
 * row; on a phone they stack. Each card carries a "+" Icon Button at its top
 * end and a caption pill (title and a short meta line) at its bottom start,
 * both on the photo. No photos come with the block: pass each card's
 * `image`, and until then each card is a `muted` placeholder of the same
 * size.
 *
 * Figma's motion notes say the pill is hidden at rest and slides up 8px and
 * fades in on hover, while the photo zooms to 1.05 and the "+" turns 45°;
 * on touch devices, and always on a phone, the pill stays visible. So the
 * pill only hides from Tablet up and only where the pointer can hover
 * (`@media (hover: hover)`), and it shows again on `focus-within` as well as
 * on hover, so keyboard users get it when the "+" has focus. It only fades:
 * it never leaves the accessibility tree, so screen readers always hear the
 * caption. With reduced motion it appears without sliding.
 *
 * The "+" is the card's one action (Figma: "Click opens the Lightbox
 * Viewer"). Give an item an `href` and it is a link; otherwise it is a
 * button that calls `onOpen` with the card's index. Its name is `openLabel`,
 * and the card's title describes it.
 *
 * At Tablet the pill fills the card's width and its title may wrap, as
 * Figma's Tablet draws it; at Desktop and on a phone it hugs its text and
 * the title stays on one line, trimmed if it must.
 *
 * In Arabic the pill moves to the bottom right and the "+" to the top left,
 * and the cards run right to left, all through logical sides. The "+" does
 * not mirror, and its 45° turn is the same. The photographs are never
 * flipped.
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

export interface GalleryHoverCaptionCardsPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryHoverCaptionCardsItem {
  /** The pill's first line, the card's title. */
  title: React.ReactNode
  /** The pill's second line: where or when. */
  meta: React.ReactNode
  /** The card's photo. A `muted` placeholder when missing. */
  image?: GalleryHoverCaptionCardsPhoto
  /** Makes the "+" a link to this address instead of a button that calls `onOpen`. */
  href?: string
}

export interface GalleryHoverCaptionCardsCopy {
  /** The short label above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /**
   * The cards, in order from the start side. Figma draws three, one per
   * column; more wrap onto further rows of three.
   */
  items: GalleryHoverCaptionCardsItem[]
  /** The accessible name of each card's "+" button. The card's title describes it. */
  openLabel: string
  /** Shown in place of the cards when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryHoverCaptionCardsCopy> = {
  en: {
    eyebrow: "BEHIND THE SCENES",
    heading: "Some of our favourite moments",
    items: [
      { title: "When we shipped the big one", meta: "Offsite, October" },
      { title: "Team dinner in London", meta: "Kitchen table, Shoreditch" },
      { title: "Late nights, early metrics", meta: "Launch week" },
    ],
    openLabel: "Open photo",
    empty: "No photos yet.",
  },
  ar: {
    eyebrow: "من كواليس العمل",
    heading: "بعض من لحظاتنا المفضلة",
    items: [
      { title: "يوم أطلقنا الإصدار الكبير", meta: "رحلة الفريق، أكتوبر" },
      { title: "عشاء الفريق في لندن", meta: "طاولة المطبخ، شورديتش" },
      { title: "ليالٍ طويلة وأرقام مبكرة", meta: "أسبوع الإطلاق" },
    ],
    openLabel: "افتح الصورة",
    empty: "لا توجد صور بعد.",
  },
}

/** The library's buttons with a light focus ring, so it shows on the photo. */
const ON_PHOTO_RING = "after:ring-foreground-inverse dark:after:ring-foreground"

/**
 * Hidden at rest from Tablet up where the pointer is a mouse or trackpad, 8px
 * low; shown on the card's hover or focus. Always shown on a phone and on
 * touch. `pointer:fine`, not `hover:hover`: Storybook's pseudo-states addon
 * rewrites any `:hover` it finds in a class, media queries included.
 */
const PILL_REVEAL = cn(
  "transition-[opacity,transform] duration-[250ms] ease-out motion-reduce:transition-none",
  "[@container(min-width:40rem)]:[@media(pointer:fine)]:translate-y-2 [@container(min-width:40rem)]:[@media(pointer:fine)]:opacity-0",
  "group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
)

export interface GalleryHoverCaptionCardsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryHoverCaptionCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Called with a card's index when its "+" is pressed, for a card without an `href`: open your lightbox here. */
  onOpen?: (index: number) => void
}

export function GalleryHoverCaptionCards({
  locale = "en",
  eyebrow,
  heading,
  items,
  openLabel,
  empty,
  onOpen,
  className,
  ...props
}: GalleryHoverCaptionCardsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const baseId = React.useId()
  const list = items ?? copy.items
  const label = openLabel ?? copy.openLabel

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs font-medium text-primary">{eyebrow ?? copy.eyebrow}</p>
          <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
            {heading ?? copy.heading}
          </h2>
        </div>

        {list.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-3 [@container(min-width:40rem)]:gap-6">
            {list.map((item, index) => {
              const titleId = `${baseId}-${index}`
              const icon = (
                <Plus
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.5}
                  absoluteStrokeWidth
                  className="transition-transform duration-[250ms] ease-out group-hover:rotate-45 group-focus-within:rotate-45 motion-reduce:transition-none"
                />
              )
              return (
                <li
                  key={index}
                  className="group relative isolate flex h-[400px] flex-col justify-between overflow-hidden rounded-lg bg-muted p-4 [@container(min-width:64rem)]:h-[520px]"
                >
                  {item.image ? (
                    <img
                      src={item.image.src}
                      alt={item.image.alt}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
                    />
                  ) : null}

                  <div className="flex justify-end">
                    {item.href ? (
                      <a
                        href={item.href}
                        aria-label={label}
                        aria-describedby={titleId}
                        className={buttonVariants({ variant: "secondary", size: "icon-sm", radius: "rounded", className: ON_PHOTO_RING })}
                      >
                        {icon}
                      </a>
                    ) : (
                      <Button
                        variant="secondary"
                        size="icon-sm"
                        radius="rounded"
                        aria-label={label}
                        aria-describedby={titleId}
                        onClick={() => onOpen?.(index)}
                        className={ON_PHOTO_RING}
                      >
                        {icon}
                      </Button>
                    )}
                  </div>

                  <div
                    className={cn(
                      "flex min-w-0 max-w-full flex-col gap-0.5 self-start rounded-md bg-card px-3 py-2.5 text-start shadow [@container(min-width:40rem)]:self-stretch [@container(min-width:64rem)]:self-start",
                      PILL_REVEAL
                    )}
                  >
                    <p
                      id={titleId}
                      className="truncate text-sm font-semibold text-foreground [@container(min-width:40rem)]:whitespace-normal [@container(min-width:64rem)]:whitespace-nowrap"
                    >
                      {item.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{item.meta}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const galleryHoverCaptionCardsCopy = COPY
