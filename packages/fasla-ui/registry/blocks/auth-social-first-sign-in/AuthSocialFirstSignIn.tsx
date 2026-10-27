"use client"

import * as React from "react"
import { ArrowRight, Phone } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"
import { SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"

/*
 * Figma: `Authentications` (42586:4669), Type=Social-First Sign In.
 *
 * Providers first: a 400px column with the logo lockup, a heading, four
 * pill buttons (three providers and a phone number), an "or" rule, then one
 * email field with Continue, and the legal links at the foot. One screen for
 * both signing in and signing up.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The column keeps 400px from Tablet up
 * and fills the width on a phone. Direction is the page's `dir`; every side
 * is a logical one, and the Continue arrow mirrors.
 */

/** A provider button's choice: a Social Icons platform, or a phone number. */
export type AuthSocialFirstSignInMethod = SocialPlatform | "phone"

export interface AuthSocialFirstSignInLink {
  label: React.ReactNode
  href: string
}

export interface AuthSocialFirstSignInProvider {
  method: AuthSocialFirstSignInMethod
  /** The button's text: name the provider. */
  label: React.ReactNode
}

export interface AuthSocialFirstSignInCopy {
  /** The column's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  /** The pill buttons, in order. The rule under them hides with them when empty. */
  providers: AuthSocialFirstSignInProvider[]
  /** The word on the rule between the providers and the email field. */
  dividerLabel: React.ReactNode
  emailLabel: React.ReactNode
  emailPlaceholder: string
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** Shown under Continue when `onSubmit` rejects. */
  error: React.ReactNode
  /** The links at the foot, with a rule between each. Hidden when empty. */
  legalLinks: AuthSocialFirstSignInLink[]
  /** The name assistive tech reads for the foot's links. */
  legalLabel: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthSocialFirstSignInCopy> = {
  en: {
    heading: "Log in or sign up",
    description: "One account for everything you build with Fasla.",
    providers: [
      { method: "google", label: "Continue with Google" },
      { method: "apple", label: "Continue with Apple" },
      { method: "github", label: "Continue with GitHub" },
      { method: "phone", label: "Continue with phone" },
    ],
    dividerLabel: "or",
    emailLabel: "Email address",
    emailPlaceholder: "you@company.com",
    submitLabel: "Continue",
    pendingLabel: "Continuing",
    error: "We couldn’t continue with that email. Check it and try again.",
    legalLinks: [
      { label: "Terms of Use", href: "#terms" },
      { label: "Privacy Policy", href: "#privacy" },
    ],
    legalLabel: "Legal",
  },
  ar: {
    heading: "سجّل الدخول أو أنشئ حسابًا",
    description: "حساب واحد لكل ما تبنيه مع فاصلة.",
    providers: [
      { method: "google", label: "المتابعة باستخدام Google" },
      { method: "apple", label: "المتابعة باستخدام Apple" },
      { method: "github", label: "المتابعة باستخدام GitHub" },
      { method: "phone", label: "المتابعة برقم الهاتف" },
    ],
    dividerLabel: "أو",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "you@company.com",
    submitLabel: "متابعة",
    pendingLabel: "جارٍ المتابعة",
    error: "تعذّرت المتابعة بهذا البريد. تحقّق منه ثم حاول مجددًا.",
    legalLinks: [
      { label: "شروط الاستخدام", href: "#terms" },
      { label: "سياسة الخصوصية", href: "#privacy" },
    ],
    legalLabel: "روابط قانونية",
  },
}

export interface AuthSocialFirstSignInProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthSocialFirstSignInCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Your logo, over the heading: Figma shows the Fasla Logo lockup, 34px tall. Nothing shows without it. */
  logo?: React.ReactNode
  /**
   * Runs when a provider button is pressed. That button shows its spinner and
   * the rest of the column dims until the promise settles.
   */
  onProviderSelect?: (method: AuthSocialFirstSignInMethod) => Promise<void> | void
  /**
   * Runs when the email is sent. While its promise is pending Continue shows
   * its spinner; a rejection shows `error`.
   */
  onSubmit?: (values: { email: string }) => Promise<void> | void
}

/**
 * Figma's entrance: the provider buttons fade in and rise 10px one after
 * another (60ms apart, 40ms on a phone), then the rule draws outward from
 * its centre and the email row fades in last. Runs once; skipped under
 * prefers-reduced-motion.
 */
function useEntrance(ref: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root || typeof root.animate !== "function") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const stagger = window.matchMedia("(min-width: 768px)").matches ? 60 : 40
    const ease = "cubic-bezier(0, 0, 0.2, 1)"
    const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-entrance=row]"))
    const rule = Array.from(root.querySelectorAll<HTMLElement>("[data-entrance=rule]"))
    const last = Array.from(root.querySelectorAll<HTMLElement>("[data-entrance=last]"))
    const ruleAt = rows.length * stagger + 200
    const animations = [
      ...rows.map((row, index) =>
        row.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], {
          duration: 320,
          delay: index * stagger,
          easing: ease,
          fill: "backwards",
        })
      ),
      ...rule.map((line) =>
        line.animate([{ transform: "scaleX(0)" }, { transform: "none" }], { duration: 200, delay: ruleAt, easing: ease, fill: "backwards" })
      ),
      ...last.map((part) =>
        part.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, delay: ruleAt + 200, easing: ease, fill: "backwards" })
      ),
    ]
    return () => animations.forEach((animation) => animation.cancel())
  }, [ref])
}

