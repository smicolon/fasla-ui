"use client"

import { useTranslations } from "next-intl"

import { useState } from "react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarItem,
  SidebarCollapseButton,
} from "@fasla-ui/blocks/sidebar/Sidebar"
import { ComponentPreview } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const ITEMS = ["dashboard", "orders", "products", "settings"] as const
const PARTS = [
  ["Sidebar", "sidebar"],
  ["SidebarHeader", "header"],
  ["SidebarContent", "content"],
  ["SidebarFooter", "footer"],
  ["SidebarGroup", "group"],
  ["SidebarItem", "item"],
  ["SidebarCollapseButton", "collapseButton"],
] as const

/** A plain square as the item icon; the sidebar keeps it when collapsed. */
function Dot() {
  return <span aria-hidden="true" className="block h-4 w-4 rounded-sm border-2 border-current" />
}

export default function SidebarPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.sidebar")
  const [collapsed, setCollapsed] = useState(false)

  const props: PropRow[] = [
    { prop: "collapsed", type: "boolean", fallback: "false", description: s.rich("props.collapsed", richCode) },
    { prop: "onCollapsedChange", type: "(collapsed) => void", fallback: "", description: s.rich("props.onCollapsedChange", richCode) },
    { prop: "width", type: '"sm" | "default" | "lg"', fallback: '"default"', description: s.rich("props.width", richCode) },
    { prop: "children", type: "ReactNode", fallback: "", description: s.rich("props.children", richCode) },
    { prop: "className", type: "string", fallback: "", description: s.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/sidebar/" /></h1>
        <p className="text-xl text-muted-foreground">{s("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="sidebar" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <div className="flex h-[360px] w-full overflow-hidden rounded-md border">
            <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed}>
              <SidebarHeader>
                {!collapsed && <span className="font-semibold">{s("brand")}</span>}
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup label={collapsed ? undefined : s("group")}>
                  {ITEMS.map((item, i) => (
                    <SidebarItem key={item} icon={<Dot />} active={i === 1} collapsed={collapsed}>
                      {s(`items.${item}`)}
                    </SidebarItem>
                  ))}
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter>
                <SidebarCollapseButton
                  collapsed={collapsed}
                  onCollapsedChange={setCollapsed}
                  aria-label={collapsed ? s("expand") : s("collapse")}
                />
              </SidebarFooter>
            </Sidebar>
            <div className="flex-1 p-6" />
          </div>
        </ComponentPreview>
      </section>

      {/* Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("components")}</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          {PARTS.map(([name, key]) => (
            <li key={name}>
              <code className="text-sm">{name}</code>: {s(`parts.${key}`)}
            </li>
          ))}
        </ul>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <PropsTable rows={props} />
      </section>
    </div>
  )
}
