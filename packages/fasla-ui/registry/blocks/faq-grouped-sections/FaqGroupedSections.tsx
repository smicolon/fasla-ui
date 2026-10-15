"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"

/*
 * Figma: `FAQ` (42359:9029), Type=Grouped Sections.
 *
 * The questions in labelled groups: each label in a column at the start,
 * its questions beside it. On Mobile the label sits above its questions.
 * The indicator is a plus that turns into a cross while the item is open:
 * the Accordion's plus indicator, with its open state drawn here as the
 * plus turned 45 degrees, which is Figma's cross.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). Direction is the page's `dir`; every
 * side here is a logical one.
 */

export interface FaqGroupedSectionsItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to "<group index>-<item index>". */
  value?: string
}

export interface FaqGroupedSectionsGroup {
  label: React.ReactNode
  items: FaqGroupedSectionsItem[]
}

export interface FaqGroupedSectionsCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. */
  description: React.ReactNode
  /** The groups of questions, each under its own label. Each group has a `label` and its `items`, which are questions like `items` elsewhere: `question`, `answer` and an optional `value`. */
  groups: FaqGroupedSectionsGroup[]
  /** Shown in place of the groups when `groups` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqGroupedSectionsCopy> = {
  en: {
    heading: "FAQ",
    description: "Answers about the library, the licence and working with our team.",
    groups: [
      {
        label: "The library",
        items: [
          {
            question: "Can we adapt the system as our product changes?",
            answer:
              "Yes. Every value resolves through a variable collection, so rebranding is a token edit, not a component rewrite. Blocks pick the change up automatically in both themes.",
          },
          {
            question: "How does the release model work?",
            answer: "We release monthly. Each release is a library update in Figma and a new version of the code registry, listed in one changelog.",
          },
          {
            question: "Is it really faster than starting from scratch?",
            answer: "Yes. Teams skip months of building and documenting the basics, and spend that time on their own product.",
          },
          {
            question: "What does a Fasla component include?",
            answer: "Every size, state and direction, light and dark themes, documentation in English and Arabic, and the matching code.",
          },
        ],
      },
      {
        label: "Licensing",
        items: [
          {
            question: "Can I use one licence across two products?",
            answer: "Yes. A licence covers the people who edit the library, not the products you build with it.",
          },
          {
            question: "How do we reduce risk before committing?",
            answer: "Start with the free sample file, then buy seats for one team before rolling Fasla out further.",
          },
          {
            question: "Is it worth migrating an existing file?",
            answer: "Usually, yes. Replace components page by page; the tokens follow shadcn/ui names, so most styles carry over.",
          },
          {
            question: "We have strict procurement — can you invoice?",
            answer: "Yes. We invoice yearly, with purchase orders and your company’s details on the invoice.",
          },
        ],
      },
      {
        label: "Working together",
        items: [
          {
            question: "Can Fasla support us through a full migration?",
            answer: "Yes. For larger teams we plan the migration with you and review your first pages as they move.",
          },
          {
            question: "How do we request a component we need?",
            answer: "Send it through the request channel. We reply with whether it fits the roadmap, and when.",
          },
        ],
      },
    ],
    empty: "No questions yet.",
  },
  ar: {
    heading: "الأسئلة الشائعة",
    description: "إجابات عن المكتبة والترخيص والعمل مع فريقنا.",
    groups: [
      {
        label: "المكتبة",
        items: [
          {
            question: "هل يمكننا تكييف النظام مع تغيّر منتجنا؟",
            answer:
              "نعم. كل قيمة تعود إلى مجموعة متغيّرات، لذا فإن تغيير الهوية تعديل في الرموز لا إعادة كتابة للمكوّنات. وتلتقط الكتل التغيير تلقائيًا في الوضعين.",
          },
          {
            question: "كيف يعمل نموذج الإصدارات؟",
            answer: "نصدر تحديثًا كل شهر. كل إصدار تحديث للمكتبة في Figma ونسخة جديدة من سجل الشيفرة، مذكوران في سجل تغييرات واحد.",
          },
          {
            question: "هل هي أسرع فعلًا من البدء من الصفر؟",
            answer: "نعم. توفّر الفرق أشهرًا من بناء الأساسيات وتوثيقها، وتصرف ذلك الوقت على منتجها.",
          },
          {
            question: "ماذا يتضمّن مكوّن فاصلة؟",
            answer: "كل الأحجام والحالات والاتجاهات، والوضعين الفاتح والداكن، والتوثيق بالعربية والإنجليزية، والشيفرة المطابقة.",
          },
        ],
      },
      {
        label: "التراخيص",
        items: [
          {
            question: "هل يمكنني استخدام ترخيص واحد لمنتجين؟",
            answer: "نعم. يغطي الترخيص من يعدّلون المكتبة، لا المنتجات التي تبنيها بها.",
          },
          {
            question: "كيف نقلّل المخاطر قبل الالتزام؟",
            answer: "ابدأ بالملف التجريبي المجاني، ثم اشترِ مقاعد لفريق واحد قبل تعميم فاصلة.",
          },
          {
            question: "هل يستحق نقل ملف قائم؟",
            answer: "غالبًا نعم. استبدل المكوّنات صفحةً بعد صفحة. أسماء الرموز تتبع أسماء shadcn/ui، فتنتقل معظم الأنماط كما هي.",
          },
          {
            question: "لدينا إجراءات شراء صارمة، هل يمكنكم إصدار فاتورة؟",
            answer: "نعم. نصدر فواتير سنوية، مع أوامر الشراء وبيانات شركتك على الفاتورة.",
          },
        ],
      },
      {
        label: "العمل معًا",
        items: [
          {
            question: "هل يمكن لفاصلة دعمنا خلال عملية انتقال كاملة؟",
            answer: "نعم. نخطط الانتقال مع الفرق الكبيرة، ونراجع صفحاتكم الأولى أثناء نقلها.",
          },
          {
            question: "كيف نطلب مكوّنًا نحتاجه؟",
            answer: "أرسله عبر قناة الطلبات، ونردّ عليك بما إذا كان ضمن خطتنا ومتى.",
          },
        ],
      },
    ],
    empty: "لا توجد أسئلة بعد.",
  },
}

export interface FaqGroupedSectionsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqGroupedSectionsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The items open at first, by `value`. The first item of the first group, by default. */
  defaultValue?: string[]
  /**
   * Lets several questions stay open at once.
   * @default false
   */
  multiple?: boolean
}

