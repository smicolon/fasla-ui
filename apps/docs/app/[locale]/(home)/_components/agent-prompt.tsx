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

/** The id of the section under the CLI band: the hero's failure message links to it. */
export const AGENT_PROMPT_ID = "agent-prompt"

/**
 * The copy state both places share: copy the one prompt, report the status,
 * and let "Copied" lapse after two seconds. A failed copy stays until the next
 * click.
 */
function useCopyPrompt() {
  const [status, setStatus] = useState<CopyStatus>("idle")
  const timer = useRef<unknown>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current as number), [])
  async function copy() {
    timer.current = await copyWithStatus(agentPrompt, { setStatus, previous: timer.current })
  }
  return { status, copy }
}

/**
 * The button, with its status region. Every label sits in one grid cell, so
 * the widest sets the width and a change never moves anything; only the
 * current label is seen or read. The polite region stays mounted.
 */
function CopyPromptButton({ status, onCopy, className }: { status: CopyStatus; onCopy: () => void; className?: string }) {
  const t = useTranslations("landing.final.agent")
  const copied = status === "copied"
  const shown = copied ? "copied" : "idle"
  const labels = [
    { key: "idle" as const, text: t("copy") },
    { key: "copied" as const, text: t("copied") },
  ]
  return (
    <>
      <Button type="button" variant="outline" size="lg" onClick={onCopy} className={className}>
        {copied ? checkIcon : copyIcon}
        <span className="grid">
          {labels.map(({ key, text }) => (
            <span key={key} aria-hidden={key === shown ? undefined : true} className={`col-start-1 row-start-1 ${key === shown ? "" : "invisible"}`}>
              {text}
            </span>
          ))}
        </span>
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? t("copied") : ""}
      </span>
    </>
  )
}

/**
 * The hero's version: the button alone, after a small "or". A refused copy shows one line under
 * it, out of flow so the hero does not move, pointing to the full prompt
 * under the CLI band, where the text can be selected.
 */
export function AgentPromptCompact({ className }: { className?: string }) {
  const t = useTranslations("landing.final.agent")
  const { status, copy } = useCopyPrompt()
  return (
    <div className={`relative flex flex-col items-center ${className ?? ""}`}>
      {/* A plain word between the two ways in, read in order; no role, no landmark. */}
      <span className="bg-background px-2 pb-2 text-sm leading-5 text-muted-foreground rtl:leading-6">{t("or")}</span>
      <CopyPromptButton
        status={status}
        onCopy={copy}
        className="h-12 min-h-11 rounded-[10px] border-foreground/15 bg-background px-[22px] text-[15px] max-[560px]:w-full"
      />
      <p role="status" className="absolute inset-x-0 top-full mt-2 text-balance text-sm leading-6 text-foreground rtl:leading-[1.7]">
        {status === "failed" && (
          <>
            {t("failedHero")}{" "}
            <a href={`#${AGENT_PROMPT_ID}`} className="font-medium underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              {t("failedHeroLink")}
            </a>
          </>
        )}
      </p>
    </div>
  )
}

/**
 * Under the install command: a button that copies a ready-made prompt for an
 * coding agent, and the prompt itself in a read-only block, closed until
 * asked for, so a visitor can read what they copy.
 *
 * The page's text is the locale's; the prompt is English in both, so the block
 * is `dir="ltr"` inside an RTL page. The button keeps one width across its
 * labels; a failed copy swaps the helper line
 * for the instruction, so nothing moves.
 */
export function AgentPrompt() {
  const t = useTranslations("landing.final.agent")
  const { status, copy } = useCopyPrompt()
  const [open, setOpen] = useState(false)
  const block = useRef<HTMLPreElement>(null)
  const blockId = useId()

  // The hero's failure message links here: arrive with the prompt open.
  useEffect(() => {
    const openIfLinked = () => {
      if (window.location.hash === `#${AGENT_PROMPT_ID}`) setOpen(true)
    }
    openIfLinked()
    window.addEventListener("hashchange", openIfLinked)
    return () => window.removeEventListener("hashchange", openIfLinked)
  }, [])

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

  return (
    <div id={AGENT_PROMPT_ID} className="scroll-mt-24 mt-[clamp(32px,5vw,56px)] border-t border-border pt-[clamp(28px,4vw,44px)]">
      <h3 className="text-balance text-[19px] font-semibold leading-snug tracking-[-0.01em] rtl:leading-[1.6]">{t("heading")}</h3>
      <p
        role="status"
        className={`mt-2 max-w-[60ch] text-pretty text-[17px] rtl:leading-[1.8] ${status === "failed" ? "font-medium text-foreground" : "text-[color:var(--l-fg-2)]"}`}
      >
        {status === "failed" ? t("failed") : t("helper")}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <CopyPromptButton status={status} onCopy={copy} className="h-12 min-h-11 rounded-[10px] bg-transparent px-[22px] text-[15px] max-[560px]:w-full" />
        <button
          type="button"
          aria-expanded={open}
          aria-controls={blockId}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex min-h-11 items-center rounded-[10px] px-2 text-[15px] font-medium underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted max-[560px]:w-full max-[560px]:justify-center"
        >
          {open ? t("hide") : t("show")}
        </button>
      </div>

      <pre
        ref={block}
        id={blockId}
        dir="ltr"
        hidden={!open}
        tabIndex={0}
        role="region"
        aria-label={t("region")}
        className="mt-5 max-h-[min(24rem,60vh)] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border bg-background p-4 text-left font-mono text-[13px] leading-[1.65] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
      >
        {agentPrompt}
      </pre>
    </div>
  )
}
