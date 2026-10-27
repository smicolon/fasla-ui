"use client"

import * as React from "react"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Checkbox } from "../../ui/checkbox/checkbox"
import { Input } from "../../ui/input/input"
import { SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"

/*
 * Figma: `Authentications` (42586:4669), Type=Photo Background Sign In.
 *
 * A sign-in card over a full-bleed photo: the logo, a heading, email and
 * password, remember me and forgot password, Sign in, an "or" rule, two
 * provider buttons and a link to sign up. The photo is the `image` prop;
 * until one is passed the backdrop is a `muted` field of the same size.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The backdrop is 880px tall at every
 * breakpoint; the card keeps 440px from Tablet up and fills the width on a
 * phone, where the provider buttons stack. Direction is the page's `dir`;
 * the card mirrors, the photo never does.
 */

export interface AuthPhotoBackgroundSignInLink {
  label: React.ReactNode
  href: string
}

export interface AuthPhotoBackgroundSignInImage {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface AuthPhotoBackgroundSignInProvider {
  platform: SocialPlatform
  /** The button's text: name the provider. */
  label: React.ReactNode
}

export interface AuthPhotoBackgroundSignInValues {
  email: string
  password: string
  remember: boolean
}

export interface AuthPhotoBackgroundSignInCopy {
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
  forgotPassword: AuthPhotoBackgroundSignInLink | null
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** Shown under the button when `onSubmit` rejects. */
  error: React.ReactNode
  /** The word on the rule over the providers. */
  dividerLabel: React.ReactNode
  /** The provider buttons. The rule and the row are hidden when empty. */
  providers: AuthPhotoBackgroundSignInProvider[]
  /** The question before the closing link. */
  footerText: React.ReactNode
  /** The closing link, to sign up. Hidden, with `footerText`, when null. */
  footerLink: AuthPhotoBackgroundSignInLink | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthPhotoBackgroundSignInCopy> = {
  en: {
    heading: "Sign in to Fasla",
    description: "Your workspace is waiting.",
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
    dividerLabel: "or",
    providers: [
      { platform: "google", label: "Google" },
      { platform: "apple", label: "Apple" },
    ],
    footerText: "New here?",
    footerLink: { label: "Create an account", href: "#sign-up" },
  },
  ar: {
    heading: "تسجيل الدخول إلى فاصلة",
    description: "مساحة عملك بانتظارك.",
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
    dividerLabel: "أو",
    providers: [
      { platform: "google", label: "Google" },
      { platform: "apple", label: "Apple" },
    ],
    footerText: "جديد هنا؟",
    footerLink: { label: "أنشئ حسابًا", href: "#sign-up" },
  },
}

export interface AuthPhotoBackgroundSignInProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthPhotoBackgroundSignInCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Your logo, over the heading: Figma shows the 40px icon-only Fasla Logo. Nothing shows without it. */
  logo?: React.ReactNode
  /**
   * The photo behind the card, cropped to fill. None by default: a `muted`
   * field of the same size. Choose a calm, dark photo the card can sit on.
   * @default none: a `muted` placeholder
   */
  image?: AuthPhotoBackgroundSignInImage
  /**
   * Runs when the form is sent. While its promise is pending the button shows
   * its spinner and the form is disabled; a rejection shows `error`.
   */
  onSubmit?: (values: AuthPhotoBackgroundSignInValues) => Promise<void> | void
  /** Runs when a provider button is pressed. That button shows its spinner while the promise is pending. */
  onProviderSelect?: (platform: SocialPlatform) => Promise<void> | void
}

/**
 * Figma's motion: the card fades in and rises over 300ms, once; the photo
 * drifts very slowly (to 1.04 over 20s and back, on a loop) from Tablet up.
 * Both are skipped under prefers-reduced-motion, and the drift on a phone.
 */
function useMotion(
  cardRef: React.RefObject<HTMLElement | null>,
  photoRef: React.RefObject<HTMLElement | null>,
  photoSrc: string | undefined
) {
  React.useLayoutEffect(() => {
    const card = cardRef.current
    if (!card || typeof card.animate !== "function") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const entrance = card.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], {
      duration: 300,
      easing: "cubic-bezier(0, 0, 0.2, 1)",
      fill: "backwards",
    })
    return () => entrance.cancel()
  }, [cardRef])

  React.useEffect(() => {
    const photo = photoRef.current
    if (!photo || typeof photo.animate !== "function") return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const wide = window.matchMedia("(min-width: 768px)")
    let drift: Animation | null = null
    const update = () => {
      drift?.cancel()
      drift = null
      if (reduce.matches || !wide.matches) return
      drift = photo.animate([{ transform: "scale(1)" }, { transform: "scale(1.04)" }], {
        duration: 20000,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
      })
    }
    update()
    reduce.addEventListener("change", update)
    wide.addEventListener("change", update)
    return () => {
      reduce.removeEventListener("change", update)
      wide.removeEventListener("change", update)
      drift?.cancel()
    }
  }, [photoRef, photoSrc])
}

const LINK =
  "rounded-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

export function AuthPhotoBackgroundSignIn({
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
  image,
  onSubmit,
  onProviderSelect,
  className,
  ...props
}: AuthPhotoBackgroundSignInProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const cardRef = React.useRef<HTMLDivElement>(null)
  const photoRef = React.useRef<HTMLImageElement>(null)
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const [pendingProvider, setPendingProvider] = React.useState<SocialPlatform | null>(null)
  const [visible, setVisible] = React.useState(false)
  const forgot = forgotPassword === undefined ? copy.forgotPassword : forgotPassword
  const signUp = footerLink === undefined ? copy.footerLink : footerLink
  const providerList = providers ?? copy.providers
  const subline = description ?? copy.description
  const busy = status === "pending" || pendingProvider !== null
  const hideLabel = hidePassword ?? copy.hidePassword
  const showLabel = showPassword ?? copy.showPassword
  useMotion(cardRef, photoRef, image?.src)

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
      className={cn(
        "relative isolate flex min-h-[55rem] items-center justify-center overflow-hidden bg-muted px-8 py-12 md:p-12",
        className
      )}
      {...props}
    >
      {image ? (
        <img
          ref={photoRef}
          src={image.src}
          alt={image.alt}
          decoding="async"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
      ) : null}

      <div
        ref={cardRef}
        className="flex w-full flex-col items-center gap-6 rounded-xl bg-card px-4 py-8 text-card-foreground shadow-2xl md:max-w-[440px] md:px-8"
      >
        <div className="flex w-full flex-col items-center gap-2.5 text-center">
          {logo ? <div className="flex size-10 items-center justify-center [&>svg]:size-full">{logo}</div> : null}
          <h1 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl">
            {heading ?? copy.heading}
          </h1>
          {subline ? <p className="text-sm text-muted-foreground">{subline}</p> : null}
        </div>

        <form onSubmit={submit} className="w-full">
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
            <Input
              type={visible ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              required
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
            <div className="flex items-center justify-between gap-2">
              <Checkbox name="remember" size="sm" label={rememberLabel ?? copy.rememberLabel} />
              {forgot ? (
                <a href={forgot.href} className={cn(LINK, "shrink-0 text-xs md:text-sm")}>
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

        {signUp ? (
          <p className="flex flex-wrap items-center justify-center gap-1 text-sm">
            <span className="text-muted-foreground">{footerText ?? copy.footerText}</span>
            <a href={signUp.href} className={cn(LINK, "font-semibold")}>
              {signUp.label}
            </a>
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
export const authPhotoBackgroundSignInCopy = COPY
