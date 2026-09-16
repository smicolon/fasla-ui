import { metadataForRoute } from "@/lib/seo-routes"
import type { Locale } from "@/i18n/routing"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return metadataForRoute("/", locale as Locale)
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children
}
