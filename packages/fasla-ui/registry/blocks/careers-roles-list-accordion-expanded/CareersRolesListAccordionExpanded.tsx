"use client"

import * as React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion/accordion"
import {
  CareersHeader,
  CareersNewBadge,
  CareersRoleAction,
  CareersSection,
  Figures,
  useControllableValue,
  type CareersLocale,
  type CareersRole,
} from "../careers/careers"

/*
 * Figma: `Careers` (46378:5405), Type=Roles List — Accordion Expanded.
 *
 * A header, a heading row of three columns (position, location, type) and the
 * roles as an accordion: each row is the position with its New badge, its
 * place and type, and a plus. The open row shows the whole description without
 * leaving the list: the role's facts in a small table with a solid Apply now
 * button, and beside it what the role is, what you'll do and what we're
 * looking for.
 *
 * Desktop and Tablet put the facts beside the text; Mobile stacks them and
 * folds the place and type under the position. In Arabic the row and the open
 * panel run right to left.
 *
 * One row is open at a time, as the Accordion does by default. `expanded`
 * names the open row, so a page can open one from a link.
 *
 * Content limits: a role's title up to 27 characters, with its New badge.
 * The other limits are in the block's documentation page, which the default
 * copy stays inside.
 */

export interface CareersRoleFact {
  /** The fact's name, such as "Salary". */
  label: string
  /** Its value. A pay range keeps its figures in order in Arabic. */
  value: React.ReactNode
}

export interface CareersRoleDetail {
  /** The small table: job title, team, salary, contract, hours, place and posting date. */
  facts: CareersRoleFact[]
  /** The paragraph under "About the role". */
  about: React.ReactNode
  /** What the person will do, one bullet each. */
  responsibilities: string[]
  /** What the team is looking for, one bullet each. */
  requirements: string[]
}

export interface CareersRolesListAccordionRole extends CareersRole {
  /** What the open row shows. A row without it opens to its summary. */
  detail?: CareersRoleDetail
}

