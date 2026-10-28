import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Latest / Popular Split.
 *
 * Two columns of compact rows with a hairline between them. The first, Latest,
 * has a heading with a "newest first" note and five rows, each a small
 * thumbnail beside a title and a line with the category and read time. The
 * second, Most read, has its own heading and note and five ranked rows: a rank
 * number in the border colour, then the title and the same line, with no
 * thumbnail. Each row is one link, named by its title.
 *
 * Desktop (Figma 1440) puts the columns side by side, 640 wide each, with
 * 72 by 56 thumbnails. Tablet (768) keeps them side by side at 360 each and
 * shrinks the thumbnails to 56 by 44. Mobile (360) stacks them, Latest above
 * Most read, with a hairline under Latest and 64 by 48 thumbnails.
 *
 * Hover and keyboard focus scale a thumbnail from 1.00 to 1.06 inside its
 * clip and turn the title `info` (180ms). In Most read the rank moves from
 * the border colour to the foreground. On Mobile there is no hover; pressing
 * a row dims it to 92%. Reduced motion turns all of it off. Nothing plays on
 * load or on a timer.
 *
 * Arabic mirrors by the page's `dir`: Most read moves to the start side, the
 * ranks to the start of each row and the thumbnails to the start of the Latest
 * rows. Photographs are never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsLatestPopularSplitPost {
  /** The thumbnail, in the Latest column only. Without one it is a `muted` placeholder of the same size. */
  image?: { src: string; alt: string }
  /** The title, an `h3`, and the row's accessible name. */
  title: React.ReactNode
  /** The category. */
  category: React.ReactNode
  /** The read time, as written: "9 min read". */
  readTime: React.ReactNode
  /** Where the row goes. */
  href: string
}

