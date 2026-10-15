"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"
import { Badge } from "../../ui/badge/badge"
import { Input } from "../../ui/input/input"

/*
 * Figma: `FAQ` (42359:9029), Type=Search + Categories.
 *
 * A search field and a row of category chips over one column of questions.
 * Both filter the list as you type or press, in the browser: the search
 * matches a question's text and its answer's, the chips its category. When
 * nothing matches, the list gives way to a message that names the search.
 *
 * Each chip is a Badge, Solid for the selected category and Outline for the
 * rest, inside a real button that says whether it is pressed.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface FaqSearchCategoriesItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** The `value` of the category it belongs to. */
  category?: string
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqSearchCategoriesCategory {
  /** What the item's `category` names. */
  value: string
  label: React.ReactNode
}

export interface FaqSearchCategoriesCopy {
  heading: React.ReactNode
  /** The field's placeholder, and its accessible name. */
  searchPlaceholder: string
  /** The first chip, which shows every category. */
  allLabel: React.ReactNode
  /** Accessible name of the row of chips. */
  categoriesLabel: string
  categories: FaqSearchCategoriesCategory[]
  items: FaqSearchCategoriesItem[]
  /** Shown when the search and the chip leave nothing; given the search. */
  noResults: (query: string) => React.ReactNode
  /** Read out when the list changes; given how many questions it shows. */
  resultCount: (count: number) => string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqSearchCategoriesCopy> = {
  en: {
    heading: "How can we help?",
    searchPlaceholder: "Search questions, keywords, articles",
    allLabel: "All questions",
    categoriesLabel: "Categories",
    categories: [
      { value: "getting-started", label: "Getting started" },
      { value: "licensing", label: "Licensing" },
      { value: "theming", label: "Theming" },
      { value: "rtl", label: "RTL & Arabic" },
      { value: "handoff", label: "Handoff" },
      { value: "billing", label: "Billing" },
    ],
    items: [
      {
        category: "getting-started",
        question: "How do I add Fasla to my Figma team?",
        answer:
          "Open the file, publish it as a library from the Assets panel, then enable it for the teams that need it. Everyone with the library enabled gets updates automatically.",
      },
      {
        category: "getting-started",
        question: "Which components do I start with?",
        answer: "Start with the Button, Input and Card atoms, then pick a block close to the screen you are designing and adapt it.",
      },
      {
        category: "theming",
        question: "Where do the colour tokens live?",
        answer: "In the Mode collection of the Variables panel. Every component reads them, so changing one token restyles the library.",
      },
      {
        category: "rtl",
        question: "How do I switch a block to Arabic?",
        answer: "Set its Direction property to RTL. The layout mirrors and the text styles change to the Arabic type ramp.",
      },
      {
        category: "handoff",
        question: "Can I use Fasla with Dev Mode?",
        answer: "Yes. Every component carries Code Connect, so Dev Mode shows the matching code next to the design.",
      },
      {
        category: "getting-started",
        question: "What ships in the next release?",
        answer: "The changelog page in the file lists what is in progress. Releases land monthly, in the same library.",
      },
    ],
    noResults: (query) =>
      query ? (
        <>
          No questions match <q className="font-medium text-foreground"><bdi>{query}</bdi></q>. Try another word or category.
        </>
      ) : (
        "No questions in this category yet."
      ),
    resultCount: (count) => (count === 1 ? "1 question" : `${count} questions`),
  },
  ar: {
    heading: "كيف يمكننا المساعدة؟",
    searchPlaceholder: "ابحث في الأسئلة والكلمات المفتاحية والمقالات",
    allLabel: "كل الأسئلة",
    categoriesLabel: "الفئات",
    categories: [
      { value: "getting-started", label: "البداية" },
      { value: "licensing", label: "التراخيص" },
      { value: "theming", label: "السمات" },
      { value: "rtl", label: "العربية واتجاه اليمين" },
      { value: "handoff", label: "التسليم" },
      { value: "billing", label: "الفوترة" },
    ],
    items: [
      {
        category: "getting-started",
        question: "كيف أضيف فاصلة إلى فريقي في Figma؟",
        answer:
          "افتح الملف وانشره كمكتبة من لوحة Assets، ثم فعّله للفرق التي تحتاجه. وكل من فعّل المكتبة يحصل على التحديثات تلقائيًا.",
      },
      {
        category: "getting-started",
        question: "بأي مكوّنات أبدأ؟",
        answer: "ابدأ بالزر وحقل الإدخال والبطاقة، ثم اختر كتلة قريبة من الشاشة التي تصممها وعدّلها.",
      },
      {
        category: "theming",
        question: "أين توجد رموز الألوان؟",
        answer: "في مجموعة Mode داخل لوحة المتغيّرات. تقرؤها كل المكوّنات، فتغيير رمز واحد يعيد تنسيق المكتبة كلها.",
      },
      {
        category: "rtl",
        question: "كيف أحوّل كتلة إلى العربية؟",
        answer: "اضبط خاصية الاتجاه على RTL. ينعكس التخطيط وتتحوّل أنماط النص إلى سلّم الخطوط العربي.",
      },
      {
        category: "handoff",
        question: "هل يمكنني استخدام فاصلة مع Dev Mode؟",
        answer: "نعم. يحمل كل مكوّن ربط Code Connect، فيعرض Dev Mode الشيفرة المقابلة بجانب التصميم.",
      },
      {
        category: "getting-started",
        question: "ما الذي سيصدر في التحديث القادم؟",
        answer: "تذكر صفحة سجلّ التغييرات في الملف ما يجري العمل عليه. تصدر التحديثات شهريًا في المكتبة نفسها.",
      },
    ],
    noResults: (query) =>
      query ? (
        <>
          لا توجد أسئلة تطابق <q className="font-medium text-foreground"><bdi>{query}</bdi></q>. جرّب كلمة أو فئة أخرى.
        </>
      ) : (
        "لا توجد أسئلة في هذه الفئة بعد."
      ),
    resultCount: (count) => (count === 1 ? "سؤال واحد" : count === 2 ? "سؤالان" : `${count} أسئلة`),
  },
}

/** The words in a node, for the search: strings and numbers, through fragments and elements. */
function textOf(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join(" ")
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children)
  return ""
}

