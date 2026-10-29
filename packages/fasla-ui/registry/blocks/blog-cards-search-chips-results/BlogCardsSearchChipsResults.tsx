"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { badgeVariants } from "../../ui/badge/badge"
import { Input } from "../../ui/input/input"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Search + Chips + Results.
 *
 * A search page for a blog, on the page background, centred: a title, a note
 * that counts the posts, a search field and a row of topic chips, then a line
 * ("Showing 3 of 32 posts") ruled by a hairline and a grid of result cards: a
 * cover, a line of category and read time, a title and an excerpt. Each card is
 * one link named by its title.
 *
 * The state is real. The field filters by title, excerpt, topic and author; a
 * chip filters by topic; both together narrow the results. The grid shows the
 * first `pageSize` matches, three as in Figma.
 *
 * The chip. The registry has no Toggle and no pressable Badge, so the chip is
 * built here: a `<button>` with `aria-pressed` that wears the Badge's own
 * classes, Solid Primary pressed and Outline Secondary otherwise, as Figma draws
 * the chips. Pressing one swaps its fill and label colour over 150ms.
 *
 * Typing is debounced by 250ms. Then the results swap with a cross-fade, the old
 * ones out over 100ms and the new ones in over 180ms, and the grid's height eases
 * (240ms, 260ms on Mobile) instead of snapping. A chip applies at once. When
 * nothing matches, the empty line appears only after 400ms of no results, so a
 * fast typist never sees it flash. The count line is `aria-live="polite"`, and
 * the field is never remounted, so it keeps focus the whole time. Everything
 * starts from typing or a press: nothing plays on load or on a timer. Reduced
 * motion swaps the results at once.
 *
 * Desktop (Figma 1440) sets the field 720 wide and the cards three in a row,
 * covers 411 by 200. Tablet (768) sets the field 560 wide and the cards two to a
 * row, covers 348 by 174. Mobile (360) sets the field full width, the chips
 * wrapping onto more lines, and one card per row, covers 328 by 184.
 *
 * Arabic mirrors by the page's `dir`: the field's text and its icon start at the
 * right, the chips wrap from the right, and the cards run right to left.
 * Photographs are never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsSearchChipsResultsTopic {
  /** What a post names to belong to the topic. */
  value: string
  /** The chip's label, and the card's category line. */
  label: string
}

export interface BlogCardsSearchChipsResultsPost {
  /** The cover. Without one the cover is a placeholder of the same size. */
  image?: { src: string; alt: string }
  /** The `value` of the post's topic. */
  topic: string
  /** The read time, as written: "12 min read". */
  readTime: React.ReactNode
  /** The title, an `h3`, and the card's accessible name. */
  title: string
  /** The excerpt. */
  excerpt: string
  /** The author's name. Searchable; the card does not show it. */
  author: string
  /** Where the card goes. */
  href: string
}

/** A template per plural category, with `{shown}`, `{total}` and `{count}` where the numbers go. */
export type BlogCardsSearchChipsResultsPlural = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string }

export interface BlogCardsSearchChipsResultsCopy {
  /** The page title, an `h2`. */
  heading: React.ReactNode
  /** The note under the title, by the number of posts, `{count}` for it. */
  note: BlogCardsSearchChipsResultsPlural
  /** The field's placeholder, which is also its accessible name. */
  placeholder: string
  /** The accessible name of the row of chips. */
  topicsLabel: string
  /** The chip that clears the topic. */
  allLabel: string
  /** The topics, one chip each. */
  topics: BlogCardsSearchChipsResultsTopic[]
  /** The line over the results, by the number of matches, `{shown}` and `{total}` for the numbers. */
  showing: BlogCardsSearchChipsResultsPlural
  /** The posts, in order. */
  posts: BlogCardsSearchChipsResultsPost[]
  /** Shown, after 400ms, when no post matches. */
  noResultsLabel: React.ReactNode
  /** Shown when there are no posts at all. */
  emptyLabel: React.ReactNode
}

