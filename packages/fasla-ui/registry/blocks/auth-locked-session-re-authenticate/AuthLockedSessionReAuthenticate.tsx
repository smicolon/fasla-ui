"use client"

import * as React from "react"
import { ArrowRight, Eye, EyeOff, Lock } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { Button } from "../../ui/button/button"
import { Input } from "../../ui/input/input"

/*
 * Figma: `Authentications` (42586:4669), Type=Locked Session Re-authenticate.
 *
 * The screen a timed-out session leaves: the signed-in person's photo, name
 * and email, a note saying why it locked, the password and Unlock, then a
 * passkey link and a way to sign out and switch account.
 *
 * The identity is there from the first frame, as Figma asks: only the note,
 * the field and the button fade in. A wrong password shakes the field once
 * and marks it invalid; the email stays.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The card keeps 424px from Tablet up and
 * fills the width on a phone, with 16px sides. Direction is the page's `dir`;
 * every side is a logical one, and the arrow mirrors.
 */

export interface AuthLockedSessionReAuthenticateLink {
  label: React.ReactNode
  href: string
}

export interface AuthLockedSessionReAuthenticateAccount {
  /** The person's name: the photo's text alternative and the initials without a photo. */
  name: string
  /** The email under the heading, and the username password managers fill. */
  email: string
  /** The photo. Without it the avatar shows the initials. */
  avatar?: string
}

export interface AuthLockedSessionReAuthenticateCopy {
  /** The card's heading, an `h1`: greet the person by name. */
  heading: React.ReactNode
  /** The muted note over the field: why the session locked. Hidden when empty. */
  note: React.ReactNode
  passwordLabel: React.ReactNode
  passwordPlaceholder: string
  /** The eye button's name while the password is hidden. */
  showPassword: string
  /** The eye button's name while the password shows. */
  hidePassword: string
  submitLabel: React.ReactNode
  /** Read out while `onSubmit` runs. */
  pendingLabel: string
  /** Under the field when `onSubmit` rejects: the password was wrong. */
  error: React.ReactNode
  /** The link under the form, to another way in. Hidden when null. */
  passkeyLink: AuthLockedSessionReAuthenticateLink | null
  /** The question before the switch-account link. */
  switchText: React.ReactNode
  /** The closing link: sign out and use another account. Hidden, with `switchText`, when null. */
  switchLink: AuthLockedSessionReAuthenticateLink | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthLockedSessionReAuthenticateCopy> = {
  en: {
    heading: "Welcome back, Alex",
    note: "Your session was locked after 30 minutes of inactivity.",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password to unlock",
    showPassword: "Show password",
    hidePassword: "Hide password",
    submitLabel: "Unlock",
    pendingLabel: "Unlocking",
    error: "That password isn’t right. Try again.",
    passkeyLink: { label: "Use a passkey instead", href: "#passkey" },
    switchText: "Not you?",
    switchLink: { label: "Sign out and switch account", href: "#sign-out" },
  },
  ar: {
    heading: "أهلًا بعودتك يا أليكس",
    note: (
      <>
        قُفلت جلستك بعد <bdi dir="ltr">30</bdi> دقيقة من عدم النشاط.
      </>
    ),
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "أدخل كلمة المرور للمتابعة",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    submitLabel: "إلغاء القفل",
    pendingLabel: "جارٍ إلغاء القفل",
    error: "كلمة المرور غير صحيحة. حاول مجددًا.",
    passkeyLink: { label: "استخدم مفتاح مرور بدلًا من ذلك", href: "#passkey" },
    switchText: "لست أنت؟",
    switchLink: { label: "سجّل الخروج وبدّل الحساب", href: "#sign-out" },
  },
}

/** Figma's person. The photo comes from outside. */
const ACCOUNT: Record<"en" | "ar", AuthLockedSessionReAuthenticateAccount> = {
  en: { name: "Alex", email: "alex@northwind.co" },
  ar: { name: "أليكس", email: "alex@northwind.co" },
}

export interface AuthLockedSessionReAuthenticateProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onSubmit">,
    Partial<AuthLockedSessionReAuthenticateCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Who is signed in. Defaults to Figma's Alex, without a photo. */
  account?: AuthLockedSessionReAuthenticateAccount
  /**
   * Runs when the form is sent, with the account's email and the password.
   * While its promise is pending the button shows its spinner and the field is
   * disabled; a rejection marks the field invalid, shakes it and shows `error`.
   */
  onSubmit?: (values: { email: string; password: string }) => Promise<void> | void
}

const LINK =
  "rounded-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

/**
 * Figma's entrance: only the note, the field and the button fade in and rise
 * 8px over 250ms. Runs once; skipped under prefers-reduced-motion.
 */
function useEntrance(ref: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root || typeof root.animate !== "function") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const parts = Array.from(root.querySelectorAll<HTMLElement>("[data-entrance]"))
    const animations = parts.map((part) =>
      part.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], {
        duration: 250,
        easing: "cubic-bezier(0, 0, 0.2, 1)",
        fill: "backwards",
      })
    )
    return () => animations.forEach((animation) => animation.cancel())
  }, [ref])
}

