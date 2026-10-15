"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"
import { Badge } from "../../ui/badge/badge"

/*
 * Figma: `FAQ` (42359:9029), Type=Two-Column Grid.
 *
 * A badge and heading over two columns of question cards, each card an
 * Accordion item in its own bordered box, and a line of links to more help
 * under them. The first half of the questions fills the first column. The
 * columns stack on Mobile, the first above the second.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). Direction is the page's `dir`; every
 * side here is a logical one.
 */

export interface FaqTwoColumnGridItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqTwoColumnGridCopy {
  /** The badge above the heading. */
  badge: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The questions, in order. Each item has a `question`, an `answer` and an optional `value` that `defaultValue` opens it by. */
  items: FaqTwoColumnGridItem[]
  /** The footer line: "{moreText} {docsLabel} {orText} {contactLabel}". */
  moreText: React.ReactNode
  /** The text of the link to the docs, in the closing line. */
  docsLabel: React.ReactNode
  /** The word between the two links in the closing line. */
  orText: React.ReactNode
  /** The text of the link to contact support, in the closing line. */
  contactLabel: React.ReactNode
  /** Shown in place of the questions when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqTwoColumnGridCopy> = {
  en: {
    badge: "F.A.Q",
    heading: "Questions & answers",
    items: [
      {
        question: "Is Fasla right for my team?",
        answer:
          "If your team designs in Figma and ships with React and Tailwind, yes. Fasla gives designers and developers the same components, names and tokens.",
      },
      {
        question: "Can I try it before buying?",
        answer: "Yes. Duplicate the free sample file to try a selection of components and blocks in your own workspace.",
      },
      {
        question: "What’s the difference between the Figma file and the code kit?",
        answer:
          "The Figma file is the design library. The code kit is the same components in React, installed with one command and styled with the same tokens.",
      },
      {
        question: "Do you support staging and dev versions?",
        answer: "Yes. Publish a branch of the library for testing, and release it to the whole team when it’s ready.",
      },
      {
        question: "I already use another kit — can I migrate?",
        answer: "Yes. Swap components page by page; Fasla’s tokens follow shadcn/ui names, so most styles carry over.",
      },
      {
        question: "Do you collect or store any customer data?",
        answer: "No. The library runs in your own Figma files and your own codebase; nothing is sent to us.",
      },
      {
        question: "What support is included?",
        answer: "Email support with a reply within one business day, and a channel for requesting components.",
      },
      {
        question: "One of my libraries is private — will it still work?",
        answer: "Yes. Fasla works alongside private libraries, and your components can use its tokens like any other.",
      },
      {
        question: "Can I move away from Fasla later?",
        answer: "Yes. The files and the code are yours to keep, so you can stop updating at any time and nothing breaks.",
      },
    ],
    moreText: "More questions? Visit the",
    docsLabel: "documentation",
    orText: "or",
    contactLabel: "send us a message",
    empty: "No questions yet.",
  },
  ar: {
    badge: "الأسئلة الشائعة",
    heading: "أسئلة وأجوبة",
    items: [
      {
        question: "هل فاصلة مناسبة لفريقي؟",
        answer:
          "إذا كان فريقك يصمم في Figma ويبني واجهاته بمكتبة React مع Tailwind، فنعم. تمنح فاصلة المصممين والمطوّرين المكوّنات والأسماء والرموز نفسها.",
      },
      {
        question: "هل يمكنني تجربتها قبل الشراء؟",
        answer: "نعم. انسخ الملف التجريبي المجاني لتجرّب مجموعة من المكوّنات والكتل في مساحة عملك.",
      },
      {
        question: "ما الفرق بين ملف Figma وحزمة الكود؟",
        answer: "ملف Figma هو مكتبة التصميم. أما حزمة الكود فهي المكوّنات نفسها بلغة React، تُثبَّت بأمر واحد وتستخدم الرموز نفسها.",
      },
      {
        question: "هل تدعمون نسخ التجريب والتطوير؟",
        answer: "نعم. انشر فرعًا من المكتبة للاختبار، ثم أصدره للفريق كله حين يجهز.",
      },
      {
        question: "أستخدم حزمة أخرى بالفعل، هل يمكنني الانتقال؟",
        answer: "نعم. استبدل المكوّنات صفحةً بعد صفحة. أسماء رموز فاصلة تتبع أسماء shadcn/ui، فتنتقل معظم الأنماط كما هي.",
      },
      {
        question: "هل تجمعون أو تخزّنون أي بيانات للعملاء؟",
        answer: "لا. تعمل المكتبة في ملفات Figma الخاصة بك وفي شيفرتك، ولا يصلنا منها شيء.",
      },
      {
        question: "ما الدعم المشمول؟",
        answer: "دعم عبر البريد الإلكتروني بردّ خلال يوم عمل واحد، وقناة لطلب المكوّنات.",
      },
      {
        question: "إحدى مكتباتي خاصة، هل ستعمل مع ذلك؟",
        answer: "نعم. تعمل فاصلة إلى جانب المكتبات الخاصة، ويمكن لمكوّناتك استخدام رموزها كأي مكتبة أخرى.",
      },
      {
        question: "هل يمكنني الاستغناء عن فاصلة لاحقًا؟",
        answer: "نعم. الملفات والشيفرة ملكك، فيمكنك إيقاف التحديث في أي وقت دون أن يتعطل شيء.",
      },
    ],
    moreText: "مزيد من الأسئلة؟ زر",
    docsLabel: "التوثيق",
    orText: "أو",
    contactLabel: "راسلنا",
    empty: "لا توجد أسئلة بعد.",
  },
}

export interface FaqTwoColumnGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqTwoColumnGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Where the documentation link goes. */
  docsHref?: string
  /** Where the message link goes. */
  contactHref?: string
  /** The items open at first, by `value`. None, by default. */
  defaultValue?: string[]
  /**
   * Lets several questions stay open at once.
   * @default false
   */
  multiple?: boolean
}

