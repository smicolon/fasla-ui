"use client"

import * as React from "react"
import { ArrowLeft, Building2, Check, CircleHelp, KeyRound, Mail } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"

/*
 * Figma: `Authentications` (42586:4669), Type=Forgot Password.
 *
 * One column on a plain page: a link back to sign in, a key tile, the heading,
 * an email field and Send reset link, then a rule and two ways to get help.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The column keeps 400px from Tablet up
 * and fills the width on a phone, where the heading steps down. Direction is
 * the page's `dir`; every side is a logical one, and the back arrow mirrors.
 */

export interface AuthForgotPasswordLink {
  label: React.ReactNode
  href: string
}

export interface AuthForgotPasswordHelpLink extends AuthForgotPasswordLink {
  /** A 14px glyph before the label. */
  icon?: React.ReactNode
}

export interface AuthForgotPasswordCopy {
  /** The link over the heading, back to sign in. Hidden when null. */
  backLink: AuthForgotPasswordLink | null
  /** The page's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  emailLabel: React.ReactNode
  emailPlaceholder: string
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** The button's label for a moment once the link is sent. */
  sentLabel: React.ReactNode
  /** Shown under the button when `onSubmit` rejects. */
  error: React.ReactNode
  /** The small heading over the help links. */
  helpHeading: React.ReactNode
  /** The ways to get help under the rule. The rule and the list are hidden when empty. */
  helpLinks: AuthForgotPasswordHelpLink[]
}

const ICON = { size: 14, strokeWidth: 1.5, absoluteStrokeWidth: true, "aria-hidden": true, className: "size-3.5 shrink-0" } as const

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthForgotPasswordCopy> = {
  en: {
    backLink: { label: "Back to sign in", href: "#sign-in" },
    heading: "Forgot your password?",
    description: "Enter the email you use for Fasla and we will send you a link to set a new password.",
    emailLabel: "Email address",
    emailPlaceholder: "you@company.com",
    submitLabel: "Send reset link",
    pendingLabel: "Sending the link",
    sentLabel: "Link sent",
    error: "We couldn’t send the link. Check the email address and try again.",
    helpHeading: "Still stuck?",
    helpLinks: [
      { label: "Contact support", href: "#support", icon: <CircleHelp {...ICON} /> },
      { label: "Sign in with your organisation (SSO)", href: "#sso", icon: <Building2 {...ICON} /> },
    ],
  },
  ar: {
    backLink: { label: "العودة إلى تسجيل الدخول", href: "#sign-in" },
    heading: "نسيت كلمة المرور؟",
    description: "أدخل البريد الإلكتروني الذي تستخدمه في فاصلة، وسنرسل إليك رابطًا لتعيين كلمة مرور جديدة.",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "you@company.com",
    submitLabel: "إرسال رابط إعادة التعيين",
    pendingLabel: "جارٍ إرسال الرابط",
    sentLabel: "أُرسل الرابط",
    error: "تعذّر إرسال الرابط. تحقّق من البريد الإلكتروني ثم حاول مجددًا.",
    helpHeading: "ما زلت تواجه مشكلة؟",
    helpLinks: [
      { label: "تواصل مع الدعم", href: "#support", icon: <CircleHelp {...ICON} /> },
      {
        label: (
          <>
            سجّل الدخول عبر مؤسستك (<bdi dir="ltr">SSO</bdi>)
          </>
        ),
        href: "#sso",
        icon: <Building2 {...ICON} />,
      },
    ],
  },
}

export interface AuthForgotPasswordProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthForgotPasswordCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * Runs when the form is sent, with the email. While its promise is pending
   * the button shows its spinner; once it resolves the button says
   * `sentLabel` for a moment. A rejection shows `error`.
   */
  onSubmit?: (values: { email: string }) => Promise<void> | void
}

const LINK =
  "rounded-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

/** How long the button says the link was sent before it can send again. */
const SENT_MS = 1200

