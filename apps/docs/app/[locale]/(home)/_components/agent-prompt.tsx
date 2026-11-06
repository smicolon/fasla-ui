"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@fasla-ui/ui/button/button"
import { agentPrompt } from "./agent-prompt-text"
import { copyWithStatus, type CopyStatus } from "./copy-text"

const copyIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
  </svg>
)
const checkIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-fasla-red">
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

/**
 * Under the install command: a button that copies a ready-made prompt for an
 * AI coding agent, and the prompt itself in a read-only block, closed until
 * asked for, so a visitor can read what they copy.
 *
 * The page's text is the locale's; the prompt is English in both, so the block
 * is `dir="ltr"` inside an RTL page. The button holds all three of its labels
 * in one grid cell so it keeps one width; a failed copy swaps the helper line
 * for the instruction, so nothing moves.
 */
export function AgentPrompt() {
  const t = useTranslations("landing.final.agent")
  const [status, setStatus] = useState<CopyStatus>("idle")
  const [open, setOpen] = useState(false)
  const timer = useRef<unknown>(undefined)
  const block = useRef<HTMLPreElement>(null)
  const blockId = useId()

  useEffect(() => () => window.clearTimeout(timer.current as number), [])

  // A refused clipboard leaves the reader the text: show it, selected.
  useEffect(() => {
    if (status !== "failed") return
    setOpen(true)
    const node = block.current
    const selection = window.getSelection()
    if (!node || !selection) return
    const range = document.createRange()
    range.selectNodeContents(node)
    selection.removeAllRanges()
    selection.addRange(range)
  }, [status])

  async function copy() {
    timer.current = await copyWithStatus(agentPrompt, { setStatus, previous: timer.current })
  }

  const copied = status === "copied"
  // Every label sits in the same cell, so the widest sets the width; only the current one is seen or read.
  const labels = [
    { key: "idle" as const, text: t("copy") },
    { key: "copied" as const, text: t("copied") },
  ]
  const shown = copied ? "copied" : "idle"

  return (
    <div className="mt-[clamp(32px,5vw,56px)] border-t border-border pt-[clamp(28px,4vw,44px)]">
      <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.01em] rtl:leading-[1.6]">{t("heading")}</h3>
      <p
        role="status"
        className={`mt-2 max-w-[60ch] text-[17px] rtl:leading-[1.8] ${status === "failed" ? "text-destructive" : "text-[color:var(--l-fg-2)]"}`}
      >
        {status === "failed" ? t("failed") : t("helper")}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={copy}
          className="h-12 min-h-11 rounded-[10px] bg-transparent px-[22px] text-[15px] max-[560px]:w-full"
        >
          {copied ? checkIcon : copyIcon}
          <span className="grid">
            {labels.map(({ key, text }) => (
              <span key={key} aria-hidden={key === shown ? undefined : true} className={`col-start-1 row-start-1 ${key === shown ? "" : "invisible"}`}>
                {text}
              </span>
            ))}
          </span>
        </Button>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={blockId}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex min-h-11 items-center rounded-[10px] px-2 text-[15px] font-medium underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted max-[560px]:w-full max-[560px]:justify-center"
        >
          {open ? t("hide") : t("show")}
        </button>
        {/* Stays mounted, so a change is announced; the visible failure text is the helper line above. */}
        <span role="status" aria-live="polite" className="sr-only">
          {copied ? t("copied") : ""}
        </span>
      </div>

      <pre
        ref={block}
        id={blockId}
        dir="ltr"
        hidden={!open}
        tabIndex={0}
        role="region"
        aria-label={t("region")}
        className="mt-5 max-h-[min(24rem,60vh)] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border bg-background p-4 text-left font-mono text-[13px] leading-6 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
      >
        {agentPrompt}
      </pre>
    </div>
  )
}
