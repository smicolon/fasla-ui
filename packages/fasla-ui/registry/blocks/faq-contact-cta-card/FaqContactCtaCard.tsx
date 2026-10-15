"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"
import { Avatar } from "../../ui/avatar/avatar"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `FAQ` (42359:9029), Type=Contact CTA Card.
 *
 * A centred column of questions, closed by a muted card that hands the reader
 * to a person: the support team's faces, a short promise and two actions.
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). Direction is the page's `dir`; every
 * side here is a logical one, so the avatars overlap the same way the text
 * reads.
 */

export interface FaqContactCtaCardItem {
  question: React.ReactNode
  answer: React.ReactNode
  /** Identifies the item for `defaultValue`. Defaults to its index, as a string. */
  value?: string
}

export interface FaqContactCtaCardPerson {
  /** The person's name: the photo's alt text, and the initials shown without a photo. */
  name: string
  /** A photo. Without one, the avatar shows the name's initials. */
  src?: string
}

export interface FaqContactCtaCardAction {
  label: React.ReactNode
  href: string
}

export interface FaqContactCtaCardCopy {
  heading: React.ReactNode
  items: FaqContactCtaCardItem[]
  /** Shown in place of the questions when `items` is empty. */
  empty: React.ReactNode
  /** The support team shown on the card. No photos by default: pass your own. */
  people: FaqContactCtaCardPerson[]
  ctaTitle: React.ReactNode
  ctaDescription: React.ReactNode
  /** The solid button. */
  primaryAction: FaqContactCtaCardAction
  /** The outline button beside it. */
  secondaryAction: FaqContactCtaCardAction
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqContactCtaCardCopy> = {
  en: {
    heading: "Frequently asked questions",
    items: [
      {
        question: "How do I know Fasla is qualified for my product?",
        answer:
          "We build and maintain the system used across our own products, and the file ships with the same tests we run internally: token coverage, contrast checks and a live changelog you can audit before you buy.",
      },
      {
        question: "How can I become a Fasla partner?",
        answer:
          "Agencies and studios that ship with Fasla can apply through the partner form. Partners get early access to new blocks and a listing in our directory.",
      },
      {
        question: "Do you take on custom design-system work?",
        answer:
          "Yes, for a few teams each quarter. We extend Fasla to your brand, then hand over a file and a codebase your team can keep running.",
      },
      {
        question: "Can I hire your team for a workshop?",
        answer:
          "Yes. We run half-day and full-day workshops on tokens, RTL layouts and handoff, remotely or on site.",
      },
      {
        question: "Is there a community I can join?",
        answer: "Yes. Our community channel is open to every licence holder, with release notes, office hours and a place to ask for components.",
      },
    ],
    empty: "No questions yet.",
    people: [{ name: "Layla Haddad" }, { name: "Omar Khalil" }, { name: "Sara Mansour" }],
    ctaTitle: "Still have questions?",
    ctaDescription: "Our team answers every message personally — usually within one business day.",
    primaryAction: { label: "Get in touch", href: "#contact" },
    secondaryAction: { label: "Read the docs", href: "#docs" },
  },
  ar: {
    heading: "الأسئلة الأكثر شيوعًا",
    items: [
      {
        question: "كيف أتأكد أن فاصلة مناسبة لمنتجي؟",
        answer:
          "نحن نبني النظام ونصونه ونستخدمه في منتجاتنا، ويأتي الملف بالاختبارات نفسها التي نجريها داخليًا: تغطية الرموز، وفحوص التباين، وسجلّ تغييرات حيّ يمكنك مراجعته قبل الشراء.",
      },
      {
        question: "كيف أصبح شريكًا لفاصلة؟",
        answer:
          "يمكن للوكالات والاستوديوهات التي تعمل بفاصلة التقدّم عبر نموذج الشركاء. يحصل الشركاء على وصول مبكر إلى الكتل الجديدة وعلى إدراج في دليلنا.",
      },
      {
        question: "هل تنفّذون أعمال أنظمة تصميم مخصّصة؟",
        answer: "نعم، لعدد قليل من الفرق كل ربع سنة. نوسّع فاصلة لتناسب علامتك، ثم نسلّمك ملفًا وشيفرة يستطيع فريقك مواصلة العمل عليهما.",
      },
      {
        question: "هل يمكنني الاستعانة بفريقكم لورشة عمل؟",
        answer: "نعم. نقدّم ورش عمل لنصف يوم أو يوم كامل عن الرموز وتخطيطات اليمين إلى اليسار والتسليم، عن بُعد أو في مقرّكم.",
      },
      {
        question: "هل يوجد مجتمع يمكنني الانضمام إليه؟",
        answer: "نعم. قناة مجتمعنا مفتوحة لكل حاملي التراخيص، وفيها ملاحظات الإصدارات وساعات مكتبية ومكان لطلب المكوّنات.",
      },
    ],
    empty: "لا توجد أسئلة بعد.",
    people: [{ name: "ليلى حداد" }, { name: "عمر خليل" }, { name: "سارة منصور" }],
    ctaTitle: "ما زالت لديك أسئلة؟",
    ctaDescription: "يجيب فريقنا عن كل رسالة شخصيًا، عادةً خلال يوم عمل واحد.",
    primaryAction: { label: "تواصل معنا", href: "#contact" },
    secondaryAction: { label: "اقرأ التوثيق", href: "#docs" },
  },
}

export interface FaqContactCtaCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqContactCtaCardCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The items open at first, by `value`. The first item, by default. */
  defaultValue?: string[]
  /** Lets several questions stay open at once. */
  multiple?: boolean
}

export function FaqContactCtaCard({
  locale = "en",
  heading,
  items,
  empty,
  people,
  ctaTitle,
  ctaDescription,
  primaryAction,
  secondaryAction,
  defaultValue = ["0"],
  multiple,
  className,
  ...props
}: FaqContactCtaCardProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items
  const team = people ?? copy.people
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction ?? copy.secondaryAction

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-12">
        <h2 id={headingId} className="w-full max-w-[760px] text-center text-3xl font-semibold text-foreground lg:text-4xl">
          {heading ?? copy.heading}
        </h2>

        {list.length === 0 ? (
          <p className="w-full max-w-[800px] text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <Accordion className="w-full max-w-[800px]" defaultValue={defaultValue} multiple={multiple}>
            {list.map((item, index) => (
              <AccordionItem key={item.value ?? index} value={item.value ?? String(index)}>
                <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        <div className="flex w-full max-w-[1024px] flex-col items-center gap-4 rounded-xl bg-muted p-12 text-center">
          {team.length > 0 && (
            <ul className="flex [&>li+li]:-ms-3">
              {team.map((person, index) => (
                <li key={index}>
                  <Avatar
                    src={person.src}
                    name={person.name}
                    radius="rounded"
                    border
                    className="size-12"
                  />
                </li>
              ))}
            </ul>
          )}
          <h3 className="text-xl font-semibold text-foreground md:text-2xl">{ctaTitle ?? copy.ctaTitle}</h3>
          <p className="text-base text-muted-foreground">{ctaDescription ?? copy.ctaDescription}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {/* Links styled as buttons with the Button's own classes, not
                Button asChild: the shadcn CLI rewrites asChild for Base UI
                projects, which Fasla's Button doesn't take. */}
            <a href={primary.href} className={buttonVariants()}>
              {primary.label}
            </a>
            <a href={secondary.href} className={buttonVariants({ variant: "outline" })}>
              {secondary.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
