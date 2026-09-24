import { DocsSidebar } from "@/components/docs-sidebar"
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
  // One centred wrapper at the homepage's width, so the gutters split evenly
  // and the docs line up with the homepage. The grid follows the document
  // direction: the sidebar is the start column, on the right in Arabic.
  return (
    <div className="site-container flex-1 pt-20">
      <div className="items-start lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <DocsSidebar />
        <div data-docs-content className="min-w-0 py-6 lg:py-8">
          {children}
        </div>
      </div>
    </div>
  )
}
