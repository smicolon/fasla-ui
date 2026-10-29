"use client"

import * as React from "react"
import { Bookmark, Search } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"
import { Select } from "../../ui/select/select"
import {
  CAREERS_ALL,
  CareersHeader,
  CareersRoleAction,
  CareersRoleMeta,
  CareersSection,
  arabicCount,
  distinctValues,
  filterRoles,
  useControllableValue,
  type CareersLocale,
  type CareersRole,
  type CareersRoleFilters,
} from "../careers/careers"

/*
 * Figma: `Careers` (46378:5405), Type=Role Cards Grid.
 *
 * A header, a toolbar of a search field and three selects (team, place and
 * type), a line of status (how many roles show, and how they are sorted),
 * and the roles as cards. A card is the team and a bookmark, the title, a
 * line on the role, its place, commitment and pay stacked, and under a
 * hairline the posting date with a ghost View role button.
 *
 * Desktop lays the cards three across and puts the search at the start of the
 * toolbar and the selects at the end. Tablet is two across, the search over
 * the selects. Mobile is one card wide, the selects stacked. In Arabic the
 * grid and the toolbar run right to left.
 *
 * The search and the selects filter the cards for real, and the count follows.
 * The selects offer the teams, places and types the roles name. The bookmark
 * keeps a role in a saved list the page can read.
 *
 * Content limits: a role's title up to 27 characters, with its New badge.
 * The other limits are in the block's documentation page, which the default
 * copy stays inside.
 */

