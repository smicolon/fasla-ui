import * as React from "react"
import { MailIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Newsletter + Latest.
 *
 * A subscribe panel beside a short list of the latest posts, on the page
 * background. The panel is an inverted card, dark in light mode and light in
 * dark mode, painted with the inverse tokens: a mail icon, a title, a note, a
 * form (an email field and a secondary "Subscribe" button) and a line of small
 * print. The list has a label with a "View all" link, then four rows: a
 * thumbnail, a title and a line of category, date and read time, each ruled by
 * a hairline. Each row is one link named by its title.
 *
 * The form is the Input atom and the Button atom, so the field's focus ring is
 * the atom's own; this block draws no other state. It submits nowhere: the
 * browser's own submit is cancelled, and `onSubmit` receives the event so the
 * page can read the address.
 *
 * Desktop (Figma 1440) sets the panel 560 wide and the list 672 beside it, the
 * thumbnails 88 by 66. Tablet (768) stacks them, the thumbnails 96 by 72.
 * Mobile (360) stacks them with the form in a column and 72 by 56 thumbnails.
 *
 * Hovering a row scales its thumbnail from 1.00 to 1.06 inside its clip and
 * turns its title `info` (180ms). Keyboard focus does the same. There is no
 * hover on Mobile; pressing a row dims it to 92%. The mail icon is decorative
 * and does not move. Reduced motion turns the scale off. Nothing plays on load
 * or on a timer.
 *
 * Arabic mirrors by the page's `dir`: on Desktop the panel is at the right and
 * the list at the left, the thumbnails sit at the right of each row, and the
 * field's text is aligned to the start. The photographs are never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsNewsletterLatestPanel {
  /** The panel title, an `h2`. */
  title: React.ReactNode
  /** The note under the title. */
  note: React.ReactNode
  /** The email field's placeholder. */
  placeholder: string
  /** The email field's accessible name. The field shows no label, as in Figma. Falls back to the default copy's. */
  emailLabel?: string
  /** The button's label. */
  submitLabel: React.ReactNode
  /** The small print under the form. Hidden when empty. */
  smallPrint: React.ReactNode
}

export interface BlogCardsNewsletterLatestPost {
  /** The thumbnail. Without one the thumbnail is a placeholder of the same size. */
  image?: { src: string; alt: string }
  /** The category. */
  category: React.ReactNode
  /** The date, as written: "Aug 18, 2026". */
  date: React.ReactNode
  /** The read time, as written: "9 min read". */
  readTime: React.ReactNode
  /** The title, an `h3`, and the row's accessible name. */
  title: React.ReactNode
  /** Where the row goes. */
  href: string
}

export interface BlogCardsNewsletterLatestCopy {
  /** The subscribe panel. */
  panel: BlogCardsNewsletterLatestPanel
  /** The label over the list, an `h2`. */
  latestLabel: React.ReactNode
  /** The link at the end of the list label. Hidden when null. */
  viewAll: { label: React.ReactNode; href: string } | null
  /** The latest posts, in reading order. */
  latest: BlogCardsNewsletterLatestPost[]
  /** Shown instead of the rows when `latest` is empty. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsNewsletterLatestCopy> = {
  en: {
    panel: {
      title: "The Fasla dispatch",
      note: "One email a month: new posts, what changed in the system, and the decisions behind it. No product news.",
      placeholder: "you@company.com",
      emailLabel: "Email address",
      submitLabel: "Subscribe",
      smallPrint: "2,140 designers and engineers already read it. Unsubscribe any time.",
    },
    latestLabel: "LATEST POSTS",
    viewAll: { label: "View all", href: "#" },
    latest: [
      { category: "Design Systems", date: "Aug 18, 2026", readTime: "9 min read", title: "Why we rebuilt every token as a Figma variable", href: "#" },
      { category: "RTL & Arabic", date: "Aug 11, 2026", readTime: "12 min read", title: "Arabic type on the web: what breaks and why", href: "#" },
      { category: "Foundations", date: "Aug 4, 2026", readTime: "6 min read", title: "The 8-point grid is not a religion", href: "#" },
      { category: "Engineering", date: "Jul 28, 2026", readTime: "8 min read", title: "Shipping dark mode without a second design file", href: "#" },
    ],
    emptyLabel: "No articles yet.",
  },
  ar: {
    panel: {
      title: "نشرة فاصلة",
      note: "بريد واحد في الشهر: مقالات جديدة، وما تغيّر في النظام، والقرارات وراء ذلك. بلا أخبار منتجات.",
      placeholder: "you@company.com",
      emailLabel: "البريد الإلكتروني",
      submitLabel: "اشترك",
      smallPrint: "2,140 مصمماً ومهندساً يقرؤونها بالفعل. ألغِ الاشتراك متى شئت.",
    },
    latestLabel: "أحدث المقالات",
    viewAll: { label: "عرض الكل", href: "#" },
    latest: [
      { category: "أنظمة التصميم", date: "18 أغسطس 2026", readTime: "قراءة 9 دقائق", title: "لماذا أعدنا بناء كل رمز تصميمي كمتغيّر في Figma", href: "#" },
      { category: "العربية وRTL", date: "11 أغسطس 2026", readTime: "قراءة 12 دقيقة", title: "الخط العربي على الويب: ما الذي ينكسر ولماذا", href: "#" },
      { category: "الأساسيات", date: "4 أغسطس 2026", readTime: "قراءة 6 دقائق", title: "شبكة الثماني نقاط ليست عقيدة", href: "#" },
      { category: "الهندسة", date: "28 يوليو 2026", readTime: "قراءة 8 دقائق", title: "إطلاق الوضع الداكن دون ملف تصميم ثانٍ", href: "#" },
    ],
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsNewsletterLatestCopy = COPY

/*
 * Every class below is written out whole: Tailwind finds a class by reading
 * the source, so none is built from pieces. The hover and focus ones are from
 * Tablet up (Mobile has none).
 */
const ROW =
  "group/row flex items-center gap-4 border-b py-4 transition-opacity duration-[120ms] motion-reduce:transition-none [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:[@container(max-width:39.99rem)]:opacity-[0.92]"
const THUMB_HOVER =
  "group-hover/row:[@container(min-width:40rem)]:motion-safe:scale-[1.06] group-focus-visible/row:[@container(min-width:40rem)]:motion-safe:scale-[1.06]"
/*
 * The field sits on the inverse panel, which is white in dark mode, while the
 * Input atom paints itself with mode tokens: a 5% white fill and a 20% white
 * border (invisible on white), a `muted-foreground` placeholder (#d4d4d4, about
 * 1.5:1) and `foreground` text (near-white). In dark mode the field reads the
 * inverse tokens instead, so its edge, placeholder and text are visible
 * (`muted-foreground-inverse` is 4.7:1 on the panel). Light mode is the atom's
 * own, as Figma draws it.
 */
const FIELD =
  "min-w-0 flex-1 dark:[&_[data-slot=input-box]]:border-muted-foreground-inverse dark:[&_[data-slot=input-box]]:bg-transparent dark:[&_[data-slot=input]]:text-foreground-inverse dark:[&_[data-slot=input]]:placeholder:text-muted-foreground-inverse"
const TITLE_HOVER =
  "group-hover/row:[@container(min-width:40rem)]:text-info group-focus-visible/row:[@container(min-width:40rem)]:text-info"

export interface BlogCardsNewsletterLatestProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<BlogCardsNewsletterLatestCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Called with the submit event. The block submits nowhere itself. */
  onSubmit?: React.FormEventHandler<HTMLFormElement>
}

