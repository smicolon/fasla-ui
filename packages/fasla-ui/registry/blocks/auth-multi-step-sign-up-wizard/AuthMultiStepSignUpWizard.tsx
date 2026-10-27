"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight, Check, Copy, Link2, Mail, Plus } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"
import { Select, type SelectOption } from "../../ui/select/select"
import { Steps, StepsItem } from "../../ui/steps/steps"

/*
 * Figma: `Authentications` (42586:4669), Type=Multi-Step Sign Up Wizard.
 *
 * The last step of a three-step sign-up, on a plain page: the logo and a step
 * count over the stepper, then a heading, invite rows of email and role,
 * "Add another teammate", a panel with a shareable invite link, and Back,
 * Skip for now and Send invites and finish.
 *
 * Adding a teammate opens a new row in place; Copy puts the link on the
 * clipboard and says "Copied" for 1.5s.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The column keeps 600px from Tablet up
 * and fills the width on a phone, where each invite row stacks the email over
 * the role and the actions stack. Direction is the page's `dir`; the stepper
 * and every row mirror, and the invite link stays left-to-right.
 */

export interface AuthMultiStepSignUpWizardStep {
  label: React.ReactNode
  status: "done" | "current" | "upcoming"
}

export interface AuthMultiStepSignUpWizardInvite {
  email: string
  role: string
}

export interface AuthMultiStepSignUpWizardCopy {
  /** The count at the end of the logo row: "Step 3 of 3". */
  stepCount: React.ReactNode
  /** The stepper's steps, in order. */
  steps: AuthMultiStepSignUpWizardStep[]
  /** Names the stepper for screen readers. */
  stepsLabel: string
  /** The page's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  emailLabel: string
  /** The roles a teammate can have. The first is the default for a new row. */
  roles: SelectOption[]
  roleLabel: string
  /** Placeholders for the first rows' emails; later rows use the last one. */
  emailPlaceholders: string[]
  addLabel: React.ReactNode
  /** The invite-link panel's title. Hidden, with the panel, when empty. */
  linkTitle: React.ReactNode
  /** The line under it: the link, and who can use it. */
  linkDescription: React.ReactNode
  copyLabel: React.ReactNode
  copiedLabel: React.ReactNode
  backLabel: React.ReactNode
  skipLabel: React.ReactNode
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** Shown under the actions when `onSubmit` rejects. */
  error: React.ReactNode
}

const INVITE_URL = "https://fasla.com/join/northwind"

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthMultiStepSignUpWizardCopy> = {
  en: {
    stepCount: "Step 3 of 3",
    steps: [
      { label: "Account", status: "done" },
      { label: "Profile", status: "done" },
      { label: "Invite team", status: "current" },
    ],
    stepsLabel: "Sign-up progress",
    heading: "Invite your teammates",
    description: "Fasla works best with the people you ship with. Add them now or skip and invite later.",
    emailLabel: "Email",
    roles: [
      { value: "editor", label: "Editor" },
      { value: "viewer", label: "Viewer" },
      { value: "admin", label: "Admin" },
    ],
    roleLabel: "Role",
    emailPlaceholders: ["nadia@northwind.co", "omar@northwind.co", "name@northwind.co"],
    addLabel: "Add another teammate",
    linkTitle: "Or share an invite link",
    linkDescription: "fasla.com/join/northwind — anyone with the link can request access.",
    copyLabel: "Copy",
    copiedLabel: "Copied",
    backLabel: "Back",
    skipLabel: "Skip for now",
    submitLabel: "Send invites and finish",
    pendingLabel: "Sending the invites",
    error: "We couldn’t send the invites. Try again in a moment.",
  },
  ar: {
    stepCount: (
      <>
        الخطوة <bdi dir="ltr">3</bdi> من <bdi dir="ltr">3</bdi>
      </>
    ),
    steps: [
      { label: "الحساب", status: "done" },
      { label: "الملف الشخصي", status: "done" },
      { label: "دعوة الفريق", status: "current" },
    ],
    stepsLabel: "التقدّم في إنشاء الحساب",
    heading: "ادعُ زملاء فريقك",
    description: "تعمل فاصلة بأفضل صورة مع فريقك. أضف زملاءك الآن، أو تخطَّ هذه الخطوة وادعُهم لاحقًا.",
    emailLabel: "البريد الإلكتروني",
    roles: [
      { value: "editor", label: "محرّر" },
      { value: "viewer", label: "مشاهد" },
      { value: "admin", label: "مسؤول" },
    ],
    roleLabel: "الدور",
    emailPlaceholders: ["nadia@northwind.co", "omar@northwind.co", "name@northwind.co"],
    addLabel: "إضافة زميل آخر",
    linkTitle: "أو شارك رابط دعوة",
    linkDescription: (
      <>
        <bdi dir="ltr">fasla.com/join/northwind</bdi> — يمكن لأي شخص لديه الرابط طلب الانضمام.
      </>
    ),
    copyLabel: "نسخ",
    copiedLabel: "تم النسخ",
    backLabel: "رجوع",
    skipLabel: "تخطَّ الآن",
    submitLabel: "إرسال الدعوات والإنهاء",
    pendingLabel: "جارٍ إرسال الدعوات",
    error: "تعذّر إرسال الدعوات. حاول مجددًا بعد قليل.",
  },
}

export interface AuthMultiStepSignUpWizardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthMultiStepSignUpWizardCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Your logo, at the start of the top row: Figma shows the 28px Fasla Logo lockup. Nothing shows without it. */
  logo?: React.ReactNode
  /** The link Copy puts on the clipboard. */
  inviteUrl?: string
  /**
   * How many invite rows show on first render.
   * @default 2
   */
  defaultRows?: number
  /**
   * Runs when Send invites and finish is pressed, with the rows that have an
   * email. While its promise is pending the button shows its spinner and the
   * form is disabled; a rejection shows `error`.
   */
  onSubmit?: (invites: AuthMultiStepSignUpWizardInvite[]) => Promise<void> | void
  /** Runs when Skip for now is pressed. */
  onSkip?: () => void
  /** Runs when Back is pressed. */
  onBack?: () => void
  /** Runs after Copy has put `inviteUrl` on the clipboard. */
  onCopyLink?: (url: string) => void
}

/**
 * Figma sets the step names smaller than the Steps default: XS Medium in
 * `muted-foreground`, the current one Semi Bold in `foreground`.
 */
const STEP_LABELS = cn(
  "[&_[data-slot=step-label]]:text-xs [&_[data-slot=step-label]]:font-medium [&_[data-slot=step-label]]:text-muted-foreground",
  "[&_[aria-current=step]_[data-slot=step-label]]:font-semibold [&_[aria-current=step]_[data-slot=step-label]]:text-foreground"
)

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Figma's entrance: the page's parts fade in and rise, one after another.
 * Runs once; skipped under prefers-reduced-motion.
 */
function useEntrance(ref: React.RefObject<HTMLElement | null>, { rise = 12, duration = 320, stagger = 50 } = {}) {
  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root || typeof root.animate !== "function") return
    if (reducedMotion()) return
    const parts = Array.from(root.querySelectorAll<HTMLElement>("[data-entrance]"))
    const animations = parts.map((part, index) =>
      part.animate(
        [{ opacity: 0, transform: `translateY(${rise}px)` }, { opacity: 1, transform: "none" }],
        { duration, delay: index * stagger, easing: "cubic-bezier(0, 0, 0.2, 1)", fill: "backwards" }
      )
    )
    return () => animations.forEach((animation) => animation.cancel())
  }, [ref, rise, duration, stagger])
}

