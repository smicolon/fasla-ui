"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"

import { CodeBlock } from "@/components/component-preview"

/**
 * The install step every component page shows. `@smicolon/cli` is the only
 * working installer: `fasla-ui` is not a package on npm, and the `fasla-ui`
 * binary inside `@smicolon/fasla-ui` is a repo-only scaffold. `add` needs the
 * components.json that `init` writes, so the note points to Installation.
 */
export function InstallCommand({ name }: { name: string }) {
  const t = useTranslations("docs")
  const locale = useLocale()

  return (
    <div className="space-y-3">
      <CodeBlock language="bash">{`npx @smicolon/cli add ${name}`}</CodeBlock>
      <p className="text-sm text-muted-foreground">
        {t.rich("installNote", {
          code: (chunks) => <code className="font-mono text-foreground">{chunks}</code>,
          link: (chunks) => (
            <Link
              href={`/${locale}/docs/installation/`}
              className="font-medium text-foreground underline underline-offset-4"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
    </div>
  )
}
