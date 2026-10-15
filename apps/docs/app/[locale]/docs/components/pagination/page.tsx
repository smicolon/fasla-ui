"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  type PaginationProps,
} from "@fasla-ui/ui/pagination"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const VARIANTS = ["default", "solid", "outlined"] as const
const SIZES = ["xs", "sm", "md", "lg"] as const

/** Figma's four pages, with 2 current; or the long range 1 … 5 6 7 … 20, with 6 current. */
const SHORT = { pages: [1, 2, 3, 4], current: 2 }
const LONG = { pages: [1, null, 5, 6, 7, null, 20], current: 6 }
/** The long range on a phone: the current page alone between the ellipses. */
const LONG_PHONE = { pages: [1, null, 6, null, 20], current: 6 }
/** Two pages, so a labelled row fits a phone. */
const TWO = { pages: [1, 2], current: 2 }

type Range = { pages: (number | null)[]; current: number }
type RowOptions = { range?: Range; iconOnly?: boolean; firstPage?: boolean }

/** One row, composed from the parts the way a developer would. */
function Composed({
  label,
  range = SHORT,
  iconOnly = false,
  firstPage = false,
  ...props
}: PaginationProps & RowOptions & { label: string }) {
  const current = firstPage ? 1 : range.current
  return (
    <Pagination aria-label={label} {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" iconOnly={iconOnly} disabled={current === 1} />
        </PaginationItem>
        {range.pages.map((page, i) => (
          <PaginationItem key={i}>
            {page === null ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink href="#" isActive={page === current}>
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href="#" iconOnly={iconOnly} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

/**
 * A row as it should look at each width. A labelled md row is about 365px,
 * wider than a phone's preview, so below `sm` the example does what a phone
 * layout would: Previous and Next as icons, or fewer pages, by `phone`. The
 * other row is `display: none`, so neither eyes nor screen readers meet it
 * twice, and there is no flash on load.
 */
function Row({
  className,
  phone = { iconOnly: true },
  ...props
}: PaginationProps & RowOptions & { label: string; phone?: RowOptions }) {
  return (
    <div className={className}>
      <Composed {...props} className="max-sm:hidden" />
      <Composed {...props} {...phone} className="sm:hidden" />
    </div>
  )
}

/**
 * A side row label: left-aligned in both directions, and it never wraps.
 * Above its row on a phone, beside it from `sm` up.
 */
const RowHead = ({ children }: { children: React.ReactNode }) => (
  <span className="whitespace-nowrap text-left text-sm text-muted-foreground">{children}</span>
)

/** Rows with a label each: the label above on a phone, beside the row from `sm` up. */
const Rows = ({ children }: { children: React.ReactNode }) => (
  <div className="grid w-full grid-cols-1 items-center gap-x-6 gap-y-2 sm:mx-auto sm:w-max sm:grid-cols-[max-content_max-content] sm:gap-y-4">
    {children}
  </div>
)

export default function PaginationPageDocs() {
  const t = useTranslations("docs.sections")
  const p = useTranslations("docs.pagination")

  const label = p("sample.label")

  // One table per part, as the Tooltip and Breadcrumb pages and shadcn document them.
  const row = (prop: string, type: string, fallback: string, key: string): PropRow => ({
    prop,
    type,
    fallback,
    description: p.rich(`props.${key}`, richCode),
  })
  const propTables: { part: string; rows: PropRow[] }[] = [
    {
      part: "Pagination",
      rows: [
        row("variant", '"default" | "solid" | "outlined"', '"default"', "pagination.variant"),
        row("shape", '"square" | "rounded"', '"square"', "pagination.shape"),
        row("size", '"xs" | "sm" | "md" | "lg"', '"md"', "pagination.size"),
        row("aria-label", "string", '"Pagination"', "pagination.ariaLabel"),
        row("children", "ReactNode", "", "pagination.children"),
        row("className", "string", "", "pagination.className"),
      ],
    },
    {
      part: "PaginationContent",
      rows: [
        row("children", "ReactNode", "", "content.children"),
        row("className", "string", "", "content.className"),
      ],
    },
    {
      part: "PaginationItem",
      rows: [
        row("children", "ReactNode", "", "item.children"),
        row("className", "string", "", "item.className"),
      ],
    },
    {
      part: "PaginationLink",
      rows: [
        row("href", "string", "", "link.href"),
        row("isActive", "boolean", "false", "link.isActive"),
        row("disabled", "boolean", "false", "link.disabled"),
        row("asChild", "boolean", "false", "link.asChild"),
        row("children", "ReactNode", "", "link.children"),
        row("className", "string", "", "link.className"),
      ],
    },
    {
      part: "PaginationPrevious, PaginationNext",
      rows: [
        row("href", "string", "", "step.href"),
        row("text", "ReactNode", "", "step.text"),
        row("iconOnly", "boolean", "false", "step.iconOnly"),
        row("disabled", "boolean", "false", "step.disabled"),
        row("asChild", "boolean", "false", "step.asChild"),
        row("className", "string", "", "step.className"),
      ],
    },
    {
      part: "PaginationEllipsis",
      rows: [row("className", "string", "", "ellipsis.className")],
    },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/pagination/" /></h1>
        <p className="text-xl text-muted-foreground">{p("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="pagination" />
        <p className="text-sm text-muted-foreground">{p.rich("installNote", richCode)}</p>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <Row label={label} />
        </ComponentPreview>
      </section>

      {/* Variants: Figma's Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{p.rich("variantsBody", richCode)}</p>
        <ComponentPreview>
          <Rows>
            {VARIANTS.map((variant) => (
              <div key={variant} className="contents">
                <RowHead>
                  <code>{variant}</code>
                </RowHead>
                <Row label={`${label}: ${variant}`} variant={variant} className="mb-3 sm:mb-0" />
              </div>
            ))}
          </Rows>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <p className="text-muted-foreground">{p.rich("sizesBody", richCode)}</p>
        <ComponentPreview>
          <Rows>
            {SIZES.map((size) => (
              <div key={size} className="contents">
                <RowHead>
                  <code>{size}</code>
                </RowHead>
                <Row label={`${label}: ${size}`} size={size} className="mb-3 sm:mb-0" />
              </div>
            ))}
          </Rows>
        </ComponentPreview>
      </section>

      {/* Shape: Figma's Shape */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{p("shape.title")}</h2>
        <p className="text-muted-foreground">{p.rich("shape.body", richCode)}</p>
        <ComponentPreview>
          <Rows>
            {VARIANTS.map((variant) => (
              <div key={variant} className="contents">
                <RowHead>
                  <code>{variant}</code>
                </RowHead>
                <Row label={`${label}: ${variant}`} variant={variant} shape="rounded" className="mb-3 sm:mb-0" />
              </div>
            ))}
          </Rows>
        </ComponentPreview>
      </section>

      {/* Previous and Next: Figma's two booleans */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{p("steps.title")}</h2>
        <p className="text-muted-foreground">{p.rich("steps.body", richCode)}</p>
        <ComponentPreview>
          <Rows>
            <RowHead>{p("steps.text")}</RowHead>
            <Row label={`${label}: ${p("steps.text")}`} phone={{ range: TWO }} className="mb-3 sm:mb-0" />
            <RowHead>{p("steps.icon")}</RowHead>
            <Row label={`${label}: ${p("steps.icon")}`} iconOnly className="mb-3 sm:mb-0" />
            <RowHead>{p("steps.first")}</RowHead>
            <Row label={`${label}: ${p("steps.first")}`} firstPage phone={{ range: TWO }} />
          </Rows>
        </ComponentPreview>
      </section>

      {/* Long ranges */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{p("long.title")}</h2>
        <p className="text-muted-foreground">{p.rich("long.body", richCode)}</p>
        <ComponentPreview>
          <Row
            label={`${label}: ${p("long.title")}`}
            range={LONG}
            iconOnly
            variant="outlined"
            phone={{ range: LONG_PHONE }}
          />
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{p.rich("a11y.landmark", richCode)}</li>
          <li>{p.rich("a11y.current", richCode)}</li>
          <li>{p.rich("a11y.steps", richCode)}</li>
          <li>{p.rich("a11y.ellipsis", richCode)}</li>
          <li>{p.rich("a11y.disabled", richCode)}</li>
          <li>{p.rich("a11y.focus", richCode)}</li>
          <li>{p.rich("a11y.direction", richCode)}</li>
        </ul>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        {propTables.map(({ part, rows }) => (
          <div key={part} className="space-y-3">
            <h3 className="text-lg font-semibold">
              <code dir="ltr">{part}</code>
            </h3>
            <PropsTable rows={rows} />
          </div>
        ))}
      </section>

      {/* Usage */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample title={p("usage.basic")}>{`import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function OrdersPagination() {
  return (
    <Pagination aria-label="${label}">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="?page=1" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=1">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=2" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=3">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="?page=3" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}`}</UsageExample>
        <UsageExample title={p("usage.long")}>{`import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const PAGES = [1, null, 5, 6, 7, null, 20]

export function ArticlesPagination() {
  return (
    <Pagination aria-label="${label}" variant="outlined">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="?page=5" iconOnly />
        </PaginationItem>
        {PAGES.map((page, i) => (
          <PaginationItem key={i}>
            {page === null ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink href={\`?page=\${page}\`} isActive={page === 6}>
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href="?page=7" iconOnly />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}`}</UsageExample>
        <UsageExample title={p("usage.state")}>{`"use client"

import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const TOTAL = 5

export function TablePagination() {
  const [page, setPage] = useState(1)

  return (
    <Pagination aria-label="${label}" size="sm">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious asChild disabled={page === 1}>
            <button type="button" onClick={() => setPage(page - 1)} />
          </PaginationPrevious>
        </PaginationItem>
        {Array.from({ length: TOTAL }, (_, i) => i + 1).map((n) => (
          <PaginationItem key={n}>
            <PaginationLink asChild isActive={n === page}>
              <button type="button" onClick={() => setPage(n)}>
                {n}
              </button>
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext asChild disabled={page === TOTAL}>
            <button type="button" onClick={() => setPage(page + 1)} />
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}`}</UsageExample>
        <UsageExample title={p("usage.router")}>{`import Link from "next/link"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination"

export function ResultsPagination() {
  return (
    <Pagination aria-label="${label}" shape="rounded">
      <PaginationContent>
        <PaginationItem>
          <PaginationLink asChild isActive>
            <Link href="/results?page=1">1</Link>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink asChild>
            <Link href="/results?page=2">2</Link>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext asChild>
            <Link href="/results?page=2" />
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
