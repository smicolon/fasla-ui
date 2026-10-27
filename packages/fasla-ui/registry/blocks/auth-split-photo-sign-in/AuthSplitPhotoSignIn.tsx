"use client"

import * as React from "react"
import { Eye, EyeOff, Star } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Button } from "../../ui/button/button"
import { Checkbox } from "../../ui/checkbox/checkbox"
import { Input } from "../../ui/input/input"
import { SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"

/*
 * Figma: `Authentications` (42586:4669), Type=Split Photo Sign In.
 *
 * The sign-in form on one side of the page and a photograph on the other,
 * with a customer quote in a card at the photo's foot. The form side takes
 * a little more than half the width.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). On a phone the photo becomes a 200px
 * band above the form and the quote is dropped. Direction is the page's
 * `dir`: in Arabic the form sits on the right and the photo on the left. The
 * photo itself is never mirrored.
 */

export interface AuthSplitPhotoSignInLink {
  label: React.ReactNode
  href: string
}

export interface AuthSplitPhotoSignInProvider {
  platform: SocialPlatform
  /** The button's text: name the provider. */
  label: React.ReactNode
}

export interface AuthSplitPhotoSignInImage {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface AuthSplitPhotoSignInQuote {
  /** The quote, with its quotation marks. */
  text: React.ReactNode
  /** Who said it. Also the avatar's accessible name when it is a string. */
  name: React.ReactNode
  /** Their role and company. */
  role: React.ReactNode
  /** Their photo. Without it the avatar shows their initials. */
  avatar?: string
}

export interface AuthSplitPhotoSignInValues {
  email: string
  password: string
  remember: boolean
}

export interface AuthSplitPhotoSignInCopy {
  /** The page's heading, an `h1`. */
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
  forgotPassword: AuthSplitPhotoSignInLink | null
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** Shown under the button when `onSubmit` rejects. */
  error: React.ReactNode
  /** The word between the two rules over the providers. */
  dividerLabel: React.ReactNode
  /** The provider buttons. The divider and the buttons are hidden when empty. */
  providers: AuthSplitPhotoSignInProvider[]
  /** The question before the closing link. */
  footerText: React.ReactNode
  /** The closing link, to sign up. Hidden, with `footerText`, when null. */
  footerLink: AuthSplitPhotoSignInLink | null
  /** The quote card over the photo, from Tablet up. Hidden when null. */
  quote: AuthSplitPhotoSignInQuote | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthSplitPhotoSignInCopy> = {
  en: {
    heading: "Sign in to Fasla",
    description: "Pick up where your team left off.",
    emailLabel: "Work email",
    emailPlaceholder: "you@company.com",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    showPassword: "Show password",
    hidePassword: "Hide password",
    rememberLabel: "Keep me signed in",
    forgotPassword: { label: "Forgot password?", href: "#forgot-password" },
    submitLabel: "Sign in",
    pendingLabel: "Signing in",
    error: "We couldn’t sign you in. Check your email and password and try again.",
    dividerLabel: "or",
    providers: [
      { platform: "google", label: "Continue with Google" },
      { platform: "linkedin", label: "Continue with LinkedIn" },
    ],
    footerText: "New to Fasla?",
    footerLink: { label: "Create an account", href: "#sign-up" },
    quote: {
      text: "“Fasla replaced four tools for us in a single quarter. Onboarding a new designer now takes an afternoon.”",
      name: "Nadia Rahman",
      role: "Head of Design, Northwind",
    },
  },
  ar: {
    heading: "تسجيل الدخول إلى فاصلة",
    description: "تابع من حيث توقّف فريقك.",
    emailLabel: "بريد العمل",
    emailPlaceholder: "you@company.com",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "••••••••",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    rememberLabel: "أبقني مسجّلًا للدخول",
    forgotPassword: { label: "نسيت كلمة المرور؟", href: "#forgot-password" },
    submitLabel: "تسجيل الدخول",
    pendingLabel: "جارٍ تسجيل الدخول",
    error: "تعذّر تسجيل دخولك. تحقّق من بريدك الإلكتروني وكلمة المرور ثم حاول مجددًا.",
    dividerLabel: "أو",
    providers: [
      { platform: "google", label: <>المتابعة باستخدام <bdi dir="ltr">Google</bdi></> },
      { platform: "linkedin", label: <>المتابعة باستخدام <bdi dir="ltr">LinkedIn</bdi></> },
    ],
    footerText: "جديد على فاصلة؟",
    footerLink: { label: "أنشئ حسابًا", href: "#sign-up" },
    quote: {
      text: "«استبدلنا بفاصلة أربع أدوات في ربع سنة واحد، وصارت تهيئة مصمم جديد لا تستغرق أكثر من بضع ساعات.»",
      name: "نادية رحمن",
      role: (
        <>
          رئيسة التصميم، <bdi dir="ltr">Northwind</bdi>
        </>
      ),
    },
  },
}

export interface AuthSplitPhotoSignInProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthSplitPhotoSignInCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Your logo, over the heading: Figma shows the 32px-high Fasla Logo lockup. Nothing shows without it. */
  logo?: React.ReactNode
  /**
   * The photo. None by default: the panel shows a `muted` placeholder of the
   * same size.
   * @default none: a `muted` placeholder
   */
  image?: AuthSplitPhotoSignInImage
  /**
   * Runs when the form is sent. While its promise is pending the button shows
   * its spinner and the form is disabled; a rejection shows `error`.
   */
  onSubmit?: (values: AuthSplitPhotoSignInValues) => Promise<void> | void
  /** Runs when a provider button is pressed. That button shows its spinner while the promise is pending. */
  onProviderSelect?: (platform: SocialPlatform) => Promise<void> | void
}

const LINK =
  "rounded-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

/**
 * Figma's entrance: the photo settles from 1.06 to 1 over 700ms while the
 * form slides in from the start side, its parts 60ms apart; the quote card
 * rises in once the photo has settled. On a phone the band fades in and the
 * form rises 16px instead. Runs once; skipped under prefers-reduced-motion.
 */
function useEntrance(root: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const node = root.current
    if (!node || typeof node.animate !== "function") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const wide = window.matchMedia("(min-width: 768px)").matches
    const desktop = window.matchMedia("(min-width: 1024px)").matches
    const rtl = getComputedStyle(node).direction === "rtl"
    const ease = "cubic-bezier(0, 0, 0.2, 1)"
    const animations: Animation[] = []
    const photo = node.querySelector<HTMLElement>("[data-entrance-photo]")
    const parts = Array.from(node.querySelectorAll<HTMLElement>("[data-entrance]"))
    const card = node.querySelector<HTMLElement>("[data-entrance-card]")
    const settle = desktop ? 700 : 500
    if (photo)
      animations.push(
        wide
          ? photo.animate([{ transform: "scale(1.06)" }, { transform: "none" }], { duration: settle, easing: ease, fill: "backwards" })
          : photo.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: ease, fill: "backwards" })
      )
    parts.forEach((part, index) => {
      const from = wide ? `translateX(${rtl ? 24 : -24}px)` : "translateY(16px)"
      animations.push(
        part.animate([{ opacity: 0, transform: from }, { opacity: 1, transform: "none" }], {
          duration: 400,
          delay: (wide ? 0 : 300) + index * 60,
          easing: ease,
          fill: "backwards",
        })
      )
    })
    if (card && wide)
      animations.push(
        card.animate([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], {
          duration: 400,
          delay: settle + 200,
          easing: ease,
          fill: "backwards",
        })
      )
    return () => animations.forEach((animation) => animation.cancel())
  }, [root])
}

