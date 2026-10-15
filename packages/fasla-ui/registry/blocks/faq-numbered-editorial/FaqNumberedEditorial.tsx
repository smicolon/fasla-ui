"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"

/*
 * Figma: `FAQ` (42359:9029), Type=Numbered Editorial.
 *
 * An editorial header, a large headline beside a short intro, over full-width
 * numbered questions. The numbers are Western numerals in both languages and
 * come from each item's position, so reordering the list renumbers it.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

/**
 * Figma's indicator: a plus that turns into a cross while the item is open.
 * The Accordion's plus indicator swaps the plus for a minus; here the plus
 * stays and turns 45°, and the minus stays hidden.
 */
const PLUS_TURNS_TO_CROSS = [
  "[&_[data-slot=accordion-indicator]>svg:first-child]:transition-transform [&_[data-slot=accordion-indicator]>svg:first-child]:duration-[180ms] motion-reduce:[&_[data-slot=accordion-indicator]>svg:first-child]:transition-none",
  "[&[data-panel-open]_[data-slot=accordion-indicator]>svg:first-child]:block [&[data-panel-open]_[data-slot=accordion-indicator]>svg:first-child]:rotate-45",
  "[&[data-panel-open]_[data-slot=accordion-indicator]>svg:last-child]:hidden",
].join(" ")

export interface FaqNumberedEditorialItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqNumberedEditorialCopy {
  /** The short label above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. */
  description: React.ReactNode
  /** The questions, in order. Each item has a `question`, an `answer` and an optional `value` that `defaultValue` opens it by. */
  items: FaqNumberedEditorialItem[]
  /** Shown in place of the questions when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqNumberedEditorialCopy> = {
  en: {
    eyebrow: "ALL THE ANSWERS",
    heading: "There are no silly questions — ask away, we’re listening",
    description:
      "Committing to a new design system is a real decision. Below are the questions teams ask us most before moving their product onto Fasla.",
    items: [
      {
        question: "Do I need a credit card to start?",
        answer:
          "No. Start with the free sample file — the full component set, three blocks and both themes, with no card required. Upgrade whenever your team is ready.",
      },
      {
        question: "Can I cancel at any time?",
        answer: "Yes. Cancel from your account settings; your licence stays active until the end of the period you paid for.",
      },
      {
        question: "Do you offer education pricing?",
        answer: "Yes. Students and teachers get the full library free for a year with a school email address.",
      },
      {
        question: "Who owns the designs I build with Fasla?",
        answer: "You do. Everything you design with the library belongs to you and your clients, with no attribution required.",
      },
      {
        question: "Can I hand the file to a client?",
        answer: "Yes. Hand over the finished designs freely; your client needs a licence of their own only to keep editing the library.",
      },
    ],
    empty: "No questions yet.",
  },
  ar: {
    eyebrow: "كل الإجابات",
    heading: "لا توجد أسئلة سخيفة، اسأل ما شئت ونحن نصغي",
    description: "الالتزام بنظام تصميم جديد قرار حقيقي. في ما يلي أكثر الأسئلة التي تطرحها الفرق قبل نقل منتجها إلى فاصلة.",
    items: [
      {
        question: "هل أحتاج إلى بطاقة ائتمان للبدء؟",
        answer:
          "لا. ابدأ بالملف التجريبي المجاني: مجموعة المكوّنات كاملة وثلاث كتل وكلا الوضعين، دون الحاجة إلى بطاقة. ثم رقِّ اشتراكك متى كان فريقك جاهزًا.",
      },
      {
        question: "هل يمكنني الإلغاء في أي وقت؟",
        answer: "نعم. ألغِ الاشتراك من إعدادات حسابك، ويبقى ترخيصك فعّالًا حتى نهاية المدة التي دفعت عنها.",
      },
      {
        question: "هل تقدّمون أسعارًا للمؤسسات التعليمية؟",
        answer: "نعم. يحصل الطلاب والمعلمون على المكتبة كاملة مجانًا لمدة سنة باستخدام بريد إلكتروني مدرسي.",
      },
      {
        question: "من يملك التصاميم التي أُنشئها باستخدام فاصلة؟",
        answer: "أنت. كل ما تصممه بالمكتبة ملك لك ولعملائك، دون الحاجة إلى ذكر المصدر.",
      },
      {
        question: "هل يمكنني تسليم الملف إلى عميل؟",
        answer: "نعم. سلّم التصاميم النهائية بحرية، ولا يحتاج عميلك إلى ترخيص خاص إلا ليواصل تعديل المكتبة.",
      },
    ],
    empty: "لا توجد أسئلة بعد.",
  },
}

export interface FaqNumberedEditorialProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqNumberedEditorialCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The items open at first, by `value`. The first item, by default. */
  defaultValue?: string[]
  /**
   * Lets several questions stay open at once.
   * @default false
   */
  multiple?: boolean
}

export function FaqNumberedEditorial({
  locale = "en",
  eyebrow,
  heading,
  description,
  items,
  empty,
  defaultValue = ["0"],
  multiple,
  className,
  ...props
}: FaqNumberedEditorialProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-24">
          <div className="flex flex-1 flex-col gap-3">
            <p className="text-xs font-semibold text-primary">{eyebrow ?? copy.eyebrow}</p>
            <h2 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl lg:text-5xl">
              {heading ?? copy.heading}
            </h2>
          </div>
          <p className="text-base text-muted-foreground lg:w-[400px] lg:shrink-0">{description ?? copy.description}</p>
        </header>

        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <Accordion indicator="plus" className="border-t border-border md:border-t-0" defaultValue={defaultValue} multiple={multiple}>
            {list.map((item, index) => (
              <AccordionItem
                key={item.value ?? index}
                value={item.value ?? String(index)}
                className="flex items-start gap-6 py-2"
              >
                {/* Decorative: the list's own order already numbers it. */}
                <span aria-hidden="true" className="w-8 shrink-0 pt-3 text-sm font-medium text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <AccordionTrigger className={cn("text-lg", PLUS_TURNS_TO_CROSS)}>{item.question}</AccordionTrigger>
                  <AccordionContent className="md:pe-40">{item.answer}</AccordionContent>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const faqNumberedEditorialCopy = COPY
