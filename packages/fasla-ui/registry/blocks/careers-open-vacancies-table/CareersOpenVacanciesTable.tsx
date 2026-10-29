"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../ui/pagination/pagination"
import {
  CareersHeader,
  CareersNewBadge,
  CareersRoleAction,
  CareersRoleMeta,
  CareersSection,
  arabicCount,
  useControllableValue,
  type CareersLocale,
  type CareersRole,
} from "../careers/careers"

/*
 * Figma: `Careers` (46378:5405), Type=Open Vacancies Table.
 *
 * A header with the count of vacancies beside it, a table of the roles, and
 * under it how many show and a numbered pager. A row is the position with its
 * New badge, its team, place and type, and a plus that opens the row: the
 * full description, the pay and the button, without leaving the page.
 *
 * Desktop and Tablet are a table with four labelled columns, the plus at the
 * end. Mobile turns each row into a card: the position and the plus on top,
 * then each fact after its label. In Arabic the columns run right to left.
 *
 * The pager is real: the roles are cut into pages of `pageSize`, the count
 * follows the page, and the rows open one at a time (pass `expanded` to open
 * a row from outside).
 *
 * The table keeps its table semantics on Mobile too: the rows are drawn as
 * cards, but carry the table, row and cell roles explicitly.
 *
 * Content limits: a role's title up to 27 characters, with its New badge.
 * The other limits are in the block's documentation page, which the default
 * copy stays inside.
 */

export interface CareersOpenVacanciesTableCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The table's name for assistive technology. */
  tableLabel: string
  /** The four column headings, in order: position, team, place, type. */
  columns: [string, string, string, string]
  /** The count beside the header, given how many vacancies there are. */
  count: (vacancies: number) => React.ReactNode
  /** The line under the table, given how many rows show and how many there are. */
  showing: (shown: number, of: number) => React.ReactNode
  /** The roles, in order. */
  roles: CareersRole[]
  /** A row's plus, followed by the role's title for assistive technology. */
  expand: string
  /** A row's minus once it is open. */
  collapse: string
  /** The label of an open row's button. */
  viewRole: string
  /** The New badge's text. */
  newLabel: React.ReactNode
  /** Names the pager for assistive technology. */
  paginationLabel: string
  /** The pager's Previous and Next. */
  previous: string
  next: string
  /** Names a page's link for assistive technology, given its number. */
  pageLabel: (page: number) => string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<CareersLocale, CareersOpenVacanciesTableCopy> = {
  en: {
    heading: "All open vacancies",
    description: "Scan every role at a glance. Expand a row to read the full description without leaving the page.",
    tableLabel: "Open vacancies",
    columns: ["Position", "Department", "Location", "Type"],
    count: (vacancies) => `${vacancies} ${vacancies === 1 ? "vacancy" : "vacancies"}`,
    showing: (shown, of) => `Showing ${shown} of ${of} ${of === 1 ? "vacancy" : "vacancies"}`,
    roles: [
      {
        id: "senior-product-designer",
        title: "Senior Product Designer",
        department: "Design",
        summary: "Own end-to-end design for the design-system surface: token model, component anatomy, and the docs that make it usable.",
        location: "Remote (EU)",
        commitment: "Full-time",
        pay: "$95K–$120K",
        isNew: true,
      },
      {
        id: "design-systems-engineer",
        title: "Design Systems Engineer",
        department: "Engineering",
        summary: "Build and maintain the component library every Fasla product is assembled from, in React and in Figma.",
        location: "Berlin · Hybrid",
        commitment: "Full-time",
        pay: "$110K–$140K",
        isNew: true,
      },
      {
        id: "product-manager-platform",
        title: "Product Manager, Platform",
        department: "Product",
        summary: "Shape the roadmap for tokens, theming, and the design-to-code pipeline that connects both.",
        location: "Amman · Hybrid",
        commitment: "Full-time",
        pay: "$80K–$105K",
      },
      {
        id: "motion-designer",
        title: "Motion Designer",
        department: "Design",
        summary: "Define how our interfaces move: micro-interactions, transitions, and the motion spec behind them.",
        location: "Remote",
        commitment: "Contract",
        pay: "$70K–$90K",
      },
      {
        id: "developer-advocate",
        title: "Developer Advocate",
        department: "Go-to-market",
        summary: "Help engineers adopt the system through docs, talks, sample apps, and a very loud feedback loop.",
        location: "Dubai",
        commitment: "Full-time",
        pay: "$85K–$110K",
      },
      {
        id: "technical-writer",
        title: "Technical Writer",
        department: "Product",
        summary: "Write the documentation that teaches the system: guides, API references, and the migration notes people actually read.",
        location: "Remote",
        commitment: "Part-time",
        pay: "$55K–$70K",
      },
      {
        id: "frontend-engineer",
        title: "Frontend Engineer",
        department: "Engineering",
        summary: "Build product surfaces on top of the component library, and feed what you learn back into it.",
        location: "Remote",
        commitment: "Full-time",
        pay: "$100K–$130K",
      },
      {
        id: "infrastructure-engineer",
        title: "Infrastructure Engineer",
        department: "Engineering",
        summary: "Run the build, release, and registry pipeline that gets every component to the teams that use it.",
        location: "Remote",
        commitment: "Full-time",
        pay: "$105K–$135K",
      },
      {
        id: "design-ops-lead",
        title: "Design Ops Lead",
        department: "Design",
        summary: "Keep the design practice running: rituals, tooling, hiring, and the health of the library.",
        location: "Amman",
        commitment: "Full-time",
        pay: "$90K–$115K",
      },
      {
        id: "customer-success-manager",
        title: "Customer Success Manager",
        department: "Go-to-market",
        summary: "Partner with design teams rolling out the system, from first workshop to full adoption.",
        location: "Remote",
        commitment: "Full-time",
        pay: "$65K–$85K",
      },
    ],
    expand: "Expand",
    collapse: "Collapse",
    viewRole: "View role",
    newLabel: "New",
    paginationLabel: "Pagination",
    previous: "Previous",
    next: "Next",
    pageLabel: (page) => `Page ${page}`,
  },
  ar: {
    heading: "جميع الوظائف المتاحة",
    description: "استعرض كل الوظائف بلمحة. وسّع أي صف لقراءة الوصف الكامل دون مغادرة الصفحة.",
    tableLabel: "الوظائف المتاحة",
    columns: ["الوظيفة", "القسم", "الموقع", "النوع"],
    count: (vacancies) => arabicCount(vacancies, { zero: "لا توجد وظائف", one: "وظيفة واحدة", two: "وظيفتان", few: "{n} وظائف", many: "{n} وظيفة" }),
    showing: (shown, of) => `عرض ${shown} من ${arabicCount(of, { zero: "لا توجد وظائف", one: "وظيفة واحدة", two: "وظيفتين", few: "{n} وظائف", many: "{n} وظيفة" })}`,
    roles: [
      {
        id: "senior-product-designer",
        title: "مصمم/ة منتجات أول",
        department: "التصميم",
        summary: "تملّك التصميم من البداية إلى النهاية لواجهة نظام التصميم: نموذج الرموز وتشريح المكوّنات والتوثيق الذي يجعله قابلاً للاستخدام.",
        location: "عن بُعد (الاتحاد الأوروبي)",
        commitment: "دوام كامل",
        pay: "من 95 إلى 120 ألف دولار",
        isNew: true,
      },
      {
        id: "design-systems-engineer",
        title: "مهندس/ة أنظمة تصميم",
        department: "الهندسة",
        summary: "بناء وصيانة مكتبة المكوّنات التي تُبنى منها كل منتجات فاصلة، في الكود وفي ملفات التصميم.",
        location: "برلين، هجين",
        commitment: "دوام كامل",
        pay: "من 110 إلى 140 ألف دولار",
        isNew: true,
      },
      {
        id: "product-manager-platform",
        title: "مدير/ة منتج، المنصة",
        department: "المنتج",
        summary: "رسم خطة الطريق للرموز والسمات ومسار التحويل من التصميم إلى الكود الذي يربط الاثنين.",
        location: "عمّان، هجين",
        commitment: "دوام كامل",
        pay: "من 80 إلى 105 ألف دولار",
      },
      {
        id: "motion-designer",
        title: "مصمم/ة حركة",
        department: "التصميم",
        summary: "تحديد كيفية حركة واجهاتنا: التفاعلات الدقيقة والانتقالات ومواصفات الحركة التي تدعمها.",
        location: "عن بُعد",
        commitment: "عقد",
        pay: "من 70 إلى 90 ألف دولار",
      },
      {
        id: "developer-advocate",
        title: "مناصر/ة المطوّرين",
        department: "التسويق والنمو",
        summary: "مساعدة المهندسين على تبنّي النظام عبر التوثيق والمحاضرات والتطبيقات النموذجية وحلقة تغذية راجعة عالية الصوت.",
        location: "دبي",
        commitment: "دوام كامل",
        pay: "من 85 إلى 110 ألف دولار",
      },
      {
        id: "technical-writer",
        title: "كاتب/ة تقني",
        department: "المنتج",
        summary: "كتابة التوثيق الذي يعلّم النظام: الأدلة ومراجع الواجهات وملاحظات الانتقال التي يقرؤها الناس فعلاً.",
        location: "عن بُعد",
        commitment: "دوام جزئي",
        pay: "من 55 إلى 70 ألف دولار",
      },
      {
        id: "frontend-engineer",
        title: "مهندس/ة واجهات أمامية",
        department: "الهندسة",
        summary: "بناء واجهات المنتجات فوق مكتبة المكوّنات، وإعادة ما تتعلمه إليها.",
        location: "عن بُعد",
        commitment: "دوام كامل",
        pay: "من 100 إلى 130 ألف دولار",
      },
      {
        id: "infrastructure-engineer",
        title: "مهندس/ة بنية تحتية",
        department: "الهندسة",
        summary: "تشغيل مسار البناء والإصدار والسجل الذي يوصل كل مكوّن إلى الفرق التي تستخدمه.",
        location: "عن بُعد",
        commitment: "دوام كامل",
        pay: "من 105 إلى 135 ألف دولار",
      },
      {
        id: "design-ops-lead",
        title: "قائد/ة عمليات التصميم",
        department: "التصميم",
        summary: "الحفاظ على استمرارية ممارسة التصميم: الطقوس والأدوات والتوظيف وصحة المكتبة.",
        location: "عمّان",
        commitment: "دوام كامل",
        pay: "من 90 إلى 115 ألف دولار",
      },
      {
        id: "customer-success-manager",
        title: "مدير/ة نجاح العملاء",
        department: "التسويق والنمو",
        summary: "العمل مع فرق التصميم التي تطبّق النظام، من أول ورشة حتى التبنّي الكامل.",
        location: "عن بُعد",
        commitment: "دوام كامل",
        pay: "من 65 إلى 85 ألف دولار",
      },
    ],
    expand: "توسيع",
    collapse: "طيّ",
    viewRole: "عرض الوظيفة",
    newLabel: "جديد",
    paginationLabel: "ترقيم الصفحات",
    previous: "السابق",
    next: "التالي",
    pageLabel: (page) => `الصفحة ${page}`,
  },
}

export interface CareersOpenVacanciesTableProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<CareersOpenVacanciesTableCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: CareersLocale
  /** How many rows a page holds. */
  pageSize?: number
  /** Where a page's pager link goes, given the page. Without it, the links change the page in place. */
  pageHref?: (page: number) => string
  /** The page showing, from 1. Pass it to control the pager. */
  page?: number
  /** The page showing on first render. */
  defaultPage?: number
  /** Called with the page a pager link chose. */
  onPageChange?: (page: number) => void
  /** The id of the open row, or `null` for none. Pass it to control which row is open. */
  expanded?: string | null
  /** The row open on first render. */
  defaultExpanded?: string | null
  /** Called with the id of the row that opened, or `null` when it closed. */
  onExpandedChange?: (id: string | null) => void
  /** Called when a role without an `href` has its button pressed. */
  onRoleSelect?: (role: CareersRole) => void
}

/*
 * Each class is written out in full: Tailwind finds classes by reading the
 * source, so a name built from pieces would never reach the stylesheet.
 * `[@container(min-width:40rem)]:` is the table's wide look (Tablet and
 * Desktop); the plain classes are Mobile's card.
 */
const ROW =
  "relative block rounded-xl border border-border bg-card p-4 [@container(min-width:40rem)]:table-row [@container(min-width:40rem)]:rounded-none [@container(min-width:40rem)]:border-0 [@container(min-width:40rem)]:bg-transparent [@container(min-width:40rem)]:p-0"
