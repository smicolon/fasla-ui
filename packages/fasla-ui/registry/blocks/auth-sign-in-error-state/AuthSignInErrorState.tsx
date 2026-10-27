"use client"

import * as React from "react"
import { CircleHelp, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert/alert"
import { Button } from "../../ui/button/button"
import { Checkbox } from "../../ui/checkbox/checkbox"
import { Input } from "../../ui/input/input"
import { SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"

/*
 * Figma: `Authentications` (42586:4669), Type=Sign In Error State.
 *
 * The sign-in card right after a failed attempt: a destructive Alert under
 * the heading says what went wrong, the password field is invalid and says
 * how many attempts are left, and Reset password replaces "Forgot password?"
 * in the destructive colour. Try again, two providers and a support line
 * follow.
 *
 * It opens in the failed state. Try again is real: while `onSubmit` runs the
 * button shows its spinner; if it resolves the alert and the error clear, if
 * it rejects the alert opens again, the password field shakes once, empties
 * and takes focus.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The card keeps 456px from Tablet up and
 * fills the width on a phone, where the provider buttons stack. Direction is
 * the page's `dir`; every side is a logical one.
 */

export interface AuthSignInErrorStateLink {
  label: React.ReactNode
  href: string
}

export interface AuthSignInErrorStateProvider {
  platform: SocialPlatform
  /** The button's text: name the provider. */
  label: React.ReactNode
}

export interface AuthSignInErrorStateValues {
  email: string
  password: string
  remember: boolean
}

export interface AuthSignInErrorStateCopy {
  /** The card's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  /** The Alert's title: what went wrong. */
  alertTitle: React.ReactNode
  /** The Alert's line under the title: how to get past it. */
  alertDescription: React.ReactNode
  emailLabel: React.ReactNode
  emailPlaceholder: string
  passwordLabel: React.ReactNode
  passwordPlaceholder: string
  /** Under the invalid password field: the attempts left before a lockout. */
  attemptsMessage: React.ReactNode
  /** The eye button's name while the password is hidden. */
  showPassword: string
  /** The eye button's name while the password shows. */
  hidePassword: string
  rememberLabel: string
  /** The destructive link at the end of the remember-me row. Hidden when null. */
  resetPassword: AuthSignInErrorStateLink | null
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** The word on the rule over the providers. */
  dividerLabel: React.ReactNode
  /** The provider buttons. The rule and the row are hidden when empty. */
  providers: AuthSignInErrorStateProvider[]
  /** The question in the support line, before its link. */
  supportText: React.ReactNode
  /** The support line's link. The line is hidden when null. */
  supportLink: AuthSignInErrorStateLink | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthSignInErrorStateCopy> = {
  en: {
    heading: "Welcome back",
    description: "Sign in to your Fasla account to continue.",
    alertTitle: "That password did not match",
    alertDescription: "Check for caps lock, or reset your password to get back in.",
    emailLabel: "Email",
    emailPlaceholder: "alex@northwind.co",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    attemptsMessage: "2 attempts left before this account is locked for 15 minutes.",
    showPassword: "Show password",
    hidePassword: "Hide password",
    rememberLabel: "Remember me",
    resetPassword: { label: "Reset password", href: "#reset-password" },
    submitLabel: "Try again",
    pendingLabel: "Signing in",
    dividerLabel: "or",
    providers: [
      { platform: "google", label: "Google" },
      { platform: "apple", label: "Apple" },
    ],
    supportText: "Still locked out?",
    supportLink: { label: "Contact support.", href: "#support" },
  },
  ar: {
    heading: "أهلًا بعودتك",
    description: "سجّل الدخول إلى حسابك في فاصلة للمتابعة.",
    alertTitle: "كلمة المرور غير صحيحة",
    alertDescription: "تحقّق من مفتاح الأحرف الكبيرة، أو أعد تعيين كلمة المرور لتدخل من جديد.",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "alex@northwind.co",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "••••••••",
    attemptsMessage: (
      <>
        تبقّت محاولتان قبل قفل الحساب لمدة <bdi dir="ltr">15</bdi> دقيقة.
      </>
    ),
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    rememberLabel: "تذكّرني",
    resetPassword: { label: "إعادة تعيين كلمة المرور", href: "#reset-password" },
    submitLabel: "حاول مجددًا",
    pendingLabel: "جارٍ تسجيل الدخول",
    dividerLabel: "أو",
    providers: [
      { platform: "google", label: "Google" },
      { platform: "apple", label: "Apple" },
    ],
    supportText: "ما زلت غير قادر على الدخول؟",
    supportLink: { label: "تواصل مع الدعم.", href: "#support" },
  },
}

export interface AuthSignInErrorStateProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthSignInErrorStateCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Your logo, over the heading: Figma shows the 40px icon-only Fasla Logo. Nothing shows without it. */
  logo?: React.ReactNode
  /** The email that was tried, filled in for the visitor. Empty by default, with Figma's address as the placeholder. */
  defaultEmail?: string
  /**
   * Runs when Try again is pressed. While its promise is pending the button
   * shows its spinner and the form is disabled. A resolved promise clears the
   * error; a rejection shows it again.
   */
  onSubmit?: (values: AuthSignInErrorStateValues) => Promise<void> | void
  /** Runs when a provider button is pressed. That button shows its spinner while the promise is pending. */
  onProviderSelect?: (platform: SocialPlatform) => Promise<void> | void
}

const LINK =
  "rounded-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const EASE = "cubic-bezier(0, 0, 0.2, 1)"

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

export function AuthSignInErrorState({
  locale = "en",
  heading,
  description,
  alertTitle,
  alertDescription,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  attemptsMessage,
  showPassword,
  hidePassword,
  rememberLabel,
  resetPassword,
  submitLabel,
  pendingLabel,
  dividerLabel,
  providers,
  supportText,
  supportLink,
  logo,
  defaultEmail,
  onSubmit,
  onProviderSelect,
  className,
  ...props
}: AuthSignInErrorStateProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const alertRef = React.useRef<HTMLDivElement>(null)
  const fieldRef = React.useRef<HTMLDivElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)
  // Opens failed, as Figma draws it. `attempt` counts failures after that, so
  // each one replays the motion once.
  const [failed, setFailed] = React.useState(true)
  const [attempt, setAttempt] = React.useState(0)
  const [pending, setPending] = React.useState(false)
  const [pendingProvider, setPendingProvider] = React.useState<SocialPlatform | null>(null)
  const [visible, setVisible] = React.useState(false)
  const reset = resetPassword === undefined ? copy.resetPassword : resetPassword
  const support = supportLink === undefined ? copy.supportLink : supportLink
  const providerList = providers ?? copy.providers
  const subline = description ?? copy.description
  const busy = pending || pendingProvider !== null
  const hideLabel = hidePassword ?? copy.hidePassword
  const showLabel = showPassword ?? copy.showPassword

  // Figma's motion, per failure: the Alert opens from no height over 220ms
  // with its content fading in behind, and the password field shakes 6px
  // side to side over 400ms. Under reduced motion neither moves.
  React.useLayoutEffect(() => {
    if (attempt === 0) return
    const input = passwordRef.current
    if (input) {
      input.value = ""
      input.focus()
    }
    if (reduced()) return
    const alert = alertRef.current
    const field = fieldRef.current
    const animations: Animation[] = []
    if (alert && typeof alert.animate === "function") {
      const height = alert.getBoundingClientRect().height
      animations.push(
        alert.animate(
          [
            { height: "0px", opacity: 0 },
            { height: `${height}px`, opacity: 1 },
          ],
          { duration: 220, easing: EASE }
        )
      )
    }
    if (field && typeof field.animate === "function") {
      animations.push(
        field.animate(
          [
            { transform: "none" },
            { transform: "translateX(-6px)" },
            { transform: "translateX(6px)" },
            { transform: "translateX(-6px)" },
            { transform: "translateX(6px)" },
            { transform: "none" },
          ],
          { duration: 400, easing: "ease-in-out" }
        )
      )
    }
    return () => animations.forEach((animation) => animation.cancel())
  }, [attempt])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSubmit) return
    const data = new FormData(event.currentTarget)
    setPending(true)
    try {
      await onSubmit({
        email: String(data.get("email") ?? ""),
        password: String(data.get("password") ?? ""),
        remember: data.get("remember") === "on",
      })
      setFailed(false)
    } catch {
      setFailed(true)
      setAttempt((count) => count + 1)
    } finally {
      setPending(false)
    }
  }

  const selectProvider = async (platform: SocialPlatform) => {
    if (!onProviderSelect) return
    setPendingProvider(platform)
    try {
      await onProviderSelect(platform)
    } finally {
      setPendingProvider(null)
    }
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn("flex justify-center bg-muted p-8 md:p-16 lg:p-24", className)}
      {...props}
    >
      <div className="flex w-full flex-col items-center gap-6 rounded-xl border border-border bg-card px-4 py-8 text-card-foreground shadow-md md:max-w-[456px] md:px-8">
        <div className="flex w-full flex-col items-center gap-2.5 text-center">
          {logo ? <div className="flex size-10 items-center justify-center [&>svg]:size-full">{logo}</div> : null}
          <h1 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl">
            {heading ?? copy.heading}
          </h1>
          {subline ? <p className="text-sm text-muted-foreground">{subline}</p> : null}
        </div>

        {failed ? (
          <div ref={alertRef} className="w-full overflow-hidden">
            <Alert key={attempt} variant="destructive" type="soft">
              <AlertTitle>{alertTitle ?? copy.alertTitle}</AlertTitle>
              <AlertDescription>{alertDescription ?? copy.alertDescription}</AlertDescription>
            </Alert>
          </div>
        ) : null}

        <form onSubmit={submit} className="w-full">
          <fieldset disabled={busy} className="flex w-full min-w-0 flex-col gap-4">
            <Input
              type="email"
              name="email"
              autoComplete="email"
              required
              defaultValue={defaultEmail}
              label={emailLabel ?? copy.emailLabel}
              placeholder={emailPlaceholder ?? copy.emailPlaceholder}
              startIcon={<Mail size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />}
            />
            <div ref={fieldRef}>
              <Input
                ref={passwordRef}
                type={visible ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                invalid={failed}
                error={attemptsMessage ?? copy.attemptsMessage}
                label={passwordLabel ?? copy.passwordLabel}
                placeholder={passwordPlaceholder ?? copy.passwordPlaceholder}
                startIcon={<Lock size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />}
                endIcon={
                  <button
                    type="button"
                    aria-label={visible ? hideLabel : showLabel}
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
            </div>
            <div className="flex items-center justify-between gap-2">
              <Checkbox name="remember" size="sm" label={rememberLabel ?? copy.rememberLabel} />
              {reset ? (
                <a href={reset.href} className={cn(LINK, "shrink-0 text-sm font-semibold text-destructive")}>
                  {reset.label}
                </a>
              ) : null}
            </div>
            <Button type="submit" loading={pending} loadingLabel={pendingLabel ?? copy.pendingLabel} className="w-full">
              {submitLabel ?? copy.submitLabel}
            </Button>
          </fieldset>
        </form>

        {providerList.length > 0 ? (
          <>
            <div className="flex w-full items-center gap-3">
              <div aria-hidden="true" className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted-foreground">{dividerLabel ?? copy.dividerLabel}</span>
              <div aria-hidden="true" className="h-px flex-1 bg-border" />
            </div>
            <div className="flex w-full flex-col gap-2.5 md:flex-row">
              {providerList.map((provider) => (
                <Button
                  key={provider.platform}
                  type="button"
                  variant="outline"
                  disabled={busy && pendingProvider !== provider.platform}
                  loading={pendingProvider === provider.platform}
                  onClick={() => selectProvider(provider.platform)}
                  className="w-full min-w-0 md:flex-1"
                >
                  <SocialIcon platform={provider.platform} className="size-4" />
                  {provider.label}
                </Button>
              ))}
            </div>
          </>
        ) : null}

        {support ? (
          <p className="flex items-start justify-center gap-2 text-xs text-muted-foreground">
            <CircleHelp
              size={14}
              strokeWidth={1.5}
              absoluteStrokeWidth
              aria-hidden="true"
              className="mt-px size-3.5 shrink-0"
            />
            <span>
              {supportText ?? copy.supportText}{" "}
              <a href={support.href} className={cn(LINK, "hover:text-foreground")}>
                {support.label}
              </a>
            </span>
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
export const authSignInErrorStateCopy = COPY
