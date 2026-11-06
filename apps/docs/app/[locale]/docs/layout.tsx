import { SiteHeader } from "@/components/site-header"
import { DocsShell } from "@/components/docs-shell"
import { metadataForRoute } from "@/lib/seo-routes"
import type { Locale } from "@/i18n/routing"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return metadataForRoute("/docs/", locale as Locale)
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <DocsShell>{children}</DocsShell>
    </>
  )
}