/** A rule's line, drawn outward from the middle of the rule. */
const RULE_LINE = "h-px flex-1 bg-border"

export function AuthSocialFirstSignIn({
  locale = "en",
  heading,
  description,
  providers,
  dividerLabel,
  emailLabel,
  emailPlaceholder,
  submitLabel,
  pendingLabel,
  error,
  legalLinks,
  legalLabel,
  logo,
  onProviderSelect,
  onSubmit,
  className,
  ...props
}: AuthSocialFirstSignInProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const columnRef = React.useRef<HTMLDivElement>(null)
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const [pendingMethod, setPendingMethod] = React.useState<AuthSocialFirstSignInMethod | null>(null)
  const providerList = providers ?? copy.providers
  const links = legalLinks ?? copy.legalLinks
  const subline = description ?? copy.description
  const busy = status === "pending" || pendingMethod !== null
  useEntrance(columnRef)

  const selectProvider = async (method: AuthSocialFirstSignInMethod) => {
    if (!onProviderSelect) return
    setPendingMethod(method)
    try {
      await onProviderSelect(method)
    } finally {
      setPendingMethod(null)
    }
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSubmit) return
    const data = new FormData(event.currentTarget)
    setStatus("pending")
    try {
      await onSubmit({ email: String(data.get("email") ?? "") })
      setStatus("idle")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn("flex justify-center bg-background p-8 md:p-16 lg:p-24", className)}
      {...props}
    >
      <div ref={columnRef} className="flex w-full flex-col items-center gap-8 md:max-w-[400px]">
        <div className="flex w-full flex-col items-center gap-4">
          {logo ? <div className="flex h-[2.125rem] items-center [&>svg]:h-full [&>svg]:w-auto">{logo}</div> : null}
          <div className="flex w-full flex-col items-center gap-1.5 text-center">
            <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
              {heading ?? copy.heading}
            </h1>
            {subline ? <p className="text-sm text-muted-foreground">{subline}</p> : null}
          </div>
        </div>

        {providerList.length > 0 ? (
          <>
            <div className="flex w-full flex-col gap-2.5">
              {providerList.map((provider) => (
                <div key={provider.method} data-entrance="row">
                  <Button
                    type="button"
                    variant="outline"
                    radius="rounded"
                    disabled={busy && pendingMethod !== provider.method}
                    loading={pendingMethod === provider.method}
                    onClick={() => selectProvider(provider.method)}
                    className="w-full transition-[transform,box-shadow,background-color,opacity] duration-150 hover:ring-foreground disabled:opacity-40 hover:-translate-y-px motion-reduce:transition-none"
                  >
                    {provider.method === "phone" ? (
                      <Phone size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                    ) : (
                      <SocialIcon platform={provider.method} className="size-4" />
                    )}
                    {provider.label}
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex w-full items-center gap-3">
              <div aria-hidden="true" data-entrance="rule" className={RULE_LINE} />
              <span className="text-xs font-medium text-muted-foreground">{dividerLabel ?? copy.dividerLabel}</span>
              <div aria-hidden="true" data-entrance="rule" className={RULE_LINE} />
            </div>
          </>
        ) : null}

        <form data-entrance="last" onSubmit={submit} className="w-full">
          <fieldset
            disabled={busy}
            className={cn(
              "flex w-full min-w-0 flex-col gap-3 transition-opacity duration-150 motion-reduce:transition-none",
              pendingMethod !== null && "opacity-40"
            )}
          >
            <Input
              type="email"
              name="email"
              autoComplete="email"
              required
              radius="rounded"
              label={emailLabel ?? copy.emailLabel}
              placeholder={emailPlaceholder ?? copy.emailPlaceholder}
            />
            <Button
              type="submit"
              radius="rounded"
              loading={status === "pending"}
              loadingLabel={pendingLabel ?? copy.pendingLabel}
              className="group/continue w-full"
            >
              {submitLabel ?? copy.submitLabel}
              <ArrowRight
                size={16}
                strokeWidth={1.5}
                absoluteStrokeWidth
                aria-hidden="true"
                className="transition-transform duration-150 rtl:-scale-x-100 group-hover/continue:translate-x-[3px] rtl:group-hover/continue:-translate-x-[3px] motion-reduce:transition-none"
              />
            </Button>
            <p role="alert" className="text-sm text-destructive empty:hidden">
              {status === "error" ? (error ?? copy.error) : null}
            </p>
          </fieldset>
        </form>

        {links.length > 0 ? (
          <nav data-entrance="last" aria-label={legalLabel ?? copy.legalLabel} className="w-full">
            <ul className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              {links.map((link, index) => (
                <li key={link.href} className="flex items-center gap-2">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-border">
                      |
                    </span>
                  ) : null}
                  <a
                    href={link.href}
                    className="rounded-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const authSocialFirstSignInCopy = COPY
