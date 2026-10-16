"use client"

import * as React from "react"
import { Check, WifiOff } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Error State` (42556:548), Type=Offline State.
 *
 * The page a lost connection leaves behind: a tinted wifi-off badge, the
 * message, Try again and Work offline, and a muted panel listing what still
 * works without a connection. It has no status code.
 *
 * Try again is real: while `onRetry` runs, the button shows its spinner, and
 * if it rejects, a line under the actions says the connection is still down.
 * Without `onRetry` it reloads the page.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). Direction is the page's `dir`; every
 * side is a logical one.
 */

export interface ErrorStateOfflineStateAction {
  label: React.ReactNode
  href: string
}

export interface ErrorStateOfflineStateCopy {
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
  /** The outline link beside it, to what works offline. Hidden when null. */
  offlineAction: ErrorStateOfflineStateAction | null
  /** The panel's heading. */
  availableHeading: React.ReactNode
  /** The panel's list: what still works offline. The panel is hidden when the list is empty. */
  available: React.ReactNode[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateOfflineStateCopy> = {
  en: {
    heading: "You’re offline",
    description:
      "We can’t reach Fasla right now. Check your connection and try again — nothing you were working on has been lost.",
    retryLabel: "Try again",
    retryingLabel: "Reconnecting",
    retryError: "Still no connection. Check your network and try again.",
    offlineAction: { label: "Work offline", href: "#offline" },
    availableHeading: "STILL AVAILABLE OFFLINE",
    available: ["Drafts saved in the last 7 days", "Downloaded reports and exports", "Everything in your local workspace cache"],
  },
  ar: {
    heading: "أنت غير متصل",
    description: "لا يمكننا الوصول إلى فاصلة الآن. تحقق من اتصالك وحاول مجددًا. لم يُفقد شيء مما كنت تعمل عليه.",
    retryLabel: "حاول مجددًا",
    retryingLabel: "جارٍ إعادة الاتصال",
    retryError: "ما زلت غير متصل. تحقق من شبكتك وحاول مجددًا.",
    offlineAction: { label: "العمل دون اتصال", href: "#offline" },
    availableHeading: "لا يزال متاحًا دون اتصال",
    available: [
      <>
        المسودات المحفوظة خلال آخر <bdi dir="ltr">7</bdi> أيام
      </>,
      "التقارير والملفات المُنزّلة",
      "كل ما في ذاكرة مساحة عملك المحلية",
    ],
  },
}

export interface ErrorStateOfflineStateProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateOfflineStateCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The glyph in the badge. Pass `null` to drop the badge.
   * @default wifi-off
   */
  icon?: React.ReactNode
  /**
   * Runs when Try again is pressed. The button shows its spinner until the
   * promise settles; a rejection shows `retryError`.
   * @default reloads the page
   */
  onRetry?: () => Promise<void> | void
}

export function ErrorStateOfflineState({
  locale = "en",
  heading,
  description,
  retryLabel,
  retryingLabel,
  retryError,
  offlineAction,
  availableHeading,
  available,
  icon,
  onRetry,
  className,
  ...props
}: ErrorStateOfflineStateProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const panelId = React.useId()
  const [status, setStatus] = React.useState<"idle" | "pending" | "error">("idle")
  const link = offlineAction === undefined ? copy.offlineAction : offlineAction
  const list = available ?? copy.available
  const glyph = icon === undefined ? <WifiOff size={30} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-[30px]" /> : icon

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
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[520px] flex-col items-center gap-6 text-center md:max-w-none md:gap-7 lg:max-w-[520px]">
        {glyph ? (
          <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive md:size-[72px]">
            {glyph}
          </div>
        ) : null}
        <div className="flex w-full flex-col gap-2.5">
          <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
            {heading ?? copy.heading}
          </h1>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
        </div>
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
        {list.length > 0 ? (
          <section
            aria-labelledby={panelId}
            className="flex w-full flex-col gap-3 rounded-lg bg-muted p-4 text-start md:p-5"
          >
            <h2 id={panelId} className="text-xs font-medium text-muted-foreground">
              {availableHeading ?? copy.availableHeading}
            </h2>
            <ul className="flex flex-col gap-3">
              {list.map((item, index) => (
                <li key={index} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Check size={14} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" className="size-3.5 shrink-0 text-success" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStateOfflineStateCopy = COPY
