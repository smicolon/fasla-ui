"use client"

import * as React from "react"
import { TriangleAlert } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Error State` (42556:548), Type=Terminal Console.
 *
 * A terminal window replays the failed request: the command, the response
 * headers and, last, the 404 in destructive with a warning glyph. Under it,
 * the heading, a line of help and two buttons, one of which copies the
 * request ID. The window is painted with the inverse tokens, so it is dark
 * in light mode and light in dark mode.
 *
 * The window is a log: its content is English and left to right in both
 * directions (`dir="ltr" lang="en"`), so its traffic lights and title bar
 * never mirror. Only the copy and buttons around it follow the page's `dir`.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). Every side is a logical one.
 */

export interface ErrorStateTerminalConsoleAction {
  label: React.ReactNode
  href: string
}

/** What the terminal window shows. Always English and left to right. */
export interface ErrorStateTerminalConsoleLog {
  /** The window's title, in its title bar. */
  title: string
  /** The command after the `$` prompt. */
  command: string
  /** The response lines, in order. */
  output: string[]
  /** The last line, in destructive with a warning glyph. Hidden when empty. */
  error: string
}

export interface ErrorStateTerminalConsoleCopy {
  /** The heading under the window, an `h1`. Name what happened. */
  heading: React.ReactNode
  /** The line under the heading: what to do next. */
  description: React.ReactNode
  /** The solid button: the way out, a link. */
  primaryAction: ErrorStateTerminalConsoleAction
  /** The outline button's label. It copies `requestId`. Hidden when empty. */
  copyLabel: React.ReactNode
  /** Replaces the copy button's label, and is announced, for a moment after copying. */
  copiedLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateTerminalConsoleCopy> = {
  en: {
    heading: "404 — that route doesn’t resolve",
    description: "Copy the request ID above if you need to raise it with support — it tells us exactly what happened.",
    primaryAction: { label: "Back to docs", href: "/docs" },
    copyLabel: "Copy request ID",
    copiedLabel: "Copied",
  },
  ar: {
    heading: (
      <>
        خطأ <bdi dir="ltr">404</bdi>: هذا المسار غير صالح
      </>
    ),
    description: "انسخ معرّف الطلب أعلاه إذا احتجت إلى مراجعة الدعم. فهو يخبرنا بالضبط بما حدث.",
    primaryAction: { label: "العودة إلى التوثيق", href: "/docs" },
    copyLabel: "انسخ معرّف الطلب",
    copiedLabel: "تم النسخ",
  },
}

/** Figma's log, around the request ID it reports. */
const logFor = (requestId: string): ErrorStateTerminalConsoleLog => ({
  title: "fasla — request log",
  command: "curl -I https://fasla.com/journal/old-post",
  output: ["HTTP/2 404", `x-fasla-request-id: ${requestId}`, "date: Fri, 04 Sep 2026 09:12:44 GMT"],
  error: "page not found — the resource has no current location",
})

export interface ErrorStateTerminalConsoleProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateTerminalConsoleCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction; the window stays English. */
  locale?: "en" | "ar"
  /**
   * The ID the copy button copies, and the default log reports.
   * @default "3a760e2a7b3349a887b1c5f6ee46192d"
   */
  requestId?: string
  /**
   * What the terminal window shows. English in both languages.
   * @default Figma's log, reporting `requestId`
   */
  log?: ErrorStateTerminalConsoleLog
}

/** How long "Copied" stays up, as Figma's dev notes say. */
const COPIED_FOR = 1500

export function ErrorStateTerminalConsole({
  locale = "en",
  heading,
  description,
  primaryAction,
  copyLabel,
  copiedLabel,
  requestId = "3a760e2a7b3349a887b1c5f6ee46192d",
  log,
  className,
  ...props
}: ErrorStateTerminalConsoleProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const primary = primaryAction ?? copy.primaryAction
  const copyButton = copyLabel ?? copy.copyLabel
  const copiedText = copiedLabel ?? copy.copiedLabel
  const terminal = log ?? logFor(requestId)

  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), COPIED_FOR)
    return () => window.clearTimeout(timer)
  }, [copied])
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(requestId)
      setCopied(true)
    } catch {
      // No clipboard (an insecure page, or permission refused): the ID stays
      // in the log to select by hand.
    }
  }

  return (
    <section aria-labelledby={headingId} className={cn("bg-muted p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[760px] flex-col items-center gap-6 text-center md:gap-7">
        <div
          dir="ltr"
          lang="en"
          className="w-full overflow-hidden rounded-[14px] bg-background-inverse text-start shadow-lg"
        >
          <div className="flex h-11 items-center gap-3 border-b border-muted-foreground-inverse px-5">
            <span aria-hidden="true" className="flex shrink-0 gap-1.5">
              <span className="size-2.5 rounded-full bg-destructive" />
              <span className="size-2.5 rounded-full bg-warning" />
              <span className="size-2.5 rounded-full bg-success" />
            </span>
            <p className="min-w-0 flex-1 truncate text-center text-xs text-muted-foreground-inverse">{terminal.title}</p>
          </div>
          <div className="flex flex-col gap-1.5 p-4 text-sm [overflow-wrap:anywhere] md:gap-2 md:p-6">
            <p className="flex gap-2 text-foreground-inverse">
              <span aria-hidden="true" className="shrink-0 text-success">
                $
              </span>
              <span className="min-w-0">{terminal.command}</span>
            </p>
            {terminal.output.map((line, index) => (
              <p key={index} className="text-muted-foreground-inverse">
                {line}
              </p>
            ))}
            {terminal.error ? (
              <p className="flex gap-2 text-destructive">
                <span className="flex h-[1lh] shrink-0 items-center">
                  <TriangleAlert aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
                </span>
                <span className="min-w-0">{terminal.error}</span>
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex w-full flex-col gap-2.5">
          <h1 id={headingId} className="text-xl font-semibold text-foreground md:text-2xl">
            {heading ?? copy.heading}
          </h1>
          <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
        </div>

        <div className="flex w-full flex-col gap-2.5 md:w-auto md:flex-row md:gap-3">
          <a href={primary.href} className={buttonVariants()}>
            {primary.label}
          </a>
          {copyButton ? (
            <Button variant="outline" onClick={handleCopy}>
              {copied ? copiedText : copyButton}
            </Button>
          ) : null}
        </div>
        <span role="status" className="sr-only">
          {copied ? copiedText : null}
        </span>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStateTerminalConsoleCopy = COPY
