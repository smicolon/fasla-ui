"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"

/*
 * Figma: `FAQ` (42359:9029), Type=Mono Index.
 *
 * A full-bleed inverted band: an intro beside a catalogue of questions, each
 * indexed `Q.001 /`, set in capitals. The band is painted with the inverse
 * tokens, the only way Fasla inverts a surface, so it is dark in Light and
 * light in Dark without forcing a `.dark` or `.light` class. The theme-inverse
 * registry item maps the tokens, falling back to the page colours swapped in
 * a theme that doesn't define them.
 *
 * The Accordion is the library's, untouched: every colour it needs on the
 * band (question, answer, divider, chevron, hover and focus ring) is set here,
 * through its className props. The questions are written in sentence case
 * and set in capitals only in a left-to-right page: Arabic has no capitals,
 * and a Latin name inside Arabic text keeps its own case.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface FaqMonoIndexItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqMonoIndexCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. */
  description: React.ReactNode
  /** The questions, in order. Each item has a `question`, an `answer` and an optional `value` that `defaultValue` opens it by. */
  items: FaqMonoIndexItem[]
  /** Shown in place of the questions when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqMonoIndexCopy> = {
  en: {
    heading: "Before you buy",
    description: "Thirteen questions we get before every licence. If yours is not here, write to us — a person answers.",
    items: [
      {
        question: "What is the library built on?",
        answer:
          "Figma variables for colour, spacing, radius and type, mapped one-to-one to Tailwind. Components are variant-driven, with light and dark modes and LTR/RTL directions.",
      },
      {
        question: "Does it work with Dev Mode and Code Connect?",
        answer: "Yes. Every component shows its token names in Dev Mode, and Code Connect links each one to its code.",
      },
      {
        question: "Is the file ready for agent-driven UI?",
        answer: "Yes. Every block documents its slots and content limits, so an agent can choose a block and fill it safely.",
      },
      {
        question: "Am I locked into this exact stack?",
        answer: "No. The tokens are plain variables; map them to any CSS setup, not only Tailwind.",
      },
      {
        question: "Do I need to know Tailwind?",
        answer: "No. Designers work in Figma as usual; Tailwind only matters to whoever writes the code.",
      },
      {
        question: "Is this for me if I don’t design?",
        answer: "Yes. Developers can install the blocks from the registry and ship them without opening Figma.",
      },
      {
        question: "Can I use this for client work?",
        answer: "Yes. One licence covers unlimited client projects.",
      },
      {
        question: "How is this different from a free kit?",
        answer: "Every value is token-bound, every block has three breakpoints and both directions, and the code matches the file.",
      },
      {
        question: "Will it break on Figma updates?",
        answer: "No. We test each Figma release against the library and ship fixes the same week if anything changes.",
      },
      {
        question: "What do I actually get, and for how long?",
        answer: "The full library and every update for as long as your licence is active.",
      },
      {
        question: "Do you offer support?",
        answer: "Yes. Write to us and a designer replies within one business day.",
      },
      {
        question: "What if I find a bug?",
        answer: "Report it from the file’s feedback page. Confirmed bugs are fixed in the next release.",
      },
      {
        question: "Can I get a refund?",
        answer: "Yes, within 14 days of purchase, with no questions asked.",
      },
    ],
    empty: "No questions yet.",
  },
  ar: {
    heading: "قبل الشراء",
    description: "ثلاثة عشر سؤالًا تصلنا قبل كل ترخيص. إن لم يكن سؤالك هنا فاكتب إلينا، يردّ عليك إنسان.",
    items: [
      {
        question: "على ماذا بُنيت المكتبة؟",
        answer:
          "متغيّرات Figma للّون والمسافات ونصف القطر والخطوط، مقابِلة واحدًا لواحد لـ Tailwind. والمكوّنات مبنية على النسخ، مع وضعين فاتح وداكن واتجاهَي القراءة.",
      },
      {
        question: "هل تعمل مع Dev Mode ومع Code Connect؟",
        answer: "نعم. يعرض كل مكوّن أسماء رموزه في Dev Mode، ويربط Code Connect كل مكوّن بشيفرته.",
      },
      {
        question: "هل الملف جاهز لواجهات يقودها الوكلاء؟",
        answer: "نعم. توثّق كل كتلة أجزاءها وحدود محتواها، فيستطيع الوكيل اختيار الكتلة وملئها بأمان.",
      },
      {
        question: "هل أنا مقيّد بهذه المنظومة تحديدًا؟",
        answer: "لا. الرموز متغيّرات عادية، يمكنك ربطها بأي إعداد CSS وليس بـ Tailwind فقط.",
      },
      {
        question: "هل يلزمني معرفة Tailwind؟",
        answer: "لا. يعمل المصممون في Figma كالمعتاد، ولا يهم Tailwind إلا من يكتب الشيفرة.",
      },
      {
        question: "هل هذه المكتبة مناسبة لي إن لم أكن مصمّمًا؟",
        answer: "نعم. يستطيع المطوّرون تثبيت الكتل من السجل وإطلاقها دون فتح Figma.",
      },
      {
        question: "هل يمكنني استخدامها في أعمال العملاء؟",
        answer: "نعم. يغطي الترخيص الواحد عددًا غير محدود من مشاريع العملاء.",
      },
      {
        question: "بماذا تختلف عن الحزم المجانية؟",
        answer: "كل قيمة مرتبطة بالرموز، ولكل كتلة ثلاث نقاط توقّف واتجاها القراءة، والشيفرة تطابق الملف.",
      },
      {
        question: "هل تتعطّل مع تحديثات Figma؟",
        answer: "لا. نختبر المكتبة مع كل إصدار من Figma، ونصدر الإصلاحات في الأسبوع نفسه إن تغيّر شيء.",
      },
      {
        question: "ما الذي أحصل عليه فعليًا، ولأي مدة؟",
        answer: "المكتبة كاملة وكل التحديثات ما دام ترخيصك فعّالًا.",
      },
      {
        question: "هل تقدّمون دعمًا؟",
        answer: "نعم. اكتب إلينا ويردّ عليك مصمم خلال يوم عمل واحد.",
      },
      {
        question: "ماذا لو وجدت خللًا؟",
        answer: "أبلغ عنه من صفحة الملاحظات في الملف. نصلح الأخطاء المؤكدة في الإصدار التالي.",
      },
      {
        question: "هل يمكنني استرداد المبلغ؟",
        answer: (
          <>
            نعم، خلال <bdi dir="ltr">14</bdi> يومًا من الشراء ودون أي أسئلة.
          </>
        ),
      },
    ],
    empty: "لا توجد أسئلة بعد.",
  },
}

export interface FaqMonoIndexProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FaqMonoIndexCopy> {
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

export function FaqMonoIndex({
  locale = "en",
  heading,
  description,
  items,
  empty,
  defaultValue = ["0"],
  multiple,
  className,
  ...props
}: FaqMonoIndexProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background-inverse px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-6 lg:flex-row lg:items-start lg:gap-24">
        <header className="flex flex-col gap-4 lg:w-80 lg:shrink-0">
          <h2 id={headingId} className="text-2xl font-semibold text-foreground-inverse md:text-3xl">
            {heading ?? copy.heading}
          </h2>
          <p className="text-sm text-muted-foreground-inverse">{description ?? copy.description}</p>
        </header>

        {list.length === 0 ? (
          <p className="min-w-0 flex-1 text-sm text-muted-foreground-inverse">{empty ?? copy.empty}</p>
        ) : (
          <Accordion indicator="plus" className="min-w-0 flex-1" defaultValue={defaultValue} multiple={multiple}>
            {list.map((item, index) => (
              <AccordionItem
                key={item.value ?? index}
                value={item.value ?? String(index)}
                className="flex items-start gap-4 border-muted-foreground-inverse/[0.24] py-1"
              >
                {/* The index is a label, not content: the list's order already numbers it. */}
                <span aria-hidden="true" className="w-16 shrink-0 pt-3 text-xs font-medium text-muted-foreground-inverse">
                  <bdi dir="ltr">{`Q.${String(index + 1).padStart(3, "0")} /`}</bdi>
                </span>
                <div className="min-w-0 flex-1">
                  <AccordionTrigger className="text-base [&:dir(ltr)]:uppercase text-foreground-inverse after:border-foreground-inverse [&_[data-slot=accordion-indicator]]:text-muted-foreground-inverse">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground-inverse">{item.answer}</AccordionContent>
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
export const faqMonoIndexCopy = COPY
