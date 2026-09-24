"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

/**
 * The hero's install command. A command you cannot copy is a picture of a
 * command, so this is a button, not a code block.
 *
 * Deliberately not a <code> element: the prose rule styles inline code as a
 * pill, which renders a second box inside this one.
 */
export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  const t = useTranslations("copyCommand")

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
    } catch {
      // Clipboard is blocked (insecure context, denied permission). The command
      // is still selectable, so say nothing rather than showing a false success.
    }
  }

  return (
    // A shell command is code: the prompt leads it in both directions, so the
    // button keeps its own LTR order inside an RTL page.
    <button
      type="button"
      dir="ltr"
      onClick={copy}
      aria-label={copied ? t("copied") : t("copy", { command })}
      className="group inline-flex items-center gap-3 rounded-lg border border-border bg-secondary px-4 py-3 text-start transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fasla-red focus-visible:ring-offset-2"
    >
      <span aria-hidden="true" className="select-none font-mono text-[15px] text-muted-foreground">
        $
      </span>
      <span className="font-mono text-[15px] text-foreground">{command}</span>
      <span aria-hidden="true" className="ms-1 text-muted-foreground transition-colors group-hover:text-foreground">
        {copied ? (
          <svg className="h-4 w-4 text-fasla-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1" />
          </svg>
        )}
      </span>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? t("status") : ""}
      </span>
    </button>
  )
}
