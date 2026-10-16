"use client"

import * as React from "react"
import { Headphones } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"

/*
 * Figma: `FAQ` (42359:9029), Type=Media Split.
 *
 * A photo with a caption chip beside the heading and questions. The photo
 * sits at the start on Desktop and above the questions on Tablet and
 * Mobile. No photo comes with the block: pass `image`, and until then the
 * frame is a `muted` placeholder of the same size.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). Direction is the page's `dir`; every
 * side here is a logical one. The photo itself is never mirrored.
 */

export interface FaqMediaSplitItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqMediaSplitImage {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface FaqMediaSplitCopy {
  /** The chip on the photo. Hidden when empty. */
  caption: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. */
  description: React.ReactNode
  /** The questions, in order. Each item has a `question`, an `answer` and an optional `value` that `defaultValue` opens it by. */
  items: FaqMediaSplitItem[]
  /** Shown in place of the questions when `items` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqMediaSplitCopy> = {
  en: {
    caption: "The people who answer your questions",
    heading: "FAQ and support",
    description:
      "In our FAQ you will find answers to the questions we are asked most, and a route to a person for everything else.",
    items: [
      {
        question: "What do we actually get — a design system or a starting point?",
        answer:
          "Both. You get the structure: components, states, RTL/LTR, light and dark. The surface — colour, type, tone — is yours to define.",
      },
      {
        question: "Why do you version components instead of files?",
        answer:
          "So you can take one fix without taking every change. Each component has its own version, and the changelog says what moved.",
      },
      {
        question: "Are the photographs in the blocks licensed?",
        answer: "The photos in our previews are licensed for the previews only. The blocks ship without images, so you add your own.",
      },
      {
        question: "Can I swap the imagery for my own?",
        answer: "Yes. Pass your own photo to the block; the frame keeps its size and corners whatever image you use.",
      },
      {
        question: "Do you ship illustration as well?",
        answer: "Yes. A set of illustrations bound to the theme colours comes with the library, so they follow light and dark.",
      },
    ],
    empty: "No questions yet.",
  },
  ar: {
    caption: "الأشخاص الذين يجيبون عن أسئلتك",
    heading: "الأسئلة الشائعة والدعم",
    description: "في قسم الأسئلة الشائعة ستجد إجابات عن أكثر ما يُسأل عنه، وطريقًا إلى شخص حقيقي لكل ما عدا ذلك.",
    items: [
      {
        question: "ما الذي نحصل عليه فعليًا: نظام تصميم أم نقطة انطلاق؟",
        answer:
          "الاثنان معًا. تحصل على البنية: المكوّنات، والحالات، ودعم RTL/LTR، والوضعين الفاتح والداكن. أما الشكل، أي الألوان والخطوط ونبرة التصميم، فأنت من يحدده.",
      },
      {
        question: "لماذا تصدرون نسخًا للمكوّنات بدل الملفات؟",
        answer: "لتأخذ إصلاحًا واحدًا دون أن تأخذ كل تغيير. لكل مكوّن نسخته، ويذكر سجل التغييرات ما تغيّر.",
      },
      {
        question: "هل الصور في الكتل مرخّصة؟",
        answer: "الصور في معايناتنا مرخّصة للمعاينات فقط. تأتي الكتل دون صور، فتضيف صورك أنت.",
      },
      {
        question: "هل يمكنني استبدال الصور بصوري؟",
        answer: "نعم. مرّر صورتك إلى الكتلة، ويحتفظ الإطار بحجمه وزواياه أيًّا كانت الصورة.",
      },
      {
        question: "هل توفّرون رسومًا توضيحية أيضًا؟",
        answer: "نعم. تأتي مع المكتبة مجموعة رسوم مرتبطة بألوان السمة، فتتبع الوضعين الفاتح والداكن.",
      },
    ],
    empty: "لا توجد أسئلة بعد.",
  },
}

export interface FaqMediaSplitProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqMediaSplitCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The photo. None by default: the frame shows a `muted` placeholder.
   * @default none: a `muted` placeholder
   */
  image?: FaqMediaSplitImage
  /** The items open at first, by `value`. The first item, by default. */
  defaultValue?: string[]
  /**
   * Lets several questions stay open at once.
   * @default false
   */
  multiple?: boolean
}

export function FaqMediaSplit({
  locale = "en",
  caption,
  heading,
  description,
  items,
  empty,
  image,
  defaultValue = ["0"],
  multiple,
  className,
  ...props
}: FaqMediaSplitProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items
  const chip = caption ?? copy.caption

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-6 md:gap-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="relative h-[260px] w-full shrink-0 overflow-hidden rounded-2xl bg-muted md:h-[380px] lg:h-[620px] lg:w-[560px]">
          {image ? (
            <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
          ) : null}
          {chip ? (
            <p className="absolute bottom-6 start-6 flex max-w-[calc(100%-3rem)] items-center gap-2 rounded-full bg-card px-4 py-2 text-xs font-medium text-foreground lg:bottom-5">
              <Headphones size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-3.5 shrink-0 text-primary" />
              {chip}
            </p>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <header className="flex flex-col gap-3">
            <h2 id={headingId} className="text-3xl font-semibold text-foreground lg:text-4xl">
              {heading ?? copy.heading}
            </h2>
            <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
          </header>

          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground">{empty ?? copy.empty}</p>
          ) : (
            <Accordion defaultValue={defaultValue} multiple={multiple}>
              {list.map((item, index) => (
                <AccordionItem key={item.value ?? index} value={item.value ?? String(index)}>
                  <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const faqMediaSplitCopy = COPY