export interface BlogCardsLatestPopularSplitCopy {
  /** The Latest column's heading, an `h2`. */
  latestHeading: React.ReactNode
  /** The note under it. Hidden when empty. */
  latestNote: React.ReactNode
  /** The Latest rows, with thumbnails. */
  latest: BlogCardsLatestPopularSplitPost[]
  /** The Most read column's heading, an `h2`. */
  popularHeading: React.ReactNode
  /** The note under it. Hidden when empty. */
  popularNote: React.ReactNode
  /** The Most read rows, ranked from `01`; no thumbnails. */
  popular: BlogCardsLatestPopularSplitPost[]
  /** Shown under a column's heading when its list is empty. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsLatestPopularSplitCopy> = {
  en: {
    latestHeading: "Latest",
    latestNote: "Newest first",
    latest: [
      { title: "Why we rebuilt every token as a Figma variable", category: "Design Systems", readTime: "9 min read", href: "#" },
      { title: "Arabic type on the web: what breaks and why", category: "RTL & Arabic", readTime: "12 min read", href: "#" },
      { title: "The 8-point grid is not a religion", category: "Foundations", readTime: "6 min read", href: "#" },
      { title: "Shipping dark mode without a second design file", category: "Engineering", readTime: "8 min read", href: "#" },
      { title: "Naming things: a spacing scale that survives handoff", category: "Design Systems", readTime: "7 min read", href: "#" },
    ],
    popularHeading: "Most read",
    popularNote: "Last 90 days",
    popular: [
      { title: "Mirroring is not flipping", category: "RTL & Arabic", readTime: "10 min read", href: "#" },
      { title: "The case for fewer button variants", category: "Design Systems", readTime: "5 min read", href: "#" },
      { title: "A type ramp for two scripts", category: "Typography", readTime: "11 min read", href: "#" },
      { title: "Documenting a component so an agent can use it", category: "Engineering", readTime: "11 min read", href: "#" },
      { title: "What our first design-system survey told us", category: "Research", readTime: "9 min read", href: "#" },
    ],
    emptyLabel: "No articles yet.",
  },
  ar: {
    latestHeading: "الأحدث",
    latestNote: "الأحدث أولًا",
    latest: [
      { title: "لماذا أعدنا بناء كل رمز تصميمي كمتغيّر في Figma", category: "أنظمة التصميم", readTime: "قراءة 9 دقائق", href: "#" },
      { title: "الخط العربي على الويب: ما الذي ينكسر ولماذا", category: "العربية وRTL", readTime: "قراءة 12 دقيقة", href: "#" },
      { title: "شبكة الثماني نقاط ليست عقيدة", category: "الأساسيات", readTime: "قراءة 6 دقائق", href: "#" },
      { title: "إطلاق الوضع الداكن دون ملف تصميم ثانٍ", category: "الهندسة", readTime: "قراءة 8 دقائق", href: "#" },
      { title: "تسمية الأشياء: مقياس تباعد يصمد بعد التسليم", category: "أنظمة التصميم", readTime: "قراءة 7 دقائق", href: "#" },
    ],
    popularHeading: "الأكثر قراءة",
    popularNote: "آخر 90 يومًا",
    popular: [
      { title: "الانعكاس ليس مجرد قلب", category: "العربية وRTL", readTime: "قراءة 10 دقائق", href: "#" },
      { title: "مرافعة لصالح متغيرات أزرار أقل", category: "أنظمة التصميم", readTime: "قراءة 5 دقائق", href: "#" },
      { title: "سلّم خطوط لنظامي كتابة", category: "التايبوغرافيا", readTime: "قراءة 11 دقيقة", href: "#" },
      { title: "توثيق المكوّن ليستطيع وكيل ذكي استخدامه", category: "الهندسة", readTime: "قراءة 11 دقيقة", href: "#" },
      { title: "ما أخبرنا به أول استبيان لنظام التصميم", category: "الأبحاث", readTime: "قراءة 9 دقائق", href: "#" },
    ],
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsLatestPopularSplitCopy = COPY

/*
 * Every class below is written out whole: Tailwind finds a class by reading
 * the source, so none is built from pieces. The hover and focus ones are from
 * Tablet up (Mobile has none).
 */
const ROW =
  "group/row flex items-center gap-4 border-t py-4 transition-opacity duration-[120ms] motion-reduce:transition-none [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:[@container(max-width:39.99rem)]:opacity-[0.92]"
const THUMB_HOVER =
  "group-hover/row:[@container(min-width:40rem)]:motion-safe:scale-[1.06] group-focus-visible/row:[@container(min-width:40rem)]:motion-safe:scale-[1.06]"
const TITLE_HOVER =
  "group-hover/row:[@container(min-width:40rem)]:text-info group-focus-visible/row:[@container(min-width:40rem)]:text-info"
const RANK_HOVER =
  "group-hover/row:[@container(min-width:40rem)]:text-foreground group-focus-visible/row:[@container(min-width:40rem)]:text-foreground"

function RowCopy({ post, titleId }: { post: BlogCardsLatestPopularSplitPost; titleId: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <h3
        id={titleId}
        className={cn(
          "text-base font-medium text-foreground transition-colors duration-[180ms] motion-reduce:transition-none",
          TITLE_HOVER
        )}
      >
        {post.title}
      </h3>
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{post.category}</span>
        <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
        <span>{post.readTime}</span>
      </p>
    </div>
  )
}

function ColumnHeader({ heading, note }: { heading: React.ReactNode; note: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 pb-4">
      <h2 className="text-xl font-semibold text-foreground [@container(min-width:40rem)]:text-2xl">{heading}</h2>
      {note ? <p className="text-sm text-muted-foreground">{note}</p> : null}
    </div>
  )
}

export interface BlogCardsLatestPopularSplitProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsLatestPopularSplitCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function BlogCardsLatestPopularSplit({
  locale = "en",
  latestHeading,
  latestNote,
  latest,
  popularHeading,
  popularNote,
  popular,
  emptyLabel,
  className,
  ...props
}: BlogCardsLatestPopularSplitProps) {
  const copy = COPY[locale]
  const titleId = React.useId()
  const latestRows = latest ?? copy.latest
  const popularRows = popular ?? copy.popular
  const empty = emptyLabel ?? copy.emptyLabel

  return (
    <section
      className={cn(
        "[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:px-20 lg:py-24",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-0">
        <div className="flex min-w-0 flex-col border-b pb-8 [@container(min-width:40rem)]:flex-1 [@container(min-width:40rem)]:border-b-0 [@container(min-width:40rem)]:border-e [@container(min-width:40rem)]:pb-0 [@container(min-width:40rem)]:pe-6 [@container(min-width:64rem)]:pe-10">
          <ColumnHeader
            heading={latestHeading ?? copy.latestHeading}
            note={latestNote ?? copy.latestNote}
          />
          {latestRows.length === 0 ? (
            <p className="border-t py-4 text-sm text-muted-foreground">{empty}</p>
          ) : (
            <ul>
              {latestRows.map((post, index) => (
                <li key={index} className="flex">
                  <a href={post.href} aria-labelledby={`${titleId}-l${index}`} className={cn(ROW, "w-full")}>
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-sm bg-muted [@container(min-width:40rem)]:h-11 [@container(min-width:40rem)]:w-14 [@container(min-width:64rem)]:h-14 [@container(min-width:64rem)]:w-[72px]">
                      {post.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.image.src}
                          alt={post.image.alt}
                          loading="lazy"
                          className={cn(
                            "absolute inset-0 size-full object-cover transition-transform duration-[180ms] ease-out motion-reduce:transition-none",
                            THUMB_HOVER
                          )}
                        />
                      ) : null}
                    </div>
                    <RowCopy post={post} titleId={`${titleId}-l${index}`} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex min-w-0 flex-col [@container(min-width:40rem)]:flex-1 [@container(min-width:40rem)]:ps-6 [@container(min-width:64rem)]:ps-10">
          <ColumnHeader
            heading={popularHeading ?? copy.popularHeading}
            note={popularNote ?? copy.popularNote}
          />
          {popularRows.length === 0 ? (
            <p className="border-t py-4 text-sm text-muted-foreground">{empty}</p>
          ) : (
            <ol>
              {popularRows.map((post, index) => (
                <li key={index} className="flex">
                  <a href={post.href} aria-labelledby={`${titleId}-p${index}`} className={cn(ROW, "w-full")}>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "text-xl font-semibold tabular-nums text-border transition-colors duration-[180ms] motion-reduce:transition-none",
                        RANK_HOVER
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <RowCopy post={post} titleId={`${titleId}-p${index}`} />
                  </a>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  )
}
