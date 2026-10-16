"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Error State` (42556:548), Type=Sitemap Columns.
 *
 * The error code and a line beside two ways out, a hairline, then the whole
 * site in four columns of links: four across on Desktop, two by two on
 * Tablet and Mobile. Mobile first: the base classes are Figma's Mobile (360),
 * `md:` its Tablet (768) and `lg:` its Desktop (1440). Direction is the
 * page's `dir`; every side is a logical one, so the header and the columns
 * mirror in Arabic.
 */

export interface ErrorStateSitemapColumnsAction {
  label: React.ReactNode
  href: string
}

export interface ErrorStateSitemapColumnsLink {
  label: React.ReactNode
  href: string
}

export interface ErrorStateSitemapColumnsColumn {
  /** The column's label, an `h2`. */
  title: React.ReactNode
  links: ErrorStateSitemapColumnsLink[]
}

export interface ErrorStateSitemapColumnsCopy {
  /** The status code in display type: the page's heading, an `h1`. */
  code: React.ReactNode
  /** The line under the code: what happened and what follows. */
  description: React.ReactNode
  /** The solid button: the way out, usually home. */
  primaryAction: ErrorStateSitemapColumnsAction
  /** The outline button beside it. Hidden when null. */
  secondaryAction: ErrorStateSitemapColumnsAction | null
  /** Names the columns' navigation landmark for screen readers. */
  sitemapLabel: string
  /** The columns of links, in reading order. Hidden, with the hairline, when the list is empty. */
  columns: ErrorStateSitemapColumnsColumn[]
}

const links = (labels: string[], hrefs: string[]) => labels.map((label, index) => ({ label, href: hrefs[index] ?? "#" }))
const PRODUCT = ["#overview", "#features", "#integrations", "#pricing", "#changelog"]
const RESOURCES = ["#docs", "#api", "#guides", "#templates", "#community"]
const COMPANY = ["#about", "#customers", "#careers", "#journal", "#press"]
const SUPPORT = ["#help", "#status", "#support", "#security", "#accessibility"]

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateSitemapColumnsCopy> = {
  en: {
    code: "404",
    description: "We couldn’t find that page — but here is everything else.",
    primaryAction: { label: "Back to home", href: "/" },
    secondaryAction: { label: "Report a broken link", href: "#report" },
    sitemapLabel: "Sitemap",
    columns: [
      { title: "PRODUCT", links: links(["Overview", "Features", "Integrations", "Pricing", "Changelog"], PRODUCT) },
      { title: "RESOURCES", links: links(["Documentation", "API reference", "Guides", "Templates", "Community"], RESOURCES) },
      { title: "COMPANY", links: links(["About Fasla", "Customers", "Careers", "Journal", "Press kit"], COMPANY) },
      {
        title: "SUPPORT",
        links: links(["Help centre", "System status", "Contact support", "Security", "Accessibility"], SUPPORT),
      },
    ],
  },
  ar: {
    code: "404",
    description: "لم نتمكن من العثور على تلك الصفحة. لكن إليك كل الصفحات الأخرى.",
    primaryAction: { label: "العودة إلى الرئيسية", href: "/" },
    secondaryAction: { label: "أبلغ عن رابط معطل", href: "#report" },
    sitemapLabel: "خريطة الموقع",
    columns: [
      { title: "المنتج", links: links(["نظرة عامة", "المزايا", "التكاملات", "الأسعار", "سجل التغييرات"], PRODUCT) },
      {
        title: "الموارد",
        links: [
          { label: "التوثيق", href: "#docs" },
          {
            label: (
              <>
                مرجع <bdi dir="ltr">API</bdi>
              </>
            ),
            href: "#api",
          },
          ...links(["الأدلة", "القوالب", "المجتمع"], RESOURCES.slice(2)),
        ],
      },
      { title: "الشركة", links: links(["عن فاصلة", "العملاء", "الوظائف", "المدونة", "الملف الصحفي"], COMPANY) },
      { title: "الدعم", links: links(["مركز المساعدة", "حالة النظام", "تواصل مع الدعم", "الأمان", "إمكانية الوصول"], SUPPORT) },
    ],
  },
}

export interface ErrorStateSitemapColumnsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateSitemapColumnsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function ErrorStateSitemapColumns({
  locale = "en",
  code,
  description,
  primaryAction,
  secondaryAction,
  sitemapLabel,
  columns,
  className,
  ...props
}: ErrorStateSitemapColumnsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const list = columns ?? copy.columns

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="flex flex-col gap-3 lg:max-w-[600px]">
            <h1 id={headingId} className="text-4xl font-semibold text-destructive md:text-5xl lg:text-6xl">
              {code ?? copy.code}
            </h1>
            <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={primary.href} className={buttonVariants()}>
              {primary.label}
            </a>
            {secondary ? (
              <a href={secondary.href} className={buttonVariants({ variant: "outline" })}>
                {secondary.label}
              </a>
            ) : null}
          </div>
        </header>

        {list.length > 0 ? (
          <>
            <hr className="h-px border-0 bg-border" />
            <nav aria-label={sitemapLabel ?? copy.sitemapLabel}>
              <div className="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
                {list.map((column, index) => (
                  <ColumnLinks key={index} column={column} />
                ))}
              </div>
            </nav>
          </>
        ) : null}
      </div>
    </section>
  )
}

function ColumnLinks({ column }: { column: ErrorStateSitemapColumnsColumn }) {
  const titleId = React.useId()
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <h2 id={titleId} className="text-xs font-medium text-muted-foreground">
        {column.title}
      </h2>
      <ul aria-labelledby={titleId} className="flex flex-col gap-3 text-sm">
        {column.links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="rounded-sm text-foreground underline-offset-4 [outline:none] hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStateSitemapColumnsCopy = COPY
