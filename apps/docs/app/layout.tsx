import type { Metadata } from "next"
import { Nunito, Sora } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import "./globals.css"

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
})

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
})

export const metadata: Metadata = {
  title: {
    default: "SMI-UI | Smicolon UI Library",
    template: "%s | SMI-UI",
  },
  description: "A beautiful, animated component library by Smicolon. Built with React, Tailwind CSS, and Framer Motion.",
  keywords: ["React", "Tailwind CSS", "Components", "UI Library", "Framer Motion", "Smicolon", "Animation"],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "SMI-UI | Smicolon UI Library",
    description: "A beautiful, animated component library by Smicolon. Built with React, Tailwind CSS, and Framer Motion.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} ${sora.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col bg-noisy">
            <SiteHeader />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
