import { DocsSidebar } from "@/components/docs-sidebar"
import { DocsToc } from "@/components/docs-toc"
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
  // direction: the sidebar is the start column (right in Arabic) and the table
  // of contents the end column (left in Arabic). As the screen narrows the
  // gutters shrink first, the contents hide below xl, the sidebar below lg.
  return (
    <div className="site-container flex-1 pt-20">
      <div className="items-start lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <DocsSidebar />
        <div data-docs-content className="min-w-0 py-6 lg:py-8">
          {children}
        </div>
        <DocsToc />
      </div>
    </div>
  )
}
