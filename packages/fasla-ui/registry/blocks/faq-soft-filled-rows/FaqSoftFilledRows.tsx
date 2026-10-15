"use client"

import * as React from "react"
import { ChevronRightIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"

/*
 * Figma: `FAQ` (42359:9029), Type=Soft Filled Rows.
 *
 * Each question is a soft `muted` row; the open one turns into a `card` with a
 * border, so it stands out from the filled rows around it. Under the heading a
 * contact line points readers whose question isn't listed to a contact link.
 * The rows open and close on the Accordion's plus-and-minus indicator.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface FaqSoftFilledRowsItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqSoftFilledRowsCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The sentence before the contact link. */
  contactPrompt: React.ReactNode
  /** The text of the link to contact support, after `contactPrompt`. */
  contactLabel: React.ReactNode
  /** The questions, in order. Each item has a `question`, an `answer` and an optional `value` that `defaultValue` opens it by. */
  items: FaqSoftFilledRowsItem[]
  /** Shown in place of the questions when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqSoftFilledRowsCopy> = {
  en: {
    heading: "Frequently Asked Questions",
    contactPrompt: "Have a question we didn’t answer?",
    contactLabel: "Contact us",
    items: [
      {
        question: "What should I expect on my demo call?",
        answer:
          "A 30-minute walkthrough of the library with one of our designers, shaped around your product. Bring a screen you want to rebuild and we’ll start from it.",
      },
      {
        question: "What integrations do you offer?",
        answer:
          "Fasla ships Figma variables that map one-to-one to Tailwind theme tokens, so a handoff to Tailwind, shadcn/ui or your own CSS variables needs no translation layer.",
      },
      {
        question: "Can I buy components and blocks separately?",
        answer: "No. One licence covers the whole library: every component, every block and every future update.",
      },
      {
        question: "Is there a minimum team size?",
        answer: "No. A licence starts at one seat, and you add seats as your team grows.",
      },
      {
        question: "Which currencies can I be billed in?",
        answer: "US dollars, euros, pounds sterling and UAE dirhams. Your invoice uses the currency you pay in.",
      },
      {
        question: "Is the licence billed monthly or annually?",
        answer: "Either. Annual billing costs the same as ten months, and you can switch at your next renewal.",
      },
      {
        question: "Are there extra fees for onboarding?",
        answer: "No. Onboarding, the demo call and support are part of every licence.",
      },
    ],
    empty: "No questions yet.",
  },
  ar: {
    heading: "الأسئلة الشائعة",
    contactPrompt: "لديك سؤال لم نجب عنه؟",
    contactLabel: "تواصل معنا",
    items: [
      {
        question: "ما الذي أتوقّعه في مكالمة العرض التوضيحي؟",
        answer: (
          <>
            جولة في المكتبة مدتها <bdi dir="ltr">30</bdi> دقيقة مع أحد مصممينا، مصمَّمة حول منتجك. أحضر شاشة تريد إعادة بنائها
            وسنبدأ منها.
          </>
        ),
      },
      {
        question: "ما عمليات الربط التي تقدّمونها؟",
        answer:
          "تُرفَق فاصلة بمتغيّرات Figma تقابل رموز سمة Tailwind واحدًا لواحد، لذا لا يحتاج التسليم إلى Tailwind أو shadcn/ui أو متغيّرات CSS الخاصة بك إلى أي طبقة تحويل.",
      },
      {
        question: "هل يمكنني شراء المكوّنات والكتل بشكل منفصل؟",
        answer: "لا. يغطي الترخيص الواحد المكتبة كاملة: كل المكوّنات وكل الكتل وكل التحديثات القادمة.",
      },
      {
        question: "هل هناك حد أدنى لحجم الفريق؟",
        answer: "لا. يبدأ الترخيص بمقعد واحد، وتضيف المقاعد كلما كبر فريقك.",
      },
      {
        question: "بأي عملات يمكن إصدار الفاتورة؟",
        answer: "بالدولار الأمريكي واليورو والجنيه الإسترليني والدرهم الإماراتي. تصدر فاتورتك بالعملة التي تدفع بها.",
      },
      {
        question: "هل يُدفع الترخيص شهريًا أم سنويًا؟",
        answer: (
          <>
            كلاهما متاح. تكلّف الفوترة السنوية ما تكلّفه <bdi dir="ltr">10</bdi> أشهر، ويمكنك التبديل عند التجديد التالي.
          </>
        ),
      },
      {
        question: "هل توجد رسوم إضافية للتهيئة؟",
        answer: "لا. التهيئة ومكالمة العرض والدعم جزء من كل ترخيص.",
      },
    ],
    empty: "لا توجد أسئلة بعد.",
  },
}

export interface FaqSoftFilledRowsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqSoftFilledRowsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Where the contact link goes. */
  contactHref?: string
  /** The items open at first, by `value`. The second item, as in Figma. */
  defaultValue?: string[]
  /**
   * Lets several questions stay open at once.
   * @default false
   */
  multiple?: boolean
}

export function FaqSoftFilledRows({
  locale = "en",
  heading,
  contactPrompt,
  contactLabel,
  contactHref = "#",
  items,
  empty,
  defaultValue = ["1"],
  multiple,
  className,
  ...props
}: FaqSoftFilledRowsProps) {
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
        <header className="flex w-full max-w-[720px] flex-col items-center gap-2 text-center">
          <h2 id={headingId} className="text-3xl font-semibold text-foreground lg:text-4xl">
            {heading ?? copy.heading}
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            {contactPrompt ?? copy.contactPrompt}{" "}
            <a
              href={contactHref}
              className="inline-flex items-center gap-1 rounded-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {contactLabel ?? copy.contactLabel}
              <ChevronRightIcon aria-hidden="true" strokeWidth={1.5} className="size-3.5 [&:dir(rtl)]:-scale-x-100" />
            </a>
          </p>
        </header>

        {list.length === 0 ? (
          <p className="w-full max-w-[800px] text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <Accordion indicator="plus" className="w-full max-w-[800px] gap-2" defaultValue={defaultValue} multiple={multiple}>
            {list.map((item, index) => (
              <AccordionItem
                key={item.value ?? index}
                value={item.value ?? String(index)}
                className="rounded-lg border-b-0 bg-muted px-5 py-4 data-[open]:border data-[open]:border-border data-[open]:bg-card data-[open]:last:border"
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
export const faqSoftFilledRowsCopy = COPY
