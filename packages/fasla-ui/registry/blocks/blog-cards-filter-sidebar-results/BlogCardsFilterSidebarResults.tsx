"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Filter Sidebar + Results.
 *
 * An archive you can filter. A header with the title and the result count, then
 * a rail of two filter groups (Topics, with an "All posts" row, and Format) at
 * the start and the results beside it: a "Filtered by" line of soft badges, then
 * one row per post (a thumbnail, a line of topic and date, a title, an excerpt,
 * and the read time at the end), each ruled by a hairline. Each row is one link
 * named by its title.
 *
 * The state is real. A filter row is a button with `aria-pressed`; choosing a
 * topic or a format filters the posts, the count and the "Filtered by" badges
 * follow, and pressing the pressed format again clears it. The rail's "All
 * posts" row clears the topic. Choosing a row fills it at once.
 *
 * The results reflow in 220ms. A row that leaves fades and collapses its
 * height; a row that arrives expands and fades in, one after another 30ms apart,
 * and the rows around them slide with the height. The count rolls up or down
 * over 300ms. All of it starts from a press and from nothing else: nothing plays
 * on load or on a timer. Reduced motion changes everything at once, and the
 * count is `role="status"` so the new number is read out politely.
 *
 * The sticky filter rail at 1024px and wider, which Figma's motion card
 * mentions, is not built: no variant draws it, so the rail scrolls with the page.
 *
 * Desktop (Figma 1440) sets the rail 268 wide and the results beside it, the
 * thumbnails 140 by 96. Tablet (768) puts the rail above the results as two
 * columns, one per group. Mobile (360) stacks the groups, and each result's
 * thumbnail is 328 by 184 above its copy, with the read time under the excerpt.
 *
 * Arabic mirrors by the page's `dir`: the rail is at the right, the thumbnails
 * at the right of each row, and the count rolls the same way. Photographs are
 * never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsFilterSidebarResultsFilter {
  /** What a post names to belong here. */
  value: string
  /** The row's label, and the badge's. */
  label: string
}

export interface BlogCardsFilterSidebarResultsPost {
  /** The thumbnail. Without one the thumbnail is a placeholder of the same size. */
  image?: { src: string; alt: string }
  /** The `value` of the post's topic. */
  topic: string
  /** The `value` of the post's format. */
  format: string
  /** The date, as written: "Aug 18, 2026". */
  date: React.ReactNode
  /** The read time, as written: "9 min". */
  readTime: React.ReactNode
  /** The title, an `h3`, and the row's accessible name. */
  title: React.ReactNode
  /** The excerpt. */
  excerpt: React.ReactNode
  /** Where the row goes. */
  href: string
}

/** A template per plural category, with `{count}` where the number goes. */
export type BlogCardsFilterSidebarResultsPlural = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string }

export interface BlogCardsFilterSidebarResultsCopy {
  /** The section title, an `h2`. */
  heading: React.ReactNode
  /** The result count, by the number of results; the number rolls. */
  countLabel: BlogCardsFilterSidebarResultsPlural
  /** The label over the topics. */
  topicsLabel: React.ReactNode
  /** The row that clears the topic. */
  allLabel: React.ReactNode
  /** The topics. */
  topics: BlogCardsFilterSidebarResultsFilter[]
  /** The label over the formats. */
  formatLabel: React.ReactNode
  /** The formats. */
  formats: BlogCardsFilterSidebarResultsFilter[]
  /** The line before the badges of the active filters. */
  filteredByLabel: React.ReactNode
  /** The posts, in order. */
  posts: BlogCardsFilterSidebarResultsPost[]
  /** Shown instead of the rows when no post matches. */
  noResultsLabel: React.ReactNode
  /** Shown when there are no posts at all. */
  emptyLabel: React.ReactNode
}

