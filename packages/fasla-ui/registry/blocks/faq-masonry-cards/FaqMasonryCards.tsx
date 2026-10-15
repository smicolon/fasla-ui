"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"

/*
 * Figma: `FAQ` (42359:9029), Type=Masonry Cards.
 *
 * Questions as raised cards, the Accordion's Split style, in two columns
 * that each grow on their own, so an open card pushes down only its own
 * column. Each item says which column it goes in; the columns stack on
 * Mobile, the first above the second, which keeps the reading order.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). Direction is the page's `dir`; every
 * side here is a logical one.
 */

export interface FaqMasonryCardsItem {
  question: React.ReactNode
  /** The answer. An intro line and a list are what Figma shows; any content works. */
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
  /** Which column the card goes in. Without it, the first half of the items fill the first column. */
  column?: 1 | 2
}

export interface FaqMasonryCardsCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The questions, as cards. Each item has a `question`, an `answer` and an optional `value` that `defaultValue` opens it by. An optional `column`, 1 or 2, pins a card to a column; without it the first half fill the first column. */
  items: FaqMasonryCardsItem[]
  /** Shown in place of the questions when `items` is empty. */
  empty: React.ReactNode
}

/** An answer made of an intro line and a list, as Figma's open card has it. */
function ListAnswer({ intro, points }: { intro: React.ReactNode; points: React.ReactNode[] }) {
  return (
    <>
      <p>{intro}</p>
      <ul className="list-disc ps-5">
        {points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </>
  )
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqMasonryCardsCopy> = {
  en: {
    heading: "Frequently Asked Questions",
    items: [
      {
        column: 1,
        question: "What is a design system, really?",
        answer:
          "A shared set of components, tokens and rules that designers and developers both build from, so every screen is made of the same parts.",
      },
      {
        column: 1,
        question: "How much does Fasla cost?",
        answer: "One licence per editor seat, paid yearly. Viewers and developers are free, and every update is included.",
      },
      {
        column: 1,
        question: "How does Fasla work alongside Tailwind, shadcn/ui and your own CSS?",
        answer: (
          <ListAnswer
            intro="It sits on top of them:"
            points={[
              "Tokens follow shadcn/ui names, mapped into your Tailwind theme",
              "Components are copied into your project, so you own the code",
              "Your own CSS keeps working beside them",
            ]}
          />
        ),
      },
      {
        column: 1,
        question: "What integrations are available?",
        answer: "Figma variables, Dev Mode, a shadcn-compatible code registry and a CLI that installs components with one command.",
      },
      {
        column: 1,
        question: "Do I need a developer to use it?",
        answer: "Not to design with it. To ship the coded components, someone on your team needs to run one install command.",
      },
      {
        column: 2,
        question: "What do teams get on day one?",
        answer: (
          <ListAnswer
            intro="Everything ships in one file:"
            points={[
              "1,600+ components across 129 variant sets",
              "Light and dark themes bound to variables",
              "LTR and RTL directions for every block",
              "Desktop, tablet and mobile breakpoints",
              "A living changelog and a request channel",
            ]}
          />
        ),
      },
      {
        column: 2,
        question: "How long does implementation take?",
        answer: "Most teams publish the library on the first day and replace their own components over two to four weeks.",
      },
      {
        column: 2,
        question: "What kind of support can I expect?",
        answer: "Email support with a reply within one business day, onboarding help for teams, and a channel to request components.",
      },
    ],
    empty: "No questions yet.",
  },
  ar: {
    heading: "الأسئلة الشائعة",
    items: [
      {
        column: 1,
        question: "ما نظام التصميم في حقيقته؟",
        answer: "مجموعة مشتركة من المكوّنات والرموز والقواعد يبني منها المصممون والمطوّرون معًا، فتتكوّن كل شاشة من الأجزاء نفسها.",
      },
      {
        column: 1,
        question: "كم تبلغ تكلفة فاصلة؟",
        answer: "ترخيص واحد لكل مقعد تحرير، يُدفع سنويًا. المشاهدون والمطوّرون مجانيون، وكل التحديثات مشمولة.",
      },
      {
        column: 1,
        question: "كيف تعمل فاصلة جنبًا إلى جنب مع أدوات مثل Tailwind، shadcn/ui، وأنماط CSS الخاصة بك؟",
        answer: (
          <ListAnswer
            intro="تعمل فوقها:"
            points={[
              "تتبع الرموز أسماء shadcn/ui، وتُربط بسمة Tailwind في مشروعك",
              "تُنسخ المكوّنات إلى مشروعك، فتملك شيفرتها",
              "تبقى أنماط CSS الخاصة بك تعمل إلى جانبها",
            ]}
          />
        ),
      },
      {
        column: 1,
        question: "ما عمليات الربط المتاحة؟",
        answer: "متغيّرات Figma، ووضع Dev Mode، وسجل شيفرة متوافق مع shadcn، وأداة سطر أوامر تثبّت المكوّنات بأمر واحد.",
      },
      {
        column: 1,
        question: "هل أحتاج إلى مطوّر لاستخدامها؟",
        answer: "لا تحتاج إليه للتصميم بها. أما لنشر المكوّنات البرمجية، فيكفي أن يشغّل أحد أفراد فريقك أمر تثبيت واحدًا.",
      },
      {
        column: 2,
        question: "ما الذي تحصل عليه الفرق في اليوم الأول؟",
        answer: (
          <ListAnswer
            intro="كل شيء يأتي في ملف واحد:"
            points={[
              <>
                أكثر من <bdi dir="ltr">1,600</bdi> مكوّن ضمن <bdi dir="ltr">129</bdi> مجموعة نسخ
              </>,
              "وضعان فاتح وداكن مرتبطان بالمتغيّرات",
              "اتجاها القراءة لكل كتلة",
              "نقاط توقّف لسطح المكتب واللوحي والجوال",
              "سجلّ تغييرات حيّ وقناة للطلبات",
            ]}
          />
        ),
      },
      {
        column: 2,
        question: "كم يستغرق التنفيذ؟",
        answer: (
          <>
            تنشر معظم الفرق المكتبة في اليوم الأول، وتستبدل مكوّناتها خلال أسبوعين إلى <bdi dir="ltr">4</bdi> أسابيع.
          </>
        ),
      },
      {
        column: 2,
        question: "ما نوع الدعم الذي يمكنني توقّعه؟",
        answer: "دعم عبر البريد الإلكتروني بردّ خلال يوم عمل واحد، ومساعدة الفرق في البدء، وقناة لطلب المكوّنات.",
      },
    ],
    empty: "لا توجد أسئلة بعد.",
  },
}

export interface FaqMasonryCardsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqMasonryCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The items open at first, by `value`. The first card of the second column, by default. */
  defaultValue?: string[]
  /**
   * Lets several questions stay open at once.
   * @default false
   */
  multiple?: boolean
}

export function FaqMasonryCards({
  locale = "en",
  heading,
  items,
  empty,
  defaultValue = ["5"],
  multiple,
  className,
  ...props
}: FaqMasonryCardsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = (items ?? copy.items).map((item, index) => ({ ...item, value: item.value ?? String(index) }))
  const split = Math.ceil(list.length / 2)
  const columnOf = (item: FaqMasonryCardsItem, index: number) => item.column ?? (index < split ? 1 : 2)
  const columns = [1, 2].map((column) => list.filter((item, index) => columnOf(item, index) === column))

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-12">
        <h2 id={headingId} className="w-full max-w-[760px] text-center text-2xl font-semibold text-foreground md:text-3xl">
          {heading ?? copy.heading}
        </h2>

        {list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <Accordion
            variant="split"
            className="w-full max-w-[1120px] gap-6 md:flex-row md:items-start md:gap-5"
            defaultValue={defaultValue}
            multiple={multiple}
          >
            {columns.map((column, c) => (
              <div key={c} className="flex min-w-0 flex-1 flex-col gap-3">
                {column.map((item) => (
                  <AccordionItem key={item.value} value={item.value}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </div>
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
export const faqMasonryCardsCopy = COPY
