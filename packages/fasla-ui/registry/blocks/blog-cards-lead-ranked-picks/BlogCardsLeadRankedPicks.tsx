import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Badge } from "../../ui/badge/badge"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Lead + Ranked Picks.
 *
 * One lead story beside a ranked shortlist, on the page background. The lead
 * is a cover, a soft category badge with the date and read time, a large
 * title, a summary and the author. The shortlist is a `muted` panel headed
 * "Editor's picks" with five numbered rows: a rank, a title and a line of
 * category and read time, each ruled by a hairline. The lead is one link named
 * by its title; so is each pick.
 *
 * Desktop (Figma 1440) sets the lead 780 wide and the panel 452 beside it, the
 * cover 780 by 420. Tablet (768) stacks them: the cover is 720 by 380 and the
 * panel runs the full width under the lead. Mobile (360) does the same at 328
 * by 184, with the title a size down.
 *
 * Hovering the lead scales its cover from 1.00 to 1.03 inside its rounded clip
 * (280ms) and turns its title `info`. Hovering a pick turns its rank from
 * `muted-foreground` to `foreground` and its title `info` (180ms). Keyboard
 * focus does the same. There is no hover on Mobile; pressing a pick dims it to
 * 92% and pressing the lead to 96%. Reduced motion turns the scale off.
 * Nothing plays on load or on a timer.
 *
 * Arabic mirrors by the page's `dir`: on Desktop the lead is at the right and
 * the panel at the left, and each pick's rank sits at the right end of its
 * row. The ranks keep their Latin digits, as in Figma. The photograph is never
 * flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsLeadRankedPicksLead {
  /** The cover photo. Without one the cover is a placeholder of the same size. */
  image?: { src: string; alt: string }
  /** The category badge. */
  category: React.ReactNode
  /** The date, as written: "Aug 18, 2026". Shown in the first line and again by the author. */
  date: React.ReactNode
  /** The read time, as written: "9 min read". */
  readTime: React.ReactNode
  /** The title, an `h2`, and the link's accessible name. */
  title: React.ReactNode
  /** The summary. */
  summary: React.ReactNode
  /** The author's name. Their initials fill the avatar. */
  author: string
  /** Where the lead story goes. */
  href: string
}

export interface BlogCardsLeadRankedPicksPick {
  /** The title, an `h3`, and the row's accessible name. */
  title: React.ReactNode
  /** The category. */
  category: React.ReactNode
  /** The read time, as written: "8 min read". */
  readTime: React.ReactNode
  /** Where the row goes. */
  href: string
}

