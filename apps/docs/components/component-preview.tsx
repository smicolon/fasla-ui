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
      <pre className="overflow-x-auto rounded-lg border bg-muted p-4">
        <code className="text-sm">{children}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute right-4 top-4 rounded-md border bg-background px-2 py-1 text-xs hover:bg-accent"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  )
}
