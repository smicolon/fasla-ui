"use client"

import * as React from "react"
import { Quote } from "lucide-react"
import { cn } from "../../../src/lib/utils"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Logo Quote Cards.
 *
 * A heading over a grid of outlined cards, each pairing one mark with a
 * one-line quote from that customer, all on an inverted band. The band is
 * painted with the inverse tokens, the only way Fasla inverts a surface: dark
 * in Light, light in Dark, never a forced `.dark` class. The theme-inverse
 * registry item maps the tokens. The marks are meant to be single-colour,
 * as Figma's Monochrome logos are: the slot is `foreground-inverse`, so a
 * mark drawn in `currentColor` follows the band.
 *
 * Three cards to a row on Desktop, two on Tablet, one on Mobile. Cards in a
 * row share their height, and the mark, quote glyph and quote stay at the
 * top of each, centred. The marks keep Figma's height per breakpoint (28,
 * 24 and 20px), never past their width cap.
 *
 * Mirroring comes from the page's `dir`: the heading moves to the start
 * side and the cards fill rows from it, in the same order. Marks and the
 * quote glyph are never flipped, as in Figma's RTL variants.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudLogoQuoteCardsLogo {
  /** The company's name. Screen readers read it; the mark itself is hidden from them. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its slot, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudLogoQuoteCardsItem {
  /** One line from the customer. Keep it unattributed unless the company said it. */
  quote: React.ReactNode
  /** The customer's mark, above the quote. Without one the slot shows a placeholder. */
  logo?: LogoCloudLogoQuoteCardsLogo
}

export interface LogoCloudLogoQuoteCardsCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when `null`. */
  description: React.ReactNode
  /** The cards, in reading order. Each has a `quote` and an optional `logo`: `{ name, logo }`. */
  quotes: LogoCloudLogoQuoteCardsItem[]
  /** Shown in place of the cards when `quotes` is empty. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. Figma's marks are added by the page: see `quotes`. */
const COPY: Record<"en" | "ar", LogoCloudLogoQuoteCardsCopy> = {
  en: {
    heading: "Customers",
    description: "Join the teams building their product systems with Fasla.",
    quotes: [
      { quote: "We shortened processes that used to take hours down to minutes." },
      { quote: "Our design team is measurably twice as efficient inside Fasla." },
      { quote: "Fasla helped us cut churn in the handoff stage almost entirely." },
      { quote: "We finally moved off five disconnected libraries onto one." },
      { quote: "I never have to rebuild the same table component again." },
      { quote: "Useful for our platform team while staying easy for everyone else." },
    ],
    empty: "No customer quotes yet.",
  },
  ar: {
    heading: "العملاء",
    description: "انضم إلى الفرق التي تبني أنظمة منتجاتها بفاصلة.",
    quotes: [
      { quote: "اختصرنا عمليات كانت تستغرق ساعات إلى دقائق." },
      { quote: "فريق التصميم لدينا أكثر كفاءة بمقدار الضعف داخل فاصلة." },
      { quote: "ساعدتنا فاصلة على الحدّ من الهدر في مرحلة التسليم بشكل شبه كامل." },
      { quote: "انتقلنا أخيرًا من خمس مكتبات متفرّقة إلى مكتبة واحدة." },
      { quote: "لم أعد مضطرًا لإعادة بناء مكوّن الجدول نفسه مرة أخرى." },
      { quote: "مفيد لفريق المنصة لدينا وسهل في الوقت نفسه على الجميع." },
    ],
    empty: "لا توجد اقتباسات من العملاء بعد.",
  },
}

export interface LogoCloudLogoQuoteCardsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudLogoQuoteCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function LogoCloudLogoQuoteCards({
  locale = "en",
  heading,
  description,
  quotes,
  empty,
  className,
  ...props
}: LogoCloudLogoQuoteCardsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const lead = description === undefined ? copy.description : description
  const list = quotes ?? copy.quotes

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background-inverse p-8 md:p-16 lg:p-24", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <header className="flex flex-col gap-2">
          <h2 id={headingId} className="text-2xl font-semibold text-foreground-inverse md:text-3xl lg:text-4xl">
            {heading ?? copy.heading}
          </h2>
          {lead ? <p className="text-base text-muted-foreground-inverse">{lead}</p> : null}
        </header>

        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground-inverse">{empty ?? copy.empty}</p>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((item, index) => (
              <li key={index}>
                <figure className="flex h-full flex-col items-center gap-5 rounded-lg border border-muted-foreground-inverse p-8 text-center">
                  {/* The company, read before its quote; the mark itself is hidden. */}
                  {item.logo ? <figcaption className="sr-only">{item.logo.name}</figcaption> : null}
                  {item.logo ? (
                    <span
                      aria-hidden="true"
                      className="flex h-5 max-w-[88px] items-center justify-center text-foreground-inverse md:h-6 md:max-w-[100px] lg:h-7 lg:max-w-[110px] [&>*]:h-full [&>*]:w-auto [&>*]:max-w-full [&>img]:object-contain"
                    >
                      {item.logo.logo}
                    </span>
                  ) : (
                    // On the inverted band a `muted` bar would glare, so the
                    // placeholder is the band's own muted text colour, faded.
                    <span aria-hidden="true" className="h-5 w-[72px] rounded-md bg-muted-foreground-inverse opacity-30 md:h-6 md:w-20 lg:h-7 lg:w-24" />
                  )}
                  <Quote aria-hidden="true" size={16} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0 text-muted-foreground-inverse" />
                  <blockquote className="text-sm text-muted-foreground-inverse">{item.quote}</blockquote>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const logoCloudLogoQuoteCardsCopy = COPY
