"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Button, buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Error State` (42556:548), Type=Server Error 500.
 *
 * A 500 page on a muted field: the apology, a retry and the status page on
 * one side, and a live status card on the other, one row per service with a
 * coloured dot. The card sits beside the copy on Desktop and under it on
 * Tablet and Mobile, where each row's state drops under its name.
 *
 * Retry is real: while `onRetry` runs, the button shows its spinner, and if
 * it rejects, a line under the actions says so. Without `onRetry` it reloads
 * the page.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). Direction is the page's `dir`; every
 * side is a logical one.
 */

type Tone = "success" | "warning" | "destructive" | "info"

export interface ErrorStateServerError500Service {
  /** The service's name. */
  label: React.ReactNode
  /** Its state, at the row's end: "Operational", "Partial outage". */
  state: React.ReactNode
  /** The dot's colour. */
  tone: Tone
}

export interface ErrorStateServerError500Status {
  label: React.ReactNode
  /** The pill's colour. */
  tone: Tone
}

export interface ErrorStateServerError500Action {
  label: React.ReactNode
  href: string
}

export interface ErrorStateServerError500Copy {
  /** The pill above the heading. Hidden when empty. */
  badge: React.ReactNode
  /** The page's heading, an `h1`. Name what happened. */
  heading: React.ReactNode
  /** The line under the heading: what to do next. */
  description: React.ReactNode
  /** The solid button that runs `onRetry`. */
  retryLabel: React.ReactNode
  /** Read out while `onRetry` runs. */
  retryingLabel: string
  /** Shown under the actions when `onRetry` rejects. */
  retryError: React.ReactNode
  /** The outline link beside it, to the status page. Hidden when null. */
  statusAction: ErrorStateServerError500Action | null
  /** The incident line under the actions, after a clock. Hidden when empty. */
  incident: React.ReactNode
  /** The status card's heading. */
  statusHeading: React.ReactNode
  /** The pill beside it: the overall state. Hidden when null. */
  overall: ErrorStateServerError500Status | null
  /** The card's rows, one per service. Each has a `label`, a `state` and a `tone`. The rows and the dividers are hidden when the list is empty. */
  services: ErrorStateServerError500Service[]
  /** The small print at the foot of the card. Hidden when empty. */
  note: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateServerError500Copy> = {
  en: {
    badge: "500 — server error",
    heading: "Something went wrong on our end",
    description:
      "This is not your fault. Our team has already been paged and is working on it. Retry in a moment, or follow along on the status page.",
    retryLabel: "Retry now",
    retryingLabel: "Retrying",
    retryError: "Still not working. Give it a minute and try again.",
    statusAction: { label: "Open status page", href: "#status" },
    incident: "Incident INC-2481 · opened 4 minutes ago",
    statusHeading: "System status",
    overall: { label: "Degraded", tone: "warning" },
    services: [
      { label: "Website", state: "Operational", tone: "success" },
      { label: "API", state: "Partial outage", tone: "destructive" },
      { label: "Dashboard", state: "Degraded performance", tone: "warning" },
      { label: "Webhooks", state: "Operational", tone: "success" },
    ],
    note: "Updated automatically every 30 seconds. Subscribe on the status page for incident emails.",
  },
  ar: {
    badge: (
      <>
        <bdi dir="ltr">500</bdi> - خطأ في الخادم
      </>
    ),
    heading: "حدث خطأ من جانبنا",
    description:
      "هذا ليس خطأك. تم تنبيه فريقنا بالفعل وهو يعمل على حلها. أعد المحاولة بعد قليل، أو تابع الحالة على صفحة الحالة.",
    retryLabel: "أعد المحاولة الآن",
    retryingLabel: "جارٍ إعادة المحاولة",
    retryError: "ما زال الخطأ قائمًا. انتظر دقيقة ثم أعد المحاولة.",
    statusAction: { label: "افتح صفحة الحالة", href: "#status" },
    incident: (
      <>
        فُتح البلاغ <bdi dir="ltr">INC-2481</bdi> قبل <bdi dir="ltr">4</bdi> دقائق
      </>
    ),
    statusHeading: "حالة النظام",
    overall: { label: "متدهور", tone: "warning" },
    services: [
      { label: "الموقع", state: "يعمل", tone: "success" },
      { label: <bdi dir="ltr">API</bdi>, state: "انقطاع جزئي", tone: "destructive" },
      { label: "لوحة التحكم", state: "أداء متدهور", tone: "warning" },
      { label: <bdi dir="ltr">Webhooks</bdi>, state: "يعمل", tone: "success" },
    ],
    note: (
      <>
        يتم التحديث تلقائيًا كل <bdi dir="ltr">30</bdi> ثانية. اشترك في صفحة الحالة لتصلك رسائل البلاغات.
      </>
    ),
  },
}

const DOT: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
}

