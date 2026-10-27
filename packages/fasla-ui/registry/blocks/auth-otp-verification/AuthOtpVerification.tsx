"use client"

import * as React from "react"
import { Lock, ShieldCheck, Timer } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../ui/input-otp/input-otp"

/*
 * Figma: `Authentications` (42586:4669), Type=OTP Verification.
 *
 * A card in the middle of a muted page for the code sent by text message: a
 * shield, the masked number it went to, six code slots, a countdown before a
 * new code can be sent, Verify and a way to use another number.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The card keeps 472px from Tablet up and
 * fills the width on a phone, where its side padding drops to 16px so the six
 * slots still fit on one line. Direction is the page's `dir`; in Arabic the
 * code fills from the right, as the OTP Input does, and every number keeps
 * its Western digits.
 */

export interface AuthOtpVerificationLink {
  label: React.ReactNode
  href: string
}

export interface AuthOtpVerificationCopy {
  /** The card's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. `{phone}` is replaced by `phone`. */
  description: string
  /** The code field's accessible name. */
  codeLabel: string
  /** The line under the slots while the countdown runs. `{time}` is replaced by the time left, as 0:29. */
  resendCountdown: string
  /** The button under the slots once the countdown ends. */
  resendLabel: string
  /** Shown for a moment after `onResend` settles. */
  resentMessage: React.ReactNode
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** Shown under the slots when the code is incomplete or `onSubmit` rejects. */
  error: React.ReactNode
  /** The ghost link under Verify, to use another number. Hidden when null. */
  changeNumberLink: AuthOtpVerificationLink | null
  /** The quiet line at the foot of the card. Hidden when empty. */
  footnote: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthOtpVerificationCopy> = {
  en: {
    heading: "Enter your verification code",
    description: "We sent a 6-digit code to {phone}.",
    codeLabel: "Verification code",
    resendCountdown: "Send a new code in {time}",
    resendLabel: "Send a new code",
    resentMessage: "We sent a new code.",
    submitLabel: "Verify and continue",
    pendingLabel: "Checking the code",
    error: "That code didn’t work. Check it and try again.",
    changeNumberLink: { label: "Use a different phone number", href: "#phone" },
    footnote: "Never share this code with anyone.",
  },
  ar: {
    heading: "أدخل رمز التحقق",
    description: "أرسلنا رمزًا من 6 أرقام إلى {phone}.",
    codeLabel: "رمز التحقق",
    resendCountdown: "إرسال رمز جديد خلال {time}",
    resendLabel: "إرسال رمز جديد",
    resentMessage: "أرسلنا رمزًا جديدًا.",
    submitLabel: "تحقّق وتابع",
    pendingLabel: "جارٍ التحقق من الرمز",
    error: "الرمز غير صحيح. تحقّق منه وحاول مجددًا.",
    changeNumberLink: { label: "استخدم رقم هاتف آخر", href: "#phone" },
    footnote: "لا تشارك هذا الرمز مع أي شخص.",
  },
}

export interface AuthOtpVerificationProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthOtpVerificationCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The number the code went to, masked, shown in `description`.
   * @default "+962 7•• ••• 418"
   */
  phone?: string
  /**
   * Seconds before a new code can be sent, counted again after each resend.
   * @default 30
   */
  resendDelay?: number
  /**
   * Runs when the form is sent with all six digits. While its promise is
   * pending the button shows its spinner; a rejection marks the slots
   * invalid, shakes them once, clears them and shows `error`.
   */
  onSubmit?: (values: { code: string }) => Promise<void> | void
  /** Runs when a new code is asked for. The countdown starts again. */
  onResend?: () => Promise<void> | void
}

const CODE_LENGTH = 6

