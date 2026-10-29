import * as React from "react"
import { ArrowLeftIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Related Posts Strip.
 *
 * Related reading under a post, on a `muted` band. A header with an eyebrow, a
 * title that names the post, and a ghost "Back to all posts" button with a
 * back arrow, ruled by a hairline. Under it, three `card` cards: a cover, a
 * category in the `info` colour, a title, and the author's initials with their
 * name and the date. Each card is one link named by its title; the back button
 * is a link of its own.
 *
 * Desktop (Figma 1440) puts the three cards in one row, the covers 379 by 180.
 * Tablet (768) puts two in a row, the covers 316 by 174, and the third across
 * the full width, its cover 688 by 245. Mobile (360) stacks them, the covers
 * 296 by 176, with the title a size down and the button across the full width.
 *
 * Hovering a card scales its cover from 1.00 to 1.03 inside its clip (240ms)
 * and turns its title `info`. Hovering the back button slides its arrow 4px
 * toward the start edge; nothing else moves. Keyboard focus does the same.
 * There is no hover on Mobile; pressing a card dims it to 96%. Reduced motion
 * turns the scale and the slide off. Nothing plays on load, on scroll or on a
 * timer.
 *
 * The author avatars are 20px initials. In Arabic they show one letter, the
 * first of the first name.
 *
 * Arabic mirrors by the page's `dir`: the cards run right to left, and the
 * back arrow points right and slides right. The photographs are never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsRelatedPostsStripPost {
  /** The cover. Without one the cover is a placeholder of the same size. */
  image?: { src: string; alt: string }
  /** The category, in the `info` colour. */
  category: React.ReactNode
  /** The title, an `h3`, and the card's accessible name. */
  title: React.ReactNode
  /** The author's name. Their initials fill the avatar. */
  author: string
  /** The date, as written: "Feb 10, 2026". */
  date: React.ReactNode
  /** Where the card goes. */
  href: string
}

export interface BlogCardsRelatedPostsStripCopy {
  /** The small line over the title. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section title, an `h2`, naming the post the strip belongs to. */
  heading: React.ReactNode
  /** The ghost button at the end of the header. Hidden when null. */
  back: { label: React.ReactNode; href: string } | null
  /** The related posts, in reading order. */
  posts: BlogCardsRelatedPostsStripPost[]
  /** Shown instead of the cards when `posts` is empty. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsRelatedPostsStripCopy> = {
  en: {
    eyebrow: "KEEP READING",
    heading: "Related to “A type ramp for two scripts”",
    back: { label: "Back to all posts", href: "#" },
    posts: [
      { category: "TYPOGRAPHY", title: "Type specimens are for arguing with", author: "Yasmin Farouk", date: "Feb 10, 2026", href: "#" },
      { category: "FOUNDATIONS", title: "Icons are a language, not a library", author: "Yasmin Farouk", date: "Mar 24, 2026", href: "#" },
      { category: "FOUNDATIONS", title: "Optical alignment beats mathematical alignment", author: "Yasmin Farouk", date: "Jan 20, 2026", href: "#" },
    ],
    emptyLabel: "No articles yet.",
  },
  ar: {
    eyebrow: "تابع القراءة",
    heading: "ذات صلة بـ«سلّم خطوط لنظامي كتابة»",
    back: { label: "عودة إلى كل المقالات", href: "#" },
    posts: [
      { category: "التايبوغرافيا", title: "عيّنات الخطوط وُجدت لنجادلها", author: "ياسمين فاروق", date: "10 فبراير 2026", href: "#" },
      { category: "الأساسيات", title: "الأيقونات لغة لا مكتبة", author: "ياسمين فاروق", date: "24 مارس 2026", href: "#" },
      { category: "الأساسيات", title: "المحاذاة البصرية تتفوق على المحاذاة الحسابية", author: "ياسمين فاروق", date: "20 يناير 2026", href: "#" },
    ],
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsRelatedPostsStripCopy = COPY

const ARABIC = /[؀-ۿ]/

/** A 20px avatar shows one Arabic letter: the first word is enough for Avatar to take one initial. */
const initialsName = (name: string) => (ARABIC.test(name) ? (name.trim().split(/\s+/)[0] ?? name) : name)

/*
 * Every class below is written out whole: Tailwind finds a class by reading
 * the source, so none is built from pieces. The hover and focus ones are from
 * Tablet up (Mobile has none).
 */
const CARD =
  "group/card flex h-full flex-col gap-3 rounded-lg border bg-card p-4 transition-opacity duration-[120ms] motion-reduce:transition-none [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:[@container(max-width:39.99rem)]:opacity-[0.96]"
const COVER_HOVER =
  "group-hover/card:[@container(min-width:40rem)]:motion-safe:scale-[1.03] group-focus-visible/card:[@container(min-width:40rem)]:motion-safe:scale-[1.03]"
const TITLE_HOVER =
  "group-hover/card:[@container(min-width:40rem)]:text-info group-focus-visible/card:[@container(min-width:40rem)]:text-info"
const BACK =
  "group/back shrink-0 w-full [@container(min-width:40rem)]:w-auto"
const ARROW_SLIDE =
  "rtl:-scale-x-100 transition-transform duration-200 ease-out motion-reduce:transition-none group-hover/back:[@container(min-width:40rem)]:motion-safe:ltr:-translate-x-1 group-hover/back:[@container(min-width:40rem)]:motion-safe:rtl:translate-x-1 group-focus-visible/back:[@container(min-width:40rem)]:motion-safe:ltr:-translate-x-1 group-focus-visible/back:[@container(min-width:40rem)]:motion-safe:rtl:translate-x-1"

export interface BlogCardsRelatedPostsStripProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsRelatedPostsStripCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function BlogCardsRelatedPostsStrip({
  locale = "en",
  eyebrow,
  heading,
  back,
  posts,
  emptyLabel,
  className,
  ...props
}: BlogCardsRelatedPostsStripProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const titleId = React.useId()
  const list = posts ?? copy.posts
  const line = eyebrow ?? copy.eyebrow
  const link = back === undefined ? copy.back : back
  // On Tablet the cards sit two to a row, so an odd last one takes the full
  // width; on Desktop all of them share one row of three.
  const spanLast = list.length % 2 === 1

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "[container-type:inline-size] bg-muted px-4 py-8 md:px-6 md:py-16 lg:px-20 lg:py-24",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8">
        <div className="flex flex-col gap-3 border-b pb-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-end [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-8">
          <div className="flex min-w-0 flex-col gap-1">
            {line ? <p className="text-xs font-medium uppercase text-muted-foreground">{line}</p> : null}
            <h2
              id={headingId}
              className="text-xl font-semibold text-foreground [@container(min-width:40rem)]:text-2xl"
            >
              {heading ?? copy.heading}
            </h2>
          </div>
          {link ? (
            <a
              href={link.href}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), BACK)}
            >
              <ArrowLeftIcon aria-hidden="true" className={cn("size-4", ARROW_SLIDE)} />
              {link.label}
            </a>
          ) : null}
        </div>

        {list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-5 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:grid-cols-3">
            {list.map((post, index) => {
              const wide = spanLast && index === list.length - 1
              return (
                <li
                  key={index}
                  className={cn(
                    "flex",
                    wide && "[@container(min-width:40rem)]:col-span-2 [@container(min-width:64rem)]:col-span-1"
                  )}
                >
                  <a href={post.href} aria-labelledby={`${titleId}-${index}`} className={cn(CARD, "w-full")}>
                    <div
                      className={cn(
                        "relative aspect-[296/176] w-full shrink-0 overflow-hidden rounded-md bg-background [@container(min-width:40rem)]:aspect-[316/174] [@container(min-width:64rem)]:aspect-[379/180]",
                        wide &&
                          "[@container(min-width:40rem)]:aspect-[688/245] [@container(min-width:64rem)]:aspect-[379/180]"
                      )}
                    >
                      {post.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.image.src}
                          alt={post.image.alt}
                          loading="lazy"
                          className={cn(
                            "absolute inset-0 size-full object-cover transition-transform duration-[240ms] ease-out motion-reduce:transition-none",
                            COVER_HOVER
                          )}
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2 px-2 pb-2">
                      <span className="text-xs font-medium uppercase text-info">{post.category}</span>
                      <h3
                        id={`${titleId}-${index}`}
                        className={cn(
                          "text-lg font-semibold text-foreground transition-colors duration-[180ms] motion-reduce:transition-none",
                          TITLE_HOVER
                        )}
                      >
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Avatar
                          variant="initials"
                          size="24"
                          radius="rounded"
                          name={initialsName(post.author)}
                          aria-hidden="true"
                          className="size-5"
                        />
                        <span className="text-xs font-medium text-foreground">{post.author}</span>
                        <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                      </div>
                    </div>
                  </a>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
