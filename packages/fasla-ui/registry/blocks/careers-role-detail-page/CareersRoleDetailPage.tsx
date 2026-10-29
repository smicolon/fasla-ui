"use client"

import * as React from "react"
import { Bookmark, Link2, Mail, Share2 } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../ui/breadcrumb/breadcrumb"
import { Button, buttonVariants } from "../../ui/button/button"
import {
  CareersBullets,
  CareersNewBadge,
  CareersPostingSection,
  CareersRoleAction,
  CareersRoleMeta,
  CareersSection,
  Figures,
  useControllableValue,
  type CareersLocale,
  type CareersPosting,
  type CareersRole,
} from "../careers/careers"

/*
 * Figma: `Careers` (46378:5405), Type=Role Detail Page.
 *
 * A role as a page of its own: a breadcrumb, a photo banner across the top,
 * then the role's badges, title, one line of facts and three actions (a solid
 * Apply for this role, an outline Save role and a ghost Share). Under it, the
 * posting on the start side, About Fasla, About the role, What you'll do,
 * What we're looking for, Nice to have, What we offer in two columns, How we
 * hire and an Equal opportunity note on `muted`; and on the end side a card
 * with the role's facts, Apply now, Save for later and who to write to, and a
 * Share this role card with three icon buttons.
 *
 * Desktop sets the card at the end of the posting, 352px wide. Tablet and
 * Mobile put it under the posting, full width, where Figma's phone has its
 * fixed bottom bar.
 *
 * Where it differs from Figma, on purpose: the card does not stick to the
 * window while the posting scrolls, the page does not underline the section
 * being read, the banner photo does not move at its own pace, and Mobile's
 * bottom bar is the static card above. Nothing here is pinned or scroll-driven.
 *
 * Save and Share are callbacks. Save reports its press and shows the saved
 * state it is told, or keeps one itself. Share's link button copies the page's
 * address (or `shareUrl`) and says so, the email button opens the reader's
 * mail with the address in it, and the third opens the device's share sheet
 * where there is one; each reports through `onShare`.
 *
 * Content limits: a role's title up to 27 characters, with its New badge. The
 * other limits are in the block's documentation page, which the default copy
 * stays inside.
 */

export interface CareersPagePosting extends CareersPosting {
  /** The line of hours in the facts under the title, such as "Full-time · 4-day week". Defaults to `commitment`. */
  hours?: string
  /** The paragraph under "About the company". */
  aboutCompany?: React.ReactNode
  /** What would be good to have, one bullet each. */
  niceToHave?: string[]
  /** What the company offers, one bullet each, in two columns from Tablet. */
  offers?: string[]
  /** When the role was posted, in the card. */
  posted?: React.ReactNode
  /** When applications close, in the card. */
  closing?: React.ReactNode
  /** The Equal opportunity note: its title and its text. */
  equalOpportunity?: { title: React.ReactNode; text: React.ReactNode }
}

export interface CareersBreadcrumbStep {
  label: string
  /** Where the step goes. The last step is the page itself and takes none. */
  href?: string
}