export function BlogCardsNewsletterLatest({
  locale = "en",
  panel,
  latestLabel,
  viewAll,
  latest,
  emptyLabel,
  onSubmit,
  className,
  ...props
}: BlogCardsNewsletterLatestProps) {
  const copy = COPY[locale]
  const panelId = React.useId()
  const listId = React.useId()
  const rowId = React.useId()
  const form = panel ?? copy.panel
  const list = latest ?? copy.latest
  const link = viewAll === undefined ? copy.viewAll : viewAll

  return (
    <section
      aria-labelledby={panelId}
      className={cn(
        "[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:px-20 lg:py-24",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 [@container(min-width:40rem)]:gap-10 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:gap-12">
        <div className="flex flex-col gap-6 rounded-xl bg-background-inverse p-6 [@container(min-width:40rem)]:p-10 [@container(min-width:64rem)]:w-[560px] [@container(min-width:64rem)]:shrink-0">
          <MailIcon aria-hidden="true" className="size-7 text-foreground-inverse" />
          <h2
            id={panelId}
            className="text-2xl font-semibold text-foreground-inverse [@container(min-width:40rem)]:text-3xl"
          >
            {form.title}
          </h2>
          <p className="text-base text-muted-foreground-inverse">{form.note}</p>
          <form
            className="flex flex-col gap-2 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center"
            onSubmit={(event) => {
              event.preventDefault()
              onSubmit?.(event)
            }}
          >
            <Input
              type="email"
              name="email"
              size="md"
              autoComplete="email"
              aria-label={form.emailLabel ?? copy.panel.emailLabel}
              placeholder={form.placeholder}
              className={FIELD}
            />
            <Button type="submit" variant="secondary" size="md" className="w-full [@container(min-width:40rem)]:w-auto">
              {form.submitLabel}
            </Button>
          </form>
          {form.smallPrint ? <p className="text-xs text-muted-foreground-inverse">{form.smallPrint}</p> : null}
        </div>

        <div className="flex min-w-0 flex-col [@container(min-width:64rem)]:flex-1">
          <div className="flex items-center justify-between gap-4 border-b pb-3">
            <h2 id={listId} className="min-w-0 text-xs font-medium uppercase text-muted-foreground">
              {latestLabel ?? copy.latestLabel}
            </h2>
            {link ? (
              <a
                href={link.href}
                className="relative shrink-0 text-xs font-medium text-info [outline:none] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring after:absolute after:left-1/2 after:top-1/2 after:h-11 after:w-[max(100%,2.75rem)] after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']"
              >
                {link.label}
              </a>
            ) : null}
          </div>
          {list.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
          ) : (
            <ul>
              {list.map((post, index) => (
                <li key={index} className="flex">
                  <a
                    href={post.href}
                    aria-labelledby={`${rowId}-${index}`}
                    className={cn(ROW, "w-full", index === list.length - 1 && "border-b-0")}
                  >
                    <div className="relative h-14 w-[72px] shrink-0 overflow-hidden rounded-sm bg-muted [@container(min-width:40rem)]:h-[72px] [@container(min-width:40rem)]:w-24 [@container(min-width:64rem)]:h-[66px] [@container(min-width:64rem)]:w-[88px]">
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
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <h3
                        id={`${rowId}-${index}`}
                        className={cn(
                          "text-base font-medium text-foreground transition-colors duration-[180ms] motion-reduce:transition-none",
                          TITLE_HOVER
                        )}
                      >
                        {post.title}
                      </h3>
                      <span className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                        <span>{post.category}</span>
                        <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
                        <span>{post.date}</span>
                        <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
                        <span>{post.readTime}</span>
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