const CELL =
  "block py-1 text-sm text-muted-foreground [@container(min-width:40rem)]:table-cell [@container(min-width:40rem)]:border-b [@container(min-width:40rem)]:border-border [@container(min-width:40rem)]:py-4 [@container(min-width:40rem)]:pe-6 [@container(min-width:40rem)]:align-middle"
const HEAD =
  "text-start text-xs font-medium uppercase text-muted-foreground [@container(min-width:40rem)]:table-cell [@container(min-width:40rem)]:border-b [@container(min-width:40rem)]:border-border [@container(min-width:40rem)]:pb-3 [@container(min-width:40rem)]:pe-6"

export function CareersOpenVacanciesTable({
  locale = "en",
  heading,
  description,
  tableLabel,
  columns,
  count,
  showing,
  roles,
  expand,
  collapse,
  viewRole,
  newLabel,
  paginationLabel,
  previous,
  next,
  pageLabel,
  pageSize = 6,
  pageHref,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  expanded: expandedProp,
  defaultExpanded = null,
  onExpandedChange,
  onRoleSelect,
  className,
  ...props
}: CareersOpenVacanciesTableProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const baseId = React.useId()
  const list = roles ?? copy.roles
  const heads = columns ?? copy.columns
  const [pageValue, setPage] = useControllableValue<number>(pageProp, defaultPage, onPageChange)
  const [openId, setOpenId] = useControllableValue<string | null>(expandedProp, defaultExpanded, onExpandedChange)

  const pageCount = Math.max(1, Math.ceil(list.length / pageSize))
  const page = Math.min(Math.max(1, pageValue), pageCount)
  const rows = list.slice((page - 1) * pageSize, page * pageSize)
  // A pager link goes where `pageHref` says; without it the link stays on the page and only changes it.
  const goTo = (target: number) => (event: React.MouseEvent) => {
    if (!pageHref) event.preventDefault()
    setPage(target)
  }

  return (
    <CareersSection labelledBy={headingId} className={className} {...props}>
      <div className="flex flex-col gap-3 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-end [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-8">
        <CareersHeader headingId={headingId} heading={heading ?? copy.heading} description={description ?? copy.description} />
        <p className="shrink-0 text-sm text-muted-foreground">{(count ?? copy.count)(list.length)}</p>
      </div>

      <div className="flex flex-col gap-6">
        <table role="table" aria-label={tableLabel ?? copy.tableLabel} className="block w-full border-collapse [@container(min-width:40rem)]:table">
          <thead role="rowgroup" className="sr-only [@container(min-width:40rem)]:not-sr-only [@container(min-width:40rem)]:table-header-group">
            <tr role="row" className="[@container(min-width:40rem)]:table-row">
              {heads.map((head, index) => (
                <th key={head} role="columnheader" scope="col" className={cn(HEAD, index === 0 && "[@container(min-width:40rem)]:w-[40%]")}>
                  {head}
                </th>
              ))}
              <td role="columnheader" aria-label={copy.expand} className="[@container(min-width:40rem)]:table-cell [@container(min-width:40rem)]:w-10 [@container(min-width:40rem)]:border-b [@container(min-width:40rem)]:border-border" />
            </tr>
          </thead>

          <tbody role="rowgroup" className="flex flex-col gap-3 [@container(min-width:40rem)]:table-row-group">
            {rows.map((role) => {
              const isOpen = openId === role.id
              const panelId = `${baseId}-${role.id}`
              const title = typeof role.title === "string" ? role.title : ""
              return (
                <React.Fragment key={role.id}>
                  <tr role="row" className={ROW}>
                    <td role="cell" className={cn(CELL, "pe-12 text-base font-medium text-foreground [@container(min-width:40rem)]:pe-6")}>
                      <span className="inline-flex flex-wrap items-center gap-2">
                        <span>{role.title}</span>
                        {role.isNew ? <CareersNewBadge>{newLabel ?? copy.newLabel}</CareersNewBadge> : null}
                      </span>
                    </td>
                    {[role.department, role.location, role.commitment].map((value, index) => (
                      <td key={index} role="cell" className={cn(CELL, "grid grid-cols-[6rem_minmax(0,1fr)] gap-x-4 [@container(min-width:40rem)]:table-cell")}>
                        <span aria-hidden className="text-xs font-medium text-foreground [@container(min-width:40rem)]:hidden">
                          {heads[index + 1]}
                        </span>
                        <span>{value}</span>
                      </td>
                    ))}
                    <td role="cell" className="absolute end-4 top-4 [@container(min-width:40rem)]:static [@container(min-width:40rem)]:table-cell [@container(min-width:40rem)]:border-b [@container(min-width:40rem)]:border-border [@container(min-width:40rem)]:py-3 [@container(min-width:40rem)]:text-end [@container(min-width:40rem)]:align-middle">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        radius="rounded"
                        aria-expanded={isOpen}
                        aria-controls={isOpen ? panelId : undefined}
                        aria-label={`${isOpen ? (collapse ?? copy.collapse) : (expand ?? copy.expand)}: ${title}`}
                        onClick={() => setOpenId(isOpen ? null : role.id)}
                      >
                        {isOpen ? <Minus aria-hidden strokeWidth={1.5} /> : <Plus aria-hidden strokeWidth={1.5} />}
                      </Button>
                    </td>
                  </tr>
                  {isOpen ? (
                    <tr role="row" id={panelId} className="block rounded-xl border border-border bg-card p-4 [@container(min-width:40rem)]:table-row [@container(min-width:40rem)]:rounded-none [@container(min-width:40rem)]:border-0 [@container(min-width:40rem)]:bg-transparent [@container(min-width:40rem)]:p-0">
                      <td role="cell" colSpan={5} className="block [@container(min-width:40rem)]:table-cell [@container(min-width:40rem)]:border-b [@container(min-width:40rem)]:border-border [@container(min-width:40rem)]:pb-6 [@container(min-width:40rem)]:pt-2">
                        <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-start [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-8">
                          <div className="flex max-w-[720px] flex-col gap-3">
                            {role.summary ? <p className="text-sm text-muted-foreground">{role.summary}</p> : null}
                            <CareersRoleMeta role={{ pay: role.pay }} />
                          </div>
                          <CareersRoleAction role={role} label={viewRole ?? copy.viewRole} variant="outline" size="md" arrow onSelect={onRoleSelect} className="shrink-0" />
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>

        <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            {(showing ?? copy.showing)(rows.length, list.length)}
          </p>
          {pageCount > 1 ? (
            <Pagination variant="outlined" shape="rounded" size="sm" aria-label={paginationLabel ?? copy.paginationLabel} className="mx-0 w-auto justify-start">
              <PaginationContent className="justify-start">
                <PaginationItem>
                  <PaginationPrevious href={pageHref?.(page - 1) ?? "#"} text={previous ?? copy.previous} disabled={page === 1} onClick={goTo(page - 1)} />
                </PaginationItem>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                  <PaginationItem key={number}>
                    <PaginationLink href={pageHref?.(number) ?? "#"} isActive={number === page} aria-label={(pageLabel ?? copy.pageLabel)(number)} onClick={goTo(number)}>
                      {number}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext href={pageHref?.(page + 1) ?? "#"} text={next ?? copy.next} disabled={page === pageCount} onClick={goTo(page + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </div>
      </div>
    </CareersSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const careersOpenVacanciesTableCopy = COPY
