"use client"

import * as React from "react"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Gallery` (42478:479), Type=Hover Index List.
 *
 * A project index: a header with a ghost "View all" link at its end, then a
 * ruled list of projects (number, name, category, year, an arrow) beside one
 * tilted preview photo. Hover a row, or move keyboard focus onto it, and the
 * row fills `muted`, its arrow nudges 2px towards its corner and darkens, and
 * the preview crossfades (250ms) to that row's photo. Leaving the list keeps
 * the last row's photo, so the preview never goes blank. Before anything is
 * hovered it shows the first row's photo. Every row is a link.
 *
 * Figma highlights row 02 as its hover sample while the preview shows row
 * 01's photo; the code starts on row 01 with no row highlighted, and the
 * highlight follows the pointer and focus. Figma's note also asks for a small
 * tilt settle as the photo swaps; the preview here holds Figma's resting tilt
 * and only crossfades. All photos sit stacked in the preview and only the
 * active one is shown; the hidden ones are hidden from screen readers too.
 *
 * Desktop: the list fills the row and the 400×300 preview sits at its end,
 * turned 3° and lifted by the xl shadow. Tablet: the preview drops under the
 * list at full width and 300px tall, untilted. Mobile: no preview, and the
 * year is dropped. At every width a row's name takes the free space on one
 * line and its category sits under it, so a narrow list never wraps a name
 * into its category (Figma's Desktop sets the category in a column beside
 * the name).
 * The header stacks on a phone, the link under the heading.
 *
 * RTL: the number column moves to the right, the arrow flips to point up and
 * to the left (and nudges that way), the year aligns to the row's end, and
 * the preview sits on the left with its tilt reversed, as Figma's RTL
 * variants draw it. The photographs are never flipped.
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

export interface GalleryHoverIndexListPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryHoverIndexListAction {
  label: React.ReactNode
  href: string
}

export interface GalleryHoverIndexListItem {
  /** The project's name. */
  title: React.ReactNode
  /** Its category, beside the name (under it on a phone). */
  category: React.ReactNode
  /** Its year. Hidden on a phone. */
  year: React.ReactNode
  /** Where the row leads. */
  href: string
}

export interface GalleryHoverIndexListCopy {
  /** The small line above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The ghost link at the header's end. Hidden when null. */
  viewAll: GalleryHoverIndexListAction | null
  /** The rows, in order: a `title`, `category`, `year` and `href`. Rows are numbered 01, 02… in this order. */
  items: GalleryHoverIndexListItem[]
  /** Shown in place of the list when it is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryHoverIndexListCopy> = {
  en: {
    eyebrow: "INDEX",
    heading: "Selected projects, 2024 – 2026",
    viewAll: { label: "View all 48", href: "#" },
    items: [
      { title: "Atrium refit", category: "Spaces", year: "2026", href: "#" },
      { title: "Brass table lamp", category: "Objects", year: "2026", href: "#" },
      { title: "Studio portraits", category: "People", year: "2025", href: "#" },
      { title: "Riverside offices", category: "Spaces", year: "2025", href: "#" },
      { title: "Ceramic series", category: "Objects", year: "2024", href: "#" },
    ],
    empty: "No photos yet.",
  },
  ar: {
    eyebrow: "الفهرس",
    heading: (
      <>
        مشاريع مختارة، <bdi dir="ltr">2024 – 2026</bdi>
      </>
    ),
    viewAll: {
      label: (
        <>
          عرض الـ <bdi dir="ltr">48</bdi> كلها
        </>
      ),
      href: "#",
    },
    items: [
      { title: "تجديد البهو", category: "مساحات", year: "2026", href: "#" },
      { title: "مصباح طاولة نحاسي", category: "قطع", year: "2026", href: "#" },
      { title: "صور الاستوديو الشخصية", category: "أشخاص", year: "2025", href: "#" },
      { title: "مكاتب ريفرسايد", category: "مساحات", year: "2025", href: "#" },
      { title: "سلسلة السيراميك", category: "قطع", year: "2024", href: "#" },
    ],
    empty: "لا توجد صور بعد.",
  },
}

export interface GalleryHoverIndexListProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryHoverIndexListCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * One preview photo per row, in the order of `items`. Figma draws one, row
   * 01's (Atrium refit). None by default: the preview shows a `muted`
   * placeholder.
   * @default none: `muted` placeholders
   */
  photos?: GalleryHoverIndexListPhoto[]
  /**
   * The row whose photo the preview shows before anything is hovered or
   * focused, by index.
   * @default 0
   */
  defaultActiveIndex?: number
}

export function GalleryHoverIndexList({
  locale = "en",
  eyebrow,
  heading,
  viewAll,
  items,
  empty,
  photos = [],
  defaultActiveIndex = 0,
  className,
  ...props
}: GalleryHoverIndexListProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const kicker = eyebrow ?? copy.eyebrow
  const link = viewAll === undefined ? copy.viewAll : viewAll
  const rows = items ?? copy.items
  const [active, setActive] = React.useState(defaultActiveIndex)

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-10">
        <header className="flex flex-col items-start gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-16">
          <div className="flex min-w-0 flex-col gap-3 [@container(min-width:40rem)]:flex-1">
            {kicker ? <p className="text-xs font-medium text-primary">{kicker}</p> : null}
            <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
              {heading ?? copy.heading}
            </h2>
          </div>
          {link ? (
            <a href={link.href} className={buttonVariants({ variant: "ghost" })}>
              {link.label}
              <ArrowRight size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="[&:dir(rtl)]:-scale-x-100" />
            </a>
          ) : null}
        </header>

        {rows.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <div className="flex flex-col gap-8 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:gap-12">
            <ul className="min-w-0 border-t border-border [@container(min-width:64rem)]:flex-1">
              {rows.map((item, index) => (
                <li key={index} className="border-b border-border">
                  <a
                    href={item.href}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    className="group/row flex items-center gap-3 rounded-md px-4 py-5 transition-colors duration-150 [outline:none] hover:bg-muted focus-visible:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none [@container(min-width:40rem)]:gap-6"
                  >
                    <span className="w-10 shrink-0 text-sm font-medium text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {/* The title takes the row's free space on one line, the category on its own line under it. */}
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-lg font-medium text-foreground [@container(min-width:40rem)]:text-2xl">{item.title}</span>
                      <span className="truncate text-sm text-muted-foreground">{item.category}</span>
                    </span>
                    <span className="hidden w-14 shrink-0 whitespace-nowrap text-end text-sm text-muted-foreground [@container(min-width:40rem)]:block">
                      {item.year}
                    </span>
                    {/* The arrow moves by its logical inset, so it nudges towards its own corner in either direction. */}
                    <span className="relative size-5 shrink-0">
                      <ArrowUpRight
                        size={20}
                        strokeWidth={1.5}
                        absoluteStrokeWidth
                        aria-hidden
                        className="absolute start-0 top-0 text-muted-foreground transition-[inset-inline-start,top,color] duration-150 group-hover/row:-top-0.5 group-hover/row:start-0.5 group-hover/row:text-foreground group-focus-visible/row:-top-0.5 group-focus-visible/row:start-0.5 group-focus-visible/row:text-foreground motion-reduce:transition-none [&:dir(rtl)]:-scale-x-100"
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="relative hidden h-[300px] w-full overflow-hidden rounded-lg bg-muted shadow-xl [@container(min-width:40rem)]:block [@container(min-width:64rem)]:w-[400px] [@container(min-width:64rem)]:shrink-0 [@container(min-width:64rem)]:rotate-[3deg] [@container(min-width:64rem)]:[&:dir(rtl)]:rotate-[-3deg]">
              {rows.map((_, index) => {
                const photo = photos[index]
                const shown = index === active
                return photo ? (
                  <img
                    key={index}
                    src={photo.src}
                    alt={shown ? photo.alt : ""}
                    aria-hidden={shown ? undefined : true}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "absolute inset-0 size-full object-cover transition-opacity duration-[250ms] motion-reduce:transition-none",
                      shown ? "opacity-100" : "opacity-0"
                    )}
                  />
                ) : null
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const galleryHoverIndexListCopy = COPY
