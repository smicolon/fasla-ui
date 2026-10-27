"use client"

import * as React from "react"
import { Check, Fingerprint, KeyRound, Laptop, Lock, Mail, ShieldCheck, Smartphone } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Authentications` (42586:4669), Type=Passkey Sign In.
 *
 * Passwordless first: a fingerprint badge, the heading, Continue with
 * passkey, the passkeys saved on the account, then "or" and two other ways in
 * (a password, an emailed link) and a line on why passkeys are safe.
 *
 * UI only: Continue calls `onPasskey`, which starts the platform's passkey
 * sheet. While it is pending the column dims and the button spins; once it
 * resolves the badge shows a check.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The column keeps 416px from Tablet up
 * and fills the width on a phone, where the heading steps down. Direction is
 * the page's `dir`; every side is a logical one.
 */

export interface AuthPasskeySignInLink {
  label: React.ReactNode
  href: string
}

export interface AuthPasskeySignInDevice {
  /** Which glyph leads the row. */
  kind: "laptop" | "phone" | "key"
  /** The device, as the platform names it. */
  name: React.ReactNode
  /** At the row's end: when it was last used, or that it is this device. */
  meta: React.ReactNode
  /** Marks this device: its `meta` turns `success`. */
  current?: boolean
}

export interface AuthPasskeySignInCopy {
  /** The page's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  /** The solid button that runs `onPasskey`. */
  passkeyLabel: React.ReactNode
  /** Read out while `onPasskey` runs. */
  pendingLabel: string
  /** Read out once `onPasskey` resolves. */
  successLabel: string
  /** Shown under the button when `onPasskey` rejects. */
  error: React.ReactNode
  /** The small heading over the saved passkeys. */
  devicesHeading: React.ReactNode
  /** The passkeys saved on the account. The panel is hidden when empty. */
  devices: AuthPasskeySignInDevice[]
  /** The word between the two rules. */
  dividerLabel: React.ReactNode
  /** The outline button: sign in with a password instead. Hidden when null. */
  passwordLink: AuthPasskeySignInLink | null
  /** The ghost button: get a sign-in link by email. Hidden when null. */
  emailLink: AuthPasskeySignInLink | null
  /** The closing line, after a shield. Hidden when empty. */
  footnote: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthPasskeySignInCopy> = {
  en: {
    heading: "Sign in with a passkey",
    description: "Use Touch ID, Face ID or your device PIN. Nothing to type, nothing to remember.",
    passkeyLabel: "Continue with passkey",
    pendingLabel: "Waiting for your passkey",
    successLabel: "Signed in",
    error: "We couldn’t verify your passkey. Try again, or use another way in.",
    devicesHeading: "Saved on this account",
    devices: [
      { kind: "laptop", name: "MacBook Pro — Touch ID", meta: "This device", current: true },
      { kind: "phone", name: "iPhone 16 — Face ID", meta: "2 days ago" },
      { kind: "key", name: "YubiKey 5C", meta: "Mar 2026" },
    ],
    dividerLabel: "or",
    passwordLink: { label: "Sign in with a password", href: "#sign-in" },
    emailLink: { label: "Email me a sign-in link", href: "#magic-link" },
    footnote: "Passkeys cannot be phished or reused.",
  },
  ar: {
    heading: "سجّل الدخول بمفتاح مرور",
    description: (
      <>
        استخدم <bdi dir="ltr">Touch ID</bdi> أو <bdi dir="ltr">Face ID</bdi> أو رمز جهازك. لا شيء تكتبه، ولا شيء تحفظه.
      </>
    ),
    passkeyLabel: "المتابعة بمفتاح المرور",
    pendingLabel: "بانتظار مفتاح المرور",
    successLabel: "تم تسجيل الدخول",
    error: "تعذّر التحقق من مفتاح المرور. حاول مجددًا، أو ادخل بطريقة أخرى.",
    devicesHeading: "المحفوظة على هذا الحساب",
    devices: [
      { kind: "laptop", name: "MacBook Pro — Touch ID", meta: "هذا الجهاز", current: true },
      { kind: "phone", name: "iPhone 16 — Face ID", meta: "قبل يومين" },
      {
        kind: "key",
        name: "YubiKey 5C",
        meta: (
          <>
            مارس <bdi dir="ltr">2026</bdi>
          </>
        ),
      },
    ],
    dividerLabel: "أو",
    passwordLink: { label: "سجّل الدخول بكلمة مرور", href: "#sign-in" },
    emailLink: { label: "أرسل لي رابط دخول بالبريد", href: "#magic-link" },
    footnote: "لا يمكن تصيّد مفاتيح المرور ولا إعادة استخدامها.",
  },
}

const DEVICE_ICONS = { laptop: Laptop, phone: Smartphone, key: KeyRound } as const

export interface AuthPasskeySignInProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<AuthPasskeySignInCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * Runs when Continue with passkey is pressed: start the platform's passkey
   * sheet here. While its promise is pending the column dims and the button
   * spins; a resolve shows a check in the badge, a rejection shows `error`.
   */
  onPasskey?: () => Promise<void> | void
}

/**
 * Figma's entrance: the fingerprint badge pulses once (1 → 1.06 → 1 over
 * 700ms) to mark the main way in, then rests. Skipped under
 * prefers-reduced-motion.
 */
function usePulse(ref: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const badge = ref.current
    if (!badge || typeof badge.animate !== "function") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const animation = badge.animate([{ transform: "none" }, { transform: "scale(1.06)" }, { transform: "none" }], {
      duration: 700,
      easing: "ease-in-out",
    })
    return () => animation.cancel()
  }, [ref])
}

export function AuthPasskeySignIn({
  locale = "en",
  heading,
  description,
  passkeyLabel,
  pendingLabel,
  successLabel,
  error,
  devicesHeading,
  devices,
  dividerLabel,
  passwordLink,
  emailLink,
  footnote,
  onPasskey,
  className,
  ...props
}: AuthPasskeySignInProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const badgeRef = React.useRef<HTMLDivElement>(null)
  const [status, setStatus] = React.useState<"idle" | "pending" | "done" | "error">("idle")
  const subline = description ?? copy.description
  const list = devices ?? copy.devices
  const password = passwordLink === undefined ? copy.passwordLink : passwordLink
  const email = emailLink === undefined ? copy.emailLink : emailLink
  const note = footnote ?? copy.footnote
  const checkRef = React.useRef<SVGSVGElement>(null)
  usePulse(badgeRef)

  // Figma: on success the fingerprint gives way to a check, drawn in over 300ms.
  React.useEffect(() => {
    const check = checkRef.current
    if (status !== "done" || !check || typeof check.animate !== "function") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const animation = check.animate([{ opacity: 0, transform: "scale(0.6)" }, { opacity: 1, transform: "none" }], {
      duration: 300,
      easing: "cubic-bezier(0, 0, 0.2, 1)",
    })
    return () => animation.cancel()
  }, [status])

  const start = async () => {
    if (!onPasskey) return
    setStatus("pending")
    try {
      await onPasskey()
      setStatus("done")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section aria-labelledby={headingId} className={cn("flex justify-center bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div
        className={cn(
          "flex w-full flex-col items-center gap-8 transition-opacity duration-200 motion-reduce:transition-none md:max-w-[416px]",
          status === "pending" && "opacity-60"
        )}
      >
        <div ref={badgeRef} className="flex size-[72px] items-center justify-center rounded-full bg-muted text-foreground">
          {status === "done" ? (
            <Check size={34} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-[34px] text-success" ref={checkRef} />
          ) : (
            <Fingerprint size={34} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-[34px]" />
          )}
        </div>

        <div className="flex w-full flex-col items-center gap-2 text-center">
          <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
            {heading ?? copy.heading}
          </h1>
          {subline ? <p className="text-sm text-muted-foreground">{subline}</p> : null}
        </div>

        <div className="flex w-full flex-col gap-3">
          <Button type="button" loading={status === "pending"} loadingLabel={pendingLabel ?? copy.pendingLabel} onClick={start} className="w-full">
            <Fingerprint size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
            {passkeyLabel ?? copy.passkeyLabel}
          </Button>
          <p role="status" className="text-sm empty:hidden">
            {status === "error" ? <span className="text-destructive">{error ?? copy.error}</span> : null}
            {status === "done" ? <span className="sr-only">{successLabel ?? copy.successLabel}</span> : null}
          </p>
          {list.length > 0 ? (
            <div className="flex w-full flex-col gap-2.5 rounded-lg bg-muted p-4">
              <p className="text-xs font-semibold text-muted-foreground">{devicesHeading ?? copy.devicesHeading}</p>
              <ul className="flex flex-col gap-2.5">
                {list.map((device, index) => {
                  const Icon = DEVICE_ICONS[device.kind]
                  return (
                    <li key={index} className="flex items-center gap-2.5 text-xs">
                      <Icon size={15} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-[15px] shrink-0 text-foreground" />
                      <bdi className="min-w-0 flex-1 truncate text-start text-foreground">{device.name}</bdi>
                      <span className={cn("shrink-0", device.current ? "font-medium text-success" : "text-muted-foreground")}>{device.meta}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null}
        </div>

        {password || email ? (
          <>
            <div className="flex w-full items-center gap-3">
              <div aria-hidden="true" className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted-foreground">{dividerLabel ?? copy.dividerLabel}</span>
              <div aria-hidden="true" className="h-px flex-1 bg-border" />
            </div>
            <div className="flex w-full flex-col gap-2.5">
              {password ? (
                <a href={password.href} className={buttonVariants({ variant: "outline", className: "w-full" })}>
                  <Lock size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                  {password.label}
                </a>
              ) : null}
              {email ? (
                <a href={email.href} className={buttonVariants({ variant: "ghost", className: "w-full" })}>
                  <Mail size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                  {email.label}
                </a>
              ) : null}
            </div>
          </>
        ) : null}

        {note ? (
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-3.5 shrink-0" />
            <span>{note}</span>
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
export const authPasskeySignInCopy = COPY
