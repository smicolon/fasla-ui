"use client"

import * as React from "react"
import { Timer } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"
import { Progress } from "../../ui/progress/progress"

/*
 * Figma: `Error State` (42556:548), Type=Countdown Redirect.
 *
 * A card on a muted field that sends the visitor home on its own: a bar
 * fills over the countdown while the line under it counts the seconds down.
 * Cancel (or Stay on this page) stops it where it is and greys the bar; Go
 * home now leaves at once. At zero the block calls `onRedirect`, or follows
 * the Go home now link when there is none.
 *
 * Under `prefers-reduced-motion` the countdown never starts: nothing moves
 * and nothing leaves the page on its own, and the visitor goes home with the
 * button. The block follows the setting live.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). Direction is the page's `dir`; every
 * side is a logical one, and the Progress atom fills from the inline start,
 * so the bar runs right to left in Arabic on its own.
 */

export interface ErrorStateCountdownRedirectAction {
  label: React.ReactNode
  href: string
}

export interface ErrorStateCountdownRedirectCopy {
  /** The card's heading, an `h1`. Name what happened. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The line under the bar while it counts, built from the seconds left. */
  countdown: (seconds: number) => React.ReactNode
  /** The line under the bar once the visitor cancels. */
  cancelled: React.ReactNode
  /** The line under the bar when reduced motion keeps the countdown from starting. */
  paused: React.ReactNode
  /** The line under the bar at zero, while the app takes over. */
  redirecting: React.ReactNode
  /** The small button beside the countdown that stops it. */
  cancelLabel: React.ReactNode
  /** The solid button: leave now. Its `href` is also where the countdown goes. */
  primaryAction: ErrorStateCountdownRedirectAction
  /** The ghost button beside it, which stops the countdown too. Hidden when empty. */
  stayLabel: React.ReactNode
}

/** Arabic counts its nouns: ثوانٍ for three to ten, ثانية otherwise. */
const arabicSeconds = (seconds: number) => (seconds >= 3 && seconds <= 10 ? "ثوانٍ" : "ثانية")

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateCountdownRedirectCopy> = {
  en: {
    heading: "404 — we couldn’t find that page",
    description: "We’ll take you back to the homepage automatically, so you don’t have to do anything.",
    countdown: (seconds) => `Redirecting in ${seconds} ${seconds === 1 ? "second" : "seconds"}`,
    cancelled: "Redirect cancelled",
    paused: "Automatic redirect is off",
    redirecting: "Redirecting…",
    cancelLabel: "Cancel",
    primaryAction: { label: "Go home now", href: "/" },
    stayLabel: "Stay on this page",
  },
  ar: {
    heading: (
      <>
        خطأ <bdi dir="ltr">404</bdi>: لم نتمكن من العثور على تلك الصفحة
      </>
    ),
    description: "سنعيدك إلى الصفحة الرئيسية تلقائيًا، فلا داعي لأن تفعل شيئًا.",
    countdown: (seconds) => (
      <>
        إعادة التوجيه خلال <bdi dir="ltr">{seconds}</bdi> {arabicSeconds(seconds)}
      </>
    ),
    cancelled: "أُلغيت إعادة التوجيه",
    paused: "إعادة التوجيه التلقائي متوقفة",
    redirecting: "جارٍ إعادة التوجيه…",
    cancelLabel: "إلغاء",
    primaryAction: { label: "اذهب إلى الرئيسية الآن", href: "/" },
    stayLabel: "ابقَ في هذه الصفحة",
  },
}

export interface ErrorStateCountdownRedirectProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateCountdownRedirectCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * How long the countdown runs, in seconds.
   * @default 10
   */
  seconds?: number
  /**
   * The glyph in the badge. Pass `null` to drop the badge.
   * @default a timer
   */
  icon?: React.ReactNode
  /** Called at zero, in place of following the Go home now link: route with your app's router here. */
  onRedirect?: () => void
  /** Called when the visitor cancels the countdown or chooses to stay. */
  onCancel?: () => void
}

type Phase = "counting" | "cancelled" | "paused" | "redirecting"

/** Whether the visitor asks for reduced motion, kept up to date. False on the server. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  return reduced
}

/** How often the bar moves on, in ms: small enough to read as a continuous fill. */
const TICK = 100