export interface CareersRoleDetailPageCopy {
  /** The posting. `about` may be a list of paragraphs. */
  posting: CareersPagePosting
  /** The team after the people mark, such as "Design Systems team". */
  teamLine: React.ReactNode
  /** Names the breadcrumb for assistive technology. */
  breadcrumbLabel: string
  /** The breadcrumb's steps; the last is the page. */
  breadcrumb: CareersBreadcrumbStep[]
  /** The section headings. */
  aboutCompanyHeading: string
  aboutHeading: string
  responsibilitiesHeading: string
  requirementsHeading: string
  niceToHaveHeading: string
  offersHeading: string
  hiringHeading: string
  /** The solid button's label under the title. */
  apply: string
  /** The outline button's label under the title. */
  saveRole: string
  /** The outline button's label once the role is saved. */
  savedRole: string
  /** The ghost button's label under the title. */
  share: string
  /** The card's title. */
  cardTitle: string
  /** The card's six fact labels: salary, place, commitment, team, posted, closing. */
  factLabels: [string, string, string, string, string, string]
  /** The card's solid button's label. */
  applyNow: string
  /** The card's outline button's label. */
  saveForLater: string
  /** The card's outline button's label once the role is saved. */
  savedForLater: string
  /** The line before the address in the card. */
  questions: string
  /** The address to write to. */
  contactEmail: string
  /** The Share card's title. */
  shareTitle: string
  /** The three icon buttons' names: copy the link, send an email, share. */
  shareLabels: [string, string, string]
  /** Said once the link has been copied. */
  copied: string
  /** The New badge's text. */
  newLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<CareersLocale, CareersRoleDetailPageCopy> = {
  en: {
    posting: {
      id: "senior-product-designer",
      title: "Senior Product Designer",
      department: "Design",
      isNew: true,
      location: "Remote (EU)",
      commitment: "Full-time",
      hours: "Full-time · 4-day week",
      pay: "$95K–$120K",
      team: "Design Systems",
      posted: "12 August 2026",
      closing: "5 September 2026",
      aboutCompany:
        "Fasla builds the design system that four product teams ship on: a token model, a Figma library, and a React package that stay in step. We are 60 people across Amman, Berlin, Dubai and a lot of home offices, and we work a four-day week.",
      about: [
        "You'll own the design-system surface end to end: the token model, the component anatomy, and the documentation that makes both usable by 40 engineers.",
        "This is a builder's role, not a governance one. You will spend most of your week in Figma and in review, and the rest arguing productively about component APIs with the engineers who consume them.",
      ],
      responsibilities: [
        "Own the token model (colour, spacing, radius, typography) and how it themes for light and dark.",
        "Design components with every state and variant, and document the anatomy so nobody has to ask.",
        "Pair with Design Systems Engineers to keep the Figma library and the React package in sync.",
        "Run monthly system reviews with product designers and turn the findings into a roadmap.",
        "Improve the contribution path so product teams can propose components without a bottleneck.",
      ],
      requirements: [
        "Five or more years in product design, at least two of them on a design system.",
        "Fluency with variables, variants, and component properties in Figma, not just consuming them.",
        "Enough code literacy to read a component's props and have an opinion about them.",
        "Writing that makes a spec unambiguous. Most of the job is written down.",
      ],
      niceToHave: ["Experience taking a system through a rebrand or a theming migration.", "Public writing, talks, or open-source work on design systems."],
      offers: [
        "A four-day week, every week",
        "Remote-first with quarterly team weeks",
        "€2,000 yearly learning budget",
        "Latest hardware, your choice of OS",
        "Private health cover for you and family",
        "Six weeks paid leave plus public holidays",
      ],
      hiring:
        "Four steps over about three weeks: a 30-minute intro call, a portfolio walkthrough with two designers, a paid systems exercise you keep, then a team conversation. Every applicant hears back from a person, whatever the outcome.",
      equalOpportunity: {
        title: "Equal opportunity",
        text: "Fasla hires on craft and evidence. We welcome applicants of every background, and we will adjust any part of this process on request. Just say so in your application.",
      },
    },
    teamLine: "Design Systems team",
    breadcrumbLabel: "Breadcrumb",
    breadcrumb: [{ label: "Careers", href: "#" }, { label: "Design", href: "#" }, { label: "Senior Product Designer" }],
    aboutCompanyHeading: "About Fasla",
    aboutHeading: "About the role",
    responsibilitiesHeading: "What you'll do",
    requirementsHeading: "What we're looking for",
    niceToHaveHeading: "Nice to have",
    offersHeading: "What we offer",
    hiringHeading: "How we hire",
    apply: "Apply for this role",
    saveRole: "Save role",
    savedRole: "Saved",
    share: "Share",
    cardTitle: "Apply for this role",
    factLabels: ["Salary", "Location", "Commitment", "Team", "Posted", "Closing"],
    applyNow: "Apply now",
    saveForLater: "Save for later",
    savedForLater: "Saved for later",
    questions: "Questions?",
    contactEmail: "talent@fasla.com",
    shareTitle: "Share this role",
    shareLabels: ["Copy link", "Share by email", "Share"],
    copied: "Link copied",
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
      hours: "دوام كامل، أسبوع من 4 أيام",
      pay: "من 95 إلى 120 ألف دولار",
      team: "أنظمة التصميم",
      posted: "12 أغسطس 2026",
      closing: "5 سبتمبر 2026",
      aboutCompany:
        "تبني فاصلة نظام التصميم الذي تطلق عليه أربعة فرق منتجات أعمالها: نموذج رموز، ومكتبة تصميم، وحزمة مكوّنات برمجية تبقى متوافقة. نحن 60 شخصًا في عمّان وبرلين ودبي والكثير من المكاتب المنزلية، ونعمل أسبوعًا من أربعة أيام.",
      about: [
        "تملّك واجهة نظام التصميم من البداية إلى النهاية: نموذج الرموز وتشريح المكوّنات والتوثيق الذي يجعل الاثنين قابلين للاستخدام من قِبل 40 مهندسًا.",
        "هذه وظيفة بناء لا وظيفة إدارة. ستقضي معظم أسبوعك في أدوات التصميم وفي المراجعة، والبقية في نقاش مثمر حول واجهات المكوّنات مع المهندسين الذين يستخدمونها.",
      ],
      responsibilities: [
        "تملّك نموذج الرموز (اللون والمسافات والاستدارة والطباعة) وكيف يتحوّل إلى سمات فاتحة وداكنة.",
        "تصميم المكوّنات بكل حالاتها ومتغيّراتها، وتوثيق تشريحها حتى لا يحتاج أحد للسؤال.",
        "العمل مع مهندسي أنظمة التصميم لإبقاء مكتبة التصميم وحزمة المكوّنات البرمجية متوافقتين.",
        "إدارة مراجعات شهرية للنظام مع مصممي المنتجات وتحويل النتائج إلى خطة طريق.",
        "تحسين مسار المساهمة حتى تتمكّن فرق المنتجات من اقتراح مكوّنات دون عوائق.",
      ],
      requirements: [
        "خمس سنوات أو أكثر في تصميم المنتجات، منها سنتان على الأقل في نظام تصميم.",
        "إتقان المتغيّرات والحالات وخصائص المكوّنات في أدوات التصميم، لا مجرّد استخدامها.",
        "معرفة كافية بالكود لقراءة خصائص المكوّن وتكوين رأي فيها.",
        "كتابة تجعل المواصفة واضحة بلا لبس. معظم العمل مكتوب.",
      ],
      niceToHave: ["خبرة في نقل نظام عبر إعادة هوية أو ترحيل سمات.", "كتابات عامة أو محاضرات أو عمل مفتوح المصدر في أنظمة التصميم."],
      offers: [
        "أسبوع من أربعة أيام، كل أسبوع",
        "العمل عن بُعد أولاً مع أسبوع فريق كل ربع",
        "ميزانية تعلّم سنوية 2,000 يورو",
        "أحدث الأجهزة، ونظام التشغيل من اختيارك",
        "تأمين صحي خاص لك ولعائلتك",
        "ستة أسابيع إجازة مدفوعة بالإضافة إلى العطل الرسمية",
      ],
      hiring:
        "أربع خطوات على مدى نحو ثلاثة أسابيع: مقابلة تعريفية 30 دقيقة، استعراض لأعمالك مع مصممين، تمرين مدفوع في الأنظمة تحتفظ به، ثم حوار مع الفريق. كل متقدّم يسمع ردًا من شخص حقيقي، أيًا كانت النتيجة.",
      equalOpportunity: {
        title: "تكافؤ الفرص",
        text: "توظّف فاصلة على أساس الحرفة والدليل. نرحّب بالمتقدّمين من كل الخلفيات، وسنعدّل أي جزء من هذه العملية عند الطلب. اذكر ذلك في طلبك فقط.",
      },
    },
    teamLine: "فريق أنظمة التصميم",
    breadcrumbLabel: "مسار التنقل",
    breadcrumb: [{ label: "الوظائف", href: "#" }, { label: "التصميم", href: "#" }, { label: "مصمم/ة منتجات أول" }],
    aboutCompanyHeading: "عن فاصلة",
    aboutHeading: "عن الوظيفة",
    responsibilitiesHeading: "ما ستقوم به",
    requirementsHeading: "ما نبحث عنه",
    niceToHaveHeading: "ميزة إضافية",
    offersHeading: "ما نقدّمه",
    hiringHeading: "كيف نوظّف",
    apply: "تقدّم لهذه الوظيفة",
    saveRole: "احفظ الوظيفة",
    savedRole: "تم الحفظ",
    share: "شارك",
    cardTitle: "تقدّم لهذه الوظيفة",
    factLabels: ["الراتب", "الموقع", "الالتزام", "الفريق", "تاريخ النشر", "آخر موعد"],
    applyNow: "قدّم الآن",
    saveForLater: "احفظ لوقت لاحق",
    savedForLater: "تم الحفظ",
    questions: "أسئلة؟",
    contactEmail: "talent@fasla.com",
    shareTitle: "شارك هذه الوظيفة",
    shareLabels: ["نسخ الرابط", "المشاركة بالبريد", "مشاركة"],
    copied: "تم نسخ الرابط",
    newLabel: "جديد",
  },
}

