import * as React from "react"

/**
 * A command, verb or file name in running text, for next-intl's `rich()`.
 * Visibly code: Geist Mono alone barely changes short words such as `add`,
 * so it takes the same muted pill globals.css gives inline code in prose. A
 * long command that wraps keeps the padding on each line.
 */
export const inlineCode = {
  code: (chunks: React.ReactNode) => (
    <code className="rounded-md bg-muted px-1.5 [box-decoration-break:clone] [-webkit-box-decoration-break:clone] py-0.5 text-[0.875em] font-medium text-foreground">{chunks}</code>
  ),
}
