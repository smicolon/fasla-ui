"use client"

import * as React from "react"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Checkbox } from "../../ui/checkbox/checkbox"
import { Input } from "../../ui/input/input"
import { SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"

/*
 * Figma: `Authentications` (42586:4669), Type=Centered Card Sign In.
 *
 * A card in the middle of a muted page: the logo, a heading, email and
 * password, remember me and forgot password, the Sign in button, then an
 * "or continue with" row of provider buttons and a link to sign up.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The card keeps 456px from Tablet up and
 * fills the width on a phone, where the remember/forgot row and the provider
 * buttons stack. Direction is the page's `dir`; every side is a logical one.
 */

export interface AuthCenteredCardSignInLink {
  label: React.ReactNode
  href: string
}

export interface AuthCenteredCardSignInProvider {
  platform: SocialPlatform
  /** The button's text: name the provider. */
  label: React.ReactNode
}

export interface AuthCenteredCardSignInValues {
  email: string
  password: string
  remember: boolean
}

export interface AuthCenteredCardSignInCopy {
  /** The card's heading, an `h1`. */
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
  rememberLabel: string
  /** The link at the end of the remember-me row. Hidden when null. */
  forgotPassword: AuthCenteredCardSignInLink | null
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** Shown under the button when `onSubmit` rejects. */
  error: React.ReactNode
  /** The words between the two rules over the providers. */
  dividerLabel: React.ReactNode
  /** The provider buttons. The divider and the row are hidden when empty. */
  providers: AuthCenteredCardSignInProvider[]
  /** The question before the closing link. */
  footerText: React.ReactNode
  /** The closing link, to sign up. Hidden, with `footerText`, when null. */
  footerLink: AuthCenteredCardSignInLink | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthCenteredCardSignInCopy> = {
  en: {
    heading: "Welcome back",
    description: "Sign in to your Fasla account to continue.",
    emailLabel: "Email",
    emailPlaceholder: "you@company.com",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    showPassword: "Show password",
    hidePassword: "Hide password",
    rememberLabel: "Remember me",
    forgotPassword: { label: "Forgot password?", href: "#forgot-password" },
    submitLabel: "Sign in",
    pendingLabel: "Signing in",
    error: "We couldn’t sign you in. Check your email and password and try again.",
    dividerLabel: "or continue with",
    providers: [
      { platform: "google", label: "Google" },
      { platform: "apple", label: "Apple" },
      { platform: "github", label: "GitHub" },
    ],
    footerText: "Don’t have an account?",
    footerLink: { label: "Sign up", href: "#sign-up" },
  },
  ar: {
    heading: "أهلًا بعودتك",
    description: "سجّل الدخول إلى حسابك في فاصلة للمتابعة.",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "you@company.com",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "••••••••",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    rememberLabel: "تذكّرني",
    forgotPassword: { label: "نسيت كلمة المرور؟", href: "#forgot-password" },
    submitLabel: "تسجيل الدخول",
    pendingLabel: "جارٍ تسجيل الدخول",
    error: "تعذّر تسجيل دخولك. تحقّق من بريدك الإلكتروني وكلمة المرور ثم حاول مجددًا.",
    dividerLabel: "أو تابع باستخدام",
    providers: [
      { platform: "google", label: "Google" },
      { platform: "apple", label: "Apple" },
      { platform: "github", label: "GitHub" },
    ],
    footerText: "ليس لديك حساب؟",
    footerLink: { label: "إنشاء حساب", href: "#sign-up" },
  },
}

export interface AuthCenteredCardSignInProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthCenteredCardSignInCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Your logo, over the heading: Figma shows the 44px icon-only Fasla Logo. Nothing shows without it. */
  logo?: React.ReactNode
  /**
   * Runs when the form is sent. While its promise is pending the button shows
   * its spinner and the form is disabled; a rejection shows `error`.
   */
  onSubmit?: (values: AuthCenteredCardSignInValues) => Promise<void> | void
  /** Runs when a provider button is pressed. That button shows its spinner while the promise is pending. */
  onProviderSelect?: (platform: SocialPlatform) => Promise<void> | void
}

/**
 * Figma's entrance: the marked parts fade in and rise, one after another.
 * Runs once; skipped under prefers-reduced-motion.
 */
function useEntrance(ref: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root || typeof root.animate !== "function") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    // Desktop and Tablet: the card rises 12px over 320ms, its parts 50ms
    // apart. Mobile: one 300ms fade, no stagger.
    const wide = window.matchMedia("(min-width: 768px)").matches
    const parts = wide ? Array.from(root.querySelectorAll<HTMLElement>("[data-entrance]")) : [root]
    const animations = parts.map((part, index) =>
      part.animate(
        [{ opacity: 0, transform: wide ? "translateY(12px)" : "none" }, { opacity: 1, transform: "none" }],
        { duration: wide ? 320 : 300, delay: index * 50, easing: "cubic-bezier(0, 0, 0.2, 1)", fill: "backwards" }
      )
    )
    return () => animations.forEach((animation) => animation.cancel())
  }, [ref])
}

