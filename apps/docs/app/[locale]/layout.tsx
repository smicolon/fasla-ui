import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { Cairo } from "next/font/google"
// Brand V2.5 §14 — docs are product tier: Geist and Geist Mono, never Gilroy.
// Geist is not in next/font/google on Next 14, so it comes from the official package.
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
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
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} ${cairo.variable} font-sans`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {/* body sets font-sans, so Arabic re-sets its face here (§14). */}
          <div className={`relative flex min-h-screen flex-col ${dir === "rtl" ? "font-arabic" : ""}`}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <SiteHeader />
              <main className="flex-1">{children}</main>
            </ThemeProvider>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
