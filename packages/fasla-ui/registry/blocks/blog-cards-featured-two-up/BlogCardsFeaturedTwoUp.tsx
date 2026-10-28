import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Featured + Two-Up.
 *
 * A section heading (an eyebrow, a heading and a line under it) over one large
 * featured article and two smaller ones beside it, on a `muted` band. The
 * featured card has a wide cover, then the category badge and read time, a
 * title, a summary and the author. The two side cards are shorter: a cover,
 * the badge and read time, a title of up to three lines, and the author with
 * a smaller avatar. The first article in `posts` is the featured one; the
 * rest are the side cards. The whole card is the link, named by its title.
 *
 * Desktop (Figma 1440) puts the featured card (840 wide) and a 416 column of
 * side cards in one row, the column's cards one above the other. Tablet (768)
 * makes the featured card full width and sets the two side cards beside each
 * other beneath it. Mobile (360) stacks all three.
 *
 * Hover and keyboard focus scale the featured cover from 1.00 to 1.02 and the
 * side covers to 1.04 (240ms) and turn the titles `info`; the summary and the
 * author don't move. On Mobile there is no hover; pressing a card dims it to
 * 96% for 120ms. Reduced motion turns both off. Nothing plays on load, on
 * scroll or on a timer.
 *
 * Arabic mirrors by the page's `dir`: the side column moves to the start side
 * of the row. Photographs are never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsFeaturedTwoUpPost {
  /** The cover photo. Without one the cover is a `muted` placeholder of the same size. */
  image?: { src: string; alt: string }
  /** The category badge. */
  category: React.ReactNode
  /** The read time, as written: "8 min read". */
  readTime: React.ReactNode
  /** The title, an `h3`, and the card's link. */
  title: React.ReactNode
  /** The summary. Only the featured card, the first, shows one. */
  summary?: React.ReactNode
  /** The author's name. Their initials fill the avatar. */
  author: string
  /** The date, as written: "Jul 28, 2026". */
  date: React.ReactNode
  /** Where the card goes. */
  href: string
}

export interface BlogCardsFeaturedTwoUpCopy {
  /** The small line over the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  /** The featured article first, then the side articles. */
  posts: BlogCardsFeaturedTwoUpPost[]
  /** Shown instead of the cards when `posts` is empty. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsFeaturedTwoUpCopy> = {
  en: {
    eyebrow: "EDITOR'S PICK",
    heading: "What the team is reading this week",
    description: "One long read and two short ones, chosen by the people who build Fasla.",
    posts: [
      {
        category: "Engineering",
        readTime: "8 min read",
        title: "Shipping dark mode without a second design file",
        summary:
          "One component tree, two modes, zero duplicated frames. The variable structure that made it possible.",
        author: "Tomas Berg",
        date: "Jul 28, 2026",
        href: "#",
      },
      {
        category: "Design Systems",
        readTime: "7 min read",
        title: "Naming things: a spacing scale that survives handoff",
        author: "Karim Nasser",
        date: "Jul 21, 2026",
        href: "#",
      },
      {
        category: "RTL & Arabic",
        readTime: "10 min read",
        title: "Mirroring is not flipping",
        author: "Noor Al-Amin",
        date: "Jul 14, 2026",
        href: "#",
      },
    ],
    emptyLabel: "No articles yet.",
  },
  ar: {
    eyebrow: "اختيار المحرر",
    heading: "ما يقرؤه الفريق هذا الأسبوع",
    description: "قراءة طويلة واثنتان قصيرتان، اختارها من يبنون فاصلة.",
    posts: [
      {
        category: "الهندسة",
        readTime: "قراءة 8 دقائق",
        title: "إطلاق الوضع الداكن دون ملف تصميم ثانٍ",
        summary: "شجرة مكوّنات واحدة، ووضعان، وصفر إطارات مكررة. بنية المتغيرات التي جعلت ذلك ممكنًا.",
        author: "توماس بيرغ",
        date: "28 يوليو 2026",
        href: "#",
      },
      {
        category: "أنظمة التصميم",
        readTime: "قراءة 7 دقائق",
        title: "تسمية الأشياء: مقياس تباعد يصمد بعد التسليم",
        author: "كريم ناصر",
        date: "21 يوليو 2026",
        href: "#",
      },
      {
        category: "العربية وRTL",
        readTime: "قراءة 10 دقائق",
        title: "الانعكاس ليس مجرد قلب",
        author: "نور الأمين",
        date: "14 يوليو 2026",
        href: "#",
      },
    ],
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsFeaturedTwoUpCopy = COPY

/*
 * The hover and focus classes, from Tablet up (Mobile has none), written out
 * whole: Tailwind finds a class by reading the source, so none is built from
 * pieces.
 */
const CARD =
  "group/card flex w-full flex-col overflow-hidden rounded-lg border bg-card transition-opacity duration-[120ms] motion-reduce:transition-none [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:[@container(max-width:39.99rem)]:opacity-[0.96]"
const COVER_IMG =
  "absolute inset-0 size-full object-cover transition-transform duration-[240ms] ease-out motion-reduce:transition-none"
const TITLE_HOVER =
  "group-hover/card:[@container(min-width:40rem)]:text-info group-focus-visible/card:[@container(min-width:40rem)]:text-info"
const FEATURED_HOVER =
  "group-hover/card:[@container(min-width:40rem)]:motion-safe:scale-[1.02] group-focus-visible/card:[@container(min-width:40rem)]:motion-safe:scale-[1.02]"
const SIDE_HOVER =
  "group-hover/card:[@container(min-width:40rem)]:motion-safe:scale-[1.04] group-focus-visible/card:[@container(min-width:40rem)]:motion-safe:scale-[1.04]"

function Byline({ author, date, size }: { author: string; date: React.ReactNode; size: "32" | "20" }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar
        variant="initials"
        size={size === "20" ? "24" : "32"}
        radius="rounded"
        name={author}
        aria-hidden="true"
        className={size === "20" ? "size-5" : undefined}
      />
      <span className="text-xs font-medium text-foreground">{author}</span>
      <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
      <span className="text-xs text-muted-foreground">{date}</span>
    </div>
  )
}

export interface BlogCardsFeaturedTwoUpProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsFeaturedTwoUpCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function BlogCardsFeaturedTwoUp({
  locale = "en",
  eyebrow,
  heading,
  description,
  posts,
  emptyLabel,
  className,
  ...props
}: BlogCardsFeaturedTwoUpProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const titleId = React.useId()
  const list = posts ?? copy.posts
  const [featured, ...side] = list
  const lines = { eyebrow: eyebrow ?? copy.eyebrow, description: description ?? copy.description }

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "[container-type:inline-size] bg-muted px-4 py-8 md:px-6 md:py-16 lg:px-20 lg:py-24",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12">
        <div className="flex flex-col gap-4">
          {lines.eyebrow ? <p className="text-sm font-medium uppercase text-primary">{lines.eyebrow}</p> : null}
          <h2
            id={headingId}
            className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl"
          >
            {heading ?? copy.heading}
          </h2>
          {lines.description ? <p className="text-xl text-muted-foreground">{lines.description}</p> : null}
        </div>

        {!featured ? (
          <p className="text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
        ) : (
          <div className="flex flex-col gap-8 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:gap-6">
            <a href={featured.href} aria-labelledby={`${titleId}-0`} className={cn(CARD, "[@container(min-width:64rem)]:flex-1")}>
              <div className="relative aspect-[328/185] w-full overflow-hidden bg-muted [@container(min-width:40rem)]:aspect-[720/331] [@container(min-width:64rem)]:aspect-[840/430]">
                {featured.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.image.src}
                    alt={featured.image.alt}
                    loading="lazy"
                    className={cn(COVER_IMG, FEATURED_HOVER)}
                  />
                ) : null}
              </div>
              <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" tone="secondary" size="sm" radius="rounded">
                    {featured.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{featured.readTime}</span>
                </div>
                <h3
                  id={`${titleId}-0`}
                  className={cn("text-xl font-semibold text-foreground [@container(min-width:40rem)]:text-2xl", TITLE_HOVER)}
                >
                  {featured.title}
                </h3>
                {featured.summary ? <p className="text-base text-muted-foreground">{featured.summary}</p> : null}
                <Byline author={featured.author} date={featured.date} size="32" />
              </div>
            </a>

            {side.length > 0 ? (
              <ul className="flex flex-col gap-6 [@container(min-width:40rem)]:flex-row [@container(min-width:64rem)]:w-[416px] [@container(min-width:64rem)]:shrink-0 [@container(min-width:64rem)]:flex-col [@container(min-width:64rem)]:items-start">
                {side.map((post, index) => (
                  <li key={index} className="flex w-full [@container(min-width:40rem)]:flex-1 [@container(min-width:64rem)]:flex-none">
                    <a href={post.href} aria-labelledby={`${titleId}-${index + 1}`} className={CARD}>
                      <div className="relative aspect-[328/164] w-full overflow-hidden bg-muted [@container(min-width:40rem)]:aspect-[348/174] [@container(min-width:64rem)]:aspect-[416/150]">
                        {post.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.image.src}
                            alt={post.image.alt}
                            loading="lazy"
                            className={cn(COVER_IMG, SIDE_HOVER)}
                          />
                        ) : null}
                      </div>
                      <div className="flex flex-col gap-2.5 p-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" tone="secondary" size="sm" radius="rounded">
                            {post.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{post.readTime}</span>
                        </div>
                        <h3 id={`${titleId}-${index + 1}`} className={cn("text-base font-semibold text-foreground", TITLE_HOVER)}>
                          {post.title}
                        </h3>
                        <Byline author={post.author} date={post.date} size="20" />
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