export function AuthSplitPhotoSignIn({
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
  quote,
  logo,
  image,
  onSubmit,
  onProviderSelect,
  className,
  ...props
}: AuthSplitPhotoSignInProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const [pendingProvider, setPendingProvider] = React.useState<SocialPlatform | null>(null)
  const forgot = forgotPassword === undefined ? copy.forgotPassword : forgotPassword
  const signUp = footerLink === undefined ? copy.footerLink : footerLink
  const testimonial = quote === undefined ? copy.quote : quote
  const providerList = providers ?? copy.providers
  const subline = description ?? copy.description
  const busy = status === "pending" || pendingProvider !== null
  useEntrance(rootRef)

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
      ref={rootRef}
      aria-labelledby={headingId}
      className={cn("flex flex-col bg-background md:min-h-[720px] md:flex-row lg:min-h-[860px]", className)}
      {...props}
    >
      <div className="flex items-center justify-center bg-background px-8 py-16 md:flex-[400_1_0%] md:p-16 lg:flex-[752_1_0%] lg:px-20">
        <div className="flex w-full min-w-0 flex-col gap-8 md:gap-6 lg:max-w-[392px] lg:gap-8">
          {logo ? (
            <div data-entrance="" className="flex h-8 items-center [&>svg]:h-full [&>svg]:w-auto">
              {logo}
            </div>
          ) : null}
          <div data-entrance="" className="flex flex-col gap-2">
            <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
              {heading ?? copy.heading}
            </h1>
            {subline ? <p className="text-base text-muted-foreground">{subline}</p> : null}
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
              />
              <PasswordInput
                label={passwordLabel ?? copy.passwordLabel}
                placeholder={passwordPlaceholder ?? copy.passwordPlaceholder}
                showLabel={showPassword ?? copy.showPassword}
                hideLabel={hidePassword ?? copy.hidePassword}
              />
              <div className="flex items-center justify-between gap-2">
                <Checkbox name="remember" size="sm" label={rememberLabel ?? copy.rememberLabel} />
                {forgot ? (
                  <a href={forgot.href} className={cn(LINK, "shrink-0 whitespace-nowrap text-xs lg:text-sm")}>
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
              <div data-entrance="" className="flex w-full flex-col gap-2.5">
                {providerList.map((provider) => (
                  <Button
                    key={provider.platform}
                    type="button"
                    variant="outline"
                    disabled={busy && pendingProvider !== provider.platform}
                    loading={pendingProvider === provider.platform}
                    onClick={() => selectProvider(provider.platform)}
                    className="w-full min-w-0"
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
              <a href={signUp.href} className={cn(LINK, "font-semibold")}>
                {signUp.label}
              </a>
            </p>
          ) : null}
        </div>
      </div>

      <div className="relative order-first flex h-[200px] shrink-0 flex-col justify-end overflow-hidden bg-muted p-4 md:order-none md:h-auto md:flex-[368_1_0%] md:p-12 lg:flex-[688_1_0%]">
        {image ? (
          <img
            data-entrance-photo=""
            src={image.src}
            alt={image.alt}
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        ) : null}
        {testimonial ? (
          <figure
            data-entrance-card=""
            className="relative hidden flex-col gap-3 rounded-lg bg-card p-6 text-card-foreground shadow-lg md:flex"
          >
            <Star size={18} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-[18px] text-warning" />
            <blockquote className="text-base font-medium text-foreground">{testimonial.text}</blockquote>
            <figcaption className="flex items-center gap-3">
              <Avatar
                size="32"
                radius="rounded"
                src={testimonial.avatar}
                name={typeof testimonial.name === "string" ? testimonial.name : undefined}
                className="size-9"
              />
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-semibold text-foreground">{testimonial.name}</span>
                <span className="text-xs text-muted-foreground">{testimonial.role}</span>
              </span>
            </figcaption>
          </figure>
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
      endIcon={
        <button
          type="button"
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          onClick={() => setVisible((shown) => !shown)}
          className="-m-1 flex rounded-sm p-1 text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
        >
          {visible ? (
            <EyeOff size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
          ) : (
            <Eye size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
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
export const authSplitPhotoSignInCopy = COPY
