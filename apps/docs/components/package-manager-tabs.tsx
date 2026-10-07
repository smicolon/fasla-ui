"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { installCommand, nextTabIndex, PACKAGE_MANAGERS, runCommand, type PackageManager } from "@/lib/package-managers"

const STORAGE_KEY = "fasla-package-manager"
const CHANGE_EVENT = "fasla-package-manager-change"

/** The package manager picked earlier on this site, if storage allows reading it. */
function readChoice(): PackageManager | undefined {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return PACKAGE_MANAGERS.find((pm) => pm === saved)
  } catch {
    // Storage blocked (private window, previews): npm, and no memory.
    return undefined
  }
}

/**
 * One install command with a tab for each package manager, in place of four
 * stacked blocks. The choice is remembered and shared, so picking pnpm once
 * switches every block on every page.
 *
 * The tab row follows the page: right to left in Arabic, with npm first on
 * the right and the arrow keys moving the way the tabs are laid out. The
 * command itself is code and stays left to right in both.
 */
export function PackageManagerTabs(props: { packages: string } | { run: string }) {
  const t = useTranslations("docs")
  const id = React.useId()
  const [pm, setPm] = React.useState<PackageManager>("npm")
  const [copied, setCopied] = React.useState(false)
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([])

  // Read the saved choice after hydration, so the static HTML (npm) and the
  // first client render agree; then follow changes made in other blocks.
  React.useEffect(() => {
    const sync = () => setPm(readChoice() ?? "npm")
    sync()
    window.addEventListener(CHANGE_EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const choose = (next: PackageManager) => {
    setPm(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Not remembered, but this block still switches.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    // The tab list's direction, not the tab's: globals.css sets every
    // .font-mono to LTR inside an Arabic page, so the tab itself always says
    // "ltr" while the row it sits in runs right to left.
    const row = event.currentTarget.closest('[role="tablist"]') ?? event.currentTarget
    const rtl = getComputedStyle(row).direction === "rtl"
    const next = nextTabIndex(PACKAGE_MANAGERS.indexOf(pm), event.key, PACKAGE_MANAGERS.length, rtl)
    if (next === undefined) return
    event.preventDefault()
    choose(PACKAGE_MANAGERS[next])
    tabs.current[next]?.focus()
  }

  // `packages` installs them; `run` runs a package's CLI without installing it.
  const command = "run" in props ? runCommand(pm, props.run) : installCommand(pm, props.packages)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
    } catch {
      // Clipboard blocked: the command is still selectable.
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-terminal-border bg-terminal">
      <div className="flex items-center gap-2 border-b border-terminal-border bg-foreground/[0.04] px-2">
        <div role="tablist" aria-label={t("packageManager")} className="flex">
          {PACKAGE_MANAGERS.map((name, index) => {
            const selected = name === pm
            return (
              <button
                key={name}
                ref={(el) => {
                  tabs.current[index] = el
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${name}`}
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => choose(name)}
                onKeyDown={onKeyDown}
                className={cn(
                  "-mb-px border-b-2 px-3 py-2 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fasla-red",
                  selected
                    ? "border-green-400 text-terminal-foreground"
                    : "border-transparent text-terminal-muted hover:text-terminal-foreground"
                )}
              >
                {name}
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={copy}
          className="ms-auto rounded-md bg-foreground/10 px-2 py-0.5 text-xs text-terminal-foreground transition-colors hover:bg-foreground/20"
        >
          {copied ? t("copied") : t("copyCode")}
        </button>
      </div>
      {/* Focusable, as the tabs pattern asks when a panel holds nothing that is. */}
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${pm}`}
        tabIndex={0}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fasla-red"
      >
        <pre dir="ltr" className="overflow-x-auto p-4">
          <code className="font-mono text-sm text-green-400">{command}</code>
        </pre>
      </div>
    </div>
  )
}
