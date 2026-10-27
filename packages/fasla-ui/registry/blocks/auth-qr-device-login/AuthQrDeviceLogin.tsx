"use client"

import * as React from "react"
import { CircleCheck, Mail, RotateCw } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Authentications` (42586:4669), Type=QR Device Login.
 *
 * Sign in by scanning: a muted panel with the QR code, its refresh timer and
 * a Refresh code button; beside it the logo, a heading, three numbered steps
 * and, under a rule, a way to sign in with email instead.
 *
 * The code is yours: pass it as `qr` (an <svg>, a canvas, an <img>). The
 * timer is real: after `expiresIn` seconds the code blurs and dims and says
 * it has expired, until Refresh code runs `onRefresh`. Set `approved` once the
 * phone has approved, and the panel shows a check.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The panels sit side by side from Tablet
 * up and stack on a phone, the code on top. Direction is the page's `dir`, so
 * the code panel moves to the right in Arabic; the code itself is never
 * mirrored, as a mirrored code won't scan.
 */

export interface AuthQrDeviceLoginLink {
  label: React.ReactNode
  href: string
}

export interface AuthQrDeviceLoginCopy {
  /** The heading under the code. */
  scanLabel: React.ReactNode
  /** The line under it: how long a code lasts. */
  scanHint: React.ReactNode
  refreshLabel: React.ReactNode
  /** Read out while `onRefresh` runs. */
  refreshingLabel: string
  /** Laid over the code, and read out, once it has expired. */
  expired: React.ReactNode
  /** Shown in place of the code, and read out, once `approved` is set. */
  approvedLabel: React.ReactNode
  /** The page's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  /** The numbered steps: how to scan. The list is hidden when empty. */
  steps: React.ReactNode[]
  /** The line over the email link. */
  altText: React.ReactNode
  /** The way in without the app. Hidden, with the rule and `altText`, when null. */
  emailLink: AuthQrDeviceLoginLink | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthQrDeviceLoginCopy> = {
  en: {
    scanLabel: "Scan to sign in",
    scanHint: "Code refreshes every 60 seconds.",
    refreshLabel: "Refresh code",
    refreshingLabel: "Getting a new code",
    expired: "Code expired",
    approvedLabel: "Approved. Signing you in…",
    heading: "Sign in from your phone",
    description: "No typing required — approve this sign-in with the Fasla app.",
    steps: ["Open the Fasla app on your phone.", "Go to Settings, then Scan a QR code.", "Point your camera at the code and approve."],
    altText: "Do not have the app?",
    emailLink: { label: "Sign in with email instead", href: "#sign-in" },
  },
  ar: {
    scanLabel: "امسح الرمز لتسجيل الدخول",
    scanHint: "يتجدّد الرمز كل 60 ثانية.",
    refreshLabel: "تحديث الرمز",
    refreshingLabel: "جارٍ إنشاء رمز جديد",
    expired: "انتهت صلاحية الرمز",
    approvedLabel: "تمّت الموافقة. جارٍ تسجيل دخولك…",
    heading: "سجّل الدخول من هاتفك",
    description: "لا حاجة إلى الكتابة، وافق على تسجيل الدخول من تطبيق فاصلة.",
    steps: [
      "افتح تطبيق فاصلة على هاتفك.",
      <>
        اذهب إلى الإعدادات، ثم اختر مسح رمز <bdi dir="ltr">QR</bdi>.
      </>,
      "وجّه الكاميرا نحو الرمز ثم وافق.",
    ],
    altText: "لا تملك التطبيق؟",
    emailLink: { label: "سجّل الدخول بالبريد بدلًا من ذلك", href: "#sign-in" },
  },
}

export interface AuthQrDeviceLoginProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AuthQrDeviceLoginCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** Your logo, over the heading: Figma shows the 28px-tall Fasla Logo lockup. Nothing shows without it. */
  logo?: React.ReactNode
  /** The QR code to scan, about 120px square. The frame stays empty without it. */
  qr?: React.ReactNode
  /**
   * Seconds until the code expires, counted from when it shows and again
   * after each refresh. `0` turns the timer off.
   * @default 60
   */
  expiresIn?: number
  /**
   * Runs when Refresh code is pressed: fetch a new code and pass it as `qr`.
   * The button shows its spinner until the promise settles, then the timer
   * starts again.
   */
  onRefresh?: () => Promise<void> | void
  /** The phone approved this sign-in: the code gives way to a check and `approvedLabel`. */
  approved?: boolean
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Figma's entrance: the three steps fade in and rise 60ms apart on first
 * view. Runs once; skipped under prefers-reduced-motion.
 */
function useEntrance(ref: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const root = ref.current
    if (!root || typeof root.animate !== "function" || reducedMotion()) return
    const animations = Array.from(root.querySelectorAll<HTMLElement>("[data-entrance]")).map((part, index) =>
      part.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], {
        duration: 280,
        delay: index * 60,
        easing: "cubic-bezier(0, 0, 0.2, 1)",
        fill: "backwards",
      })
    )
    return () => animations.forEach((animation) => animation.cancel())
  }, [ref])
}

export function AuthQrDeviceLogin({
  locale = "en",
  scanLabel,
  scanHint,
  refreshLabel,
  refreshingLabel,
  expired,
  approvedLabel,
  heading,
  description,
  steps,
  altText,
  emailLink,
  logo,
  qr,
  expiresIn = 60,
  onRefresh,
  approved = false,
  className,
  ...props
}: AuthQrDeviceLoginProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const stepsRef = React.useRef<HTMLOListElement>(null)
  const codeRef = React.useRef<HTMLDivElement>(null)
  const iconRef = React.useRef<SVGSVGElement>(null)
  const [round, setRound] = React.useState(0)
  const [isExpired, setExpired] = React.useState(false)
  const [refreshing, setRefreshing] = React.useState(false)
  const list = steps ?? copy.steps
  const subline = description ?? copy.description
  const link = emailLink === undefined ? copy.emailLink : emailLink
  useEntrance(stepsRef)

  // One timeout per code: a new round (a refresh) starts it again.
  React.useEffect(() => {
    setExpired(false)
    if (!expiresIn || approved) return
    const timer = window.setTimeout(() => setExpired(true), expiresIn * 1000)
    return () => window.clearTimeout(timer)
  }, [expiresIn, round, approved])

  const refresh = async () => {
    const icon = iconRef.current
    const spin =
      icon && typeof icon.animate === "function" && !reducedMotion()
        ? icon.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], { duration: 600, easing: "ease-in-out" })
        : null
    setRefreshing(true)
    try {
      await onRefresh?.()
    } finally {
      setRefreshing(false)
      spin?.finished.catch(() => {})
      setRound((value) => value + 1)
      // The new code crossfades in.
      const code = codeRef.current
      if (code && typeof code.animate === "function" && !reducedMotion()) {
        code.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: "cubic-bezier(0, 0, 0.2, 1)" })
      }
    }
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn("flex justify-center bg-background p-8 md:p-16 lg:p-24", className)}
      {...props}
    >
      <div className="flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-lg md:max-w-[640px] md:flex-row lg:max-w-[840px]">
        <div className="flex shrink-0 flex-col items-center justify-center gap-6 bg-muted p-8 md:w-[300px] lg:w-[392px]">
          <div className="relative flex size-[196px] items-center justify-center overflow-hidden rounded-lg border border-border bg-card">
            {approved ? (
              <CircleCheck size={56} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-14 text-success" />
            ) : (
              <>
                <div
                  ref={codeRef}
                  dir="ltr"
                  className={cn(
                    "flex size-full items-center justify-center transition-[filter,opacity] duration-200 motion-reduce:transition-none",
                    isExpired && "opacity-40 blur-[4px]"
                  )}
                >
                  {qr}
                </div>
                {isExpired ? (
                  <span className="absolute rounded-md bg-card px-2 py-1 text-xs font-medium text-foreground shadow-sm">
                    {expired ?? copy.expired}
                  </span>
                ) : null}
              </>
            )}
          </div>
          <div className="flex w-full flex-col gap-1.5 text-center">
            <p className="text-base font-semibold text-foreground">{approved ? (approvedLabel ?? copy.approvedLabel) : (scanLabel ?? copy.scanLabel)}</p>
            {approved ? null : <p className="text-xs text-muted-foreground">{scanHint ?? copy.scanHint}</p>}
          </div>
          {approved ? null : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              loading={refreshing}
              loadingLabel={refreshingLabel ?? copy.refreshingLabel}
              onClick={refresh}
            >
              <RotateCw ref={iconRef} size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
              {refreshLabel ?? copy.refreshLabel}
            </Button>
          )}
          <p role="status" className="sr-only">
            {approved ? (approvedLabel ?? copy.approvedLabel) : isExpired ? (expired ?? copy.expired) : null}
          </p>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-7 p-8">
          <div className="flex flex-col gap-2">
            {logo ? <div className="flex h-7 items-center [&>svg]:h-full [&>svg]:w-auto">{logo}</div> : null}
            <h1 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl">
              {heading ?? copy.heading}
            </h1>
            {subline ? <p className="text-sm text-muted-foreground">{subline}</p> : null}
          </div>

          {list.length > 0 ? (
            <ol ref={stepsRef} className="flex flex-col gap-4">
              {list.map((step, index) => (
                <li key={index} data-entrance="" className="flex items-start gap-3 text-sm text-foreground">
                  <span
                    aria-hidden="true"
                    className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-primary-foreground"
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0 pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          ) : null}

          {link ? (
            <>
              {/* Separator: swap for the Separator component once it ships. */}
              <div data-separator="" aria-hidden="true" className="h-px w-full shrink-0 bg-border" />
              <div className="flex flex-col gap-2.5">
                <p className="text-xs font-medium text-muted-foreground">{altText ?? copy.altText}</p>
                <a href={link.href} className={buttonVariants({ variant: "outline", className: "w-full" })}>
                  <Mail size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                  {link.label}
                </a>
              </div>
            </>
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
export const authQrDeviceLoginCopy = COPY
