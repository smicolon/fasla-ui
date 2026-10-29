import * as React from "react"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Classic 3-Up Grid.
 *
 * A section header (an eyebrow and a heading, with an outline button at the
 * end) over a row of three article cards. A card is a cover photo over a
 * body: the category badge and the read time, the title, a three-line
 * summary, and the author's initials with their name and the date. The whole
 * card is the link, named by its title.
 *
 * Desktop (Figma 1440) puts the three cards in one row. Tablet (768) puts two
 * side by side and the third across the full width, its cover cropped to a
 * wider 720 by 302. Mobile (360) is one column, the button full width under
 * the heading.
 *
 * Hover and keyboard focus scale the cover from 1.00 to 1.03 inside the
 * card's rounded clip (240ms) and turn the title `info`. Nothing else on the
 * card moves. On Mobile there is no hover; pressing a card dims it to 96% for
 * 120ms. Reduced motion turns the scale and the dimming off, and nothing
 * plays on load, on scroll or on a timer.
 *
 * Arabic mirrors by the page's `dir`: the card order, the button and the
 * header. Photographs are never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsClassic3UpGridPost {
  /** The cover photo. Without one the cover is a `muted` placeholder of the same size. */
  image?: { src: string; alt: string }
  /** The category badge. */
  category: React.ReactNode
  /** The read time, as written: "9 min read". */
  readTime: React.ReactNode
  /** The title, an `h3`, and the card's link. */
  title: React.ReactNode
  /** The summary, three lines at most on Desktop. */
  summary: React.ReactNode
  /** The author's name. Their initials fill the avatar. */
  author: string
  /** The date, as written: "Aug 18, 2026". */
  date: React.ReactNode
  /** Where the card goes. */
  href: string
}