export interface FaqSearchCategoriesProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqSearchCategoriesCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The category selected at first, by `value`. All of them, by default. */
  defaultCategory?: string
  /** The search the field starts with. */
  defaultQuery?: string
  /** The items open at first, by `value`. The first item, by default. */
  defaultValue?: string[]
}

export function FaqSearchCategories({
  locale = "en",
  heading,
  searchPlaceholder,
  allLabel,
  categoriesLabel,
  categories,
  items,
  noResults,
  resultCount,
  defaultCategory,
  defaultQuery = "",
  defaultValue = ["0"],
  className,
  ...props
}: FaqSearchCategoriesProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const [query, setQuery] = React.useState(defaultQuery)
  const [category, setCategory] = React.useState<string | undefined>(defaultCategory)

  const list = (items ?? copy.items).map((item, index) => ({ ...item, value: item.value ?? String(index) }))
  const needle = query.trim().toLocaleLowerCase()
  const shown = list.filter(
    (item) =>
      (category === undefined || item.category === category) &&
      (needle === "" || `${textOf(item.question)} ${textOf(item.answer)}`.toLocaleLowerCase().includes(needle))
  )

  const chips: { value: string | undefined; label: React.ReactNode }[] = [
    { value: undefined, label: allLabel ?? copy.allLabel },
    ...(categories ?? copy.categories),
  ]

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-12">
        <header className="flex w-full max-w-[720px] flex-col items-center gap-5 text-center">
          <h2 id={headingId} className="text-3xl font-semibold text-foreground lg:text-4xl">
            {heading ?? copy.heading}
          </h2>
          <Input
            type="search"
            size="lg"
            radius="rounded"
            className="max-w-[560px]"
            startIcon={<SearchIcon aria-hidden="true" />}
            placeholder={searchPlaceholder ?? copy.searchPlaceholder}
            aria-label={searchPlaceholder ?? copy.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div
            role="group"
            aria-label={categoriesLabel ?? copy.categoriesLabel}
            className="flex flex-wrap justify-center gap-2"
          >
            {chips.map((chip) => {
              const selected = chip.value === category
              return (
                <button
                  key={chip.value ?? "all"}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setCategory(chip.value)}
                  className="group/chip cursor-pointer rounded-full [outline:none] focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <Badge
                    variant={selected ? "solid" : "outline"}
                    tone={selected ? "primary" : "secondary"}
                    size="md"
                    className={cn(!selected && "transition-colors group-hover/chip:bg-secondary")}
                  >
                    {chip.label}
                  </Badge>
                </button>
              )
            })}
          </div>
        </header>

        <p aria-live="polite" className="sr-only">
          {(resultCount ?? copy.resultCount)(shown.length)}
        </p>

        {shown.length === 0 ? (
          <p className="w-full max-w-[880px] text-center text-sm text-muted-foreground">
            {(noResults ?? copy.noResults)(query.trim())}
          </p>
        ) : (
          <Accordion className="w-full max-w-[880px]" defaultValue={defaultValue}>
            {shown.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  )
}
