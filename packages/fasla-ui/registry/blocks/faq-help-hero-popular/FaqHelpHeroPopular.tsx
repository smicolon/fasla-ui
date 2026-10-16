"use client"

import * as React from "react"
import { ChevronRightIcon, SearchIcon, ZapIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Input } from "../../ui/input/input"

/*
 * Figma: `FAQ` (42359:9029), Type=Help Hero + Popular.
 *
 * A help-centre hero on a full-width `muted` band: a big question, a search
 * field and a line of popular searches. Under it, the most asked questions
 * as two columns of links.
 *
 * The search is a form: Enter calls `onSearch` with what was typed, and a
 * popular search fills the field and calls it too. Where the results show
 * is the page's business, so nothing here filters.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface FaqHelpHeroPopularLink {
  question: React.ReactNode
  href: string
}

export interface FaqHelpHeroPopularCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The field's placeholder, and its accessible name. */
  searchPlaceholder: string
  /** Before the popular searches. */
  popularSearchesLabel: React.ReactNode
  /** Popular searches: each fills the field and searches. */
  popularSearches: string[]
  /** The heading over the list of popular questions. */
  popularHeading: React.ReactNode
  /** The most asked questions, split into two columns from Tablet up. */
  links: FaqHelpHeroPopularLink[]
  /** Shown in place of the questions when `links` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqHelpHeroPopularCopy> = {
  en: {
    heading: "How can we help?",
    searchPlaceholder: "Search questions, keywords, articles",
    popularSearchesLabel: "Popular:",
    popularSearches: ["seats", "dark mode", "RTL", "Code Connect"],
    popularHeading: "Popular questions",
    links: [
      { question: "How many seats does my licence include?", href: "#seats" },
      { question: "Why is my Figma showing an update prompt?", href: "#update-prompt" },
      { question: "How do I move Fasla to another Figma team?", href: "#move-team" },
      { question: "Where do I find the Tailwind token map?", href: "#token-map" },
      { question: "Can I export the tokens as JSON?", href: "#export-json" },
      { question: "Which blocks already have RTL variants?", href: "#rtl-blocks" },
      { question: "How do I request an invoice?", href: "#invoice" },
      { question: "What happens when my licence lapses?", href: "#lapsed" },
    ],
    empty: "No popular questions yet.",
  },
  ar: {
    heading: "كيف يمكننا المساعدة؟",
    searchPlaceholder: "ابحث في الأسئلة والكلمات المفتاحية والمقالات",
    popularSearchesLabel: "الأكثر بحثًا:",
    popularSearches: ["المقاعد", "الوضع الداكن", "اتجاه اليمين", "Code Connect"],
    popularHeading: "الأسئلة الأكثر شيوعًا",
    links: [
      { question: "كم مقعدًا يشمل ترخيصي؟", href: "#seats" },
      { question: "لماذا يعرض Figma إشعار تحديث؟", href: "#update-prompt" },
      { question: "كيف أنقل فاصلة إلى فريق آخر في Figma؟", href: "#move-team" },
      { question: "أين أجد خريطة رموز Tailwind؟", href: "#token-map" },
      { question: "هل يمكنني تصدير الرموز بصيغة JSON؟", href: "#export-json" },
      { question: "أي الكتل لديها نسخ اتجاه اليمين إلى اليسار؟", href: "#rtl-blocks" },
      { question: "كيف أطلب فاتورة؟", href: "#invoice" },
      { question: "ماذا يحدث عند انتهاء ترخيصي؟", href: "#lapsed" },
    ],
    empty: "لا توجد أسئلة شائعة بعد.",
  },
}

export interface FaqHelpHeroPopularProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqHelpHeroPopularCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Called with the search when the form is sent or a popular search is chosen. */
  onSearch?: (query: string) => void
  /** The search the field starts with. */
  defaultQuery?: string
}

export function FaqHelpHeroPopular({
  locale = "en",
  heading,
  searchPlaceholder,
  popularSearchesLabel,
  popularSearches,
  popularHeading,
  links,
  empty,
  onSearch,
  defaultQuery = "",
  className,
  ...props
}: FaqHelpHeroPopularProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const popularId = React.useId()
  const [query, setQuery] = React.useState(defaultQuery)
  const list = links ?? copy.links
  const searches = popularSearches ?? copy.popularSearches
  // Two columns from Tablet up, the first one the longer.
  const half = Math.ceil(list.length / 2)
  const columns = [list.slice(0, half), list.slice(half)].filter((column) => column.length > 0)
  const placeholder = searchPlaceholder ?? copy.searchPlaceholder

  const search = (value: string) => {
    setQuery(value)
    onSearch?.(value.trim())
  }

  return (
    <section aria-labelledby={headingId} className={cn("bg-background", className)} {...props}>
      <div className="bg-muted px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-5">
          <h2 id={headingId} className="max-w-[760px] text-center text-3xl font-semibold text-foreground lg:text-5xl">
            {heading ?? copy.heading}
          </h2>
          <form
            role="search"
            className="w-full max-w-[560px]"
            onSubmit={(event) => {
              event.preventDefault()
              search(query)
            }}
          >
            <Input
              type="search"
              size="lg"
              radius="rounded"
              startIcon={<SearchIcon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />}
              placeholder={placeholder}
              aria-label={placeholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>
          {searches.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs">
              <span className="text-muted-foreground">{popularSearchesLabel ?? copy.popularSearchesLabel}</span>
              {searches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => search(term)}
                  className="cursor-pointer rounded-sm font-medium text-primary underline-offset-2 [outline:none] hover:underline focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-24 pt-20 md:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-6">
          <div className="flex items-center gap-2">
            <ZapIcon size={18} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-[18px] shrink-0 text-primary" />
            <h3 id={popularId} className="text-lg font-semibold text-foreground md:text-xl">
              {popularHeading ?? copy.popularHeading}
            </h3>
          </div>
          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground">{empty ?? copy.empty}</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 md:gap-16">
              {columns.map((column, c) => (
                <ul key={c} aria-labelledby={popularId}>
                  {column.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="group/link flex items-center gap-3 border-b border-border py-3 text-sm text-foreground [outline:none] focus-visible:rounded-[var(--radius-sm)] focus-visible:ring-2 focus-visible:ring-ring/50"
                      >
                        <span className="min-w-0 flex-1 underline-offset-2 group-hover/link:underline">{link.question}</span>
                        <ChevronRightIcon size={14} strokeWidth={1.5} absoluteStrokeWidth
                          aria-hidden="true"
                          className="size-3.5 shrink-0 text-muted-foreground [&:dir(rtl)]:-scale-x-100"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const faqHelpHeroPopularCopy = COPY