const TOPICS_EN: BlogCardsSearchChipsResultsTopic[] = [
  { value: "design-systems", label: "Design Systems" },
  { value: "typography", label: "Typography" },
  { value: "rtl-arabic", label: "RTL & Arabic" },
  { value: "engineering", label: "Engineering" },
  { value: "accessibility", label: "Accessibility" },
  { value: "research", label: "Research" },
  { value: "product", label: "Product" },
]
const TOPICS_AR: BlogCardsSearchChipsResultsTopic[] = [
  { value: "design-systems", label: "أنظمة التصميم" },
  { value: "typography", label: "التايبوغرافيا" },
  { value: "rtl-arabic", label: "العربية وRTL" },
  { value: "engineering", label: "الهندسة" },
  { value: "accessibility", label: "إمكانية الوصول" },
  { value: "research", label: "الأبحاث" },
  { value: "product", label: "المنتج" },
]

/** Topic, read time, title, excerpt and author of each post, in order. */
const POSTS_EN: [string, string, string, string, string][] = [
  ["rtl-arabic", "12 min read", "Arabic type on the web: what breaks and why", "Line height, kashida, and the quiet assumptions baked into most UI kits, a field guide from building Fasla's RTL layer.", "Noor Al-Amin"],
  ["typography", "11 min read", "A type ramp for two scripts", "Latin and Arabic disagree about x-height, ascenders, and optical size. Building one ramp that serves both.", "Yasmin Farouk"],
  ["rtl-arabic", "9 min read", "Kashida, ligatures, and line height", "Three Arabic typesetting features that most component libraries silently disable.", "Noor Al-Amin"],
  ["design-systems", "9 min read", "Why we rebuilt every token as a Figma variable", "Six months of drift taught us that a hex code in a style is a promise you cannot keep. Here is the migration, and what it cost.", "Karim Nasser"],
  ["rtl-arabic", "10 min read", "Mirroring is not flipping", "The layout rules that actually change in RTL, and the ones designers keep mirroring by mistake.", "Noor Al-Amin"],
  ["design-systems", "7 min read", "Naming things: a spacing scale that survives handoff", "Numeric, t-shirt, or semantic? We tried all three with real teams and measured which names made it into code intact.", "Lina Haddad"],
  ["engineering", "8 min read", "Shipping dark mode without a second design file", "One token set, two modes, zero forks: how we ship dark mode from a single design file.", "Karim Nasser"],
  ["accessibility", "7 min read", "How we test contrast before a component ships", "An automated pass over every variant in every mode, run on each pull request. Here is the pipeline.", "Lina Haddad"],
  ["product", "6 min read", "The empty state is a product decision", "Nobody owns the empty screen, so it ships last and worst. A short argument for designing it first.", "Lina Haddad"],
  ["research", "9 min read", "What our first design-system survey told us", "142 responses from designers and engineers. The gap between what we documented and what people found.", "Elise Fournier"],
  ["engineering", "11 min read", "Documenting a component so an agent can use it", "Machine-readable content contracts turned out to make our human docs better too.", "Karim Nasser"],
]
const POSTS_AR: [string, string, string, string][] = [
  ["قراءة 12 دقيقة", "الخط العربي على الويب: ما الذي ينكسر ولماذا", "ارتفاع السطر، والكشيدة، والافتراضات الصامتة المخبوءة في معظم أطقم الواجهات، دليل ميداني من بناء طبقة RTL في فاصلة.", "نور الأمين"],
  ["قراءة 11 دقيقة", "سلّم خطوط لنظامي كتابة", "اللاتينية والعربية تختلفان حول ارتفاع الأحرف والصواعد والحجم البصري. هكذا بنينا سلّماً واحداً يخدم الاثنين.", "ياسمين فاروق"],
  ["قراءة 9 دقائق", "الكشيدة والوصلات وارتفاع السطر", "ثلاث خصائص لتنضيد العربية تعطّلها معظم مكتبات المكوّنات بصمت.", "نور الأمين"],
  ["قراءة 9 دقائق", "لماذا أعدنا بناء كل رمز تصميمي كمتغيّر في Figma", "ستة أشهر من الانحراف علّمتنا أن كود اللون داخل نمطٍ ما وعدٌ لا يمكن الوفاء به. إليكم قصة الترحيل وما كلّفنا.", "كريم ناصر"],
  ["قراءة 10 دقائق", "الانعكاس ليس مجرد قلب", "قواعد التخطيط التي تتغير فعلاً في RTL، وتلك التي يعكسها المصممون بالخطأ.", "نور الأمين"],
  ["قراءة 7 دقائق", "تسمية الأشياء: مقياس تباعد يصمد بعد التسليم", "أرقام أم مقاسات قمصان أم دلالات؟ جرّبنا الثلاثة مع فرق حقيقية وقسنا أي الأسماء وصلت إلى الكود سليمة.", "لينا حدّاد"],
  ["قراءة 8 دقائق", "إطلاق الوضع الداكن دون ملف تصميم ثانٍ", "مجموعة رموز واحدة ووضعان بلا تفريع: كيف نطلق الوضع الداكن من ملف تصميم واحد.", "كريم ناصر"],
  ["قراءة 7 دقائق", "كيف نختبر التباين قبل إطلاق أي مكوّن", "فحص آلي لكل متغيّر في كل وضع، يعمل مع كل طلب دمج. إليكم خط الأنابيب.", "لينا حدّاد"],
  ["قراءة 6 دقائق", "الحالة الفارغة قرار منتج", "لا أحد يملك الشاشة الفارغة، لذا تُشحن آخرًا وبأسوأ حال. حجة قصيرة لتصميمها أولًا.", "لينا حدّاد"],
  ["قراءة 9 دقائق", "ما أخبرنا به أول استبيان لنظام التصميم", "142 إجابة من مصممين ومهندسين. الفجوة بين ما وثّقناه وما وجده الناس.", "إليز فورنييه"],
  ["قراءة 11 دقيقة", "توثيق المكوّن ليستطيع وكيل ذكي استخدامه", "عقود المحتوى المقروءة آليًا حسّنت وثائقنا البشرية أيضًا.", "كريم ناصر"],
]

const postsOf = (ar?: boolean): BlogCardsSearchChipsResultsPost[] =>
  POSTS_EN.map(([topic, readTime, title, excerpt, author], index) => ({
    topic,
    readTime: ar ? POSTS_AR[index]![0] : readTime,
    title: ar ? POSTS_AR[index]![1] : title,
    excerpt: ar ? POSTS_AR[index]![2] : excerpt,
    author: ar ? POSTS_AR[index]![3] : author,
    href: "#",
  }))

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsSearchChipsResultsCopy> = {
  en: {
    heading: "Search the blog",
    note: {
      one: "{count} post on design systems, typography, Arabic type and the engineering behind Fasla.",
      other: "{count} posts on design systems, typography, Arabic type and the engineering behind Fasla.",
    },
    placeholder: "Search posts, topics or authors",
    topicsLabel: "Topics",
    allLabel: "All",
    topics: TOPICS_EN,
    showing: { one: "Showing {shown} of {total} post", other: "Showing {shown} of {total} posts" },
    posts: postsOf(),
    noResultsLabel: "No posts match your search.",
    emptyLabel: "No articles yet.",
  },
  ar: {
    heading: "ابحث في المدونة",
    note: {
      one: "مقال واحد في أنظمة التصميم والتايبوغرافيا والخط العربي والهندسة وراء فاصلة.",
      two: "مقالان في أنظمة التصميم والتايبوغرافيا والخط العربي والهندسة وراء فاصلة.",
      few: "{count} مقالات في أنظمة التصميم والتايبوغرافيا والخط العربي والهندسة وراء فاصلة.",
      many: "{count} مقالاً في أنظمة التصميم والتايبوغرافيا والخط العربي والهندسة وراء فاصلة.",
      other: "{count} مقال في أنظمة التصميم والتايبوغرافيا والخط العربي والهندسة وراء فاصلة.",
    },
    placeholder: "ابحث في المقالات أو المواضيع أو الكتّاب",
    topicsLabel: "المواضيع",
    allLabel: "الكل",
    topics: TOPICS_AR,
    showing: {
      zero: "عرض {shown} من {total} مقال",
      one: "عرض {shown} من مقال واحد",
      two: "عرض {shown} من مقالين",
      few: "عرض {shown} من {total} مقالات",
      many: "عرض {shown} من {total} مقالاً",
      other: "عرض {shown} من {total} مقال",
    },
    posts: postsOf(true),
    noResultsLabel: "لا توجد مقالات تطابق بحثك.",
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsSearchChipsResultsCopy = COPY

// useLayoutEffect warns during server rendering in React 18.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

const DEBOUNCE_MS = 250
const FADE_OUT_MS = 100
const FADE_IN_MS = 180
const EMPTY_DELAY_MS = 400

/** Read when typing or a press happens, so nothing is read on load. */
const canAnimate = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
  typeof Element !== "undefined" &&
  typeof Element.prototype.animate === "function"

const fill = (template: string, values: Record<string, number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""))

/** `relative` and a 44px hit area drawn by a pseudo-element, centred on the chip: the chip keeps its size. */
const CHIP =
  "relative after:absolute after:left-1/2 after:top-1/2 after:h-11 after:w-[max(100%,2.75rem)] after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] cursor-pointer transition-colors duration-150 motion-reduce:transition-none [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

export interface BlogCardsSearchChipsResultsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsSearchChipsResultsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** How many matches the grid shows. Three, as in Figma. */
  pageSize?: number
  /** The text in the field at first. */
  defaultQuery?: string
  /** The chip pressed at first, a `value` of `topics`. None means "All". */
  defaultTopic?: string | null
  /** Called with the applied text and topic after each change settles. */
  onSearch?: (search: { query: string; topic: string | null }) => void
}

