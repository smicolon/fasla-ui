"use client"

import * as React from "react"
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Button } from "../../ui/button/button"
import { Checkbox } from "../../ui/checkbox/checkbox"
import { Input } from "../../ui/input/input"
import { SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"

/*
 * Figma: `Authentications` (42586:4669), Type=Split Testimonial Sign Up.
 *
 * A dark story panel on one side (the logo, a customer quote and two
 * figures) and the sign-up form on the other: names, work email, a password
 * with its rule, consent, Create account and two providers.
 *
 * The panel is painted with the inverse tokens, the only way Fasla inverts a
 * surface; the theme-inverse registry item maps them.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). On a phone the panel becomes a quote
 * band above the form and the figures are dropped. Direction is the page's
 * `dir`: in Arabic the panel sits on the right.
 */

export interface AuthSplitTestimonialSignUpLink {
  label: React.ReactNode
  href: string
}

export interface AuthSplitTestimonialSignUpProvider {
  platform: SocialPlatform
  /** The button's text: name the provider. */
  label: React.ReactNode
}

export interface AuthSplitTestimonialSignUpQuote {
  /** The quote, with its quotation marks. */
  text: React.ReactNode
  /** Who said it. Also the avatar's accessible name when it is a string. */
  name: React.ReactNode
  /** Their role and company. */
  role: React.ReactNode
  /** Their photo. Without it the avatar shows their initials. */
  avatar?: string
}

export interface AuthSplitTestimonialSignUpStat {
  /** The figure, in Western digits. Its number counts up from zero on load. */
  value: string
  /** What it counts. */
  label: React.ReactNode
}

export interface AuthSplitTestimonialSignUpValues {
  firstName: string
  lastName: string
  email: string
  password: string
  terms: boolean
}

export interface AuthSplitTestimonialSignUpCopy {
  /** The small line over the quote. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The customer quote in the panel. Hidden when null. */
  quote: AuthSplitTestimonialSignUpQuote | null
  /** The figures at the panel's foot, from Tablet up. Hidden when empty. */
  stats: AuthSplitTestimonialSignUpStat[]
  /** The form's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  firstNameLabel: React.ReactNode
  firstNamePlaceholder: string
  lastNameLabel: React.ReactNode
  lastNamePlaceholder: string
  emailLabel: React.ReactNode
  emailPlaceholder: string
  passwordLabel: React.ReactNode
  passwordPlaceholder: string
  /** The rule under the password field. */
  passwordHint: React.ReactNode
  /** The eye button's name while the password is hidden. */
  showPassword: string
  /** The eye button's name while the password shows. */
  hidePassword: string
  /** The consent checkbox's label. */
  termsLabel: string
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** Shown under the button when `onSubmit` rejects. */
  error: React.ReactNode
  /** The words between the two rules over the providers. */
  dividerLabel: React.ReactNode
  /** The provider buttons. The divider and the row are hidden when empty. */
  providers: AuthSplitTestimonialSignUpProvider[]
  /** The question before the closing link. */
  footerText: React.ReactNode
  /** The closing link, to sign in. Hidden, with `footerText`, when null. */
  footerLink: AuthSplitTestimonialSignUpLink | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthSplitTestimonialSignUpCopy> = {
  en: {
    eyebrow: "Trusted by product teams",
    quote: {
      text: "“We shipped our design system in six weeks instead of six months.”",
      name: "Omar Haddad",
      role: "VP Product, Meridian",
    },
    stats: [
      { value: "12,000+", label: "teams onboarded" },
      { value: "99.98%", label: "uptime last 12 months" },
    ],
    heading: "Create your account",
    description: "Free for 14 days. No card required.",
    firstNameLabel: "First name",
    firstNamePlaceholder: "Alex",
    lastNameLabel: "Last name",
    lastNamePlaceholder: "Rahman",
    emailLabel: "Work email",
    emailPlaceholder: "you@company.com",
    passwordLabel: "Password",
    passwordPlaceholder: "At least 10 characters",
    passwordHint: "Use 10+ characters with a number and a symbol.",
    showPassword: "Show password",
    hidePassword: "Hide password",
    termsLabel: "I agree to the Terms of Service and Privacy Policy.",
    submitLabel: "Create account",
    pendingLabel: "Creating your account",
    error: "We couldn’t create your account. Check your details and try again.",
    dividerLabel: "or sign up with",
    providers: [
      { platform: "google", label: "Google" },
      { platform: "github", label: "GitHub" },
    ],
    footerText: "Already have an account?",
    footerLink: { label: "Sign in", href: "#sign-in" },
  },
  ar: {
    eyebrow: "موثوقة لدى فرق المنتجات",
    quote: {
      text: "«أطلقنا نظام التصميم الخاص بنا خلال ستة أسابيع بدلًا من ستة أشهر.»",
      name: "عمر حداد",
      role: (
        <>
          نائب رئيس المنتج، <bdi dir="ltr">Meridian</bdi>
        </>
      ),
    },
    stats: [
      { value: "12,000+", label: "فريق انضم إلى المنصة" },
      {
        value: "99.98%",
        label: (
          <>
            زمن تشغيل خلال آخر <bdi dir="ltr">12</bdi> شهرًا
          </>
        ),
      },
    ],
    heading: "أنشئ حسابك",
    description: (
      <>
        مجانًا لمدة <bdi dir="ltr">14</bdi> يومًا. لا حاجة إلى بطاقة.
      </>
    ),
    firstNameLabel: "الاسم الأول",
    firstNamePlaceholder: "أليكس",
    lastNameLabel: "اسم العائلة",
    lastNamePlaceholder: "رحمن",
    emailLabel: "بريد العمل",
    emailPlaceholder: "you@company.com",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "10 أحرف على الأقل",
    passwordHint: (
      <>
        استخدم <bdi dir="ltr">10</bdi> أحرف أو أكثر مع رقم ورمز.
      </>
    ),
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    termsLabel: "أوافق على الشروط وسياسة الخصوصية.",
    submitLabel: "إنشاء الحساب",
    pendingLabel: "جارٍ إنشاء حسابك",
    error: "تعذّر إنشاء حسابك. تحقّق من بياناتك ثم حاول مجددًا.",
    dividerLabel: "أو أنشئ حسابًا باستخدام",
    providers: [
      { platform: "google", label: "Google" },
      { platform: "github", label: "GitHub" },
    ],
    footerText: "لديك حساب بالفعل؟",
    footerLink: { label: "تسجيل الدخول", href: "#sign-in" },
  },
}

export interface AuthSplitTestimonialSignUpProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthSplitTestimonialSignUpCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * Your logo, at the top of the dark panel: Figma shows the 32px-high Fasla
   * Logo lockup, its wordmark in the inverse foreground. Nothing shows without it.
   */
  logo?: React.ReactNode
  /**
   * Runs when the form is sent. While its promise is pending the button shows
   * its spinner and the form is disabled; a rejection shows `error`.
   */
  onSubmit?: (values: AuthSplitTestimonialSignUpValues) => Promise<void> | void
  /** Runs when a provider button is pressed. That button shows its spinner while the promise is pending. */
  onProviderSelect?: (platform: SocialPlatform) => Promise<void> | void
}

const LINK =
  "rounded-sm font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const ICON = { size: 16, strokeWidth: 1.5, absoluteStrokeWidth: true, "aria-hidden": true } as const

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Figma's entrance: the panel's parts rise 12px, 70ms apart, and the form's
 * 50ms apart beside them. Runs once; skipped under prefers-reduced-motion.
 */
function useEntrance(root: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const node = root.current
    if (!node || typeof node.animate !== "function" || reducedMotion()) return
    const animations: Animation[] = []
    const run = (selector: string, stagger: number) =>
      Array.from(node.querySelectorAll<HTMLElement>(selector)).forEach((part, index) =>
        animations.push(
          part.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], {
            duration: 320,
            delay: index * stagger,
            easing: "cubic-bezier(0, 0, 0.2, 1)",
            fill: "backwards",
          })
        )
      )
    run("[data-entrance-story]", 70)
    run("[data-entrance]", 50)
    return () => animations.forEach((animation) => animation.cancel())
  }, [root])
}