/**
 * Figma's open item shows a cross. The Accordion's plus indicator swaps the
 * plus for a minus; here the minus stays hidden and the plus turns 45
 * degrees instead, at the Accordion's own 180ms.
 */
const CROSS = [
  "[&_[data-slot=accordion-indicator]>svg:first-child]:transition-transform",
  "[&_[data-slot=accordion-indicator]>svg:first-child]:duration-[180ms]",
  "[&_[data-slot=accordion-indicator]>svg:first-child]:motion-reduce:transition-none",
  "[&_[data-panel-open]_[data-slot=accordion-indicator]>svg:first-child]:block",
  "[&_[data-panel-open]_[data-slot=accordion-indicator]>svg:first-child]:rotate-45",
  "[&_[data-panel-open]_[data-slot=accordion-indicator]>svg:last-child]:hidden",
].join(" ")

export function FaqGroupedSections({
  locale = "en",
  heading,
  description,
  groups,
  empty,
  defaultValue = ["0-0"],
  multiple,
  className,
  ...props
}: FaqGroupedSectionsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = groups ?? copy.groups

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-12">
        <header className="flex w-full max-w-[640px] flex-col gap-2 text-center">
          <h2 id={headingId} className="text-3xl font-semibold text-foreground lg:text-5xl">
            {heading ?? copy.heading}
          </h2>
          <p className="text-sm text-muted-foreground">{description ?? copy.description}</p>
        </header>

        {list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <Accordion
            indicator="plus"
            className={cn("w-full gap-16", CROSS)}
            defaultValue={defaultValue}
            multiple={multiple}
          >
            {list.map((group, g) => (
              <div key={g} className="flex flex-col gap-6 md:flex-row md:items-start md:gap-16">
                <h3 className="text-lg font-semibold uppercase text-foreground md:w-60 md:shrink-0 md:text-xl">
                  {group.label}
                </h3>
                <div className="flex min-w-0 flex-1 flex-col">
                  {group.items.map((item, i) => (
                    <AccordionItem key={item.value ?? i} value={item.value ?? `${g}-${i}`}>
                      <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </div>
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
export const faqGroupedSectionsCopy = COPY
