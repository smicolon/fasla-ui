// Brand V2.5 §14 — docs are product tier: Geist and Geist Mono, never Gilroy.
// Geist is not in next/font/google on Next 14, so it comes from the official package.
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

// lang and dir are set per locale in app/[locale]/layout.tsx, which is the only
// place that knows which locale is rendering.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>{children}</body>
    </html>
  )
}
