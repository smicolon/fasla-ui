import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { Cairo } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { locales, localeDirection, type Locale } from "@/i18n/routing"

// Brand V2.5 §14 — the Arabic face. Geist carries no Arabic glyphs, so Arabic
// surfaces are set in Cairo. Loaded only for the locales that need it.
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
})

/** Static export: every locale is prerendered, there is no middleware. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()
  const dir = localeDirection[locale as Locale]

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div
        dir={dir}
        lang={locale}
        className={`${cairo.variable} relative flex min-h-screen flex-col ${
          dir === "rtl" ? "font-arabic" : ""
        }`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </div>
    </NextIntlClientProvider>
  )
}