export interface ErrorStateServerError500Props
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateServerError500Copy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * Runs when Retry is pressed. The button shows its spinner until the
   * promise settles; a rejection shows `retryError`.
   * @default reloads the page
   */
  onRetry?: () => Promise<void> | void
}

export function ErrorStateServerError500({
  locale = "en",
  badge,
  heading,
  description,
  retryLabel,
  retryingLabel,
  retryError,
  statusAction,
  incident,
  statusHeading,
  overall,
  services,
  note,
  onRetry,
  className,
  ...props
}: ErrorStateServerError500Props) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const cardId = React.useId()
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const pill = badge ?? copy.badge
  const link = statusAction === undefined ? copy.statusAction : statusAction
  const meta = incident ?? copy.incident
  const state = overall === undefined ? copy.overall : overall
  const rows = services ?? copy.services
  const small = note ?? copy.note

  const retry = async () => {
    if (!onRetry) {
      window.location.reload()
      return
    }
    setStatus("pending")
    try {
      await onRetry()
      setStatus("idle")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section aria-labelledby={headingId} className={cn("bg-muted p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="flex flex-col items-start gap-5 lg:w-[560px]">
          {pill ? (
            <Badge variant="soft" tone="destructive">
              {pill}
            </Badge>
          ) : null}
          <h1 id={headingId} className="text-3xl font-semibold text-foreground lg:text-4xl">
            {heading ?? copy.heading}
          </h1>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
          <div className="flex w-full flex-col gap-2.5 md:w-auto md:flex-row md:gap-3">
            <Button loading={status === "pending"} loadingLabel={retryingLabel ?? copy.retryingLabel} onClick={retry}>
              {retryLabel ?? copy.retryLabel}
            </Button>
            {link ? (
              <a href={link.href} className={buttonVariants({ variant: "outline" })}>
                {link.label}
              </a>
            ) : null}
          </div>
          <p role="status" className="text-sm text-destructive empty:hidden">
            {status === "error" ? (retryError ?? copy.retryError) : null}
          </p>
          {meta ? (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock strokeWidth={1.5} aria-hidden="true" className="size-3.5 shrink-0" />
              <span>{meta}</span>
            </p>
          ) : null}
        </div>

        <section
          aria-labelledby={cardId}
          className="flex w-full shrink-0 flex-col gap-2 rounded-[14px] bg-card p-5 shadow-md ring-1 ring-inset ring-border md:gap-5 md:p-7 lg:w-[460px]"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 id={cardId} className="text-base font-semibold text-foreground">
              {statusHeading ?? copy.statusHeading}
            </h2>
            {state ? (
              <Badge variant="soft" tone={state.tone}>
                {state.label}
              </Badge>
            ) : null}
          </div>
          {rows.length > 0 ? (
            <>
              <hr className="border-border" />
              <ul className="flex flex-col gap-4">
                {rows.map((row, index) => (
                  <li
                    key={index}
                    className="flex flex-col gap-0.5 text-sm md:flex-row md:items-center md:justify-between md:gap-3"
                  >
                    <span className="flex items-center gap-2.5 text-foreground">
                      <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", DOT[row.tone])} />
                      <span>{row.label}</span>
                    </span>
                    <span className="text-muted-foreground">{row.state}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {small ? (
            <>
              <hr className="border-border" />
              <p className="text-xs text-muted-foreground">{small}</p>
            </>
          ) : null}
        </section>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStateServerError500Copy = COPY
