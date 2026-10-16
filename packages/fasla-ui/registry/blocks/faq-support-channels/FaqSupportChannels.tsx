"use client"

import * as React from "react"
import { MailIcon, MessageCircleIcon, PhoneIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"

/*
 * Figma: `FAQ` (42359:9029), Type=Support Channels.
 *
 * The ways to reach a person first, as three cards, then the questions people
 * ask most. Mobile first: the base classes are Figma's Mobile (360), where the
 * cards stack; `md:` is its Tablet (768), two cards a row; `lg:` its Desktop
 * (1440), three. Direction is the page's `dir`; every side here is a logical
 * one.
 */

export interface FaqSupportChannelsItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqSupportChannelsChannel {
  /** A 20px icon. Lucide's message-circle, mail and phone by default. */
  icon?: React.ReactNode
  title: React.ReactNode
  /** The line under the title: hours, an address, what to book. */
  detail: React.ReactNode
  /** The small print under it. */
  note: React.ReactNode
  /** Makes the whole card a link: a chat page, `mailto:`, a booking page. */
  href?: string
}

export interface FaqSupportChannelsCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. */
  description: React.ReactNode
  /** The ways to reach support, as cards. Each has a `title`, a `detail` (an address or hours), a `note`, and an optional `icon`, and an `href` that makes the whole card a link. */
  channels: FaqSupportChannelsChannel[]
  /** The heading over the questions, below the channels. */
  questionsHeading: React.ReactNode
  /** The questions, in order. Each item has a `question`, an `answer` and an optional `value` that `defaultValue` opens it by. */
  items: FaqSupportChannelsItem[]
  /** Shown in place of the questions when `items` is empty. */
  empty: React.ReactNode
}

/** Lucide at Figma's 1.5px stroke, measured at the 20px it is drawn. */
const icon = (Icon: typeof MailIcon) => <Icon aria-hidden="true" size={20} strokeWidth={1.5} absoluteStrokeWidth />

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqSupportChannelsCopy> = {
  en: {
    heading: "Get in touch",
    description: "Choose how you would like to reach us.",
    channels: [
      {
        icon: icon(MessageCircleIcon),
        title: "Live chat",
        detail: "Mon–Fri, 09:00–18:00 GST",
        note: "Typically replies in 4 min",
      },
      {
        icon: icon(MailIcon),
        title: "Email us",
        detail: "support@example.com",
        note: "One business day, always a person",
        href: "mailto:support@example.com",
      },
      {
        icon: icon(PhoneIcon),
        title: "Request a call",
        detail: "Book a 20-minute slot",
        note: "Screen-share and file review",
      },
    ],
    questionsHeading: "Top FAQs",
    items: [
      {
        question: "What is your pricing model?",
        answer: "One price per editor seat, billed monthly or yearly. Viewers and developers are free.",
      },
      {
        question: "Are there live or recorded walkthroughs?",
        answer: "Both. We run a live walkthrough every other Tuesday, and the recordings are in the help centre.",
      },
      {
        question: "How is a seat counted across brands?",
        answer: "A seat belongs to a person, not a brand. One designer working on three brands uses one seat.",
      },
      {
        question: "Do you offer paid onboarding?",
        answer: "Yes. A two-week onboarding sets up your tokens, maps your components and trains your team.",
      },
    ],
    empty: "No questions yet.",
  },
  ar: {
    heading: "تواصل معنا",
    description: "اختر الطريقة التي تفضّلها للتواصل معنا.",
    channels: [
      {
        icon: icon(MessageCircleIcon),
        title: "الدردشة المباشرة",
        detail: (
          <>
            الاثنين إلى الجمعة، <bdi dir="ltr">09:00–18:00</bdi> بتوقيت الخليج
          </>
        ),
        note: (
          <>
            يردّ عادةً خلال <bdi dir="ltr">4</bdi> دقائق
          </>
        ),
      },
      {
        icon: icon(MailIcon),
        title: "راسلنا بالبريد",
        detail: <bdi dir="ltr">support@example.com</bdi>,
        note: "يوم عمل واحد، ودائمًا شخص حقيقي",
        href: "mailto:support@example.com",
      },
      {
        icon: icon(PhoneIcon),
        title: "اطلب مكالمة",
        detail: (
          <>
            احجز موعدًا مدته <bdi dir="ltr">20</bdi> دقيقة
          </>
        ),
        note: "مشاركة الشاشة ومراجعة الملف",
      },
    ],
    questionsHeading: "أبرز الأسئلة الشائعة",
    items: [
      {
        question: "ما نموذج التسعير لديكم؟",
        answer: "سعر واحد لكل مقعد تحرير، يُدفع شهريًا أو سنويًا. المشاهدون والمطوّرون مجانيون.",
      },
      {
        question: "هل توجد جولات تعريفية مباشرة أو مسجّلة؟",
        answer: "كلاهما. نقدّم جولة مباشرة كل أسبوعين يوم الثلاثاء، وتجد التسجيلات في مركز المساعدة.",
      },
      {
        question: "كيف يُحتسب المقعد عبر عدة علامات؟",
        answer: "المقعد لشخص لا لعلامة. المصمم الذي يعمل على ثلاث علامات يستخدم مقعدًا واحدًا.",
      },
      {
        question: "هل تقدّمون تهيئة مدفوعة؟",
        answer: "نعم. تهيئة لمدة أسبوعين نضبط فيها رموزك، ونربط مكوّناتك، وندرّب فريقك.",
      },
    ],
    empty: "لا توجد أسئلة بعد.",
  },
}

