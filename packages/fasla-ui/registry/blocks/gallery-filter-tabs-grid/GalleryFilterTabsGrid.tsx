"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs/tabs"

/*
 * Figma: `Gallery` (42478:479), Type=Filter Tabs + Grid.
 *
 * A portfolio wall: a header, a row of Bordered tabs with a result count at
 * its far end, and a grid of project cards (a photo, the project's name and
 * an Outline badge naming its category). The tabs really filter: "All" shows
 * every card, each other tab only the cards whose `category` matches its
 * `value`. They are the library's Tabs, so arrow keys move between them and
 * the grid follows. Each card is a link when it has an `href` (Figma: "every
 * project opens into its own gallery"), a plain card otherwise.
 *
 * The count is live: it counts the cards the active tab shows, or takes the
 * number from `counts` when the grid shows only some of a larger set. By
 * default "All" reads Figma's "48 projects" over its eight cards. It sits in a
 * polite live region, so a screen reader hears the new number when the tab
 * changes.
 *
 * Changing the tab re-flows the grid, as Figma's motion note asks: each card
 * that stays glides from its old place to its new one (300ms ease-in-out),
 * and a card that joins fades in from 0.96. A card that leaves goes at once,
 * with its panel. It measures the cards before and after the change (FLIP) and
 * plays the difference with the Web Animations API, so no animation library
 * is needed. Under reduced motion the grid simply changes. Hover (or focus) on
 * a linked card zooms its photo to 1.04 inside its clip and underlines the
 * name, as the note says.
 *
 * Desktop puts the description beside the heading, bottom-aligned; Tablet and
 * Mobile stack it under. On a phone the count drops under the tabs, and the
 * tab strip scrolls sideways inside its own box if it ever outgrows the
 * screen. The grid is four columns on Desktop, two on Tablet, one on Mobile;
 * Figma draws each breakpoint's photo at its own shape, so the aspect ratio
 * changes with it.
 *
 * RTL: the Tabs mirror themselves, the grid fills from the right and the
 * count moves to the left, all from the page's `dir`. The photographs are
 * never flipped. Figma's Arabic badges name two categories differently from
 * their tabs (أشياء / قطع, الفعاليات / مناسبات); here a badge always reads its
 * tab's label, so the filter and the card agree.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container, so the block lays out for the room it is
 * given, such as a docs preview narrower than the screen. The base classes
 * are Figma's Mobile (360); `[@container(min-width:40rem)]:` is its Tablet,
 * from 640px of content (Figma's Tablet, 768 less its padding), and
 * `[@container(min-width:64rem)]:` its Desktop, from 1024px of content.
 * The section's own padding still follows the window, since an element
 * can't query itself.
 */

export interface GalleryFilterTabsGridPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryFilterTabsGridCategory {
  /** Identifies the category: a tab's value and an item's `category`. */
  value: string
  /** The tab's label, and the badge on every card in the category. */
  label: React.ReactNode
}

export interface GalleryFilterTabsGridItem {
  /** The project's name, under its photo. */
  title: React.ReactNode
  /** The `value` of the category it belongs to. */
  category: string
  /** Where the card leads. Without it the card is not a link. */
  href?: string
}

export interface GalleryFilterTabsGridCopy {
  /** The small line above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The text beside (Desktop) or under (Tablet, Mobile) the heading. Hidden when empty. */
  description: React.ReactNode
  /** The first tab's label: the tab that shows every card. */
  all: React.ReactNode
  /** The other tabs, in order. Each has a `value` and a `label`. */
  categories: GalleryFilterTabsGridCategory[]
  /** The result count at the end of the tab row, from the number of projects the active tab holds. */
  count: (count: number) => React.ReactNode
  /** The cards, in order: a `title`, its `category` and an optional `href`. */
  items: GalleryFilterTabsGridItem[]
  /** Shown in place of the grid when there are no cards, or none in the active tab. */
  empty: React.ReactNode
}

const AR_PLURAL = typeof Intl === "undefined" ? null : new Intl.PluralRules("ar")

/** Arabic counts its nouns in six forms; the number stays an isolated Latin run. */
function arabicProjects(count: number): React.ReactNode {
  const n = <bdi dir="ltr">{count}</bdi>
  switch (AR_PLURAL?.select(count)) {
    case "zero":
      return "لا مشاريع"
    case "one":
      return "مشروع واحد"
    case "two":
      return "مشروعان"
    case "few":
      return <>{n} مشاريع</>
    case "many":
      return <>{n} مشروعًا</>
    default:
      return <>{n} مشروع</>
  }
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryFilterTabsGridCopy> = {
  en: {
    eyebrow: "WORK",
    heading: "Everything we have made",
    description: "Filter by what you are looking for. Every project opens into its own gallery.",
    all: "All",
    categories: [
      { value: "spaces", label: "Spaces" },
      { value: "objects", label: "Objects" },
      { value: "people", label: "People" },
      { value: "events", label: "Events" },
    ],
    count: (count) => (count === 1 ? "1 project" : `${count} projects`),
    items: [
      { title: "Atrium refit", category: "spaces" },
      { title: "Brass table lamp", category: "objects" },
      { title: "Studio portraits", category: "people" },
      { title: "Launch evening", category: "events" },
      { title: "Riverside offices", category: "spaces" },
      { title: "Ceramic series", category: "objects" },
      { title: "Founders, 2026", category: "people" },
      { title: "Summer meet-up", category: "events" },
    ],
    empty: "No photos yet.",
  },
  ar: {
    eyebrow: "أعمالنا",
    heading: "كل ما صنعناه",
    description: "صنّف بحسب ما تبحث عنه. كل مشروع يُفتح في معرض خاص به.",
    all: "الكل",
    categories: [
      { value: "spaces", label: "مساحات" },
      { value: "objects", label: "قطع" },
      { value: "people", label: "أشخاص" },
      { value: "events", label: "مناسبات" },
    ],
    count: arabicProjects,
    items: [
      { title: "تجديد البهو", category: "spaces" },
      { title: "مصباح طاولة نحاسي", category: "objects" },
      { title: "صور الاستوديو الشخصية", category: "people" },
      { title: "أمسية الإطلاق", category: "events" },
      { title: "مكاتب ريفرسايد", category: "spaces" },
      { title: "سلسلة السيراميك", category: "objects" },
      {
        title: (
          <>
            المؤسسون، <bdi dir="ltr">2026</bdi>
          </>
        ),
        category: "people",
      },
      { title: "لقاء الصيف", category: "events" },
    ],
    empty: "لا توجد صور بعد.",
  },
}

/** The tab that shows every card. */
const ALL = "all"

export interface GalleryFilterTabsGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryFilterTabsGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * One photo per card, in the order of `items`: a photo stays with its card
   * when the tabs filter the grid. Figma's order is Atrium refit, Brass table
   * lamp, Studio portraits, Launch evening, Riverside offices, Ceramic series,
   * Founders 2026, Summer meet-up. None by default: each card shows a `muted`
   * placeholder.
   * @default none: `muted` placeholders
   */
  photos?: GalleryFilterTabsGridPhoto[]
  /**
   * The tab shown at first, by category `value`; `"all"` is the tab that
   * shows every card.
   * @default "all"
   */
  defaultCategory?: string
  /**
   * How many projects each tab holds, by category `value` and `"all"`, when
   * the grid shows only some of them. A tab left out counts its own cards.
   * @default { all: 48 }, Figma's count
   */
  counts?: Partial<Record<string, number>>
}

/** Figma's count for the whole set: "48 projects" over the eight cards it shows. */
const FIGMA_COUNTS: Partial<Record<string, number>> = { all: 48 }

// useLayoutEffect warns during server rendering in React 18.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Where each card on screen sits now, by its index in `items`. */
const measureCards = (root: HTMLElement | null) =>
  new Map(
    Array.from(root?.querySelectorAll<HTMLElement>("[data-card-index]") ?? [])
      .filter((card) => card.getClientRects().length > 0)
      .map((card) => [card.dataset.cardIndex, card.getBoundingClientRect()] as const)
  )

