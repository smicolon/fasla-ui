"use client"

import * as React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"
import { FeaturesHeader, FeaturesPhotoSlot, FeaturesSection, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Accordion + Photo.
 *
 * The copy beside a tall photo: the header (an eyebrow and the heading) over
 * an Accordion atom (the plus / minus variant) of five questions, the first
 * open, and a 512 × 560 photo with a 10px radius.
 *
 * Desktop sets the copy at the start (672px) and the photo at the end, 64px
 * apart. Tablet and Mobile put the photo above the copy at full width.
 * Opening a question closes the open one, as the Accordion atom does by
 * default.
 *
 * Content limits: a question up to 40 characters and its answer up to 260.
 * The other limits are in the block's documentation page.
 */

export interface FeaturesAccordionItem {
  /** Keys the item, and names it for `defaultValue`. */
  id: string
  /** The question, in the trigger. */
  question: React.ReactNode
  /** The answer, in the panel. */
  answer: React.ReactNode
}

export interface FeaturesAccordionPhotoCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The questions, in order. */
  items: FeaturesAccordionItem[]
}

/** Figma's copy for the first answer, English and Arabic; the other four are written for the code, in the same voice. */
const COPY: Record<FeaturesLocale, FeaturesAccordionPhotoCopy> = {
  en: {
    eyebrow: "IN DETAIL",
    heading: "The features people ask about most",
    items: [
      {
        id: "offline",
        question: "Does it work offline?",
        answer: "Yes. Every view you have opened is cached locally, edits queue while you are disconnected, and the merge on reconnect is field-level rather than record-level — so two people editing the same item never overwrite each other.",
      },
      {
        id: "permissions",
        question: "How do permissions work?",
        answer: "Roles are set per workspace, project or field, and they inherit downwards. Guests can be limited to a single project, and every change to who can see what is written to the audit log.",
      },
      {
        id: "data",
        question: "Can we bring our own data?",
        answer: "Yes. Import from CSV, spreadsheets or the most common work tools, with fields mapped before anything is written. Nothing is overwritten, and an import can be undone for thirty days.",
      },
      {
        id: "api",
        question: "What about the API?",
        answer: "Everything the interface can do is available through a documented REST API and webhooks, with the same permissions as the person calling it. The API is included on every plan.",
      },
      {
        id: "arabic",
        question: "Is it available in Arabic?",
        answer: "Yes. The interface, the notifications and the exports are available in Arabic, with layouts that mirror from right to left. Switch the language per person, not per workspace.",
      },
    ],
  },
  ar: {
    eyebrow: "بالتفصيل",
    heading: "الميزات الأكثر سؤالًا عنها",
    items: [
      {
        id: "offline",
        question: "هل يعمل دون اتصال؟",
        answer: "نعم. كل عرض فتحته مخزَّن محليًا، وتُصطفّ التعديلات أثناء انقطاع الاتصال، ويتم الدمج عند العودة على مستوى الحقل لا السجل، فلا يستبدل شخصان يحرّران العنصر نفسه عمل بعضهما.",
      },
      {
        id: "permissions",
        question: "كيف تعمل الصلاحيات؟",
        answer: "تُضبط الأدوار لكل مساحة عمل أو مشروع أو حقل، وتنتقل إلى ما تحتها. يمكن حصر الضيوف في مشروع واحد، ويُسجَّل كل تغيير في من يرى ماذا في سجل التدقيق.",
      },
      {
        id: "data",
        question: "هل يمكننا إحضار بياناتنا؟",
        answer: "نعم. استورد من ملفات CSV أو جداول البيانات أو أشهر أدوات العمل، مع مطابقة الحقول قبل كتابة أي شيء. لا يُستبدل شيء، ويمكن التراجع عن أي استيراد خلال ثلاثين يومًا.",
      },
      {
        id: "api",
        question: "ماذا عن واجهة API؟",
        answer: "كل ما تفعله الواجهة متاح عبر واجهة REST موثّقة وخطافات ويب، بالصلاحيات نفسها التي لدى من يستدعيها. الواجهة مشمولة في كل الباقات.",
      },
      {
        id: "arabic",
        question: "هل هو متاح بالعربية؟",
        answer: "نعم. الواجهة والإشعارات والتصدير متاحة بالعربية، بتخطيطات تنعكس من اليمين إلى اليسار. بدّل اللغة لكل شخص لا لكل مساحة عمل.",
      },
    ],
  },
}

export interface FeaturesAccordionPhotoProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "defaultValue">, Partial<FeaturesAccordionPhotoCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** The photo beside the copy. A `muted` placeholder shows without it. */
  photo?: FeaturesPhoto
  /** The `id`s of the items open on first render. The first by default. */
  defaultValue?: string[]
  /** Lets several items stay open at once. */
  multiple?: boolean
}

export function FeaturesAccordionPhoto({ locale = "en", eyebrow, heading, items, photo, defaultValue, multiple = false, className, ...props }: FeaturesAccordionPhotoProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items

  return (
    <FeaturesSection labelledBy={headingId} className={className} {...props}>
      <div className="flex flex-col gap-10 [@container(min-width:72rem)]:flex-row [@container(min-width:72rem)]:items-center [@container(min-width:72rem)]:gap-16">
        <div className="order-last flex min-w-0 flex-col gap-10 [@container(min-width:72rem)]:order-none [@container(min-width:72rem)]:flex-1">
          <FeaturesHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} />
          {list.length > 0 ? (
            <Accordion indicator="plus" multiple={multiple} defaultValue={defaultValue ?? [list[0]!.id]} className="w-full">
              {list.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : null}
        </div>
        <FeaturesPhotoSlot photo={photo} className="aspect-[296/325] w-full shrink-0 rounded-lg [@container(min-width:48rem)]:aspect-[640/703] [@container(min-width:72rem)]:aspect-[512/560] [@container(min-width:72rem)]:w-[512px] [@container(min-width:72rem)]:max-w-[42%]" />
      </div>
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresAccordionPhotoCopy = COPY
