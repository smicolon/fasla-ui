"use client"

import { useTranslations } from "next-intl"

import { AppShell } from "@fasla-ui/blocks/app-shell/AppShell"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const NAV = ["dashboard", "orders", "settings"] as const

export default function AppShellPage() {
  const t = useTranslations("docs.sections")
  const a = useTranslations("docs.appShell")

  const props: PropRow[] = [
    { prop: "sidebar", type: "ReactNode", fallback: "", description: a.rich("props.sidebar", richCode) },
    { prop: "header", type: "ReactNode", fallback: "", description: a.rich("props.header", richCode) },
    { prop: "children", type: "ReactNode", fallback: "", description: a.rich("props.children", richCode) },
    { prop: "sidebarWidth", type: '"sm" | "md" | "lg"', fallback: '"md"', description: a.rich("props.sidebarWidth", richCode) },
    { prop: "sidebarMobile", type: "boolean", fallback: "false", description: a.rich("props.sidebarMobile", richCode) },
    { prop: "className", type: "string", fallback: "", description: a.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/app-shell/" /></h1>
        <p className="text-xl text-muted-foreground">{a("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="app-shell" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <div className="h-[400px] w-full overflow-hidden rounded-md border">
            <AppShell
              sidebar={
                <div className="flex h-full flex-col">
                  <div className="flex h-14 items-center border-b px-4">
                    <span className="font-semibold">{a("brand")}</span>
                  </div>
                  <nav className="flex-1 space-y-1 p-2">
                    {NAV.map((item) => (
                      <a key={item} href="#" className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-accent">
                        {a(`nav.${item}`)}
                      </a>
                    ))}
                  </nav>
                </div>
              }
              header={
                <div className="flex h-14 items-center px-4">
                  <span className="text-sm text-muted-foreground">{a("welcome")}</span>
                </div>
              }
            >
              <h2 className="text-xl font-bold">{a("content.title")}</h2>
              <p className="mt-2 text-muted-foreground">{a("content.body")}</p>
            </AppShell>
          </div>
        </ComponentPreview>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <PropsTable rows={props} />
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
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
      </section>
    </div>
  )
}
