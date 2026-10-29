"use client"

import * as React from "react"
import {
  CareersHeader,
  CareersNewBadge,
  CareersRoleAction,
  CareersSection,
  Figures,
  arabicCount,
  type CareersLocale,
  type CareersRole,
} from "../careers/careers"

/*
 * Figma: `Careers` (46378:5405), Type=Roles by Department.
 *
 * A header, then one group per team. A group is the team's name, how many
 * roles it has open and a line on what the team does, beside the team's roles
 * as a list ruled by hairlines. A role is its title with its New badge, one
 * line of place, commitment and pay, and an Apply button at the end.
 *
 * Desktop sets the team beside its list, 300px wide. Tablet and Mobile stack
 * them, the team over its list. In Arabic the group runs right to left, so
 * the team sits on the right and Apply at the left edge of each row.
 *
 * Each group counts its own roles, so the count never disagrees with the
 * list under it.
 *
 * Content limits: a role's title up to 27 characters, with its New badge.
 * The other limits are in the block's documentation page, which the default
 * copy stays inside.
 */

export interface CareersDepartment {
  /** Keys the group. */
  id: string
  /** The team's name. */
  name: React.ReactNode
  /** A line on what the team does. */
  description?: React.ReactNode
  /** The team's open roles. */
  roles: CareersRole[]
}

export interface CareersRolesByDepartmentCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The teams, in order. */
  departments: CareersDepartment[]
  /** A team's count of open roles, given how many it has. */
  count: (roles: number) => React.ReactNode
  /** What separates the place, commitment and pay on a role's line. */
  separator: string
  /** The label of every role's button. */
  apply: string
  /** The New badge's text. */
  newLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<CareersLocale, CareersRolesByDepartmentCopy> = {
  en: {
    heading: "Roles by team",
    description: "Ten open roles across four teams. Pick the group you'd fit in and go from there.",
    departments: [
      {
        id: "design",
        name: "Design",
        description: "Product, systems, and motion design. We ship the library every other team builds on.",
        roles: [
          { id: "senior-product-designer", title: "Senior Product Designer", location: "Remote (EU)", commitment: "Full-time", pay: "$95K–$120K", isNew: true },
          { id: "motion-designer", title: "Motion Designer", location: "Remote", commitment: "Contract", pay: "$70K–$90K" },
          { id: "design-ops-lead", title: "Design Ops Lead", location: "Amman", commitment: "Full-time", pay: "$90K–$115K" },
        ],
      },
      {
        id: "engineering",
        name: "Engineering",
        description: "The people who turn tokens into code and keep the design-to-code pipeline honest.",
        roles: [
          { id: "design-systems-engineer", title: "Design Systems Engineer", location: "Berlin · Hybrid", commitment: "Full-time", pay: "$110K–$140K", isNew: true },
          { id: "frontend-engineer", title: "Frontend Engineer", location: "Remote", commitment: "Full-time", pay: "$100K–$130K" },
          { id: "infrastructure-engineer", title: "Infrastructure Engineer", location: "Remote", commitment: "Full-time", pay: "$105K–$135K" },
        ],
      },
      {
        id: "product",
        name: "Product",
        description: "Roadmap, documentation, and the decisions that keep the system coherent.",
        roles: [
          { id: "product-manager-platform", title: "Product Manager, Platform", location: "Amman · Hybrid", commitment: "Full-time", pay: "$80K–$105K" },
          { id: "technical-writer", title: "Technical Writer", location: "Remote", commitment: "Part-time", pay: "$55K–$70K" },
        ],
      },
      {
        id: "go-to-market",
        name: "Go-to-market",
        description: "Adoption, advocacy, and the humans who make the system actually land.",
        roles: [
          { id: "developer-advocate", title: "Developer Advocate", location: "Dubai", commitment: "Full-time", pay: "$85K–$110K" },
          { id: "customer-success-manager", title: "Customer Success Manager", location: "Remote", commitment: "Full-time", pay: "$65K–$85K" },
        ],
      },
    ],
    count: (roles) => `${roles} open ${roles === 1 ? "role" : "roles"}`,
    separator: " · ",
    apply: "Apply",
    newLabel: "New",
  },
  ar: {
    heading: "الوظائف حسب الفريق",
    description: "عشر وظائف متاحة في أربعة فرق. اختر الفريق الذي تناسبه وابدأ من هناك.",
    departments: [
      {
        id: "design",
        name: "التصميم",
        description: "تصميم المنتجات والأنظمة والحركة. نطلق المكتبة التي تبني عليها كل الفرق الأخرى.",
        roles: [
          { id: "senior-product-designer", title: "مصمم/ة منتجات أول", location: "عن بُعد (الاتحاد الأوروبي)", commitment: "دوام كامل", pay: "من 95 إلى 120 ألف دولار", isNew: true },
          { id: "motion-designer", title: "مصمم/ة حركة", location: "عن بُعد", commitment: "عقد", pay: "من 70 إلى 90 ألف دولار" },
          { id: "design-ops-lead", title: "قائد/ة عمليات التصميم", location: "عمّان", commitment: "دوام كامل", pay: "من 90 إلى 115 ألف دولار" },
        ],
      },
      {
        id: "engineering",
        name: "الهندسة",
        description: "الأشخاص الذين يحوّلون الرموز إلى كود ويحافظون على نزاهة مسار التصميم إلى الكود.",
        roles: [
          { id: "design-systems-engineer", title: "مهندس/ة أنظمة تصميم", location: "برلين، هجين", commitment: "دوام كامل", pay: "من 110 إلى 140 ألف دولار", isNew: true },
          { id: "frontend-engineer", title: "مهندس/ة واجهات أمامية", location: "عن بُعد", commitment: "دوام كامل", pay: "من 100 إلى 130 ألف دولار" },
          { id: "infrastructure-engineer", title: "مهندس/ة بنية تحتية", location: "عن بُعد", commitment: "دوام كامل", pay: "من 105 إلى 135 ألف دولار" },
        ],
      },
      {
        id: "product",
        name: "المنتج",
        description: "خطة الطريق والتوثيق والقرارات التي تحفظ تماسك النظام.",
        roles: [
          { id: "product-manager-platform", title: "مدير/ة منتج، المنصة", location: "عمّان، هجين", commitment: "دوام كامل", pay: "من 80 إلى 105 ألف دولار" },
          { id: "technical-writer", title: "كاتب/ة تقني", location: "عن بُعد", commitment: "دوام جزئي", pay: "من 55 إلى 70 ألف دولار" },
        ],
      },
      {
        id: "go-to-market",
        name: "التسويق والنمو",
        description: "التبنّي والمناصرة والأشخاص الذين يجعلون النظام ينجح فعلاً.",
        roles: [
          { id: "developer-advocate", title: "مناصر/ة المطوّرين", location: "دبي", commitment: "دوام كامل", pay: "من 85 إلى 110 ألف دولار" },
          { id: "customer-success-manager", title: "مدير/ة نجاح العملاء", location: "عن بُعد", commitment: "دوام كامل", pay: "من 65 إلى 85 ألف دولار" },
        ],
      },
    ],
    count: (roles) =>
      arabicCount(roles, { zero: "لا توجد وظائف متاحة", one: "وظيفة متاحة واحدة", two: "وظيفتان متاحتان", few: "{n} وظائف متاحة", many: "{n} وظيفة متاحة" }),
    separator: "، ",
    apply: "قدّم الآن",
    newLabel: "جديد",
  },
}

export interface CareersRolesByDepartmentProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<CareersRolesByDepartmentCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: CareersLocale
  /** Called when a role without an `href` has its button pressed. */
  onRoleSelect?: (role: CareersRole) => void
}

/** A role's place, commitment and pay as one line, each figure kept in order inside Arabic text. */
function RoleLine({ role, separator }: { role: CareersRole; separator: string }) {
  const parts = [role.location, role.commitment, role.pay].filter(Boolean)
  return (
    <p className="text-sm text-muted-foreground">
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 ? separator : null}
          <Figures>{part}</Figures>
        </React.Fragment>
      ))}
    </p>
  )
}

export function CareersRolesByDepartment({
  locale = "en",
  heading,
  description,
  departments,
  count,
  separator,
  apply,
  newLabel,
  onRoleSelect,
  className,
  ...props
}: CareersRolesByDepartmentProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const groups = departments ?? copy.departments

  return (
    <CareersSection labelledBy={headingId} className={className} {...props}>
      <CareersHeader headingId={headingId} heading={heading ?? copy.heading} description={description ?? copy.description} />

      <div className="flex flex-col gap-12">
        {groups.map((group) => (
          <div key={group.id} className="grid grid-cols-1 gap-6 [@container(min-width:64rem)]:grid-cols-[18.75rem_minmax(0,1fr)] [@container(min-width:64rem)]:gap-12">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-medium text-foreground">{group.name}</h3>
              <p className="text-sm text-muted-foreground">{(count ?? copy.count)(group.roles.length)}</p>
              {group.description ? <p className="text-sm text-muted-foreground">{group.description}</p> : null}
            </div>
            <ul className="flex flex-col border-t border-border">
              {group.roles.map((role) => (
                <li key={role.id} className="flex items-center justify-between gap-4 border-b border-border py-4">
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-medium text-foreground">{role.title}</h4>
                      {role.isNew ? <CareersNewBadge>{newLabel ?? copy.newLabel}</CareersNewBadge> : null}
                    </div>
                    <RoleLine role={role} separator={separator ?? copy.separator} />
                  </div>
                  <CareersRoleAction role={role} label={apply ?? copy.apply} variant="ghost" size="sm" arrow onSelect={onRoleSelect} className="shrink-0" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </CareersSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const careersRolesByDepartmentCopy = COPY
