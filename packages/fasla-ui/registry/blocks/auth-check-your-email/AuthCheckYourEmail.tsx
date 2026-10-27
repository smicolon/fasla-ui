"use client"

import * as React from "react"
import { ArrowLeft, Inbox, RefreshCw } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"
import { SocialIcon } from "../../ui/social-icons/social-icons"

/*
 * Figma: `Authentications` (42586:4669), Type=Check Your Email.
 *
 * The screen after a magic link is sent: a drawing of the letter with a
 * tick, the address it went to, shortcuts to Gmail and Outlook, a resend
 * button that counts down before it can be pressed again, and a way back to
 * sign in under a rule.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The column keeps 432px from Tablet up;
 * on a phone it fills the width and the two mail buttons stack. Direction is
 * the page's `dir`; every side is a logical one. The drawing is never
 * mirrored, and the countdown keeps Western digits in both languages.
 */

export interface AuthCheckYourEmailLink {
  label: React.ReactNode
  href: string
}

export interface AuthCheckYourEmailCopy {
  /** The page's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading. `{email}` is replaced by `email`. */
  description: string
  /** The button that opens Gmail. Hidden when null. */
  gmailLink: AuthCheckYourEmailLink | null
  /** The button that opens Outlook. Hidden when null. */
  outlookLink: AuthCheckYourEmailLink | null
  /** The resend button, once it can be pressed. */
  resendLabel: string
  /** The resend button while it counts down. `{time}` is replaced by the time left, as 0:42. */
  resendCountdown: string
  /** Read out while `onResend` runs. */
  pendingLabel: string
  /** Shown for a moment after `onResend` settles. */
  resentMessage: React.ReactNode
  /** Shown when `onResend` rejects. */
  error: React.ReactNode
  /** The help line under the rule. Hidden when empty. */
  help: React.ReactNode
  /** The link back to sign in. Hidden when null. */
  backLink: AuthCheckYourEmailLink | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", AuthCheckYourEmailCopy> = {
  en: {
    heading: "Check your inbox",
    description: "We sent a sign-in link to {email}. Open it on this device to continue.",
    gmailLink: { label: "Open Gmail", href: "https://mail.google.com" },
    outlookLink: { label: "Open Outlook", href: "https://outlook.live.com" },
    resendLabel: "Resend email",
    resendCountdown: "Resend email in {time}",
    pendingLabel: "Sending the email again",
    resentMessage: "We sent the email again.",
    error: "We couldn’t send the email. Try again in a moment.",
    help: "Did not get it? Check your spam folder, or try a different address.",
    backLink: { label: "Back to sign in", href: "#sign-in" },
  },
  ar: {
    heading: "تفقّد بريدك الوارد",
    description: "أرسلنا رابط الدخول إلى {email}. افتحه على هذا الجهاز للمتابعة.",
    gmailLink: {
      label: (
        <>
          فتح <bdi dir="ltr">Gmail</bdi>
        </>
      ),
      href: "https://mail.google.com",
    },
    outlookLink: {
      label: (
        <>
          فتح <bdi dir="ltr">Outlook</bdi>
        </>
      ),
      href: "https://outlook.live.com",
    },
    resendLabel: "إعادة إرسال البريد",
    resendCountdown: "إعادة الإرسال خلال {time}",
    pendingLabel: "جارٍ إعادة إرسال البريد",
    resentMessage: "أعدنا إرسال البريد.",
    error: "تعذّر إرسال البريد. حاول مجددًا بعد قليل.",
    help: "لم يصلك؟ تفقّد مجلد الرسائل غير المرغوب فيها، أو جرّب عنوانًا آخر.",
    backLink: { label: "العودة إلى تسجيل الدخول", href: "#sign-in" },
  },
}

export interface AuthCheckYourEmailProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<AuthCheckYourEmailCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The address the link went to, shown in `description`.
   * @default "alex@northwind.co"
   */
  email?: string
  /**
   * Seconds before the resend button can be pressed, counted again after each resend.
   * @default 60
   */
  resendDelay?: number
  /**
   * Runs when the resend button is pressed. While its promise is pending the
   * button shows its spinner; then the countdown starts again.
   */
  onResend?: () => Promise<void> | void
}