export interface BlogCardsLeadRankedPicksCopy {
  /** The lead story. Without one the panel stands alone. */
  lead: BlogCardsLeadRankedPicksLead | null
  /** The label over the shortlist, an `h2`. */
  picksLabel: React.ReactNode
  /** The shortlist, in rank order; each gets its place number, `01` upward. */
  picks: BlogCardsLeadRankedPicksPick[]
  /** Shown instead of the block when there is neither a lead nor a pick. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsLeadRankedPicksCopy> = {
  en: {
    lead: {
      category: "Design Systems",
      date: "Aug 18, 2026",
      readTime: "9 min read",
      title: "Why we rebuilt every token as a Figma variable",
      summary:
        "Six months of drift taught us that a hex code in a style is a promise you cannot keep. Here is the migration, and what it cost.",
      author: "Karim Nasser",
      href: "#",
    },
    picksLabel: "EDITOR'S PICKS",
    picks: [
      { title: "Shipping dark mode without a second design file", category: "Engineering", readTime: "8 min read", href: "#" },
      { title: "Component APIs designers actually use", category: "Engineering", readTime: "8 min read", href: "#" },
      { title: "Writing UI copy that translates", category: "Content", readTime: "6 min read", href: "#" },
      { title: "Icons are a language, not a library", category: "Foundations", readTime: "6 min read", href: "#" },
      { title: "Documenting a component so an agent can use it", category: "Engineering", readTime: "11 min read", href: "#" },
    ],
    emptyLabel: "No articles yet.",
  },
  ar: {
    lead: {
      category: "أنظمة التصميم",
      date: "18 أغسطس 2026",
      readTime: "قراءة 9 دقائق",
      title: "لماذا أعدنا بناء كل رمز تصميمي كمتغيّر في Figma",
      summary:
        "ستة أشهر من الانحراف علّمتنا أن كود اللون داخل نمطٍ ما وعدٌ لا يمكن الوفاء به. إليكم قصة الترحيل وما كلّفنا.",
      author: "كريم ناصر",
      href: "#",
    },
    picksLabel: "اختيارات المحرر",
    picks: [
      { title: "إطلاق الوضع الداكن دون ملف تصميم ثانٍ", category: "الهندسة", readTime: "قراءة 8 دقائق", href: "#" },
      { title: "واجهات مكوّنات يستخدمها المصممون فعلاً", category: "الهندسة", readTime: "قراءة 8 دقائق", href: "#" },
      { title: "كتابة نصوص واجهات قابلة للترجمة", category: "المحتوى", readTime: "قراءة 6 دقائق", href: "#" },
      { title: "الأيقونات لغة لا مكتبة", category: "الأساسيات", readTime: "قراءة 6 دقائق", href: "#" },
      { title: "توثيق المكوّن ليستطيع وكيل ذكي استخدامه", category: "الهندسة", readTime: "قراءة 11 دقيقة", href: "#" },
    ],
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsLeadRankedPicksCopy = COPY

/*
 * Every class below is written out whole: Tailwind finds a class by reading
 * the source, so none is built from pieces. The hover and focus ones are from
 * Tablet up (Mobile has none).
 */
const LEAD =
  "group/lead flex min-w-0 flex-col gap-5 transition-opacity duration-[120ms] motion-reduce:transition-none [@container(min-width:64rem)]:flex-1 [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:[@container(max-width:39.99rem)]:opacity-[0.96]"
const COVER_HOVER =
  "group-hover/lead:[@container(min-width:40rem)]:motion-safe:scale-[1.03] group-focus-visible/lead:[@container(min-width:40rem)]:motion-safe:scale-[1.03]"
const LEAD_TITLE_HOVER =
  "group-hover/lead:[@container(min-width:40rem)]:text-info group-focus-visible/lead:[@container(min-width:40rem)]:text-info"
const PICK =
  "group/pick flex gap-4 border-b py-4 transition-opacity duration-[120ms] motion-reduce:transition-none [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:[@container(max-width:39.99rem)]:opacity-[0.92]"
const RANK_HOVER =
  "group-hover/pick:[@container(min-width:40rem)]:text-foreground group-focus-visible/pick:[@container(min-width:40rem)]:text-foreground"
const PICK_TITLE_HOVER =
  "group-hover/pick:[@container(min-width:40rem)]:text-info group-focus-visible/pick:[@container(min-width:40rem)]:text-info"

export interface BlogCardsLeadRankedPicksProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsLeadRankedPicksCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function BlogCardsLeadRankedPicks({
  locale = "en",
  lead,
  picksLabel,
  picks,
  emptyLabel,
  className,
  ...props
}: BlogCardsLeadRankedPicksProps) {
  const copy = COPY[locale]
  const leadId = React.useId()
  const picksId = React.useId()
  const titleId = React.useId()
  const story = lead === undefined ? copy.lead : lead
  const list = picks ?? copy.picks
  const label = picksLabel ?? copy.picksLabel

  return (
    <section
      aria-labelledby={story ? leadId : list.length > 0 ? picksId : undefined}
      className={cn(
        "[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:px-20 lg:py-24",
        className
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1280px]">
        {!story && list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
        ) : (
          <div className="flex flex-col gap-8 [@container(min-width:40rem)]:gap-10 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:gap-12">
            {story ? (
              <a href={story.href} aria-labelledby={leadId} className={LEAD}>
                <div className="relative aspect-[328/184] w-full overflow-hidden rounded-lg bg-muted [@container(min-width:40rem)]:aspect-[720/380] [@container(min-width:64rem)]:aspect-[780/420]">
                  {story.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={story.image.src}
                      alt={story.image.alt}
                      loading="lazy"
                      className={cn(
                        "absolute inset-0 size-full object-cover transition-transform duration-[280ms] ease-out motion-reduce:transition-none",
                        COVER_HOVER
                      )}
                    />
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="soft" tone="info" size="sm" radius="rounded">
                    {story.category}
                  </Badge>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{story.date}</span>
                    <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
                    <span>{story.readTime}</span>
                  </span>
                </div>
                <h2
                  id={leadId}
                  className={cn(
                    "text-3xl font-semibold text-foreground transition-colors duration-[180ms] motion-reduce:transition-none [@container(min-width:40rem)]:text-4xl",
                    LEAD_TITLE_HOVER
                  )}
                >
                  {story.title}
                </h2>
                <p className="text-base text-muted-foreground">{story.summary}</p>
                <div className="flex items-center gap-3">
                  <Avatar variant="initials" size="32" radius="rounded" name={story.author} aria-hidden="true" className="size-7" />
                  <span className="text-xs font-medium text-foreground">{story.author}</span>
                  <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{story.date}</span>
                </div>
              </a>
            ) : null}

            {list.length > 0 ? (
              <div className="flex flex-col rounded-lg bg-muted p-6 [@container(min-width:64rem)]:w-[452px] [@container(min-width:64rem)]:shrink-0">
                <h2 id={picksId} className="pb-5 text-xs font-medium uppercase text-muted-foreground">
                  {label}
                </h2>
                <ol>
                  {list.map((pick, index) => (
                    <li key={index} className="flex">
                      <a href={pick.href} aria-labelledby={`${titleId}-${index}`} className={cn(PICK, "w-full", index === list.length - 1 && "border-b-0")}>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "shrink-0 text-lg font-semibold tabular-nums text-muted-foreground transition-colors duration-[180ms] motion-reduce:transition-none",
                            RANK_HOVER
                          )}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <h3
                            id={`${titleId}-${index}`}
                            className={cn(
                              "text-base font-medium text-foreground transition-colors duration-[180ms] motion-reduce:transition-none",
                              PICK_TITLE_HOVER
                            )}
                          >
                            {pick.title}
                          </h3>
                          <span className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{pick.category}</span>
                            <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
                            <span>{pick.readTime}</span>
                          </span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
