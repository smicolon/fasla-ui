"use client"

import * as React from "react"
import { ArrowLeft, Eye, EyeOff, Info, Lock, LockOpen } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"

/*
 * Figma: `Authentications` (42586:4669), Type=Reset Password.
 *
 * A card on a muted page: an unlocked-padlock tile, the heading and the
 * account it is for, a note that other devices will be signed out, the new
 * password twice and Reset password, then a link back to sign in.
 *
 * The confirm field checks itself: on blur, and after a first mismatch on
 * every keystroke, so its error clears the moment the two match.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The card keeps 464px from Tablet up and
 * fills the width on a phone. Direction is the page's `dir`; every side is a
 * logical one, and the back arrow mirrors.
 */

export interface AuthResetPasswordLink {
  label: React.ReactNode
  href: string
}

export interface AuthResetPasswordCopy {
  /** The card's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading: whose password this is. Hidden when empty. */
  description: React.ReactNode
  /** The muted note over the fields. Hidden when empty. */
  note: React.ReactNode
  passwordLabel: React.ReactNode
  passwordPlaceholder: string
  confirmLabel: React.ReactNode
  confirmPlaceholder: string
  /** Under the confirm field while the two passwords differ. */
  mismatchError: React.ReactNode
  /** The eye button's name while the password is hidden. */
  showPassword: string
  /** The eye button's name while the password shows. */
  hidePassword: string
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** Shown under the button when `onSubmit` rejects. */
  error: React.ReactNode
  /** The link under the form, back to sign in. Hidden when null. */
  backLink: AuthResetPasswordLink | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthResetPasswordCopy> = {
  en: {
    heading: "Choose a new password",
    description: "You are resetting the password for alex@northwind.co.",
    note: "Signing in again will be required on all your other devices.",
    passwordLabel: "New password",
    passwordPlaceholder: "Enter a new password",
    confirmLabel: "Confirm new password",
    confirmPlaceholder: "Re-enter the password",
    mismatchError: "Passwords do not match.",
    showPassword: "Show password",
    hidePassword: "Hide password",
    submitLabel: "Reset password",
    pendingLabel: "Resetting the password",
    error: "We couldn’t reset your password. The link may have expired; ask for a new one.",
    backLink: { label: "Back to sign in", href: "#sign-in" },
  },
  ar: {
    heading: "اختر كلمة مرور جديدة",
    description: (
      <>
        تعيد تعيين كلمة المرور للحساب <bdi dir="ltr">alex@northwind.co</bdi>.
      </>
    ),
    note: "سيُطلب منك تسجيل الدخول من جديد على أجهزتك الأخرى كلها.",
    passwordLabel: "كلمة المرور الجديدة",
    passwordPlaceholder: "أدخل كلمة مرور جديدة",
    confirmLabel: "تأكيد كلمة المرور الجديدة",
    confirmPlaceholder: "أعد إدخال كلمة المرور",
    mismatchError: "كلمتا المرور غير متطابقتين.",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    submitLabel: "إعادة تعيين كلمة المرور",
    pendingLabel: "جارٍ إعادة تعيين كلمة المرور",
    error: "تعذّرت إعادة تعيين كلمة المرور. ربما انتهت صلاحية الرابط؛ اطلب رابطًا جديدًا.",
    backLink: { label: "العودة إلى تسجيل الدخول", href: "#sign-in" },
  },
}

export interface AuthResetPasswordProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthResetPasswordCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * Runs when the form is sent and the two passwords match. While its promise
   * is pending the button shows its spinner and the fields are disabled; a
   * rejection shows `error`.
   */
  onSubmit?: (values: { password: string }) => Promise<void> | void
}

const LINK =
  "rounded-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

/**
 * Figma's entrance: the card's parts fade in and rise, one after another.
 * Runs once; skipped under prefers-reduced-motion.
 */
function useEntrance(ref: React.RefObject<HTMLElement | null>, { rise = 12, duration = 320, stagger = 50 } = {}) {
  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root || typeof root.animate !== "function") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
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

