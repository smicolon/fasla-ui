"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@fasla-ui/ui/button/button"
import { ArrowEndIcon } from "./icons"
import { installCommand, landingLinks } from "./links"

/**
 * The page's last word: the install command, set large with a blinking caret,
 * one line on what it does, Get started, and a button that copies it. The
 * command is code, so it reads left to right in both languages and sits on
 * the start side of the page.
 */
export function CommandBand() {
  const locale = useLocale()
  const t = useTranslations("landing")
  const tc = useTranslations("copyCommand")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timer)
  }, [copied])

  /** Copies the install command and shows the copied state; a refused clipboard leaves the text to select. */
  async function copy() {
    try {
      await navigator.clipboard.writeText(installCommand)
      setCopied(true)
    } catch {
      // Clipboard refused: the command is on screen to select; say nothing rather than claim a copy.
    }
  }

  return (
    <section aria-labelledby="final-h" className="pb-[var(--l-section)]">
      <div className="l-wrap">
        <div className="rounded-2xl bg-muted px-[clamp(20px,6vw,88px)] py-[clamp(32px,6vw,88px)]">
          <h2
            id="final-h"
            dir="ltr"
            className="whitespace-nowrap text-left font-mono text-[length:clamp(19px,4.9vw,66px)] font-medium leading-[1.15] tracking-[-0.03em] rtl:!text-right"
          >
            <span className="text-muted-foreground">$ </span>
            {installCommand}
            <span aria-hidden="true" className="caret ms-px inline-block h-[.95em] w-[.55em] bg-foreground align-[-0.1em]" />
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-x-7 gap-y-5">
            <p className="max-w-[52ch] text-[17px] text-[color:var(--l-fg-2)] rtl:leading-[1.8]">{t("final.lede")}</p>
            <div className="flex gap-2.5 max-[760px]:w-full">
              <Button asChild size="lg" className="h-12 rounded-[10px] px-[22px] text-[15px] max-[760px]:flex-1">
                <Link href={landingLinks.docs(locale)}>
                  {t("cta.start")}
                  <ArrowEndIcon />
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={copy}
                aria-label={copied ? tc("copied") : tc("copy", { command: installCommand })}
                className="size-12 rounded-[10px] bg-transparent"
              >
                {copied ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-fasla-red">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="8" y="8" width="12" height="12" rx="2" />
                    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                  </svg>
                )}
              </Button>
              <span role="status" aria-live="polite" className="sr-only">
                {copied ? tc("status") : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