/** Figma's error shake: 6px either way over 400ms, once. Skipped under prefers-reduced-motion. */
function shake(element: HTMLElement | null) {
  if (!element || typeof element.animate !== "function") return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  element.animate(
    [
      { transform: "none" },
      { transform: "translateX(-6px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(-4px)" },
      { transform: "translateX(4px)" },
      { transform: "none" },
    ],
    { duration: 400, easing: "ease-in-out" }
  )
}

export function AuthLockedSessionReAuthenticate({
  locale = "en",
  account,
  heading,
  note,
  passwordLabel,
  passwordPlaceholder,
  showPassword,
  hidePassword,
  submitLabel,
  pendingLabel,
  error,
  passkeyLink,
  switchText,
  switchLink,
  onSubmit,
  className,
  ...props
}: AuthLockedSessionReAuthenticateProps) {
  const copy = COPY[locale]
  const person = account ?? ACCOUNT[locale]
  const headingId = React.useId()
  const cardRef = React.useRef<HTMLDivElement>(null)
  const fieldRef = React.useRef<HTMLDivElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const [visible, setVisible] = React.useState(false)
  const strip = note ?? copy.note
  const passkey = passkeyLink === undefined ? copy.passkeyLink : passkeyLink
  const switchAccount = switchLink === undefined ? copy.switchLink : switchLink
  useEntrance(cardRef)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onSubmit) return
    const data = new FormData(event.currentTarget)
    setStatus("pending")
    try {
      await onSubmit({ email: person.email, password: String(data.get("password") ?? "") })
      setStatus("idle")
    } catch {
      setStatus("error")
      // After the fieldset is enabled again, so the field can take focus.
      window.setTimeout(() => {
        shake(fieldRef.current)
        passwordRef.current?.focus()
      })
    }
  }

  return (
    <section aria-labelledby={headingId} className={cn("flex justify-center bg-muted p-8 md:p-16 lg:p-24", className)} {...props}>
      <div
        ref={cardRef}
        className="flex w-full flex-col items-center gap-7 rounded-xl border border-border bg-card px-4 py-8 text-card-foreground shadow-lg md:max-w-[424px] md:p-8"
      >
        <div className="flex w-full flex-col items-center gap-3.5">
          <Avatar size="32" radius="rounded" border src={person.avatar} name={person.name} className="size-[76px] text-2xl" />
          <div className="flex w-full flex-col items-center gap-1.5 text-center">
            <h1 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl">
              {heading ?? copy.heading}
            </h1>
            <p className="text-sm text-muted-foreground">
              <bdi dir="ltr">{person.email}</bdi>
            </p>
          </div>
        </div>

        {strip ? (
          <div data-entrance="" className="flex w-full items-center gap-2.5 rounded-md bg-muted p-3.5 text-foreground">
            <Lock size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-4 shrink-0" />
            <p className="text-xs">{strip}</p>
          </div>
        ) : null}

        <form data-entrance="" onSubmit={submit} className="w-full">
          <fieldset disabled={status === "pending"} className="flex w-full min-w-0 flex-col gap-4">
            {/* For password managers: the account this password belongs to. */}
            <input type="text" name="username" autoComplete="username" value={person.email} readOnly hidden />
            <div ref={fieldRef}>
              <Input
                ref={passwordRef}
                type={visible ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                label={passwordLabel ?? copy.passwordLabel}
                placeholder={passwordPlaceholder ?? copy.passwordPlaceholder}
                invalid={status === "error"}
                error={error ?? copy.error}
                onChange={() => status === "error" && setStatus("idle")}
                startIcon={<Lock size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />}
                endIcon={
                  <button
                    type="button"
                    aria-label={visible ? (hidePassword ?? copy.hidePassword) : (showPassword ?? copy.showPassword)}
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
            <Button type="submit" loading={status === "pending"} loadingLabel={pendingLabel ?? copy.pendingLabel} className="w-full">
              {submitLabel ?? copy.submitLabel}
              <ArrowRight size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="rtl:-scale-x-100" />
            </Button>
          </fieldset>
        </form>

        {passkey || switchAccount ? (
          <div className="flex w-full flex-col items-center gap-2.5 text-center text-sm">
            {passkey ? (
              <a href={passkey.href} className={cn("font-medium text-foreground", LINK)}>
                {passkey.label}
              </a>
            ) : null}
            {switchAccount ? (
              <p className="flex flex-wrap items-center justify-center gap-1">
                <span className="text-muted-foreground">{switchText ?? copy.switchText}</span>
                <a href={switchAccount.href} className={cn("font-semibold text-foreground", LINK)}>
                  {switchAccount.label}
                </a>
              </p>
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
export const authLockedSessionReAuthenticateCopy = COPY
