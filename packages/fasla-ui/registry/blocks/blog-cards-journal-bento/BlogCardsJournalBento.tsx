import * as React from "react"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Journal Bento.
 *
 * A centred heading (an eyebrow, a heading and a line under it) over a grid of
 * six 360px tiles. Two are features, 612 wide: the first an inverse band, the
 * second `secondary`, each with a large title, a summary, a "Read story"
 * action and a piece of artwork standing on its bottom end corner. Four are
 * short stories, 294 wide, each tinted with its own accent (info, warning,
 * success, primary) at 20%, with a title, a summary, the action and a small
 * motif of two rings. Every tile starts with a row: a dot in its accent and
 * the topic in capitals at the start, the read time at the end. The title
 * names the tile's link, which is the whole tile; the "Read story" action is
 * that link's drawn button, hidden from assistive technology.
 *
 * Desktop (Figma 1440) lays the tiles in two rows: a feature and two short
 * stories, then two short stories and a feature. Tablet (768) gives each
 * feature a full row and sets the short stories two across. Mobile (360)
 * stacks all six, in the same order.
 *
 * Hover and keyboard focus drift a short tile's two rings apart by 6px
 * (240ms) and move its action's arrow 2px toward the end edge. On a feature
 * the artwork lifts 6px and scales from 1.00 to 1.03; the dot, the topic and
 * the read time don't move. On Mobile there is no hover; pressing a tile dims
 * it to 96%. Reduced motion turns it all off. Nothing plays on load, on scroll
 * or on a timer.
 *
 * Arabic mirrors by the page's `dir`: the rows, the artwork and the rings move
 * to the other side and the arrow points the other way (it is mirrored, not
 * rotated). The artwork is never flipped as a picture, only moved.
 *
 * The first feature is the inverse band, so the block needs the
 * `theme-inverse` item.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

type Accent = "info" | "warning" | "success" | "primary"

export interface BlogCardsJournalBentoStory {
  /** The topic, shown in capitals in English. */
  topic: React.ReactNode
  /** The accent: the dot, the rings and, on a short story, the tint. */
  accent: Accent
  /** The read time, as written: "6 min read". */
  readTime: React.ReactNode
  /** The title, an `h3`, and the tile's link. A line break (`\n`) is kept. */
  title: string
  /** The summary. */
  summary: React.ReactNode
  /** Where the tile goes. */
  href: string
}

export interface BlogCardsJournalBentoFeature extends BlogCardsJournalBentoStory {
  /**
   * The artwork on the tile's bottom end corner, 244 by 160 on Desktop and
   * Tablet and 140 by 92 on Mobile. Nothing stands there without one.
   */
  image?: { src: string; alt: string }
}

