import * as React from "react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Magazine Cover Story.
 *
 * A magazine page, set in text and one photograph; there are no library
 * components in it. A masthead (the magazine's name at the start, the issue
 * at the end) over a heavy rule. Under it the cover story: a kicker, a very
 * large title, a wide cover, and a caption row with a standfirst and a
 * byline. Beside it, "Also in this issue": four briefs, each a kicker in the
 * `info` colour, a title and a summary, ruled by hairlines. The cover story is
 * one link named by its title; so is each brief.
 *
 * Desktop (Figma 1440) sets the cover story 860 wide and the briefs 380
 * beside it, with a hairline between them. Tablet (768) stacks them: the cover
 * is 720 by 340 and the briefs run the full width under a hairline. Mobile
 * (360) does the same at 328 by 200, with the title a size down, the masthead
 * stacked and the byline under the standfirst.
 *
 * Hovering the cover story scales its cover from 1.00 to 1.02 inside its
 * rounded clip (320ms) and turns its title `info`. Hovering a brief turns its
 * title `info`. Keyboard focus does the same. There is no hover on Mobile;
 * pressing the story or a brief dims it to 96%. Reduced motion turns the
 * scale off. Nothing plays on load, on scroll or on a timer.
 *
 * Arabic mirrors by the page's `dir`: on Desktop the cover story is at the
 * right and the briefs at the left, the hairline between them is on the
 * briefs' start edge, and the byline is at the left. The photograph is never
 * flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsMagazineCoverStoryMasthead {
  /** The magazine's name. */
  title: React.ReactNode
  /** The issue, as written: "ISSUE 07". */
  issue: React.ReactNode
  /** The issue's date, as written: "AUGUST 2026". Hidden when empty. */
  issueDate: React.ReactNode
}

export interface BlogCardsMagazineCoverStoryStory {
  /** The cover photo. Without one the cover is a placeholder of the same size. */
  image?: { src: string; alt: string }
  /** The kicker over the title. */
  kicker: React.ReactNode
  /** The title, an `h2`, and the link's accessible name. */
  title: React.ReactNode
  /** The line beside the byline. */
  standfirst: React.ReactNode
  /** The author line, as written: "By Elise Fournier". */
  byline: React.ReactNode
  /** The date, as written: "May 19, 2026". */
  date: React.ReactNode
  /** The read time, as written: "6 min read". */
  readTime: React.ReactNode
  /** Where the cover story goes. */
  href: string
}

export interface BlogCardsMagazineCoverStoryBrief {
  /** The kicker, in the `info` colour. */
  kicker: React.ReactNode
  /** The title, an `h3`, and the row's accessible name. */
  title: React.ReactNode
  /** The summary. */
  summary: React.ReactNode
  /** Where the brief goes. */
  href: string
}