export type CareersShareChannel = "link" | "email" | "native"

export interface CareersRoleDetailPagePhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface CareersRoleDetailPageProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<CareersRoleDetailPageCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: CareersLocale
  /** The banner photo across the top. A `muted` band shows without it. */
  photo?: CareersRoleDetailPagePhoto
  /** Whether the role is saved. Pass it to control both Save buttons. */
  saved?: boolean
  /** Whether the role is saved on first render. */
  defaultSaved?: boolean
  /** Called with the new saved state when either Save button is pressed. */
  onSavedChange?: (saved: boolean) => void
  /** The address the Share buttons share. Defaults to the page's own. */
  shareUrl?: string
  /** Called with the posting and the channel when a Share button is pressed. */
  onShare?: (role: CareersRole, channel: CareersShareChannel) => void
  /** Called when Apply is pressed on a posting without an `href`. */
  onRoleSelect?: (role: CareersRole) => void
}

/** A paragraph, or a list of them. */
const paragraphs = (node: React.ReactNode, className: string) =>
  (Array.isArray(node) ? node : [node]).map((item, index) => (
    <p key={index} className={className}>
      {item}
    </p>
  ))

export function CareersRoleDetailPage({
  locale = "en",
  posting,
  teamLine,
  breadcrumbLabel,
  breadcrumb,
  aboutCompanyHeading,
  aboutHeading,
  responsibilitiesHeading,
  requirementsHeading,
  niceToHaveHeading,
  offersHeading,
  hiringHeading,
  apply,
  saveRole,
  savedRole,
  share,
  cardTitle,
  factLabels,
  applyNow,
  saveForLater,
  savedForLater,
  questions,
  contactEmail,
  shareTitle,
  shareLabels,
  copied,
  newLabel,
  photo,
  saved: savedProp,
  defaultSaved = false,
  onSavedChange,
  shareUrl,
  onShare,
  onRoleSelect,
  className,
  ...props
}: CareersRoleDetailPageProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const job = posting ?? copy.posting
  const labels = factLabels ?? copy.factLabels
  const shareNames = shareLabels ?? copy.shareLabels
  const steps = breadcrumb ?? copy.breadcrumb
  const email = contactEmail ?? copy.contactEmail
  const [isSaved, setSaved] = useControllableValue<boolean>(savedProp, defaultSaved, onSavedChange)
  const [isCopied, setIsCopied] = React.useState(false)
  const [pageUrl, setPageUrl] = React.useState(shareUrl ?? "")
  React.useEffect(() => {
    if (!shareUrl) setPageUrl(window.location.href)
  }, [shareUrl])
  const title = typeof job.title === "string" ? job.title : ""

  const shareVia = async (channel: CareersShareChannel) => {
    onShare?.(job, channel)
    if (channel === "email") return
    const url = shareUrl ?? pageUrl
    try {
      if (channel === "native" && typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title: title || undefined, url })
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        setIsCopied(true)
      }
    } catch {
      // Closing the share sheet rejects; nothing went wrong.
    }
  }

  const saveButton = (label: string, savedText: string, variant: "outline", className?: string) => (
    <Button type="button" variant={variant} size="md" aria-pressed={isSaved} onClick={() => setSaved(!isSaved)} className={className}>
      <Bookmark aria-hidden strokeWidth={1.5} className={cn(isSaved && "fill-current")} />
      <span>{isSaved ? savedText : label}</span>
    </Button>
  )

  const mailto = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl ?? pageUrl)}`

  return (
    <div className={cn("bg-background", className)} {...props}>
      <div className="[container-type:inline-size]">
        <div className="px-4 py-4 md:px-6 lg:px-24">
          <div className="mx-auto w-full max-w-[1248px]">
            <Breadcrumb aria-label={breadcrumbLabel ?? copy.breadcrumbLabel}>
              <BreadcrumbList>
                {steps.map((step, index) => (
                  <React.Fragment key={step.label}>
                    {index > 0 ? <BreadcrumbSeparator /> : null}
                    <BreadcrumbItem>{index === steps.length - 1 ? <BreadcrumbPage>{step.label}</BreadcrumbPage> : <BreadcrumbLink href={step.href ?? "#"}>{step.label}</BreadcrumbLink>}</BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        <div className="relative h-36 w-full overflow-hidden bg-muted [@container(min-width:40rem)]:h-48 [@container(min-width:64rem)]:h-[18.75rem]">
          {photo ? <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" /> : null}
        </div>
      </div>

      <CareersSection labelledBy={headingId}>
        <header className="flex flex-col items-start gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {job.department ? (
              <Badge variant="soft" tone="secondary" size="sm" radius="rounded">
                {job.department}
              </Badge>
            ) : null}
            {job.isNew ? <CareersNewBadge>{newLabel ?? copy.newLabel}</CareersNewBadge> : null}
          </div>
          <h1 id={headingId} className="text-3xl font-semibold text-foreground [@container(min-width:40rem)]:text-4xl">
            {job.title}
          </h1>
          <CareersRoleMeta role={{ location: job.location, commitment: job.hours ?? job.commitment, pay: job.pay }} team={teamLine ?? copy.teamLine} />
          <div className="flex flex-wrap items-center gap-3">
            <CareersRoleAction role={job} label={apply ?? copy.apply} variant="default" size="md" arrow onSelect={onRoleSelect} />
            {saveButton(saveRole ?? copy.saveRole, savedRole ?? copy.savedRole, "outline")}
            <Button type="button" variant="ghost" size="md" onClick={() => shareVia("native")}>
              <Share2 aria-hidden strokeWidth={1.5} />
              <span>{share ?? copy.share}</span>
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-10 [@container(min-width:64rem)]:grid-cols-[minmax(0,1fr)_22rem] [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:gap-12">
          <div className="flex min-w-0 flex-col gap-10">
            {job.aboutCompany ? (
              <CareersPostingSection heading={aboutCompanyHeading ?? copy.aboutCompanyHeading} level={2}>
                <p className="text-sm text-muted-foreground">{job.aboutCompany}</p>
              </CareersPostingSection>
            ) : null}
            {job.about ? (
              <CareersPostingSection heading={aboutHeading ?? copy.aboutHeading} level={2}>
                {paragraphs(job.about, "text-sm text-muted-foreground")}
              </CareersPostingSection>
            ) : null}
            {job.responsibilities?.length ? (
              <CareersPostingSection heading={responsibilitiesHeading ?? copy.responsibilitiesHeading} level={2}>
                <CareersBullets items={job.responsibilities} />
              </CareersPostingSection>
            ) : null}
            {job.requirements?.length ? (
              <CareersPostingSection heading={requirementsHeading ?? copy.requirementsHeading} level={2}>
                <CareersBullets items={job.requirements} />
              </CareersPostingSection>
            ) : null}
            {job.niceToHave?.length ? (
              <CareersPostingSection heading={niceToHaveHeading ?? copy.niceToHaveHeading} level={2}>
                <CareersBullets items={job.niceToHave} />
              </CareersPostingSection>
            ) : null}
            {job.offers?.length ? (
              <CareersPostingSection heading={offersHeading ?? copy.offersHeading} level={2}>
                <CareersBullets items={job.offers} columns={2} />
              </CareersPostingSection>
            ) : null}
            {job.hiring ? (
              <CareersPostingSection heading={hiringHeading ?? copy.hiringHeading} level={2}>
                <p className="text-sm text-muted-foreground">{job.hiring}</p>
              </CareersPostingSection>
            ) : null}
            {job.equalOpportunity ? (
              <aside className="flex flex-col gap-2 rounded-xl bg-muted p-6 text-foreground">
                <h2 className="text-sm font-semibold">{job.equalOpportunity.title}</h2>
                <p className="text-sm">{job.equalOpportunity.text}</p>
              </aside>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            <section aria-label={cardTitle ?? copy.cardTitle} className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
              <h2 className="text-sm font-semibold text-foreground">{cardTitle ?? copy.cardTitle}</h2>
              <dl className="flex flex-col gap-3 text-sm">
                {[job.pay, job.location, job.commitment, job.team, job.posted, job.closing].map((value, index) =>
                  value ? (
                    <div key={index} className="flex items-baseline justify-between gap-4">
                      <dt className="text-muted-foreground">{labels[index]}</dt>
                      <dd className="text-end font-medium text-foreground">
                        <Figures>{value}</Figures>
                      </dd>
                    </div>
                  ) : null
                )}
              </dl>
              <div className="flex flex-col gap-3 border-t border-border pt-5">
                <CareersRoleAction role={job} label={applyNow ?? copy.applyNow} variant="default" size="md" arrow onSelect={onRoleSelect} className="w-full" />
                {saveButton(saveForLater ?? copy.saveForLater, savedForLater ?? copy.savedForLater, "outline", "w-full")}
              </div>
              <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Mail aria-hidden size={16} strokeWidth={1.5} className="shrink-0" />
                <span>{questions ?? copy.questions}</span>
                <a href={`mailto:${email}`} className="font-medium text-foreground underline underline-offset-4">
                  <bdi dir="ltr">{email}</bdi>
                </a>
              </p>
            </section>

            <section aria-label={shareTitle ?? copy.shareTitle} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
              <h2 className="text-sm font-semibold text-foreground">{shareTitle ?? copy.shareTitle}</h2>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="icon-md" aria-label={shareNames[0]} onClick={() => shareVia("link")}>
                  <Link2 aria-hidden strokeWidth={1.5} />
                </Button>
                <a href={mailto} aria-label={shareNames[1]} onClick={() => onShare?.(job, "email")} className={buttonVariants({ variant: "outline", size: "icon-md" })}>
                  <Mail aria-hidden strokeWidth={1.5} />
                </a>
                <Button type="button" variant="outline" size="icon-md" aria-label={shareNames[2]} onClick={() => shareVia("native")}>
                  <Share2 aria-hidden strokeWidth={1.5} />
                </Button>
              </div>
              <p role="status" className="text-sm text-muted-foreground">
                {isCopied ? (copied ?? copy.copied) : null}
              </p>
            </section>
          </div>
        </div>
      </CareersSection>
    </div>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const careersRoleDetailPageCopy = COPY