export interface CareersRoleCardsGridCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The search field's placeholder, which also names it. */
  searchPlaceholder: string
  /** The team select's first option, and its placeholder. */
  allDepartments: string
  /** The place select's first option. */
  allLocations: string
  /** The type select's first option. */
  anyType: string
  /** Names the selects for assistive technology, in order: team, place, type. */
  filterLabels: [string, string, string]
  /** The line of status, given how many roles show and how many there are. */
  showing: (shown: number, of: number) => React.ReactNode
  /** How the cards are sorted. */
  sortedBy: React.ReactNode
  /** The roles, in order. */
  roles: CareersRole[]
  /** The label of every card's button. */
  viewRole: string
  /** The bookmark's label, followed by the role's title for assistive technology. */
  saveRole: string
  /** The bookmark's label once the role is saved. */
  savedRole: string
  /** Shown in place of the cards when none match. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<CareersLocale, CareersRoleCardsGridCopy> = {
  en: {
    heading: "Find your next role",
    description: "Ten open roles across six teams. Filter by what matters to you.",
    searchPlaceholder: "Search roles or keywords",
    allDepartments: "All departments",
    allLocations: "All locations",
    anyType: "Any type",
    filterLabels: ["Team", "Location", "Type"],
    showing: (shown, of) => `Showing ${shown} of ${of} ${of === 1 ? "role" : "roles"}`,
    sortedBy: "Sorted by most recent",
    roles: [
      {
        id: "senior-product-designer",
        title: "Senior Product Designer",
        department: "Design",
        summary: "Own end-to-end design for the design-system surface: token model, component anatomy, and the docs that make it usable.",
        location: "Remote (EU)",
        commitment: "Full-time",
        pay: "$95K–$120K",
        posted: "Posted 2 days ago",
      },
      {
        id: "design-systems-engineer",
        title: "Design Systems Engineer",
        department: "Engineering",
        summary: "Build and maintain the component library every Fasla product is assembled from, in React and in Figma.",
        location: "Berlin · Hybrid",
        commitment: "Full-time",
        pay: "$110K–$140K",
        posted: "Posted 3 days ago",
      },
      {
        id: "product-manager-platform",
        title: "Product Manager, Platform",
        department: "Product",
        summary: "Shape the roadmap for tokens, theming, and the design-to-code pipeline that connects both.",
        location: "Amman · Hybrid",
        commitment: "Full-time",
        pay: "$80K–$105K",
        posted: "Posted 5 days ago",
      },
      {
        id: "motion-designer",
        title: "Motion Designer",
        department: "Design",
        summary: "Define how our interfaces move: micro-interactions, transitions, and the motion spec behind them.",
        location: "Remote",
        commitment: "Contract",
        pay: "$70K–$90K",
        posted: "Posted 1 week ago",
      },
      {
        id: "developer-advocate",
        title: "Developer Advocate",
        department: "Marketing",
        summary: "Help engineers adopt the system through docs, talks, sample apps, and a very loud feedback loop.",
        location: "Dubai",
        commitment: "Full-time",
        pay: "$85K–$110K",
        posted: "Posted 1 week ago",
      },
      {
        id: "customer-success-manager",
        title: "Customer Success Manager",
        department: "Customer Success",
        summary: "Partner with design teams rolling out the system, from first workshop to full adoption.",
        location: "Remote",
        commitment: "Full-time",
        pay: "$65K–$85K",
        posted: "Posted 2 weeks ago",
      },
    ],
    viewRole: "View role",
    saveRole: "Save role",
    savedRole: "Saved",
    empty: "No roles match your search. Try a different word or clear a filter.",
  },
  ar: {
    heading: "اعثر على وظيفتك القادمة",
    description: "عشر وظائف متاحة في ستة فرق. صفِّ النتائج بما يهمّك.",
    searchPlaceholder: "ابحث عن وظيفة أو كلمة مفتاحية",
    allDepartments: "كل الفرق",
    allLocations: "كل المواقع",
    anyType: "أي نوع",
    filterLabels: ["الفريق", "الموقع", "النوع"],
    showing: (shown, of) =>
      `عرض ${shown} من ${arabicCount(of, { zero: "لا توجد وظائف", one: "وظيفة واحدة", two: "وظيفتين", few: "{n} وظائف", many: "{n} وظيفة" })}`,
    sortedBy: "مرتّبة حسب الأحدث",
    roles: [
      {
        id: "senior-product-designer",
        title: "مصمم/ة منتجات أول",
        department: "التصميم",
        summary: "تملّك التصميم من البداية إلى النهاية لواجهة نظام التصميم: نموذج الرموز وتشريح المكوّنات والتوثيق الذي يجعله قابلاً للاستخدام.",
        location: "عن بُعد (الاتحاد الأوروبي)",
        commitment: "دوام كامل",
        pay: "من 95 إلى 120 ألف دولار",
        posted: "نُشرت قبل يومين",
      },
      {
        id: "design-systems-engineer",
        title: "مهندس/ة أنظمة تصميم",
        department: "الهندسة",
        summary: "بناء وصيانة مكتبة المكوّنات التي تُبنى منها كل منتجات فاصلة، في الكود وفي ملفات التصميم.",
        location: "برلين، هجين",
        commitment: "دوام كامل",
        pay: "من 110 إلى 140 ألف دولار",
        posted: "نُشرت قبل 3 أيام",
      },
      {
        id: "product-manager-platform",
        title: "مدير/ة منتج، المنصة",
        department: "المنتج",
        summary: "رسم خطة الطريق للرموز والسمات ومسار التحويل من التصميم إلى الكود الذي يربط الاثنين.",
        location: "عمّان، هجين",
        commitment: "دوام كامل",
        pay: "من 80 إلى 105 ألف دولار",
        posted: "نُشرت قبل 5 أيام",
      },
      {
        id: "motion-designer",
        title: "مصمم/ة حركة",
        department: "التصميم",
        summary: "تحديد كيفية حركة واجهاتنا: التفاعلات الدقيقة والانتقالات ومواصفات الحركة التي تدعمها.",
        location: "عن بُعد",
        commitment: "عقد",
        pay: "من 70 إلى 90 ألف دولار",
        posted: "نُشرت قبل أسبوع",
      },
      {
        id: "developer-advocate",
        title: "مناصر/ة المطوّرين",
        department: "التسويق",
        summary: "مساعدة المهندسين على تبنّي النظام عبر التوثيق والمحاضرات والتطبيقات النموذجية وحلقة تغذية راجعة عالية الصوت.",
        location: "دبي",
        commitment: "دوام كامل",
        pay: "من 85 إلى 110 ألف دولار",
        posted: "نُشرت قبل أسبوع",
      },
      {
        id: "customer-success-manager",
        title: "مدير/ة نجاح العملاء",
        department: "نجاح العملاء",
        summary: "العمل مع فرق التصميم التي تطبّق النظام، من أول ورشة حتى التبنّي الكامل.",
        location: "عن بُعد",
        commitment: "دوام كامل",
        pay: "من 65 إلى 85 ألف دولار",
        posted: "نُشرت قبل أسبوعين",
      },
    ],
    viewRole: "عرض الوظيفة",
    saveRole: "حفظ الوظيفة",
    savedRole: "تم الحفظ",
    empty: "لا توجد وظائف تطابق بحثك. جرّب كلمة أخرى أو أزل أحد عوامل التصفية.",
  },
}

export interface CareersRoleCardsGridProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<CareersRoleCardsGridCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: CareersLocale
  /** The search word and the chosen team, place and type. Pass it to control the filters. */
  filters?: CareersRoleFilters
  /** The filters on first render. */
  defaultFilters?: CareersRoleFilters
  /** Called with the new filters whenever the search or a select changes. */
  onFiltersChange?: (filters: CareersRoleFilters) => void
  /** How many open roles there are in all, when the list holds fewer. Shown while no filter is on. */
  total?: number
  /** The ids of the saved roles. Pass it to control the bookmarks. */
  saved?: string[]
  /** The ids saved on first render. */
  defaultSaved?: string[]
  /** Called with the saved ids after a bookmark is pressed. */
  onSavedChange?: (saved: string[]) => void
  /** Called when a role without an `href` has its button pressed. */
  onRoleSelect?: (role: CareersRole) => void
}