export function ErrorStateCountdownRedirect({
  locale = "en",
  heading,
  description,
  countdown,
  cancelled,
  paused,
  redirecting,
  cancelLabel,
  primaryAction,
  stayLabel,
  seconds = 10,
  icon,
  onRedirect,
  onCancel,
  className,
  ...props
}: ErrorStateCountdownRedirectProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const reduced = usePrefersReducedMotion()
  const total = Math.max(1, seconds) * 1000
  const [elapsed, setElapsed] = React.useState(0)
  const [stopped, setStopped] = React.useState(false)
  const primary = primaryAction ?? copy.primaryAction
  const stay = stayLabel ?? copy.stayLabel
  const glyph = icon === undefined ? <Timer aria-hidden="true" className="size-6" strokeWidth={1.5} /> : icon

  const phase: Phase =
    elapsed >= total ? "redirecting" : stopped ? "cancelled" : reduced ? "paused" : "counting"

  // Restart when the length changes.
  React.useEffect(() => setElapsed(0), [total])

  // The count runs only while it is counting: a cancel, reduced motion or zero stops it.
  React.useEffect(() => {
    if (phase !== "counting") return
    const startedAt = Date.now() - elapsed
    const timer = window.setInterval(() => setElapsed(Math.min(total, Date.now() - startedAt)), TICK)
    return () => window.clearInterval(timer)
    // `elapsed` is read once, to resume from where the count stood.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, total])

  // Keep the latest callbacks without restarting the count when they change.
  const redirect = React.useRef<() => void>()
  redirect.current = () => {
    if (onRedirect) onRedirect()
    else window.location.assign(primary.href)
  }
  // At zero, unless the visitor already left with the link.
  const leftByLink = React.useRef(false)
  React.useEffect(() => {
    if (phase === "redirecting" && !leftByLink.current) redirect.current?.()
  }, [phase])

  // Go home now: the bar completes at once. With `onRedirect` the app routes;
  // without it, the link navigates as a link does.
  const goNow = (event: React.MouseEvent<HTMLAnchorElement>) => {
    leftByLink.current = true
    setStopped(false)
    setElapsed(total)
    if (onRedirect) {
      event.preventDefault()
      onRedirect()
    }
  }

  const cancel = () => {
    if (phase !== "counting") return
    setStopped(true)
    onCancel?.()
  }

  const left = Math.ceil((total - elapsed) / 1000)
  const value = phase === "paused" ? 0 : (elapsed / total) * 100
  const line =
    phase === "cancelled"
      ? cancelled ?? copy.cancelled
      : phase === "paused"
        ? paused ?? copy.paused
        : phase === "redirecting"
          ? redirecting ?? copy.redirecting
          : (countdown ?? copy.countdown)(left)
  // Screen readers hear the state when it changes, not every second.
  const announcement =
    phase === "counting" ? (countdown ?? copy.countdown)(Math.ceil(total / 1000)) : line

  return (
    <section aria-labelledby={headingId} className={cn("bg-muted p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[520px] flex-col items-center gap-5 rounded-[14px] bg-card p-6 text-center shadow-lg ring-1 ring-inset ring-border md:gap-6 md:p-10">
        {glyph ? (
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground md:size-14">
            {glyph}
          </div>
        ) : null}
        <div className="flex w-full flex-col gap-2.5">
          <h1 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl">
            {heading ?? copy.heading}
          </h1>
          <p className="text-sm text-muted-foreground">{description ?? copy.description}</p>
        </div>
        <div className="flex w-full flex-col gap-2.5">
          <Progress
            aria-hidden="true"
            value={value}
            size="sm"
            showPercentage={false}
            className={cn(phase === "cancelled" && "[&_[data-slot=indicator]]:bg-muted-foreground")}
          />
          <div className="flex items-center gap-3">
            <p aria-hidden="true" className="flex-1 text-start text-xs text-muted-foreground">
              {line}
            </p>
            <p role="status" className="sr-only">
              {announcement}
            </p>
            {phase === "counting" ? (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={cancel}
                className="h-auto px-0 hover:bg-transparent hover:underline"
              >
                {cancelLabel ?? copy.cancelLabel}
              </Button>
            ) : null}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2.5 md:w-auto md:flex-row md:gap-3">
          <a href={primary.href} onClick={goNow} className={buttonVariants()}>
            {primary.label}
          </a>
          {stay ? (
            <Button type="button" variant="ghost" onClick={cancel}>
              {stay}
            </Button>
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
export const errorStateCountdownRedirectCopy = COPY