export interface BlogCardsClassic3UpGridCopy {
  /** The small line over the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section heading, an `h2`. */
  heading: React.ReactNode
  /** The button at the end of the header. Hidden when there is no label. */
  action: { label: React.ReactNode; href: string }
  /** The articles, in reading order. */
  posts: BlogCardsClassic3UpGridPost[]
  /** Shown instead of the cards when `posts` is empty. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsClassic3UpGridCopy> = {
  en: {
    eyebrow: "LATEST FROM THE BLOG",
    heading: "Notes on building Fasla",
    action: { label: "View all posts", href: "#" },
    posts: [
      {
        category: "Design Systems",
        readTime: "9 min read",
        title: "Why we rebuilt every token as a variable",
        summary:
          "Six months of drift taught us that a hex code in a style is a promise you cannot keep. Here is the migration, and what it cost.",
        author: "Karim Nasser",
        date: "Aug 18, 2026",
        href: "#",
      },
      {
        category: "RTL & Arabic",
        readTime: "12 min read",
        title: "Arabic type on the web: what breaks & why",
        summary:
          "Line height, kashida, and the quiet assumptions baked into most UI kits — a field guide from building Fasla's RTL layer.",
        author: "Noor Al-Amin",
        date: "Aug 11, 2026",
        href: "#",
      },
      {
        category: "Foundations",
        readTime: "6 min read",
        title: "The 8-point grid is not a religion",
        summary:
          "Where a strict spacing scale helps, where it fights the content, and how we decide which rule wins.",
        author: "Lina Haddad",
        date: "Aug 4, 2026",
        href: "#",
      },
    ],
    emptyLabel: "No articles yet.",
  },
  ar: {
    eyebrow: "جديد المدونة",
    heading: "ملاحظات من بناء فاصلة",
    action: { label: "عرض كل المقالات", href: "#" },
    posts: [
      {
        category: "أنظمة التصميم",
        readTime: "قراءة 9 دقائق",
        title: "لماذا أعدنا بناء كل رمز تصميمي كمتغيّر",
        summary:
          "ستة أشهر من الانحراف علّمتنا أن كود اللون داخل نمطٍ ما وعدٌ لا يمكن الوفاء به. إليكم قصة الترحيل وما كلّفنا.",
        author: "كريم ناصر",
        date: "18 أغسطس 2026",
        href: "#",
      },
      {
        category: "العربية وRTL",
        readTime: "قراءة 12 دقيقة",
        title: "الخط العربي على الويب: ما الذي ينكسر ولماذا",
        summary:
          "ارتفاع السطر، والكشيدة، والافتراضات الصامتة المخبوءة في معظم أطقم الواجهات، وهو دليل ميداني من بناء طبقة RTL في فاصلة.",
        author: "نور الأمين",
        date: "11 أغسطس 2026",
        href: "#",
      },
      {
        category: "الأساسيات",
        readTime: "قراءة 6 دقائق",
        title: "شبكة الثماني نقاط ليست عقيدة",
        summary: "أين يفيد مقياس التباعد الصارم، وأين يصطدم بالمحتوى، وكيف نقرر أي قاعدة تنتصر.",
        author: "لينا حدّاد",
        date: "4 أغسطس 2026",
        href: "#",
      },
    ],
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsClassic3UpGridCopy = COPY

/*
 * The hover and focus classes, from Tablet up (Mobile has none), written out
 * whole: Tailwind finds a class by reading the source, so none is built from
 * pieces.
 */
const COVER_HOVER =
  "group-hover/card:[@container(min-width:40rem)]:motion-safe:scale-[1.03] group-focus-visible/card:[@container(min-width:40rem)]:motion-safe:scale-[1.03]"
const TITLE_HOVER =
  "group-hover/card:[@container(min-width:40rem)]:text-info group-focus-visible/card:[@container(min-width:40rem)]:text-info"
/** Focus and the Mobile press, on the card's own link. */
const CARD_STATE =
  "[outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:[@container(max-width:39.99rem)]:opacity-[0.96]"

export interface BlogCardsClassic3UpGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsClassic3UpGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function BlogCardsClassic3UpGrid({
  locale = "en",
  eyebrow,
  heading,
  action,
  posts,
  emptyLabel,
  className,
  ...props
}: BlogCardsClassic3UpGridProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const titleId = React.useId()
  const list = posts ?? copy.posts
  const header = { eyebrow: eyebrow ?? copy.eyebrow, action: action ?? copy.action }

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:px-20 lg:py-24",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12">
        <div className="flex flex-col gap-5 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-8">
          <div className="flex min-w-0 flex-col gap-2">
            {header.eyebrow ? (
              <p className="text-xs font-medium uppercase text-muted-foreground">{header.eyebrow}</p>
            ) : null}
            <h2
              id={headingId}
              className="text-3xl font-semibold text-foreground [@container(min-width:40rem)]:text-4xl"
            >
              {heading ?? copy.heading}
            </h2>
          </div>
          {header.action.label ? (
            <a
              href={header.action.href}
              className={cn(
                buttonVariants({ variant: "outline", size: "md" }),
                "w-full shrink-0 [@container(min-width:40rem)]:w-auto"
              )}
            >
              {header.action.label}
              <ArrowRightIcon aria-hidden="true" className="size-4 rtl:-scale-x-100" />
            </a>
          ) : null}
        </div>

        {list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-8 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:grid-cols-3">
            {list.map((post, index) => {
              // An odd last card spans the row on Tablet, with a wider cover.
              const wide = list.length % 2 === 1 && index === list.length - 1
              return (
                <li key={index} className={cn("flex", wide && "[@container(min-width:40rem)_and_(max-width:63.99rem)]:col-span-2")}>
                  <a
                    href={post.href}
                    aria-labelledby={`${titleId}-${index}`}
                    className={cn(
                      "group/card flex w-full flex-col overflow-hidden rounded-lg border bg-card transition-opacity duration-[120ms] motion-reduce:transition-none",
                      CARD_STATE
                    )}
                  >
                    <div
                      className={cn(
                        "relative aspect-video w-full overflow-hidden bg-muted",
                        wide && "[@container(min-width:40rem)_and_(max-width:63.99rem)]:aspect-[720/302]"
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
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" tone="secondary" size="sm" radius="rounded">
                          {post.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{post.readTime}</span>
                      </div>
                      <h3 id={`${titleId}-${index}`} className={cn("text-lg font-semibold text-foreground", TITLE_HOVER)}>
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{post.summary}</p>
                      <div className="flex items-center gap-2">
                        <Avatar variant="initials" size="24" radius="rounded" name={post.author} aria-hidden="true" />
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
