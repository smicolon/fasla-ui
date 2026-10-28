import * as React from "react"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Dark Editorial Feature.
 *
 * One long read on an inverted band, dark in light mode and light in dark
 * mode, painted with the inverse tokens alone: `background-inverse`,
 * `foreground-inverse` and `muted-foreground-inverse`. An eyebrow over two
 * parts. The feature is a very large title, a summary, the author with the
 * date and read time, and a secondary "Read the article" button with an arrow.
 * "More in this series" is a ruled list of three rows: a 96 by 72 thumbnail, a
 * title and a line of category and read time. The title is a link, the button
 * is another, and each more-reads row is one link named by its title.
 *
 * Desktop (Figma 1440) sets the feature 784 wide and the list 440 beside it.
 * Tablet (768) stacks them at full width. Mobile (360) does the same with the
 * title a size down, the button across the full width, and the date and read
 * time on a line under the author's name (Figma's single row is 5px wider than
 * the 328px frame).
 *
 * Hovering the feature title draws an underline from its start edge over
 * 200ms; the button has its own hover and press states. Hovering a more-reads
 * row scales its thumbnail from 1.00 to 1.06 and turns its title `info`
 * (180ms). Keyboard focus does the same. There is no hover on Mobile; pressing
 * a row dims it to 92%. Reduced motion turns the underline and the scale off.
 * Nothing plays on load or on a timer.
 *
 * Arabic mirrors by the page's `dir`: the underline draws from the right, on
 * Desktop the feature is at the right and the list at the left, and the arrow
 * is mirrored. The photographs are never flipped.
 *
 * The rules between rows use `muted-foreground-inverse`, the nearest inverse
 * token to the border colour Figma draws there; there is no inverse border
 * token.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsDarkEditorialFeaturePost {
  /** The title, an `h2`. It is a link to the article. */
  title: React.ReactNode
  /** The summary. */
  summary: React.ReactNode
  /** The author's name. Their initials fill the avatar. */
  author: string
  /** The date, as written: "Apr 28, 2026". */
  date: React.ReactNode
  /** The read time, as written: "5 min read". */
  readTime: React.ReactNode
  /** The button's label. */
  actionLabel: React.ReactNode
  /** Where the title and the button go. */
  href: string
}

export interface BlogCardsDarkEditorialFeatureMore {
  /** The thumbnail. Without one the thumbnail is a placeholder of the same size. */
  image?: { src: string; alt: string }
  /** The title, an `h3`, and the row's accessible name. */
  title: React.ReactNode
  /** The category. */
  category: React.ReactNode
  /** The read time, as written: "7 min read". */
  readTime: React.ReactNode
  /** Where the row goes. */
  href: string
}

