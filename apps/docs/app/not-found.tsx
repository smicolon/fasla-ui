import Link from "next/link"
import { Cairo } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import { defaultLocale, localeDirection } from "@/i18n/routing"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
})

// A static host serves this one 404.html for every unknown path, whatever
// locale it was under, so the page cannot follow the locale. It takes the
// default locale's lang and dir, and the Arabic copy carries its own.
export default function NotFound() {
  return (
    <html lang={defaultLocale} dir={localeDirection[defaultLocale]}>
      <body className={`${GeistSans.variable} ${cairo.variable} font-sans`}>
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Page not found</h1>
            <p className="text-muted-foreground">
              <Link href="/en/" className="underline underline-offset-4">
                Go to the English docs
              </Link>
            </p>
          </div>
          <div lang="ar" dir="rtl" className="space-y-2 font-arabic">
            <h2 className="text-2xl font-semibold">الصفحة غير موجودة</h2>
            <p className="text-muted-foreground">
              <Link href="/ar/" className="underline underline-offset-4">
                انتقل إلى التوثيق العربي
              </Link>
            </p>
          </div>
        </main>
      </body>
    </html>
  )
}