export interface BlogCardsJournalBentoCopy {
  /** The small line over the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  /** The two feature tiles: the inverse one first, then the `secondary` one. */
  features: BlogCardsJournalBentoFeature[]
  /** The four short stories, in reading order. */
  stories: BlogCardsJournalBentoStory[]
  /** The label of the drawn "Read story" action on every tile. */
  actionLabel: string
  /** Shown instead of the tiles when there are no features and no stories. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsJournalBentoCopy> = {
  en: {
    eyebrow: "IDEAS FOR THE WAY WE BUILD",
    heading: "Fieldnotes",
    description: "A journal about thoughtful digital products. Fewer assumptions. More intention.",
    features: [
      {
        topic: "Research",
        accent: "warning",
        readTime: "8 min read",
        title: "Better questions.\nBetter products.",
        summary: "Good discovery starts with listening. A field guide to finding the needs behind the feature requests.",
        href: "#",
      },
      {
        topic: "Product craft",
        accent: "info",
        readTime: "9 min read",
        title: "The details are\nthe product.",
        summary:
          "From a forgiving form to a well-timed reply: the quiet decisions that make software feel considered.",
        href: "#",
      },
    ],
    stories: [
      {
        topic: "Accessibility",
        accent: "info",
        readTime: "6 min read",
        title: "Access is not\nan edge case.",
        summary: "Build keyboard paths, clear focus and inclusive defaults into the first draft—not the final audit.",
        href: "#",
      },
      {
        topic: "Useful motion",
        accent: "warning",
        readTime: "5 min read",
        title: "Less spectacle.\nMore signal.",
        summary: "Use motion to explain what changed, guide attention and help people keep their place.",
        href: "#",
      },
      {
        topic: "Prototyping",
        accent: "success",
        readTime: "7 min read",
        title: "Make it real.\nThen make it right.",
        summary: "The smallest prototype that turns a team’s biggest assumption into something you can test.",
        href: "#",
      },
      {
        topic: "Collaboration",
        accent: "primary",
        readTime: "4 min read",
        title: "Better together,\nby design.",
        summary: "Trade the big reveal for shared work. Small rituals that bring design and engineering closer.",
        href: "#",
      },
    ],
    actionLabel: "Read story",
    emptyLabel: "No articles yet.",
  },
  ar: {
    eyebrow: "أفكار في طريقة بنائنا",
    heading: "ملاحظات ميدانية",
    description: "يوميات عن المنتجات الرقمية المدروسة: افتراضات أقل وقصد أوضح.",
    features: [
      {
        topic: "البحث",
        accent: "warning",
        readTime: "قراءة 8 دقائق",
        title: "أسئلة أفضل.\nمنتجات أفضل.",
        summary: "يبدأ الاكتشاف الجيد بالإصغاء. دليل ميداني للوصول إلى الاحتياجات الكامنة وراء طلبات الميزات.",
        href: "#",
      },
      {
        topic: "إتقان المنتج",
        accent: "info",
        readTime: "قراءة 9 دقائق",
        title: "التفاصيل\nهي المنتج.",
        summary: "من استمارة تتسامح مع الأخطاء إلى ردّ في الوقت المناسب: القرارات الهادئة التي تجعل البرمجيات تبدو مدروسة.",
        href: "#",
      },
    ],
    stories: [
      {
        topic: "إمكانية الوصول",
        accent: "info",
        readTime: "قراءة 6 دقائق",
        title: "الوصول ليس\nحالة هامشية.",
        summary: "اجعل مسارات لوحة المفاتيح ووضوح التركيز والإعدادات الشاملة جزءًا من المسودة الأولى، لا من المراجعة الأخيرة.",
        href: "#",
      },
      {
        topic: "الحركة المفيدة",
        accent: "warning",
        readTime: "قراءة 5 دقائق",
        title: "استعراض أقل.\nإشارة أوضح.",
        summary: "استخدم الحركة لتوضيح ما تغيّر، وتوجيه الانتباه، ومساعدة الناس على تتبّع موضعهم.",
        href: "#",
      },
      {
        topic: "النمذجة الأولية",
        accent: "success",
        readTime: "قراءة 7 دقائق",
        title: "اجعله حقيقيًا.\nثم أتقنه.",
        summary: "أصغر نموذج أولي يحوّل أكبر افتراضات الفريق إلى شيء يمكن اختباره.",
        href: "#",
      },
      {
        topic: "التعاون",
        accent: "primary",
        readTime: "قراءة 4 دقائق",
        title: "التعاون أفضل\nحين نصمّمه.",
        summary: "اجعل العمل مشتركًا منذ البداية بدل الكشف الكبير في النهاية. عادات صغيرة تقرّب التصميم من الهندسة.",
        href: "#",
      },
    ],
    actionLabel: "اقرأ المقال",
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsJournalBentoCopy = COPY

/*
 * Every class below is written out whole: Tailwind finds a class by reading
 * the source, so none is built from pieces. The hover and focus ones are from
 * Tablet up (Mobile has none).
 */
const ACCENT: Record<Accent, { tile: string; dot: string; ring: string; fill: string }> = {
  info: { tile: "bg-info/20", dot: "bg-info", ring: "border-info", fill: "bg-info" },
  warning: { tile: "bg-warning/20", dot: "bg-warning", ring: "border-warning", fill: "bg-warning" },
  success: { tile: "bg-success/20", dot: "bg-success", ring: "border-success", fill: "bg-success" },
  primary: { tile: "bg-primary/20", dot: "bg-primary", ring: "border-primary", fill: "bg-primary" },
}
const TILE =
  "group/tile relative isolate flex h-[360px] flex-col justify-between overflow-hidden rounded-xl border p-6 transition-opacity duration-[120ms] motion-reduce:transition-none [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:[@container(max-width:39.99rem)]:opacity-[0.96]"
const RING_DRIFT =
  "transition-transform duration-[240ms] ease-out motion-reduce:transition-none group-hover/tile:[@container(min-width:40rem)]:motion-safe:ltr:translate-x-1.5 group-hover/tile:[@container(min-width:40rem)]:motion-safe:rtl:-translate-x-1.5 group-focus-visible/tile:[@container(min-width:40rem)]:motion-safe:ltr:translate-x-1.5 group-focus-visible/tile:[@container(min-width:40rem)]:motion-safe:rtl:-translate-x-1.5"
const ARROW_NUDGE =
  "transition-transform duration-[240ms] ease-out motion-reduce:transition-none rtl:-scale-x-100 group-hover/tile:[@container(min-width:40rem)]:motion-safe:ltr:translate-x-0.5 group-hover/tile:[@container(min-width:40rem)]:motion-safe:rtl:-translate-x-0.5 group-focus-visible/tile:[@container(min-width:40rem)]:motion-safe:ltr:translate-x-0.5 group-focus-visible/tile:[@container(min-width:40rem)]:motion-safe:rtl:-translate-x-0.5"
const ARTWORK_LIFT =
  "transition-transform duration-[240ms] ease-out motion-reduce:transition-none group-hover/tile:[@container(min-width:40rem)]:motion-safe:-translate-y-1.5 group-hover/tile:[@container(min-width:40rem)]:motion-safe:scale-[1.03] group-focus-visible/tile:[@container(min-width:40rem)]:motion-safe:-translate-y-1.5 group-focus-visible/tile:[@container(min-width:40rem)]:motion-safe:scale-[1.03]"

type Tone = "inverse" | "secondary" | "tinted"

const TONE_CLASSES: Record<Tone, { tile: string; topic: string; muted: string; title: string; action: string }> = {
  inverse: {
    tile: "border-background-inverse bg-background-inverse",
    topic: "text-foreground-inverse",
    muted: "text-muted-foreground-inverse",
    title: "text-foreground-inverse",
    action: "text-foreground-inverse",
  },
  secondary: {
    tile: "bg-secondary",
    topic: "text-card-foreground",
    muted: "text-secondary-foreground",
    title: "text-card-foreground",
    action: "text-foreground",
  },
  tinted: {
    tile: "",
    topic: "text-card-foreground",
    muted: "text-secondary-foreground",
    title: "text-card-foreground",
    action: "text-foreground",
  },
}

function Tile({
  story,
  tone,
  feature,
  actionLabel,
  titleId,
}: {
  story: BlogCardsJournalBentoStory | BlogCardsJournalBentoFeature
  tone: Tone
  feature: boolean
  actionLabel: string
  titleId: string
}) {
  const accent = ACCENT[story.accent]
  const classes = TONE_CLASSES[tone]
  const image = feature ? (story as BlogCardsJournalBentoFeature).image : undefined
  return (
    <a href={story.href} aria-labelledby={titleId} className={cn(TILE, classes.tile, tone === "tinted" && accent.tile)}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <p className={cn("flex items-center gap-2 text-xs font-semibold uppercase", classes.topic)}>
            <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", accent.dot)} />
            <span>{story.topic}</span>
          </p>
          <span className={cn("text-xs", classes.muted)}>{story.readTime}</span>
        </div>
        <div className="flex flex-col gap-3">
          <h3
            id={titleId}
            className={cn(
              "whitespace-pre-line font-semibold",
              feature ? "text-2xl [@container(min-width:40rem)]:text-3xl" : "text-2xl",
              classes.title
            )}
          >
            {story.title}
          </h3>
          <p className={cn("text-base", feature && "[@container(min-width:40rem)]:max-w-[390px]", classes.muted)}>
            {story.summary}
          </p>
        </div>
      </div>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          className={cn(
            "pointer-events-none absolute bottom-0 end-3 -z-10 h-[92px] w-[140px] object-contain object-bottom [@container(min-width:40rem)]:h-[160px] [@container(min-width:40rem)]:w-[244px]",
            ARTWORK_LIFT
          )}
        />
      ) : null}
      <div className="flex items-center justify-between">
        <span
          aria-hidden="true"
          className={cn(buttonVariants({ variant: "ghost", tone: "primary", size: "lg" }), "pointer-events-none ps-0 pe-6", classes.action)}
        >
          {actionLabel}
          <ArrowRightIcon className={cn("size-4", ARROW_NUDGE)} />
        </span>
        {!feature ? (
          <span aria-hidden="true" className="flex items-center pe-1">
            <span className={cn("size-[22px] rounded-full border-2", accent.ring)} />
            <span className={cn("-ms-2 size-[22px] rounded-full", accent.fill, RING_DRIFT)} />
          </span>
        ) : null}
      </div>
    </a>
  )
}

export interface BlogCardsJournalBentoProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsJournalBentoCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function BlogCardsJournalBento({
  locale = "en",
  eyebrow,
  heading,
  description,
  features,
  stories,
  actionLabel,
  emptyLabel,
  className,
  ...props
}: BlogCardsJournalBentoProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const titleId = React.useId()
  const featureList = features ?? copy.features
  const storyList = stories ?? copy.stories
  const label = actionLabel ?? copy.actionLabel
  const lines = { eyebrow: eyebrow ?? copy.eyebrow, description: description ?? copy.description }
  const rowOne = storyList.slice(0, 2)
  const rowTwo = storyList.slice(2, 4)
  const empty = featureList.length === 0 && storyList.length === 0

  const pair = (list: BlogCardsJournalBentoStory[], offset: number) =>
    list.length > 0 ? (
      <div className="grid grid-cols-1 gap-6 [@container(min-width:40rem)]:grid-cols-2">
        {list.map((story, index) => (
          <Tile key={index} story={story} tone="tinted" feature={false} actionLabel={label} titleId={`${titleId}-s${offset + index}`} />
        ))}
      </div>
    ) : null

  return (
    <section
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <div className="flex flex-col items-center gap-4 text-center [@container(min-width:40rem)]:px-12 [@container(min-width:64rem)]:px-0">
          {lines.eyebrow ? (
            <p className="text-xs font-semibold uppercase text-muted-foreground">{lines.eyebrow}</p>
          ) : null}
          <h2
            id={headingId}
            className="text-3xl font-semibold text-foreground [@container(min-width:40rem)]:text-5xl"
          >
            {heading ?? copy.heading}
          </h2>
          {lines.description ? <p className="text-lg text-muted-foreground">{lines.description}</p> : null}
        </div>

        {empty ? (
          <p className="text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 [@container(min-width:64rem)]:grid-cols-2">
              {featureList[0] ? <Tile story={featureList[0]} tone="inverse" feature actionLabel={label} titleId={`${titleId}-f0`} /> : null}
              {pair(rowOne, 0)}
            </div>
            <div className="grid grid-cols-1 gap-6 [@container(min-width:64rem)]:grid-cols-2">
              {pair(rowTwo, 2)}
              {featureList[1] ? <Tile story={featureList[1]} tone="secondary" feature actionLabel={label} titleId={`${titleId}-f1`} /> : null}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
