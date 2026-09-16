import { metadataForRoute } from "@/lib/seo-routes"
import type { Locale } from "@/i18n/routing"

export { default } from "@/components/route-layout"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return metadataForRoute("/docs/components/border-beam/", locale as Locale)
}
