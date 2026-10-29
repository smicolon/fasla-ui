import * as React from "react"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Numbered Reading List.
 *
 * A heading block (an eyebrow and a heading, with an update note at its end)
 * over a ruled list of numbered articles, on a `muted` band. A row is a large
 * rank number in the border colour, then the copy: a title, a summary, and
 * an outline category badge with the read time; at the end an outline icon
 * button with an arrow. The whole row is one link, named by its title; the
 * arrow is only drawn and hidden from assistive technology.
 *
 * Desktop (Figma 1440) and Tablet (768) set the rank, the copy and the arrow
 * in one row, the rank 5XL wide. Mobile (360) stacks them: a smaller rank over
 * the copy, with the arrow under the text.
 *
 * Hover and keyboard focus turn the rank from the border colour to the
 * foreground and the title `info` (180ms), and move the arrow 2px toward the
 * upper end corner. The arrow is at full strength at rest, as in Figma. The
 * badge does not move. On Mobile there is no hover; pressing a row dims it to 92%.
 * Reduced motion turns all of it off. Nothing plays on load or on a timer.
 *
 * Arabic mirrors by the page's `dir`: the rank is at the right end of the
 * row and the arrow is mirrored, `arrow-right` becoming `arrow-left`, and
 * travels toward the upper left. There are no photographs.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsNumberedReadingListPost {
  /** The title, an `h3`, and the row's accessible name. */
  title: React.ReactNode
  /** The summary. */
  summary: React.ReactNode
  /** The category badge. */
  category: React.ReactNode
  /** The read time, as written: "9 min read". */
  readTime: React.ReactNode
  /** Where the row goes. */
  href: string
}

