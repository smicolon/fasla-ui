import Link from "next/link"
import { GeistSans } from "geist/font/sans"
import { defaultLocale, localeDirection } from "@/i18n/routing"

// The root 404.html, for missing paths outside /en/ and /ar/. Those two
// folders get their own localised 404.html (app/[locale]/404/page.tsx), which
// Cloudflare Pages prefers because it is closer to the requested path. This
// one takes the default locale.
export default function NotFound() {
  return (
    <html lang={defaultLocale} dir={localeDirection[defaultLocale]}>
      <body className={`${GeistSans.variable} font-sans`}>
        <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-6 text-center">
          <h1 className="text-2xl font-semibold">Page not found</h1>
          <p className="text-muted-foreground">
            <Link href="/en/" className="underline underline-offset-4">
              Go to the docs
            </Link>
          </p>
        </main>
      </body>
    </html>
  )
}
