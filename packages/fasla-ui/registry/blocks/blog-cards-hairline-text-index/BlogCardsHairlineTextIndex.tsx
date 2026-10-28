import * as React from "react"
import { ArrowUpRightIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Hairline Text Index.
 *
 * A large heading with a line under it, then an index of articles set in type
 * alone: no pictures, no summaries. A year label with a hairline under it,
 * then one row per article: the title at the start, and at the end the
 * category, the date and a small `arrow-up-right`, each row ruled by a
 * hairline. The whole row is one link, named by its title; the arrow is only
 * drawn and hidden from assistive technology.
 *
 * Desktop (Figma 1440) and Tablet (768) set the title and the meta side by
 * side, the title wrapping to two lines on Tablet. Mobile (360) stacks them:
 * the title over the meta, with the arrow after the date.
 *
 * Hover and keyboard focus slide the title 8px toward the end (200ms), bring
 * the arrow from nothing to full strength, sliding in from 6px, and thicken
 * the hairline under the row from 1px to 2px in the foreground colour. There
 * is no horizontal travel on Mobile, where the arrow is always shown and
 * pressing a row highlights it. Reduced motion turns the slide and the fade
 * off and leaves the arrow showing. Nothing plays on load or on a timer.
 *
 * Arabic mirrors by the page's `dir`: the title slides toward the left, and
 * the arrow is mirrored, `arrow-up-right` becoming `arrow-up-left`, sliding in
 * from the other side. Nothing here is a photograph.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsHairlineTextIndexPost {
  /** The title, an `h3`, and the row's accessible name. */
  title: React.ReactNode
  /** The category. */
  category: React.ReactNode
  /** The date, as written: "Aug 18, 2026". */
  date: React.ReactNode
  /** Where the row goes. */
  href: string
}

export interface BlogCardsHairlineTextIndexCopy {
  /** The section heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  note: React.ReactNode
  /** The label over the list, a year. Hidden when empty. */
  year: React.ReactNode
  /** The articles, in reading order. */
  posts: BlogCardsHairlineTextIndexPost[]
  /** Shown instead of the rows when `posts` is empty. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsHairlineTextIndexCopy> = {
  en: {
    heading: "Everything, by date",
    note: "No pictures, no summaries — just the writing.",
    year: "2026",
    posts: [
      { title: "Why we rebuilt every token as a Figma variable", category: "Design Systems", date: "Aug 18, 2026", href: "#" },
      { title: "Arabic type on the web: what breaks and why", category: "RTL & Arabic", date: "Aug 11, 2026", href: "#" },
      { title: "The 8-point grid is not a religion", category: "Foundations", date: "Aug 4, 2026", href: "#" },
      { title: "Shipping dark mode without a second design file", category: "Engineering", date: "Jul 28, 2026", href: "#" },
      { title: "Naming things: a spacing scale that survives handoff", category: "Design Systems", date: "Jul 21, 2026", href: "#" },
      { title: "Mirroring is not flipping", category: "RTL & Arabic", date: "Jul 14, 2026", href: "#" },
      { title: "How we test contrast before a component ships", category: "Accessibility", date: "Jul 7, 2026", href: "#" },
    ],
    emptyLabel: "No articles yet.",
  },
  ar: {
    heading: "كل شيء، حسب التاريخ",
    note: "بلا صور ولا ملخصات، الكتابة فقط.",
    year: "2026",
    posts: [
      { title: "لماذا أعدنا بناء كل رمز تصميمي كمتغيّر في Figma", category: "أنظمة التصميم", date: "18 أغسطس 2026", href: "#" },
      { title: "الخط العربي على الويب: ما الذي ينكسر ولماذا", category: "العربية وRTL", date: "11 أغسطس 2026", href: "#" },
      { title: "شبكة الثماني نقاط ليست عقيدة", category: "الأساسيات", date: "4 أغسطس 2026", href: "#" },
      { title: "إطلاق الوضع الداكن دون ملف تصميم ثانٍ", category: "الهندسة", date: "28 يوليو 2026", href: "#" },
      { title: "تسمية الأشياء: مقياس تباعد يصمد بعد التسليم", category: "أنظمة التصميم", date: "21 يوليو 2026", href: "#" },
      { title: "الانعكاس ليس مجرد قلب", category: "العربية وRTL", date: "14 يوليو 2026", href: "#" },
      { title: "كيف نختبر التباين قبل إطلاق أي مكوّن", category: "إمكانية الوصول", date: "7 يوليو 2026", href: "#" },
    ],
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsHairlineTextIndexCopy = COPY

/*
 * Every class below is written out whole: Tailwind finds a class by reading
 * the source, so none is built from pieces. The hover and focus ones are from
 * Tablet up (Mobile has none).
 */
const ROW =
  "group/row relative flex flex-col gap-2 py-5 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-8 [outline:none] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-border after:transition-[height,background-color] after:duration-200 motion-reduce:after:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:[@container(max-width:39.99rem)]:bg-muted"
const ROW_HAIRLINE =
  "hover:[@container(min-width:40rem)]:after:h-0.5 hover:[@container(min-width:40rem)]:after:bg-foreground focus-visible:after:h-0.5 focus-visible:after:bg-foreground"
const TITLE_SLIDE =
  "transition-transform duration-200 ease-out motion-reduce:transition-none group-hover/row:[@container(min-width:40rem)]:motion-safe:ltr:translate-x-2 group-hover/row:[@container(min-width:40rem)]:motion-safe:rtl:-translate-x-2 group-focus-visible/row:[@container(min-width:40rem)]:motion-safe:ltr:translate-x-2 group-focus-visible/row:[@container(min-width:40rem)]:motion-safe:rtl:-translate-x-2"
const ARROW_IN =
  "shrink-0 rtl:-scale-x-100 transition duration-200 ease-out motion-reduce:transition-none [@container(min-width:40rem)]:motion-safe:opacity-0 [@container(min-width:40rem)]:motion-safe:ltr:-translate-x-1.5 [@container(min-width:40rem)]:motion-safe:rtl:translate-x-1.5 group-hover/row:[@container(min-width:40rem)]:motion-safe:opacity-100 group-hover/row:[@container(min-width:40rem)]:motion-safe:translate-x-0 group-focus-visible/row:[@container(min-width:40rem)]:motion-safe:opacity-100 group-focus-visible/row:[@container(min-width:40rem)]:motion-safe:translate-x-0"

export interface BlogCardsHairlineTextIndexProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsHairlineTextIndexCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function BlogCardsHairlineTextIndex({
  locale = "en",
  heading,
  note,
  year,
  posts,
  emptyLabel,
  className,
  ...props
}: BlogCardsHairlineTextIndexProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const titleId = React.useId()
  const list = posts ?? copy.posts
  const lines = { note: note ?? copy.note, year: year ?? copy.year }

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:px-20 lg:py-24",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h2
            id={headingId}
            className="text-3xl font-semibold text-foreground [@container(min-width:40rem)]:text-5xl"
          >
            {heading ?? copy.heading}
          </h2>
          {lines.note ? <p className="text-lg text-muted-foreground">{lines.note}</p> : null}
        </div>

        {list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
        ) : (
          <div className="flex flex-col">
            {lines.year ? (
              <p className="border-b pb-3 text-sm font-medium text-muted-foreground">{lines.year}</p>
            ) : null}
            <ul>
              {list.map((post, index) => (
                <li key={index} className="flex">
                  <a
                    href={post.href}
                    aria-labelledby={`${titleId}-${index}`}
                    className={cn(ROW, ROW_HAIRLINE, "w-full")}
                  >
                    <h3
                      id={`${titleId}-${index}`}
                      className={cn(
                        "min-w-0 text-xl font-medium text-foreground [@container(min-width:40rem)]:flex-1 [@container(min-width:40rem)]:text-2xl",
                        TITLE_SLIDE
                      )}
                    >
                      {post.title}
                    </h3>
                    <span className="flex shrink-0 items-center gap-3 text-sm text-muted-foreground [@container(min-width:40rem)]:gap-6">
                      <span>{post.category}</span>
                      <span>{post.date}</span>
                      <ArrowUpRightIcon aria-hidden="true" className={cn("size-4", ARROW_IN)} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
