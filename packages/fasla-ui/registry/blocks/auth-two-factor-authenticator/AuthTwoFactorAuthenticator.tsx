"use client"

import * as React from "react"
import { ChevronRight, KeyRound, MessageSquare, Smartphone } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Checkbox } from "../../ui/checkbox/checkbox"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../ui/input-otp/input-otp"

/*
 * Figma: `Authentications` (42586:4669), Type=Two-Factor Authenticator.
 *
 * The second step of a sign-in, for a code from an authenticator app: a phone
 * tile beside the heading and the account, six code slots in one group,
 * "Remember this device", Verify, and under a rule the other ways through
 * for someone without their app.
 *
 * Figma draws seven slots; the code is six digits, so there are six. The
 * form sends itself 150ms after the sixth digit, as Figma's motion notes ask.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The card keeps 456px from Tablet up and
 * fills the width on a phone, with 16px side padding and 44px rows for the
 * other ways through. Direction is the page's `dir`; in Arabic the code fills
 * from the right, as the OTP Input does.
 */

export interface AuthTwoFactorAuthenticatorAlternative {
  /** Passed to `onAlternativeSelect`. */
  id: string
  label: React.ReactNode
  /** A 16px glyph before the label. */
  icon?: React.ReactNode
}

export interface AuthTwoFactorAuthenticatorCopy {
  /** The card's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. `{email}` is replaced by `email`. */
  account: string
  /** The paragraph over the code. Hidden when empty. */
  description: React.ReactNode
  /** The code field's accessible name. */
  codeLabel: string
  rememberLabel: string
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** Shown under the slots when the code is incomplete or `onSubmit` rejects. */
  error: React.ReactNode
  /** The question over the other ways through. */
  alternativesHeading: React.ReactNode
  /** The other ways through. The rule and the list are hidden when empty. */
  alternatives: AuthTwoFactorAuthenticatorAlternative[]
}

const glyph = (Icon: typeof KeyRound) => <Icon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthTwoFactorAuthenticatorCopy> = {
  en: {
    heading: "Two-factor authentication",
    account: "Signing in as {email}",
    description: "Open your authenticator app and enter the 6-digit code for Fasla.",
    codeLabel: "Authentication code",
    rememberLabel: "Remember this device for 30 days",
    submitLabel: "Verify",
    pendingLabel: "Checking the code",
    error: "That code didn’t work. Enter the newest code from your app.",
    alternativesHeading: "Cannot access your authenticator?",
    alternatives: [
      { id: "sms", label: "Send a code by SMS instead", icon: glyph(MessageSquare) },
      { id: "backup-code", label: "Use a backup code", icon: glyph(KeyRound) },
    ],
  },
  ar: {
    heading: "التحقق بخطوتين",
    account: "تسجّل الدخول بحساب {email}",
    description: "افتح تطبيق المصادقة وأدخل رمز فاصلة المكوّن من 6 أرقام.",
    codeLabel: "رمز المصادقة",
    rememberLabel: "تذكّر هذا الجهاز لمدة 30 يومًا",
    submitLabel: "تحقّق",
    pendingLabel: "جارٍ التحقق من الرمز",
    error: "الرمز غير صحيح. أدخل أحدث رمز يظهر في التطبيق.",
    alternativesHeading: "لا يمكنك الوصول إلى تطبيق المصادقة؟",
    alternatives: [
      { id: "sms", label: "أرسل الرمز برسالة نصية بدلًا من ذلك", icon: glyph(MessageSquare) },
      { id: "backup-code", label: "استخدم رمزًا احتياطيًا", icon: glyph(KeyRound) },
    ],
  },
}

export interface AuthTwoFactorAuthenticatorProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthTwoFactorAuthenticatorCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The account signing in, shown in `account`.
   * @default "alex@northwind.co"
   */
  email?: string
  /**
   * Whether "Remember this device" starts ticked, as Figma draws it.
   * @default true
   */
  defaultRemember?: boolean
  /**
   * Runs when the form is sent, by Verify or on its own after the sixth
   * digit. While its promise is pending the button shows its spinner; a
   * rejection marks the slots invalid, shakes them once, clears them and
   * shows `error`.
   */
  onSubmit?: (values: { code: string; remember: boolean }) => Promise<void> | void
  /** Runs with an alternative's `id` when it is pressed. */
  onAlternativeSelect?: (id: string) => void
}

const CODE_LENGTH = 6

/** Splits a copy string on `{name}` and puts `value` in its place. */
function fill(template: string, name: string, value: React.ReactNode) {
  const [before, after] = template.split(`{${name}}`)
  return after === undefined ? template : (
    <>
      {before}
      {value}
      {after}
    </>
  )
}

/** Whether the visitor asks for reduced motion. False on the server. */
const reducedMotion = () => typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Figma's wrong-code shake: 6px left and right over 400ms, once. */
function shake(element: HTMLElement | null) {
  if (!element || typeof element.animate !== "function" || reducedMotion()) return
  element.animate(
    [0, -6, 6, -6, 6, -3, 0].map((x) => ({ transform: `translateX(${x}px)` })),
    { duration: 400, easing: "ease-in-out" }
  )
}

/**
 * Figma's entrance: the card's parts fade in and rise, one after another.
 * Runs once; skipped under prefers-reduced-motion.
 */
