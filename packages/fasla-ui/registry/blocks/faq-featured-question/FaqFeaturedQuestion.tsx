"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"
import { Button } from "../../ui/button/button"

/*
 * Figma: `FAQ` (42359:9029), Type=Featured Question.
 *
 * The question everybody asks, answered in full on a raised card, with a
 * "Was this helpful?" prompt; the rest of the questions follow in a list.
 * The prompt reports the answer through `onFeedback` and thanks the reader
 * once they choose, so it is never asked twice.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface FaqFeaturedQuestionItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqFeaturedQuestionCopy {
  eyebrow: React.ReactNode
  heading: React.ReactNode
  /** The question answered on the card. */
  featured: { question: React.ReactNode; answer: React.ReactNode }
  helpfulPrompt: React.ReactNode
  yesLabel: React.ReactNode
  noLabel: React.ReactNode
  /** Replaces the prompt once the reader has answered it. */
  thanks: React.ReactNode
  /** The questions under the card. */
  items: FaqFeaturedQuestionItem[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqFeaturedQuestionCopy> = {
  en: {
    eyebrow: "MOST ASKED",
    heading: "Start with the question everybody asks",
    featured: {
      question: "Do I have to rebuild my product to adopt Fasla?",
      answer:
        "No. Fasla is additive. Start by pointing one screen at the token collections, then swap components in as you touch them. Because every colour, space and radius resolves to a variable, a half-migrated file still renders correctly in both themes — there is no all-or-nothing switch, and nothing breaks while you go.",
    },
    helpfulPrompt: "Was this helpful?",
    yesLabel: "Yes",
    noLabel: "No",
    thanks: "Thanks for letting us know.",
    items: [
      {
        question: "How long does a typical migration take?",
        answer: "Most teams move their core screens in two to four weeks, working screen by screen alongside their usual releases.",
      },
      {
        question: "Can I mix Fasla with my own components?",
        answer: "Yes. Point your components at the same tokens and they sit beside Fasla’s in both themes.",
      },
      {
        question: "Do you provide a Tailwind config?",
        answer: "Yes. The theme installs with one command and maps every token to a Tailwind class.",
      },
      {
        question: "What happens to my existing styles?",
        answer: "Nothing, until you replace them. Your styles keep working while you move screens over one at a time.",
      },
      {
        question: "Is there a migration guide?",
        answer: "Yes. The docs walk through a migration step by step, from the first token to the last screen.",
      },
    ],
  },
  ar: {
    eyebrow: "الأكثر سؤالًا",
    heading: "ابدأ بالسؤال الذي يطرحه الجميع",
    featured: {
      question: "هل عليّ إعادة بناء منتجي لاعتماد فاصلة؟",
      answer:
        "لا. فاصلة إضافية بطبيعتها. ابدأ بتوجيه شاشة واحدة إلى مجموعات الرموز، ثم استبدل المكوّنات تدريجيًا كلما عملت عليها. ولأن كل لون ومسافة ونصف قطر يعود إلى متغيّر، يظل الملف المنقول جزئيًا يُعرض بشكل صحيح في الوضعين، فلا يوجد تبديل شامل، ولا ينكسر شيء أثناء الانتقال.",
    },
    helpfulPrompt: "هل كان هذا مفيدًا؟",
    yesLabel: "نعم",
    noLabel: "لا",
    thanks: "شكرًا لإخبارنا.",
    items: [
      {
        question: "كم تستغرق عملية الانتقال عادةً؟",
        answer: "تنقل معظم الفرق شاشاتها الأساسية خلال أسبوعين إلى أربعة أسابيع، شاشةً بعد شاشة إلى جانب إصداراتها المعتادة.",
      },
      {
        question: "هل يمكنني الدمج بين فاصلة ومكوّناتي الخاصة؟",
        answer: "نعم. اربط مكوّناتك بالرموز نفسها لتظهر بجانب مكوّنات فاصلة في الوضعين.",
      },
      {
        question: "هل توفّرون ملف إعداد Tailwind؟",
        answer: "نعم. تُثبَّت السمة بأمر واحد، وتربط كل رمز بفئة في Tailwind.",
      },
      {
        question: "ماذا يحدث لأنماطي الحالية؟",
        answer: "لا شيء حتى تستبدلها. تظل أنماطك تعمل بينما تنقل الشاشات واحدة تلو الأخرى.",
      },
      {
        question: "هل يوجد دليل للانتقال؟",
        answer: "نعم. يشرح التوثيق الانتقال خطوة بخطوة، من أول رمز حتى آخر شاشة.",
      },
    ],
  },
}

export interface FaqFeaturedQuestionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqFeaturedQuestionCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Called with the reader's answer to "Was this helpful?". */
  onFeedback?: (value: "yes" | "no") => void
  /** The list items open at first, by `value`. None, as in Figma. */
  defaultValue?: string[]
  /** Lets several questions stay open at once. */
  multiple?: boolean
}

export function FaqFeaturedQuestion({
  locale = "en",
  eyebrow,
  heading,
  featured,
  helpfulPrompt,
  yesLabel,
  noLabel,
  thanks,
  items,
  onFeedback,
  defaultValue,
  multiple,
  className,
  ...props
}: FaqFeaturedQuestionProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const card = featured ?? copy.featured
  const list = items ?? copy.items
  const [answered, setAnswered] = React.useState(false)

  const answer = (value: "yes" | "no") => {
    setAnswered(true)
    onFeedback?.(value)
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-12">
        <header className="flex flex-col gap-2 text-center">
          <p className="text-xs font-semibold text-primary">{eyebrow ?? copy.eyebrow}</p>
          <h2 id={headingId} className="text-3xl font-semibold text-foreground lg:text-4xl">
            {heading ?? copy.heading}
          </h2>
        </header>

        <article className="flex flex-col gap-5 rounded-xl border border-border bg-card p-8 shadow-md">
          <h3 className="text-xl font-semibold text-foreground md:text-2xl">{card.question}</h3>
          <div className="text-base text-muted-foreground">{card.answer}</div>
          <hr className="border-border" />
          {/* The prompt and the thanks share one live region, so a screen reader hears the change. */}
          <div aria-live="polite" className="flex min-h-8 items-center gap-3">
            {answered ? (
              <p className="text-sm text-muted-foreground">{thanks ?? copy.thanks}</p>
            ) : (
              <>
                <p className="flex-1 text-sm text-muted-foreground">{helpfulPrompt ?? copy.helpfulPrompt}</p>
                <Button variant="outline" size="sm" onClick={() => answer("yes")}>
                  {yesLabel ?? copy.yesLabel}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => answer("no")}>
                  {noLabel ?? copy.noLabel}
                </Button>
              </>
            )}
          </div>
        </article>

        {list.length > 0 ? (
          <Accordion defaultValue={defaultValue} multiple={multiple}>
            {list.map((item, index) => (
              <AccordionItem key={item.value ?? index} value={item.value ?? String(index)}>
                <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : null}
      </div>
    </section>
  )
}
