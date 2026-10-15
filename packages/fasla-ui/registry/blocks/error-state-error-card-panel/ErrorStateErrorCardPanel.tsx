"use client"

import * as React from "react"
import { Check, Copy, TriangleAlert } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip/tooltip"

/*
 * Figma: `Error State` (42556:548), Type=Error Card Panel.
 *
 * One card on a muted field: an alert glyph in a tinted disc, the heading
 * and a line of help, two buttons, and under a divider the error ID with a
 * button that copies it. The copy button swaps its glyph for a check and
 * shows "Copied" for a moment, as Figma's dev notes describe.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). Direction is the page's `dir`; every
 * side is a logical one. The ID stays Latin and left to right in Arabic.
 */

export interface ErrorStateErrorCardPanelAction {
  label: React.ReactNode
  href: string
}

export interface ErrorStateErrorCardPanelCopy {
  /** The card's heading, an `h1`. Name what happened. */
  heading: React.ReactNode
  /** The line under the heading: what to do next. */
  description: React.ReactNode
  /** The solid button: the way out, a link. */
  primaryAction: ErrorStateErrorCardPanelAction
  /** The outline button's label. It calls `onRetry`, or reloads the page. Hidden when empty. */
  retryLabel: React.ReactNode
  /** The label before the error ID. */
  errorIdLabel: React.ReactNode
  /** The copy button's accessible name. */
  copyLabel: string
  /** Shown, and announced, for a moment after the ID is copied. */
  copiedLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateErrorCardPanelCopy> = {
  en: {
    heading: "404 — page not found",
    description:
      "We could not load the page you requested. It may have been deleted, or you may not have permission to view it any more.",
    primaryAction: { label: "Back to dashboard", href: "/" },
    retryLabel: "Try again",
    errorIdLabel: "Error ID:",
    copyLabel: "Copy error ID",
    copiedLabel: "Copied",
  },
  ar: {
    heading: (
      <>
        خطأ <bdi dir="ltr">404</bdi>: الصفحة غير موجودة
      </>
    ),
    description: "تعذّر تحميل الصفحة التي طلبتها. ربما تم حذفها، أو لم تعد لديك صلاحية عرضها.",
    primaryAction: { label: "العودة إلى لوحة التحكم", href: "/" },
    retryLabel: "حاول مجددًا",
    errorIdLabel: "معرّف الخطأ:",
    copyLabel: "نسخ معرّف الخطأ",
    copiedLabel: "تم النسخ",
  },
}

export interface ErrorStateErrorCardPanelProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateErrorCardPanelCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The error's ID, shown under the divider and copied by its button. Hidden when empty.
   * @default "3a760e2a7b3349a887b1c5f6ee46192d"
   */
  errorId?: string
  /**
   * Called by the retry button. Return a promise to show the button busy until it settles.
   * @default reloads the page
   */
  onRetry?: () => void | Promise<unknown>
  /**
   * The glyph in the tinted disc. Pass `null` to drop it.
   * @default a triangle alert
   */
  icon?: React.ReactNode
}

/** How long "Copied" stays up, as Figma's dev notes say. */
const COPIED_FOR = 1500

export function ErrorStateErrorCardPanel({
  locale = "en",
  heading,
  description,
  primaryAction,
  retryLabel,
  errorIdLabel,
  copyLabel,
  copiedLabel,
  errorId = "3a760e2a7b3349a887b1c5f6ee46192d",
  onRetry,
  icon,
  className,
  ...props
}: ErrorStateErrorCardPanelProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const primary = primaryAction ?? copy.primaryAction
  const retry = retryLabel ?? copy.retryLabel
  const glyph = icon === undefined ? <TriangleAlert aria-hidden="true" className="size-6" strokeWidth={1.5} /> : icon

  const [retrying, setRetrying] = React.useState(false)
  const handleRetry = async () => {
    if (!onRetry) {
      window.location.reload()
      return
    }
    const result = onRetry()
    if (!result || typeof (result as Promise<unknown>).then !== "function") return
    setRetrying(true)
    try {
      await result
    } finally {
      setRetrying(false)
    }
  }

  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), COPIED_FOR)
    return () => window.clearTimeout(timer)
  }, [copied])
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(errorId)
      setCopied(true)
    } catch {
      // No clipboard (an insecure page, or permission refused): the ID stays
      // on screen to select by hand.
    }
  }

  return (
    <section aria-labelledby={headingId} className={cn("bg-muted p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-5 rounded-[14px] bg-card p-6 text-center shadow-lg ring-1 ring-inset ring-border md:gap-6 md:p-10">
        {glyph ? (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-destructive/[0.12] text-destructive">
            {glyph}
          </div>
        ) : null}
        <div className="flex w-full flex-col gap-2.5">
          <h1 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl">
            {heading ?? copy.heading}
          </h1>
          <p className="text-sm text-muted-foreground">{description ?? copy.description}</p>
        </div>
        <div className="flex w-full flex-col gap-2.5 md:w-auto md:flex-row md:gap-3">
          <a href={primary.href} className={buttonVariants()}>
            {primary.label}
          </a>
          {retry ? (
            <Button variant="outline" loading={retrying} onClick={handleRetry}>
              {retry}
            </Button>
          ) : null}
        </div>
        {errorId ? (
          <>
            <hr className="w-full border-border" />
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span>{errorIdLabel ?? copy.errorIdLabel}</span>
              <bdi dir="ltr" className="font-medium">
                {errorId}
              </bdi>
              <Tooltip open={copied}>
                <TooltipTrigger
                  type="button"
                  aria-label={copyLabel ?? copy.copyLabel}
                  onClick={handleCopy}
                  className="inline-flex size-3.5 items-center justify-center rounded-sm text-muted-foreground [outline:none] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {copied ? (
                    <Check aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
                  ) : (
                    <Copy aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
                  )}
                </TooltipTrigger>
                <TooltipContent>{copiedLabel ?? copy.copiedLabel}</TooltipContent>
              </Tooltip>
              <span role="status" className="sr-only">
                {copied ? (copiedLabel ?? copy.copiedLabel) : null}
              </span>
            </p>
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
export const errorStateErrorCardPanelCopy = COPY