function useEntrance(ref: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root || typeof root.animate !== "function" || reducedMotion()) return
    const parts = Array.from(root.querySelectorAll<HTMLElement>("[data-entrance]"))
    const animations = parts.map((part, index) =>
      part.animate(
        [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }],
        { duration: 320, delay: index * 50, easing: "cubic-bezier(0, 0, 0.2, 1)", fill: "backwards" }
      )
    )
    return () => animations.forEach((animation) => animation.cancel())
  }, [ref])
}

export function AuthTwoFactorAuthenticator({
  locale = "en",
  heading,
  account,
  description,
  codeLabel,
  rememberLabel,
  submitLabel,
  pendingLabel,
  error,
  alternativesHeading,
  alternatives,
  email = "alex@northwind.co",
  defaultRemember = true,
  onSubmit,
  onAlternativeSelect,
  className,
  ...props
}: AuthTwoFactorAuthenticatorProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const alternativesId = React.useId()
  const cardRef = React.useRef<HTMLDivElement>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const slotsRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [code, setCode] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const others = alternatives ?? copy.alternatives
  const intro = description ?? copy.description
  useEntrance(cardRef)

  const fail = () => {
    setStatus("error")
    setCode("")
    shake(slotsRef.current)
  }

  // Focus goes back to the code once the form is enabled again after a failure.
  React.useEffect(() => {
    if (status === "error") inputRef.current?.focus()
  }, [status])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "pending") return
    if (code.length < CODE_LENGTH) {
      fail()
      return
    }
    if (!onSubmit) return
    const data = new FormData(event.currentTarget)
    setStatus("pending")
    try {
      await onSubmit({ code, remember: data.get("remember") === "on" })
      setStatus("idle")
    } catch {
      fail()
    }
  }

  // The sixth digit sends the form after a 150ms beat.
  React.useEffect(() => {
    if (code.length !== CODE_LENGTH) return
    const timer = window.setTimeout(() => formRef.current?.requestSubmit(), 150)
    return () => window.clearTimeout(timer)
  }, [code])

  return (
    <section aria-labelledby={headingId} className={cn("flex justify-center bg-muted p-8 md:p-16 lg:p-24", className)} {...props}>
      <div
        ref={cardRef}
        className="flex w-full flex-col gap-7 rounded-xl border border-border bg-card px-4 py-8 text-card-foreground shadow-md md:max-w-[456px] md:px-8"
      >
        <div data-entrance="" className="flex w-full flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
              <Smartphone size={21} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <h1 id={headingId} className="text-lg font-semibold text-foreground md:text-xl">
                {heading ?? copy.heading}
              </h1>
              <p className="text-xs text-muted-foreground">
                {fill(account ?? copy.account, "email", <bdi dir="ltr">{email}</bdi>)}
              </p>
            </div>
          </div>
          {intro ? <p className="text-sm text-muted-foreground">{intro}</p> : null}
        </div>

        <form ref={formRef} data-entrance="" onSubmit={submit} className="w-full">
          <fieldset disabled={status === "pending"} className="flex w-full min-w-0 flex-col gap-7">
            <div className="flex w-full flex-col items-center gap-4">
              <div ref={slotsRef}>
                <InputOTP
                  ref={inputRef}
                  name="code"
                  maxLength={CODE_LENGTH}
                  pattern="^[0-9]+$"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  aria-label={codeLabel ?? copy.codeLabel}
                  aria-invalid={status === "error" || undefined}
                  value={code}
                  onChange={(next) => {
                    setCode(next)
                    if (status === "error") setStatus("idle")
                  }}
                >
                  <InputOTPGroup>
                    {Array.from({ length: CODE_LENGTH }, (_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p role="alert" className="text-center text-sm text-destructive empty:hidden">
                {status === "error" ? (error ?? copy.error) : null}
              </p>
              <Checkbox name="remember" size="sm" defaultChecked={defaultRemember} label={rememberLabel ?? copy.rememberLabel} />
            </div>
            <Button type="submit" loading={status === "pending"} loadingLabel={pendingLabel ?? copy.pendingLabel} className="w-full">
              {submitLabel ?? copy.submitLabel}
            </Button>
          </fieldset>
        </form>

        {others.length > 0 ? (
          <>
            {/* Separator: swap for the Separator component once it ships. */}
            <div data-separator="" aria-hidden="true" className="h-px w-full shrink-0 bg-border" />
            <div data-entrance="" className="flex w-full flex-col gap-3 md:gap-3">
              <p id={alternativesId} className="text-xs font-medium text-muted-foreground">
                {alternativesHeading ?? copy.alternativesHeading}
              </p>
              <ul aria-labelledby={alternativesId} className="flex flex-col md:gap-3">
                {others.map((alternative) => (
                  <li key={alternative.id}>
                    <button
                      type="button"
                      onClick={() => onAlternativeSelect?.(alternative.id)}
                      className="group/alt flex min-h-11 w-full items-center gap-2.5 rounded-sm text-start text-sm font-medium text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:min-h-5"
                    >
                      {alternative.icon ? <span className="flex shrink-0 [&>svg]:size-4">{alternative.icon}</span> : null}
                      <span className="min-w-0 flex-1 underline-offset-4 group-hover/alt:underline">{alternative.label}</span>
                      <ChevronRight
                        size={16}
                        strokeWidth={1.5}
                        absoluteStrokeWidth
                        aria-hidden="true"
                        className="shrink-0 text-muted-foreground transition-transform group-hover/alt:translate-x-0.5 motion-reduce:transition-none rtl:-scale-x-100 rtl:group-hover/alt:-translate-x-0.5"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const authTwoFactorAuthenticatorCopy = COPY
