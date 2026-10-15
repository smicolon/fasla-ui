"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"

/*
 * Figma: `FAQ` (42359:9029), Type=Dark Panel.
 *
 * The questions on an inverted panel: dark in Light, light in Dark. The panel
 * is painted with the inverse tokens, the only way Fasla inverts a surface,
 * so it never forces a `.dark` or `.light` class and never borrows
 * `bg-foreground`. The theme-inverse registry item maps the tokens, falling
 * back to the page colours swapped in a theme that doesn't define them.
 *
 * The Accordion is the library's, untouched: every colour it needs on the
 * panel (question, answer, outline, chevron, hover and focus ring) is set
 * here, through its className props.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface FaqDarkPanelItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqDarkPanelCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. */
  description: React.ReactNode
  /** The questions, in order. Each item has a `question`, an `answer` and an optional `value` that `defaultValue` opens it by. */
  items: FaqDarkPanelItem[]
  /** Shown in place of the questions when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqDarkPanelCopy> = {
  en: {
    heading: "Frequently Asked Questions",
    description: "Pricing, billing and everything in between.",
    items: [
      {
        question: "What counts as a seat?",
        answer:
          "A seat is one person with edit access to the Fasla library in your Figma organisation. Viewers, developers inspecting specs and stakeholders commenting are all free.",
      },
      {
        question: "How does pricing work for agencies?",
        answer:
          "Agencies buy seats for their own designers, not for each client. Every project you deliver with those seats is covered.",
      },
      {
        question: "Can I estimate my seat count before buying?",
        answer:
          "Count the people who edit design files each week. Start there; you can add seats at any time and pay only for the rest of the term.",
      },
      {
        question: "What if I go over my prepaid seats?",
        answer:
          "Nothing stops working. We bill the extra seats on your next invoice, prorated from the day they were added.",
      },
      {
        question: "We’re a startup — do you offer discounts?",
        answer: "Yes. Teams under two years old with fewer than 20 people get 50% off their first year.",
      },
      {
        question: "What resources come with the licence?",
        answer: "The Figma library, the code registry, the documentation in English and Arabic, and access to our support channel.",
      },
    ],
    empty: "No questions yet.",
  },
  ar: {
    heading: "الأسئلة الشائعة",
    description: "الأسعار والفوترة وكل ما بينهما.",
    items: [
      {
        question: "ما المقصود بالمقعد؟",
        answer:
          "المقعد هو شخص واحد لديه صلاحية التحرير على مكتبة فاصلة داخل مؤسستك في Figma. أما المشاهدون والمطوّرون الذين يعاينون المواصفات وأصحاب المصلحة الذين يعلّقون فهم مجانيون جميعًا.",
      },
      {
        question: "كيف تعمل الأسعار للوكالات؟",
        answer: "تشتري الوكالة مقاعد لمصمميها، لا لكل عميل. وكل مشروع تسلّمه بهذه المقاعد يشمله الترخيص.",
      },
      {
        question: "هل يمكنني تقدير عدد المقاعد قبل الشراء؟",
        answer: "احسب عدد من يعدّلون ملفات التصميم كل أسبوع وابدأ به. يمكنك إضافة مقاعد في أي وقت، وتدفع عن المدة المتبقية فقط.",
      },
      {
        question: "ماذا لو تجاوزت عدد المقاعد المدفوعة مسبقًا؟",
        answer: "لن يتوقف شيء عن العمل. نضيف المقاعد الإضافية إلى فاتورتك التالية، محسوبةً من يوم إضافتها.",
      },
      {
        question: "نحن شركة ناشئة، هل تقدّمون خصومات؟",
        answer: (
          <>
            نعم. تحصل الفرق التي يقل عمرها عن سنتين ويقل عدد أفرادها عن <bdi dir="ltr">20</bdi> على خصم <bdi dir="ltr">50%</bdi>{" "}
            في سنتها الأولى.
          </>
        ),
      },
      {
        question: "ما الموارد التي تأتي مع الترخيص؟",
        answer: "مكتبة Figma، وسجل الشيفرة، والتوثيق بالعربية والإنجليزية، والوصول إلى قناة الدعم لدينا.",
      },
    ],
    empty: "لا توجد أسئلة بعد.",
  },
}

export interface FaqDarkPanelProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FaqDarkPanelCopy> {
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

export function FaqDarkPanel({
  locale = "en",
  heading,
  description,
  items,
  empty,
  defaultValue = ["0"],
  multiple,
  className,
  ...props
}: FaqDarkPanelProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-12 rounded-3xl bg-background-inverse px-6 py-20 md:px-16">
        <header className="flex w-full max-w-[720px] flex-col gap-2 text-center">
          <h2 id={headingId} className="text-3xl font-semibold text-foreground-inverse lg:text-4xl">
            {heading ?? copy.heading}
          </h2>
          <p className="text-base text-muted-foreground-inverse">{description ?? copy.description}</p>
        </header>

        {list.length === 0 ? (
          <p className="w-full max-w-[880px] text-center text-sm text-muted-foreground-inverse">{empty ?? copy.empty}</p>
        ) : (
          <Accordion className="w-full max-w-[880px] gap-2" defaultValue={defaultValue} multiple={multiple}>
            {list.map((item, index) => (
              <AccordionItem
                key={item.value ?? index}
                value={item.value ?? String(index)}
                className="rounded-lg border border-muted-foreground-inverse px-5 py-4 last:border"
              >
                <AccordionTrigger className="text-base text-foreground-inverse after:border-foreground-inverse">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground-inverse">{item.answer}</AccordionContent>
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
export const faqDarkPanelCopy = COPY
