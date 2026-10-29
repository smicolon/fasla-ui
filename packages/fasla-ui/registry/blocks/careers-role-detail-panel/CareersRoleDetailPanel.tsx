"use client"

import * as React from "react"
import { Bookmark, X } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import {
  CareersBullets,
  CareersNewBadge,
  CareersPostingSection,
  CareersRoleAction,
  CareersRoleMeta,
  useControllableValue,
  type CareersLocale,
  type CareersPosting,
  type CareersRole,
} from "../careers/careers"

/*
 * Figma: `Careers` (46378:5405), Type=Role Detail Panel.
 *
 * The CONTENT of a role's panel, drawn inline: a header, a body that
 * scrolls, and a footer. The block has no overlay, no focus trap and no
 * motion of its own. Put it inside Sheet's `SheetContent` to slide it in from
 * the side (Desktop and Tablet) or the bottom (Mobile); Sheet owns the
 * overlay, the close on Escape and the slide.
 *
 * The header is a Soft team badge and the New badge, an optional close
 * button, the role's title and one line of place, commitment, pay and team.
 * The body is About the role, What you'll do, What we're looking for and How
 * we hire, each under its heading. The footer, set off by a hairline, is a
 * solid Apply now beside an outline Save.
 *
 * It is as wide as the room it is given, up to 560px. It fills the height it
 * is given and scrolls its body; with no height set, it is as tall as its
 * text. Mobile's footer stacks its two buttons.
 *
 * Save is a callback: the button reports its press and shows the saved state
 * it is told, or keeps one itself. Apply links to `href`, or calls
 * `onRoleSelect`.
 *
 * Content limits: a role's title up to 27 characters, with its New badge. The
 * other limits are in the block's documentation page, which the default copy
 * stays inside.
 */

export interface CareersRoleDetailPanelCopy {
  /** The posting: its team badge (`department`), title, line of facts, sections and link. */
  posting: CareersPosting
  /** The line's team, such as "Design Systems team". */
  teamLine: React.ReactNode
  /** The heading over the paragraph about the role. */
  aboutHeading: string
  /** The heading over what the person will do. */
  responsibilitiesHeading: string
  /** The heading over what the team is looking for. */
  requirementsHeading: string
  /** The heading over how the team hires. */
  hiringHeading: string
  /** The solid button's label. */
  apply: string
  /** The outline button's label. */
  save: string
  /** The outline button's label once the role is saved. */
  savedLabel: string
  /** The close button's name for assistive technology. */
  closeLabel: string
  /** The New badge's text. */
  newLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<CareersLocale, CareersRoleDetailPanelCopy> = {
  en: {
    posting: {
      id: "senior-product-designer",
      title: "Senior Product Designer",
      department: "Design",
      isNew: true,
      location: "Remote (EU)",
      commitment: "Full-time",
      pay: "$95K–$120K",
      about: "You'll own the design-system surface end to end: the token model, the component anatomy, and the documentation that makes both usable by 40 engineers across four product teams.",
      responsibilities: [
        "Own the token model: colour, spacing, radius, typography, and how they theme.",
        "Design components with every state and variant, and document the anatomy.",
        "Pair with engineers to keep the Figma library and the React package in sync.",
        "Run monthly system reviews with the product design team.",
      ],
      requirements: [
        "Five or more years in product design, at least two on a design system.",
        "Fluency with variables, variants, and component APIs in Figma.",
        "Enough code literacy to read a component's props and argue about them.",
      ],
      hiring: "Four steps, about three weeks: intro call, portfolio walkthrough, a paid systems exercise, then a team conversation. Every applicant hears back from a person.",
    },
    teamLine: "Design Systems team",
    aboutHeading: "About the role",
    responsibilitiesHeading: "What you'll do",
    requirementsHeading: "What we're looking for",
    hiringHeading: "How we hire",
    apply: "Apply now",
    save: "Save",
    savedLabel: "Saved",
    closeLabel: "Close",
    newLabel: "New",
  },
  ar: {
    posting: {
      id: "senior-product-designer",
      title: "مصمم/ة منتجات أول",
      department: "التصميم",
      isNew: true,
      location: "عن بُعد (الاتحاد الأوروبي)",
      commitment: "دوام كامل",
      pay: "من 95 إلى 120 ألف دولار",
      about: "تملّك واجهة نظام التصميم من البداية إلى النهاية: نموذج الرموز وتشريح المكوّنات والتوثيق الذي يجعل الاثنين قابلين للاستخدام من قِبل 40 مهندسًا في أربعة فرق منتجات.",
      responsibilities: [
        "تملّك نموذج الرموز: اللون والمسافات والاستدارة والطباعة وكيفية تحويلها إلى سمات.",
        "تصميم المكوّنات بكل حالاتها ومتغيّراتها، وتوثيق تشريحها.",
        "العمل مع المهندسين لإبقاء مكتبة التصميم وحزمة المكوّنات البرمجية متوافقتين.",
        "إدارة مراجعات شهرية للنظام مع فريق تصميم المنتجات.",
      ],
      requirements: [
        "خمس سنوات أو أكثر في تصميم المنتجات، منها سنتان على الأقل في نظام تصميم.",
        "إتقان المتغيّرات والحالات وواجهات المكوّنات في أدوات التصميم.",
        "معرفة كافية بالكود لقراءة خصائص المكوّن ومناقشتها.",
      ],
      hiring: "أربع خطوات، نحو ثلاثة أسابيع: مقابلة تعريفية، استعراض لأعمالك، تمرين مدفوع في الأنظمة، ثم حوار مع الفريق. كل متقدّم يسمع ردًا من شخص حقيقي.",
    },
    teamLine: "فريق أنظمة التصميم",
    aboutHeading: "عن الوظيفة",
    responsibilitiesHeading: "ما ستقوم به",
    requirementsHeading: "ما نبحث عنه",
    hiringHeading: "كيف نوظّف",
    apply: "قدّم الآن",
    save: "حفظ",
    savedLabel: "تم الحفظ",
    closeLabel: "إغلاق",
    newLabel: "جديد",
  },
}

export interface CareersRoleDetailPanelProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<CareersRoleDetailPanelCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: CareersLocale
  /** Draws a close button in the header and calls this when it is pressed. Without it, there is none: Sheet draws its own. */
  onClose?: () => void
  /** Whether the role is saved. Pass it to control the Save button. */
  saved?: boolean
  /** Whether the role is saved on first render. */
  defaultSaved?: boolean
  /** Called with the new saved state when Save is pressed. */
  onSavedChange?: (saved: boolean) => void
  /** Called when Apply is pressed on a posting without an `href`. */
  onRoleSelect?: (role: CareersRole) => void
}