/** Seconds as m:ss, in Western digits. */
const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`

/** Splits a copy string on `{name}` and puts `value` in its place. */
function fill(template: string, name: string, value: React.ReactNode) {
  const [before, after] = template.split(`{${name}}`)
  return after === undefined ? template : (
    <>
      {before}
      {value}
      {after}
    </>
  )
}

/** Counts `seconds` down to 0, once a second. `restart` starts it again. */
function useCountdown(seconds: number) {
  const [left, setLeft] = React.useState(seconds)
  const [round, setRound] = React.useState(0)
  React.useEffect(() => {
    setLeft(seconds)
    if (seconds <= 0) return
    const timer = window.setInterval(() => {
      setLeft((current) => {
        if (current <= 1) window.clearInterval(timer)
        return Math.max(0, current - 1)
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [seconds, round])
  return [left, () => setRound((count) => count + 1)] as const
}

/** Whether the visitor asks for reduced motion. False on the server. */
const reducedMotion = () => typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches

const LINK =
  "rounded-sm underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

export function AuthCheckYourEmail({
  locale = "en",
  heading,
  description,
  gmailLink,
  outlookLink,
  resendLabel,
  resendCountdown,
  pendingLabel,
  resentMessage,
  error,
  help,
  backLink,
  email = "alex@northwind.co",
  resendDelay = 60,
  onResend,
  className,
  ...props
}: AuthCheckYourEmailProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const artRef = React.useRef<HTMLDivElement>(null)
  const copyRef = React.useRef<HTMLDivElement>(null)
  const refreshRef = React.useRef<SVGSVGElement>(null)
  const [left, restart] = useCountdown(resendDelay)
  const [status, setStatus] = React.useState<"idle" | "pending" | "resent" | "error">("idle")
  const gmail = gmailLink === undefined ? copy.gmailLink : gmailLink
  const outlook = outlookLink === undefined ? copy.outlookLink : outlookLink
  const back = backLink === undefined ? copy.backLink : backLink
  const helpText = help ?? copy.help
  const waiting = left > 0

  // Figma's entrance: the letter opens once (the drawing rises out of a
  // fade over 500ms), and the copy fades in under it.
  React.useLayoutEffect(() => {
    const art = artRef.current
    const text = copyRef.current
    if (!art || !text || typeof art.animate !== "function" || reducedMotion()) return
    const easing = "cubic-bezier(0, 0, 0.2, 1)"
    const animations = [
      art.animate([{ opacity: 0, transform: "translateY(12px) scale(0.96)" }, { opacity: 1, transform: "none" }], { duration: 500, easing, fill: "backwards" }),
      text.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, delay: 250, easing, fill: "backwards" }),
    ]
    return () => animations.forEach((animation) => animation.cancel())
  }, [])

  // When the countdown ends the refresh icon turns once.
  React.useEffect(() => {
    const icon = refreshRef.current
    if (waiting || !icon || typeof icon.animate !== "function" || reducedMotion()) return
    icon.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], { duration: 500, easing: "ease-out" })
  }, [waiting])

  // "Sent again" shows for a moment, then the line clears.
  React.useEffect(() => {
    if (status !== "resent") return
    const timer = window.setTimeout(() => setStatus("idle"), 4000)
    return () => window.clearTimeout(timer)
  }, [status])

  const resend = async () => {
    setStatus("pending")
    try {
      await onResend?.()
      setStatus("resent")
      restart()
    } catch {
      setStatus("error")
    }
  }

  const address = (
    <bdi dir="ltr">{email}</bdi>
  )

  return (
    <section aria-labelledby={headingId} className={cn("flex justify-center bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="flex w-full flex-col items-center gap-8 md:max-w-[432px]">
        <div ref={artRef} className="flex h-40 w-56 items-center justify-center md:h-[200px] md:w-[280px]">
          <MailSent className="h-full w-auto" />
        </div>

        <div ref={copyRef} className="flex w-full flex-col items-center gap-8">
          <div className="flex w-full flex-col items-center gap-2 text-center">
            <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
              {heading ?? copy.heading}
            </h1>
            <p className="text-sm text-muted-foreground">{fill(description ?? copy.description, "email", address)}</p>
          </div>

          <div className="flex w-full flex-col gap-2.5">
            {gmail || outlook ? (
              <div className="flex w-full flex-col gap-2.5 md:flex-row">
                {gmail ? (
                  <a href={gmail.href} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full min-w-0 md:flex-1" })}>
                    <SocialIcon platform="google" className="size-4" />
                    {gmail.label}
                  </a>
                ) : null}
                {outlook ? (
                  <a href={outlook.href} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full min-w-0 md:flex-1" })}>
                    <Inbox size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                    {outlook.label}
                  </a>
                ) : null}
              </div>
            ) : null}
            <Button
              type="button"
              variant="outline"
              disabled={waiting}
              loading={status === "pending"}
              loadingLabel={pendingLabel ?? copy.pendingLabel}
              onClick={resend}
              className="w-full"
            >
              {status === "pending" ? null : (
                <RefreshCw ref={refreshRef} size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
              )}
              <span className="tabular-nums">
                {waiting
                  ? fill(resendCountdown ?? copy.resendCountdown, "time", <bdi dir="ltr">{clock(left)}</bdi>)
                  : (resendLabel ?? copy.resendLabel)}
              </span>
            </Button>
            {/* Announced when the button can be pressed again, not every second. */}
            <p role="status" className="sr-only">
              {waiting ? null : (resendLabel ?? copy.resendLabel)}
            </p>
            <p role="status" className="text-center text-sm text-muted-foreground empty:hidden">
              {status === "resent" ? (resentMessage ?? copy.resentMessage) : null}
            </p>
            <p role="alert" className="text-center text-sm text-destructive empty:hidden">
              {status === "error" ? (error ?? copy.error) : null}
            </p>
          </div>

          {helpText || back ? (
            <>
              {/* Separator: swap for the Separator component once it ships. */}
              <div data-separator="" aria-hidden="true" className="h-px w-full shrink-0 bg-border" />
              <div className="flex w-full flex-col items-center gap-2 text-center">
                {helpText ? <p className="text-xs text-muted-foreground">{helpText}</p> : null}
                {back ? (
                  <a href={back.href} className={cn("inline-flex items-center gap-1.5 text-sm font-medium text-foreground", LINK)}>
                    <ArrowLeft size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="shrink-0 rtl:-scale-x-100" />
                    {back.label}
                  </a>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/**
 * Figma's "Mail Sent" drawing: an open envelope with a ticked letter. Figma
 * clips the envelope's bottom edge at its frame; here the whole drawing shows.
 * Decorative.
 */
function MailSent({ className }: { className?: string }) {
  return (
    <svg viewBox="0 -2.143 228 204.286" fill="none" aria-hidden="true" className={className}>
      <path
        className="fill-foreground"
        d="M225.575 75.9803C225.494 75.9804 225.414 75.9554 225.347 75.9088L114.931 -0.98843C114.595 -1.22132 114.196 -1.34579 113.787 -1.34511C113.378 -1.34442 112.98 -1.21862 112.644 -0.9846L3.02416 75.9075C2.98124 75.9377 2.93279 75.9591 2.88158 75.9706C2.83038 75.982 2.77742 75.9833 2.72573 75.9743C2.67403 75.9653 2.62462 75.9462 2.58031 75.9181C2.536 75.89 2.49767 75.8534 2.46749 75.8105C2.43731 75.7676 2.41588 75.7191 2.40442 75.6679C2.39296 75.6167 2.3917 75.5637 2.40071 75.512C2.40972 75.4604 2.42882 75.4109 2.45693 75.3666C2.48503 75.3223 2.52159 75.284 2.56452 75.2538L112.186 -1.63831C112.655 -1.96596 113.214 -2.1421 113.786 -2.14306C114.359 -2.14402 114.917 -1.96975 115.388 -1.64368L225.804 75.2528C225.874 75.3014 225.927 75.371 225.954 75.4515C225.981 75.532 225.982 75.6191 225.957 75.7002C225.931 75.7813 225.881 75.8521 225.812 75.9024C225.744 75.9527 225.661 75.9798 225.576 75.9798L225.575 75.9803Z"
      />
      <path className="fill-border" d="M9.28809 78.7057L113.896 1.17822L219.245 78.7047L115.377 143.159L9.28809 78.7057Z" />
      <path
        className="fill-border"
        d="M69.5707 180.13H17.8923C17.5752 180.13 17.2613 180.068 16.9684 179.946C16.6754 179.825 16.4093 179.647 16.1851 179.423C15.9609 179.199 15.783 178.933 15.6617 178.64C15.5404 178.347 15.4779 178.033 15.4779 177.716C15.4779 177.399 15.5404 177.085 15.6617 176.792C15.783 176.499 15.9609 176.233 16.1851 176.008C16.4093 175.784 16.6754 175.606 16.9684 175.485C17.2613 175.364 17.5752 175.301 17.8923 175.301H69.5707C69.8878 175.301 70.2017 175.364 70.4947 175.485C70.7876 175.606 71.0538 175.784 71.278 176.008C71.5022 176.233 71.68 176.499 71.8013 176.792C71.9227 177.085 71.9851 177.399 71.9851 177.716C71.9851 178.033 71.9227 178.347 71.8013 178.64C71.68 178.933 71.5022 179.199 71.278 179.423C71.0538 179.647 70.7876 179.825 70.4947 179.946C70.2017 180.068 69.8878 180.13 69.5707 180.13Z"
      />
      <path
        className="fill-success"
        d="M36.4335 169.75H17.8923C17.252 169.75 16.6379 169.495 16.1851 169.043C15.7323 168.59 15.4779 167.976 15.4779 167.335C15.4779 166.695 15.7323 166.081 16.1851 165.628C16.6379 165.175 17.252 164.921 17.8923 164.921H36.4335C37.0739 164.921 37.688 165.175 38.1408 165.628C38.5936 166.081 38.8479 166.695 38.8479 167.335C38.8479 167.976 38.5936 168.59 38.1408 169.043C37.688 169.495 37.0739 169.75 36.4335 169.75Z"
      />
      <path
        className="fill-background"
        d="M115.367 121.887C114.974 121.888 114.585 121.811 114.221 121.663L49.7065 94.8936V11.1018C49.7074 10.3608 50.0021 9.65053 50.526 9.12663C51.0499 8.60272 51.7602 8.30801 52.5011 8.30713H176.268C177.009 8.30801 177.72 8.60272 178.243 9.12663C178.767 9.65053 179.062 10.3608 179.063 11.1018V94.9521L178.942 95.0032L116.547 121.65C116.174 121.807 115.772 121.888 115.367 121.888V121.887Z"
      />
      <path
        className="fill-foreground"
        d="M115.367 122.086C114.948 122.087 114.533 122.006 114.145 121.847L49.5068 95.0267V11.1013C49.5077 10.3074 49.8235 9.54627 50.3848 8.98492C50.9462 8.42357 51.7073 8.10781 52.5012 8.10693H176.268C177.062 8.10788 177.823 8.42365 178.385 8.98499C178.946 9.54633 179.262 10.3074 179.263 11.1013V95.0836L116.626 121.834C116.227 122.001 115.799 122.087 115.367 122.086ZM50.3053 94.4932L114.451 121.109C115.049 121.352 115.72 121.348 116.315 121.098L178.464 94.5566V11.1013C178.464 10.519 178.232 9.96084 177.82 9.54914C177.409 9.13744 176.85 8.90585 176.268 8.90518H52.5012C51.9189 8.90579 51.3607 9.13735 50.949 9.54906C50.5373 9.96078 50.3057 10.519 50.3051 11.1013L50.3053 94.4932Z"
      />
      <path
        className="fill-foreground"
        d="M224.777 75.1809H224.697L178.863 94.7523L116.154 121.53C115.908 121.633 115.646 121.687 115.38 121.688C115.114 121.689 114.85 121.638 114.604 121.538L49.9062 94.6963L2.94605 75.2126L2.8743 75.1807H2.79437C2.05342 75.1816 1.34309 75.4764 0.819227 76.0004C0.295363 76.5244 0.00074326 77.2349 0 77.9758V199.347C0.000878539 200.088 0.295595 200.798 0.819499 201.322C1.3434 201.846 2.05372 202.141 2.79463 202.142H224.777C225.517 202.141 226.228 201.846 226.752 201.322C227.276 200.798 227.57 200.088 227.571 199.347V77.9758C227.57 77.2349 227.276 76.5246 226.752 76.0007C226.228 75.4767 225.518 75.1819 224.777 75.1809ZM226.773 199.347C226.773 199.877 226.563 200.384 226.188 200.759C225.814 201.133 225.306 201.343 224.777 201.343H2.79514C2.26578 201.343 1.75814 201.133 1.3838 200.759C1.00945 200.384 0.799025 199.877 0.798755 199.347V77.9761C0.799526 77.4598 0.999807 76.9639 1.35772 76.5919C1.71564 76.2199 2.20348 76.0006 2.71929 75.9799L49.9065 95.5592L114.298 122.276C114.995 122.56 115.776 122.556 116.47 122.264L178.864 95.6187L224.858 75.9797C225.372 76.0022 225.859 76.2222 226.215 76.594C226.572 76.9657 226.772 77.4606 226.773 77.9758L226.773 199.347Z"
      />
      <path
        className="fill-success"
        d="M108.316 95.899C106.102 95.9032 103.946 95.1873 102.175 93.8592L102.065 93.7767L78.9385 76.071C76.7755 74.4137 75.3594 71.965 75.0017 69.2636C74.6441 66.5621 75.3743 63.8293 77.0316 61.6662C78.689 59.5032 81.1377 58.0871 83.8391 57.7294C86.5405 57.3718 89.2734 58.102 91.4365 59.7593L106.416 71.2448L141.815 25.079C142.636 24.0082 143.66 23.1096 144.828 22.4345C145.997 21.7595 147.287 21.3211 148.624 21.1445C149.962 20.9679 151.321 21.0566 152.625 21.4054C153.928 21.7542 155.15 22.3563 156.221 23.1774L156.001 23.4762L156.226 23.1817C158.386 24.8417 159.8 27.2906 160.156 29.9912C160.513 32.6919 159.783 35.4236 158.128 37.5872L116.49 91.8891C115.527 93.1405 114.289 94.1531 112.871 94.8485C111.454 95.5439 109.895 95.9034 108.316 95.899Z"
      />
      <path
        className="fill-border"
        d="M69.5707 190.511H17.8923C17.5752 190.511 17.2613 190.448 16.9684 190.327C16.6754 190.206 16.4093 190.028 16.1851 189.804C15.9609 189.58 15.783 189.313 15.6617 189.02C15.5404 188.728 15.4779 188.414 15.4779 188.097C15.4779 187.779 15.5404 187.466 15.6617 187.173C15.783 186.88 15.9609 186.613 16.1851 186.389C16.4093 186.165 16.6754 185.987 16.9684 185.866C17.2613 185.745 17.5752 185.682 17.8923 185.682H69.5707C69.8878 185.682 70.2017 185.745 70.4947 185.866C70.7876 185.987 71.0538 186.165 71.278 186.389C71.5022 186.613 71.68 186.88 71.8013 187.173C71.9227 187.466 71.9851 187.779 71.9851 188.097C71.9851 188.414 71.9227 188.728 71.8013 189.02C71.68 189.313 71.5022 189.58 71.278 189.804C71.0538 190.028 70.7876 190.206 70.4947 190.327C70.2017 190.448 69.8878 190.511 69.5707 190.511Z"
      />
    </svg>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const authCheckYourEmailCopy = COPY
