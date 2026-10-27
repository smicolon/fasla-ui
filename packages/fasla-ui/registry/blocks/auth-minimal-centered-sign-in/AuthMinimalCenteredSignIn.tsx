"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"

/*
 * Figma: `Authentications` (42586:4669), Type=Minimal Centered Sign In.
 *
 * Nothing but the form: a small logo, a large heading, two pill fields, a
 * large pill Continue button and two quiet links under it, on the page's
 * own background with no card.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The column keeps 360px from Tablet up
 * and fills the width on a phone, where the heading steps down from 4XL to
 * 2XL. Direction is the page's `dir`; everything is centred.
 */

export interface AuthMinimalCenteredSignInLink {
  label: React.ReactNode
  href: string
}

export interface AuthMinimalCenteredSignInValues {
  email: string
  password: string
}

export interface AuthMinimalCenteredSignInCopy {
  /** The column's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  emailLabel: React.ReactNode
  emailPlaceholder: string
  passwordLabel: React.ReactNode
  passwordPlaceholder: string
  /** The eye button's name while the password is hidden. */
  showPassword: string
  /** The eye button's name while the password shows. */
  hidePassword: string
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** Shown under the button when `onSubmit` rejects. */
  error: React.ReactNode
  /** The first link under the form. Hidden when null. */
  forgotPassword: AuthMinimalCenteredSignInLink | null
  /** The second, quieter link, to sign up. Hidden when null. */
  signUp: AuthMinimalCenteredSignInLink | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthMinimalCenteredSignInCopy> = {
  en: {
    heading: "Sign in",
    description: "Enter your details to continue.",
    emailLabel: "Email",
    emailPlaceholder: "you@company.com",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    showPassword: "Show password",
    hidePassword: "Hide password",
    submitLabel: "Continue",
    pendingLabel: "Signing in",
    error: "We couldn’t sign you in. Check your email and password and try again.",
    forgotPassword: { label: "Forgot your password?", href: "#forgot-password" },
    signUp: { label: "Create an account", href: "#sign-up" },
  },
  ar: {
    heading: "تسجيل الدخول",
    description: "أدخل بياناتك للمتابعة.",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "you@company.com",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "••••••••",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    submitLabel: "متابعة",
    pendingLabel: "جارٍ تسجيل الدخول",
    error: "تعذّر تسجيل دخولك. تحقّق من بريدك الإلكتروني وكلمة المرور ثم حاول مجددًا.",
    forgotPassword: { label: "نسيت كلمة المرور؟", href: "#forgot-password" },
    signUp: { label: "أنشئ حسابًا", href: "#sign-up" },
  },
}

export interface AuthMinimalCenteredSignInProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthMinimalCenteredSignInCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Your logo, over the heading: Figma shows the 36px icon-only Fasla Logo. Nothing shows without it. */
  logo?: React.ReactNode
  /**
   * Runs when the form is sent. While its promise is pending the button shows
   * its spinner and the form is disabled; a rejection shows `error`.
   */
  onSubmit?: (values: AuthMinimalCenteredSignInValues) => Promise<void> | void
}

/**
 * Figma's entrance: the whole column fades in and rises 8px over 400ms as
 * one group, deliberately not staggered. Runs once; skipped under
 * prefers-reduced-motion.
 */
function useEntrance(ref: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root || typeof root.animate !== "function") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const animation = root.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], {
      duration: 400,
      easing: "cubic-bezier(0, 0, 0.2, 1)",
      fill: "backwards",
    })
    return () => animation.cancel()
  }, [ref])
}

const LINK =
  "rounded-sm text-sm font-medium underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

export function AuthMinimalCenteredSignIn({
  locale = "en",
  heading,
  description,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  showPassword,
  hidePassword,
  submitLabel,
  pendingLabel,
  error,
  forgotPassword,
  signUp,
  logo,
  onSubmit,
  className,
  ...props
}: AuthMinimalCenteredSignInProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const columnRef = React.useRef<HTMLDivElement>(null)
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const [visible, setVisible] = React.useState(false)
  const forgot = forgotPassword === undefined ? copy.forgotPassword : forgotPassword
  const join = signUp === undefined ? copy.signUp : signUp
  const subline = description ?? copy.description
  useEntrance(columnRef)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSubmit) return
    const data = new FormData(event.currentTarget)
    setStatus("pending")
    try {
      await onSubmit({ email: String(data.get("email") ?? ""), password: String(data.get("password") ?? "") })
      setStatus("idle")
    } catch {
      setStatus("error")
    }
  }

  const hideLabel = hidePassword ?? copy.hidePassword
  const showLabel = showPassword ?? copy.showPassword

  return (
    <section
      aria-labelledby={headingId}
      className={cn("flex justify-center bg-background p-8 md:p-16 lg:p-24", className)}
      {...props}
    >
      <div ref={columnRef} className="flex w-full flex-col items-center gap-10 md:max-w-[360px]">
        {logo ? <div className="flex size-9 items-center justify-center [&>svg]:size-full">{logo}</div> : null}
        <div className="flex w-full flex-col items-center gap-2 text-center">
          <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-4xl">
            {heading ?? copy.heading}
          </h1>
          {subline ? <p className="text-sm text-muted-foreground">{subline}</p> : null}
        </div>

        <form onSubmit={submit} className="w-full">
          <fieldset disabled={status === "pending"} className="flex w-full min-w-0 flex-col gap-5">
            <Input
              type="email"
              name="email"
              autoComplete="email"
              required
              radius="rounded"
              label={emailLabel ?? copy.emailLabel}
              placeholder={emailPlaceholder ?? copy.emailPlaceholder}
            />
            <Input
              type={visible ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              required
              radius="rounded"
              label={passwordLabel ?? copy.passwordLabel}
              placeholder={passwordPlaceholder ?? copy.passwordPlaceholder}
              endIcon={
                <button
                  type="button"
                  aria-label={visible ? hideLabel : showLabel}
                  aria-pressed={visible}
                  onClick={() => setVisible((shown) => !shown)}
                  className="-m-1 flex rounded-full p-1 text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                >
                  {visible ? (
                    <Eye size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                  ) : (
                    <EyeOff size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                  )}
                </button>
              }
            />
            <Button
              type="submit"
              size="lg"
              radius="rounded"
              loading={status === "pending"}
              loadingLabel={pendingLabel ?? copy.pendingLabel}
              className="w-full transition-transform duration-100 active:scale-[0.98] motion-reduce:transition-none"
            >
              {submitLabel ?? copy.submitLabel}
            </Button>
            <p role="alert" className="text-center text-sm text-destructive empty:hidden">
              {status === "error" ? (error ?? copy.error) : null}
            </p>
          </fieldset>
        </form>

        {forgot || join ? (
          <div className="flex w-full flex-col items-center gap-2.5 text-center">
            {forgot ? (
              <a href={forgot.href} className={cn(LINK, "text-foreground")}>
                {forgot.label}
              </a>
            ) : null}
            {join ? (
              <a href={join.href} className={cn(LINK, "text-muted-foreground hover:text-foreground")}>
                {join.label}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const authMinimalCenteredSignInCopy = COPY
