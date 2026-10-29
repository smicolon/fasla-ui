import * as React from "react"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Split Feature.
 *
 * One article, half text and half photo, on a `muted` band. The copy has an
 * eyebrow, a large title, a summary, an outline category badge with the date
 * and read time, a hairline, the author's initials with their name and the
 * date, and a solid "Read the article" button with an arrow. The photo is a
 * rounded cover, 600 by 480 on Desktop. The button is the link; the photo is
 * a second, mouse-only link to the same place, hidden from assistive
 * technology and the tab order, so a click on the picture works.
 *
 * Desktop (Figma 1440) sets the copy at the start and the cover at the end.
 * Tablet (768) puts the cover above the copy at full width, 720 by 380.
 * Mobile (360) does the same at 328 by 220, with the title a size down and the
 * button across the full width.
 *
 * Hovering the cover scales it from 1.00 to 1.03 inside its rounded clip
 * (280ms); the title, the summary and the author stay still, and the button
 * has its own hover and press states. There is no hover on Mobile; pressing
 * the picture dims it to 96%. Reduced motion turns both off. Nothing plays on
 * load or on a timer. The cover is not focusable, so keyboard focus on the
 * button does not scale it.
 *
 * Arabic mirrors by the page's `dir`: on Desktop the copy is at the right and
 * the cover at the left, and the arrow is mirrored. The photograph is never
 * flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsSplitFeaturePost {
  /** The cover photo. Without one the cover is a placeholder of the same size. */
  image?: { src: string; alt: string }
  /** The category badge. */
  category: React.ReactNode
  /** The date, as written: "Jun 30, 2026". Shown in the first line and again by the author. */
  date: React.ReactNode
  /** The read time, as written: "11 min read". */
  readTime: React.ReactNode
  /** The title, an `h2`. */
  title: React.ReactNode
  /** The summary. */
  summary: React.ReactNode
  /** The author's name. Their initials fill the avatar. */
  author: string
  /** The button's label. */
  actionLabel: React.ReactNode
  /** Where the button and the cover go. */
  href: string
}

export interface BlogCardsSplitFeatureCopy {
  /** The small line over the title. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The article. Without one the block shows `emptyLabel`. */
  post: BlogCardsSplitFeaturePost | null
  /** Shown instead of the article when `post` is null. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsSplitFeatureCopy> = {
  en: {
    eyebrow: "FEATURED",
    post: {
      category: "Typography",
      date: "Jun 30, 2026",
      readTime: "11 min read",
      title: "A type ramp for two scripts",
      summary:
        "Latin and Arabic disagree about x-height, ascenders, and optical size. Building one ramp that serves both.",
      author: "Yasmin Farouk",
      actionLabel: "Read the article",
      href: "#",
    },
    emptyLabel: "No articles yet.",
  },
  ar: {
    eyebrow: "مقال مميز",
    post: {
      category: "التايبوغرافيا",
      date: "30 يونيو 2026",
      readTime: "قراءة 11 دقيقة",
      title: "سلّم خطوط لنظامي كتابة",
      summary:
        "اللاتينية والعربية تختلفان حول ارتفاع الأحرف والصواعد والحجم البصري. هكذا بنينا سلّماً واحداً يخدم الاثنين.",
      author: "ياسمين فاروق",
      actionLabel: "اقرأ المقال",
      href: "#",
    },
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsSplitFeatureCopy = COPY

/*
 * Every class below is written out whole: Tailwind finds a class by reading
 * the source, so none is built from pieces. The hover ones are from Tablet up
 * (Mobile has none).
 */
const COVER_HOVER = "group-hover/cover:[@container(min-width:40rem)]:motion-safe:scale-[1.03]"

export interface BlogCardsSplitFeatureProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsSplitFeatureCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function BlogCardsSplitFeature({
  locale = "en",
  eyebrow,
  post,
  emptyLabel,
  className,
  ...props
}: BlogCardsSplitFeatureProps) {
  const copy = COPY[locale]
  const titleId = React.useId()
  const article = post === undefined ? copy.post : post
  const line = eyebrow ?? copy.eyebrow

  return (
    <section
      aria-labelledby={article ? titleId : undefined}
      className={cn(
        "[container-type:inline-size] bg-muted px-4 py-8 md:px-6 md:py-16 lg:px-20 lg:py-24",
        className
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1280px]">
        {!article ? (
          <p className="text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
        ) : (
          <div className="flex flex-col gap-8 [@container(min-width:40rem)]:gap-10 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:gap-12">
            <div className="flex min-w-0 flex-col gap-5 [@container(min-width:64rem)]:flex-1">
              {line ? <p className="text-xs font-medium uppercase text-muted-foreground">{line}</p> : null}
              <h2
                id={titleId}
                className="text-3xl font-semibold text-foreground [@container(min-width:40rem)]:text-5xl"
              >
                {article.title}
              </h2>
              <p className="text-lg text-muted-foreground">{article.summary}</p>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" tone="secondary" size="sm" radius="rounded">
                  {article.category}
                </Badge>
                <span className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{article.date}</span>
                  <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
                  <span>{article.readTime}</span>
                </span>
              </div>
              <hr aria-hidden="true" className="h-px w-full border-0 bg-border" />
              <div className="flex items-center gap-3">
                <Avatar variant="initials" size="32" radius="rounded" name={article.author} aria-hidden="true" />
                <span className="text-xs font-medium text-foreground">{article.author}</span>
                <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
                <span className="text-xs text-muted-foreground">{article.date}</span>
              </div>
              <a
                href={article.href}
                className={cn(
                  buttonVariants({ variant: "default", size: "md" }),
                  "w-full [@container(min-width:40rem)]:w-auto [@container(min-width:40rem)]:self-start"
                )}
              >
                {article.actionLabel}
                <ArrowRightIcon aria-hidden="true" className="size-4 rtl:-scale-x-100" />
              </a>
            </div>
            <a
              href={article.href}
              tabIndex={-1}
              aria-hidden="true"
              className={cn(
                "group/cover relative order-first block aspect-[328/220] w-full shrink-0 overflow-hidden rounded-xl bg-background transition-opacity duration-[120ms] motion-reduce:transition-none [@container(min-width:40rem)]:aspect-[720/380] [@container(min-width:64rem)]:order-last [@container(min-width:64rem)]:aspect-[600/480] [@container(min-width:64rem)]:w-[600px]",
                "active:[@container(max-width:39.99rem)]:opacity-[0.96]"
              )}
            >
              {article.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.image.src}
                  alt={article.image.alt}
                  loading="lazy"
                  className={cn(
                    "absolute inset-0 size-full object-cover transition-transform duration-[280ms] ease-out motion-reduce:transition-none",
                    COVER_HOVER
                  )}
                />
              ) : null}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
