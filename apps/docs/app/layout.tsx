import "./globals.css"

// <html> and <body> are rendered by app/[locale]/layout.tsx, the only layout
// that knows which locale is rendering, so lang and dir sit on the document
// element where screen readers, translation and the scrollbar read them.
// This root layout only passes children through. The two pages outside
// [locale], app/page.tsx (the redirect) and app/not-found.tsx, each render
// their own <html> for the same reason.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
