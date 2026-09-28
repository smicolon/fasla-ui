"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

interface ComponentPreviewProps {
  children: React.ReactNode
  className?: string
}

export function ComponentPreview({ children, className }: ComponentPreviewProps) {
  return (
    // A live demo: its headings belong to the component, not the page, so the
    // table of contents skips them.
    <div data-toc-ignore className={`relative rounded-lg border bg-background p-6 ${className || ""}`}>
      <div className="flex items-center justify-center">{children}</div>
    </div>
  )
}

interface CodeBlockProps {
  children: string
  language?: string
}

/** A run of Arabic letters, with the spaces and Arabic comma between its words. */
const ARABIC_RUN = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]+(?:[ ،]+[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]+)*/g

/**
 * Arabic inside LTR code (a comment, a label value) needs two things the code
 * font cannot give it. Isolation: without it a closing quote after Arabic is
 * reordered next to the opening one. And an Arabic face: Geist Mono has no
 * Arabic, so the fallback sets every letter in a fixed-width cell and breaks the
 * joins. Each run is wrapped in <bdi> set in Cairo. A `//` comment containing
 * Arabic is isolated whole, as one RTL sentence, so a Latin word inside it
 * (`name`) keeps its place in the sentence. Only the rendering changes; the
 * copied text is the plain string.
 */
function renderCode(source: string): React.ReactNode {
  ARABIC_RUN.lastIndex = 0
  if (!ARABIC_RUN.test(source)) return source

  return source.split("\n").map((line, index, lines) => {
    const end = index < lines.length - 1 ? "\n" : ""
    const comment = line.match(/^(\s*\/\/\s?)(.*)$/)
    ARABIC_RUN.lastIndex = 0
    if (comment && ARABIC_RUN.test(comment[2])) {
      return (
        <React.Fragment key={index}>
          {comment[1]}
          <bdi dir="rtl" className="font-arabic">
            {comment[2]}
          </bdi>
          {end}
        </React.Fragment>
      )
    }

    const parts: React.ReactNode[] = []
    let last = 0
    for (const match of line.matchAll(ARABIC_RUN)) {
      const start = match.index ?? 0
      if (start > last) parts.push(line.slice(last, start))
      parts.push(
        <bdi key={start} className="font-arabic">
          {match[0]}
        </bdi>
      )
      last = start + match[0].length
    }
    parts.push(line.slice(last) + end)
    return <React.Fragment key={index}>{parts}</React.Fragment>
  })
}

export function CodeBlock({ children, language = "tsx" }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const t = useTranslations("docs")

  const copy = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    // Code reads left to right in both directions, so the block keeps its own
    // LTR order in Arabic; otherwise the copy button lands on top of the code.
    <div dir="ltr" className="relative">
      <div className="rounded-lg bg-terminal border border-terminal-border overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-2 bg-foreground/[0.04] border-b border-terminal-border">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-terminal-muted ms-2">{language}</span>
        </div>
        <pre className="overflow-x-auto p-4">
          <code className="text-sm text-green-400 font-mono">{renderCode(children)}</code>
        </pre>
      </div>
      <button
        onClick={copy}
        className="absolute end-4 top-12 rounded-md bg-foreground/10 px-2 py-1 text-xs text-terminal-foreground hover:bg-foreground/20 transition-colors"
      >
        {copied ? t("copied") : t("copyCode")}
      </button>
    </div>
  )
}
