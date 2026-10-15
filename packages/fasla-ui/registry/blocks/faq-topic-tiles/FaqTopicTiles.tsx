"use client"

import * as React from "react"
import { CodeIcon, CreditCardIcon, FileTextIcon, LanguagesIcon, LayersIcon, ListIcon, PaletteIcon, RocketIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `FAQ` (42359:9029), Type=Topic Tiles.
 *
 * A centred header over a grid of knowledge-base areas. Each tile is one link
 * to its area: an icon in a `muted` box, the area's name and summary, and how
 * many categories and articles it holds. Three columns on Desktop, two on
 * Tablet, one on Mobile.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface FaqTopicTilesTile {
  /** A 20px icon, usually a lucide icon. */
  icon?: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
  /** How many categories the area holds, as written: "17 categories". */
  categories?: React.ReactNode
  /** How many articles the area holds, as written: "195 articles". */
  articles?: React.ReactNode
  href: string
}

export interface FaqTopicTilesCopy {
  heading: React.ReactNode
  description: React.ReactNode
  tiles: FaqTopicTilesTile[]
  /** Shown in place of the tiles when `tiles` is empty. */
  empty: React.ReactNode
}

const ICONS = {
  start: <RocketIcon aria-hidden="true" />,
  using: <LayersIcon aria-hidden="true" />,
  theming: <PaletteIcon aria-hidden="true" />,
  rtl: <LanguagesIcon aria-hidden="true" />,
  handoff: <CodeIcon aria-hidden="true" />,
  billing: <CreditCardIcon aria-hidden="true" />,
}

/** A count inside Arabic text, kept left to right. */
const n = (value: number) => <bdi dir="ltr">{value}</bdi>

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", FaqTopicTilesCopy> = {
  en: {
    heading: "Browse the knowledge base",
    description: "Six areas, every answer we have written, kept current with each release.",
    tiles: [
      {
        icon: ICONS.start,
        title: "Getting started",
        description: "Enable the library, read the token collections and place your first block.",
        categories: "17 categories",
        articles: "195 articles",
        href: "#getting-started",
      },
      {
        icon: ICONS.using,
        title: "Using Fasla",
        description: "Work day to day with components, blocks, variants and overrides.",
        categories: "21 categories",
        articles: "228 articles",
        href: "#using-fasla",
      },
      {
        icon: ICONS.theming,
        title: "Theming",
        description: "Retheme colour, radius and type without touching a single component.",
        categories: "8 categories",
        articles: "64 articles",
        href: "#theming",
      },
      {
        icon: ICONS.rtl,
        title: "RTL & Arabic",
        description: "Mirror layouts, swap type styles and decide which icons should flip.",
        categories: "7 categories",
        articles: "52 articles",
        href: "#rtl",
      },
      {
        icon: ICONS.handoff,
        title: "Handoff",
        description: "Dev Mode, Code Connect and mapping variables to Tailwind.",
        categories: "9 categories",
        articles: "88 articles",
        href: "#handoff",
      },
      {
        icon: ICONS.billing,
        title: "Account & billing",
        description: "Seats, invoices, renewals and everything the finance team asks.",
        categories: "6 categories",
        articles: "41 articles",
        href: "#billing",
      },
    ],
    empty: "No topics yet.",
  },
  ar: {
    heading: "تصفّح قاعدة المعرفة",
    description: "ستة مجالات تضمّ كل إجابة كتبناها، ومحدَّثة مع كل إصدار.",
    tiles: [
      {
        icon: ICONS.start,
        title: "البداية",
        description: "فعّل المكتبة، واقرأ مجموعات الرموز، وضع أول كتلة لك.",
        categories: <>{n(17)} فئة</>,
        articles: <>{n(195)} مقالًا</>,
        href: "#getting-started",
      },
      {
        icon: ICONS.using,
        title: "استخدام فاصلة",
        description: "العمل اليومي مع المكوّنات والكتل والنسخ والتجاوزات.",
        categories: <>{n(21)} فئة</>,
        articles: <>{n(228)} مقالًا</>,
        href: "#using-fasla",
      },
      {
        icon: ICONS.theming,
        title: "السمات",
        description: "أعد تنسيق اللون ونصف القطر والخط دون المساس بأي مكوّن.",
        categories: <>{n(8)} فئات</>,
        articles: <>{n(64)} مقالًا</>,
        href: "#theming",
      },
      {
        icon: ICONS.rtl,
        title: "العربية واتجاه اليمين",
        description: "اعكس التخطيطات، وبدّل أنماط الخطوط، وحدّد الأيقونات التي ينبغي قلبها.",
        categories: <>{n(7)} فئات</>,
        articles: <>{n(52)} مقالًا</>,
        href: "#rtl",
      },
      {
        icon: ICONS.handoff,
        title: "التسليم",
        description: "Dev Mode، Code Connect، ومقابلة المتغيّرات بأصناف Tailwind.",
        categories: <>{n(9)} فئات</>,
        articles: <>{n(88)} مقالًا</>,
        href: "#handoff",
      },
      {
        icon: ICONS.billing,
        title: "الحساب والفوترة",
        description: "المقاعد والفواتير والتجديدات وكل ما يسأل عنه فريق المالية.",
        categories: <>{n(6)} فئات</>,
        articles: <>{n(41)} مقالًا</>,
        href: "#billing",
      },
    ],
    empty: "لا توجد مواضيع بعد.",
  },
}

export interface FaqTopicTilesProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FaqTopicTilesCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function FaqTopicTiles({
  locale = "en",
  heading,
  description,
  tiles,
  empty,
  className,
  ...props
}: FaqTopicTilesProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = tiles ?? copy.tiles

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

        {list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <ul className="grid w-full max-w-[1152px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((tile, index) => (
              <li key={index} className="flex">
                <a
                  href={tile.href}
                  className={cn(
                    "flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-6 [outline:none]",
                    "transition-colors hover:bg-accent motion-reduce:transition-none",
                    "focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  )}
                >
                  {tile.icon && (
                    <span
                      aria-hidden="true"
                      className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-muted text-primary [&_svg]:size-5"
                    >
                      {tile.icon}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-foreground">{tile.title}</h3>
                  <span className="text-sm text-muted-foreground">{tile.description}</span>
                  {(tile.categories || tile.articles) && (
                    <span className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 text-xs text-muted-foreground [&_svg]:size-3.5 [&_svg]:shrink-0">
                      {tile.categories && (
                        <span className="flex items-center gap-1.5">
                          <ListIcon aria-hidden="true" />
                          {tile.categories}
                        </span>
                      )}
                      {tile.articles && (
                        <span className="flex items-center gap-1.5">
                          <FileTextIcon aria-hidden="true" />
                          {tile.articles}
                        </span>
                      )}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