/**
 * Figma's entrance: the column fades in and rises 10px, its parts 60ms apart.
 * Runs once; skipped under prefers-reduced-motion.
 */
function useEntrance(ref: React.RefObject<HTMLElement | null>, { rise = 10, duration = 320, stagger = 60 } = {}) {
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

export function AuthForgotPassword({
  locale = "en",
  backLink,
  heading,
  description,
  emailLabel,
  emailPlaceholder,
  submitLabel,
  pendingLabel,
  sentLabel,
  error,
  helpHeading,
  helpLinks,
  onSubmit,
  className,
  ...props
}: AuthForgotPasswordProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const columnRef = React.useRef<HTMLDivElement>(null)
  const [status, setStatus] = React.useState<"idle" | "pending" | "sent" | "error">("idle")
  const back = backLink === undefined ? copy.backLink : backLink
  const subline = description ?? copy.description
  const help = helpLinks ?? copy.helpLinks
  useEntrance(columnRef)

  React.useEffect(() => {
    if (status !== "sent") return
    const timer = window.setTimeout(() => setStatus("idle"), SENT_MS)
    return () => window.clearTimeout(timer)
  }, [status])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSubmit) return
    const data = new FormData(event.currentTarget)
    setStatus("pending")
    try {
      await onSubmit({ email: String(data.get("email") ?? "") })
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section aria-labelledby={headingId} className={cn("flex justify-center bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div ref={columnRef} className="flex w-full flex-col items-start gap-8 md:max-w-[400px]">
        {back ? (
          <a data-entrance="" href={back.href} className={cn("flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground", LINK)}>
            <ArrowLeft size={15} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-[15px] shrink-0 rtl:-scale-x-100" />
            {back.label}
          </a>
        ) : null}

        <div data-entrance="" className="flex w-full flex-col items-start gap-2">
          <div className="flex size-[52px] items-center justify-center rounded-md bg-muted text-foreground">
            <KeyRound size={24} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-6" />
          </div>
          <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
            {heading ?? copy.heading}
          </h1>
          {subline ? <p className="text-sm text-muted-foreground">{subline}</p> : null}
        </div>

        <form data-entrance="" onSubmit={submit} className="w-full">
          <fieldset disabled={status === "pending"} className="flex w-full min-w-0 flex-col gap-4">
            <Input
              type="email"
              name="email"
              autoComplete="email"
              required
              label={emailLabel ?? copy.emailLabel}
              placeholder={emailPlaceholder ?? copy.emailPlaceholder}
              startIcon={<Mail size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />}
            />
            <Button
              type="submit"
              loading={status === "pending"}
              loadingLabel={pendingLabel ?? copy.pendingLabel}
              aria-disabled={status === "sent" || undefined}
              onClick={(event) => status === "sent" && event.preventDefault()}
              className="w-full"
            >
              {status === "sent" ? (
                <>
                  <Check size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                  {sentLabel ?? copy.sentLabel}
                </>
              ) : (
                (submitLabel ?? copy.submitLabel)
              )}
            </Button>
            <p role="status" className="text-sm text-destructive empty:hidden">
              {status === "error" ? (error ?? copy.error) : null}
            </p>
          </fieldset>
        </form>

        {help.length > 0 ? (
          <>
            {/* Separator: swap for the Separator component once it ships. */}
            <div data-separator="" aria-hidden="true" className="h-px w-full shrink-0 bg-border" />
            <nav data-entrance="" aria-label={typeof (helpHeading ?? copy.helpHeading) === "string" ? String(helpHeading ?? copy.helpHeading) : undefined} className="flex w-full flex-col gap-2.5">
              <p className="text-xs font-semibold text-muted-foreground">{helpHeading ?? copy.helpHeading}</p>
              <ul className="flex flex-col gap-2.5">
                {help.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className={cn("inline-flex items-center gap-2 text-sm font-medium text-foreground", LINK)}>
                      {link.icon}
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
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
export const authForgotPasswordCopy = COPY