/**
 * A figure whose number counts up from zero over 900ms, as Figma's motion
 * notes ask: only the digits move, the label stays. It shows its final value
 * at once under prefers-reduced-motion, and assistive tech always reads the
 * final value.
 */
function CountUp({ value }: { value: string }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  React.useLayoutEffect(() => {
    const node = ref.current
    const match = /\d[\d,]*(\.\d+)?/.exec(value)
    if (!node || !match || reducedMotion()) return
    const target = Number(match[0].replace(/,/g, ""))
    const decimals = match[1] ? match[1].length - 1 : 0
    const grouped = match[0].includes(",")
    const before = value.slice(0, match.index)
    const after = value.slice(match.index + match[0].length)
    const format = (n: number) =>
      before + n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: grouped }) + after
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900)
      node.textContent = format(target * (1 - Math.pow(1 - t, 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    node.textContent = format(0)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      node.textContent = value
    }
  }, [value])
  return (
    <>
      <span ref={ref} aria-hidden="true" dir="ltr">
        {value}
      </span>
      <span className="sr-only" dir="ltr">
        {value}
      </span>
    </>
  )
}

export function AuthSplitTestimonialSignUp({
  locale = "en",
  eyebrow,
  quote,
  stats,
  heading,
  description,
  firstNameLabel,
  firstNamePlaceholder,
  lastNameLabel,
  lastNamePlaceholder,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  passwordHint,
  showPassword,
  hidePassword,
  termsLabel,
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
}: AuthSplitTestimonialSignUpProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const [pendingProvider, setPendingProvider] = React.useState<SocialPlatform | null>(null)
  const [visible, setVisible] = React.useState(false)
  const signIn = footerLink === undefined ? copy.footerLink : footerLink
  const testimonial = quote === undefined ? copy.quote : quote
  const figures = stats ?? copy.stats
  const label = eyebrow ?? copy.eyebrow
  const subline = description ?? copy.description
  const providerList = providers ?? copy.providers
  const busy = status === "pending" || pendingProvider !== null
  useEntrance(rootRef)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSubmit) return
    const data = new FormData(event.currentTarget)
    setStatus("pending")
    try {
      await onSubmit({
        firstName: String(data.get("firstName") ?? ""),
        lastName: String(data.get("lastName") ?? ""),
        email: String(data.get("email") ?? ""),
        password: String(data.get("password") ?? ""),
        terms: data.get("terms") === "on",
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
      className={cn("flex flex-col bg-background md:min-h-[720px] md:flex-row lg:min-h-[880px]", className)}
      {...props}
    >
      <div className="flex flex-col gap-6 bg-background-inverse p-8 text-foreground-inverse md:flex-1 md:justify-between md:gap-12 md:p-16 lg:flex-[704_1_0%]">
        {logo ? (
          <div data-entrance-story="" className="flex h-8 items-center [&>svg]:h-full [&>svg]:w-auto">
            {logo}
          </div>
        ) : null}
        {testimonial || label ? (
          <figure className="flex flex-col gap-6">
            {label ? (
              <p data-entrance-story="" className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground-inverse">
                {label}
              </p>
            ) : null}
            {testimonial ? (
              <>
                <blockquote data-entrance-story="" className="text-2xl font-semibold text-foreground-inverse md:text-3xl">
                  {testimonial.text}
                </blockquote>
                <figcaption data-entrance-story="" className="flex items-center gap-3">
                  <Avatar
                    size="32"
                    radius="rounded"
                    src={testimonial.avatar}
                    name={typeof testimonial.name === "string" ? testimonial.name : undefined}
                    className="size-10"
                  />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-sm font-semibold text-foreground-inverse">{testimonial.name}</span>
                    <span className="text-xs text-muted-foreground-inverse">{testimonial.role}</span>
                  </span>
                </figcaption>
              </>
            ) : null}
          </figure>
        ) : null}
        {figures.length > 0 ? (
          <dl className="hidden gap-10 md:flex">
            {figures.map((figure, index) => (
              <div key={index} data-entrance-story="" className="flex min-w-0 flex-1 flex-col-reverse gap-0.5">
                <dt className="text-xs text-muted-foreground-inverse">{figure.label}</dt>
                <dd className="text-xl font-semibold text-foreground-inverse">
                  <CountUp value={figure.value} />
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      <div className="flex items-center justify-center bg-background px-8 py-16 md:flex-1 md:p-16 lg:flex-[736_1_0%] lg:px-20">
        <div className="flex w-full min-w-0 flex-col gap-7 lg:max-w-[392px]">
          <div data-entrance="" className="flex flex-col gap-2">
            <h1 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl">
              {heading ?? copy.heading}
            </h1>
            {subline ? <p className="text-sm text-muted-foreground">{subline}</p> : null}
          </div>

          <form data-entrance="" onSubmit={submit} className="w-full">
            <fieldset disabled={busy} className="flex w-full min-w-0 flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row">
                <Input
                  name="firstName"
                  autoComplete="given-name"
                  required
                  label={firstNameLabel ?? copy.firstNameLabel}
                  placeholder={firstNamePlaceholder ?? copy.firstNamePlaceholder}
                  className="min-w-0 md:flex-1"
                />
                <Input
                  name="lastName"
                  autoComplete="family-name"
                  required
                  label={lastNameLabel ?? copy.lastNameLabel}
                  placeholder={lastNamePlaceholder ?? copy.lastNamePlaceholder}
                  className="min-w-0 md:flex-1"
                />
              </div>
              <Input
                type="email"
                name="email"
                autoComplete="email"
                required
                label={emailLabel ?? copy.emailLabel}
                placeholder={emailPlaceholder ?? copy.emailPlaceholder}
                startIcon={<Mail {...ICON} />}
              />
              <Input
                type={visible ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                required
                minLength={10}
                label={passwordLabel ?? copy.passwordLabel}
                placeholder={passwordPlaceholder ?? copy.passwordPlaceholder}
                description={passwordHint ?? copy.passwordHint}
                startIcon={<Lock {...ICON} />}
                endIcon={
                  <button
                    type="button"
                    aria-label={visible ? (hidePassword ?? copy.hidePassword) : (showPassword ?? copy.showPassword)}
                    aria-pressed={visible}
                    onClick={() => setVisible((shown) => !shown)}
                    className="-m-1 flex rounded-sm p-1 text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {visible ? <Eye {...ICON} /> : <EyeOff {...ICON} />}
                  </button>
                }
              />
              <Checkbox name="terms" size="sm" required label={termsLabel ?? copy.termsLabel} />
              <Button type="submit" loading={status === "pending"} loadingLabel={pendingLabel ?? copy.pendingLabel} className="w-full">
                {submitLabel ?? copy.submitLabel}
                <ArrowRight {...ICON} className="rtl:-scale-x-100" />
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
                <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.05em] text-muted-foreground">
                  {dividerLabel ?? copy.dividerLabel}
                </span>
                <div aria-hidden="true" className="h-px flex-1 bg-border" />
              </div>
              <div data-entrance="" className="flex w-full flex-col gap-2.5 md:flex-row">
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

          {signIn ? (
            <p data-entrance="" className="flex flex-wrap items-center justify-center gap-1 text-sm">
              <span className="text-muted-foreground">{footerText ?? copy.footerText}</span>
              <a href={signIn.href} className={LINK}>
                {signIn.label}
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const authSplitTestimonialSignUpCopy = COPY