const TOPICS_EN: BlogCardsFilterSidebarResultsFilter[] = [
  { value: "design-systems", label: "Design Systems" },
  { value: "typography", label: "Typography" },
  { value: "rtl-arabic", label: "RTL & Arabic" },
  { value: "engineering", label: "Engineering" },
  { value: "accessibility", label: "Accessibility" },
  { value: "product", label: "Product" },
]
const TOPICS_AR: BlogCardsFilterSidebarResultsFilter[] = [
  { value: "design-systems", label: "أنظمة التصميم" },
  { value: "typography", label: "التايبوغرافيا" },
  { value: "rtl-arabic", label: "العربية وRTL" },
  { value: "engineering", label: "الهندسة" },
  { value: "accessibility", label: "إمكانية الوصول" },
  { value: "product", label: "المنتج" },
]
const FORMATS_EN: BlogCardsFilterSidebarResultsFilter[] = [
  { value: "field-notes", label: "Field notes" },
  { value: "long-reads", label: "Long reads" },
  { value: "release-notes", label: "Release notes" },
  { value: "research", label: "Research" },
]
const FORMATS_AR: BlogCardsFilterSidebarResultsFilter[] = [
  { value: "field-notes", label: "ملاحظات ميدانية" },
  { value: "long-reads", label: "قراءات طويلة" },
  { value: "release-notes", label: "ملاحظات الإصدارات" },
  { value: "research", label: "الأبحاث" },
]

/** Topic, format, date, read time, title and excerpt of each post, in order. */
const POSTS_EN: [string, string, string, string, string, string][] = [
  ["design-systems", "field-notes", "Aug 18, 2026", "9 min", "Why we rebuilt every token as a Figma variable", "Six months of drift taught us that a hex code in a style is a promise you cannot keep. Here is the migration, and what it cost."],
  ["design-systems", "field-notes", "Jul 21, 2026", "7 min", "Naming things: a spacing scale that survives handoff", "Numeric, t-shirt, or semantic? We tried all three with real teams and measured which names made it into code intact."],
  ["design-systems", "field-notes", "Jun 9, 2026", "7 min", "Auditing 4,000 layers in an afternoon", "The script we run before every release, and the five defects it finds most often."],
  ["design-systems", "field-notes", "Apr 28, 2026", "5 min", "The case for fewer button variants", "We had 96. We shipped 24. Nothing broke, and the docs got shorter."],
  ["rtl-arabic", "long-reads", "Aug 11, 2026", "12 min", "Arabic type on the web: what breaks and why", "Line height, kashida, and the quiet assumptions baked into most UI kits, a field guide from building Fasla's RTL layer."],
  ["engineering", "release-notes", "Jul 28, 2026", "8 min", "Shipping dark mode without a second design file", "One token set, two modes, zero forks: how we ship dark mode from a single design file."],
  ["rtl-arabic", "field-notes", "Jul 14, 2026", "10 min", "Mirroring is not flipping", "The layout rules that actually change in RTL, and the ones designers keep mirroring by mistake."],
  ["accessibility", "field-notes", "Jul 7, 2026", "7 min", "How we test contrast before a component ships", "An automated pass over every variant in every mode, run on each pull request. Here is the pipeline."],
  ["typography", "long-reads", "Jun 30, 2026", "11 min", "A type ramp for two scripts", "Latin and Arabic disagree about x-height, ascenders, and optical size. Building one ramp that serves both."],
  ["product", "long-reads", "Jun 16, 2026", "6 min", "The empty state is a product decision", "Nobody owns the empty screen, so it ships last and worst. A short argument for designing it first."],
  ["research", "research", "May 26, 2026", "9 min", "What our first design-system survey told us", "142 responses from designers and engineers. The gap between what we documented and what people found."],
  ["rtl-arabic", "field-notes", "Apr 21, 2026", "9 min", "Kashida, ligatures, and line height", "Three Arabic typesetting features that most component libraries silently disable."],
  ["engineering", "long-reads", "Mar 10, 2026", "11 min", "Documenting a component so an agent can use it", "Machine-readable content contracts turned out to make our human docs better too."],
]
const POSTS_AR: [string, string, string, string][] = [
  ["18 أغسطس 2026", "9 دقائق", "لماذا أعدنا بناء كل رمز تصميمي كمتغيّر في Figma", "ستة أشهر من الانحراف علّمتنا أن كود اللون داخل نمطٍ ما وعدٌ لا يمكن الوفاء به. إليكم قصة الترحيل وما كلّفنا."],
  ["21 يوليو 2026", "7 دقائق", "تسمية الأشياء: مقياس تباعد يصمد بعد التسليم", "أرقام أم مقاسات قمصان أم دلالات؟ جرّبنا الثلاثة مع فرق حقيقية وقسنا أي الأسماء وصلت إلى الكود سليمة."],
  ["9 يونيو 2026", "7 دقائق", "تدقيق 4,000 طبقة في ظهيرة واحدة", "السكربت الذي نشغّله قبل كل إصدار، والعيوب الخمسة التي يجدها أكثر من غيرها."],
  ["28 أبريل 2026", "5 دقائق", "مرافعة لصالح متغيرات أزرار أقل", "كان لدينا 96. أطلقنا 24. لم ينكسر شيء، وصارت الوثائق أقصر."],
  ["11 أغسطس 2026", "12 دقيقة", "الخط العربي على الويب: ما الذي ينكسر ولماذا", "ارتفاع السطر، والكشيدة، والافتراضات الصامتة المخبوءة في معظم أطقم الواجهات، دليل ميداني من بناء طبقة RTL في فاصلة."],
  ["28 يوليو 2026", "8 دقائق", "إطلاق الوضع الداكن دون ملف تصميم ثانٍ", "مجموعة رموز واحدة ووضعان بلا تفريع: كيف نطلق الوضع الداكن من ملف تصميم واحد."],
  ["14 يوليو 2026", "10 دقائق", "الانعكاس ليس مجرد قلب", "قواعد التخطيط التي تتغير فعلاً في RTL، وتلك التي يعكسها المصممون بالخطأ."],
  ["7 يوليو 2026", "7 دقائق", "كيف نختبر التباين قبل إطلاق أي مكوّن", "فحص آلي لكل متغيّر في كل وضع، يعمل مع كل طلب دمج. إليكم خط الأنابيب."],
  ["30 يونيو 2026", "11 دقيقة", "سلّم خطوط لنظامي كتابة", "اللاتينية والعربية تختلفان حول ارتفاع الأحرف والصواعد والحجم البصري. هكذا بنينا سلّماً واحداً يخدم الاثنين."],
  ["16 يونيو 2026", "6 دقائق", "الحالة الفارغة قرار منتج", "لا أحد يملك الشاشة الفارغة، لذا تُشحن آخرًا وبأسوأ حال. حجة قصيرة لتصميمها أولًا."],
  ["26 مايو 2026", "9 دقائق", "ما أخبرنا به أول استبيان لنظام التصميم", "142 إجابة من مصممين ومهندسين. الفجوة بين ما وثّقناه وما وجده الناس."],
  ["21 أبريل 2026", "9 دقائق", "الكشيدة والوصلات وارتفاع السطر", "ثلاث خصائص لتنضيد العربية تعطّلها معظم مكتبات المكوّنات بصمت."],
  ["10 مارس 2026", "11 دقيقة", "توثيق المكوّن ليستطيع وكيل ذكي استخدامه", "عقود المحتوى المقروءة آليًا حسّنت وثائقنا البشرية أيضًا."],
]

