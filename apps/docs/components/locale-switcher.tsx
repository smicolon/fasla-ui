"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { locales, type Locale } from "@/i18n/routing"

/**
 * Labelled in the language it switches TO, the way baianat.com does it — an
 * Arabic reader looks for the word "English", not a flag or a code.
 */
export function LocaleSwitcher() {
  const pathname = usePathname()
  const active = useLocale() as Locale
  const t = useTranslations("nav")

  const other = locales.find((l) => l !== active) ?? active

  // Swap only the locale segment so the reader stays on the same page.
  const segments = pathname.split("/")
  if (locales.includes(segments[1] as Locale)) {
    segments[1] = other
  } else {
    segments.splice(1, 0, other)
  }
  const href = segments.join("/") || `/${other}`

  return (
    <Link
      href={href}
      lang={other}
      hrefLang={other}
      aria-label={t("switchLanguage")}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18a15 15 0 010-18z" />
      </svg>
      {/* The label is the other language's own name, in its own script. */}
      <span className={other === "ar" ? "font-arabic" : undefined}>
        {other === "ar" ? "العربية" : "English"}
      </span>
    </Link>
  )
}