export function GalleryFilterTabsGrid({
  locale = "en",
  eyebrow,
  heading,
  description,
  all,
  categories,
  count,
  items,
  empty,
  photos = [],
  defaultCategory = ALL,
  counts = FIGMA_COUNTS,
  className,
  ...props
}: GalleryFilterTabsGridProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const kicker = eyebrow ?? copy.eyebrow
  const lede = description ?? copy.description
  const tabs = categories ?? copy.categories
  const cards = items ?? copy.items
  const countLabel = count ?? copy.count
  const emptyLabel = empty ?? copy.empty
  const [active, setActive] = React.useState(defaultCategory)
  const rootRef = React.useRef<HTMLElement>(null)
  // The cards' places just before a tab change, for the re-flow; null otherwise.
  const before = React.useRef<Map<string | undefined, DOMRect> | null>(null)

  const select = (value: string) => {
    if (value === active) return
    before.current = prefersReducedMotion() ? null : measureCards(rootRef.current)
    setActive(value)
  }

  useIsomorphicLayoutEffect(() => {
    const from = before.current
    before.current = null
    if (!from) return
    // forEach, not for…of: a Map only iterates with an ES2015 target, and Next 14 projects set none.
    measureCards(rootRef.current).forEach((rect, key) => {
      const card = rootRef.current?.querySelector<HTMLElement>(`[data-card-index="${key}"]`)
      const was = from.get(key)
      if (!card) return
      if (was) {
        const dx = was.left - rect.left
        const dy = was.top - rect.top
        if (dx || dy)
          card.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], {
            duration: 300,
            easing: "ease-in-out",
          })
      } else {
        card.animate([{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "none" }], {
          duration: 240,
          easing: "ease-out",
        })
      }
    })
  }, [active])

  const labelOf = (value: string) => tabs.find((tab) => tab.value === value)?.label
  // Each card keeps its index in `items`, so its photo follows it through the filter.
  const indexed = cards.map((item, index) => ({ item, index }))
  const inTab = (value: string) => (value === ALL ? indexed : indexed.filter(({ item }) => item.category === value))
  const shown = counts?.[active] ?? inTab(active).length

  return (
    <section ref={rootRef} aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-10">
        <header className="flex flex-col gap-2 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-end [@container(min-width:64rem)]:gap-16">
          <div className="flex min-w-0 flex-col gap-2 [@container(min-width:64rem)]:flex-1 [@container(min-width:64rem)]:gap-4">
            {kicker ? <p className="text-xs font-medium text-primary">{kicker}</p> : null}
            <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl [@container(min-width:64rem)]:text-4xl">
              {heading ?? copy.heading}
            </h2>
          </div>
          {lede ? <p className="text-base text-muted-foreground [@container(min-width:64rem)]:w-[440px] [@container(min-width:64rem)]:shrink-0">{lede}</p> : null}
        </header>

        {cards.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          <Tabs value={active} onValueChange={(value) => select(String(value))} className="flex flex-col gap-10">
            <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-6">
              {/* Scrolls on its own if the tabs outgrow the screen; the padding keeps the focus halo inside the scroll box. */}
              <div className="relative -m-1 max-w-[calc(100%+0.5rem)] overflow-x-auto p-1">
                <TabsList variant="bordered" size="sm">
                  <TabsTrigger value={ALL}>{all ?? copy.all}</TabsTrigger>
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <p aria-live="polite" className="whitespace-nowrap text-sm text-muted-foreground">
                {countLabel(shown)}
              </p>
            </div>

            {[ALL].concat(tabs.map((tab) => tab.value)).map((value) => {
              const list = inTab(value)
              return (
                <TabsContent key={value} value={value} className="mt-0">
                  {list.length === 0 ? (
                    <p className="py-16 text-center text-sm text-muted-foreground">{emptyLabel}</p>
                  ) : (
                    <ul className="grid grid-cols-1 gap-x-6 gap-y-8 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-4">
                      {list.map(({ item, index }) => (
                        <li key={index} data-card-index={index}>
                          <Card item={item} photo={photos[index]} badge={labelOf(item.category)} />
                        </li>
                      ))}
                    </ul>
                  )}
                </TabsContent>
              )
            })}
          </Tabs>
        )}
      </div>
    </section>
  )
}

function Card({
  item,
  photo,
  badge,
}: {
  item: GalleryFilterTabsGridItem
  photo: GalleryFilterTabsGridPhoto | undefined
  badge: React.ReactNode
}) {
  const body = (
    <>
      <div className="relative aspect-[296/220] overflow-hidden rounded-lg bg-muted [@container(min-width:40rem)]:aspect-[308/200] [@container(min-width:64rem)]:aspect-[294/224]">
        {photo ? (
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover transition-transform duration-[400ms] ease-out group-hover/card:scale-[1.04] group-focus-visible/card:scale-[1.04] motion-reduce:transition-none"
          />
        ) : null}
      </div>
      <div className="flex flex-col items-start gap-2">
        <h3 className="text-base font-semibold text-foreground underline-offset-4 group-hover/card:underline group-focus-visible/card:underline">
          {item.title}
        </h3>
        {badge ? (
          <Badge variant="outline" tone="primary" size="md" radius="rounded">
            {badge}
          </Badge>
        ) : null}
      </div>
    </>
  )

  return item.href ? (
    <a
      href={item.href}
      className="group/card flex flex-col gap-3 rounded-lg [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {body}
    </a>
  ) : (
    <div className="flex flex-col gap-3">{body}</div>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const galleryFilterTabsGridCopy = COPY