export function CareersRoleDetailPanel({
  locale = "en",
  posting,
  teamLine,
  aboutHeading,
  responsibilitiesHeading,
  requirementsHeading,
  hiringHeading,
  apply,
  save,
  savedLabel,
  closeLabel,
  newLabel,
  onClose,
  saved: savedProp,
  defaultSaved = false,
  onSavedChange,
  onRoleSelect,
  className,
  ...props
}: CareersRoleDetailPanelProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const job = posting ?? copy.posting
  const [isSaved, setSaved] = useControllableValue<boolean>(savedProp, defaultSaved, onSavedChange)
  const title = typeof job.title === "string" ? job.title : ""

  return (
    <section
      aria-labelledby={headingId}
      className={cn("[container-type:inline-size] mx-auto flex h-full min-h-0 w-full max-w-[35rem] flex-col bg-card text-card-foreground", className)}
      {...props}
    >
      <header className="flex flex-col gap-3 border-b border-border p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {job.department ? (
              <Badge variant="soft" tone="secondary" size="sm" radius="rounded">
                {job.department}
              </Badge>
            ) : null}
            {job.isNew ? <CareersNewBadge>{newLabel ?? copy.newLabel}</CareersNewBadge> : null}
          </div>
          {onClose ? (
            <Button type="button" variant="ghost" size="icon-sm" aria-label={closeLabel ?? copy.closeLabel} onClick={onClose}>
              <X aria-hidden strokeWidth={1.5} />
            </Button>
          ) : null}
        </div>
        <h2 id={headingId} className="text-2xl font-semibold text-foreground">
          {job.title}
        </h2>
        <CareersRoleMeta role={job} team={teamLine ?? copy.teamLine} />
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
        {job.about ? (
          <CareersPostingSection heading={aboutHeading ?? copy.aboutHeading}>
            <p className="text-sm text-muted-foreground">{job.about}</p>
          </CareersPostingSection>
        ) : null}
        {job.responsibilities?.length ? (
          <CareersPostingSection heading={responsibilitiesHeading ?? copy.responsibilitiesHeading}>
            <CareersBullets items={job.responsibilities} />
          </CareersPostingSection>
        ) : null}
        {job.requirements?.length ? (
          <CareersPostingSection heading={requirementsHeading ?? copy.requirementsHeading}>
            <CareersBullets items={job.requirements} />
          </CareersPostingSection>
        ) : null}
        {job.hiring ? (
          <CareersPostingSection heading={hiringHeading ?? copy.hiringHeading}>
            <p className="text-sm text-muted-foreground">{job.hiring}</p>
          </CareersPostingSection>
        ) : null}
      </div>

      <footer className="flex flex-col gap-3 border-t border-border p-6 [@container(min-width:30rem)]:flex-row">
        <CareersRoleAction role={job} label={apply ?? copy.apply} variant="default" size="lg" arrow onSelect={onRoleSelect} className="w-full [@container(min-width:30rem)]:flex-1" />
        <Button type="button" variant="outline" size="lg" aria-pressed={isSaved} aria-label={`${isSaved ? (savedLabel ?? copy.savedLabel) : (save ?? copy.save)}: ${title}`} onClick={() => setSaved(!isSaved)} className="w-full [@container(min-width:30rem)]:w-auto">
          <Bookmark aria-hidden strokeWidth={1.5} className={cn(isSaved && "fill-current")} />
          <span>{isSaved ? (savedLabel ?? copy.savedLabel) : (save ?? copy.save)}</span>
        </Button>
      </footer>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const careersRoleDetailPanelCopy = COPY
