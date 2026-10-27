"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Gallery` (42478:479), Type=Album Cards.
 *
 * A row of albums, each drawn as a small stack of prints: the cover photo in
 * front and two blank prints fanned out behind it, peeking above its top
 * edge. Under each stack, the album's name, a meta line ("48 photos · May")
 * and an arrow. Three across on Desktop, two on Tablet (the third album
 * alone at the start of the second row), one on a phone. The header puts
 * the description at the end of the heading's row on Desktop, its foot
 * level with the heading's, and under the heading from Tablet down. No
 * photos come with the block: pass each album's `cover`, and until then the
 * cover shows a `muted` placeholder of the same box.
 *
 * Each album is one link, the whole card, so it is one Tab stop with one
 * focus ring. Figma's arrow is a Ghost Icon Button; inside a link it is the
 * button's look on a `span`, hidden from screen readers, and it takes the
 * button's hover when the card is hovered.
 *
 * The stack scales with the card: the prints' offsets, widths and the
 * cover's drop are shares of the stack's width, as Figma's three breakpoints
 * keep them (the cover is 384 of the 395px card on Desktop, the full card
 * below). The back prints are `muted` and `secondary`, with a `border`
 * stroke; the cover carries the large shadow.
 *
 * In Arabic the cards fill from the right and each stack is the mirror
 * image: the prints' offsets are logical and they turn the other way about
 * their top-right corner. Figma's RTL variants turn them about the top-left
 * instead, which drops the fan about 25px lower than a mirror; this follows
 * the mirror. The arrow points to the end, so it flips. Numbers in the
 * Arabic copy sit in `<bdi dir="ltr">`, and the meta's middle dot is its own
 * span, so it stays between the two parts in both directions. The
 * photographs are never flipped.
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

export interface GalleryAlbumCardsPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryAlbumCardsAlbum {
  /** The album's name, an `h3`. One line; trims when too long. */
  title: React.ReactNode
  /** The first part of the meta line: how many photos. */
  count: React.ReactNode
  /** The second part, after the middle dot: when. Hidden when empty. */
  date?: React.ReactNode
  /** Where the card links: the album itself. */
  href: string
  /**
   * The front print's photo. None by default: a `muted` placeholder.
   * @default none: `muted` placeholder
   */
  cover?: GalleryAlbumCardsPhoto
}

export interface GalleryAlbumCardsCopy {
  /** The short label above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text beside (Desktop) or under the heading. */
  description: React.ReactNode
  /** The albums, in order. Each has a `title`, a `count`, a `date`, an `href` and an optional `cover`. */
  albums: GalleryAlbumCardsAlbum[]
  /** Shown in place of the albums when `albums` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryAlbumCardsCopy> = {
  en: {
    eyebrow: "ALBUMS",
    heading: "Browse by collection",
    description: "Every event, trip and launch gets its own album. Pick one to open the full set.",
    albums: [
      { title: "Offsite 2026", count: "48 photos", date: "May", href: "#offsite-2026" },
      { title: "Studio life", count: "132 photos", date: "Ongoing", href: "#studio-life" },
      { title: "New offices", count: "64 photos", date: "July", href: "#new-offices" },
    ],
    empty: "No albums yet.",
  },
  ar: {
    eyebrow: "الألبومات",
    heading: "تصفح حسب المجموعة",
    description: "لكل مناسبة ورحلة وإطلاق ألبوم خاص. اختر واحدًا لعرض المجموعة كاملة.",
    albums: [
      {
        title: (
          <>
            رحلة الفريق <bdi dir="ltr">2026</bdi>
          </>
        ),
        count: (
          <>
            <bdi dir="ltr">48</bdi> صورة
          </>
        ),
        date: "مايو",
        href: "#offsite-2026",
      },
      {
        title: "حياة الاستوديو",
        count: (
          <>
            <bdi dir="ltr">132</bdi> صورة
          </>
        ),
        date: "مستمر",
        href: "#studio-life",
      },
      {
        title: "المكاتب الجديدة",
        count: (
          <>
            <bdi dir="ltr">64</bdi> صورة
          </>
        ),
        date: "يوليو",
        href: "#new-offices",
      },
    ],
    empty: "لا توجد ألبومات بعد.",
  },
}

export interface GalleryAlbumCardsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryAlbumCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function GalleryAlbumCards({
  locale = "en",
  eyebrow,
  heading,
  description,
  albums,
  empty,
  className,
  ...props
}: GalleryAlbumCardsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = albums ?? copy.albums

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <header className="flex flex-col gap-2 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-end [@container(min-width:64rem)]:gap-16">
          <div className="flex min-w-0 flex-col gap-2 [@container(min-width:64rem)]:flex-1 [@container(min-width:64rem)]:gap-4">
            <p className="text-xs font-medium text-primary">{eyebrow ?? copy.eyebrow}</p>
            <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
              {heading ?? copy.heading}
            </h2>
          </div>
          <p className="text-base text-muted-foreground [@container(min-width:64rem)]:w-[440px] [@container(min-width:64rem)]:shrink-0">{description ?? copy.description}</p>
        </header>

        {list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-8 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:gap-x-6 [@container(min-width:64rem)]:grid-cols-3 [@container(min-width:64rem)]:gap-x-8">
            {list.map((album, index) => (
              <li key={index}>
                <a
                  href={album.href}
                  className="group flex flex-col gap-4 rounded-lg [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {/* The stack: two blank prints behind the cover, fanned from their top corner. */}
                  <div className="relative w-full [@container(min-width:64rem)]:w-[97.2%]">
                    <div className="absolute start-[5.2%] top-0 aspect-[352/264] w-[91.7%] origin-top-left rotate-[-4deg] rounded-lg border border-border bg-muted [&:dir(rtl)]:origin-top-right [&:dir(rtl)]:rotate-[4deg]" />
                    <div className="absolute start-[3.1%] top-[4.67%] aspect-[368/270] w-[95.8%] origin-top-left rotate-[3deg] rounded-lg border border-border bg-secondary [&:dir(rtl)]:origin-top-right [&:dir(rtl)]:rotate-[-3deg]" />
                    <div className="relative mt-[7.3%] aspect-[384/272] overflow-hidden rounded-lg bg-muted shadow-lg">
                      {album.cover ? (
                        <img
                          src={album.cover.src}
                          alt={album.cover.alt}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 size-full object-cover"
                        />
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <h3 className="truncate text-lg font-semibold text-foreground">{album.title}</h3>
                      <p className="flex min-w-0 items-center gap-1 whitespace-nowrap text-sm text-muted-foreground">
                        <span>{album.count}</span>
                        {album.date ? (
                          <>
                            <span aria-hidden>·</span>
                            <span>{album.date}</span>
                          </>
                        ) : null}
                      </p>
                    </div>
                    <span
                      aria-hidden
                      className={buttonVariants({
                        variant: "ghost",
                        size: "icon-sm",
                        radius: "rounded",
                        className: "group-hover:bg-accent",
                      })}
                    >
                      <ArrowRight size={16} strokeWidth={1.5} absoluteStrokeWidth className="[&:dir(rtl)]:-scale-x-100" />
                    </span>
                  </div>
                </a>
              </li>
            ))}
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
export const galleryAlbumCardsCopy = COPY