export interface BlogCardsNumberedReadingListCopy {
  /** The small line over the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section heading, an `h2`. */
  heading: React.ReactNode
  /** The note at the end of the header. Hidden when empty. */
  note: React.ReactNode
  /** The articles, in order; each gets its place number, `01` upward. */
  posts: BlogCardsNumberedReadingListPost[]
  /** Shown instead of the rows when `posts` is empty. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsNumberedReadingListCopy> = {
  en: {
    eyebrow: "START HERE",
    heading: "Five posts that explain how we work",
    note: "Updated monthly",
    posts: [
      {
        title: "Why we rebuilt every token as a Figma variable",
        summary:
          "Six months of drift taught us that a hex code in a style is a promise you cannot keep. Here is the migration, and what it cost.",
        category: "Design Systems",
        readTime: "9 min read",
        href: "#",
      },
      {
        title: "A type ramp for two scripts",
        summary:
          "Latin and Arabic disagree about x-height, ascenders, and optical size. Building one ramp that serves both.",
        category: "Typography",
        readTime: "11 min read",
        href: "#",
      },
      {
        title: "Mirroring is not flipping",
        summary: "The layout rules that actually change in RTL — and the ones designers keep mirroring by mistake.",
        category: "RTL & Arabic",
        readTime: "10 min read",
        href: "#",
      },
      {
        title: "What our first design-system survey told us",
        summary:
          "142 responses from designers and engineers. The gap between what we documented and what people found.",
        category: "Research",
        readTime: "9 min read",
        href: "#",
      },
      {
        title: "Documenting a component so an agent can use it",
        summary: "Machine-readable content contracts turned out to make our human docs better too.",
        category: "Engineering",
        readTime: "11 min read",
        href: "#",
      },
    ],
    emptyLabel: "No articles yet.",
  },
  ar: {
    eyebrow: "ابدأ من هنا",
    heading: "خمسة مقالات تشرح كيف نعمل",
    note: "يُحدَّث شهريًا",
    posts: [
      {
        title: "لماذا أعدنا بناء كل رمز تصميمي كمتغيّر في Figma",
        summary:
          "ستة أشهر من الانحراف علّمتنا أن كود اللون داخل نمطٍ ما وعدٌ لا يمكن الوفاء به. إليكم قصة الترحيل وما كلّفنا.",
        category: "أنظمة التصميم",
        readTime: "قراءة 9 دقائق",
        href: "#",
      },
      {
        title: "سلّم خطوط لنظامي كتابة",
        summary:
          "اللاتينية والعربية تختلفان حول ارتفاع الأحرف والصواعد والحجم البصري. هكذا بنينا سلّمًا واحدًا يخدم الاثنين.",
        category: "التايبوغرافيا",
        readTime: "قراءة 11 دقيقة",
        href: "#",
      },
      {
        title: "الانعكاس ليس مجرد قلب",
        summary: "قواعد التخطيط التي تتغير فعلًا في RTL، وتلك التي يعكسها المصممون بالخطأ.",
        category: "العربية وRTL",
        readTime: "قراءة 10 دقائق",
        href: "#",
      },
      {
        title: "ما أخبرنا به أول استبيان لنظام التصميم",
        summary: "142 إجابة من مصممين ومهندسين. الفجوة بين ما وثّقناه وما وجده الناس.",
        category: "الأبحاث",
        readTime: "قراءة 9 دقائق",
        href: "#",
      },
      {
        title: "توثيق المكوّن ليستطيع وكيل ذكي استخدامه",
        summary: "عقود المحتوى المقروءة آليًا حسّنت وثائقنا البشرية أيضًا.",
        category: "الهندسة",
        readTime: "قراءة 11 دقيقة",
        href: "#",
      },
    ],
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsNumberedReadingListCopy = COPY

/*
 * Every class below is written out whole: Tailwind finds a class by reading
 * the source, so none is built from pieces. The hover and focus ones are from
 * Tablet up (Mobile has none).
 */
const ROW =
  "group/row flex flex-col gap-3 border-b py-6 transition-opacity duration-[120ms] motion-reduce:transition-none [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:gap-8 [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:[@container(max-width:39.99rem)]:opacity-[0.92]"
const RANK_HOVER =
  "group-hover/row:[@container(min-width:40rem)]:text-foreground group-focus-visible/row:[@container(min-width:40rem)]:text-foreground"
const TITLE_HOVER =
  "group-hover/row:[@container(min-width:40rem)]:text-info group-focus-visible/row:[@container(min-width:40rem)]:text-info"
const ARROW_MOVE =
  "rtl:-scale-x-100 transition duration-[180ms] ease-out motion-reduce:transition-none group-hover/row:[@container(min-width:40rem)]:motion-safe:-translate-y-0.5 group-focus-visible/row:[@container(min-width:40rem)]:motion-safe:-translate-y-0.5 group-hover/row:[@container(min-width:40rem)]:motion-safe:ltr:translate-x-0.5 group-hover/row:[@container(min-width:40rem)]:motion-safe:rtl:-translate-x-0.5 group-focus-visible/row:[@container(min-width:40rem)]:motion-safe:ltr:translate-x-0.5 group-focus-visible/row:[@container(min-width:40rem)]:motion-safe:rtl:-translate-x-0.5"

export interface BlogCardsNumberedReadingListProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsNumberedReadingListCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function BlogCardsNumberedReadingList({
  locale = "en",
  eyebrow,
  heading,
  note,
  posts,
  emptyLabel,
  className,
  ...props
}: BlogCardsNumberedReadingListProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const titleId = React.useId()
  const list = posts ?? copy.posts
  const lines = { eyebrow: eyebrow ?? copy.eyebrow, note: note ?? copy.note }

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "[container-type:inline-size] bg-muted px-4 py-8 md:px-6 md:py-16 lg:px-20 lg:py-24",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10">
        <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-8">
          <div className="flex min-w-0 flex-col gap-2">
            {lines.eyebrow ? (
              <p className="text-xs font-medium uppercase text-muted-foreground">{lines.eyebrow}</p>
            ) : null}
            <h2
              id={headingId}
              className="text-3xl font-semibold text-foreground [@container(min-width:40rem)]:text-4xl"
            >
              {heading ?? copy.heading}
            </h2>
          </div>
          {lines.note ? <p className="shrink-0 text-sm text-muted-foreground">{lines.note}</p> : null}
        </div>

        {list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
        ) : (
          <ol>
            {list.map((post, index) => (
              <li key={index} className="flex">
                <a href={post.href} aria-labelledby={`${titleId}-${index}`} className={cn(ROW, "w-full")}>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "text-3xl font-semibold tabular-nums text-border transition-colors duration-[180ms] motion-reduce:transition-none [@container(min-width:40rem)]:text-5xl",
                      RANK_HOVER
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <h3
                      id={`${titleId}-${index}`}
                      className={cn(
                        "text-xl font-semibold text-foreground transition-colors duration-[180ms] motion-reduce:transition-none [@container(min-width:40rem)]:text-2xl",
                        TITLE_HOVER
                      )}
                    >
                      {post.title}
                    </h3>
                    <p className="text-base text-muted-foreground">{post.summary}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" tone="secondary" size="sm" radius="rounded">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                  </div>
                  <span
                    aria-hidden="true"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "icon-md", radius: "rounded" }),
                      "pointer-events-none shrink-0 self-start [@container(min-width:40rem)]:self-center"
                    )}
                  >
                    <ArrowRightIcon className={cn("size-4", ARROW_MOVE)} />
                  </span>
                </a>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