export function AuthCenteredCardSignIn({
  locale = "en",
  heading,
  description,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  showPassword,
  hidePassword,
  rememberLabel,
  forgotPassword,
  submitLabel,
  pendingLabel,
  error,
  dividerLabel,
  providers,
  footerText,
  footerLink,
  logo,
  onSubmit,
  onProviderSelect,
  className,
  ...props
}: AuthCenteredCardSignInProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const [pendingProvider, setPendingProvider] = React.useState<SocialPlatform | null>(null)
  const forgot = forgotPassword === undefined ? copy.forgotPassword : forgotPassword
  const signUp = footerLink === undefined ? copy.footerLink : footerLink
  const providerList = providers ?? copy.providers
  const subline = description ?? copy.description
  const busy = status === "pending" || pendingProvider !== null
  useEntrance(cardRef)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSubmit) return
    const data = new FormData(event.currentTarget)
    setStatus("pending")
    try {
      await onSubmit({
        email: String(data.get("email") ?? ""),
        password: String(data.get("password") ?? ""),
        remember: data.get("remember") === "on",
      })
      setStatus("idle")
    } catch {
      setStatus("error")
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
      <div
        ref={cardRef}
        className="flex w-full flex-col items-center gap-6 rounded-xl border border-border bg-card p-8 text-card-foreground shadow-lg md:max-w-[456px]"
      >
        <div data-entrance="" className="flex w-full flex-col items-center gap-3">
          {logo ? <div className="flex size-11 items-center justify-center [&>svg]:size-full">{logo}</div> : null}
          <div className="flex w-full flex-col items-center gap-1.5 text-center">
            <h1 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl">
              {heading ?? copy.heading}
            </h1>
            {subline ? <p className="text-sm text-muted-foreground">{subline}</p> : null}
          </div>
        </div>

        <form data-entrance="" onSubmit={submit} className="w-full">
          <fieldset disabled={busy} className="flex w-full min-w-0 flex-col gap-4">
            <Input
              type="email"
              name="email"
              autoComplete="email"
              required
              label={emailLabel ?? copy.emailLabel}
              placeholder={emailPlaceholder ?? copy.emailPlaceholder}
              startIcon={<Mail size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />}
            />
            <PasswordInput
              label={passwordLabel ?? copy.passwordLabel}
              placeholder={passwordPlaceholder ?? copy.passwordPlaceholder}
              showLabel={showPassword ?? copy.showPassword}
              hideLabel={hidePassword ?? copy.hidePassword}
            />
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
              <Checkbox name="remember" size="sm" label={rememberLabel ?? copy.rememberLabel} />
              {forgot ? (
                <a
                  href={forgot.href}
                  className="rounded-sm text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {forgot.label}
                </a>
              ) : null}
            </div>
            <Button type="submit" loading={status === "pending"} loadingLabel={pendingLabel ?? copy.pendingLabel} className="w-full">
              {submitLabel ?? copy.submitLabel}
            </Button>
            <p role="alert" className="text-sm text-destructive empty:hidden">
              {status === "error" ? (error ?? copy.error) : null}
            </p>
          </fieldset>
        </form>

        {providerList.length > 0 ? (
          <>
            <div data-entrance="" className="flex w-full items-center gap-3">
              <div aria-hidden="true" className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted-foreground">{dividerLabel ?? copy.dividerLabel}</span>
              <div aria-hidden="true" className="h-px flex-1 bg-border" />
            </div>
            <div data-entrance="" className="flex w-full flex-col gap-2.5 md:flex-row">
              {providerList.map((provider) => (
                <Button
                  key={provider.platform}
                  type="button"
                  variant="outline"
                  size="lg"
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

        {signUp ? (
          <p data-entrance="" className="flex flex-wrap items-center justify-center gap-1 text-sm">
            <span className="text-muted-foreground">{footerText ?? copy.footerText}</span>
            <a
              href={signUp.href}
              className="rounded-sm font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {signUp.label}
            </a>
          </p>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The password field with Figma's eye: a real toggle that shows the password
 * as plain text and back.
 */
function PasswordInput({
  label,
  placeholder,
  showLabel,
  hideLabel,
}: {
  label: React.ReactNode
  placeholder: string
  showLabel: string
  hideLabel: string
}) {
  const [visible, setVisible] = React.useState(false)
  return (
    <Input
      type={visible ? "text" : "password"}
      name="password"
      autoComplete="current-password"
      required
      label={label}
      placeholder={placeholder}
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
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const authCenteredCardSignInCopy = COPY
