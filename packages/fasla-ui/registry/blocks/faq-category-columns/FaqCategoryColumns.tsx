"use client"

import * as React from "react"
import { ArrowUpRight, ChevronRight, CreditCard, Palette, Rocket } from "lucide-react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `FAQ` (42359:9029), Type=Category Columns.
 *
 * A heading over columns of topics, each a list of links to answers and a
 * link to every article in the topic. Three columns on Desktop, two on
 * Tablet, one on Mobile.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). Direction is the page's `dir`; every
 * side here is a logical one, and the two arrows turn to face the reading
 * direction.
 */

export interface FaqCategoryColumnsLink {
  label: React.ReactNode
  href: string
}

export interface FaqCategoryColumnsCategory {
  title: React.ReactNode
  /** An 18px icon before the title, a Lucide icon in Figma. */
  icon?: React.ReactNode
  links: FaqCategoryColumnsLink[]
  /** The link to every article in the topic. Hidden when either part is missing. */
  moreLabel?: React.ReactNode
  moreHref?: string
}

export interface FaqCategoryColumnsCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. */
  description: React.ReactNode
  /** The columns. Each category has a `title`, an optional `icon`, its `links` (each a `label` and an `href`), and an optional `moreLabel` and `moreHref` for its last link. */
  categories: FaqCategoryColumnsCategory[]
  /** Shown in place of the topics when `categories` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqCategoryColumnsCopy> = {
  en: {
    heading: "Browse answers by topic",
    description: "Every question we have been asked, grouped the way teams actually think about the library.",
    categories: [
      {
        title: "Getting started",
        icon: <Rocket size={18} strokeWidth={1.5} absoluteStrokeWidth />,
        links: [
          { label: "How do I add Fasla to my Figma team?", href: "#" },
          { label: "Which file do I open first?", href: "#" },
          { label: "How are components named?", href: "#" },
          { label: "What are the variable collections for?", href: "#" },
          { label: "Do I need Dev Mode?", href: "#" },
        ],
        moreLabel: "See all 18 articles",
        moreHref: "#",
      },
      {
        title: "Licensing & billing",
        icon: <CreditCard size={18} strokeWidth={1.5} absoluteStrokeWidth />,
        links: [
          { label: "What does a seat include?", href: "#" },
          { label: "Can I move a seat to a new designer?", href: "#" },
          { label: "Do you invoice annually?", href: "#" },
          { label: "Is VAT included in the price?", href: "#" },
          { label: "How do refunds work?", href: "#" },
        ],
        moreLabel: "See all 12 articles",
        moreHref: "#",
      },
      {
        title: "Theming & RTL",
        icon: <Palette size={18} strokeWidth={1.5} absoluteStrokeWidth />,
        links: [
          { label: "How do I retheme Fasla to my brand?", href: "#" },
          { label: "Where do dark-mode values live?", href: "#" },
          { label: "How do I switch a block to Arabic?", href: "#" },
          { label: "Do icons flip automatically?", href: "#" },
          { label: "Which type styles are RTL-safe?", href: "#" },
        ],
        moreLabel: "See all 21 articles",
        moreHref: "#",
      },
    ],
    empty: "No topics yet.",
  },
  ar: {
    heading: "تصفّح الإجابات حسب الموضوع",
    description: "كل سؤال طُرح علينا، مرتّب بالطريقة التي تفكّر بها الفرق فعليًا في المكتبة.",
    categories: [
      {
        title: "البداية",
        icon: <Rocket size={18} strokeWidth={1.5} absoluteStrokeWidth />,
        links: [
          { label: "كيف أضيف فاصلة إلى فريقي في Figma؟", href: "#" },
          { label: "أي ملف أفتح أولًا؟", href: "#" },
          { label: "كيف تُسمّى المكوّنات؟", href: "#" },
          { label: "ما وظيفة مجموعات المتغيّرات؟", href: "#" },
          { label: "هل أحتاج إلى Dev Mode؟", href: "#" },
        ],
        moreLabel: (
          <>
            عرض كل المقالات الـ<bdi dir="ltr">18</bdi>
          </>
        ),
        moreHref: "#",
      },
      {
        title: "التراخيص والفوترة",
        icon: <CreditCard size={18} strokeWidth={1.5} absoluteStrokeWidth />,
        links: [
          { label: "ماذا يشمل المقعد؟", href: "#" },
          { label: "هل يمكنني نقل مقعد إلى مصمّم جديد؟", href: "#" },
          { label: "هل تُصدرون فواتير سنوية؟", href: "#" },
          { label: "هل ضريبة القيمة المضافة مشمولة في السعر؟", href: "#" },
          { label: "كيف يتم استرداد المبالغ؟", href: "#" },
        ],
        moreLabel: (
          <>
            عرض كل المقالات الـ<bdi dir="ltr">12</bdi>
          </>
        ),
        moreHref: "#",
      },
      {
        title: "السمات واتجاه اليمين إلى اليسار",
        icon: <Palette size={18} strokeWidth={1.5} absoluteStrokeWidth />,
        links: [
          { label: "كيف أعيد تنسيق فاصلة لتناسب علامتي؟", href: "#" },
          { label: "أين توجد قيم الوضع الداكن؟", href: "#" },
          { label: "كيف أحوّل كتلة إلى العربية؟", href: "#" },
          { label: "هل تنعكس الأيقونات تلقائيًا؟", href: "#" },
          { label: "ما أنماط الخطوط المناسبة لاتجاه اليمين إلى اليسار؟", href: "#" },
        ],
        moreLabel: (
          <>
            عرض كل المقالات الـ<bdi dir="ltr">21</bdi>
          </>
        ),
        moreHref: "#",
      },
    ],
    empty: "لا توجد مواضيع بعد.",
  },
}

export interface FaqCategoryColumnsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<FaqCategoryColumnsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

const FOCUS = "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function FaqCategoryColumns({
  locale = "en",
  heading,
  description,
  categories,
  empty,
  className,
  ...props
}: FaqCategoryColumnsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = categories ?? copy.categories

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background px-4 py-8 md:px-6 md:py-16 lg:px-8 lg:py-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <header className="flex w-full max-w-[760px] flex-col gap-2">
          <h2 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
            {heading ?? copy.heading}
          </h2>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
        </header>

        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 md:gap-x-16 md:gap-y-8 lg:grid-cols-3">
            {list.map((category, index) => (
              <div key={index} className="flex min-w-0 flex-col items-start gap-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  {category.icon ? (
                    <span aria-hidden="true" className="flex shrink-0 text-primary [&>svg]:size-[18px]">
                      {category.icon}
                    </span>
                  ) : null}
                  {category.title}
                </h3>
                <ul className="flex w-full flex-col">
                  {category.links.map((link, i) => (
                    <li key={i} className="border-b border-border">
                      <a
                        href={link.href}
                        className={cn(
                          "group flex items-center justify-between gap-3 py-2.5 text-sm text-foreground",
                          FOCUS
                        )}
                      >
                        <span className="underline-offset-4 group-hover:underline">{link.label}</span>
                        <ArrowUpRight size={14} strokeWidth={1.5} absoluteStrokeWidth
                          aria-hidden="true"
                          className="size-3.5 shrink-0 text-muted-foreground [&:dir(rtl)]:-scale-x-100"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
                {category.moreLabel && category.moreHref ? (
                  <a
                    href={category.moreHref}
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline",
                      FOCUS
                    )}
                  >
                    {category.moreLabel}
                    <ChevronRight size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-3.5 shrink-0 [&:dir(rtl)]:-scale-x-100" />
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const faqCategoryColumnsCopy = COPY