export function CareersRoleCardsGrid({
  locale = "en",
  heading,
  description,
  searchPlaceholder,
  allDepartments,
  allLocations,
  anyType,
  filterLabels,
  showing,
  sortedBy,
  roles,
  viewRole,
  saveRole,
  savedRole,
  empty,
  filters: filtersProp,
  defaultFilters,
  onFiltersChange,
  total,
  saved: savedProp,
  defaultSaved,
  onSavedChange,
  onRoleSelect,
  className,
  ...props
}: CareersRoleCardsGridProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = roles ?? copy.roles
  const [filters, setFilters] = useControllableValue<CareersRoleFilters>(filtersProp, defaultFilters ?? {}, onFiltersChange)
  const [savedIds, setSavedIds] = useControllableValue<string[]>(savedProp, defaultSaved ?? [], onSavedChange)
  const labels = filterLabels ?? copy.filterLabels

  const shown = filterRoles(list, filters)
  const filtered = shown.length !== list.length || !!filters.query?.trim()
  const everything = filtered ? list.length : (total ?? list.length)

  const options = (field: "department" | "location" | "commitment", all: string) => [
    { value: CAREERS_ALL, label: all },
    ...distinctValues(list, field).map((value) => ({ value, label: value })),
  ]
  const setFilter = (field: "department" | "location" | "commitment") => (value: string | null) =>
    setFilters({ ...filters, [field]: value && value !== CAREERS_ALL ? value : undefined })

  const toggleSaved = (id: string) => setSavedIds(savedIds.includes(id) ? savedIds.filter((item) => item !== id) : [...savedIds, id])

  return (
    <CareersSection labelledBy={headingId} className={className} {...props}>
      <CareersHeader headingId={headingId} heading={heading ?? copy.heading} description={description ?? copy.description} />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:justify-between">
          <Input
            type="search"
            size="md"
            aria-label={searchPlaceholder ?? copy.searchPlaceholder}
            placeholder={searchPlaceholder ?? copy.searchPlaceholder}
            startIcon={<Search aria-hidden strokeWidth={1.5} />}
            value={filters.query ?? ""}
            onChange={(event) => setFilters({ ...filters, query: event.target.value || undefined })}
            className="w-full [@container(min-width:64rem)]:max-w-[420px]"
          />
          <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:flex-wrap">
            <Select
              aria-label={labels[0]}
              size="md"
              items={options("department", allDepartments ?? copy.allDepartments)}
              value={filters.department ?? CAREERS_ALL}
              onValueChange={setFilter("department")}
              className="[@container(min-width:40rem)]:w-[200px]"
            />
            <Select
              aria-label={labels[1]}
              size="md"
              items={options("location", allLocations ?? copy.allLocations)}
              value={filters.location ?? CAREERS_ALL}
              onValueChange={setFilter("location")}
              className="[@container(min-width:40rem)]:w-[200px]"
            />
            <Select
              aria-label={labels[2]}
              size="md"
              items={options("commitment", anyType ?? copy.anyType)}
              value={filters.commitment ?? CAREERS_ALL}
              onValueChange={setFilter("commitment")}
              className="[@container(min-width:40rem)]:w-[160px]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <p aria-live="polite">{(showing ?? copy.showing)(shown.length, everything)}</p>
          <p>{sortedBy ?? copy.sortedBy}</p>
        </div>

        {shown.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-3">
            {shown.map((role) => {
              const isSaved = savedIds.includes(role.id)
              const title = typeof role.title === "string" ? role.title : ""
              return (
                <li key={role.id}>
                  <article className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-muted-foreground">{role.department}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-pressed={isSaved}
                        aria-label={`${isSaved ? (savedRole ?? copy.savedRole) : (saveRole ?? copy.saveRole)}: ${title}`}
                        onClick={() => toggleSaved(role.id)}
                      >
                        <Bookmark aria-hidden strokeWidth={1.5} className={cn(isSaved && "fill-current")} />
                      </Button>
                    </div>
                    <div className="flex flex-1 flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-medium text-foreground">{role.title}</h3>
                        {role.summary ? <p className="text-sm text-muted-foreground">{role.summary}</p> : null}
                      </div>
                      <CareersRoleMeta role={role} stacked />
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                      <span className="text-xs text-muted-foreground">{role.posted}</span>
                      <CareersRoleAction role={role} label={viewRole ?? copy.viewRole} variant="ghost" size="sm" arrow onSelect={onRoleSelect} />
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </CareersSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const careersRoleCardsGridCopy = COPY