const LINK =
  "rounded-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function FaqTwoColumnGrid({
  locale = "en",
  badge,
  heading,
  items,
  moreText,
  docsLabel,
  orText,
  contactLabel,
  empty,
  docsHref = "#",
  contactHref = "#",
  defaultValue = [],
  multiple,
  className,
  ...props
}: FaqTwoColumnGridProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items
  // The first half fills the first column, which takes the odd one out.
  const split = Math.ceil(list.length / 2)
  const columns = [list.slice(0, split), list.slice(split)]

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-12">
        <header className="flex w-full max-w-[720px] flex-col items-center gap-4 text-center">
          <Badge variant="soft" tone="secondary" size="sm">
            {badge ?? copy.badge}
          </Badge>
          <h2 id={headingId} className="text-3xl font-semibold text-foreground lg:text-4xl">
            {heading ?? copy.heading}
          </h2>
        </header>

        {list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <Accordion
            className="w-full max-w-[1120px] gap-6 md:flex-row md:items-start md:gap-5"
            defaultValue={defaultValue}
            multiple={multiple}
          >
            {columns.map((column, c) => (
              <div key={c} className="flex min-w-0 flex-1 flex-col gap-4">
                {column.map((item, i) => {
                  const index = c === 0 ? i : split + i
                  return (
                    <AccordionItem
                      key={item.value ?? index}
                      value={item.value ?? String(index)}
                      className="rounded-lg border border-border bg-card p-4 last:border"
                    >
                      <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  )
                })}
              </div>
            ))}
          </Accordion>
        )}

        <p className="flex flex-wrap items-center justify-center gap-1 text-center text-sm text-muted-foreground">
          <span>{moreText ?? copy.moreText}</span>
          <a href={docsHref} className={LINK}>
            {docsLabel ?? copy.docsLabel}
          </a>
          <span>{orText ?? copy.orText}</span>
          <a href={contactHref} className={LINK}>
            {contactLabel ?? copy.contactLabel}
          </a>
        </p>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const faqTwoColumnGridCopy = COPY
