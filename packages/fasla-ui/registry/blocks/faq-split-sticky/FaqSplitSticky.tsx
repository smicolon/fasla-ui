"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"
import { Button, buttonVariants } from "../../ui/button/button"

/*
 * Figma: `FAQ` (42359:9029), Type=Split Sticky.
 *
 * An intro column (eyebrow, heading, a line of copy and a contact button)
 * beside the questions. On Desktop the intro sits at the start and stays in
 * view while the questions scroll past it; on Tablet and Mobile it stacks
 * above them.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). Direction is the page's `dir`; every
 * side here is a logical one.
 */

export interface FaqSplitStickyItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqSplitStickyCopy {
  eyebrow: React.ReactNode
  heading: React.ReactNode
  description: React.ReactNode
  /** The contact button's label. */
  cta: React.ReactNode
  items: FaqSplitStickyItem[]
  /** Shown in place of the questions when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqSplitStickyCopy> = {
  en: {
    eyebrow: "Support",
    heading: "Frequently asked questions",
    description: "Answers to what teams ask most before adopting Fasla. Still stuck? Our team replies within one business day.",
    cta: "Contact support",
    items: [
      {
        question: "Do I need a Figma licence to use Fasla?",
        answer:
          "Yes — Fasla is a Figma library, so every editor on your team needs a paid Figma seat. Viewers can inspect and comment for free.",
      },
      {
        question: "Can I publish Fasla as my own library?",
        answer:
          "Inside your organisation, yes: publish it to your team and build on it. Reselling or redistributing the library itself isn’t allowed.",
      },
      {
        question: "Are Arabic and RTL variants included?",
        answer: "Yes. Every block has an RTL variant set in Cairo, with the layout mirrored and the copy in Modern Standard Arabic.",
      },
      {
        question: "Do components use variables or hard-coded values?",
        answer: "Variables throughout. Colour, spacing, radius and type all resolve through collections, so a rebrand is a token edit.",
      },
      {
        question: "How do I get updates once I’ve bought it?",
        answer: "Updates land in the same file. Accept them from the library update prompt in Figma, and read the changelog for what changed.",
      },
      {
        question: "Is there a trial or sample file?",
        answer: "Yes. The free sample file has a selection of components and blocks, so you can try the system before you buy.",
      },
    ],
    empty: "No questions yet.",
  },
  ar: {
    eyebrow: "الدعم",
    heading: "الأسئلة الأكثر شيوعًا",
    description: "إجابات عن أكثر ما تسأل عنه الفرق قبل اعتماد فاصلة. ما زلت بحاجة إلى مساعدة؟ يردّ فريقنا خلال يوم عمل واحد.",
    cta: "تواصل مع الدعم",
    items: [
      {
        question: "هل أحتاج إلى ترخيص Figma لاستخدام فاصلة؟",
        answer:
          "نعم. فاصلة مكتبة في Figma، لذا يحتاج كل محرّر في فريقك إلى مقعد مدفوع في Figma. أما المشاهدون فيمكنهم المعاينة والتعليق مجانًا.",
      },
      {
        question: "هل يمكنني نشر فاصلة كمكتبة خاصة بي؟",
        answer: "داخل مؤسستك، نعم: انشرها لفريقك وابنِ عليها. أما إعادة بيع المكتبة نفسها أو توزيعها فغير مسموح.",
      },
      {
        question: "هل النسخ العربية ونسخ اتجاه اليمين إلى اليسار مضمّنة؟",
        answer: "نعم. لكل كتلة نسخة من اليمين إلى اليسار بخط Cairo، بتخطيط معكوس ونصوص بالعربية الفصحى.",
      },
      {
        question: "هل تستخدم المكوّنات متغيّرات أم قيمًا ثابتة؟",
        answer: "متغيّرات في كل مكان. الألوان والمسافات والزوايا والخطوط كلها تعود إلى مجموعات، فيصبح تغيير الهوية تعديلًا في الرموز.",
      },
      {
        question: "كيف أحصل على التحديثات بعد الشراء؟",
        answer: "تصل التحديثات إلى الملف نفسه. اقبلها من تنبيه تحديث المكتبة في Figma، واقرأ سجل التغييرات لتعرف ما تغيّر.",
      },
      {
        question: "هل يوجد ملف تجريبي أو نسخة اختبارية؟",
        answer: "نعم. في الملف التجريبي المجاني مجموعة من المكوّنات والكتل، لتجرّب النظام قبل الشراء.",
      },
    ],
    empty: "لا توجد أسئلة بعد.",
  },
}

export interface FaqSplitStickyProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FaqSplitStickyCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Where the contact button goes. Without it, the button calls `onCtaClick`. */
  ctaHref?: string
  /** Called when the contact button is pressed, when it has no `ctaHref`. */
  onCtaClick?: React.MouseEventHandler<HTMLButtonElement>
  /** The items open at first, by `value`. The first item, by default. */
  defaultValue?: string[]
  /** Lets several questions stay open at once. */
  multiple?: boolean
}

export function FaqSplitSticky({
  locale = "en",
  eyebrow,
  heading,
  description,
  cta,
  items,
  empty,
  ctaHref,
  onCtaClick,
  defaultValue = ["0"],
  multiple,
  className,
  ...props
}: FaqSplitStickyProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items
  const ctaLabel = cta ?? copy.cta

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-6 md:gap-8 lg:flex-row lg:items-start lg:gap-24">
        <header className="flex flex-col items-start gap-3 lg:sticky lg:top-24 lg:w-[420px] lg:shrink-0">
          <p className="text-xs font-semibold uppercase text-primary">{eyebrow ?? copy.eyebrow}</p>
          <h2 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
            {heading ?? copy.heading}
          </h2>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
          {ctaLabel ? (
            ctaHref ? (
              // The Button's own classes on a link, not Button asChild: the
              // shadcn CLI rewrites asChild for Base UI projects, which
              // Fasla's Button doesn't take.
              <a href={ctaHref} className={buttonVariants({ variant: "outline", size: "md" })}>
                {ctaLabel}
              </a>
            ) : (
              <Button variant="outline" size="md" onClick={onCtaClick}>
                {ctaLabel}
              </Button>
            )
          ) : null}
        </header>

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
