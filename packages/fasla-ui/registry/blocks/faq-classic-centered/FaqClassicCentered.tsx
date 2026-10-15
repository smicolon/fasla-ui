"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"

/*
 * Figma: `FAQ` (42359:9029), Type=Classic Centered.
 *
 * A centred header over one column of questions on the Accordion's Default
 * style. Mobile first: the base classes are Figma's Mobile (360), `md:` its
 * Tablet (768) and `lg:` its Desktop (1440). Direction is the page's `dir`;
 * nothing here knows about RTL, because every side is a logical one.
 */

export interface FaqClassicCenteredItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqClassicCenteredCopy {
  eyebrow: React.ReactNode
  heading: React.ReactNode
  description: React.ReactNode
  items: FaqClassicCenteredItem[]
  /** Shown in place of the questions when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqClassicCenteredCopy> = {
  en: {
    eyebrow: "FAQ",
    heading: "Frequently asked questions",
    description:
      "Everything you need to know about Fasla — licensing, updates and support. Can’t find your answer? Reach out and we’ll reply within one business day.",
    items: [
      {
        question: "What’s included in a Fasla licence?",
        answer:
          "Every component, block and template in the library, plus light and dark theming, LTR and RTL variants, and all future updates for the lifetime of the licence.",
      },
      {
        question: "Can I use Fasla on client projects?",
        answer:
          "Yes. One licence covers unlimited client and personal projects. Your clients can keep the finished designs and code; they need their own licence only to edit the library itself.",
      },
      {
        question: "Does Fasla support right-to-left layouts?",
        answer:
          "Yes. Every block ships with an RTL variant set in Cairo, and the code uses logical properties, so Arabic layouts mirror without separate components.",
      },
      {
        question: "How often is the library updated?",
        answer:
          "We release new blocks and fixes every month. Updates land in the same file, and the changelog lists everything that changed.",
      },
      {
        question: "Do you offer team or agency pricing?",
        answer:
          "Yes. Team plans are priced per editor seat, and agencies get volume pricing from ten seats. Contact us for a quote.",
      },
      {
        question: "What’s your refund policy?",
        answer:
          "If Fasla isn’t right for you, ask for a refund within 14 days of purchase and we’ll return the full amount.",
      },
    ],
    empty: "No questions yet.",
  },
  ar: {
    eyebrow: "الأسئلة الشائعة",
    heading: "الأسئلة الأكثر شيوعًا",
    description:
      "كل ما تحتاج معرفته عن فاصلة: التراخيص والتحديثات والدعم. لم تجد إجابتك؟ تواصل معنا وسنردّ خلال يوم عمل واحد.",
    items: [
      {
        question: "ما الذي يشمله ترخيص فاصلة؟",
        answer:
          "جميع المكوّنات والكتل والقوالب في المكتبة، إضافةً إلى الوضعين الفاتح والداكن، ونسختَي الاتجاه من اليسار إلى اليمين ومن اليمين إلى اليسار، وكل التحديثات المستقبلية طوال مدة الترخيص.",
      },
      {
        question: "هل يمكنني استخدام فاصلة في مشاريع العملاء؟",
        answer:
          "نعم. يغطي الترخيص الواحد عددًا غير محدود من مشاريع العملاء والمشاريع الشخصية. يحتفظ عملاؤك بالتصاميم والشيفرة النهائية، ولا يحتاجون إلى ترخيص خاص إلا لتعديل المكتبة نفسها.",
      },
      {
        question: "هل تدعم فاصلة التخطيطات من اليمين إلى اليسار؟",
        answer:
          "نعم. لكل كتلة نسخة من اليمين إلى اليسار بخط Cairo، والشيفرة تستخدم الخصائص المنطقية، فتنعكس التخطيطات العربية دون مكوّنات منفصلة.",
      },
      {
        question: "ما وتيرة تحديث المكتبة؟",
        answer: "نصدر كتلًا جديدة وإصلاحات كل شهر. تصل التحديثات إلى الملف نفسه، ويذكر سجل التغييرات كل ما تغيّر.",
      },
      {
        question: "هل تقدّمون أسعارًا للفرق والوكالات؟",
        answer: (
          <>
            نعم. تُسعَّر خطط الفرق حسب مقاعد التحرير، وتحصل الوكالات على أسعار الكميات بدءًا من <bdi dir="ltr">10</bdi> مقاعد.
            تواصل معنا لطلب عرض سعر.
          </>
        ),
      },
      {
        question: "ما سياسة استرداد المبالغ لديكم؟",
        answer: (
          <>
            إذا لم تناسبك فاصلة، فاطلب الاسترداد خلال <bdi dir="ltr">14</bdi> يومًا من الشراء وسنعيد إليك المبلغ كاملًا.
          </>
        ),
      },
    ],
    empty: "لا توجد أسئلة بعد.",
  },
}

export interface FaqClassicCenteredProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqClassicCenteredCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The items open at first, by `value`. The first item, by default. */
  defaultValue?: string[]
  /** Lets several questions stay open at once. */
  multiple?: boolean
}

export function FaqClassicCentered({
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
}: FaqClassicCenteredProps) {
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
        <header className="flex w-full max-w-3xl flex-col gap-3 text-center">
          <p className="text-sm font-semibold text-primary">{eyebrow ?? copy.eyebrow}</p>
          <h2 id={headingId} className="text-3xl font-semibold text-foreground lg:text-4xl">
            {heading ?? copy.heading}
          </h2>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
        </header>

        {list.length === 0 ? (
          <p className="w-full max-w-3xl text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <Accordion className="w-full max-w-3xl" defaultValue={defaultValue} multiple={multiple}>
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
