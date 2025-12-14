"use client"

import * as React from "react"

interface ComponentPreviewProps {
  children: React.ReactNode
  className?: string
}

export function ComponentPreview({ children, className }: ComponentPreviewProps) {
  return (
    <div className={`relative rounded-lg border bg-background p-6 ${className || ""}`}>
      <div className="flex items-center justify-center">{children}</div>
    </div>
  )
}

interface CodeBlockProps {
  children: string
  language?: string
}

export function CodeBlock({ children, language = "tsx" }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  const copy = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <div className="rounded-lg bg-[#0a0a0a] border border-white/10 overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-white/40 ml-2">{language}</span>
        </div>
        <pre className="overflow-x-auto p-4">
          <code className="text-sm text-green-400 font-mono">{children}</code>
        </pre>
      </div>
      <button
        onClick={copy}
        className="absolute right-4 top-12 rounded-md bg-white/10 px-2 py-1 text-xs text-white/70 hover:bg-white/20 transition-colors"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  )
}
