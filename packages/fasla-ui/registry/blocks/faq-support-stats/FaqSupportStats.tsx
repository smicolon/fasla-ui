"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"

/*
 * Figma: `FAQ` (42359:9029), Type=Support Stats.
 *
 * Support's own numbers beside the questions about support: an intro and three
 * figures in a fixed column at the start, the questions filling the rest.
 * Mobile first: the base classes are Figma's Mobile (360) and `md:` its
 * Tablet (768), where the two stack; `lg:` is its Desktop (1440), where they
 * sit side by side. Direction is the page's `dir`; every side here is a
 * logical one.
 *
 * The figures are a description list: each label names its value, and
 * `order` draws the value above the label, as Figma does, while a screen
 * reader hears the label first.
 */

export interface FaqSupportStatsItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqSupportStatsStat {
  /** The figure, in Western numerals. */
  value: React.ReactNode
  label: React.ReactNode
  /** Where the figure comes from. */
  meta?: React.ReactNode
}

export interface FaqSupportStatsCopy {
  eyebrow: React.ReactNode
  heading: React.ReactNode
  description: React.ReactNode
  stats: FaqSupportStatsStat[]
  items: FaqSupportStatsItem[]
  /** Shown in place of the questions when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqSupportStatsCopy> = {
  en: {
    eyebrow: "SUPPORT, MEASURED",
    heading: "Ask us anything",
    description: "We publish our support numbers because you should be able to check them before you commit.",
    stats: [
      { value: "27m", label: "Median first reply", meta: "across the last 90 days" },
      { value: "98.2%", label: "Rated helpful", meta: "from 1,340 resolved threads" },
      { value: "612", label: "Answers published", meta: "updated with every release" },
    ],
    items: [
      {
        question: "How quickly will someone actually reply?",
        answer:
          "Median first reply is under two hours in working time, and every thread is answered by someone who works on the library — there is no first-line script.",
      },
      {
        question: "Do you support us during a migration?",
        answer: "Yes. We review your migration plan, answer questions in a shared channel and check the first screens you move.",
      },
      {
        question: "Can we get a private channel?",
        answer: "Teams on the Business plan get a private channel with the people who build the library.",
      },
      {
        question: "What time zones do you cover?",
        answer: "We answer from 09:00 to 18:00 Gulf time, Monday to Friday, and urgent issues are watched at weekends.",
      },
      {
        question: "Is support included in every plan?",
        answer: "Yes. Every plan includes email support; chat and calls come with Team and Business.",
      },
      {
        question: "How do I escalate something urgent?",
        answer: "Mark the thread urgent. It goes straight to the on-call designer, who replies within the hour.",
      },
      {
        question: "Where do I report a broken component?",
        answer: "Use the request channel in the file, or email us a link to the frame. We confirm within one business day.",
      },
    ],
    empty: "No questions yet.",
  },
  ar: {
    eyebrow: "الدعم بالأرقام",
    heading: "اسألنا عن أي شيء",
    description: "ننشر أرقام الدعم لدينا لأنه ينبغي أن تتمكّن من التحقّق منها قبل الالتزام.",
    stats: [
      {
        value: <bdi dir="ltr">27m</bdi>,
        label: "وسيط زمن أول ردّ",
        meta: (
          <>
            خلال آخر <bdi dir="ltr">90</bdi> يومًا
          </>
        ),
      },
      {
        value: <bdi dir="ltr">98.2%</bdi>,
        label: "قُيّمت بأنها مفيدة",
        meta: (
          <>
            من <bdi dir="ltr">1,340</bdi> محادثة مُغلقة
          </>
        ),
      },
      { value: <bdi dir="ltr">612</bdi>, label: "إجابة منشورة", meta: "تُحدَّث مع كل إصدار" },
    ],
    items: [
      {
        question: "ما السرعة الفعلية للردّ؟",
        answer:
          "وسيط أول ردّ أقل من ساعتين ضمن ساعات العمل، ويجيب عن كل محادثة شخص يعمل على المكتبة، فلا توجد ردود جاهزة من الخط الأول.",
      },
      {
        question: "هل تدعموننا أثناء الانتقال؟",
        answer: "نعم. نراجع خطة الانتقال، ونجيب عن أسئلتكم في قناة مشتركة، ونتحقّق من أولى الشاشات التي تنقلونها.",
      },
      {
        question: "هل يمكننا الحصول على قناة خاصة؟",
        answer: "تحصل فرق خطة الأعمال على قناة خاصة مع الأشخاص الذين يبنون المكتبة.",
      },
      {
        question: "ما المناطق الزمنية التي تغطّونها؟",
        answer: (
          <>
            نجيب من <bdi dir="ltr">09:00</bdi> إلى <bdi dir="ltr">18:00</bdi> بتوقيت الخليج، من الاثنين إلى الجمعة، ونتابع
            الأمور العاجلة في عطلة نهاية الأسبوع.
          </>
        ),
      },
      {
        question: "هل الدعم مشمول في كل الخطط؟",
        answer: "نعم. تشمل كل خطة الدعم بالبريد، وتأتي الدردشة والمكالمات مع خطتي الفرق والأعمال.",
      },
      {
        question: "كيف أصعّد أمرًا عاجلًا؟",
        answer: "ضع على المحادثة علامة عاجل، فتصل مباشرة إلى المصمم المناوب الذي يردّ خلال ساعة.",
      },
      {
        question: "أين أبلّغ عن مكوّن معطّل؟",
        answer: "استخدم قناة الطلبات في الملف، أو راسلنا برابط الإطار. نؤكّد الاستلام خلال يوم عمل واحد.",
      },
    ],
    empty: "لا توجد أسئلة بعد.",
  },
}

export interface FaqSupportStatsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqSupportStatsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The items open at first, by `value`. The first item, by default. */
  defaultValue?: string[]
  /** Lets several questions stay open at once. */
  multiple?: boolean
}

export function FaqSupportStats({
  locale = "en",
  eyebrow,
  heading,
  description,
  stats,
  items,
  empty,
  defaultValue = ["0"],
  multiple,
  className,
  ...props
}: FaqSupportStatsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items
  const figures = stats ?? copy.stats

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-6 md:gap-8 lg:flex-row lg:items-start lg:gap-24">
        <div className="flex flex-col gap-8 lg:w-[420px] lg:shrink-0">
          <header className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-primary">{eyebrow ?? copy.eyebrow}</p>
            <h2 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
              {heading ?? copy.heading}
            </h2>
            <p className="text-sm text-muted-foreground">{description ?? copy.description}</p>
          </header>
          {figures.length > 0 && (
            <dl className="flex flex-col">
              {figures.map((stat, index) => (
                <div key={index} className="flex flex-col gap-0.5 border-b border-border py-5 last:border-b-0">
                  <dt className="order-2 text-sm font-medium text-foreground">{stat.label}</dt>
                  <dd className="order-1 text-3xl font-semibold text-foreground lg:text-4xl">{stat.value}</dd>
                  {stat.meta && <dd className="order-3 text-xs text-muted-foreground">{stat.meta}</dd>}
                </div>
              ))}
            </dl>
          )}
        </div>

        {list.length === 0 ? (
          <p className="min-w-0 flex-1 text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <Accordion className="min-w-0 flex-1" defaultValue={defaultValue} multiple={multiple}>
            {list.map((item, index) => (
              <AccordionItem key={item.value ?? index} value={item.value ?? String(index)}>
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