export interface BlogCardsMagazineCoverStoryCopy {
  /** The masthead. Hidden when null. */
  masthead: BlogCardsMagazineCoverStoryMasthead | null
  /** The cover story. Without one the briefs stand alone. */
  story: BlogCardsMagazineCoverStoryStory | null
  /** The label over the briefs, an `h2`. */
  briefsLabel: React.ReactNode
  /** The briefs, in reading order. */
  briefs: BlogCardsMagazineCoverStoryBrief[]
  /** Shown instead of the page when there is neither a story nor a brief. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsMagazineCoverStoryCopy> = {
  en: {
    masthead: { title: "THE FASLA REVIEW", issue: "ISSUE 07", issueDate: "AUGUST 2026" },
    story: {
      kicker: "CONTENT",
      title: "Writing UI copy that translates",
      standfirst: "Sentence fragments, concatenated strings, and other habits that make localisation expensive.",
      byline: "By Elise Fournier",
      date: "May 19, 2026",
      readTime: "6 min read",
      href: "#",
    },
    briefsLabel: "ALSO IN THIS ISSUE",
    briefs: [
      {
        kicker: "ACCESSIBILITY",
        title: "How we test contrast before a component ships",
        summary: "An automated pass over every variant in every mode, run on each pull request. Here is the pipeline.",
        href: "#",
      },
      {
        kicker: "RTL & ARABIC",
        title: "Kashida, ligatures, and line height",
        summary: "Three Arabic typesetting features that most component libraries silently disable.",
        href: "#",
      },
      {
        kicker: "COMMUNITY",
        title: "What we learned running an office-hours clinic",
        summary: "Twelve weeks of open sessions with product teams, and the three questions that came up every time.",
        href: "#",
      },
      {
        kicker: "FOUNDATIONS",
        title: "Optical alignment beats mathematical alignment",
        summary: "Why centred icons never look centred, and the four-pixel corrections we bake into the atoms.",
        href: "#",
      },
    ],
    emptyLabel: "No articles yet.",
  },
  ar: {
    masthead: { title: "مجلة فاصلة", issue: "العدد 07", issueDate: "أغسطس 2026" },
    story: {
      kicker: "المحتوى",
      title: "كتابة نصوص واجهات قابلة للترجمة",
      standfirst: "شذرات الجمل، والسلاسل الموصولة، وعادات أخرى تجعل التوطين مكلفاً.",
      byline: "بقلم إليز فورنييه",
      date: "19 مايو 2026",
      readTime: "قراءة 6 دقائق",
      href: "#",
    },
    briefsLabel: "أيضاً في هذا العدد",
    briefs: [
      {
        kicker: "إمكانية الوصول",
        title: "كيف نختبر التباين قبل إطلاق أي مكوّن",
        summary: "فحص آلي لكل متغيّر في كل وضع، يعمل مع كل طلب دمج. إليكم خط الأنابيب.",
        href: "#",
      },
      {
        kicker: "العربية وRTL",
        title: "الكشيدة والوصلات وارتفاع السطر",
        summary: "ثلاث خصائص لتنضيد العربية تعطّلها معظم مكتبات المكوّنات بصمت.",
        href: "#",
      },
      {
        kicker: "المجتمع",
        title: "ما تعلمناه من عيادة الساعات المكتبية",
        summary: "اثنا عشر أسبوعاً من الجلسات المفتوحة مع فرق المنتج، والأسئلة الثلاثة التي تكررت كل مرة.",
        href: "#",
      },
      {
        kicker: "الأساسيات",
        title: "المحاذاة البصرية تتفوق على المحاذاة الحسابية",
        summary: "لماذا لا تبدو الأيقونات الموسّطة موسّطة أبداً، وتصحيحات الأربع بكسلات التي نخبزها في الذرّات.",
        href: "#",
      },
    ],
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsMagazineCoverStoryCopy = COPY

/*
 * Every class below is written out whole: Tailwind finds a class by reading
 * the source, so none is built from pieces. The hover and focus ones are from
 * Tablet up (Mobile has none).
 */
const STORY =
  "group/story flex min-w-0 flex-col gap-5 transition-opacity duration-[120ms] motion-reduce:transition-none [@container(min-width:64rem)]:flex-1 [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:[@container(max-width:39.99rem)]:opacity-[0.96]"
const COVER_HOVER =
  "group-hover/story:[@container(min-width:40rem)]:motion-safe:scale-[1.02] group-focus-visible/story:[@container(min-width:40rem)]:motion-safe:scale-[1.02]"
const STORY_TITLE_HOVER =
  "group-hover/story:[@container(min-width:40rem)]:text-info group-focus-visible/story:[@container(min-width:40rem)]:text-info"
const BRIEF =
  "group/brief flex flex-col gap-2 border-b py-5 transition-opacity duration-[120ms] motion-reduce:transition-none [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:[@container(max-width:39.99rem)]:opacity-[0.96]"
const BRIEF_TITLE_HOVER =
  "group-hover/brief:[@container(min-width:40rem)]:text-info group-focus-visible/brief:[@container(min-width:40rem)]:text-info"

export interface BlogCardsMagazineCoverStoryProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsMagazineCoverStoryCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function BlogCardsMagazineCoverStory({
  locale = "en",
  masthead,
  story,
  briefsLabel,
  briefs,
  emptyLabel,
  className,
  ...props
}: BlogCardsMagazineCoverStoryProps) {
  const copy = COPY[locale]
  const titleId = React.useId()
  const briefsId = React.useId()
  const briefId = React.useId()
  const head = masthead === undefined ? copy.masthead : masthead
  const cover = story === undefined ? copy.story : story
  const list = briefs ?? copy.briefs
  const label = briefsLabel ?? copy.briefsLabel

  return (
    <section
      aria-labelledby={cover ? titleId : list.length > 0 ? briefsId : undefined}
      className={cn(
        "[container-type:inline-size] bg-background px-4 py-8 md:px-6 md:py-16 lg:px-20 lg:py-24",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8">
        {head ? (
          <div className="flex flex-col gap-1 border-b-2 pb-2.5 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-6">
            <p className="min-w-0 text-sm font-semibold uppercase text-foreground">{head.title}</p>
            <p className="flex shrink-0 items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
              <span>{head.issue}</span>
              {head.issueDate ? (
                <>
                  <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
                  <span>{head.issueDate}</span>
                </>
              ) : null}
            </p>
          </div>
        ) : null}

        {!cover && list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
        ) : (
          <div className="flex flex-col gap-8 [@container(min-width:40rem)]:gap-10 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-stretch">
            {cover ? (
              <a href={cover.href} aria-labelledby={titleId} className={STORY}>
                <p className="text-xs font-medium uppercase text-muted-foreground">{cover.kicker}</p>
                <h2
                  id={titleId}
                  className={cn(
                    "text-4xl font-semibold text-foreground transition-colors duration-[180ms] motion-reduce:transition-none [@container(min-width:40rem)]:text-6xl",
                    STORY_TITLE_HOVER
                  )}
                >
                  {cover.title}
                </h2>
                <div className="relative aspect-[328/200] w-full overflow-hidden rounded-md bg-muted [@container(min-width:40rem)]:aspect-[720/340] [@container(min-width:64rem)]:aspect-[860/400]">
                  {cover.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover.image.src}
                      alt={cover.image.alt}
                      loading="lazy"
                      className={cn(
                        "absolute inset-0 size-full object-cover transition-transform duration-[320ms] ease-out motion-reduce:transition-none",
                        COVER_HOVER
                      )}
                    />
                  ) : null}
                </div>
                <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-4">
                  <p className="min-w-0 text-lg text-muted-foreground [@container(min-width:40rem)]:flex-1">
                    {cover.standfirst}
                  </p>
                  <p className="flex shrink-0 flex-col gap-0 text-xs text-muted-foreground [@container(min-width:40rem)]:w-[180px] [@container(min-width:40rem)]:text-end">
                    <span>{cover.byline}</span>
                    <span className="flex items-center gap-2 [@container(min-width:40rem)]:justify-end">
                      <span>{cover.date}</span>
                      <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
                      <span>{cover.readTime}</span>
                    </span>
                  </p>
                </div>
              </a>
            ) : null}

            {list.length > 0 ? (
              <div className="flex min-w-0 flex-col border-t pt-8 [@container(min-width:64rem)]:w-[380px] [@container(min-width:64rem)]:shrink-0 [@container(min-width:64rem)]:border-s [@container(min-width:64rem)]:border-t-0 [@container(min-width:64rem)]:ps-8 [@container(min-width:64rem)]:pt-0">
                <h2 id={briefsId} className="pb-4 text-xs font-medium uppercase text-muted-foreground">
                  {label}
                </h2>
                <ul>
                  {list.map((brief, index) => (
                    <li key={index} className="flex">
                      <a
                        href={brief.href}
                        aria-labelledby={`${briefId}-${index}`}
                        className={cn(BRIEF, "w-full", index === list.length - 1 && "border-b-0")}
                      >
                        <span className="text-xs font-medium uppercase text-info">{brief.kicker}</span>
                        <h3
                          id={`${briefId}-${index}`}
                          className={cn(
                            "text-lg font-semibold text-foreground transition-colors duration-[180ms] motion-reduce:transition-none",
                            BRIEF_TITLE_HOVER
                          )}
                        >
                          {brief.title}
                        </h3>
                        <span className="text-sm text-muted-foreground">{brief.summary}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
