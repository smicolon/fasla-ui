"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import {
  CAREERS_ALL,
  CareersHeader,
  CareersNewBadge,
  CareersRoleAction,
  CareersRoleMeta,
  CareersSection,
  arabicCount,
  distinctValues,
  filterRoles,
  useControllableValue,
  type CareersLocale,
  type CareersRole,
} from "../careers/careers"

/*
 * Figma: `Careers` (46378:5405), Type=Open Roles — Hairline List.
 *
 * A header, a row of team chips with the count of roles beside it, and the
 * roles as a list ruled by hairlines: a 1px `border` line above the list and
 * under every row. A row is the role's title with its New badge, a line on
 * what it does, its place, commitment and pay, and a View role button at the
 * end. The chip that is pressed is Solid; the others are Outline.
 *
 * Desktop and Tablet keep the row side by side. Mobile stacks it, the button
 * across the full width, and puts the count under the chips. In Arabic the
 * row runs right to left, so the button sits at the left edge.
 *
 * The chips filter the list for real: pressing one shows that team's roles
 * and the count follows. The chips are the teams the roles name.
 *
 * Content limits: a role's title up to 27 characters, with its New badge.
 * The other limits are in the block's documentation page, which the default
 * copy stays inside.
 */

export interface CareersOpenRolesHairlineListCopy {
  /** The small line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The chip that shows every role. */
  allRoles: string
  /** Names the chips for assistive technology. */
  filterLabel: string
  /** The count beside the chips, given how many roles show. */
  count: (shown: number) => React.ReactNode
  /** The roles, in order. Their `department` makes the chips. */
  roles: CareersRole[]
  /** The label of every role's button. */
  viewRole: string
  /** The New badge's text. */
  newLabel: React.ReactNode
  /** Shown in place of the list when no role matches. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<CareersLocale, CareersOpenRolesHairlineListCopy> = {
  en: {
    eyebrow: "Careers at Fasla",
    heading: "Open roles",
    description: "We hire for craft and curiosity. Every role is remote-friendly, and every application gets a human reply.",
    allRoles: "All roles",
    filterLabel: "Filter by team",
    count: (shown) => `${shown} open ${shown === 1 ? "role" : "roles"}`,
    roles: [
      {
        id: "senior-product-designer",
        title: "Senior Product Designer",
        department: "Design",
        summary: "Own end-to-end design for the design-system surface, from token model to shipped components.",
        location: "Remote (EU)",
        commitment: "Full-time",
        pay: "$95K–$120K",
        isNew: true,
      },
      {
        id: "design-systems-engineer",
        title: "Design Systems Engineer",
        department: "Engineering",
        summary: "Build and maintain the component library that every Fasla product is assembled from.",
        location: "Berlin · Hybrid",
        commitment: "Full-time",
        pay: "$110K–$140K",
        isNew: true,
      },
      {
        id: "product-manager-platform",
        title: "Product Manager, Platform",
        department: "Product",
        summary: "Shape the roadmap for the platform teams: tokens, theming, and the design-to-code pipeline.",
        location: "Amman · Hybrid",
        commitment: "Full-time",
        pay: "$80K–$105K",
      },
      {
        id: "motion-designer",
        title: "Motion Designer",
        department: "Design",
        summary: "Define how our interfaces move: micro-interactions, transitions, and the motion documentation behind them.",
        location: "Remote",
        commitment: "Contract",
        pay: "$70K–$90K",
      },
      {
        id: "developer-advocate",
        title: "Developer Advocate",
        department: "Marketing",
        summary: "Help engineers adopt the system through docs, talks, sample apps, and a very loud feedback loop.",
        location: "Dubai",
        commitment: "Full-time",
        pay: "$85K–$110K",
      },
      {
        id: "design-ops-lead",
        title: "Design Ops Lead",
        department: "People",
        summary: "Keep the design practice running: rituals, tooling, hiring, and the health of the library.",
        location: "Amman",
        commitment: "Full-time",
        pay: "$90K–$115K",
      },
    ],
    viewRole: "View role",
    newLabel: "New",
    empty: "No open roles match this team.",
  },
  ar: {
    eyebrow: "الوظائف في فاصلة",
    heading: "الوظائف المتاحة",
    description: "نوظّف أصحاب الحرفة والفضول. كل وظيفة تدعم العمل عن بُعد، وكل طلب يحصل على رد من شخص حقيقي.",
    allRoles: "كل الوظائف",
    filterLabel: "التصفية حسب الفريق",
    count: (shown) =>
      arabicCount(shown, { zero: "لا توجد وظائف متاحة", one: "وظيفة متاحة واحدة", two: "وظيفتان متاحتان", few: "{n} وظائف متاحة", many: "{n} وظيفة متاحة" }),
    roles: [
      {
        id: "senior-product-designer",
        title: "مصمم/ة منتجات أول",
        department: "التصميم",
        summary: "تملّك التصميم من البداية إلى النهاية لواجهة نظام التصميم، من نموذج الرموز إلى المكوّنات الجاهزة للإطلاق.",
        location: "عن بُعد (الاتحاد الأوروبي)",
        commitment: "دوام كامل",
        pay: "من 95 إلى 120 ألف دولار",
        isNew: true,
      },
      {
        id: "design-systems-engineer",
        title: "مهندس/ة أنظمة تصميم",
        department: "الهندسة",
        summary: "بناء وصيانة مكتبة المكوّنات التي تُبنى منها كل منتجات فاصلة.",
        location: "برلين، هجين",
        commitment: "دوام كامل",
        pay: "من 110 إلى 140 ألف دولار",
        isNew: true,
      },
      {
        id: "product-manager-platform",
        title: "مدير/ة منتج، المنصة",
        department: "المنتج",
        summary: "رسم خطة الطريق لفرق المنصة: الرموز والسمات ومسار التحويل من التصميم إلى الكود.",
        location: "عمّان، هجين",
        commitment: "دوام كامل",
        pay: "من 80 إلى 105 ألف دولار",
      },
      {
        id: "motion-designer",
        title: "مصمم/ة حركة",
        department: "التصميم",
        summary: "تحديد كيفية حركة واجهاتنا: التفاعلات الدقيقة والانتقالات وتوثيق الحركة الذي يدعمها.",
        location: "عن بُعد",
        commitment: "عقد",
        pay: "من 70 إلى 90 ألف دولار",
      },
      {
        id: "developer-advocate",
        title: "مناصر/ة المطوّرين",
        department: "التسويق",
        summary: "مساعدة المهندسين على تبنّي النظام عبر التوثيق والمحاضرات والتطبيقات النموذجية وحلقة تغذية راجعة عالية الصوت.",
        location: "دبي",
        commitment: "دوام كامل",
        pay: "من 85 إلى 110 ألف دولار",
      },
      {
        id: "design-ops-lead",
        title: "قائد/ة عمليات التصميم",
        department: "الموارد البشرية",
        summary: "الحفاظ على استمرارية ممارسة التصميم: الطقوس والأدوات والتوظيف وصحة المكتبة.",
        location: "عمّان",
        commitment: "دوام كامل",
        pay: "من 90 إلى 115 ألف دولار",
      },
    ],
    viewRole: "عرض الوظيفة",
    newLabel: "جديد",
    empty: "لا توجد وظائف مفتوحة تطابق هذا الفريق.",
  },
}

export interface CareersOpenRolesHairlineListProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<CareersOpenRolesHairlineListCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: CareersLocale
  /** The team chip that is pressed, as a `department` value, or `"all"`. Pass it to control the filter. */
  filter?: string
  /** The chip pressed on first render. */
  defaultFilter?: string
  /** Called with the team a pressed chip chose. */
  onFilterChange?: (filter: string) => void
  /** How many open roles there are in all, when the list holds fewer. Shown as the count while no chip is pressed. */
  total?: number
  /** Called when a role without an `href` has its button pressed. */
  onRoleSelect?: (role: CareersRole) => void
}