export function AuthResetPassword({
  locale = "en",
  heading,
  description,
  note,
  passwordLabel,
  passwordPlaceholder,
  confirmLabel,
  confirmPlaceholder,
  mismatchError,
  showPassword,
  hidePassword,
  submitLabel,
  pendingLabel,
  error,
  backLink,
  onSubmit,
  className,
  ...props
}: AuthResetPasswordProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  // Live once the visitor has seen a mismatch: until then the field waits for blur.
  const [checking, setChecking] = React.useState(false)
  const back = backLink === undefined ? copy.backLink : backLink
  const subline = description ?? copy.description
  const strip = note ?? copy.note
  const mismatch = checking && confirm !== "" && confirm !== password
  useEntrance(cardRef)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (confirm !== password) {
      setChecking(true)
      return
    }
    if (!onSubmit) return
    setStatus("pending")
    try {
      await onSubmit({ password })
      setStatus("idle")
    } catch {
      setStatus("error")
    }
  }

  const eye = { show: showPassword ?? copy.showPassword, hide: hidePassword ?? copy.hidePassword }

  return (
    <section aria-labelledby={headingId} className={cn("flex justify-center bg-muted p-8 md:p-16 lg:p-24", className)} {...props}>
      <div
        ref={cardRef}
        className="flex w-full flex-col items-start gap-7 rounded-xl border border-border bg-card p-8 text-card-foreground shadow-md md:max-w-[464px]"
      >
        <div data-entrance="" className="flex w-full flex-col items-start gap-2">
          <div className="flex size-12 items-center justify-center rounded-md bg-muted text-foreground">
            <LockOpen size={22} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-[22px]" />
          </div>
          <h1 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl">
            {heading ?? copy.heading}
          </h1>
          {subline ? <p className="text-sm text-muted-foreground">{subline}</p> : null}
        </div>

        {strip ? (
          <div data-entrance="" className="flex w-full items-start gap-2.5 rounded-md bg-muted p-3.5 text-foreground">
            <Info size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-4 shrink-0" />
            <p className="text-xs">{strip}</p>
          </div>
        ) : null}

        <form data-entrance="" onSubmit={submit} className="w-full">
          <fieldset disabled={status === "pending"} className="flex w-full min-w-0 flex-col gap-4">
            <PasswordInput
              name="password"
              label={passwordLabel ?? copy.passwordLabel}
              placeholder={passwordPlaceholder ?? copy.passwordPlaceholder}
              value={password}
              onValueChange={setPassword}
              eye={eye}
            />
            <PasswordInput
              name="confirm"
              label={confirmLabel ?? copy.confirmLabel}
              placeholder={confirmPlaceholder ?? copy.confirmPlaceholder}
              value={confirm}
              onValueChange={setConfirm}
              onBlur={() => confirm !== "" && setChecking(true)}
              invalid={mismatch}
              error={mismatchError ?? copy.mismatchError}
              eye={eye}
            />
            <Button type="submit" loading={status === "pending"} loadingLabel={pendingLabel ?? copy.pendingLabel} className="w-full">
              {submitLabel ?? copy.submitLabel}
            </Button>
            <p role="alert" className="text-sm text-destructive empty:hidden">
              {status === "error" ? (error ?? copy.error) : null}
            </p>
          </fieldset>
        </form>

        {back ? (
          <div data-entrance="" className="flex w-full justify-center">
            <a href={back.href} className={cn("flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground", LINK)}>
              <ArrowLeft size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-3.5 shrink-0 rtl:-scale-x-100" />
              {back.label}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  )
}

/**
 * A new-password field with Figma's eye: a real toggle that shows the
 * password as plain text and back.
 */
function PasswordInput({
  name,
  label,
  placeholder,
  value,
  onValueChange,
  onBlur,
  invalid,
  error,
  eye,
}: {
  name: string
  label: React.ReactNode
  placeholder: string
  value: string
  onValueChange: (value: string) => void
  onBlur?: () => void
  invalid?: boolean
  error?: React.ReactNode
  eye: { show: string; hide: string }
}) {
  const [visible, setVisible] = React.useState(false)
  return (
    <Input
      type={visible ? "text" : "password"}
      name={name}
      autoComplete="new-password"
      required
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      onBlur={onBlur}
      invalid={invalid}
      error={invalid ? error : undefined}
      startIcon={<Lock size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />}
      endIcon={
        <button
          type="button"
          aria-label={visible ? eye.hide : eye.show}
          aria-pressed={visible}
          onClick={() => setVisible((shown) => !shown)}
          className="-m-1 flex rounded-sm p-1 text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
        >
          {visible ? (
            <Eye size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
          ) : (
            <EyeOff size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
          )}
        </button>
      }
    />
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const authResetPasswordCopy = COPY
