import { DocsSidebar } from "@/components/docs-sidebar"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container flex-1 items-start pt-20 md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
      <DocsSidebar />
      <main className="relative py-6 lg:py-8">
        <div className="mx-auto w-full min-w-0 max-w-3xl">
          {children}
        </div>
      </main>
    </div>
  )
}
