import { metadataForRoute } from "@/lib/seo-routes"
import type { Locale } from "@/i18n/routing"
import "./landing.css"

/** The home page's title and description in the page's language. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return metadataForRoute("/", locale as Locale)
}

/** Loads the landing page's stylesheet; adds no markup. */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children
}