export function CareersOpenRolesHairlineList({
  locale = "en",
  eyebrow,
  heading,
  description,
  allRoles,
  filterLabel,
  count,
  roles,
  viewRole,
  newLabel,
  empty,
  filter: filterProp,
  defaultFilter = CAREERS_ALL,
  onFilterChange,
  total,
  onRoleSelect,
  className,
  ...props
}: CareersOpenRolesHairlineListProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = roles ?? copy.roles
  const [filter, setFilter] = useControllableValue(filterProp, defaultFilter, onFilterChange)
  const teams = distinctValues(list, "department")
  const shown = filterRoles(list, { department: filter })
  const shownCount = filter === CAREERS_ALL && total !== undefined ? total : shown.length
  const countLabel = (count ?? copy.count)(shownCount)

  return (
    <CareersSection labelledBy={headingId} className={className} {...props}>
      <CareersHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} description={description ?? copy.description} />

      <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between">
        <div role="group" aria-label={filterLabel ?? copy.filterLabel} className="flex flex-wrap gap-2">
          {[CAREERS_ALL, ...teams].map((team) => (
            <Button
              key={team}
              type="button"
              size="sm"
              radius="rounded"
              variant={filter === team ? "secondary" : "outline"}
              aria-pressed={filter === team}
              onClick={() => setFilter(team)}
            >
              {team === CAREERS_ALL ? (allRoles ?? copy.allRoles) : team}
            </Button>
          ))}
        </div>
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {countLabel}
        </p>
      </div>

      {shown.length === 0 ? (
        <p className="border-y border-border py-12 text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
      ) : (
        <ul className="flex flex-col border-t border-border">
          {shown.map((role) => (
            <li
              key={role.id}
              className={cn(
                "flex flex-col gap-4 border-b border-border py-6",
                "[@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-8"
              )}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-medium text-foreground">{role.title}</h3>
                  {role.isNew ? <CareersNewBadge>{newLabel ?? copy.newLabel}</CareersNewBadge> : null}
                </div>
                {role.summary ? <p className="text-sm text-muted-foreground">{role.summary}</p> : null}
                <CareersRoleMeta role={role} />
              </div>
              <CareersRoleAction
                role={role}
                label={viewRole ?? copy.viewRole}
                variant="outline"
                size="md"
                arrow
                onSelect={onRoleSelect}
                className="w-full [@container(min-width:40rem)]:w-auto"
              />
            </li>
          ))}
        </ul>
      )}
    </CareersSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const careersOpenRolesHairlineListCopy = COPY