export interface CareersRolesListAccordionExpandedCopy {
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The three column headings, in order: position, place, type. */
  columns: [string, string, string]
  /** The roles, in order. */
  roles: CareersRolesListAccordionRole[]
  /** The heading of the paragraph about the role. */
  aboutHeading: string
  /** The heading of the list of what the person will do. */
  responsibilitiesHeading: string
  /** The heading of the list of what the team is looking for. */
  requirementsHeading: string
  /** The label of an open row's button. */
  apply: string
  /** The New badge's text. */
  newLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<CareersLocale, CareersRolesListAccordionExpandedCopy> = {
  en: {
    heading: "Open roles",
    description: "Open a role to read the whole description without leaving the list.",
    columns: ["Position", "Location", "Type"],
    roles: [
      {
        id: "senior-product-designer",
        title: "Senior Product Designer",
        location: "Remote (EU)",
        commitment: "Full-time",
        pay: "$95K–$120K",
        isNew: true,
        detail: {
          facts: [
            { label: "Job title", value: "Senior Product Designer" },
            { label: "Team", value: "Product Design" },
            { label: "Salary", value: "$95K–$120K" },
            { label: "Contract", value: "Permanent" },
            { label: "Hours", value: "Full-time · 4-day week" },
            { label: "Location", value: "Remote (EU)" },
            { label: "Posted", value: "26 October 2026" },
          ],
          about:
            "Fasla designs the system four product teams ship on. As Senior Product Designer you own the design-system surface end to end, from the token model to the components people install.",
          responsibilities: [
            "Define the token model and keep Figma and code in step.",
            "Design components with clear anatomy, states, and RTL from the start.",
            "Write the docs that explain when to use each pattern.",
            "Review product work and push back when it fights the system.",
          ],
          requirements: [
            "Several years designing shipped product, ideally a design system.",
            "Fluent in Figma variables, components, and auto layout.",
            "Clear writing, and opinions you can defend.",
          ],
        },
      },
      {
        id: "design-systems-engineer",
        title: "Design Systems Engineer",
        location: "Berlin · Hybrid",
        commitment: "Full-time",
        pay: "$110K–$140K",
        isNew: true,
        detail: {
          facts: [
            { label: "Job title", value: "Design Systems Engineer" },
            { label: "Team", value: "Design Systems" },
            { label: "Salary", value: "$110K–$140K" },
            { label: "Contract", value: "Permanent" },
            { label: "Hours", value: "Full-time · 4-day week" },
            { label: "Location", value: "Berlin · Hybrid" },
            { label: "Posted", value: "12 August 2026" },
          ],
          about:
            "Fasla builds the design system four product teams ship on. As Design Systems Engineer you own the React package that mirrors the Figma library: the token pipeline, the component APIs, and the tests that stop drift before it reaches a product.",
          responsibilities: [
            "Own the token pipeline from Figma variables to published CSS and TS.",
            "Build and maintain components with a public, documented API.",
            "Write the visual-regression and a11y tests that gate every release.",
            "Pair with designers weekly and push back when a spec fights the system.",
          ],
          requirements: [
            "Strong TypeScript and React, and opinions about component APIs.",
            "Experience shipping a component library other teams actually depend on.",
            "Comfort working design-side in Figma, not just consuming handoff.",
          ],
        },
      },
      {
        id: "product-manager-platform",
        title: "Product Manager, Platform",
        location: "Amman · Hybrid",
        commitment: "Full-time",
        pay: "$80K–$105K",
        detail: {
          facts: [
            { label: "Job title", value: "Product Manager, Platform" },
            { label: "Team", value: "Platform" },
            { label: "Salary", value: "$80K–$105K" },
            { label: "Contract", value: "Permanent" },
            { label: "Hours", value: "Full-time" },
            { label: "Location", value: "Amman · Hybrid" },
            { label: "Posted", value: "5 October 2026" },
          ],
          about:
            "The platform team owns tokens, theming, and the pipeline from design to code. As Product Manager, Platform you decide what we build next and prove it worked.",
          responsibilities: [
            "Own the platform roadmap and say no to most of it.",
            "Turn team feedback into specs that engineers and designers can build from.",
            "Measure adoption and report what changed.",
          ],
          requirements: [
            "Experience managing a developer-facing product.",
            "Comfort reading code and talking to designers in the same hour.",
            "A habit of writing things down.",
          ],
        },
      },
      {
        id: "motion-designer",
        title: "Motion Designer",
        location: "Remote",
        commitment: "Contract",
        pay: "$70K–$90K",
        detail: {
          facts: [
            { label: "Job title", value: "Motion Designer" },
            { label: "Team", value: "Motion" },
            { label: "Salary", value: "$70K–$90K" },
            { label: "Contract", value: "Fixed-term" },
            { label: "Hours", value: "Full-time · 6 months" },
            { label: "Location", value: "Remote" },
            { label: "Posted", value: "21 October 2026" },
          ],
          about:
            "Motion is part of how the system feels. As Motion Designer you define how our interfaces move, and document it so every team can reproduce it.",
          responsibilities: [
            "Design micro-interactions and transitions for the core components.",
            "Specify duration, easing, and reduced-motion behaviour.",
            "Write the motion documentation that sits beside each component.",
          ],
          requirements: [
            "A portfolio of interface motion, not only video.",
            "Knowledge of what is cheap and what is costly to build.",
            "Care for people who turn animation off.",
          ],
        },
      },
      {
        id: "developer-advocate",
        title: "Developer Advocate",
        location: "Dubai",
        commitment: "Full-time",
        pay: "$85K–$110K",
        detail: {
          facts: [
            { label: "Job title", value: "Developer Advocate" },
            { label: "Team", value: "Developer Relations" },
            { label: "Salary", value: "$85K–$110K" },
            { label: "Contract", value: "Permanent" },
            { label: "Hours", value: "Full-time" },
            { label: "Location", value: "Dubai" },
            { label: "Posted", value: "14 October 2026" },
          ],
          about:
            "Engineers adopt a design system when it is easy to learn and pleasant to ask about. As Developer Advocate you make both true.",
          responsibilities: [
            "Write guides, sample apps, and migration notes.",
            "Give talks and run workshops for teams adopting the system.",
            "Carry what you hear back to the people who can fix it.",
          ],
          requirements: [
            "You have shipped production code and can explain it plainly.",
            "Experience speaking or teaching, in person or in writing.",
            "Patience for the same question asked ten times.",
          ],
        },
      },
    ],
    aboutHeading: "About the role",
    responsibilitiesHeading: "What you'll do",
    requirementsHeading: "What we're looking for",
    apply: "Apply now",
    newLabel: "New",
  },
  ar: {
    heading: "الوظائف المتاحة",
    description: "افتح وظيفة لقراءة الوصف الكامل دون مغادرة القائمة.",
    columns: ["الوظيفة", "الموقع", "النوع"],
    roles: [
      {
        id: "senior-product-designer",
        title: "مصمم/ة منتجات أول",
        location: "عن بُعد (الاتحاد الأوروبي)",
        commitment: "دوام كامل",
        pay: "من 95 إلى 120 ألف دولار",
        isNew: true,
        detail: {
          facts: [
            { label: "المسمى الوظيفي", value: "مصمم/ة منتجات أول" },
            { label: "الفريق", value: "تصميم المنتجات" },
            { label: "الراتب", value: "من 95 إلى 120 ألف دولار" },
            { label: "نوع العقد", value: "دائم" },
            { label: "ساعات العمل", value: "دوام كامل، أسبوع من 4 أيام" },
            { label: "الموقع", value: "عن بُعد (الاتحاد الأوروبي)" },
            { label: "تاريخ النشر", value: "26 أكتوبر 2026" },
          ],
          about:
            "تصمّم فاصلة النظام الذي تُطلق عليه أربعة فرق منتجات أعمالها. كمصمم/ة منتجات أول، تتملّك واجهة نظام التصميم من أولها إلى آخرها، من نموذج الرموز إلى المكوّنات التي يثبّتها الناس.",
          responsibilities: [
            "تحديد نموذج الرموز والحفاظ على تطابق ملفات التصميم والكود.",
            "تصميم مكوّنات بتشريح وحالات واضحة ودعم الاتجاه من اليمين إلى اليسار منذ البداية.",
            "كتابة التوثيق الذي يشرح متى يُستخدم كل نمط.",
            "مراجعة أعمال المنتجات والاعتراض عندما تتعارض مع النظام.",
          ],
          requirements: [
            "سنوات من تصميم المنتجات المُطلَقة، ويُفضّل أن تشمل نظام تصميم.",
            "إتقان المتغيّرات والمكوّنات والتخطيط التلقائي في أدوات التصميم.",
            "كتابة واضحة وآراء تستطيع الدفاع عنها.",
          ],
        },
      },
      {
        id: "design-systems-engineer",
        title: "مهندس/ة أنظمة تصميم",
        location: "برلين، هجين",
        commitment: "دوام كامل",
        pay: "من 110 إلى 140 ألف دولار",
        isNew: true,
        detail: {
          facts: [
            { label: "المسمى الوظيفي", value: "مهندس/ة أنظمة تصميم" },
            { label: "الفريق", value: "أنظمة التصميم" },
            { label: "الراتب", value: "من 110 إلى 140 ألف دولار" },
            { label: "نوع العقد", value: "دائم" },
            { label: "ساعات العمل", value: "دوام كامل، أسبوع من 4 أيام" },
            { label: "الموقع", value: "برلين، هجين" },
            { label: "تاريخ النشر", value: "12 أغسطس 2026" },
          ],
          about:
            "تبني فاصلة نظام التصميم الذي تُطلق عليه أربعة فرق منتجات أعمالها. كمهندس/ة أنظمة تصميم، تملك حزمة المكوّنات البرمجية التي تعكس مكتبة التصميم: مسار الرموز وواجهات المكوّنات والاختبارات التي تمنع الانحراف قبل وصوله إلى المنتج.",
          responsibilities: [
            "تملّك مسار الرموز من متغيّرات التصميم إلى الأنماط البرمجية المنشورة.",
            "بناء وصيانة المكوّنات بواجهة عامة وموثّقة.",
            "كتابة اختبارات الانحدار البصري وإمكانية الوصول التي تحكم كل إصدار.",
            "العمل مع المصممين أسبوعيًا والاعتراض عندما تتعارض المواصفة مع النظام.",
          ],
          requirements: [
            "إتقان البرمجة بالأنواع وبناء الواجهات، وآراء واضحة حول واجهات المكوّنات.",
            "خبرة في إطلاق مكتبة مكوّنات تعتمد عليها فرق أخرى فعلاً.",
            "القدرة على العمل من جانب التصميم، لا مجرّد استلام التسليم.",
          ],
        },
      },
      {
        id: "product-manager-platform",
        title: "مدير/ة منتج، المنصة",
        location: "عمّان، هجين",
        commitment: "دوام كامل",
        pay: "من 80 إلى 105 ألف دولار",
        detail: {
          facts: [
            { label: "المسمى الوظيفي", value: "مدير/ة منتج، المنصة" },
            { label: "الفريق", value: "المنصة" },
            { label: "الراتب", value: "من 80 إلى 105 ألف دولار" },
            { label: "نوع العقد", value: "دائم" },
            { label: "ساعات العمل", value: "دوام كامل" },
            { label: "الموقع", value: "عمّان، هجين" },
            { label: "تاريخ النشر", value: "5 أكتوبر 2026" },
          ],
          about:
            "يملك فريق المنصة الرموز والسمات ومسار التحويل من التصميم إلى الكود. كمدير/ة منتج للمنصة، تقرّر ما نبنيه تاليًا وتثبت أنه نجح.",
          responsibilities: [
            "تملّك خطة الطريق للمنصة وقول لا لمعظم الطلبات.",
            "تحويل ملاحظات الفرق إلى مواصفات يستطيع المهندسون والمصممون البناء عليها.",
            "قياس التبنّي والإبلاغ بما تغيّر.",
          ],
          requirements: [
            "خبرة في إدارة منتج موجّه للمطوّرين.",
            "ارتياح في قراءة الكود ومحادثة المصممين في الساعة نفسها.",
            "عادة تدوين كل شيء.",
          ],
        },
      },
      {
        id: "motion-designer",
        title: "مصمم/ة حركة",
        location: "عن بُعد",
        commitment: "عقد",
        pay: "من 70 إلى 90 ألف دولار",
        detail: {
          facts: [
            { label: "المسمى الوظيفي", value: "مصمم/ة حركة" },
            { label: "الفريق", value: "الحركة" },
            { label: "الراتب", value: "من 70 إلى 90 ألف دولار" },
            { label: "نوع العقد", value: "محدد المدة" },
            { label: "ساعات العمل", value: "دوام كامل، 6 أشهر" },
            { label: "الموقع", value: "عن بُعد" },
            { label: "تاريخ النشر", value: "21 أكتوبر 2026" },
          ],
          about:
            "الحركة جزء من إحساس النظام. كمصمم/ة حركة، تحدّد كيف تتحرك واجهاتنا وتوثّق ذلك ليستطيع كل فريق تكراره.",
          responsibilities: [
            "تصميم التفاعلات الدقيقة والانتقالات للمكوّنات الأساسية.",
            "تحديد المدة ومنحنى التسارع وسلوك تقليل الحركة.",
            "كتابة توثيق الحركة الذي يرافق كل مكوّن.",
          ],
          requirements: [
            "أعمال سابقة في حركة الواجهات، لا الفيديو فقط.",
            "معرفة ما هو رخيص البناء وما هو مكلف.",
            "اهتمام بمن يوقفون الرسوم المتحركة.",
          ],
        },
      },
      {
        id: "developer-advocate",
        title: "مناصر/ة المطوّرين",
        location: "دبي",
        commitment: "دوام كامل",
        pay: "من 85 إلى 110 ألف دولار",
        detail: {
          facts: [
            { label: "المسمى الوظيفي", value: "مناصر/ة المطوّرين" },
            { label: "الفريق", value: "علاقات المطوّرين" },
            { label: "الراتب", value: "من 85 إلى 110 ألف دولار" },
            { label: "نوع العقد", value: "دائم" },
            { label: "ساعات العمل", value: "دوام كامل" },
            { label: "الموقع", value: "دبي" },
            { label: "تاريخ النشر", value: "14 أكتوبر 2026" },
          ],
          about:
            "يتبنّى المهندسون نظام التصميم حين يسهل تعلّمه ويطيب السؤال عنه. كمناصر/ة للمطوّرين، تجعل الأمرين صحيحين.",
          responsibilities: [
            "كتابة الأدلة والتطبيقات النموذجية وملاحظات الانتقال.",
            "تقديم المحاضرات وإدارة الورش للفرق التي تتبنّى النظام.",
            "نقل ما تسمعه إلى من يستطيع إصلاحه.",
          ],
          requirements: [
            "خبرة في إطلاق كود في الإنتاج والقدرة على شرحه ببساطة.",
            "خبرة في التحدث أو التعليم، حضوريًا أو كتابةً.",
            "صبر على السؤال نفسه إذا تكرر عشر مرات.",
          ],
        },
      },
    ],
    aboutHeading: "عن الوظيفة",
    responsibilitiesHeading: "ما ستقوم به",
    requirementsHeading: "ما نبحث عنه",
    apply: "قدّم الآن",
    newLabel: "جديد",
  },
}

export interface CareersRolesListAccordionExpandedProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<CareersRolesListAccordionExpandedCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: CareersLocale
  /** The id of the open row, or `null` for none. Pass it to control which row is open. */
  expanded?: string | null
  /** The row open on first render. */
  defaultExpanded?: string | null
  /** Called with the id of the row that opened, or `null` when it closed. */
  onExpandedChange?: (id: string | null) => void
  /** Called when a role without an `href` has its Apply button pressed. */
  onRoleSelect?: (role: CareersRole) => void
}

