import * as React from "react"
import { ArrowRightIcon, ClockIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Compact 4-Up Thumb Grid.
 *
 * A heading with a ghost "Browse all" button at its end, on one row at every
 * width, a hairline, and a grid of small article cards, 32px apart. A card is a thumbnail over a body: the
 * category in small capitals, a title of up to two lines, and a row with a
 * clock, the read time and the date. There is no summary and no author. The
 * whole card is the link, named by its title.
 *
 * The button is the Button atom's `xs` (26px) on Mobile and `sm` (32px) from
 * Tablet up, and the heading is 24px on Mobile and 30px above it.
 *
 * Desktop (Figma 1440) lays four cards in a row, thumbnails 302 by 170.
 * Tablet (768) makes a grid of two columns, thumbnails 348 by 196. Mobile
 * (360) is one column of rows: a 112px square thumbnail beside the text.
 *
 * Hover and keyboard focus scale the thumbnail from 1.00 to 1.04 inside its
 * clip (200ms), turn the title `info` and bring the clock from 60% to full
 * strength. The card doesn't lift. On Mobile there is no hover; pressing a
 * row dims it to 92% for 120ms. Reduced motion turns both off. Nothing plays
 * on load or on a timer.
 *
 * Arabic mirrors by the page's `dir`: the grid fills from the end side, and
 * on Mobile the thumbnail sits at the end of its row. Photographs are never
 * flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsCompact4UpThumbGridPost {
  /** The thumbnail. Without one it is a `muted` placeholder of the same size. */
  image?: { src: string; alt: string }
  /** The category, shown in capitals in English. */
  category: React.ReactNode
  /** The title, an `h3`, and the card's link. */
  title: React.ReactNode
  /** The read time, as written: "9 min". */
  readTime: React.ReactNode
  /** The date, as written: "May 26, 2026". */
  date: React.ReactNode
  /** Where the card goes. */
  href: string
}

export interface BlogCardsCompact4UpThumbGridCopy {
  /** The section heading, an `h2`. */
  heading: React.ReactNode
  /** The ghost button at the end of the header. Hidden when there is no label. */
  action: { label: React.ReactNode; href: string }
  /** The articles, in reading order. */
  posts: BlogCardsCompact4UpThumbGridPost[]
  /** Shown instead of the cards when `posts` is empty. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsCompact4UpThumbGridCopy> = {
  en: {
    heading: "Recently published",
    action: { label: "Browse all", href: "#" },
    posts: [
      {
        category: "Research",
        title: "What our first design-system survey told us",
        readTime: "9 min",
        date: "May 26, 2026",
        href: "#",
      },
      {
        category: "Content",
        title: "Writing UI copy that translates",
        readTime: "6 min",
        date: "May 19, 2026",
        href: "#",
      },
      {
        category: "Accessibility",
        title: "Focus rings that survive every theme",
        readTime: "4 min",
        date: "May 12, 2026",
        href: "#",
      },
      {
        category: "Engineering",
        title: "From Figma variables to CSS custom properties",
        readTime: "10 min",
        date: "May 5, 2026",
        href: "#",
      },
    ],
    emptyLabel: "No articles yet.",
  },
  ar: {
    heading: "نُشر حديثًا",
    action: { label: "تصفح الكل", href: "#" },
    posts: [
      {
        category: "الأبحاث",
        title: "ما أخبرنا به أول استبيان لنظام التصميم",
        readTime: "9 دقائق",
        date: "26 مايو 2026",
        href: "#",
      },
      {
        category: "المحتوى",
        title: "كتابة نصوص واجهات قابلة للترجمة",
        readTime: "6 دقائق",
        date: "19 مايو 2026",
        href: "#",
      },
      {
        category: "إمكانية الوصول",
        title: "حلقات تركيز تصمد في كل سمة",
        readTime: "4 دقائق",
        date: "12 مايو 2026",
        href: "#",
      },
      {
        category: "الهندسة",
        title: "من متغيرات Figma إلى خصائص CSS المخصصة",
        readTime: "10 دقائق",
        date: "5 مايو 2026",
        href: "#",
      },
    ],
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsCompact4UpThumbGridCopy = COPY

/*
 * The hover and focus classes, from Tablet up (Mobile has none), written out
 * whole: Tailwind finds a class by reading the source, so none is built from
 * pieces.
 */
const THUMB_HOVER =
  "group-hover/card:[@container(min-width:40rem)]:motion-safe:scale-[1.04] group-focus-visible/card:[@container(min-width:40rem)]:motion-safe:scale-[1.04]"
const TITLE_HOVER =
  "group-hover/card:[@container(min-width:40rem)]:text-info group-focus-visible/card:[@container(min-width:40rem)]:text-info"
const CLOCK_HOVER =
  "[@container(min-width:40rem)]:motion-safe:opacity-60 group-hover/card:[@container(min-width:40rem)]:motion-safe:opacity-100 group-focus-visible/card:[@container(min-width:40rem)]:motion-safe:opacity-100"

export interface BlogCardsCompact4UpThumbGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsCompact4UpThumbGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function BlogCardsCompact4UpThumbGrid({
  locale = "en",
  heading,
  action,
  posts,
  emptyLabel,
  className,
  ...props
}: BlogCardsCompact4UpThumbGridProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const titleId = React.useId()
  const list = posts ?? copy.posts
  const button = action ?? copy.action

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:px-20 lg:py-24",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8">
        <div className="flex items-center justify-between gap-3 [@container(min-width:40rem)]:gap-8">
          <h2
            id={headingId}
            className="min-w-0 text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl"
          >
            {heading ?? copy.heading}
          </h2>
          {button.label ? (
            <a
              href={button.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "xs" }),
                "shrink-0 [@container(min-width:40rem)]:h-8 [@container(min-width:40rem)]:px-3 [@container(min-width:40rem)]:text-sm"
              )}
            >
              {button.label}
              <ArrowRightIcon aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            </a>
          ) : null}
        </div>

        <hr aria-hidden="true" className="h-px w-full border-0 bg-border" />

        {list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:grid-cols-4">
            {list.map((post, index) => (
              <li key={index} className="flex">
                <a
                  href={post.href}
                  aria-labelledby={`${titleId}-${index}`}
                  className={cn(
                    "group/card flex w-full flex-row overflow-hidden rounded-md border bg-card transition-opacity duration-[120ms] motion-reduce:transition-none",
                    "[@container(min-width:40rem)]:flex-col",
                    "[outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    "active:[@container(max-width:39.99rem)]:opacity-[0.92]"
                  )}
                >
                  <div className="relative size-28 shrink-0 self-start overflow-hidden bg-muted [@container(min-width:40rem)]:aspect-video [@container(min-width:40rem)]:size-auto [@container(min-width:40rem)]:w-full [@container(min-width:40rem)]:self-auto">
                    {post.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.image.src}
                        alt={post.image.alt}
                        loading="lazy"
                        className={cn(
                          "absolute inset-0 size-full object-cover transition-transform duration-200 ease-out motion-reduce:transition-none",
                          THUMB_HOVER
                        )}
                      />
                    ) : null}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2 p-3.5 [@container(min-width:40rem)]:p-4">
                    <p className="text-xs font-medium uppercase text-muted-foreground">{post.category}</p>
                    <h3 id={`${titleId}-${index}`} className={cn("text-base font-semibold text-foreground", TITLE_HOVER)}>
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ClockIcon
                        aria-hidden="true"
                        className={cn(
                          "size-3.5 shrink-0 transition-opacity duration-200 motion-reduce:transition-none",
                          CLOCK_HOVER
                        )}
                      />
                      <span>{post.readTime}</span>
                      <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
                      <span>{post.date}</span>
                    </div>
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