export interface BlogCardsDarkEditorialFeatureCopy {
  /** The small line over the block. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The feature. Without one the list stands alone. */
  post: BlogCardsDarkEditorialFeaturePost | null
  /** The label over the list, an `h2`. */
  moreLabel: React.ReactNode
  /** The more-reads rows, in reading order. */
  more: BlogCardsDarkEditorialFeatureMore[]
  /** Shown instead of the block when there is neither a feature nor a row. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsDarkEditorialFeatureCopy> = {
  en: {
    eyebrow: "LONG READ",
    post: {
      title: "The case for fewer button variants",
      summary: "We had 96. We shipped 24. Nothing broke, and the docs got shorter.",
      author: "Karim Nasser",
      date: "Apr 28, 2026",
      readTime: "5 min read",
      actionLabel: "Read the article",
      href: "#",
    },
    moreLabel: "MORE IN THIS SERIES",
    more: [
      { title: "Naming things: a spacing scale that survives handoff", category: "Design Systems", readTime: "7 min read", href: "#" },
      { title: "Density modes without forking your components", category: "Design Systems", readTime: "8 min read", href: "#" },
      { title: "A checklist for accessible forms", category: "Accessibility", readTime: "6 min read", href: "#" },
    ],
    emptyLabel: "No articles yet.",
  },
  ar: {
    eyebrow: "قراءة طويلة",
    post: {
      title: "مرافعة لصالح متغيرات أزرار أقل",
      summary: "كان لدينا 96. أطلقنا 24. لم ينكسر شيء، وصارت الوثائق أقصر.",
      author: "كريم ناصر",
      date: "28 أبريل 2026",
      readTime: "قراءة 5 دقائق",
      actionLabel: "اقرأ المقال",
      href: "#",
    },
    moreLabel: "المزيد من هذه السلسلة",
    more: [
      { title: "تسمية الأشياء: مقياس تباعد يصمد بعد التسليم", category: "أنظمة التصميم", readTime: "قراءة 7 دقائق", href: "#" },
      { title: "أوضاع كثافة دون تفريع مكوّناتك", category: "أنظمة التصميم", readTime: "قراءة 8 دقائق", href: "#" },
      { title: "قائمة تحقق للنماذج الميسّرة", category: "إمكانية الوصول", readTime: "قراءة 6 دقائق", href: "#" },
    ],
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsDarkEditorialFeatureCopy = COPY

/*
 * Every class below is written out whole: Tailwind finds a class by reading
 * the source, so none is built from pieces. The hover and focus ones are from
 * Tablet up (Mobile has none).
 */
const TITLE_LINK =
  "[box-decoration-break:clone] bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_2px] ltr:bg-[position:0_100%] rtl:bg-[position:100%_100%] transition-[background-size] duration-200 ease-out motion-reduce:transition-none [outline:none] hover:[@container(min-width:40rem)]:bg-[length:100%_2px] focus-visible:bg-[length:100%_2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground-inverse"
const ROW =
  "group/row flex items-center gap-4 border-b border-muted-foreground-inverse py-4 transition-opacity duration-[120ms] motion-reduce:transition-none [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground-inverse active:[@container(max-width:39.99rem)]:opacity-[0.92]"
const THUMB_HOVER =
  "group-hover/row:[@container(min-width:40rem)]:motion-safe:scale-[1.06] group-focus-visible/row:[@container(min-width:40rem)]:motion-safe:scale-[1.06]"
const ROW_TITLE_HOVER =
  "group-hover/row:[@container(min-width:40rem)]:text-info group-focus-visible/row:[@container(min-width:40rem)]:text-info"

export interface BlogCardsDarkEditorialFeatureProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsDarkEditorialFeatureCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function BlogCardsDarkEditorialFeature({
  locale = "en",
  eyebrow,
  post,
  moreLabel,
  more,
  emptyLabel,
  className,
  ...props
}: BlogCardsDarkEditorialFeatureProps) {
  const copy = COPY[locale]
  const titleId = React.useId()
  const moreId = React.useId()
  const rowId = React.useId()
  const article = post === undefined ? copy.post : post
  const list = more ?? copy.more
  const line = eyebrow ?? copy.eyebrow
  const label = moreLabel ?? copy.moreLabel

  return (
    <section
      aria-labelledby={article ? titleId : list.length > 0 ? moreId : undefined}
      className={cn(
        "[container-type:inline-size] bg-background-inverse px-4 py-8 text-foreground-inverse md:px-6 md:py-16 lg:px-20 lg:py-24",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-14">
        {!article && list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground-inverse">{emptyLabel ?? copy.emptyLabel}</p>
        ) : (
          <>
            {line ? <p className="text-xs font-medium uppercase text-muted-foreground-inverse">{line}</p> : null}
            <div className="flex flex-col gap-8 [@container(min-width:40rem)]:gap-10 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:gap-14">
              {article ? (
                <div className="flex min-w-0 flex-col gap-6 [@container(min-width:64rem)]:flex-1">
                  <h2
                    id={titleId}
                    className="text-4xl font-semibold text-foreground-inverse [@container(min-width:40rem)]:text-6xl"
                  >
                    <a href={article.href} className={TITLE_LINK}>
                      {article.title}
                    </a>
                  </h2>
                  <p className="text-xl text-muted-foreground-inverse">{article.summary}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 whitespace-nowrap">
                    <Avatar
                      variant="initials"
                      size="32"
                      radius="rounded"
                      border
                      name={article.author}
                      aria-hidden="true"
                      className="size-9"
                    />
                    <span className="text-sm font-medium text-foreground-inverse">{article.author}</span>
                    <span
                      aria-hidden="true"
                      className="hidden size-[3px] rounded-full bg-muted-foreground-inverse [@container(min-width:40rem)]:block"
                    />
                    <span className="flex w-full items-center gap-3 ps-12 text-sm text-muted-foreground-inverse [@container(min-width:40rem)]:w-auto [@container(min-width:40rem)]:ps-0">
                      <span>{article.date}</span>
                      <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground-inverse" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>
                  <a
                    href={article.href}
                    className={cn(
                      buttonVariants({ variant: "secondary", size: "md" }),
                      "w-full [@container(min-width:40rem)]:w-auto [@container(min-width:40rem)]:self-start"
                    )}
                  >
                    {article.actionLabel}
                    <ArrowRightIcon aria-hidden="true" className="size-4 rtl:-scale-x-100" />
                  </a>
                </div>
              ) : null}

              {list.length > 0 ? (
                <div className="flex min-w-0 flex-col [@container(min-width:64rem)]:w-[440px] [@container(min-width:64rem)]:shrink-0">
                  <h2 id={moreId} className="pb-4 text-xs font-medium uppercase text-muted-foreground-inverse">
                    {label}
                  </h2>
                  <ul>
                    {list.map((row, index) => (
                      <li key={index} className="flex">
                        <a href={row.href} aria-labelledby={`${rowId}-${index}`} className={cn(ROW, "w-full", index === list.length - 1 && "border-b-0")}>
                          <div className="relative h-[72px] w-24 shrink-0 overflow-hidden rounded-sm bg-foreground-inverse/10">
                            {row.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={row.image.src}
                                alt={row.image.alt}
                                loading="lazy"
                                className={cn(
                                  "absolute inset-0 size-full object-cover transition-transform duration-[180ms] ease-out motion-reduce:transition-none",
                                  THUMB_HOVER
                                )}
                              />
                            ) : null}
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <h3
                              id={`${rowId}-${index}`}
                              className={cn(
                                "text-base font-medium text-foreground-inverse transition-colors duration-[180ms] motion-reduce:transition-none",
                                ROW_TITLE_HOVER
                              )}
                            >
                              {row.title}
                            </h3>
                            <span className="flex items-center gap-2 text-xs text-muted-foreground-inverse">
                              <span>{row.category}</span>
                              <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground-inverse" />
                              <span>{row.readTime}</span>
                            </span>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
