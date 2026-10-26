"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Logo Cloud` (42806:232717), Type=Named Integration Cards.
 *
 * A centred heading and line of text, then a grid of cards: each one a mark,
 * the company's name under it and a line on what the integration does. A
 * closing line and a button close the section.
 *
 * The name on each card is the mark's own `name`, so the block never spells
 * out a brand: pass each integration its `logo`, and until then the card
 * shows `muted` placeholders where the mark and the name go.
 *
 * One column on a phone, two from Tablet and four at Desktop. Cards keep
 * their own height, as Figma's do, so a row's cards share a top edge but
 * not a bottom one. On a phone the button spans the column.
 *
 * Each card's content starts at the start edge, so in Arabic it sits on the
 * right; the header and footer are centred in both directions. The marks
 * are never mirrored.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440).
 */

export interface LogoCloudNamedIntegrationCardsLogo {
  /** The company's name, shown as the card's title. The mark itself is hidden from screen readers. */
  name: string
  /** The mark: an `svg` or an `img`. The block sizes it to its slot, keeping its proportions. */
  logo: React.ReactNode
}

export interface LogoCloudNamedIntegrationCardsIntegration {
  /** What the integration does, in one line. */
  description: React.ReactNode
  /** The company's mark and name. Without it, the card shows `muted` placeholders in their place. */
  logo?: LogoCloudNamedIntegrationCardsLogo
}

export interface LogoCloudNamedIntegrationCardsAction {
  label: React.ReactNode
  href: string
}

export interface LogoCloudNamedIntegrationCardsCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line of text under the heading. Hidden when null. */
  description: React.ReactNode
  /** The cards, in order. Each has a `description` and the `logo` it describes. */
  integrations: LogoCloudNamedIntegrationCardsIntegration[]
  /** The line above the button. Hidden when null. */
  closing: React.ReactNode
  /** The solid button under the cards: where the full list lives. Hidden when null. */
  action: LogoCloudNamedIntegrationCardsAction | null
}

/** Figma's copy, English and Arabic. No integration carries a mark: pass them in `integrations`. */
const COPY: Record<"en" | "ar", LogoCloudNamedIntegrationCardsCopy> = {
  en: {
    heading: "Integrated like no other tool",
    description: "Bring the tools your team already relies on straight into Fasla.",
    integrations: [
      { description: "Live product metrics beside every spec" },
      { description: "Two-way sync for shapes and tokens" },
      { description: "Shipment tracking pinned to release notes" },
      { description: "Command-palette search across all files" },
      { description: "People data mapped to project roles" },
      { description: "Field notes captured straight into tickets" },
      { description: "Award-winning audit trail for every change" },
      { description: "Growth dashboards embedded in reviews" },
    ],
    closing: "Choose from hundreds more in the Fasla integrations gallery.",
    action: { label: "Explore integrations", href: "#integrations" },
  },
  ar: {
    heading: "تكامل لا تجده في أي أداة أخرى",
    description: "اجلب الأدوات التي يعتمد عليها فريقك مباشرة إلى فاصلة.",
    integrations: [
      { description: "مؤشرات منتج حيّة بجانب كل مواصفة" },
      { description: "مزامنة ثنائية الاتجاه للأشكال والرموز" },
      { description: "تتبّع الشحنات مثبّت على ملاحظات الإصدار" },
      { description: "بحث بلوحة الأوامر عبر جميع الملفات" },
      { description: "بيانات الأفراد مرتبطة بأدوار المشروع" },
      { description: "ملاحظات ميدانية تُسجَّل مباشرة في التذاكر" },
      { description: "سجل تدقيق حائز على جوائز لكل تغيير" },
      { description: "لوحات نمو مدمجة في المراجعات" },
    ],
    closing: "اختر من مئات أخرى في معرض تكاملات فاصلة.",
    action: { label: "استكشف التكاملات", href: "#integrations" },
  },
}

/** Arabic letters. A name without any is Latin, and keeps Geist in Arabic, as Figma sets it. */
const ARABIC = /[\u0600-\u06FF]/

export interface LogoCloudNamedIntegrationCardsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<LogoCloudNamedIntegrationCardsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function LogoCloudNamedIntegrationCards({
  locale = "en",
  heading,
  description,
  integrations,
  closing,
  action,
  className,
  ...props
}: LogoCloudNamedIntegrationCardsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const text = description === undefined ? copy.description : description
  const list = integrations ?? copy.integrations
  const footnote = closing === undefined ? copy.closing : closing
  const button = action === undefined ? copy.action : action

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12">
        <header className="flex flex-col gap-3 text-center">
          <h2 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl lg:text-3xl">
            {heading ?? copy.heading}
          </h2>
          {text ? <p className="text-base text-muted-foreground">{text}</p> : null}
        </header>

        {list.length > 0 ? (
          <ul className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-4">
            {list.map((integration, index) => (
              <li key={index} className="flex flex-col gap-4 rounded-lg bg-card p-6 ring-1 ring-inset ring-border forced-colors:border">
                {integration.logo ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="flex h-5 max-w-[88px] items-center text-muted-foreground md:h-6 md:max-w-[100px] lg:h-7 lg:max-w-[110px] [&>*]:h-full [&>*]:w-auto [&>*]:max-w-full [&>img]:object-contain"
                    >
                      {integration.logo.logo}
                    </span>
                    {ARABIC.test(integration.logo.name) ? (
                      <h3 className="text-base font-semibold text-card-foreground">{integration.logo.name}</h3>
                    ) : (
                      <h3 className="font-sans text-base font-semibold leading-6 text-card-foreground">
                        <bdi dir="ltr">{integration.logo.name}</bdi>
                      </h3>
                    )}
                  </>
                ) : (
                  <>
                    <span aria-hidden="true" className="h-5 w-[72px] rounded-md bg-muted md:h-6 md:w-20 lg:h-7 lg:w-24" />
                    <span aria-hidden="true" className="h-6 w-20 rounded-md bg-muted" />
                  </>
                )}
                <p className="text-sm text-muted-foreground">{integration.description}</p>
              </li>
            ))}
          </ul>
        ) : null}

        {footnote || button ? (
          <footer className="flex flex-col items-center gap-3 text-center">
            {footnote ? <p className="text-sm text-muted-foreground">{footnote}</p> : null}
            {button ? (
              <a href={button.href} className={buttonVariants({ className: "w-full md:w-auto" })}>
                {button.label}
              </a>
            ) : null}
          </footer>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const logoCloudNamedIntegrationCardsCopy = COPY