const postsOf = (rows: typeof POSTS_EN, ar?: typeof POSTS_AR): BlogCardsFilterSidebarResultsPost[] =>
  rows.map(([topic, format, date, readTime, title, excerpt], index) => ({
    topic,
    format,
    date: ar ? ar[index]![0] : date,
    readTime: ar ? ar[index]![1] : readTime,
    title: ar ? ar[index]![2] : title,
    excerpt: ar ? ar[index]![3] : excerpt,
    href: "#",
  }))

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsFilterSidebarResultsCopy> = {
  en: {
    heading: "The archive",
    countLabel: { one: "{count} result", other: "{count} results" },
    topicsLabel: "TOPICS",
    allLabel: "All posts",
    topics: TOPICS_EN,
    formatLabel: "FORMAT",
    formats: FORMATS_EN,
    filteredByLabel: "Filtered by",
    posts: postsOf(POSTS_EN),
    noResultsLabel: "No posts match these filters.",
    emptyLabel: "No articles yet.",
  },
  ar: {
    heading: "الأرشيف",
    countLabel: {
      zero: "لا نتائج",
      one: "نتيجة واحدة",
      two: "نتيجتان",
      few: "{count} نتائج",
      many: "{count} نتيجة",
      other: "{count} نتيجة",
    },
    topicsLabel: "المواضيع",
    allLabel: "كل المقالات",
    topics: TOPICS_AR,
    formatLabel: "الصيغة",
    formats: FORMATS_AR,
    filteredByLabel: "مرشَّح حسب",
    posts: postsOf(POSTS_EN, POSTS_AR),
    noResultsLabel: "لا توجد مقالات تطابق هذه المرشّحات.",
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsFilterSidebarResultsCopy = COPY

// useLayoutEffect warns during server rendering in React 18.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

const REFLOW_MS = 220
const STAGGER_MS = 30
const ROLL_MS = 300

/** Read when a press happens, so a change of the setting is honoured and nothing is read on load. */
const motionReduced = () =>
  typeof window === "undefined" || typeof window.matchMedia !== "function"
    ? true
    : window.matchMedia("(prefers-reduced-motion: reduce)").matches
const canAnimate = () => !motionReduced() && typeof Element !== "undefined" && typeof Element.prototype.animate === "function"

type Phase = "idle" | "in" | "out"
interface Row {
  index: number
  phase: Phase
  /** Place among the rows that arrive together, for the stagger. */
  order: number
}

/** Keeps the rows that stay, brings in those that arrive and marks those that leave. */
function reconcile(prev: Row[], next: number[], animate: boolean): Row[] {
  if (!animate) return next.map((index) => ({ index, phase: "idle", order: 0 }))
  const nextSet = new Set(next)
  const before = new Map(prev.map((row) => [row.index, row]))
  const all = Array.from(new Set([...prev.map((row) => row.index), ...next])).sort((a, b) => a - b)
  let order = 0
  const rows: Row[] = []
  for (const index of all) {
    const existing = before.get(index)
    if (nextSet.has(index)) {
      const stays = existing !== undefined && existing.phase !== "out"
      rows.push(stays ? { index, phase: existing.phase === "in" ? "in" : "idle", order: 0 } : { index, phase: "in", order: order++ })
    } else if (existing) {
      rows.push({ index, phase: "out", order: 0 })
    }
  }
  return rows
}

/** The count's number, rolling up or down when it changes from a press. */
function RollingNumber({ value }: { value: number }) {
  const [shown, setShown] = React.useState(value)
  const [ghost, setGhost] = React.useState<{ value: number; direction: 1 | -1; key: number } | null>(null)
  const mainRef = React.useRef<HTMLSpanElement>(null)
  const ghostRef = React.useRef<HTMLSpanElement>(null)
  const keyRef = React.useRef(0)

  React.useEffect(() => {
    if (value === shown) return
    if (canAnimate()) setGhost({ value: shown, direction: value > shown ? 1 : -1, key: ++keyRef.current })
    setShown(value)
    // Only a change of `value` is a press; `shown` is the number last drawn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useIsomorphicLayoutEffect(() => {
    if (!ghost || !mainRef.current || !ghostRef.current) return
    const options = { duration: ROLL_MS, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" as const }
    mainRef.current.animate(
      [{ transform: `translateY(${ghost.direction * 100}%)`, opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
      options
    )
    const out = ghostRef.current.animate(
      [{ transform: "translateY(0)", opacity: 1 }, { transform: `translateY(${ghost.direction * -100}%)`, opacity: 0 }],
      options
    )
    out.onfinish = () => setGhost((current) => (current?.key === ghost.key ? null : current))
  }, [ghost])

  return (
    <span className="relative inline-block overflow-hidden align-bottom tabular-nums">
      <span ref={mainRef} className="inline-block">
        {shown}
      </span>
      {ghost ? (
        <span ref={ghostRef} aria-hidden="true" className="absolute inset-0 inline-block">
          {ghost.value}
        </span>
      ) : null}
    </span>
  )
}

interface ResultItemProps {
  post: BlogCardsFilterSidebarResultsPost
  topicLabel: string
  row: Row
  titleId: string
  onGone: (index: number) => void
}

/** One result: it expands in, collapses out, or sits still, as its phase says. */
function ResultItem({ post, topicLabel, row, titleId, onGone }: ResultItemProps) {
  const itemRef = React.useRef<HTMLLIElement>(null)
  const { phase, order, index } = row

  useIsomorphicLayoutEffect(() => {
    const el = itemRef.current
    if (!el) return
    if (phase === "idle") {
      el.getAnimations?.().forEach((animation) => animation.cancel())
      el.style.overflow = ""
      return
    }
    if (typeof el.animate !== "function") {
      if (phase === "out") onGone(index)
      return
    }
    el.getAnimations().forEach((animation) => animation.cancel())
    const height = el.offsetHeight
    el.style.overflow = "hidden"
    const keyframes =
      phase === "in"
        ? [{ height: "0px", opacity: 0 }, { height: `${height}px`, opacity: 1 }]
        : [{ height: `${height}px`, opacity: 1 }, { height: "0px", opacity: 0 }]
    const animation = el.animate(keyframes, {
      duration: REFLOW_MS,
      delay: phase === "in" ? order * STAGGER_MS : 0,
      easing: "ease-out",
      fill: phase === "in" ? "backwards" : "forwards",
    })
    animation.onfinish = () => {
      el.style.overflow = ""
      if (phase === "out") onGone(index)
    }
    return () => {
      animation.onfinish = null
    }
    // The animation is the effect of a phase, not of the row's other props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  return (
    <li ref={itemRef} className="flex" aria-hidden={phase === "out" ? true : undefined}>
      <a
        href={post.href}
        aria-labelledby={titleId}
        tabIndex={phase === "out" ? -1 : undefined}
        className={cn(
          "flex w-full flex-col gap-3 border-b py-5 [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-6"
        )}
      >
        <div className="relative aspect-[328/184] w-full shrink-0 overflow-hidden rounded-md bg-muted [@container(min-width:40rem)]:aspect-[140/96] [@container(min-width:40rem)]:w-[140px]">
          {post.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.image.src} alt={post.image.alt} loading="lazy" className="absolute inset-0 size-full object-cover" />
          ) : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="uppercase">{topicLabel}</span>
            <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
            <span>{post.date}</span>
          </span>
          <h3 id={titleId} className="text-xl font-semibold text-foreground">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground">{post.excerpt}</p>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">{post.readTime}</span>
      </a>
    </li>
  )
}

export interface BlogCardsFilterSidebarResultsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsFilterSidebarResultsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The topic chosen at first, a `value` of `topics`. None means "All posts". Design Systems, by default, as Figma draws it. */
  defaultTopic?: string | null
  /** The format chosen at first, a `value` of `formats`. Field notes, by default. */
  defaultFormat?: string | null
  /** Called with the chosen topic and format after each press. */
  onFilterChange?: (filters: { topic: string | null; format: string | null }) => void
}

const FILTER_ROW =
  "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-start text-sm [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

export function BlogCardsFilterSidebarResults({
  locale = "en",
  heading,
  countLabel,
  topicsLabel,
  allLabel,
  topics,
  formatLabel,
  formats,
  filteredByLabel,
  posts,
  noResultsLabel,
  emptyLabel,
  defaultTopic = "design-systems",
  defaultFormat = "field-notes",
  onFilterChange,
  className,
  ...props
}: BlogCardsFilterSidebarResultsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const topicsId = React.useId()
  const formatId = React.useId()
  const titleId = React.useId()
  const list = posts ?? copy.posts
  const topicList = topics ?? copy.topics
  const formatList = formats ?? copy.formats
  const plural = countLabel ?? copy.countLabel

  const [topic, setTopic] = React.useState<string | null>(defaultTopic)
  const [format, setFormat] = React.useState<string | null>(defaultFormat)

  const matching = React.useCallback(
    (t: string | null, f: string | null) =>
      list.flatMap((post, index) => ((t === null || post.topic === t) && (f === null || post.format === f) ? [index] : [])),
    [list]
  )
  const [rows, setRows] = React.useState<Row[]>(() => reconcile([], matching(defaultTopic, defaultFormat), false))
  const [count, setCount] = React.useState(rows.length)

  const choose = (nextTopic: string | null, nextFormat: string | null) => {
    setTopic(nextTopic)
    setFormat(nextFormat)
    const next = matching(nextTopic, nextFormat)
    setRows((prev) => reconcile(prev, next, canAnimate()))
    setCount(next.length)
    onFilterChange?.({ topic: nextTopic, format: nextFormat })
  }
  const gone = React.useCallback((index: number) => setRows((prev) => prev.filter((row) => !(row.index === index && row.phase === "out"))), [])

  const label = (filters: BlogCardsFilterSidebarResultsFilter[], value: string) => filters.find((f) => f.value === value)?.label ?? value
  const activeTopic = topic !== null ? label(topicList, topic) : null
  const activeFormat = format !== null ? label(formatList, format) : null
  const category = new Intl.PluralRules(locale).select(count)
  const template = plural[category] ?? plural.other
  const [before = "", after = ""] = template.split("{count}")
  const counted = template.includes("{count}")
  const countOf = (value: string | null, key: "topic" | "format") =>
    value === null ? list.length : list.filter((post) => post[key] === value).length

  const rail = (
    <>
      <div role="group" aria-labelledby={topicsId} className="flex flex-col gap-1">
        <p id={topicsId} className="pb-2 text-xs font-medium uppercase text-muted-foreground">
          {topicsLabel ?? copy.topicsLabel}
        </p>
        {[{ value: null, label: allLabel ?? copy.allLabel }, ...topicList].map((item) => {
          const pressed = (item.value ?? null) === topic
          return (
            <button
              key={item.value ?? "all"}
              type="button"
              aria-pressed={pressed}
              onClick={() => choose(item.value ?? null, format)}
              className={cn(FILTER_ROW, pressed ? "bg-muted font-medium text-foreground" : "text-muted-foreground")}
            >
              <span className="min-w-0 flex-1">{item.label}</span>
              <span className="text-xs font-normal text-muted-foreground">{countOf(item.value ?? null, "topic")}</span>
            </button>
          )
        })}
      </div>
      <div role="group" aria-labelledby={formatId} className="flex flex-col gap-1">
        <p id={formatId} className="pb-2 text-xs font-medium uppercase text-muted-foreground">
          {formatLabel ?? copy.formatLabel}
        </p>
        {formatList.map((item) => {
          const pressed = item.value === format
          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={pressed}
              onClick={() => choose(topic, pressed ? null : item.value)}
              className={cn(FILTER_ROW, pressed ? "bg-muted font-medium text-foreground" : "text-muted-foreground")}
            >
              <span className="min-w-0 flex-1">{item.label}</span>
              <span className="text-xs font-normal text-muted-foreground">{countOf(item.value, "format")}</span>
            </button>
          )
        })}
      </div>
    </>
  )

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
          <p role="status" aria-live="polite" aria-atomic="true" className="shrink-0 text-sm text-muted-foreground">
            {counted ? (
              <>
                {before}
                <RollingNumber value={count} />
                {after}
              </>
            ) : (
              template
            )}
          </p>
        </div>

        {list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
        ) : (
          <div className="flex flex-col gap-8 [@container(min-width:40rem)]:gap-10 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:gap-12">
            <div className="flex flex-col gap-6 [@container(min-width:40rem)]:grid [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:items-start [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:flex [@container(min-width:64rem)]:w-[268px] [@container(min-width:64rem)]:items-stretch [@container(min-width:64rem)]:shrink-0 [@container(min-width:64rem)]:flex-col [@container(min-width:64rem)]:gap-6">
              {rail}
            </div>

            <div className="flex min-w-0 flex-col [@container(min-width:64rem)]:flex-1">
              {activeTopic !== null || activeFormat !== null ? (
                <div className="flex flex-wrap items-center gap-2 pb-5">
                  <span className="text-xs text-muted-foreground">{filteredByLabel ?? copy.filteredByLabel}</span>
                  {activeTopic !== null ? (
                    <Badge variant="soft" tone="primary" size="sm" radius="rounded">
                      {activeTopic}
                    </Badge>
                  ) : null}
                  {activeFormat !== null ? (
                    <Badge variant="soft" tone="primary" size="sm" radius="rounded">
                      {activeFormat}
                    </Badge>
                  ) : null}
                </div>
              ) : null}
              <ul>
                {rows.map((row) => {
                  const post = list[row.index]!
                  return (
                    <ResultItem
                      key={row.index}
                      post={post}
                      topicLabel={label(topicList, post.topic)}
                      row={row}
                      titleId={`${titleId}-${row.index}`}
                      onGone={gone}
                    />
                  )
                })}
              </ul>
              {count === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">{noResultsLabel ?? copy.noResultsLabel}</p>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
