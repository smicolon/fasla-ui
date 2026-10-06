"use client"

import Image from "next/image"
import { useLocale } from "next-intl"
import { localeDirection, type Locale } from "@/i18n/routing"

/**
 * The drawn Fasla lockup, never re-set type (§11). It leads the reading
 * direction, so Arabic gets its own RTL drawing; the wordmark is ink on light
 * and white on dark (§08). The alt is the brand name in the page's language.
 */
export function Lockup({ height }: { height: 28 | 30 }) {
  const rtl = localeDirection[useLocale() as Locale] === "rtl"
  const file = rtl ? "rtl" : "ltr"
  const alt = rtl ? "فاصلة" : "Fasla"
  // The lockup is 93 × 30; keep its ratio at either height.
  const width = Math.round((height * 93) / 30)
  const size = { width, height, style: { height, width: "auto" } }

  return (
    <>
      <Image src={`/brand/fasla-lockup-${file}.svg`} alt={alt} priority className="dark:hidden" {...size} />
      <Image src={`/brand/fasla-lockup-${file}-onDark.svg`} alt={alt} priority className="hidden dark:block" {...size} />
    </>
  )
}
