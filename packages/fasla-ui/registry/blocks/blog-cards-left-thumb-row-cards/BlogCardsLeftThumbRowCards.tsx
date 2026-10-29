import * as React from "react"
import { ArrowUpRightIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Left-Thumb Row Cards.
 *
 * A heading with a "sorted by" note at its end, over a ruled list of article
 * rows. A row is a thumbnail, then the copy: a soft category badge with the
 * date and read time, a title, a summary and the author's initials with their
 * name and the date; and at the end a ghost icon button with an arrow. The
 * whole row is one link, named by its title, and the arrow is only drawn: it
 * is hidden from assistive technology and takes no focus of its own.
 *
 * Desktop (Figma 1440) sets a 240 by 150 thumbnail at the start of each row.
 * Tablet (768) shrinks it to 200 by 125. Mobile (360) stacks the row: the
 * thumbnail across the full width, 328 by 184, then the copy, then the arrow
 * under the text, where it is the visible sign that the row is a link.
 *
 * Hover and keyboard focus scale the thumbnail from 1.00 to 1.04 inside its
 * clip (280ms), turn the title `info`, and move the arrow 2px toward the
 * upper end corner. The arrow is at full strength at rest, as in Figma. On
 * Mobile there is no hover; pressing a row dims it to 92% for 120ms. Reduced motion turns
 * all of it off. Nothing plays on load or on a timer.
 *
 * Arabic mirrors by the page's `dir`: the thumbnail moves to the end side of
 * the row and the arrow is mirrored, `arrow-up-right` becoming `arrow-up-left`,
 * and travels toward the upper end corner, now on the left. Photographs are
 * never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsLeftThumbRowCardsPost {
  /** The thumbnail. Without one it is a `muted` placeholder of the same size. */
  image?: { src: string; alt: string }
  /** The category badge. */
  category: React.ReactNode
  /** The date, as written: "Aug 4, 2026". Shown in the first line and again by the author. */
  date: React.ReactNode
  /** The read time, as written: "6 min read". */
  readTime: React.ReactNode
  /** The title, an `h3`, and the row's accessible name. */
  title: React.ReactNode
  /** The summary. */
  summary: React.ReactNode
  /** The author's name. Their initials fill the avatar. */
  author: string
  /** Where the row goes. */
  href: string
}

export interface BlogCardsLeftThumbRowCardsCopy {
  /** The section heading, an `h2`. */
  heading: React.ReactNode
  /** The note at the end of the header. Hidden when empty. */
  note: React.ReactNode
  /** The articles, in reading order. */
  posts: BlogCardsLeftThumbRowCardsPost[]
  /** Shown instead of the rows when `posts` is empty. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsLeftThumbRowCardsCopy> = {
  en: {
    heading: "All posts",
    note: "Sorted by newest",
    posts: [
      {
        category: "Foundations",
        date: "Aug 4, 2026",
        readTime: "6 min read",
        title: "The 8-point grid is not a religion",
        summary:
          "Where a strict spacing scale helps, where it fights the content, and how we decide which rule wins.",
        author: "Lina Haddad",
        href: "#",
      },
      {
        category: "Product",
        date: "Jun 16, 2026",
        readTime: "6 min read",
        title: "The empty state is a product decision",
        summary: "Nobody owns the blank screen, so it ships last and worst. A short argument for designing it first.",
        author: "Lina Haddad",
        href: "#",
      },
      {
        category: "Accessibility",
        date: "May 12, 2026",
        readTime: "4 min read",
        title: "Focus rings that survive every theme",
        summary:
          "A single ring token, offset correctly, tested against nine surfaces. The details that make it hold up.",
        author: "Maya Okonkwo",
        href: "#",
      },
      {
        category: "Company",
        date: "Feb 3, 2026",
        readTime: "5 min read",
        title: "Six months of Fasla, in numbers",
        summary: "Adoption, contribution, and the metrics we stopped tracking because they told us nothing.",
        author: "Karim Nasser",
        href: "#",
      },
    ],
    emptyLabel: "No articles yet.",
  },
  ar: {
    heading: "كل المقالات",
    note: "مرتبة بالأحدث",
    posts: [
      {
        category: "الأساسيات",
        date: "4 أغسطس 2026",
        readTime: "قراءة 6 دقائق",
        title: "شبكة الثماني نقاط ليست عقيدة",
        summary: "أين يفيد مقياس التباعد الصارم، وأين يصطدم بالمحتوى، وكيف نقرر أي قاعدة تنتصر.",
        author: "لينا حدّاد",
        href: "#",
      },
      {
        category: "المنتج",
        date: "16 يونيو 2026",
        readTime: "قراءة 6 دقائق",
        title: "الحالة الفارغة قرار منتج",
        summary: "لا أحد يملك الشاشة الفارغة، لذا تُشحن آخرًا وبأسوأ حال. حجة قصيرة لتصميمها أولًا.",
        author: "لينا حدّاد",
        href: "#",
      },
      {
        category: "إمكانية الوصول",
        date: "12 مايو 2026",
        readTime: "قراءة 4 دقائق",
        title: "حلقات تركيز تصمد في كل سمة",
        summary: "رمز حلقة واحد، بإزاحة صحيحة، مُختبَر على تسعة أسطح. التفاصيل التي تجعله يصمد.",
        author: "مايا أوكونكو",
        href: "#",
      },
      {
        category: "الشركة",
        date: "3 فبراير 2026",
        readTime: "قراءة 5 دقائق",
        title: "ستة أشهر من فاصلة بالأرقام",
        summary: "التبنّي والمساهمة والمقاييس التي توقفنا عن تتبعها لأنها لم تخبرنا شيئًا.",
        author: "كريم ناصر",
        href: "#",
      },
    ],
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsLeftThumbRowCardsCopy = COPY

/*
 * Every class below is written out whole: Tailwind finds a class by reading
 * the source, so none is built from pieces. The hover and focus ones are from
 * Tablet up (Mobile has none).
 */
const ROW =
  "group/row flex flex-col gap-4 border-b py-6 transition-opacity duration-[120ms] motion-reduce:transition-none [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:gap-8 [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:[@container(max-width:39.99rem)]:opacity-[0.92]"
const THUMB_HOVER =
  "group-hover/row:[@container(min-width:40rem)]:motion-safe:scale-[1.04] group-focus-visible/row:[@container(min-width:40rem)]:motion-safe:scale-[1.04]"
const TITLE_HOVER =
  "group-hover/row:[@container(min-width:40rem)]:text-info group-focus-visible/row:[@container(min-width:40rem)]:text-info"
const ARROW_MOVE =
  "rtl:-scale-x-100 transition duration-[280ms] ease-out motion-reduce:transition-none group-hover/row:[@container(min-width:40rem)]:motion-safe:-translate-y-0.5 group-focus-visible/row:[@container(min-width:40rem)]:motion-safe:-translate-y-0.5 group-hover/row:[@container(min-width:40rem)]:motion-safe:ltr:translate-x-0.5 group-hover/row:[@container(min-width:40rem)]:motion-safe:rtl:-translate-x-0.5 group-focus-visible/row:[@container(min-width:40rem)]:motion-safe:ltr:translate-x-0.5 group-focus-visible/row:[@container(min-width:40rem)]:motion-safe:rtl:-translate-x-0.5"

export interface BlogCardsLeftThumbRowCardsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsLeftThumbRowCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function BlogCardsLeftThumbRowCards({
  locale = "en",
  heading,
  note,
  posts,
  emptyLabel,
  className,
  ...props
}: BlogCardsLeftThumbRowCardsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const titleId = React.useId()
  const list = posts ?? copy.posts
  const sortNote = note ?? copy.note

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
        <div className="flex flex-col gap-2 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-8">
          <h2
            id={headingId}
            className="min-w-0 text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl"
          >
            {heading ?? copy.heading}
          </h2>
          {sortNote ? <p className="shrink-0 text-sm text-muted-foreground">{sortNote}</p> : null}
        </div>

        {list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
        ) : (
          <ul className="border-t">
            {list.map((post, index) => (
              <li key={index} className="flex">
                <a href={post.href} aria-labelledby={`${titleId}-${index}`} className={cn(ROW, "w-full")}>
                  <div className="relative aspect-[328/184] w-full shrink-0 overflow-hidden rounded-md bg-muted [@container(min-width:40rem)]:aspect-[200/125] [@container(min-width:40rem)]:w-[200px] [@container(min-width:64rem)]:aspect-[240/150] [@container(min-width:64rem)]:w-[240px]">
                    {post.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.image.src}
                        alt={post.image.alt}
                        loading="lazy"
                        className={cn(
                          "absolute inset-0 size-full object-cover transition-transform duration-[280ms] ease-out motion-reduce:transition-none",
                          THUMB_HOVER
                        )}
                      />
                    ) : null}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="soft" tone="secondary" size="sm" radius="rounded">
                        {post.category}
                      </Badge>
                      <span className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{post.date}</span>
                        <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
                        <span>{post.readTime}</span>
                      </span>
                    </div>
                    <h3
                      id={`${titleId}-${index}`}
                      className={cn(
                        "text-xl font-semibold text-foreground [@container(min-width:40rem)]:text-2xl",
                        TITLE_HOVER
                      )}
                    >
                      {post.title}
                    </h3>
                    <p className="text-base text-muted-foreground">{post.summary}</p>
                    <div className="flex items-center gap-2">
                      <Avatar variant="initials" size="24" radius="rounded" name={post.author} aria-hidden="true" />
                      <span className="text-xs font-medium text-foreground">{post.author}</span>
                      <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon-md", radius: "rounded" }),
                      "pointer-events-none shrink-0 self-start [@container(min-width:40rem)]:self-center"
                    )}
                  >
                    <ArrowUpRightIcon className={cn("size-4", ARROW_MOVE)} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
