"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { FaqSplitSticky, type FaqSplitStickyCopy, type FaqSplitStickyItem } from "../../blocks/faq-split-sticky/FaqSplitSticky"

/*
 * Figma: `Mahaam Template` (47694:6712), the FAQ section of each of its six
 * variants, and its motion card "FAQ Accordion".
 *
 * The FAQ block's Split Sticky Type, as an instance with Mahaam's words: the
 * intro ("Questions, answered." and a line; Figma hides the label and the
 * contact button) at the start on Desktop and above the questions on Tablet and Mobile, and six
 * questions that open one at a time. The first starts open. An answer opens
 * its height from 0 over 450ms and the chevron turns 180°; under
 * `prefers-reduced-motion: reduce` it is instant. Nothing here loops, so the
 * section has no pause control.
 *
 * It is the block itself, so it switches at the block's own breakpoints: `md`
 * (768) and `lg` (1024), the window's and not the section's.
 */

type Locale = "en" | "ar"

export interface MahaamFaqCopy extends Omit<FaqSplitStickyCopy, "empty"> {
  empty?: React.ReactNode
}

const ltr = (text: string) => <bdi dir="ltr">{text}</bdi>

/** Figma's copy, English and Arabic. The answers after the first are written here: Figma leaves them closed. */
const COPY: Record<Locale, MahaamFaqCopy> = {
  en: {
    eyebrow: "Support",
    heading: (
      <>
        Questions,
        <br />
        answered.
      </>
    ),
    description: "Still curious? Talk to our team.",
    cta: "Contact support",
    items: [
      { question: "Does Mahaam join my meetings?", answer: "No. It listens through your own device, so no bot appears in the call and nobody needs to accept anything." },
      { question: "Which languages does it understand?", answer: "More than 40, including Arabic dialects. You can switch languages in the middle of a sentence." },
      { question: "Where are my voice notes stored?", answer: "Notes are private to you by default and encrypted at rest. You choose what to share and with whom." },
      { question: "Does it work with my calendar?", answer: "Yes. Connect Google or Outlook and Mahaam schedules tasks into real free time, never on top of a meeting." },
      { question: "Can my team use it together?", answer: "On the Team plan you can hand off tasks, share lists and send recaps to a channel." },
      { question: "Can I try Pro before paying?", answer: "Every new account gets 14 days of Pro, no card needed." },
    ],
  },
  ar: {
    eyebrow: "الدعم",
    heading: (
      <>
        أسئلة،
        <br />
        وأجوبتها.
      </>
    ),
    description: "ما زلت تتساءل؟ تحدّث إلى فريقنا.",
    cta: "تواصل مع الدعم",
    items: [
      { question: "هل ينضم مهام إلى اجتماعاتي؟", answer: "لا. يستمع عبر جهازك أنت، فلا يظهر روبوت في المكالمة ولا يحتاج أحد إلى قبول شيء." },
      { question: "ما اللغات التي يفهمها؟", answer: <>أكثر من {ltr("40")} لغة، بما فيها اللهجات العربية. ويمكنك التنقل بين اللغات في منتصف الجملة.</> },
      { question: "أين تُحفظ ملاحظاتي الصوتية؟", answer: "ملاحظاتك خاصة بك افتراضيًا، ومشفّرة أثناء التخزين. وأنت من يقرر ما تشاركه ومع من." },
      { question: "هل يعمل مع تقويمي؟", answer: <>نعم. اربط تقويم {ltr("Google")} أو {ltr("Outlook")} ويضع مهام يومك في وقت فراغ حقيقي، لا فوق اجتماع.</> },
      { question: "هل يمكن لفريقي استخدامه معًا؟", answer: "في خطة الفرق يمكنكم إسناد المهام، ومشاركة القوائم، وإرسال الملخصات إلى قناة." },
      { question: "هل يمكنني تجربة الاحترافية قبل الدفع؟", answer: <>كل حساب جديد يحصل على {ltr("14")} يومًا من الخطة الاحترافية، دون بطاقة.</> },
    ],
  },
}

export interface MahaamFaqProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<MahaamFaqCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: Locale
  /**
   * Where the contact button goes.
   * @default "#contact"
   */
  ctaHref?: string
  /** The questions open at first, by position. The first, by default. */
  defaultValue?: string[]
}

export function MahaamFaq({ locale = "en", eyebrow, heading, description, cta, items, empty, ctaHref = "#contact", defaultValue, className, ...props }: MahaamFaqProps) {
  const copy = COPY[locale]
  return (
    <div className={cn("pt-8 md:pt-12 lg:pt-16", className)}>
      <FaqSplitSticky
        locale={locale}
        // Figma hides the label and the contact button in every variant; pass them (`mahaamFaqCopy` has Figma's words) to show them.
        eyebrow={eyebrow ?? ""}
        heading={heading ?? copy.heading}
        description={description ?? copy.description}
        cta={cta ?? ""}
        items={(items ?? copy.items) as FaqSplitStickyItem[]}
        empty={empty}
        ctaHref={ctaHref}
        defaultValue={defaultValue}
        // Figma's Desktop sets the block 112px in from each side, not the block's 32, and sets its English heading in 3XL on Mobile and
        // Desktop but 5XL on Tablet, and its Arabic in 2XL, 3XL and 3XL. With no label the empty line must not leave a gap above the heading.
        className="lg:px-28 [&_h2]:text-3xl md:[&_h2]:text-5xl lg:[&_h2]:text-3xl rtl:[&_h2]:text-2xl rtl:md:[&_h2]:text-3xl rtl:lg:[&_h2]:text-3xl [&_header>p:empty]:hidden"
        {...props}
      />
    </div>
  )
}

/** The default copy, English and Arabic, as `locale` picks it. Spread it to change a few strings and keep the rest. */
export const mahaamFaqCopy = COPY
