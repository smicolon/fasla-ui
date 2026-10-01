import { defaultLocale, localeDirection } from "@/i18n/routing"

// `output: "export"` rules out middleware, so the bare path is a real page that
// sends the visitor to the default locale. It renders its own document rather
// than calling redirect(), which exports a page with no lang or dir.
export default function RootPage() {
  const target = `/${defaultLocale}/`

  return (
    <html lang={defaultLocale} dir={localeDirection[defaultLocale]}>
      <head>
        <meta httpEquiv="refresh" content={`0;url=${target}`} />
      </head>
      <body>
        <a href={target}>Continue to the docs</a>
      </body>
    </html>
  )
}
