import { defineRouting } from "next-intl/routing"

export const locales = ["en", "ar"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

/** Arabic is the only RTL locale today; keep the decision in one place. */
export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
}

export const routing = defineRouting({
  locales,
  defaultLocale,
  // `output: "export"` means there is no middleware to rewrite a bare path, so
  // every locale carries its prefix and /en is a real route.
  localePrefix: "always",
})
