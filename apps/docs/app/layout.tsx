import "./globals.css"

// <html> and <body> are rendered by app/[locale]/layout.tsx, the only layout
// that knows which locale is rendering, so lang and dir sit on the document
// element where screen readers, translation and the scrollbar read them.
// This root layout only passes children through; app/page.tsx is a redirect
// and renders nothing of its own.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
