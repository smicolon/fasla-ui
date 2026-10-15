"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"

/*
 * Figma: `FAQ` (42359:9029), Type=Accent Active Card.
 *
 * One column of questions where the open one lifts out of the list: a card
 * with a `primary` accent bar at its start edge, so the current topic is never
 * lost. Whichever item opens becomes the card; the rest stay plain rows with
 * a divider. The card is drawn from the item's own open state, so it follows
 * the reader's clicks with no state of its own.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface FaqAccentActiveCardItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqAccentActiveCardCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. */
  description: React.ReactNode
  /** The questions, in order. Each item has a `question`, an `answer` and an optional `value` that `defaultValue` opens it by. */
  items: FaqAccentActiveCardItem[]
  /** Shown in place of the questions when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqAccentActiveCardCopy> = {
  en: {
    heading: "Questions, answered",
    description: "The open answer lifts out of the list so the current topic is never lost.",
    items: [
      {
        question: "How do I keep my file in sync when Fasla updates?",
        answer:
          "Fasla publishes as a Figma library. When we ship an update Figma shows a review prompt in your file — you accept the changes you want and skip the rest. Nothing is overwritten without your confirmation.",
      },
      {
        question: "What happens to my file if I cancel?",
        answer:
          "Everything you built stays yours. The library stops receiving updates, but every screen keeps rendering with the components it already uses.",
      },
      {
        question: "Can two designers edit the library at once?",
        answer:
          "Yes. Each seat can edit at the same time as the others, and Figma merges the changes as it does in any shared file.",
      },
      {
        question: "Do you ship Tailwind tokens with the file?",
        answer:
          "Yes. Every Figma variable has a Tailwind token of the same name, so the handoff needs no translation table.",
      },
      {
        question: "Is there a changelog I can follow?",
        answer: "Yes. A changelog page in the file lists every release, dated, with what was added, changed or removed.",
      },
      {
        question: "Can I request a component?",
        answer: "Yes. Send a request from the file’s feedback page; the most-asked components ship first.",
      },
    ],
    empty: "No questions yet.",
  },
  ar: {
    heading: "أسئلة وإجابات",
    description: "ترتفع الإجابة المفتوحة عن القائمة حتى لا يضيع الموضوع الحالي.",
    items: [
      {
        question: "كيف أُبقي ملفّي متزامنًا عند تحديث فاصلة؟",
        answer:
          "تُنشَر فاصلة كمكتبة في Figma. وعند إصدار تحديث يعرض Figma إشعار مراجعة داخل ملفك، فتقبل ما تريد من التغييرات وتتجاهل الباقي. ولا يُستبدل أي شيء دون تأكيدك.",
      },
      {
        question: "ماذا يحدث لملفّي إذا ألغيت الاشتراك؟",
        answer: "يبقى كل ما بنيته ملكًا لك. تتوقف المكتبة عن تلقّي التحديثات، لكن كل شاشة تظل تُعرض بالمكوّنات التي تستخدمها.",
      },
      {
        question: "هل يمكن لمصمّمَين تحرير المكتبة في الوقت نفسه؟",
        answer: "نعم. يستطيع كل مقعد التحرير في الوقت نفسه مع الآخرين، ويدمج Figma التغييرات كما يفعل في أي ملف مشترك.",
      },
      {
        question: "هل تُرفَق رموز Tailwind مع الملف؟",
        answer: "نعم. لكل متغيّر في Figma رمز في Tailwind بالاسم نفسه، فلا يحتاج التسليم إلى جدول مقابلة.",
      },
      {
        question: "هل يوجد سجلّ تغييرات يمكنني متابعته؟",
        answer: "نعم. تسرد صفحة سجلّ التغييرات في الملف كل إصدار بتاريخه، مع ما أُضيف أو تغيّر أو أُزيل.",
      },
      {
        question: "هل يمكنني طلب مكوّن جديد؟",
        answer: "نعم. أرسل طلبك من صفحة الملاحظات في الملف، وتصدر المكوّنات الأكثر طلبًا أولًا.",
      },
    ],
    empty: "لا توجد أسئلة بعد.",
  },
}

export interface FaqAccentActiveCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqAccentActiveCardCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The items open at first, by `value`. The first item, by default. */
  defaultValue?: string[]
  /**
   * Lets several questions stay open at once; each open one becomes a card.
   * @default false
   */
  multiple?: boolean
}

export function FaqAccentActiveCard({
  locale = "en",
  heading,
  description,
  items,
  empty,
  defaultValue = ["0"],
  multiple,
  className,
  ...props
}: FaqAccentActiveCardProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-12">
        <header className="flex w-full max-w-[880px] flex-col gap-3 text-center">
          <h2 id={headingId} className="text-3xl font-semibold text-foreground lg:text-4xl">
            {heading ?? copy.heading}
          </h2>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
        </header>

        {list.length === 0 ? (
          <p className="w-full max-w-[880px] text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <Accordion className="w-full max-w-[880px] gap-3" defaultValue={defaultValue} multiple={multiple}>
            {list.map((item, index) => (
              <AccordionItem
                key={item.value ?? index}
                value={item.value ?? String(index)}
                className={cn(
                  // Closed: a plain row with a divider. Open: a raised card
                  // with Figma's 4px accent bar on the start edge, which the
                  // padding clears (4 + 24). Only the card clips, to its
                  // corners: a closed row must not, or it would cut off the
                  // trigger's focus ring, which reaches 6px past each side.
                  "relative",
                  "data-[open]:overflow-hidden data-[open]:rounded-lg data-[open]:border data-[open]:border-border data-[open]:bg-card data-[open]:py-5 data-[open]:pe-6 data-[open]:ps-7 data-[open]:shadow data-[open]:last:border",
                  "before:absolute before:inset-y-0 before:start-0 before:hidden before:w-1 before:bg-primary data-[open]:before:block"
                )}
              >
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

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const faqAccentActiveCardCopy = COPY