/** Figma's added row: it opens from 0 height over 200ms, its content fading in behind. */
function useRowOpen(ref: React.RefObject<HTMLElement | null>, animate: boolean) {
  React.useLayoutEffect(() => {
    const row = ref.current
    if (!animate || !row || typeof row.animate !== "function" || reducedMotion()) return
    const height = row.getBoundingClientRect().height
    const open = row.animate([{ height: "0px", overflow: "hidden" }, { height: `${height}px`, overflow: "hidden" }], {
      duration: 200,
      easing: "cubic-bezier(0, 0, 0.2, 1)",
    })
    const fade = row.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: 80, fill: "backwards" })
    return () => {
      open.cancel()
      fade.cancel()
    }
    // Once, when the row mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export function AuthMultiStepSignUpWizard({
  locale = "en",
  stepCount,
  steps,
  stepsLabel,
  heading,
  description,
  emailLabel,
  roles,
  roleLabel,
  emailPlaceholders,
  addLabel,
  linkTitle,
  linkDescription,
  copyLabel,
  copiedLabel,
  backLabel,
  skipLabel,
  submitLabel,
  pendingLabel,
  error,
  logo,
  inviteUrl = INVITE_URL,
  defaultRows = 2,
  onSubmit,
  onSkip,
  onBack,
  onCopyLink,
  className,
  ...props
}: AuthMultiStepSignUpWizardProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const columnRef = React.useRef<HTMLDivElement>(null)
  const roleList = roles ?? copy.roles
  const defaultRole = roleList[0]?.value ?? ""
  const placeholders = emailPlaceholders ?? copy.emailPlaceholders
  // Row ids name the fields, so they count from 0 the same way on the server
  // and in the browser. Figma's second row is a Viewer; a row added later
  // starts at the first role.
  const nextRowId = React.useRef(Math.max(defaultRows, 1))
  const [rows, setRows] = React.useState(() =>
    Array.from({ length: Math.max(defaultRows, 1) }, (_, index) => ({
      id: index,
      added: false,
      role: index === 1 ? (roleList[1]?.value ?? defaultRole) : defaultRole,
    }))
  )
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const [copied, setCopied] = React.useState(false)
  const stepList = steps ?? copy.steps
  const subline = description ?? copy.description
  const panelTitle = linkTitle ?? copy.linkTitle
  useEntrance(columnRef)

  React.useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timer)
  }, [copied])

  const addRow = () => {
    const id = nextRowId.current++
    setRows((current) => [...current, { id, added: true, role: defaultRole }])
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard?.writeText(inviteUrl)
    } catch {
      // The clipboard can be refused; the link is still on screen to copy by hand.
    }
    setCopied(true)
    onCopyLink?.(inviteUrl)
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSubmit) return
    const data = new FormData(event.currentTarget)
    const invites = rows
      .map((row) => ({ email: String(data.get(`email-${row.id}`) ?? "").trim(), role: String(data.get(`role-${row.id}`) ?? row.role) }))
      .filter((invite) => invite.email)
    setStatus("pending")
    try {
      await onSubmit(invites)
      setStatus("idle")
    } catch {
      setStatus("error")
    }
  }

  const pending = status === "pending"

  return (
    <section aria-labelledby={headingId} className={cn("flex justify-center bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div ref={columnRef} className="flex w-full flex-col gap-9 md:max-w-[600px]">
        <div data-entrance="" className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            {logo ? <div className="flex h-7 items-center [&>svg]:h-full [&>svg]:w-auto">{logo}</div> : <span />}
            <p className="text-xs font-medium text-muted-foreground">{stepCount ?? copy.stepCount}</p>
          </div>
          <Steps aria-label={stepsLabel ?? copy.stepsLabel} className={STEP_LABELS}>
            {stepList.map((step, index) => (
              <StepsItem key={index} status={step.status} label={step.label} />
            ))}
          </Steps>
        </div>

        <div data-entrance="" className="flex flex-col gap-2">
          <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
            {heading ?? copy.heading}
          </h1>
          {subline ? <p className="text-sm text-muted-foreground">{subline}</p> : null}
        </div>

        <form data-entrance="" onSubmit={submit} className="flex flex-col gap-9">
          <fieldset disabled={pending} className="flex min-w-0 flex-col items-start gap-3">
            {rows.map((row, index) => (
              <InviteRow
                key={row.id}
                id={row.id}
                first={index === 0}
                added={row.added}
                emailLabel={emailLabel ?? copy.emailLabel}
                roleLabel={roleLabel ?? copy.roleLabel}
                placeholder={placeholders[Math.min(index, placeholders.length - 1)] ?? ""}
                roles={roleList}
                role={row.role}
                onRoleChange={(role) =>
                  setRows((current) => current.map((entry) => (entry.id === row.id ? { ...entry, role } : entry)))
                }
              />
            ))}
            <Button type="button" variant="ghost" onClick={addRow}>
              <Plus size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
              {addLabel ?? copy.addLabel}
            </Button>
          </fieldset>

          {panelTitle ? (
            <div className="flex flex-col items-start gap-3 rounded-lg bg-muted p-4 md:flex-row md:items-center">
              <Link2 size={18} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-[18px] shrink-0 text-foreground" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-sm font-semibold text-foreground">{panelTitle}</p>
                <p className="text-xs text-muted-foreground">{linkDescription ?? copy.linkDescription}</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={copyLink} className="w-full shrink-0 md:w-auto">
                {copied ? (
                  <Check size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                ) : (
                  <Copy size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                )}
                <span aria-live="polite">{copied ? (copiedLabel ?? copy.copiedLabel) : (copyLabel ?? copy.copyLabel)}</span>
              </Button>
            </div>
          ) : null}

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Button type="button" variant="ghost" onClick={onBack} disabled={pending} className="w-full md:w-auto">
                <ArrowLeft size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="rtl:-scale-x-100" />
                {backLabel ?? copy.backLabel}
              </Button>
              <div className="flex flex-col gap-2.5 md:flex-row md:items-center">
                <Button type="button" variant="outline" onClick={onSkip} disabled={pending} className="w-full md:w-auto">
                  {skipLabel ?? copy.skipLabel}
                </Button>
                <Button type="submit" loading={pending} loadingLabel={pendingLabel ?? copy.pendingLabel} className="w-full md:w-auto">
                  {submitLabel ?? copy.submitLabel}
                  <ArrowRight size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="rtl:-scale-x-100" />
                </Button>
              </div>
            </div>
            <p role="alert" className="text-sm text-destructive empty:hidden md:text-end">
              {status === "error" ? (error ?? copy.error) : null}
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}

/** One teammate: an email and a role. Only the first row shows the labels; the rest carry them for screen readers. */
function InviteRow({
  id,
  first,
  added,
  emailLabel,
  roleLabel,
  placeholder,
  roles,
  role,
  onRoleChange,
}: {
  id: number
  first: boolean
  added: boolean
  emailLabel: string
  roleLabel: string
  placeholder: string
  roles: SelectOption[]
  role: string
  onRoleChange: (role: string) => void
}) {
  const rowRef = React.useRef<HTMLDivElement>(null)
  useRowOpen(rowRef, added)
  return (
    <div ref={rowRef} className="flex w-full flex-col gap-2.5 md:flex-row md:items-end">
      <Input
        type="email"
        name={`email-${id}`}
        autoComplete="off"
        label={first ? emailLabel : undefined}
        aria-label={first ? undefined : emailLabel}
        placeholder={placeholder}
        startIcon={<Mail size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />}
        className="min-w-0 flex-1"
      />
      <Select
        name={`role-${id}`}
        label={first ? roleLabel : undefined}
        aria-label={first ? undefined : roleLabel}
        items={roles}
        value={role}
        onValueChange={(value) => value && onRoleChange(value)}
        className="w-full md:w-[168px] md:shrink-0"
      />
    </div>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const authMultiStepSignUpWizardCopy = COPY