/** Seconds as m:ss, in Western digits. */
const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`

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

/** Counts `seconds` down to 0, once a second. `restart` starts it again. */
function useCountdown(seconds: number) {
  const [left, setLeft] = React.useState(seconds)
  const [round, setRound] = React.useState(0)
  React.useEffect(() => {
    setLeft(seconds)
    if (seconds <= 0) return
    const timer = window.setInterval(() => {
      setLeft((current) => {
        if (current <= 1) window.clearInterval(timer)
        return Math.max(0, current - 1)
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [seconds, round])
  return [left, () => setRound((count) => count + 1)] as const
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

const LINK =
  "rounded-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

export function AuthOtpVerification({
  locale = "en",
  heading,
  description,
  codeLabel,
  resendCountdown,
  resendLabel,
  resentMessage,
  submitLabel,
  pendingLabel,
  error,
  changeNumberLink,
  footnote,
  phone = "+962 7•• ••• 418",
  resendDelay = 30,
  onSubmit,
  onResend,
  className,
  ...props
}: AuthOtpVerificationProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const cardRef = React.useRef<HTMLDivElement>(null)
  const slotsRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [code, setCode] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const [resent, setResent] = React.useState(false)
  const [left, restart] = useCountdown(resendDelay)
  const changeNumber = changeNumberLink === undefined ? copy.changeNumberLink : changeNumberLink
  const foot = footnote ?? copy.footnote
  useEntrance(cardRef)

  React.useEffect(() => {
    if (!resent) return
    const timer = window.setTimeout(() => setResent(false), 4000)
    return () => window.clearTimeout(timer)
  }, [resent])

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
    if (code.length < CODE_LENGTH) {
      fail()
      return
    }
    if (!onSubmit) return
    setStatus("pending")
    try {
      await onSubmit({ code })
      setStatus("idle")
    } catch {
      fail()
    }
  }

  const resend = async () => {
    try {
      await onResend?.()
      setResent(true)
      restart()
    } catch {
      // The button stays, so the visitor can try again.
    }
  }

  return (
    <section aria-labelledby={headingId} className={cn("flex justify-center bg-muted p-8 md:p-16 lg:p-24", className)} {...props}>
      <div
        ref={cardRef}
        className="flex w-full flex-col items-center gap-7 rounded-xl border border-border bg-card px-4 py-8 text-card-foreground shadow-lg md:max-w-[472px] md:px-8"
      >
        <div data-entrance="" className="flex w-full flex-col items-center gap-3">
          <div className="flex size-[52px] items-center justify-center rounded-full bg-muted text-foreground">
            <ShieldCheck size={24} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
          </div>
          <div className="flex w-full flex-col items-center gap-1.5 text-center">
            <h1 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl">
              {heading ?? copy.heading}
            </h1>
            <p className="text-sm text-muted-foreground">
              {fill(description ?? copy.description, "phone", <bdi dir="ltr">{phone}</bdi>)}
            </p>
          </div>
        </div>

        <form data-entrance="" onSubmit={submit} className="w-full">
          <fieldset disabled={status === "pending"} className="flex w-full min-w-0 flex-col items-center gap-7">
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
                  {Array.from({ length: CODE_LENGTH }, (_, index) => (
                    <InputOTPGroup key={index}>
                      <InputOTPSlot index={index} />
                    </InputOTPGroup>
                  ))}
                </InputOTP>
              </div>
              <p role="alert" className="text-center text-sm text-destructive empty:hidden">
                {status === "error" ? (error ?? copy.error) : null}
              </p>
              {left > 0 ? (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Timer size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="shrink-0" />
                  <span className="tabular-nums">
                    {fill(resendCountdown ?? copy.resendCountdown, "time", <bdi dir="ltr">{clock(left)}</bdi>)}
                  </span>
                </p>
              ) : (
                <button type="button" onClick={resend} className={cn("flex items-center gap-1.5 text-xs font-medium text-foreground", LINK)}>
                  <Timer size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="shrink-0" />
                  {resendLabel ?? copy.resendLabel}
                </button>
              )}
              <p role="status" className="text-center text-xs text-muted-foreground empty:hidden">
                {resent ? (resentMessage ?? copy.resentMessage) : null}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3">
              <Button type="submit" loading={status === "pending"} loadingLabel={pendingLabel ?? copy.pendingLabel} className="w-full">
                {submitLabel ?? copy.submitLabel}
              </Button>
              {changeNumber ? (
                <a href={changeNumber.href} className={buttonVariants({ variant: "ghost", className: "w-full" })}>
                  {changeNumber.label}
                </a>
              ) : null}
            </div>
          </fieldset>
        </form>

        {foot ? (
          <p data-entrance="" className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <Lock size={12} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="shrink-0" />
            {foot}
          </p>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const authOtpVerificationCopy = COPY