/*
 * The three columns, shared by the heading row and every row's trigger so
 * they line up: the position takes the rest, then the place and the type. The
 * accordion's own plus sits after them, 16px wide.
 */
const COLUMNS = "[@container(min-width:40rem)]:grid-cols-[minmax(0,1fr)_10rem_7rem]"

export function CareersRolesListAccordionExpanded({
  locale = "en",
  heading,
  description,
  columns,
  roles,
  aboutHeading,
  responsibilitiesHeading,
  requirementsHeading,
  apply,
  newLabel,
  expanded: expandedProp,
  defaultExpanded = "design-systems-engineer",
  onExpandedChange,
  onRoleSelect,
  className,
  ...props
}: CareersRolesListAccordionExpandedProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = roles ?? copy.roles
  const heads = columns ?? copy.columns
  const [openId, setOpenId] = useControllableValue<string | null>(expandedProp, defaultExpanded, onExpandedChange)

  return (
    <CareersSection labelledBy={headingId} className={className} {...props}>
      <CareersHeader headingId={headingId} heading={heading ?? copy.heading} description={description ?? copy.description} />

      <div className="flex flex-col">
        <div
          aria-hidden
          className={`hidden gap-x-4 border-b border-border pb-3 pe-8 text-xs font-medium uppercase text-muted-foreground [@container(min-width:40rem)]:grid ${COLUMNS}`}
        >
          {heads.map((head) => (
            <span key={head}>{head}</span>
          ))}
        </div>

        <Accordion variant="default" indicator="plus" value={openId ? [openId] : []} onValueChange={(value) => setOpenId((value[0] as string | undefined) ?? null)}>
          {list.map((role) => (
            <AccordionItem key={role.id} value={role.id}>
              <AccordionTrigger className="gap-4 py-5 text-base">
                <span className={`grid min-w-0 flex-1 grid-cols-1 gap-x-4 gap-y-1 ${COLUMNS}`}>
                  <span className="flex flex-wrap items-center gap-2">
                    <span>{role.title}</span>
                    {role.isNew ? <CareersNewBadge>{newLabel ?? copy.newLabel}</CareersNewBadge> : null}
                  </span>
                  <span className="flex gap-3 text-sm font-normal text-muted-foreground [@container(min-width:40rem)]:contents">
                    <span>{role.location}</span>
                    <span>{role.commitment}</span>
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-8 pt-2">
                <div className="flex flex-col gap-8 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-12">
                  <div className="flex flex-col gap-6 [@container(min-width:40rem)]:w-[20rem] [@container(min-width:40rem)]:shrink-0">
                    {role.detail ? (
                      <dl className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
                        {role.detail.facts.map((fact) => (
                          <React.Fragment key={fact.label}>
                            <dt className="text-muted-foreground">{fact.label}</dt>
                            <dd className="text-foreground">
                              <Figures>{fact.value}</Figures>
                            </dd>
                          </React.Fragment>
                        ))}
                      </dl>
                    ) : null}
                    <CareersRoleAction
                      role={role}
                      label={apply ?? copy.apply}
                      variant="default"
                      size="md"
                      arrow
                      onSelect={onRoleSelect}
                      className="w-full [@container(min-width:40rem)]:w-fit"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-6">
                    <section className="flex flex-col gap-2">
                      <h3 className="text-base font-medium text-foreground">{aboutHeading ?? copy.aboutHeading}</h3>
                      <p className="text-sm text-muted-foreground">{role.detail?.about ?? role.summary}</p>
                    </section>
                    {role.detail ? (
                      <>
                        <section className="flex flex-col gap-2">
                          <h3 className="text-base font-medium text-foreground">{responsibilitiesHeading ?? copy.responsibilitiesHeading}</h3>
                          <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground marker:text-muted-foreground">
                            {role.detail.responsibilities.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </section>
                        <section className="flex flex-col gap-2">
                          <h3 className="text-base font-medium text-foreground">{requirementsHeading ?? copy.requirementsHeading}</h3>
                          <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground marker:text-muted-foreground">
                            {role.detail.requirements.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </section>
                      </>
                    ) : null}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </CareersSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const careersRolesListAccordionExpandedCopy = COPY
