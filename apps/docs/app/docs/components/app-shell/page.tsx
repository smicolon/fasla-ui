"use client"

import { AppShell } from "../../../../../../packages/fasla-ui/registry/blocks/app-shell/AppShell"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

const SidebarContent = () => (
  <div className="flex h-full flex-col">
    <div className="flex h-14 items-center border-b px-4">
      <span className="font-semibold">App</span>
    </div>
    <nav className="flex-1 space-y-1 p-2">
      {["Dashboard", "Projects", "Settings"].map((item) => (
        <a key={item} href="#" className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-accent">
          {item}
        </a>
      ))}
    </nav>
  </div>
)

const HeaderContent = () => (
  <div className="flex h-14 items-center px-4">
    <span className="text-sm text-muted-foreground">Welcome!</span>
  </div>
)

export default function AppShellPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-[980px]">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">AppShell</h1>
          <p className="text-lg text-muted-foreground">
            Application layout with sidebar, header, and content areas.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Installation</h2>
            <div className="mt-4">
              <CodeBlock>npx fasla-ui add app-shell</CodeBlock>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Preview</h2>
            <div className="mt-4">
              <ComponentPreview>
                <div className="h-[400px] overflow-hidden rounded-md border">
                  <AppShell
                    sidebar={<SidebarContent />}
                    header={<HeaderContent />}
                  >
                    <h2 className="text-xl font-bold">Dashboard</h2>
                    <p className="mt-2 text-muted-foreground">Main content area</p>
                  </AppShell>
                </div>
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Usage</h2>
            <div className="mt-4">
              <CodeBlock>{`import { AppShell } from "@/components/blocks/app-shell"

export function Layout() {
  return (
    <AppShell
      sidebar={<Sidebar />}
      header={<Header />}
      sidebarWidth="md"
    >
      {children}
    </AppShell>
  )
}`}</CodeBlock>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Props</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left font-semibold">Prop</th>
                    <th className="px-4 py-2 text-left font-semibold">Type</th>
                    <th className="px-4 py-2 text-left font-semibold">Default</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">sidebar</td>
                    <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                    <td className="px-4 py-2 font-mono text-xs">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">header</td>
                    <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                    <td className="px-4 py-2 font-mono text-xs">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">sidebarWidth</td>
                    <td className="px-4 py-2 font-mono text-xs">sm | md | lg</td>
                    <td className="px-4 py-2 font-mono text-xs">md</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
