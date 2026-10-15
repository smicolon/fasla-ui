"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"

/*
 * Figma: `FAQ` (42359:9029), Type=Uppercase Dense.
 *
 * A compact list on a `muted` band: a two-line intro beside a long run of
 * questions set in capitals. The questions are written in sentence case and
 * set in capitals only in a left-to-right page: Arabic has no capitals, and a
 * Latin name inside Arabic text keeps its own case.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface FaqUppercaseDenseItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqUppercaseDenseCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. */
  description: React.ReactNode
  /** The questions, in order. Each item has a `question`, an `answer` and an optional `value` that `defaultValue` opens it by. */
  items: FaqUppercaseDenseItem[]
  /** Shown in place of the questions when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqUppercaseDenseCopy> = {
  en: {
    heading: (
      <>
        Questions?
        <br />
        We’re here to help
      </>
    ),
    description: "Everything about the library, the licence and the handoff.",
    items: [
      {
        question: "Does it actually save time?",
        answer:
          "Teams moving onto Fasla report their first production screen in under a day, because every block is already tokenised, responsive and documented — nothing has to be rebuilt from a static mockup.",
      },
      {
        question: "Is every component token-bound?",
        answer: "Yes. Every fill, stroke, gap, padding and radius points at a variable, never a raw value.",
      },
      {
        question: "How many blocks ship today?",
        answer: "Hundreds, across marketing, application and commerce pages, with new families every month.",
      },
      {
        question: "What about dark mode?",
        answer: "Every component and block has light and dark modes from the same variables. Switching the mode swaps every colour.",
      },
      {
        question: "Can I restyle it to my brand?",
        answer: "Yes. Change the token values for your colours, radius and type, and every component follows.",
      },
      {
        question: "Does it cover Arabic type?",
        answer: "Yes. Arabic is set in Cairo with its own line heights, and every block has a right-to-left variant.",
      },
      {
        question: "Are the blocks responsive?",
        answer: "Yes. Each block has desktop, tablet and mobile variants, and the code follows the same breakpoints.",
      },
      {
        question: "How do I hand off to engineers?",
        answer: "Share the file. Token names in Figma match the code, and every block has an install command in the docs.",
      },
      {
        question: "Is there a component changelog?",
        answer: "Yes. A changelog page in the file lists every release, dated.",
      },
      {
        question: "What support is included?",
        answer: "Email support from our designers, with replies within one business day.",
      },
    ],
    empty: "No questions yet.",
  },
  ar: {
    heading: (
      <>
        أسئلة؟
        <br />
        نحن هنا للمساعدة
      </>
    ),
    description: "كل ما يخصّ المكتبة والترخيص والتسليم.",
    items: [
      {
        question: "هل توفّر الوقت فعلًا؟",
        answer:
          "تفيد الفرق التي تنتقل إلى فاصلة بإنجاز أول شاشة إنتاجية في أقل من يوم، لأن كل كتلة مرتبطة بالرموز ومتجاوبة وموثّقة، فلا حاجة إلى إعادة بناء أي شيء انطلاقًا من نموذج ثابت.",
      },
      {
        question: "هل كل مكوّن مرتبط بالرموز؟",
        answer: "نعم. كل تعبئة وحدّ وفجوة وحشوة ونصف قطر يشير إلى متغيّر، لا إلى قيمة ثابتة.",
      },
      {
        question: "كم عدد الكتل المتاحة اليوم؟",
        answer: "المئات، في صفحات التسويق والتطبيقات والتجارة، مع عائلات جديدة كل شهر.",
      },
      {
        question: "ماذا عن الوضع الداكن؟",
        answer: "لكل مكوّن وكتلة وضعان فاتح وداكن من المتغيّرات نفسها. وتغيير الوضع يبدّل كل الألوان.",
      },
      {
        question: "هل يمكنني تكييفها مع هوية علامتي؟",
        answer: "نعم. غيّر قيم الرموز لألوانك ونصف القطر والخطوط، وتتبعها كل المكوّنات.",
      },
      {
        question: "هل تغطّي الخطوط العربية؟",
        answer: "نعم. يُكتب النص العربي بخط Cairo بارتفاعات أسطر خاصة به، ولكل كتلة نسخة من اليمين إلى اليسار.",
      },
      {
        question: "هل الكتل متجاوبة؟",
        answer: "نعم. لكل كتلة نسخ لسطح المكتب والجهاز اللوحي والجوال، والشيفرة تتبع نقاط التوقّف نفسها.",
      },
      {
        question: "كيف أسلّم العمل إلى المهندسين؟",
        answer: "شارك الملف. أسماء الرموز في Figma تطابق الشيفرة، ولكل كتلة أمر تثبيت في التوثيق.",
      },
      {
        question: "هل يوجد سجلّ تغييرات للمكوّنات؟",
        answer: "نعم. تسرد صفحة سجلّ التغييرات في الملف كل إصدار بتاريخه.",
      },
      {
        question: "ما الدعم المشمول؟",
        answer: "دعم بالبريد الإلكتروني من مصممينا، مع الرد خلال يوم عمل واحد.",
      },
    ],
    empty: "لا توجد أسئلة بعد.",
  },
}

export interface FaqUppercaseDenseProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqUppercaseDenseCopy> {
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

export function FaqUppercaseDense({
  locale = "en",
  heading,
  description,
  items,
  empty,
  defaultValue = ["0"],
  multiple,
  className,
  ...props
}: FaqUppercaseDenseProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-muted px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-6 md:gap-8 lg:flex-row lg:items-start lg:gap-24">
        <header className="flex flex-col gap-3 lg:w-[360px] lg:shrink-0">
          <h2 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
            {heading ?? copy.heading}
          </h2>
          <p className="text-sm text-muted-foreground">{description ?? copy.description}</p>
        </header>

        {list.length === 0 ? (
          <p className="min-w-0 flex-1 text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <Accordion indicator="plus" className="min-w-0 flex-1" defaultValue={defaultValue} multiple={multiple}>
            {list.map((item, index) => (
              <AccordionItem key={item.value ?? index} value={item.value ?? String(index)}>
                <AccordionTrigger className="text-base [&:dir(ltr)]:uppercase">{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
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
export const faqUppercaseDenseCopy = COPY