export interface FaqSupportChannelsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqSupportChannelsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The items open at first, by `value`. None, by default. */
  defaultValue?: string[]
  /**
   * Lets several questions stay open at once.
   * @default false
   */
  multiple?: boolean
}

export function FaqSupportChannels({
  locale = "en",
  heading,
  description,
  channels,
  questionsHeading,
  items,
  empty,
  defaultValue = [],
  multiple,
  className,
  ...props
}: FaqSupportChannelsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const questionsId = React.useId()
  const list = items ?? copy.items
  const cards = channels ?? copy.channels

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-12">
        <header className="flex w-full max-w-[720px] flex-col gap-2 text-center">
          <h2 id={headingId} className="text-3xl font-semibold text-foreground lg:text-4xl">
            {heading ?? copy.heading}
          </h2>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
        </header>

        {cards.length > 0 && (
          <ul className="grid w-full max-w-[1024px] gap-6 md:grid-cols-2 md:gap-x-5 md:gap-y-8 lg:grid-cols-3 lg:gap-5">
            {cards.map((channel, index) => (
              <li
                key={index}
                className={cn(
                  "relative flex flex-col gap-3 rounded-xl border border-border bg-card p-6",
                  channel.href && "transition-colors hover:bg-accent focus-within:ring-2 focus-within:ring-ring focus-within:forced-colors:outline focus-within:forced-colors:outline-2"
                )}
              >
                {channel.icon && (
                  <span className="flex size-10 items-center justify-center rounded-md bg-muted text-foreground">
                    {channel.icon}
                  </span>
                )}
                <h3 className="text-lg font-semibold text-foreground">
                  {channel.href ? (
                    // The link's box covers the card, so the whole card is one target.
                    <a href={channel.href} className="[outline:none] after:absolute after:inset-0 after:rounded-xl">
                      {channel.title}
                    </a>
                  ) : (
                    channel.title
                  )}
                </h3>
                <p className="text-sm font-medium text-foreground">{channel.detail}</p>
                <p className="text-xs text-muted-foreground">{channel.note}</p>
              </li>
            ))}
          </ul>
        )}

        <div className="flex w-full max-w-[800px] flex-col gap-4 pt-8">
          <h3 id={questionsId} className="text-lg font-semibold text-foreground md:text-xl">
            {questionsHeading ?? copy.questionsHeading}
          </h3>
          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground">{empty ?? copy.empty}</p>
          ) : (
            <Accordion aria-labelledby={questionsId} defaultValue={defaultValue} multiple={multiple}>
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
export const faqSupportChannelsCopy = COPY
