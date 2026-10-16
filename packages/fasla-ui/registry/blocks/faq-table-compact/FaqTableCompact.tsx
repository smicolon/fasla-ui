"use client"

import * as React from "react"
import { ChevronRightIcon, CircleHelpIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `FAQ` (42359:9029), Type=Table Compact.
 *
 * Every answer on show at once, in two columns of `muted` cards: no accordion,
 * for short answers a reader scans rather than opens. The pairs are a
 * description list, so each answer stays tied to its question for a screen
 * reader. A link in the header leads to the full list.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface FaqTableCompactItem {
  question: React.ReactNode
  answer: React.ReactNode
}

export interface FaqTableCompactCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The link to the full list of questions. */
  viewAllLabel: React.ReactNode
  /** The questions, in reading order down the two columns. Each item has a `question` and an `answer`, both always shown. */
  items: FaqTableCompactItem[]
  /** Shown in place of the questions when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqTableCompactCopy> = {
  en: {
    heading: "FAQ",
    viewAllLabel: "View all 64 questions",
    items: [
      {
        question: "What is a design token?",
        answer:
          "A named value — colour, spacing, radius, type — stored once and referenced everywhere, so a single edit updates every screen that uses it.",
      },
      {
        question: "What does “token-bound” mean here?",
        answer:
          "Every padding, gap, radius and fill in a Fasla block points at a variable rather than a raw number, which is what makes retheming safe.",
      },
      {
        question: "How are light and dark modes handled?",
        answer:
          "One variable collection, two modes. Components carry no colour of their own, so switching mode swaps every value at once.",
      },
      {
        question: "What is the difference between a block and a component?",
        answer:
          "A component is one element (a button, an input). A block is a full page section assembled from components — a hero, a pricing table, an FAQ.",
      },
      {
        question: "Do the blocks work right-to-left?",
        answer:
          "Every block ships a Direction variant. Layout mirrors, icons flip where meaning requires it, and Arabic type styles replace the Latin ones.",
      },
      {
        question: "Which breakpoints are covered?",
        answer:
          "Desktop at 1440, tablet at 768 and mobile at 360 — as variants on the same component set, not as separate files.",
      },
      {
        question: "How do I keep up with releases?",
        answer:
          "A changelog page in the file lists every added, changed and deprecated component, dated, with the Figma version to compare against.",
      },
      {
        question: "Can I request something that is missing?",
        answer: "Yes — requests go into the public roadmap and the most-asked ones ship first. Licence holders can vote.",
      },
    ],
    empty: "No questions yet.",
  },
  ar: {
    heading: "الأسئلة الشائعة",
    viewAllLabel: (
      <>
        عرض كل الأسئلة الـ<bdi dir="ltr">64</bdi>
      </>
    ),
    items: [
      {
        question: "ما رمز التصميم؟",
        answer:
          "قيمة مُسمّاة، مثل لون أو مسافة أو نصف قطر أو خط، تُحفظ مرة واحدة ويُشار إليها في كل مكان، فيحدّث التعديل الواحد كل شاشة تستخدمها.",
      },
      {
        question: "ماذا يعني «مرتبط بالرموز» هنا؟",
        answer:
          "كل حشوة وفجوة ونصف قطر وتعبئة في كتلة فاصلة تشير إلى متغيّر بدل رقم ثابت، وهذا ما يجعل إعادة التنسيق آمنة.",
      },
      {
        question: "كيف يُدار الوضعان الفاتح والداكن؟",
        answer:
          "مجموعة متغيّرات واحدة بوضعين. لا تحمل المكوّنات أي لون خاص بها، لذا يبدّل تغيير الوضع كل القيم دفعة واحدة.",
      },
      {
        question: "ما الفرق بين الكتلة والمكوّن؟",
        answer:
          "المكوّن عنصر واحد (زر أو حقل إدخال). أما الكتلة فقسم كامل من الصفحة مركّب من مكوّنات: واجهة رئيسية أو جدول أسعار أو قسم أسئلة شائعة.",
      },
      {
        question: "هل تعمل الكتل باتجاه اليمين إلى اليسار؟",
        answer:
          "كل كتلة تأتي بنسخة اتجاه. ينعكس التخطيط، وتنقلب الأيقونات حيث يقتضي المعنى، وتحلّ أنماط الخطوط العربية محل اللاتينية.",
      },
      {
        question: "ما نقاط التوقّف المغطّاة؟",
        answer: (
          <>
            سطح المكتب عند <bdi dir="ltr">1440</bdi>، واللوحي عند <bdi dir="ltr">768</bdi>، والجوال عند{" "}
            <bdi dir="ltr">360</bdi>، كنسخ داخل مجموعة المكوّن نفسها لا كملفات منفصلة.
          </>
        ),
      },
      {
        question: "كيف أتابع الإصدارات؟",
        answer:
          "صفحة سجلّ التغييرات في الملف تسرد كل مكوّن مضاف أو معدّل أو موقوف، بتاريخه، مع إصدار Figma للمقارنة.",
      },
      {
        question: "هل يمكنني طلب شيء ناقص؟",
        answer:
          "نعم. تُدرج الطلبات في خارطة الطريق العلنية، وتُنفَّذ الأكثر طلبًا أولًا. ويمكن لحاملي التراخيص التصويت.",
      },
    ],
    empty: "لا توجد أسئلة بعد.",
  },
}

export interface FaqTableCompactProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqTableCompactCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * Where the view-all link goes: the page with every question, `/faq` by
   * default. `null` leaves the link out.
   */
  viewAllHref?: string | null
}

export function FaqTableCompact({
  locale = "en",
  heading,
  viewAllLabel,
  viewAllHref = "/faq",
  items,
  empty,
  className,
  ...props
}: FaqTableCompactProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items
  // Two stacked columns, first half then second, as Figma lays them out: each
  // column keeps its own heights, so a long answer doesn't open a gap beside it.
  const half = Math.ceil(list.length / 2)
  const columns = [list.slice(0, half), list.slice(half)].filter((column) => column.length > 0)

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CircleHelpIcon size={20} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-5 shrink-0 text-foreground" />
            <h2 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl">
              {heading ?? copy.heading}
            </h2>
          </div>
          {viewAllHref ? (
            <a
              href={viewAllHref}
              className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {viewAllLabel ?? copy.viewAllLabel}
              <ChevronRightIcon size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-3.5 shrink-0 [&:dir(rtl)]:-scale-x-100" />
            </a>
          ) : null}
        </header>

        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-4">
            {columns.map((column, c) => (
              <dl key={c} className="flex min-w-0 flex-1 flex-col gap-4">
                {column.map((item, index) => (
                  <div key={index} className="flex flex-col gap-1.5 rounded-md bg-muted px-5 py-4">
                    <dt className="text-sm font-semibold text-foreground">{item.question}</dt>
                    <dd className="text-xs text-muted-foreground">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const faqTableCompactCopy = COPY