export function BlogCardsSearchChipsResults({
  locale = "en",
  heading,
  note,
  placeholder,
  topicsLabel,
  allLabel,
  topics,
  showing,
  posts,
  noResultsLabel,
  emptyLabel,
  pageSize = 3,
  defaultQuery = "",
  defaultTopic = null,
  onSearch,
  className,
  ...props
}: BlogCardsSearchChipsResultsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const titleId = React.useId()
  const list = posts ?? copy.posts
  const topicList = topics ?? copy.topics
  const field = placeholder ?? copy.placeholder
  const rules = new Intl.PluralRules(locale)
  const pick = (plural: BlogCardsSearchChipsResultsPlural, n: number) => plural[rules.select(n)] ?? plural.other

  const topicLabel = (value: string) => topicList.find((t) => t.value === value)?.label ?? value
  const search = React.useCallback(
    (q: string, t: string | null) => {
      const needle = q.trim().toLowerCase()
      return list.filter((post) => {
        if (t !== null && post.topic !== t) return false
        if (needle === "") return true
        return [post.title, post.excerpt, post.author, topicLabel(post.topic)].some((text) => text.toLowerCase().includes(needle))
      })
    },
    // `topicLabel` reads `topicList`, which is `topics` or the copy's.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list, topicList]
  )

  const [query, setQuery] = React.useState(defaultQuery)
  const [topic, setTopic] = React.useState<string | null>(defaultTopic)
  const [matches, setMatches] = React.useState(() => search(defaultQuery, defaultTopic))
  const [fade, setFade] = React.useState<"in" | "out">("in")
  const latest = React.useRef({ query: defaultQuery, topic: defaultTopic })
  const timers = React.useRef<{ debounce?: ReturnType<typeof setTimeout>; swap?: ReturnType<typeof setTimeout>; empty?: ReturnType<typeof setTimeout> }>({})
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const heightBefore = React.useRef<number | null>(null)

  React.useEffect(() => {
    const pending = timers.current
    return () => {
      clearTimeout(pending.debounce)
      clearTimeout(pending.swap)
      clearTimeout(pending.empty)
    }
  }, [])

  const commit = (q: string, t: string | null) => {
    const pending = timers.current
    clearTimeout(pending.debounce)
    clearTimeout(pending.swap)
    clearTimeout(pending.empty)
    const next = search(q, t)
    onSearch?.({ query: q, topic: t })
    const animate = canAnimate()
    const swap = () => {
      if (!animate) {
        setMatches(next)
        return
      }
      heightBefore.current = wrapRef.current?.offsetHeight ?? null
      setFade("out")
      pending.swap = setTimeout(() => {
        setMatches(next)
        setFade("in")
      }, FADE_OUT_MS)
    }
    // A fast typist passes through "no results" on the way: wait before showing it.
    if (animate && next.length === 0) pending.empty = setTimeout(swap, EMPTY_DELAY_MS)
    else swap()
  }

  useIsomorphicLayoutEffect(() => {
    const el = wrapRef.current
    const before = heightBefore.current
    heightBefore.current = null
    if (!el || before === null || typeof el.animate !== "function") return
    const after = el.offsetHeight
    if (after === before) return
    el.style.overflow = "hidden"
    const animation = el.animate([{ height: `${before}px` }, { height: `${after}px` }], {
      duration: el.clientWidth < 640 ? 260 : 240,
      easing: "ease-out",
    })
    animation.onfinish = () => {
      el.style.overflow = ""
    }
  }, [matches])

  const onQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setQuery(value)
    latest.current.query = value
    clearTimeout(timers.current.debounce)
    timers.current.debounce = setTimeout(() => commit(value, latest.current.topic), DEBOUNCE_MS)
  }
  const onChip = (value: string | null) => {
    setTopic(value)
    latest.current.topic = value
    commit(latest.current.query, value)
  }

  const shown = matches.slice(0, pageSize)
  const total = matches.length
  const chips = [{ value: null as string | null, label: allLabel ?? copy.allLabel }, ...topicList]

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
        <div className="flex flex-col items-center gap-5 text-center">
          <h2
            id={headingId}
            className="text-3xl font-semibold text-foreground [@container(min-width:40rem)]:text-5xl"
          >
            {heading ?? copy.heading}
          </h2>
          <p className="text-lg text-muted-foreground">
            {fill(pick(note ?? copy.note, list.length), { count: list.length })}
          </p>
          <div role="search" className="w-full [@container(min-width:40rem)]:w-[560px] [@container(min-width:64rem)]:w-[720px]">
            <Input
              type="search"
              name="q"
              size="lg"
              autoComplete="off"
              aria-label={field}
              placeholder={field}
              startIcon={<SearchIcon />}
              value={query}
              onChange={onQueryChange}
              className="w-full"
            />
          </div>
          <div role="group" aria-label={topicsLabel ?? copy.topicsLabel} className="flex flex-wrap justify-center gap-2">
            {chips.map((chip) => {
              const pressed = chip.value === topic
              return (
                <button
                  key={chip.value ?? "all"}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => onChip(chip.value)}
                  className={cn(
                    badgeVariants({
                      variant: pressed ? "solid" : "outline",
                      tone: pressed ? "primary" : "secondary",
                      size: "md",
                      radius: "rounded",
                    }),
                    CHIP
                  )}
                >
                  {chip.label}
                </button>
              )
            })}
          </div>
        </div>

        {list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
        ) : (
          <div className="flex flex-col gap-10">
            <p aria-live="polite" aria-atomic="true" className="border-b pb-3 text-sm text-muted-foreground">
              {fill(pick(showing ?? copy.showing, total), { shown: shown.length, total })}
            </p>
            <div
              ref={wrapRef}
              style={{ transitionDuration: `${fade === "out" ? FADE_OUT_MS : FADE_IN_MS}ms` }}
              className={cn("transition-opacity ease-out motion-reduce:transition-none", fade === "out" && "opacity-0")}
            >
              {shown.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">{noResultsLabel ?? copy.noResultsLabel}</p>
              ) : (
                <ul className="grid grid-cols-1 gap-8 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:gap-6 [@container(min-width:64rem)]:grid-cols-3">
                  {shown.map((post, index) => (
                    <li key={`${post.title}-${index}`} className="flex">
                      <a
                        href={post.href}
                        aria-labelledby={`${titleId}-${index}`}
                        className="flex w-full flex-col gap-3 [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        <div className="relative aspect-[328/184] w-full overflow-hidden rounded-md bg-muted [@container(min-width:40rem)]:aspect-[348/174] [@container(min-width:64rem)]:aspect-[411/200]">
                          {post.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={post.image.src} alt={post.image.alt} loading="lazy" className="absolute inset-0 size-full object-cover" />
                          ) : null}
                        </div>
                        <span className="flex items-center gap-2 text-xs">
                          <span className="font-medium uppercase text-info">{topicLabel(post.topic)}</span>
                          <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
                          <span className="text-muted-foreground">{post.readTime}</span>
                        </span>
                        <h3 id={`${titleId}-${index}`} className="text-xl font-semibold text-foreground">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
